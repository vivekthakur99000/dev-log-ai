import api from './api.client'

const getAllLogs = async () => {
  const res = await api.get('/logs')
  return res.data
}

const getLogsByType = async (type) => {
  const res = await api.get(`/logs?type=${encodeURIComponent(type)}`)
  return res.data
}

const getLogById = async (id) => {
  const res = await api.get(`/logs/${encodeURIComponent(id)}`)
  return res.data
}

const deleteLog = async (id) => {
  const res = await api.delete(`/logs/${encodeURIComponent(id)}`)
  return res.data
}

export default {
  getAllLogs,
  getLogsByType,
  getLogById,
  deleteLog,
}
