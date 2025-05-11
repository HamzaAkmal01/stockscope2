const express = require('express');
const router = express.Router();
const { User, Portfolio, Stock } = require('../models');

// Get user details and portfolio
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user details
    const user = await User.findByPk(userId, {
      attributes: ['UserID', 'Username', 'Email', 'FullName', 'AccountType', 'JoinDate', 'WalletBalance']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get portfolio data with stock details
    const portfolio = await Portfolio.findAll({
      where: { UserID: userId },
      include: [{
        model: Stock,
        attributes: ['StockName', 'TickerSymbol', 'CurrentPrice']
      }],
      attributes: [
        'PortfolioID',
        'StockID',
        'Quantity',
        'AveragePrice'
      ]
    });

    // Calculate additional portfolio metrics
    const portfolioWithMetrics = portfolio.map(item => ({
      PortfolioID: item.PortfolioID,
      StockID: item.StockID,
      StockName: item.Stock.StockName,
      Symbol: item.Stock.TickerSymbol,
      Quantity: item.Quantity,
      AveragePrice: item.AveragePrice,
      CurrentPrice: item.Stock.CurrentPrice,
      TotalValue: item.Quantity * item.Stock.CurrentPrice,
      ProfitLoss: (item.Stock.CurrentPrice - item.AveragePrice) * item.Quantity,
      ProfitLossPercentage: ((item.Stock.CurrentPrice - item.AveragePrice) / item.AveragePrice) * 100
    }));

    res.json({
      userDetails: user,
      portfolio: portfolioWithMetrics
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio data' });
  }
});

module.exports = router; 