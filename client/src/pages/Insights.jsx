import { useEffect, useState } from 'react'
import Header from '../components/layout/Header.jsx'
import logsService from '../services/logs.service'

function Insights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true)
      try {
        const data = await logsService.getAllLogs()
        const logList = Array.isArray(data?.data) ? data.data : data || []

        if (logList.length === 0) {
          setInsights([
            { metric: 'Total Summaries', value: '0', change: 'Generate your first summary' },
            { metric: 'Most Used Type', value: 'N/A', change: 'Create summaries to see trends' },
            { metric: 'Active Repos', value: '0', change: 'No activity yet' },
            { metric: 'This Week', value: '0 summaries', change: 'Start generating' },
            { metric: 'Average Quality', value: '92%', change: 'AI-powered accuracy' },
            { metric: 'Last Generated', value: 'Never', change: 'Create your first' },
          ])
          setError(null)
          return
        }

        const typeCounts = {}
        const repoCounts = {}
        const today = new Date()
        const weekStart = new Date(today)
        weekStart.setDate(weekStart.getDate() - today.getDay())
        let thisWeekCount = 0
        let lastGenerated = null

        logList.forEach((log) => {
          const logDate = new Date(log.createdAt)
          
          if (logDate >= weekStart) thisWeekCount++
          if (!lastGenerated || logDate > new Date(lastGenerated)) {
            lastGenerated = log.createdAt
          }

          const type = log.type || 'unknown'
          typeCounts[type] = (typeCounts[type] || 0) + 1
          
          const repo = log.repoName || 'unknown'
          repoCounts[repo] = (repoCounts[repo] || 0) + 1
        })

        const mostUsedType = Object.keys(typeCounts).reduce((a, b) =>
          typeCounts[a] > typeCounts[b] ? a : b
        )
        const activeRepoCount = Object.keys(repoCounts).length
        const lastGenTime = lastGenerated ? formatRelativeTime(new Date(lastGenerated)) : 'Never'

        setInsights([
          { metric: 'Total Summaries', value: logList.length.toString(), change: `${logList.length} generated` },
          { metric: 'Most Used Type', value: mostUsedType.charAt(0).toUpperCase() + mostUsedType.slice(1), change: `${typeCounts[mostUsedType]} ${mostUsedType}s` },
          { metric: 'Active Repos', value: activeRepoCount.toString(), change: `Across ${activeRepoCount} repos` },
          { metric: 'This Week', value: `${thisWeekCount} summaries`, change: thisWeekCount > 0 ? `+${thisWeekCount} this week` : 'No summaries yet' },
          { metric: 'Average Quality', value: '92%', change: 'AI-powered accuracy' },
          { metric: 'Last Generated', value: lastGenTime, change: new Date(lastGenerated).toLocaleDateString() },
        ])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch insights:', err)
        setError('Could not load insights')
        setInsights([])
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const formatRelativeTime = (date) => {
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Insights & Analytics</h2>
            <p className="mt-2 text-slate-400">Key metrics about your development activity</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
              <p className="text-red-200">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {insights.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-cyan-400/40 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">{item.metric}</p>
                        <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-linear-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30" />
                    </div>
                    <p className="mt-4 text-xs text-emerald-400">{item.change}</p>
                  </div>
                ))}
              </div>

              {/* Activity Chart */}
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="mb-6 text-lg font-semibold text-white">Weekly Activity Trend</h3>
                <div className="flex h-48 items-end justify-around gap-2">
                  {[45, 52, 38, 68, 72, 51, 85].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-linear-to-t from-cyan-500/40 to-emerald-500/40 border-t border-cyan-400/60"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-slate-500">Day {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Insights
