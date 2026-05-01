import api from './api.client'

const getGithubLoginUrl = async () => {
  const res = await api.get('/auth/github')
  return res.data
}

const exchangeCodeForToken = async (code) => {
  const res = await api.get(`/auth/github/callback?code=${encodeURIComponent(code)}`)
  return res.data
}

const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data
}

export default {
  getGithubLoginUrl,
  exchangeCodeForToken,
  getMe,
}
