const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const watchlistRoutes = require('./routes/watchlist');
const portfolioRoutes = require('./routes/portfolio');
const newsRoutes = require('./routes/news');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/news', newsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 