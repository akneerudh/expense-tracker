const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavingsGoal = sequelize.define('SavingsGoal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'savings_goals',
  timestamps: true,
});

module.exports = SavingsGoal;
