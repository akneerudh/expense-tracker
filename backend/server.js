const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database sync
sequelize.sync({ alter: true })
  .then(() => console.log("SQLite synced!"))
  .catch(err => console.error("Database error:", err));

app.use('/api/expenses', require('./routes/expensesSQLite'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/savings', require('./routes/savings'));

// Process recurring expenses on startup
require('./routes/recurring').post('/process/execute');

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});