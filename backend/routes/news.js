const express = require('express');
const router = express.Router();
const { MarketNews } = require('../models');

// Get all market news
router.get('/', async (req, res) => {
  try {
    const news = await MarketNews.findAll({
      order: [['PublishedDate', 'DESC']],
      limit: 20, // Limit to 20 most recent news items
      attributes: [
        'NewsID',
        'Title',
        'Content',
        'Source',
        'PublishedDate',
        'Category',
        'Sentiment',
        'ImpactLevel'
      ]
    });

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching market news' });
  }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const news = await MarketNews.findAll({
      where: { Category: category },
      order: [['PublishedDate', 'DESC']],
      limit: 10,
      attributes: [
        'NewsID',
        'Title',
        'Content',
        'Source',
        'PublishedDate',
        'Category',
        'Sentiment',
        'ImpactLevel'
      ]
    });

    res.json(news);
  } catch (error) {
    console.error('Error fetching news by category:', error);
    res.status(500).json({ message: 'Error fetching market news' });
  }
});

module.exports = router; 