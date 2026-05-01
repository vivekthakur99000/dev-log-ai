import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token from localStorage for convenience
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('devlog_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // ignore
  }
  return config
})

export default api
