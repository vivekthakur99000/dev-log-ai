import api from './api.client'

const generateStandup = async (owner, repo) => {
  const res = await api.get(`/generate/standup/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
  return res.data
}

const generatePR = async (owner, repo) => {
  const res = await api.get(`/generate/pr/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
  return res.data
}

const generateWeekly = async (owner, repo) => {
  const res = await api.get(`/generate/weekly/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
  return res.data
}

const exportCopy = async (id) => {
  const res = await api.post('/export/copy', { id })
  return res.data
}

const exportDownload = async (id) => {
  const res = await api.post('/export/download', { id })
  return res.data
}

export default {
  generateStandup,
  generatePR,
  generateWeekly,
  exportCopy,
  exportDownload,
}
