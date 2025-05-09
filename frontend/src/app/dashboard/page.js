'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { stockAPI, marketAPI } from '@/services/api'

export default function Dashboard() {
  const [stocks, setStocks] = useState([])
  const [marketTrends, setMarketTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksResponse, trendsResponse] = await Promise.all([
          stockAPI.getAllStocks(),
          marketAPI.getMarketTrends()
        ])
        setStocks(stocksResponse.data)
        setMarketTrends(trendsResponse.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold gradient-text mb-6">Market Overview</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stocks.map((stock) => (
                <div key={stock.id} className="gradient-border">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">{stock.symbol}</dt>
                          <dd className="text-lg font-medium text-white">${stock.price}</dd>
                          <dd className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold gradient-text mt-8 mb-6">Market Trends</h2>
            <div className="gradient-border">
              <div className="p-6">
                <div className="space-y-4">
                  {marketTrends.map((trend) => (
                    <div key={trend.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{trend.title}</h3>
                        <p className="text-sm text-gray-400">{trend.description}</p>
                      </div>
                      <div className={`text-sm font-medium ${trend.impact === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.impact === 'positive' ? '↑' : '↓'} {trend.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </ProtectedRoute>
  )
} 