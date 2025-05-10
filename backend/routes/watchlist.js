const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// Add to watchlist
router.post('/', watchlistController.addToWatchlist);
// Get user's watchlist
router.get('/', watchlistController.getWatchlist);

module.exports = router; 