const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const userRoutes = require('./routes/router');
require('./models/models')(sequelize);

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000; // Match api.js port

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

module.exports = app;