import { useEffect, useState } from 'react'
import Header from '../components/layout/Header.jsx'
import githubService from '../services/github.service'

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(repos.length / pageSize))
  const paginatedRepos = repos.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true)
      try {
        const data = await githubService.getUserRepos()
        const repoList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setRepos(repoList.map((repo) => ({
          name: repo.fullName || repo.name,
          status: 'Connected',
          description: repo.description || 'No description',
          language: repo.language || 'Unknown',
          commits: repo.stargazers_count || '0',
        })))
        setCurrentPage(1)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch repos:', err)
        setError('Could not load projects')
        setRepos([])
        setCurrentPage(1)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Header />

        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Projects</h2>
            <p className="mt-2 text-slate-400">Connected repositories synced with your GitHub account</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400 mx-auto mb-4" />
                <p className="text-slate-400">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="col-span-full rounded-xl border border-red-500/30 bg-red-500/10 p-6">
                <p className="text-red-200">{error}</p>
              </div>
            ) : repos.length === 0 ? (
              <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-slate-400">No repositories found.</p>
              </div>
            ) : (
              paginatedRepos.map((repo, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl hover:border-cyan-400/40 transition">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      repo.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-200' :
                      repo.status === 'Synced' ? 'bg-cyan-500/20 text-cyan-200' :
                      'bg-slate-500/20 text-slate-200'
                    }`}>
                      {repo.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 mb-4">{repo.description}</p>

                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Language:</span>
                      <span className="text-slate-200 font-medium">{repo.language}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Stars:</span>
                      <span className="text-slate-200 font-medium">{repo.commits}</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-2 text-sm font-medium text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/20 transition">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {!loading && !error && repos.length > pageSize && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, repos.length)} of {repos.length} repositories
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-2 text-sm text-slate-300">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Projects
