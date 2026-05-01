import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import logsService from '../services/logs.service'
import LogDetailModal from '../components/modals/LogDetailModal.jsx'

function Logs() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [selectedLog, setSelectedLog] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const data = await logsService.getAllLogs()
        const logList = Array.isArray(data?.data) ? data.data : data || []
        setLogs(logList.map((log) => ({
          id: log._id,
          title: log.content?.substring(0, 50) || 'Untitled log',
          type: log.type?.charAt(0).toUpperCase() + log.type?.slice(1) || 'Standup',
          repo: log.repoName || 'unknown',
          time: formatTime(new Date(log.createdAt)),
          content: log.content || 'No content',
          dateRange: log.dateRange || '',
        })))
        setError(null)
      } catch (err) {
        console.error('Failed to fetch logs:', err)
        setError('Could not load logs')
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Header />

        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">All Logs</h2>
            <p className="mt-2 text-slate-400">Your generated summaries across all repositories</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">Loading logs...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
              <p className="text-red-200">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No logs yet. Generate your first summary to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-cyan-400/40 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.type === 'Standup' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' :
                          log.type === 'Pr' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-sm text-slate-400">{log.repo}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{log.title}</h3>
                      <p className="text-slate-300 text-sm">{log.content}</p>
                      <p className="text-xs text-slate-500 mt-3">{log.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => { setSelectedLog(log); setModalOpen(true) }}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white transition"
                      >
                        View
                      </button>
                      <button
                        onClick={async () => {
                          // quick copy shortcut
                          try {
                            await navigator.clipboard.writeText(log.content)
                            alert('Copied')
                          } catch (err) {
                            alert('Copy failed')
                          }
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                      >Copy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <LogDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} log={selectedLog} />
        </main>
      </div>
    </div>
  )
}

export default Logs
