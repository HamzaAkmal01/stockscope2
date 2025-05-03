import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import { StockProvider } from "./contexts/StockContext"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Dashboard from "./pages/Dashboard"
import StockDetail from "./pages/StockDetail"
import Portfolio from "./pages/Portfolio"
import Watchlist from "./pages/Watchlist"
import MarketNews from "./pages/MarketNews"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StockProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/stock/:symbol" element={<StockDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/news" element={<MarketNews />} />
                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute>
                        <Portfolio />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <Watchlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </StockProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
