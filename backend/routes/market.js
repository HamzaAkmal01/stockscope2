const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Get market overview including indices and trending topics
router.get('/overview', marketController.getMarketOverview);

module.exports = router; 