import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token from localStorage for convenience
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('devlog_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore
  }
  return config
})

export default api
