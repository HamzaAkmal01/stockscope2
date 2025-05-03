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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const MarketOverview = ({ data }) => {
  if (!data) return <div>No market data available</div>

  const marketIndices = [
    { name: "S&P 500", value: data.sp500.value, change: data.sp500.change },
    { name: "Dow Jones", value: data.dowJones.value, change: data.dowJones.change },
    { name: "Nasdaq", value: data.nasdaq.value, change: data.nasdaq.change },
  ]

  const chartData = {
    labels: data.timeLabels,
    datasets: [
      {
        label: "S&P 500",
        data: data.sp500.data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Dow Jones",
        data: data.dowJones.data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Nasdaq",
        data: data.nasdaq.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Market Indices",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="market-overview">
      <div className="indices-grid">
        {marketIndices.map((index) => (
          <div key={index.name} className="index-card">
            <h3>{index.name}</h3>
            <div className="index-value">{index.value.toLocaleString()}</div>
            <div className={`index-change ${index.change >= 0 ? "positive" : "negative"}`}>
              {index.change >= 0 ? "+" : ""}
              {index.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className="market-chart">
        <Line options={options} data={chartData} />
      </div>
    </div>
  )
}

export default MarketOverview
