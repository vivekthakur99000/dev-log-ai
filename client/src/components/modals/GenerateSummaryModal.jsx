import { useState } from 'react'

function GenerateSummaryModal({ isOpen, onClose, repos, onGenerate, loading }) {
  const [selectedRepo, setSelectedRepo] = useState('')
  const [selectedType, setSelectedType] = useState('standup')

  const handleGenerate = async () => {
    if (!selectedRepo) {
      alert('Please select a repository')
      return
    }
    const [owner, repo] = selectedRepo.split('/')
    await onGenerate(owner, repo, selectedType)
    setSelectedRepo('')
    setSelectedType('standup')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="mb-2 text-2xl font-semibold text-white">Generate Summary</h2>
        <p className="mb-6 text-sm text-slate-400">Choose a repository and summary type</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Repository</label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition hover:border-white/20 focus:border-cyan-400/50 focus:outline-none"
              disabled={loading}
            >
              <option value="">Select a repository...</option>
              {repos.map((repo) => (
                <option key={repo.fullName} value={repo.fullName}>
                  {repo.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Summary Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standup', label: 'Standup', icon: '📝' },
                { id: 'pr', label: 'PR', icon: '🔀' },
                { id: 'weekly', label: 'Weekly', icon: '📊' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    selectedType === type.id
                      ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                  disabled={loading}
                >
                  <span className="block text-lg">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedRepo}
              className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-cyan-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateSummaryModal
