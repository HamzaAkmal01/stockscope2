"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useStocks } from "../contexts/StockContext"
import { useAuth } from "../contexts/AuthContext"
import StockChart from "../components/stocks/StockChart"
import StockStats from "../components/stocks/StockStats"
import StockNews from "../components/stocks/StockNews"
import TradingPanel from "../components/trading/TradingPanel"
import MarketTrendIndicator from "../components/stocks/MarketTrendIndicator"
import "./StockDetail.css"

const StockDetail = () => {
  const { symbol } = useParams()
  const { fetchStockBySymbol, fetchStockWithTrend } = useStocks()
  const { isAuthenticated } = useAuth()
  const [stock, setStock] = useState(null)
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("1M")

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        // Fetch stock data by symbol
        const stockData = await fetchStockBySymbol(symbol)
        setStock(stockData)

        // Fetch trend data
        const trendResponse = await fetchStockWithTrend(stockData.StockID)
        setTrendData(trendResponse.trend)

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStockData()
  }, [symbol, fetchStockBySymbol, fetchStockWithTrend])

  if (loading) return <div className="loading">Loading stock data...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!stock) return <div className="not-found">Stock not found</div>

  return (
    <div className="stock-detail-page">
      <div className="stock-header">
        <div className="stock-title">
          <h1>
            {stock.StockName} ({stock.TickerSymbol})
          </h1>
          <div className="stock-price-container">
            <span className="stock-price">${stock.CurrentPrice.toFixed(2)}</span>
            <span className={`price-change ${stock.CurrentPrice > stock.OpeningPrice ? "positive" : "negative"}`}>
              {stock.CurrentPrice > stock.OpeningPrice ? "+" : ""}
              {(((stock.CurrentPrice - stock.OpeningPrice) / stock.OpeningPrice) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="stock-meta">
          <span>Exchange: {stock.Exchange}</span>
          <span>Sector: {stock.Sector}</span>
          <span>Market Cap: ${(stock.MarketCap / 1000000000).toFixed(2)}B</span>
        </div>
      </div>

      <div className="stock-content-grid">
        <div className="chart-container">
          <div className="timeframe-selector">
            <button className={timeframe === "1D" ? "active" : ""} onClick={() => setTimeframe("1D")}>
              1D
            </button>
            <button className={timeframe === "1W" ? "active" : ""} onClick={() => setTimeframe("1W")}>
              1W
            </button>
            <button className={timeframe === "1M" ? "active" : ""} onClick={() => setTimeframe("1M")}>
              1M
            </button>
            <button className={timeframe === "3M" ? "active" : ""} onClick={() => setTimeframe("3M")}>
              3M
            </button>
            <button className={timeframe === "1Y" ? "active" : ""} onClick={() => setTimeframe("1Y")}>
              1Y
            </button>
            <button className={timeframe === "5Y" ? "active" : ""} onClick={() => setTimeframe("5Y")}>
              5Y
            </button>
          </div>
          <StockChart stockId={stock.StockID} symbol={stock.TickerSymbol} timeframe={timeframe} />
        </div>

        <div className="stock-sidebar">
          {isAuthenticated ? (
            <TradingPanel stock={stock} />
          ) : (
            <div className="login-prompt">
              <p>Log in to trade this stock</p>
              <a href="/login" className="login-button">
                Log In
              </a>
            </div>
          )}

          <StockStats stock={stock} />

          {trendData && <MarketTrendIndicator trendData={trendData} />}
        </div>
      </div>

      <div className="stock-news-section">
        <h2>Latest News for {stock.StockName}</h2>
        <StockNews stockId={stock.StockID} />
      </div>
    </div>
  )
}

export default StockDetail
