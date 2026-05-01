const navItems = ['Dashboard', 'Logs', 'Projects', 'Insights']

function Header() {
  return (
    <header className="mb-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-xl lg:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 via-teal-400 to-emerald-300 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
            D
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">DevLog AI</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Turn commits into clear updates your team can trust.</h1>
            <p className="mt-1 text-sm text-slate-300">A focused workspace for standups, PR notes, and weekly summaries.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {navItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  index === 0
                    ? 'border-cyan-300/30 bg-cyan-400/15 text-white'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              3 repos connected
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Last update 12 min ago</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
