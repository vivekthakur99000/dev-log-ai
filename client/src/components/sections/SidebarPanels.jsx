import RepoCard from '../ui/RepoCard.jsx'
import LogCard from '../ui/LogCard.jsx'

function SidebarPanels({ repos, logs }) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Repositories</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Connected sources</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">3 active</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          These are the repos your team can summarize right away. Everything here is laid out to be easy to scan and quick to act on.
        </p>

        <div className="mt-5 space-y-3">
          {repos.map((repo) => (
            <RepoCard key={repo.name} {...repo} />
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent logs</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Saved summaries</h3>
          </div>
          <span className="text-sm text-cyan-200">View all</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Quickly jump back into the latest update without hunting through commits or raw notes.
        </p>

        <div className="mt-5 space-y-3">
          {logs.map((log) => (
            <LogCard key={log.title} {...log} />
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-cyan-300/15 bg-linear-to-br from-cyan-400/12 to-white/5 p-5 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Quick help</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Simple, friendly workflow.</h3>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <p>1. Pick a repo and choose the summary type.</p>
          <p>2. Review the generated update in a clean preview.</p>
          <p>3. Save, copy, or share it with the team.</p>
        </div>
      </section>
    </aside>
  )
}

export default SidebarPanels
