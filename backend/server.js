const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const sequelize = require("./config/database")
const stockRoutes = require("./routes/stockRoutes")
const userRoutes = require("./routes/userRoutes")
const portfolioRoutes = require("./routes/portfolioRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const orderRoutes = require("./routes/orderRoutes")
const newsRoutes = require("./routes/newsRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const apiLogRoutes = require("./routes/apiLogRoutes")
const marketTrendRoutes = require("./routes/marketTrendRoutes")
const riskAnalysisRoutes = require("./routes/riskAnalysisRoutes")
const fetchStockData = require("./services/stockDataService")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use("/api/stocks", stockRoutes)
app.use("/api/users", userRoutes)
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/logs", apiLogRoutes)
app.use("/api/trends", marketTrendRoutes)
app.use("/api/risk", riskAnalysisRoutes)

// Database sync and server start
// Database sync and server start
async function startServer() {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: false })  // <-- Change this line from true to false
    console.log("Database synchronized successfully")

    // Start scheduled job to fetch stock data
    fetchStockData.scheduleStockDataFetch()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Unable to start server:", error)
  }
}

startServer()
