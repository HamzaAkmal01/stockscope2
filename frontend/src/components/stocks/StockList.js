"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useStocks } from "../../contexts/StockContext"
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa"

const StockList = () => {
  const { stocks, loading, error } = useStocks()
  const [sortField, setSortField] = useState("StockName")
  const [sortDirection, setSortDirection] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStocks, setFilteredStocks] = useState([])

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredStocks([])
    } else {
      const filtered = stocks.filter(
        (stock) =>
          stock.StockName.toLowerCase().includes(term.toLowerCase()) ||
          stock.TickerSymbol.toLowerCase().includes(term.toLowerCase()) ||
          stock.Sector.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredStocks(filtered)
    }
  }

  // Sort stocks
  const sortedStocks = [...(searchTerm ? filteredStocks : stocks)].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort />
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
  }

  if (loading) return <div className="loading">Loading stocks...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="stock-list-container">
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("TickerSymbol")}>Symbol {renderSortIcon("TickerSymbol")}</th>
              <th onClick={() => handleSort("StockName")}>Name {renderSortIcon("StockName")}</th>
              <th onClick={() => handleSort("CurrentPrice")}>Price {renderSortIcon("CurrentPrice")}</th>
              <th onClick={() => handleSort("Sector")}>Sector {renderSortIcon("Sector")}</th>
              <th onClick={() => handleSort("MarketCap")}>Market Cap {renderSortIcon("MarketCap")}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <tr key={stock.StockID}>
                <td>
                  <Link to={`/stock/${stock.TickerSymbol}`} className="stock-symbol">
                    {stock.TickerSymbol}
                  </Link>
                </td>
                <td>{stock.StockName}</td>
                <td className="price">${stock.CurrentPrice.toFixed(2)}</td>
                <td>{stock.Sector}</td>
                <td>${(stock.MarketCap / 1000000000).toFixed(2)}B</td>
              </tr>
            ))}
            {sortedStocks.length === 0 && (
              <tr>
                <td colSpan="5" className="no-results">
                  No stocks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockList
