import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'devlog_token'
const USER_STORAGE_KEY = 'devlog_user'

const initialState = {
  token: localStorage.getItem(STORAGE_KEY) || null,
  user: localStorage.getItem(USER_STORAGE_KEY) ? JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) : null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEY),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user || null
      state.isAuthenticated = !!token

      // Persist to localStorage
      if (token) {
        localStorage.setItem(STORAGE_KEY, token)
        if (user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
        }
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false

      // Clear from localStorage
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer