const router = require('express').Router();
const Expense = require('../models/ExpenseSQLite');
const { Op } = require('sequelize');

// @route GET /api/expenses/total (Aggregation)
router.get('/total', async (req, res) => {
  try {
    const result = await Expense.findAll({
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalAmount']
      ],
      raw: true
    });
    res.json(result[0]?.totalAmount || 0);
  } catch (err) {
    console.error('Error getting total:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route GET /api/expenses/ (Read All)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route POST /api/expenses/ (Create)
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create({
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category
    });
    res.json('Expense added!');
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route PUT /api/expenses/:id (Update)
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json('Expense not found.');
    }
    
    await expense.update({
      description: req.body.description || expense.description,
      amount: req.body.amount || expense.amount,
      category: req.body.category || expense.category,
      date: req.body.date || expense.date
    });
    
    res.json('Expense updated!');
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(400).json('Error: ' + err);
  }
});

// @route DELETE /api/expenses/:id (Delete)
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json('Expense not found.');
    }
    
    await expense.destroy();
    res.json('Expense deleted.');
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
