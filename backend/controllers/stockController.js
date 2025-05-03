const Stock = require("../models/Stock")
const MarketTrend = require("../models/MarketTrend")
const { Op } = require("sequelize")

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      order: [["StockName", "ASC"]],
    })

    res.status(200).json(stocks)
  } catch (error) {
    console.error("Error fetching stocks:", error)
    res.status(500).json({ message: "Failed to fetch stocks", error: error.message })
  }
}

// Get stock by ID
exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params

    const stock = await Stock.findByPk(id)

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" })
    }

    res.status(200).json(stock)
  } catch (error) {
    console.error("Error fetching stock:", error)
    res.status(500).json({ message: "Failed to fetch stock", error: error.message })
  }
}

// Get stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params

    const stock = await Stock.findOne({
      where: { TickerSymbol: symbol },
    })

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" })
    }

    res.status(200).json(stock)
  } catch (error) {
    console.error("Error fetching stock:", error)
    res.status(500).json({ message: "Failed to fetch stock", error: error.message })
  }
}

// Get stocks by sector
exports.getStocksBySector = async (req, res) => {
  try {
    const { sector } = req.params

    const stocks = await Stock.findAll({
      where: { Sector: sector },
      order: [["StockName", "ASC"]],
    })

    res.status(200).json(stocks)
  } catch (error) {
    console.error("Error fetching stocks by sector:", error)
    res.status(500).json({ message: "Failed to fetch stocks", error: error.message })
  }
}

// Search stocks
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const stocks = await Stock.findAll({
      where: {
        [Op.or]: [
          { StockName: { [Op.like]: `%${query}%` } },
          { TickerSymbol: { [Op.like]: `%${query}%` } },
          { Sector: { [Op.like]: `%${query}%` } },
        ],
      },
      order: [["StockName", "ASC"]],
    })

    res.status(200).json(stocks)
  } catch (error) {
    console.error("Error searching stocks:", error)
    res.status(500).json({ message: "Failed to search stocks", error: error.message })
  }
}

// Get stock with market trend data
exports.getStockWithTrend = async (req, res) => {
  try {
    const { id } = req.params

    const stock = await Stock.findByPk(id)

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" })
    }

    const trend = await MarketTrend.findOne({
      where: { Stock_ID: id },
    })

    res.status(200).json({
      stock,
      trend: trend || { message: "No trend data available" },
    })
  } catch (error) {
    console.error("Error fetching stock with trend:", error)
    res.status(500).json({ message: "Failed to fetch stock data", error: error.message })
  }
}
