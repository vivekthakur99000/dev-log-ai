const steps = [
  {
    title: 'Choose a source',
    description: 'Start with a connected repo so the workspace knows where to pull progress from.',
  },
  {
    title: 'Pick the format',
    description: 'Switch between standup, PR, and weekly views based on who will read it.',
  },
  {
    title: 'Share the update',
    description: 'Keep the result in one clean place so it is easy to copy, review, and reuse.',
  },
]

function GettingStartedStrip() {
  return (
    <section className="mt-4 rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Getting started</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">A clear flow for everyday updates.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            This screen is built to feel simple from the first glance, with just enough structure to guide the eye without overwhelming it.
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
          Best for small teams and fast-moving projects
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 to-emerald-300 text-sm font-black text-slate-950">
                {index + 1}
              </span>
              <h4 className="text-base font-semibold text-white">{step.title}</h4>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default GettingStartedStrip
