import axios from 'axios'

const API_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Stock related API calls
export const stockAPI = {
  getAllStocks: () => api.get('/api/stocks'),
  getStockById: (id) => api.get(`/api/stocks/${id}`),
  getStockPriceHistory: (id) => api.get(`/api/stocks/${id}/history`),
}

// User related API calls
export const userAPI = {
  login: (credentials) => api.post('/api/users/login', credentials),
  register: (userData) => api.post('/api/users/register', userData),
  getProfile: () => api.get('/api/users/profile'),
}

// Portfolio related API calls
export const portfolioAPI = {
  getPortfolio: () => api.get('/api/portfolio'),
  addToPortfolio: (stockData) => api.post('/api/portfolio', stockData),
  removeFromPortfolio: (stockId) => api.delete(`/api/portfolio/${stockId}`),
}

// Market related API calls
export const marketAPI = {
  getMarketTrends: () => api.get('/api/market/trends'),
  getMarketNews: () => api.get('/api/market/news'),
  getRiskAnalysis: () => api.get('/api/market/risk-analysis'),
}

// Transaction related API calls
export const transactionAPI = {
  getTransactions: () => api.get('/api/transactions'),
  createTransaction: (transactionData) => api.post('/api/transactions', transactionData),
}

// Wishlist related API calls
export const wishlistAPI = {
  getWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (stockId) => api.post('/api/wishlist', { stockId }),
  removeFromWishlist: (stockId) => api.delete(`/api/wishlist/${stockId}`),
}

export default api 