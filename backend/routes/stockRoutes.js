const express = require("express")
const stockController = require("../controllers/stockController")

const router = express.Router()

// GET all stocks
router.get("/", stockController.getAllStocks)

// GET stock by ID
router.get("/id/:id", stockController.getStockById)

// GET stock by symbol
router.get("/symbol/:symbol", stockController.getStockBySymbol)

// GET stocks by sector
router.get("/sector/:sector", stockController.getStocksBySector)

// GET search stocks
router.get("/search", stockController.searchStocks)

// GET stock with market trend data
router.get("/trend/:id", stockController.getStockWithTrend)

module.exports = router
