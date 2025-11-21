const express = require('express');
const router = express.Router();
const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/ExpenseSQLite');

// Get all recurring expenses
router.get('/', async (req, res) => {
  try {
    const recurring = await RecurringExpense.findAll();
    res.json(recurring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create recurring expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, interval } = req.body;
    const recurring = await RecurringExpense.create({
      description,
      amount,
      category,
      interval,
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update recurring expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recurring = await RecurringExpense.findByPk(id);
    if (!recurring) return res.status(404).json({ error: 'Not found' });
    
    await recurring.update(req.body);
    res.json(recurring);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete recurring expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recurring = await RecurringExpense.findByPk(id);
    if (!recurring) return res.status(404).json({ error: 'Not found' });
    
    await recurring.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const recurring = await RecurringExpense.findByPk(id);
    if (!recurring) return res.status(404).json({ error: 'Not found' });
    
    recurring.isActive = !recurring.isActive;
    await recurring.save();
    res.json(recurring);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Process recurring expenses (create new expenses if needed)
router.post('/process/execute', async (req, res) => {
  try {
    const recurring = await RecurringExpense.findAll({ where: { isActive: true } });
    const now = new Date();
    let created = 0;

    for (const rec of recurring) {
      const lastExecuted = new Date(rec.lastExecuted);
      let shouldExecute = false;

      if (rec.interval === 'daily') {
        shouldExecute = lastExecuted.getDate() !== now.getDate();
      } else if (rec.interval === 'weekly') {
        const days = Math.floor((now - lastExecuted) / (1000 * 60 * 60 * 24));
        shouldExecute = days >= 7;
      } else if (rec.interval === 'monthly') {
        shouldExecute = lastExecuted.getMonth() !== now.getMonth();
      }

      if (shouldExecute) {
        await Expense.create({
          description: rec.description,
          amount: rec.amount,
          category: rec.category,
          date: now,
        });
        rec.lastExecuted = now;
        await rec.save();
        created++;
      }
    }

    res.json({ message: `Created ${created} expenses from recurring` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
