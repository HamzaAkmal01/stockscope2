const marketService = require('../services/marketService');

const getMarketOverview = async (req, res) => {
    try {
        const overview = await marketService.getMarketOverview();
        res.json(overview);
    } catch (error) {
        console.error('Error fetching market overview:', error);
        res.status(500).json({ 
            error: 'Failed to fetch market overview',
            details: error.message 
        });
    }
};

module.exports = {
    getMarketOverview
}; 