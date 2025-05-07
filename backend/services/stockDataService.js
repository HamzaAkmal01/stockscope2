const axios = require("axios");
const cron = require("node-cron");
const Stock = require("../models/Stock");
const StockPriceHistory = require("../models/StockPriceHistory");
const ApiLog = require("../models/ApiLog");
const MarketTrend = require("../models/MarketTrend");
const RiskAnalysis = require("../models/riskAnalysis");
const MarketNews = require("../models/marketNews");
const User = require("../models/User");
const UserPortfolio = require("../models/userPortfolio");
const Transaction = require("../models/Transaction");
const Wishlist = require("../models/wishlist");
const Order = require("../models/order");
const Admin = require("../models/admin");
const TradingSession = require("../models/tradingSession");
const sequelize = require("../config/database");

// Helper function to generate a number within a range with retries, ensuring non-negative
function generateNumberInRange(min, max, decimals, maxRetries = 5) {
  let retries = 0;
  while (retries < maxRetries) {
    const value = Number((Math.random() * (max - min) + min).toFixed(decimals));
    if (value >= min && value <= max && value >= 0) {
      return value;
    }
    retries++;
  }
  return Math.max(min, 0);
}

// Generate mock historical data for last 50 days
function generateMockHistoricalData(symbol, basePrice) {
  const historicalData = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(16, 0, 0, 0); // Set to market close (4 PM UTC)

    if (isNaN(date.getTime())) {
      console.error(`Invalid date generated for ${symbol} at index ${i}:`, date);
      continue;
    }

    const priceVariation = (Math.random() - 0.5) * 50;
    const price = Math.max(basePrice + priceVariation, 0);
    const open = Math.max(price * (0.98 + Math.random() * 0.04), 0);
    const high = Math.max(price * (1.01 + Math.random() * 0.03), 0);
    const low = Math.max(price * (0.97 - Math.random() * 0.03), 0);
    const previousClose = Math.max(price * (0.99 + Math.random() * 0.02), 0);

    historicalData.push({
      symbol,
      date: date,
      price: Number(price.toFixed(6)),
      open: Number(open.toFixed(6)),
      high: Number(high.toFixed(6)),
      low: Number(low.toFixed(6)),
      previousClose: Number(previousClose.toFixed(6)),
    });

    console.log(`Generated record for ${symbol} with timestamp: ${date.toISOString()}`);
  }

  console.log(`Generated ${historicalData.length} days of historical data for ${symbol}`);
  return historicalData;
}

// Fetch mock stock data
async function fetchStockDataFromAPI(symbol) {
  try {
    console.log(`Mock fetching data for ${symbol}`);

    const priceRange = { min: 10, max: 2000, decimals: 6 };
    const marketCapRange = { min: 1000000, max: 5000000000000, decimals: 2 };
    const rsiRange = { min: 0, max: 100, decimals: 2 };

    const basePrice = generateNumberInRange(priceRange.min, priceRange.max, priceRange.decimals);
    const historicalData = generateMockHistoricalData(symbol, basePrice);

    const mockData = {
      symbol: symbol,
      name: `${symbol} Inc.`,
      historicalData: historicalData,
      marketCap: generateNumberInRange(marketCapRange.min, marketCapRange.max, marketCapRange.decimals),
      sector: ["Technology", "Healthcare", "Finance", "Energy"][Math.floor(Math.random() * 4)],
      exchange: ["NASDAQ", "NYSE"][Math.floor(Math.random() * 2)],
      movingAverage50: generateNumberInRange(
        basePrice * 0.95,
        basePrice * 1.05,
        priceRange.decimals
      ),
      rsi: generateNumberInRange(rsiRange.min, rsiRange.max, rsiRange.decimals),
      bollingerUpper: generateNumberInRange(basePrice * 1.01, basePrice * 1.05, priceRange.decimals),
      bollingerMiddle: Number(basePrice.toFixed(priceRange.decimals)),
      bollingerLower: generateNumberInRange(Math.max(basePrice * 0.95, 0), basePrice * 0.99, priceRange.decimals),
    };

    await ApiLog.create({
      End_Point_Indexes: `Mock API call for ${symbol}`,
      Response_Data: JSON.stringify(mockData),
      Status_Code: 200,
      Time_Stamp: new Date(),
    });

    return mockData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);

    await ApiLog.create({
      End_Point_Indexes: `https://api.example.com/stocks/${symbol}`,
      Response_Data: JSON.stringify(error.response?.data || error.message),
      Status_Code: error.response?.status || 500,
      Time_Stamp: new Date(),
    });

    throw error;
  }
}

// Generate and save mock user data
async function generateAndSaveUsers() {
  try {
    if (!User || typeof User.create !== "function") {
      throw new Error("User model is not properly defined or initialized");
    }

    const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah"];
    const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Wilson", "Davis"];
    const today = new Date();

    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`;
      const phoneNumber = `555-01${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
      const accountBalance = generateNumberInRange(1000, 100000, 2);
      const creationDate = new Date(today);
      creationDate.setDate(today.getDate() - Math.floor(Math.random() * 365));

      users.push({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PhoneNumber: phoneNumber,
        UserType: "Trader",
        AccountBalance: accountBalance,
        Account_Creation_Date: creationDate,
        Updation_In_Profile: creationDate,
      });
    }

    for (const userData of users) {
      console.log(`Saving user: ${userData.Email}`);
      try {
        await User.create(userData);
        console.log(`Saved user: ${userData.Email}`);
      } catch (error) {
        console.error(`Failed to save user: ${userData.Email}`, error);
      }
    }

    console.log("Successfully generated and saved users.");
  } catch (error) {
    console.error("Error generating and saving users:", error);
    throw error;
  }
}

// Generate and save mock user portfolio data
async function generateAndSaveUserPortfolios() {
  try {
    if (!UserPortfolio || typeof UserPortfolio.create !== "function") {
      throw new Error("UserPortfolio model is not properly defined or initialized");
    }

    const users = await User.findAll({ attributes: ["UserID"] });
    const stocks = await Stock.findAll({ attributes: ["StockID", "CurrentPrice"] });

    if (users.length === 0 || stocks.length === 0) {
      console.error("No users or stocks found to create portfolios.");
      return;
    }

    for (const user of users) {
      const numPortfolios = Math.floor(Math.random() * 3) + 1; // 1-3 portfolios per user
      const selectedStocks = stocks.sort(() => 0.5 - Math.random()).slice(0, numPortfolios);

      for (const stock of selectedStocks) {
        const ownedShares = Math.floor(Math.random() * 100) + 1;
        const averagePurchase = generateNumberInRange(stock.CurrentPrice * 0.9, stock.CurrentPrice * 1.1, 2);
        const totalInvestment = Number((ownedShares * averagePurchase).toFixed(2));

        const portfolioData = {
          User_ID: user.UserID,
          Stock_ID: stock.StockID,
          Owned_Shares: ownedShares,
          Total_Investment: totalInvestment,
          Average_Purchase: averagePurchase,
        };

        console.log(`Saving portfolio for UserID ${user.UserID}, StockID ${stock.StockID}`);
        try {
          await UserPortfolio.create(portfolioData);
          console.log(`Saved portfolio for UserID ${user.UserID}, StockID ${stock.StockID}`);
        } catch (error) {
          console.error(`Failed to save portfolio for UserID ${user.UserID}, StockID ${stock.StockID}`, error);
        }
      }
    }

    console.log("Successfully generated and saved user portfolios.");
  } catch (error) {
    console.error("Error generating and saving user portfolios:", error);
    throw error;
  }
}

// Generate and save mock transaction data
async function generateAndSaveTransactions() {
  try {
    if (!Transaction || typeof Transaction.create !== "function") {
      throw new Error("Transaction model is not properly defined or initialized");
    }

    const users = await User.findAll({ attributes: ["UserID"] });
    const stocks = await Stock.findAll({ attributes: ["StockID", "CurrentPrice"] });

    if (users.length === 0 || stocks.length === 0) {
      console.error("No users or stocks found to create transactions.");
      return;
    }

    for (const user of users) {
      const numTransactions = Math.floor(Math.random() * 5) + 1; // 1-5 transactions per user
      for (let i = 0; i < numTransactions; i++) {
        const stock = stocks[Math.floor(Math.random() * stocks.length)];
        const transactionType = Math.random() > 0.5 ? "Buy" : "Sell";
        const shares = Math.floor(Math.random() * 50) + 1;
        const pricePerShare = generateNumberInRange(stock.CurrentPrice * 0.95, stock.CurrentPrice * 1.05, 2);
        const totalAmount = Number((shares * pricePerShare).toFixed(2));
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() - Math.floor(Math.random() * 30));

        const transactionData = {
          User_ID: user.UserID,
          Stock_ID: stock.StockID,
          Transaction_Type: transactionType,
          Price_Per_Share: pricePerShare,
          Total_Amount: totalAmount,
          Transaction_Date: transactionDate,
        };

        console.log(`Saving transaction for UserID ${user.UserID}, StockID ${stock.StockID}`);
        try {
          await Transaction.create(transactionData);
          console.log(`Saved transaction for UserID ${user.UserID}, StockID ${stock.StockID}`);
        } catch (error) {
          console.error(`Failed to save transaction for UserID ${user.UserID}, StockID ${stock.StockID}`, error);
        }
      }
    }

    console.log("Successfully generated and saved transactions.");
  } catch (error) {
    console.error("Error generating and saving transactions:", error);
    throw error;
  }
}

// Generate and save mock wishlist data
async function generateAndSaveWishlist() {
  try {
    if (!Wishlist || typeof Wishlist.create !== "function") {
      throw new Error("Wishlist model is not properly defined or initialized");
    }

    const users = await User.findAll({ attributes: ["UserID"] });
    const stocks = await Stock.findAll({ attributes: ["StockID"] });

    if (users.length === 0 || stocks.length === 0) {
      console.error("No users or stocks found to create wishlist items.");
      return;
    }

    for (const user of users) {
      const numWishlistItems = Math.floor(Math.random() * 3) + 1; // 1-3 wishlist items per user
      const selectedStocks = stocks.sort(() => 0.5 - Math.random()).slice(0, numWishlistItems);

      for (const stock of selectedStocks) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        const wishlistData = {
          User_ID: user.UserID,
          Stock_ID: stock.StockID,
          Date: date,
        };

        console.log(`Saving wishlist item for UserID ${user.UserID}, StockID ${stock.StockID}`);
        try {
          await Wishlist.create(wishlistData);
          console.log(`Saved wishlist item for UserID ${user.UserID}, StockID ${stock.StockID}`);
        } catch (error) {
          console.error(`Failed to save wishlist item for UserID ${user.UserID}, StockID ${stock.StockID}`, error);
        }
      }
    }

    console.log("Successfully generated and saved wishlist items.");
  } catch (error) {
    console.error("Error generating and saving wishlist items:", error);
    throw error;
  }
}

// Generate and save mock order data
async function generateAndSaveOrders() {
  try {
    if (!Order || typeof Order.create !== "function") {
      throw new Error("Order model is not properly defined or initialized");
    }

    const users = await User.findAll({ attributes: ["UserID"] });
    const stocks = await Stock.findAll({ attributes: ["StockID", "CurrentPrice"] });

    if (users.length === 0 || stocks.length === 0) {
      console.error("No users or stocks found to create orders.");
      return;
    }

    for (const user of users) {
      const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user
      for (let i = 0; i < numOrders; i++) {
        const stock = stocks[Math.floor(Math.random() * stocks.length)];
        const orderType = ["Limit", "Market", "Stop"][Math.floor(Math.random() * 3)];
        const orderStatus = ["Pending", "Executed", "Cancelled"][Math.floor(Math.random() * 3)];
        const shares = Math.floor(Math.random() * 50) + 1;
        const priceLimit = generateNumberInRange(stock.CurrentPrice * 0.9, stock.CurrentPrice * 1.1, 2);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

        const orderData = {
          User_ID: user.UserID,
          Stock_ID: stock.StockID,
          Order_Type: orderType,
          Order_Status: orderStatus,
          Price_Limit: priceLimit,
          Order_Date: orderDate,
          Shares: shares,
        };

        console.log(`Saving order for UserID ${user.UserID}, StockID ${stock.StockID}`);
        try {
          await Order.create(orderData);
          console.log(`Saved order for UserID ${user.UserID}, StockID ${stock.StockID}`);
        } catch (error) {
          console.error(`Failed to save order for UserID ${user.UserID}, StockID ${stock.StockID}`, error);
        }
      }
    }

    console.log("Successfully generated and saved orders.");
  } catch (error) {
    console.error("Error generating and saving orders:", error);
    throw error;
  }
}

// Generate and save mock admin data
async function generateAndSaveAdmins() {
  try {
    if (!Admin || typeof Admin.create !== "function") {
      throw new Error("Admin model is not properly defined or initialized");
    }

    const admins = [
      {
        Admin_Name: "Admin One",
        Admin_Pass: "adminpass1",
        Email: "admin1@example.com",
        Creation_Date: new Date(),
      },
      {
        Admin_Name: "Admin Two",
        Admin_Pass: "adminpass2",
        Email: "admin2@example.com",
        Creation_Date: new Date(),
      },
    ];

    for (const adminData of admins) {
      console.log(`Saving admin: ${adminData.Email}`);
      try {
        await Admin.create(adminData);
        console.log(`Saved admin: ${adminData.Email}`);
      } catch (error) {
        console.error(`Failed to save admin: ${adminData.Email}`, error);
      }
    }

    console.log("Successfully generated and saved admins.");
  } catch (error) {
    console.error("Error generating and saving admins:", error);
    throw error;
  }
}

// Generate and save mock trading session data
async function generateAndSaveTradingSessions() {
  try {
    if (!TradingSession || typeof TradingSession.create !== "function") {
      throw new Error("TradingSession model is not properly defined or initialized");
    }

    const sessions = [
      {
        Exchange: "NASDAQ",
        Starting_Time: new Date("2025-05-07T09:30:00"),
        Closing_Time: new Date("2025-05-07T16:00:00"),
      },
      {
        Exchange: "NYSE",
        Starting_Time: new Date("2025-05-07T09:30:00"),
        Closing_Time: new Date("2025-05-07T16:00:00"),
      },
    ];

    for (const sessionData of sessions) {
      console.log(`Saving trading session for ${sessionData.Exchange}`);
      try {
        await TradingSession.create(sessionData);
        console.log(`Saved trading session for ${sessionData.Exchange}`);
      } catch (error) {
        console.error(`Failed to save trading session for ${sessionData.Exchange}`, error);
      }
    }

    console.log("Successfully generated and saved trading sessions.");
  } catch (error) {
    console.error("Error generating and saving trading sessions:", error);
    throw error;
  }
}

// Generate and save random market news
async function generateAndSaveMarketNews() {
  try {
    if (!MarketNews || typeof MarketNews.create !== "function") {
      throw new Error("MarketNews model is not properly defined or initialized");
    }

    const newsTemplates = [
      {
        title: "Company Reports Strong Quarterly Earnings",
        headline: "The company announced better-than-expected earnings, boosting investor confidence.",
      },
      {
        title: "New Product Launch Announced",
        headline: "The firm unveiled a groundbreaking product, expected to drive future growth.",
      },
      {
        title: "Regulatory Challenges Impact Operations",
        headline: "Recent regulatory changes have posed challenges for the company's operations.",
      },
      {
        title: "Strategic Partnership Formed",
        headline: "The company entered a strategic partnership to expand its market presence.",
      },
      {
        title: "Supply Chain Disruptions Reported",
        headline: "Ongoing supply chain issues have affected the company's production capacity.",
      },
      {
        title: "Leadership Transition Announced",
        headline: "The company named a new CEO to lead its next phase of growth.",
      },
      {
        title: "Stock Volatility Amid Market Uncertainty",
        headline: "The company's shares experienced volatility due to broader market trends.",
      },
      {
        title: "Innovation Drives Revenue Growth",
        headline: "Investments in R&D have led to significant revenue increases for the firm.",
      },
    ];

    const sources = [
      "Bloomberg",
      "Reuters",
      "CNBC",
      "Financial Times",
      "The Wall Street Journal",
      "Yahoo Finance",
      "MarketWatch",
    ];

    const stocks = await Stock.findAll({ attributes: ["StockID", "TickerSymbol"] });
    if (stocks.length === 0) {
      console.error("No stocks found in Stock_Table to assign news.");
      return;
    }

    console.log(`Generating market news for ${stocks.length} stocks...`);

    for (const stock of stocks) {
      const numNewsItems = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numNewsItems; i++) {
        const news = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const daysBack = Math.floor(Math.random() * 30);
        const publishDate = new Date();
        publishDate.setDate(publishDate.getDate() - daysBack);

        if (isNaN(publishDate.getTime())) {
          console.error(`Invalid publish date generated for ${stock.TickerSymbol}:`, publishDate);
          continue;
        }

        const newsRecord = {
          Stock_ID: stock.StockID,
          Source: source,
          Publish_Date: publishDate,
          News_Title: news.title,
          Headline: news.headline,
        };

        console.log(`Saving news for ${stock.TickerSymbol}:`, {
          ...newsRecord,
          Publish_Date: newsRecord.Publish_Date.toISOString(),
        });

        try {
          await MarketNews.create(newsRecord);
          console.log(`Saved news for ${stock.TickerSymbol} on ${newsRecord.Publish_Date.toISOString()}`);
        } catch (error) {
          console.error(`Failed to save news for ${stock.TickerSymbol}:`, error);
        }
      }
    }

    console.log("Successfully generated and saved market news.");
  } catch (error) {
    console.error("Error generating and saving market news:", error);
    throw error;
  }
}

// Trading strategy computation
async function computeTradingStrategy(stockId) {
  try {
    const marketTrend = await MarketTrend.findOne({
      where: { Stock_ID: stockId },
      include: [{ model: Stock, attributes: ["CurrentPrice"] }],
    });

    if (!marketTrend || !marketTrend.Stock) {
      throw new Error(`No Market_Trend or Stock data found for Stock_ID ${stockId}`);
    }

    const currentPrice = Math.max(marketTrend.Stock.CurrentPrice, 0);
    const movingAverage50 = Math.max(marketTrend.Past_50_Days_Average, 0);
    const rsi = marketTrend.Relative_Strength_Index;
    const bollingerBands = JSON.parse(marketTrend.Bollinger_Bands);
    const bollingerUpper = Math.max(bollingerBands.upper, 0);
    const bollingerMiddle = Math.max(bollingerBands.middle, 0);
    const bollingerLower = Math.max(bollingerBands.lower, 0);

    const trend = currentPrice > movingAverage50 ? "Bullish" : "Bearish";

    let setup;
    const bandThreshold = 0.02 * bollingerMiddle;
    if (currentPrice <= bollingerLower) {
      setup = "BearishMomentum";
    } else if (currentPrice >= bollingerUpper) {
      setup = "BullishMomentum";
    } else if (Math.abs(currentPrice - bollingerLower) < bandThreshold) {
      setup = "OversoldBounce";
    } else if (Math.abs(currentPrice - bollingerUpper) < bandThreshold) {
      setup = "OverboughtPullback";
    } else {
      setup = "MiddleBandPullback";
    }

    let threshold;
    if (rsi > 70) {
      threshold = "Overbought";
    } else if (rsi < 30) {
      threshold = "Oversold";
    } else {
      threshold = "Neutral";
    }

    let momentum = "Neutral";
    let priceAction = "Neutral";
    if (trend === "Bullish" && rsi >= 50 && rsi <= 60) {
      momentum = "Healthy";
      priceAction = "Healthy";
    } else if (trend === "Bearish" && rsi >= 40 && rsi <= 50) {
      momentum = "Weak";
      priceAction = "Weak";
    }

    let signal = "Hold";
    if (
      currentPrice < movingAverage50 &&
      rsi < 30 &&
      (currentPrice <= bollingerLower || Math.abs(currentPrice - bollingerLower) < bandThreshold)
    ) {
      signal = "Buy_BullishReversal";
    } else if (
      currentPrice > movingAverage50 &&
      rsi >= 50 &&
      rsi <= 70 &&
      Math.abs(currentPrice - bollingerMiddle) < bandThreshold &&
      currentPrice > bollingerLower
    ) {
      signal = "Buy_TrendContinuation";
    } else if (
      currentPrice > movingAverage50 &&
      rsi > 70 &&
      (currentPrice >= bollingerUpper || Math.abs(currentPrice - bollingerUpper) < bandThreshold)
    ) {
      signal = "Sell_BearishReversal";
    } else if (
      currentPrice < movingAverage50 &&
      rsi >= 30 &&
      rsi <= 50 &&
      Math.abs(currentPrice - bollingerMiddle) < bandThreshold &&
      currentPrice < bollingerUpper
    ) {
      signal = "Sell_TrendContinuation";
    }

    await RiskAnalysis.create({
      Stock_ID: stockId,
      Trend: trend,
      Setup: setup,
      Threshold: threshold,
      Momentum: momentum,
      PriceAction: priceAction,
      Signal: signal,
      AnalysisTimestamp: new Date(),
    });

    console.log(`Saved trading strategy analysis for stock ID ${stockId}`);
  } catch (error) {
    console.error(`Error computing trading strategy for stock ID ${stockId}:`, error);
    throw error;
  }
}

// Save stock data
async function saveStockData(stockData) {
  try {
    let savedStockRecords = 0;
    let savedHistoryRecords = 0;
    console.log(`Attempting to save data for ${stockData.symbol}: 1 record to Stock_Table, ${stockData.historicalData.length} records to Stock_Price_History`);

    const todayHistory = stockData.historicalData[0];
    if (todayHistory) {
      const timestamp = new Date(todayHistory.date);
      if (isNaN(timestamp.getTime())) {
        console.error(`Invalid timestamp for ${stockData.symbol} (today):`, todayHistory.date);
      } else {
        const stockInfo = {
          StockName: stockData.name,
          TickerSymbol: stockData.symbol,
          CurrentPrice: Number(Math.max(todayHistory.price, 0).toFixed(6)),
          OpeningPrice: Number(Math.max(todayHistory.open, 0).toFixed(6)),
          ClosingPrice: Number(Math.max(todayHistory.previousClose, 0).toFixed(6)),
          HighPrice: Number(Math.max(todayHistory.high, 0).toFixed(6)),
          LowPrice: Number(Math.max(todayHistory.low, 0).toFixed(6)),
          MarketCap: Number(Math.max(stockData.marketCap, 0).toFixed(2)),
          Sector: stockData.sector,
          Exchange: stockData.exchange,
          UpdatedAt: timestamp,
        };

        console.log(`Saving today's record to Stock_Table for ${stockData.symbol}:`, {
          ...stockInfo,
          UpdatedAt: stockInfo.UpdatedAt.toISOString(),
        });

        try {
          const stock = await Stock.create(stockInfo);
          savedStockRecords++;
          console.log(`Saved today's record to Stock_Table for ${stockData.symbol} on ${stockInfo.UpdatedAt.toISOString()} with StockID: ${stock.StockID}`);

          for (const history of stockData.historicalData) {
            const historyTimestamp = new Date(history.date);
            if (isNaN(historyTimestamp.getTime())) {
              console.error(`Invalid timestamp for ${stockData.symbol} (history):`, history.date);
              continue;
            }

            const historyInfo = {
              StockID: stock.StockID,
              TickerSymbol: stockData.symbol,
              CurrentPrice: Number(Math.max(history.price, 0).toFixed(6)),
              OpeningPrice: Number(Math.max(history.open, 0).toFixed(6)),
              ClosingPrice: Number(Math.max(history.previousClose, 0).toFixed(6)),
              HighPrice: Number(Math.max(history.high, 0).toFixed(6)),
              LowPrice: Number(Math.max(history.low, 0).toFixed(6)),
              UpdatedAt: historyTimestamp,
            };

            console.log(`Saving history record to Stock_Price_History for ${stockData.symbol}:`, {
              ...historyInfo,
              UpdatedAt: historyInfo.UpdatedAt.toISOString(),
            });

            try {
              await StockPriceHistory.create(historyInfo);
              savedHistoryRecords++;
              console.log(`Saved history record for ${stockData.symbol} on ${historyInfo.UpdatedAt.toISOString()}`);
            } catch (historyError) {
              console.error(`Failed to save history record for ${stockData.symbol} on ${historyInfo.UpdatedAt.toISOString()}:`, historyError);
            }
          }

          await updateMarketTrend(stock.StockID, stockData);
          await computeTradingStrategy(stock.StockID);
        } catch (stockError) {
          console.error(`Failed to save today's record for ${stockData.symbol}:`, stockError);
        }
      }
    } else {
      console.error(`No today's data available for ${stockData.symbol}`);
    }

    console.log(`Successfully saved ${savedStockRecords} record(s) to Stock_Table and ${savedHistoryRecords} record(s) to Stock_Price_History for ${stockData.symbol}`);
    return savedStockRecords === 1 && savedHistoryRecords === stockData.historicalData.length;
  } catch (error) {
    console.error("Error saving stock data:", error);
    throw error;
  }
}

// Update MarketTrend
async function updateMarketTrend(stockId, stockData) {
  try {
    const trendData = {
      Stock_ID: stockId,
      Past_50_Days_Average: Number(Math.max(stockData.movingAverage50, 0).toFixed(6)),
      Relative_Strength_Index: stockData.rsi,
      Bollinger_Bands: JSON.stringify({
        upper: Number(Math.max(stockData.bollingerUpper, 0).toFixed(6)),
        middle: Number(Math.max(stockData.bollingerMiddle, 0).toFixed(6)),
        lower: Number(Math.max(stockData.bollingerLower, 0).toFixed(6)),
      }),
      Updated_Time_Stamp: new Date(),
    };

    const existingTrend = await MarketTrend.findOne({
      where: { Stock_ID: stockId },
    });

    if (existingTrend) {
      await existingTrend.update(trendData);
    } else {
      await MarketTrend.create(trendData);
    }
  } catch (error) {
    console.error("Error updating market trend data:", error);
    throw error;
  }
}

// Fetch and save multiple stock data
async function fetchAndSaveStockData() {
  try {
    console.log("Clearing existing data from all tables...");

    // Define models and their corresponding table names
    const models = [
      { model: MarketNews, name: "Market_News" },
      { model: RiskAnalysis, name: "Risk_Analysis" },
      { model: MarketTrend, name: "Market_Trend" },
      { model: StockPriceHistory, name: "Stock_Price_History" },
      { model: Stock, name: "Stock_Table" },
      { model: UserPortfolio, name: "User_Portfolio" },
      { model: Transaction, name: "Transaction_Table" },
      { model: Wishlist, name: "Wishlist" },
      { model: Order, name: "Order_Table" },
      { model: User, name: "User_Table" },
      { model: Admin, name: "Admin_Table" },
      { model: TradingSession, name: "Trading_Session" },
      { model: ApiLog, name: "Api_Log" },
    ];

    // Clear all tables and log model initialization status
    for (const { model, name } of models) {
      try {
        if (!model || typeof model.destroy !== "function") {
          console.error(`${name} model is not properly defined or initialized. Skipping table clear.`);
          continue;
        }
        console.log(`Clearing table ${name}...`);
        await model.destroy({ where: {} });
        console.log(`Cleared table ${name} successfully.`);
      } catch (error) {
        console.error(`Failed to clear table ${name}:`, error);
      }
    }

    // Reset auto-increment IDs for existing tables
    const tableNames = [
      "Stock_Table",
      "Stock_Price_History",
      "Market_News",
      "Risk_Analysis",
      "User_Table",
      "User_Portfolio",
      "Transaction_Table",
      "Wishlist",
      "Order_Table",
      "Admin_Table",
      "Trading_Session",
      "Api_Log",
    ];

    for (const tableName of tableNames) {
      try {
        // Check if table exists before resetting
        const [results] = await sequelize.query(
          `SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'`
        );
        if (results.length > 0) {
          console.log(`Resetting auto-increment for ${tableName}...`);
          await sequelize.query(`DBCC CHECKIDENT ('${tableName}', RESEED, 0)`);
          console.log(`Reset auto-increment for ${tableName} successfully.`);
        } else {
          console.warn(`Table ${tableName} does not exist. Skipping auto-increment reset.`);
        }
      } catch (error) {
        console.error(`Failed to reset auto-increment for ${tableName}:`, error);
      }
    }

    console.log("Existing data cleared and auto-increment reset attempted.");

    // Fetch and save stock data
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
    for (const symbol of symbols) {
      try {
        const stockData = await fetchStockDataFromAPI(symbol);
        const success = await saveStockData(stockData);
        console.log(`Successfully updated data for ${symbol}: ${success ? "All records saved" : "Some records failed"}`);
      } catch (error) {
        console.error(`Failed to update data for ${symbol}:`, error);
      }
    }

    // Generate and save data for other tables
    await generateAndSaveUsers();
    await generateAndSaveUserPortfolios();
    await generateAndSaveTransactions();
    await generateAndSaveWishlist();
    await generateAndSaveOrders();
    await generateAndSaveAdmins();
    await generateAndSaveTradingSessions();
    await generateAndSaveMarketNews();
  } catch (error) {
    console.error("Error in stock data fetch and save process:", error);
    throw error;
  }
}

// Schedule cron job
function scheduleStockDataFetch() {
  cron.schedule("0 0 9-17 * * 1-5", fetchAndSaveStockData);
  fetchAndSaveStockData();
}

module.exports = {
  fetchStockDataFromAPI,
  saveStockData,
  fetchAndSaveStockData,
  scheduleStockDataFetch,
  generateAndSaveMarketNews,
  generateAndSaveUsers,
  generateAndSaveUserPortfolios,
  generateAndSaveTransactions,
  generateAndSaveWishlist,
  generateAndSaveOrders,
  generateAndSaveAdmins,
  generateAndSaveTradingSessions,
};