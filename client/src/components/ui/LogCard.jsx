function LogCard({ type, time, title, repo }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100">
              {type}
            </span>
            <span className="text-xs text-slate-500">{time}</span>
          </div>
          <p className="mt-3 truncate text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{repo}</p>
        </div>
        <div className="mt-1 h-9 w-9 rounded-2xl bg-linear-to-br from-white/10 to-white/5" />
      </div>
    </article>
  )
}

export default LogCard
