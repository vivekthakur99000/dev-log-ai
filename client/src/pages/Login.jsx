import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGitHubLogin = () => {
    // Navigate the whole browser to the server endpoint.
    // This avoids making an XHR request which would follow the server's 302 redirect
    // and trigger CORS errors. A full navigation is not subject to CORS.
    window.location.href = 'http://localhost:5000/api/auth/github'
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-linear-to-br from-cyan-400 via-teal-400 to-emerald-300 text-2xl font-black text-slate-950 shadow-2xl shadow-cyan-500/40">
              D
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">DevLog AI</h1>
              <p className="mt-2 text-lg text-slate-300">Turn commits into clear updates</p>
              <p className="text-slate-400">your team can trust</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-cyan-200">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-sm text-slate-300">AI-powered standup summaries from your commits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-sm text-slate-300">Automatic PR notes and weekly reports</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-slate-300">Export to Slack, Notion, or download</span>
              </li>
            </ul>
          </div>

          {/* Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-linear-to-r from-cyan-500/20 to-emerald-500/20 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:border-cyan-400/40 hover:from-cyan-500/30 hover:to-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
                Connecting to GitHub...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.557.636-1.915-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C17.138 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with GitHub
              </span>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400">
            We only access your public repositories and commit history. No email is shared.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
