const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecurringExpense = sequelize.define('RecurringExpense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interval: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
  },
  lastExecuted: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'recurring_expenses',
  timestamps: true,
});

module.exports = RecurringExpense;
