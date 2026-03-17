import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send HTTP-only cookies automatically
  headers: { 'Content-Type': 'application/json' },
})

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired or invalid — redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
