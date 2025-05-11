'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { stockAPI } from '@/services/api';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [marketOverview, setMarketOverview] = useState({
    sp500: { value: 0, change: 0 },
    nasdaq: { value: 0, change: 0 },
    dowJones: { value: 0, change: 0 }
  });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState(null);
  const userId = 1; // TODO: Replace with real user ID from auth
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [allTrendsData, setAllTrendsData] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('all');

  useEffect(() => {
    // Authentication check - commented out for now
    // const isAuthenticated = localStorage.getItem('token');
    // if (!isAuthenticated) {
    //   router.push('/login');
    // }
  }, [router]);

  useEffect(() => {
    // --- MOCK DATA START ---
    // Comment out this block and uncomment the API code below to use real backend
    const mockStocks = [
      { StockID: 1, Name: 'Apple Inc.', Symbol: 'AAPL', Price: 175.12 },
      { StockID: 2, Name: 'Microsoft Corp.', Symbol: 'MSFT', Price: 320.45 },
      { StockID: 3, Name: 'Amazon.com', Symbol: 'AMZN', Price: 135.67 },
      { StockID: 4, Name: 'Tesla Inc.', Symbol: 'TSLA', Price: 245.89 },
      { StockID: 5, Name: 'Alphabet Inc.', Symbol: 'GOOGL', Price: 2800.23 },
    ];
    setStocks(mockStocks);
    setLoading(false);
    // --- MOCK DATA END ---

    // --- REAL API CODE (uncomment when backend is ready) ---
    // async function fetchStocks() {
    //   setLoading(true);
    //   try {
    //     const res = await stockAPI.getAllStocks();
    //     setStocks(res.data.slice(0, 5));
    //   } catch (err) {
    //     setStocks([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // fetchStocks();
  }, []);

  useEffect(() => {
    fetchMarketOverview();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchMarketOverview, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketOverview = async () => {
    try {
      setMarketLoading(true);
      setMarketError(null);

      // --- MOCK DATA START ---
      // Comment out this block and uncomment the API code below to use real backend
      const mockOverview = {
        sp500: { value: 4820.15, change: 1.2 },
        nasdaq: { value: 15250.33, change: 0.8 },
        dowJones: { value: 37592.98, change: -0.3 }
      };

      const mockTopics = [
        { id: 1, title: 'Tech Sector Rally', color: 'purple' },
        { id: 2, title: 'Federal Reserve Meeting', color: 'blue' },
        { id: 3, title: 'Crypto Market Update', color: 'pink' }
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsRefreshing(true);
      setTimeout(() => {
        setMarketOverview(mockOverview);
        setTrendingTopics(mockTopics);
        setIsRefreshing(false);
      }, 300);
      // --- MOCK DATA END ---

      // --- REAL API CODE (uncomment when backend is ready) ---
      // const response = await fetch('http://localhost:5000/api/market/overview');
      // if (!response.ok) {
      //   throw new Error('Failed to fetch market data');
      // }
      // const data = await response.json();
      // setIsRefreshing(true);
      // setTimeout(() => {
      //   setMarketOverview(data.overview);
      //   setTrendingTopics(data.topics);
      //   setIsRefreshing(false);
      // }, 300);
    } catch (error) {
      console.error('Error fetching market overview:', error);
      setMarketError('Failed to load market data. Please try again later.');
    } finally {
      setMarketLoading(false);
    }
  };

  const handleStockClick = async (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
    setLoadingHistory(true);
    setLoadingRisk(true);

    // --- MOCK DATA FOR PRICE HISTORY ---
    // Comment out this block and uncomment the API code below to use real backend
    const today = new Date();
    let price = stock.Price;
    const mockHistory = [];
    for (let i = 0; i < 50; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (49 - i));
      price += (Math.random() - 0.5) * 2;
      mockHistory.push({
        Date: date.toISOString().split('T')[0],
        Price: parseFloat(price.toFixed(2)),
      });
    }
    setPriceHistory(mockHistory);
    setLoadingHistory(false);

    // Mock risk analysis data
    const mockRiskAnalysis = {
      RiskAnalysisID: stock.StockID,
      Stock_ID: stock.StockID,
      StockSymbol: stock.Symbol,
      StockName: stock.Name,
      Trend: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
      Setup: ['BearishMomentum', 'BullishMomentum', 'OversoldBounce', 'OverboughtPullback', 'MiddleBandPullback'][Math.floor(Math.random() * 5)],
      Threshold: ['Overbought', 'Oversold', 'Neutral'][Math.floor(Math.random() * 3)],
      Momentum: ['Healthy', 'Weak', 'Neutral'][Math.floor(Math.random() * 3)],
      PriceAction: ['Healthy', 'Weak', 'Neutral'][Math.floor(Math.random() * 3)],
      Signal: ['Hold', 'Buy_BullishReversal', 'Buy_TrendContinuation', 'Sell_BearishReversal', 'Sell_TrendContinuation'][Math.floor(Math.random() * 5)],
      AnalysisTimestamp: new Date().toISOString()
    };
    setRiskAnalysis(mockRiskAnalysis);
    setLoadingRisk(false);
    // --- MOCK DATA END ---

    // --- REAL API CODE (uncomment when backend is ready) ---
    // try {
    //   const [historyRes, riskRes] = await Promise.all([
    //     stockAPI.getStockPriceHistory(stock.id || stock.StockID),
    //     fetch(`http://localhost:5000/api/risk-analysis/${stock.id || stock.StockID}`)
    //   ]);
    //   setPriceHistory(historyRes.data);
    //   const riskData = await riskRes.json();
    //   setRiskAnalysis(riskData);
    // } catch (err) {
    //   setPriceHistory([]);
    //   setRiskAnalysis(null);
    // } finally {
    //   setLoadingHistory(false);
    //   setLoadingRisk(false);
    // }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setPriceHistory([]);
    setRiskAnalysis(null);
  };

  // Add to Watchlist handler (mock for now)
  const handleAddToWatchlist = async (stock) => {
    // --- MOCK: Simulate API call ---
    alert(`${stock.Name || stock.name} added to watchlist!`);
    // --- REAL API CODE (uncomment when backend is ready) ---
    // await fetch('http://localhost:5000/api/watchlist', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stockId: stock.StockID || stock.id })
    // });
  };

  // Fetch watchlist when tab is switched to 'watchlist'
  useEffect(() => {
    if (activeTab === 'watchlist') {
      const fetchWatchlist = async () => {
        try {
          setWatchlistLoading(true);
          setWatchlistError(null);
          const res = await fetch(`http://localhost:5000/api/watchlist?userId=${userId}`);
          if (!res.ok) throw new Error('Failed to fetch watchlist');
          const data = await res.json();
          setWatchlist(data);
        } catch (err) {
          setWatchlistError(err.message);
        } finally {
          setWatchlistLoading(false);
        }
      };
      fetchWatchlist();
    }
  }, [activeTab]);

  // Fetch market trends
  useEffect(() => {
    if (activeTab === 'market-trends') {
      const fetchMarketTrends = async () => {
        try {
          setTrendsLoading(true);
          setTrendsError(null);
          
          // --- MOCK DATA START ---
          const mockTrends = [
            { TrendID: 1, TrendName: 'Moving Average (20)' },
            { TrendID: 2, TrendName: 'RSI Indicator' },
            { TrendID: 3, TrendName: 'MACD' },
            { TrendID: 4, TrendName: 'Bollinger Bands' },
            { TrendID: 5, TrendName: 'Volume Trend' }
          ];

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setMarketTrends(mockTrends);
          // --- MOCK DATA END ---

          // --- REAL API CODE (uncomment when backend is ready) ---
          // const res = await fetch('http://localhost:5000/api/market-trends');
          // if (!res.ok) throw new Error('Failed to fetch market trends');
          // const data = await res.json();
          // setMarketTrends(data);
        } catch (err) {
          setTrendsError(err.message);
        } finally {
          setTrendsLoading(false);
        }
      };
      fetchMarketTrends();
    }
  }, [activeTab]);

  // Update trend selection handler
  const handleTrendSelection = (trend) => {
    setSelectedTrends(prev => {
      const isSelected = prev.some(t => t.TrendID === trend.TrendID);
      if (isSelected) {
        return prev.filter(t => t.TrendID !== trend.TrendID);
      } else {
        return [...prev, trend];
      }
    });
  };

  // Fetch trend data when trends or stock changes
  useEffect(() => {
    if (selectedTrends.length > 0 && selectedStock) {
      const fetchAllTrendsData = async () => {
        try {
          const newTrendsData = {};
          for (const trend of selectedTrends) {
            // --- MOCK DATA START ---
            const today = new Date();
            const mockTrendData = [];
            let baseValue = 100;

            for (let i = 0; i < 50; i++) {
              const date = new Date(today);
              date.setDate(today.getDate() - (49 - i));
              
              let value;
              switch(trend.TrendID) {
                case 1: // Moving Average
                  value = baseValue + Math.sin(i / 5) * 10;
                  break;
                case 2: // RSI
                  value = 30 + Math.sin(i / 3) * 40;
                  break;
                case 3: // MACD
                  value = Math.sin(i / 4) * 20;
                  break;
                case 4: // Bollinger Bands
                  value = baseValue + Math.sin(i / 6) * 15;
                  break;
                case 5: // Volume
                  value = 1000 + Math.random() * 2000;
                  break;
                default:
                  value = baseValue + Math.random() * 20;
              }
              
              mockTrendData.push({
                Date: date.toISOString().split('T')[0],
                Value: parseFloat(value.toFixed(2))
              });
            }
            
            newTrendsData[trend.TrendID] = mockTrendData;
            // --- MOCK DATA END ---
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setAllTrendsData(newTrendsData);
        } catch (err) {
          console.error('Error fetching trend data:', err);
          setAllTrendsData({});
        }
      };
      fetchAllTrendsData();
    }
  }, [selectedTrends, selectedStock]);

  // Fetch user and portfolio data
  useEffect(() => {
    if (activeTab === 'portfolio') {
      const fetchPortfolioData = async () => {
        try {
          setPortfolioLoading(true);
          setPortfolioError(null);

          // --- MOCK DATA START ---
          // Comment out this block when backend is ready
          const mockUserDetails = {
            UserID: 1,
            Username: "JohnDoe",
            Email: "john.doe@example.com",
            FullName: "John Doe",
            AccountType: "Premium",
            JoinDate: "2024-01-01",
            WalletBalance: 25000.00
          };

          const mockPortfolio = [
            {
              PortfolioID: 1,
              StockID: 1,
              StockName: "Apple Inc.",
              Symbol: "AAPL",
              Quantity: 10,
              AveragePrice: 150.00,
              CurrentPrice: 175.12,
              TotalValue: 1751.20,
              ProfitLoss: 251.20,
              ProfitLossPercentage: 16.75
            },
            {
              PortfolioID: 2,
              StockID: 2,
              StockName: "Microsoft Corp.",
              Symbol: "MSFT",
              Quantity: 5,
              AveragePrice: 300.00,
              CurrentPrice: 320.45,
              TotalValue: 1602.25,
              ProfitLoss: 102.25,
              ProfitLossPercentage: 6.82
            }
          ];

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setUserDetails(mockUserDetails);
          setPortfolioData(mockPortfolio);
          // --- MOCK DATA END ---

          // --- REAL API CODE (uncomment when backend is ready) ---
          /*
          const response = await fetch(`http://localhost:5000/api/portfolio/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
          const data = await response.json();
          setUserDetails(data.userDetails);
          setPortfolioData(data.portfolio);
          */
        } catch (err) {
          setPortfolioError(err.message);
        } finally {
          setPortfolioLoading(false);
        }
      };
      fetchPortfolioData();
    }
  }, [activeTab]);

  // Fetch news data
  useEffect(() => {
    if (activeTab === 'news') {
      const fetchNews = async () => {
        try {
          setNewsLoading(true);
          setNewsError(null);

          // --- MOCK DATA START ---
          const mockNews = [
            {
              NewsID: 1,
              Title: "Federal Reserve Signals Potential Rate Cuts",
              Content: "The Federal Reserve has indicated it may consider interest rate cuts in the coming months, citing concerns about economic growth...",
              Source: "Financial Times",
              PublishedDate: "2024-03-15T10:30:00Z",
              Category: "Economy",
              Sentiment: "Neutral",
              ImpactLevel: "High"
            },
            {
              NewsID: 2,
              Title: "Tech Giants Announce AI Partnership",
              Content: "Major technology companies have formed a new alliance to advance artificial intelligence research and development...",
              Source: "Tech Daily",
              PublishedDate: "2024-03-15T09:15:00Z",
              Category: "Technology",
              Sentiment: "Positive",
              ImpactLevel: "Medium"
            },
            {
              NewsID: 3,
              Title: "Oil Prices Surge Amid Middle East Tensions",
              Content: "Crude oil prices have jumped following escalating tensions in the Middle East, raising concerns about global supply...",
              Source: "Energy News",
              PublishedDate: "2024-03-15T08:45:00Z",
              Category: "Energy",
              Sentiment: "Negative",
              ImpactLevel: "High"
            }
          ];

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setNewsData(mockNews);
          // --- MOCK DATA END ---

          // --- REAL API CODE (uncomment when backend is ready) ---
          /*
          const response = await fetch(`http://localhost:5000/api/news${selectedNewsCategory !== 'all' ? `/category/${selectedNewsCategory}` : ''}`);
          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }
          const data = await response.json();
          setNewsData(data);
          */
        } catch (err) {
          setNewsError(err.message);
        } finally {
          setNewsLoading(false);
        }
      };
      fetchNews();
    }
  }, [activeTab, selectedNewsCategory]);

  return (
    <div className="relative min-h-screen flex bg-black overflow-hidden">
      {/* Blurred Gradient Shapes */}
      <div className="absolute top-0 left-0 w-[60vw] h-[20vw] bg-gradient-to-tr from-purple-800/40 to-blue-400/10 rounded-full blur-3xl -rotate-12 -translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute top-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-yellow-700/30 to-purple-900/10 rounded-full blur-2xl rotate-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[12vw] bg-gradient-to-tr from-purple-900/30 to-pink-400/10 rounded-full blur-2xl rotate-6 translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute bottom-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-pink-700/30 to-purple-900/10 rounded-full blur-2xl -rotate-12 translate-x-1/4 z-0" />

      {/* Sidebar */}
      <aside className="relative z-10 w-64 hidden md:flex flex-col bg-black/60 glass-effect border-r border-white/10 p-6 min-h-screen">
        <div className="font-bold text-2xl mb-8 tracking-tight bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">StockScope</div>
        <nav className="space-y-2">
          <button
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold shadow transition ${activeTab === 'overview' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold shadow transition ${activeTab === 'watchlist' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold shadow transition ${activeTab === 'market-trends' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            onClick={() => setActiveTab('market-trends')}
          >
            Market Trends
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold shadow transition ${activeTab === 'news' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            onClick={() => setActiveTab('news')}
          >
            Market News
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold shadow transition ${activeTab === 'portfolio' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="relative z-10 flex-1 p-8">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">
            {activeTab === 'overview' ? 'Overview' : activeTab === 'watchlist' ? 'Watchlist' : activeTab === 'portfolio' ? 'Portfolio' : activeTab === 'news' ? 'Market News' : 'Market Trends'}
          </h1>
          {activeTab === 'overview' && (
            <input type="text" placeholder="Search stocks..." className="px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition w-64" />
          )}
        </div>
        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <>
            {/* Stock Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-4">
              {loading ? (
                <div className="col-span-5 text-center text-gray-400">Loading stocks...</div>
              ) : stocks.length === 0 ? (
                <div className="col-span-5 text-center text-gray-400">No stocks found.</div>
              ) : (
                stocks.map((stock, idx) => (
                  <div key={stock.id || stock.StockID} className="relative group glass-effect bg-black/60 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden" style={{ minHeight: 210 }}>
                    {/* Gradient Glow */}
                    <div className="absolute inset-0 z-0 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-60 transition-all duration-300" style={{background: 'linear-gradient(135deg, rgba(168,139,250,0.12) 0%, rgba(236,72,153,0.10) 100%)'}} />
                    {/* Stock Icon/Logo */}
                    <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 shadow-lg mb-4">
                      <span className="text-2xl font-bold text-white select-none">
                        {stock.Symbol ? stock.Symbol[0] : '?'}
                      </span>
                    </div>
                    {/* Stock Name */}
                    <div className="relative z-10 text-lg font-semibold text-white mb-1 text-center truncate w-full">
                      {stock.Name || stock.name}
                    </div>
                    {/* Symbol Badge */}
                    <span className="relative z-10 inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white shadow mb-2">
                      {stock.Symbol || stock.symbol}
                    </span>
                    {/* Price */}
                    <div className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-1">
                      ${stock.Price || stock.price}
                    </div>
                    {/* Add to Watchlist Button */}
                    <button
                      onClick={() => handleAddToWatchlist(stock)}
                      className="relative z-10 mt-2 px-4 py-1 rounded-lg bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white text-xs font-semibold shadow hover:from-purple-800 hover:to-pink-700 transition-all duration-200"
                    >
                      + Add to Watchlist
                    </button>
                    {/* Decorative Blur Circle */}
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400/30 to-purple-400/10 blur-2xl opacity-60 pointer-events-none" />
                    {/* Overlay for clickable area */}
                    <button
                      className="absolute inset-0 z-0 w-full h-full cursor-pointer focus:outline-none"
                      style={{ background: 'transparent' }}
                      onClick={() => handleStockClick(stock)}
                      aria-label={`View details for ${stock.Name || stock.name}`}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Market News and Trends Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">Market News & Trends</h2>
                <button
                  onClick={fetchMarketOverview}
                  disabled={isRefreshing}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white hover:bg-white/10 transition-all duration-200 ${
                    isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Overview Card */}
                <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Market Overview</h3>
                  {marketLoading ? (
                    <div className="text-center text-gray-400">Loading market data...</div>
                  ) : marketError ? (
                    <div className="text-center text-red-400">{marketError}</div>
                  ) : (
                    <div className={`space-y-4 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">S&P 500</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 transition-all duration-300 transform hover:scale-105">
                            ${marketOverview.sp500.value.toLocaleString()}
                          </span>
                          <span className={`transition-all duration-300 transform hover:scale-105 ${
                            marketOverview.sp500.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {marketOverview.sp500.change >= 0 ? "+" : ""}{marketOverview.sp500.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">NASDAQ</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 transition-all duration-300 transform hover:scale-105">
                            ${marketOverview.nasdaq.value.toLocaleString()}
                          </span>
                          <span className={`transition-all duration-300 transform hover:scale-105 ${
                            marketOverview.nasdaq.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {marketOverview.nasdaq.change >= 0 ? "+" : ""}{marketOverview.nasdaq.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Dow Jones</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 transition-all duration-300 transform hover:scale-105">
                            ${marketOverview.dowJones.value.toLocaleString()}
                          </span>
                          <span className={`transition-all duration-300 transform hover:scale-105 ${
                            marketOverview.dowJones.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {marketOverview.dowJones.change >= 0 ? "+" : ""}{marketOverview.dowJones.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Trending Topics Card */}
                <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Trending Topics</h3>
                  {marketLoading ? (
                    <div className="text-center text-gray-400">Loading topics...</div>
                  ) : marketError ? (
                    <div className="text-center text-red-400">{marketError}</div>
                  ) : (
                    <div className={`space-y-4 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                      {trendingTopics.map((topic) => (
                        <div 
                          key={topic.id} 
                          className="flex items-center space-x-3 transition-all duration-300 transform hover:translate-x-1"
                        >
                          <span className={`w-2 h-2 rounded-full bg-${topic.color}-400`}></span>
                          <span className="text-gray-300">{topic.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Risk Analysis Section */}
            <div className="mt-12">
             {/* <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-6">Risk Analysis</h2> */}
              {loadingRisk ? (
                <div className="text-center text-gray-400">Loading risk analysis...</div>
              ) : riskAnalysis && (
                <div className="mb-8 relative p-8 rounded-2xl bg-black/40 shadow-xl backdrop-blur-lg overflow-hidden premium-glass-card">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Trend</span>
                      <div className={`font-medium ${
                        riskAnalysis.Trend === 'Bullish' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {riskAnalysis.Trend}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Setup</span>
                      <div className="text-white font-medium">{riskAnalysis.Setup}</div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Threshold</span>
                      <div className={`font-medium ${
                        riskAnalysis.Threshold === 'Overbought' ? 'text-red-400' :
                        riskAnalysis.Threshold === 'Oversold' ? 'text-green-400' :
                        'text-yellow-400'
                      }`}>
                        {riskAnalysis.Threshold}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Signal</span>
                      <div className={`font-medium ${
                        riskAnalysis.Signal.startsWith('Buy') ? 'text-green-400' :
                        riskAnalysis.Signal.startsWith('Sell') ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {riskAnalysis.Signal.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Last updated: {new Date(riskAnalysis.AnalysisTimestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'watchlist' ? (
          watchlistLoading ? (
            <div className="text-gray-400">Loading watchlist...</div>
          ) : watchlistError ? (
            <div className="text-red-400">{watchlistError}</div>
          ) : watchlist.length === 0 ? (
            <div className="text-gray-400">Your watchlist is empty.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {watchlist.map((item) => (
                <div key={item.Wishlist_ID} className="glass-effect bg-black/60 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 shadow-lg mb-4">
                    <span className="text-2xl font-bold text-white select-none">
                      {item.Stock?.TickerSymbol ? item.Stock.TickerSymbol[0] : '?'}
                    </span>
                  </div>
                  <div className="relative z-10 text-lg font-semibold text-white mb-1 text-center truncate w-full">
                    {item.Stock?.StockName}
                  </div>
                  <span className="relative z-10 inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white shadow mb-2">
                    {item.Stock?.TickerSymbol}
                  </span>
                  <div className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-1">
                    ${item.Stock?.CurrentPrice}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'portfolio' ? (
          <div className="space-y-8">
            {/* User Profile Section */}
            <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{userDetails?.FullName}</h2>
                  <p className="text-gray-400">{userDetails?.Email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white text-sm font-semibold">
                    {userDetails?.AccountType}
                  </span>
                  <p className="text-gray-400 mt-2">Member since {new Date(userDetails?.JoinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Wallet Balance</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">
                ${userDetails?.WalletBalance?.toLocaleString()}
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Your Portfolio</h3>
              {portfolioLoading ? (
                <div className="text-gray-400">Loading portfolio...</div>
              ) : portfolioError ? (
                <div className="text-red-400">{portfolioError}</div>
              ) : portfolioData.length === 0 ? (
                <div className="text-gray-400">Your portfolio is empty.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="pb-4">Stock</th>
                        <th className="pb-4">Quantity</th>
                        <th className="pb-4">Avg. Price</th>
                        <th className="pb-4">Current Price</th>
                        <th className="pb-4">Total Value</th>
                        <th className="pb-4">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.map((item) => (
                        <tr key={item.PortfolioID} className="border-b border-white/10">
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 flex items-center justify-center mr-3">
                                <span className="text-white font-bold">{item.Symbol[0]}</span>
                              </div>
                              <div>
                                <div className="text-white font-medium">{item.StockName}</div>
                                <div className="text-gray-400 text-sm">{item.Symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-white">{item.Quantity}</td>
                          <td className="py-4 text-white">${item.AveragePrice.toFixed(2)}</td>
                          <td className="py-4 text-white">${item.CurrentPrice.toFixed(2)}</td>
                          <td className="py-4 text-white">${item.TotalValue.toFixed(2)}</td>
                          <td className="py-4">
                            <span className={`${item.ProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {item.ProfitLoss >= 0 ? '+' : ''}{item.ProfitLoss.toFixed(2)} ({item.ProfitLossPercentage.toFixed(2)}%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'news' ? (
          <div className="space-y-8">
            {/* News Categories */}
            <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedNewsCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedNewsCategory === 'all'
                      ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  All News
                </button>
                <button
                  onClick={() => setSelectedNewsCategory('Economy')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedNewsCategory === 'Economy'
                      ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Economy
                </button>
                <button
                  onClick={() => setSelectedNewsCategory('Technology')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedNewsCategory === 'Technology'
                      ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Technology
                </button>
                <button
                  onClick={() => setSelectedNewsCategory('Energy')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedNewsCategory === 'Energy'
                      ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Energy
                </button>
              </div>
            </div>

            {/* News List */}
            <div className="space-y-6">
              {newsLoading ? (
                <div className="text-gray-400">Loading news...</div>
              ) : newsError ? (
                <div className="text-red-400">{newsError}</div>
              ) : newsData.length === 0 ? (
                <div className="text-gray-400">No news available.</div>
              ) : (
                newsData.map((news) => (
                  <div key={news.NewsID} className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{news.Title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        news.Sentiment === 'Positive' ? 'bg-green-500/20 text-green-400' :
                        news.Sentiment === 'Negative' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {news.Sentiment}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{news.Content}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">{news.Source}</span>
                        <span className="text-gray-400">
                          {new Date(news.PublishedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        news.ImpactLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                        news.ImpactLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {news.ImpactLevel} Impact
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // Market Trends Tab Content
          <div className="space-y-8">
            {/* Trend Filters */}
            <div className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Market Trends</h2>
              {trendsLoading ? (
                <div className="text-gray-400">Loading trends...</div>
              ) : trendsError ? (
                <div className="text-red-400">{trendsError}</div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {marketTrends.map((trend) => (
                    <button
                      key={trend.TrendID}
                      onClick={() => handleTrendSelection(trend)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedTrends.some(t => t.TrendID === trend.TrendID)
                          ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {trend.TrendName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {loading ? (
                <div className="col-span-5 text-center text-gray-400">Loading stocks...</div>
              ) : stocks.length === 0 ? (
                <div className="col-span-5 text-center text-gray-400">No stocks found.</div>
              ) : (
                stocks.map((stock) => (
                  <div
                    key={stock.StockID}
                    className="relative group glass-effect bg-black/60 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden"
                    onClick={() => handleStockClick(stock)}
                  >
                    <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 shadow-lg mb-4">
                      <span className="text-2xl font-bold text-white select-none">
                        {stock.Symbol ? stock.Symbol[0] : '?'}
                      </span>
                    </div>
                    <div className="relative z-10 text-lg font-semibold text-white mb-1 text-center truncate w-full">
                      {stock.Name}
                    </div>
                    <span className="relative z-10 inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white shadow mb-2">
                      {stock.Symbol}
                    </span>
                    <div className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-1">
                      ${stock.Price}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Trend Analysis Section */}
            {selectedStock && selectedTrends.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-6">
                  Trend Analysis: {selectedStock.Name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTrends.map((trend) => (
                    <div key={trend.TrendID} className="glass-effect bg-black/60 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-4">{trend.TrendName}</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Current Value</span>
                          <span className="text-white font-medium">
                            {allTrendsData[trend.TrendID] ? allTrendsData[trend.TrendID][allTrendsData[trend.TrendID].length - 1].Value.toFixed(2) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Trend Direction</span>
                          <span className={`font-medium ${
                            allTrendsData[trend.TrendID] && 
                            allTrendsData[trend.TrendID][allTrendsData[trend.TrendID].length - 1].Value > 
                            allTrendsData[trend.TrendID][0].Value
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}>
                            {allTrendsData[trend.TrendID] ? 
                              (allTrendsData[trend.TrendID][allTrendsData[trend.TrendID].length - 1].Value > 
                               allTrendsData[trend.TrendID][0].Value ? 'Upward' : 'Downward') 
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-white font-medium mb-2">Interpretation</h4>
                          <p className="text-gray-300">
                            {trend.TrendID === 1 && "Moving Average indicates the overall trend direction and potential support/resistance levels."}
                            {trend.TrendID === 2 && "RSI shows whether the stock is overbought (>70) or oversold (<30)."}
                            {trend.TrendID === 3 && "MACD helps identify trend changes and momentum."}
                            {trend.TrendID === 4 && "Bollinger Bands show price volatility and potential breakouts."}
                            {trend.TrendID === 5 && "Volume trend indicates the strength of price movements."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Modal for Stock Price History */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="glass-effect bg-black/80 rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative border border-white/10 backdrop-blur-md">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-2xl">&times;</button>
              {/* Stock Info Header */}
              <div className="flex flex-col items-center mb-8">
                {selectedStock?.logo && (
                  <img src={selectedStock.logo} alt={selectedStock.Name || selectedStock.name} className="w-16 h-16 rounded-full mb-2 bg-white/10 object-contain" />
                )}
                <div className="text-lg font-bold text-white mb-1 text-center">{selectedStock?.Name || selectedStock?.name}</div>
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white shadow mb-2">
                  {selectedStock?.Symbol || selectedStock?.symbol}
                </span>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-1">
                  ${selectedStock?.Price || selectedStock?.price}
                </div>
              </div>

              {/* Side by side layout for risk analysis and chart */}
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Risk Analysis Section */}
                <div className="w-full md:w-1/2 flex items-center">
                  {loadingRisk ? (
                    <div className="text-center text-gray-400 w-full">Loading risk analysis...</div>
                  ) : riskAnalysis && (
                    <div className="premium-glass-card w-full">
                      <div className="grid grid-cols-2 gap-6 p-8">
                        <div className="space-y-2">
                          <span className="text-sm text-gray-400">Trend</span>
                          <div className={`font-medium ${
                            riskAnalysis.Trend === 'Bullish' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {riskAnalysis.Trend}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-gray-400">Setup</span>
                          <div className="text-white font-medium">{riskAnalysis.Setup}</div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-gray-400">Threshold</span>
                          <div className={`font-medium ${
                            riskAnalysis.Threshold === 'Overbought' ? 'text-red-400' :
                            riskAnalysis.Threshold === 'Oversold' ? 'text-green-400' :
                            'text-yellow-400'
                          }`}>
                            {riskAnalysis.Threshold}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-gray-400">Signal</span>
                          <div className={`font-medium ${
                            riskAnalysis.Signal.startsWith('Buy') ? 'text-green-400' :
                            riskAnalysis.Signal.startsWith('Sell') ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {riskAnalysis.Signal.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="px-8 pb-4 text-sm text-gray-400">
                        Last updated: {new Date(riskAnalysis.AnalysisTimestamp).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                {/* Chart Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent text-center">Price History</h2>
                  {loadingHistory ? (
                    <div className="text-center text-gray-400">Loading chart...</div>
                  ) : priceHistory.length === 0 ? (
                    <div className="text-center text-gray-400">No price history found.</div>
                  ) : (
                    <Chart
                      data={{
                        labels: priceHistory.map(item => item.Date || item.date),
                        datasets: [
                          {
                            label: 'Price',
                            data: priceHistory.map(item => item.Price || item.price),
                            fill: true,
                            borderColor: '#a78bfa',
                            backgroundColor: 'rgba(168,139,250,0.1)',
                            tension: 0.3,
                            pointRadius: 0,
                          },
                          // Add all selected trends
                          ...selectedTrends.map((trend, index) => ({
                            label: trend.TrendName,
                            data: allTrendsData[trend.TrendID]?.map(item => item.Value) || [],
                            borderColor: ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5],
                            backgroundColor: 'transparent',
                            tension: 0.3,
                            pointRadius: 0,
                            borderDash: [5, 5],
                          })),
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { 
                            display: true,
                            labels: {
                              color: '#fff'
                            }
                          },
                        },
                        scales: {
                          x: {
                            display: false,
                          },
                          y: {
                            beginAtZero: false,
                            ticks: { color: '#fff' },
                            grid: { color: 'rgba(255,255,255,0.05)' },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 