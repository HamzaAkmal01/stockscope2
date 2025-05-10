const axios = require('axios');

const getMarketOverview = async () => {
    try {
        // Fetch data from financial APIs
        const [sp500Data, nasdaqData, dowJonesData] = await Promise.all([
            fetchIndexData('^GSPC'), // S&P 500
            fetchIndexData('^IXIC'), // NASDAQ
            fetchIndexData('^DJI')   // Dow Jones
        ]);

        // Get trending topics (you can replace this with a real news API)
        const trendingTopics = await getTrendingTopics();

        return {
            overview: {
                sp500: {
                    value: sp500Data.price,
                    change: sp500Data.change
                },
                nasdaq: {
                    value: nasdaqData.price,
                    change: nasdaqData.change
                },
                dowJones: {
                    value: dowJonesData.price,
                    change: dowJonesData.change
                }
            },
            topics: trendingTopics
        };
    } catch (error) {
        console.error('Error in getMarketOverview:', error);
        throw error;
    }
};

const fetchIndexData = async (symbol) => {
    try {
        // Replace with your preferred financial data API
        // This is a placeholder using Yahoo Finance API
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        const data = response.data.chart.result[0];
        const quote = data.meta;
        
        return {
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent
        };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        throw error;
    }
};

const getTrendingTopics = async () => {
    // This is a placeholder. Replace with real news API integration
    return [
        { id: 1, title: 'Tech Sector Rally', color: 'purple' },
        { id: 2, title: 'Federal Reserve Meeting', color: 'blue' },
        { id: 3, title: 'Crypto Market Update', color: 'pink' }
    ];
};

module.exports = {
    getMarketOverview
}; 