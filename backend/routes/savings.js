const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');

// Get all savings goals
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.findAll();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create savings goal
router.post('/', async (req, res) => {
  try {
    const { title, targetAmount, deadline, priority, category } = req.body;
    const goal = await SavingsGoal.create({
      title,
      targetAmount,
      deadline,
      priority,
      category,
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update savings goal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findByPk(id);
    if (!goal) return res.status(404).json({ error: 'Not found' });
    
    await goal.update(req.body);
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete savings goal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findByPk(id);
    if (!goal) return res.status(404).json({ error: 'Not found' });
    
    await goal.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add to current amount
router.patch('/:id/add-amount', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const goal = await SavingsGoal.findByPk(id);
    if (!goal) return res.status(404).json({ error: 'Not found' });
    
    goal.currentAmount = parseFloat(goal.currentAmount) + parseFloat(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
