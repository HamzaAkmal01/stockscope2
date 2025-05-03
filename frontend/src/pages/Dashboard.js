"use client"

import { useState, useEffect } from "react"
import { useStocks } from "../contexts/StockContext"
import StockList from "../components/stocks/StockList"
import MarketOverview from "../components/dashboard/MarketOverview"
import TopPerformers from "../components/dashboard/TopPerformers"
import SectorPerformance from "../components/dashboard/SectorPerformance"
import NewsWidget from "../components/news/NewsWidget"
import "./Dashboard.css"

const Dashboard = () => {
  const { topStocks, loading, error } = useStocks()
  const [marketData, setMarketData] = useState(null)
  const [marketLoading, setMarketLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setMarketLoading(true)
        // Fetch market overview data from our backend
        const response = await fetch("/api/market/overview")
        const data = await response.json()
        setMarketData(data)
        setMarketLoading(false)
      } catch (err) {
        console.error("Error fetching market data:", err)
        setMarketLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Market Dashboard</h1>
        <p>Track your favorite stocks and market trends</p>
      </div>

      <div className="dashboard-grid">
        <div className="market-overview-container">
          <h2>Market Overview</h2>
          {marketLoading ? <div className="loading">Loading market data...</div> : <MarketOverview data={marketData} />}
        </div>

        <div className="top-performers-container">
          <h2>Top Performers</h2>
          {loading ? (
            <div className="loading">Loading top stocks...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <TopPerformers stocks={topStocks} />
          )}
        </div>

        <div className="sector-performance-container">
          <h2>Sector Performance</h2>
          <SectorPerformance />
        </div>

        <div className="news-container">
          <h2>Latest Market News</h2>
          <NewsWidget />
        </div>
      </div>

      <div className="stock-list-section">
        <h2>All Stocks</h2>
        <StockList />
      </div>
    </div>
  )
}

export default Dashboard
