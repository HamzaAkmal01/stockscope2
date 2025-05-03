"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const StockContext = createContext()

export const useStocks = () => useContext(StockContext)

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([])
  const [topStocks, setTopStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/stocks")
      setStocks(response.data)

      // Sort by market cap to get top stocks
      const sortedStocks = [...response.data].sort((a, b) => b.MarketCap - a.MarketCap)
      setTopStocks(sortedStocks.slice(0, 5))

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Fetch stock by symbol
  const fetchStockBySymbol = async (symbol) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/stocks/symbol/${symbol}`)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  // Fetch stock with trend data
  const fetchStockWithTrend = async (stockId) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/stocks/trend/${stockId}`)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  // Search stocks
  const searchStocks = async (query) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/stocks/search?query=${query}`)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  // Fetch stocks by sector
  const fetchStocksBySector = async (sector) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/stocks/sector/${sector}`)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  // Load stocks on initial render
  useEffect(() => {
    fetchStocks()
  }, [])

  return (
    <StockContext.Provider
      value={{
        stocks,
        topStocks,
        loading,
        error,
        fetchStocks,
        fetchStockBySymbol,
        fetchStockWithTrend,
        searchStocks,
        fetchStocksBySector,
      }}
    >
      {children}
    </StockContext.Provider>
  )
}
