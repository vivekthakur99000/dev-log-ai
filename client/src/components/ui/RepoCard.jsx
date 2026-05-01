function RepoCard({ name, status, tone }) {
  return (
    <article className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
      <div className={`h-12 w-12 rounded-2xl bg-linear-to-br ${tone}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="text-sm text-slate-400">{status}</p>
      </div>
      <div className="h-2 w-2 rounded-full bg-emerald-400" />
    </article>
  )
}

export default RepoCard
