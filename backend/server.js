const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const stockDataService = require("./services/stockDataService");
const marketRoutes = require("./routes/market");
const watchlistRoutes = require("./routes/watchlist");

// Import all models to ensure they are registered with Sequelize
require("./models/User");
require("./models/Stock");
require("./models/userPortfolio");
require("./models/Transaction");
require("./models/wishlist");
require("./models/order");
require("./models/admin");
require("./models/tradingSession");
require("./models/marketNews");
require("./models/MarketTrend");
require("./models/StockPriceHistory");
require("./models/riskAnalysis");
require("./models/ApiLog");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/market", marketRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Stock Trading API is running");
});

// Sync database and start server
async function startServer() {
  try {
    console.log("Attempting to connect to the database...");
    await sequelize.authenticate();
    console.log("✅ Connection to the database has been established successfully.");

    console.log("Synchronizing database (force: true)...");
    await sequelize.sync({ force: true }); // Drops and recreates all tables
    console.log("✅ Database synchronized successfully");

    console.log("Scheduling stock data fetch...");
    stockDataService.scheduleStockDataFetch();

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();