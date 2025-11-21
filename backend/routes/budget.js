const router = require('express').Router();
const Budget = require('../models/Budget');
const Expense = require('../models/ExpenseSQLite');
const { Op } = require('sequelize');

// Get current month and year
function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

// @route GET /api/budget/current - Get current month budget and spending
router.get('/current', async (req, res) => {
  try {
    const { month, year } = getCurrentMonthYear();
    
    // Get budget
    let budget = await Budget.findOne({
      where: { month, year }
    });

    // Get total spent this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalSpent = await Expense.sum('amount', {
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    res.json({
      budget: budget?.amount || 0,
      spent: totalSpent || 0,
      remaining: (budget?.amount || 0) - (totalSpent || 0),
      month,
      year
    });
  } catch (err) {
    console.error('Error getting budget:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route GET /api/budget/:month/:year - Get budget for specific month
router.get('/:month/:year', async (req, res) => {
  try {
    const { month, year } = req.params;
    
    let budget = await Budget.findOne({
      where: { 
        month: parseInt(month),
        year: parseInt(year)
      }
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalSpent = await Expense.sum('amount', {
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    res.json({
      budget: budget?.amount || 0,
      spent: totalSpent || 0,
      remaining: (budget?.amount || 0) - (totalSpent || 0),
      month: parseInt(month),
      year: parseInt(year)
    });
  } catch (err) {
    console.error('Error getting budget:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route POST /api/budget - Create or update budget
router.post('/', async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    if (!month || !year || !amount) {
      return res.status(400).json('Missing required fields: month, year, amount');
    }

    let budget = await Budget.findOne({
      where: { month, year }
    });

    if (budget) {
      await budget.update({ amount });
      res.json('Budget updated!');
    } else {
      await Budget.create({ month, year, amount });
      res.json('Budget created!');
    }
  } catch (err) {
    console.error('Error setting budget:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route PUT /api/budget/:id - Update budget by ID
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) {
      return res.status(404).json('Budget not found.');
    }

    await budget.update({
      amount: req.body.amount || budget.amount
    });

    res.json('Budget updated!');
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route DELETE /api/budget/:id - Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) {
      return res.status(404).json('Budget not found.');
    }

    await budget.destroy();
    res.json('Budget deleted.');
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
