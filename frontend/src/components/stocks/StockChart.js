"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import axios from "axios"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const StockChart = ({ stockId, symbol, timeframe = "1M" }) => {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        // Fetch historical data from our backend which gets it from the database
        const response = await axios.get(`/api/stocks/historical/${stockId}?timeframe=${timeframe}`)

        // Process data for chart
        const data = response.data

        // Format dates and prices for chart
        const labels = data.map((item) => new Date(item.date).toLocaleDateString())
        const prices = data.map((item) => item.price)

        setChartData({
          labels,
          datasets: [
            {
              label: symbol,
              data: prices,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.1,
            },
          ],
        })

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [stockId, symbol, timeframe])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${symbol} Stock Price`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  if (loading) return <div className="chart-loading">Loading chart data...</div>
  if (error) return <div className="chart-error">Error loading chart: {error}</div>
  if (!chartData) return <div className="chart-no-data">No data available</div>

  return (
    <div className="stock-chart">
      <div className="chart-timeframe-selector">
        <button className={timeframe === "1D" ? "active" : ""}>1D</button>
        <button className={timeframe === "1W" ? "active" : ""}>1W</button>
        <button className={timeframe === "1M" ? "active" : ""}>1M</button>
        <button className={timeframe === "3M" ? "active" : ""}>3M</button>
        <button className={timeframe === "1Y" ? "active" : ""}>1Y</button>
        <button className={timeframe === "5Y" ? "active" : ""}>5Y</button>
      </div>
      <Line options={options} data={chartData} />
    </div>
  )
}

export default StockChart
