import StatCard from '../ui/StatCard.jsx'

function HeroPanel({ stats, summaryLabel, summaryTitle, summaryDescription, focusTitle, focusText, toneTitle, toneText }) {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
            Friendly overview
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
          </span>

          <div className="space-y-4">
            <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl xl:text-6xl">
              Write clearer progress updates without the usual friction.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A welcoming workspace for standups, PR summaries, and weekly reports. Built to feel calm, readable, and easy to use across desktop and mobile.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Standups', 'PR summaries', 'Weekly reports'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              Start a summary
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            >
              Browse saved logs
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[30px] border border-white/10 bg-white/8 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">{summaryLabel}</p>
                <p className="mt-1 text-lg font-semibold text-white">{summaryTitle}</p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Ready
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/8">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Output style</span>
                  <span>{summaryLabel}</span>
                </div>
                <div className="mt-4 space-y-3">
                        <div className="h-3 w-5/6 rounded-full bg-linear-to-r from-cyan-300/80 to-emerald-300/70" />
                  <div className="h-3 w-4/6 rounded-full bg-white/10" />
                  <div className="h-3 w-3/5 rounded-full bg-white/10" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{summaryDescription}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-linear-to-br from-cyan-400/15 to-teal-400/5 p-4 ring-1 ring-cyan-300/10">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">{focusTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{focusText}</p>
                </div>
                <div className="rounded-3xl bg-linear-to-br from-rose-400/15 to-orange-400/5 p-4 ring-1 ring-rose-300/10">
                  <p className="text-xs uppercase tracking-[0.25em] text-rose-200/70">{toneTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{toneText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroPanel
