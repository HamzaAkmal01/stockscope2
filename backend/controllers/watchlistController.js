const Wishlist = require('../models/wishlist');
const Stock = require('../models/Stock');

// Add a stock to the user's watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { userId, stockId } = req.body;
    if (!userId || !stockId) {
      return res.status(400).json({ error: 'userId and stockId are required' });
    }
    // Prevent duplicates
    const exists = await Wishlist.findOne({ where: { User_ID: userId, Stock_ID: stockId } });
    if (exists) {
      return res.status(409).json({ error: 'Stock already in watchlist' });
    }
    const entry = await Wishlist.create({ User_ID: userId, Stock_ID: stockId });
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

// Get all stocks in a user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const wishlist = await Wishlist.findAll({
      where: { User_ID: userId },
      include: [{ model: Stock, as: 'Stock' }]
    });
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
}; 