const sequelize = require('./config/database');
const Expense = require('./models/ExpenseSQLite');

async function viewDatabase() {
  try {
    const expenses = await Expense.findAll({ raw: true });
    console.log('\n=== EXPENSES DATABASE ===\n');
    if (expenses.length === 0) {
      console.log('No expenses yet. Add one from the UI!');
    } else {
      console.table(expenses);
      const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      console.log(`\nTotal: ₹${total.toFixed(2)}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

viewDatabase();
