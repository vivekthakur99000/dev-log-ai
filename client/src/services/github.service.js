import api from './api.client'

const getUserRepos = async () => {
  const res = await api.get('/auth/repos')
  return res.data
}

const getRepoCommits = async (owner, repo) => {
  const res = await api.get(`/auth/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`)
  return res.data
}

export default {
  getUserRepos,
  getRepoCommits,
}
