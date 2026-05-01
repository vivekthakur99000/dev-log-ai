import Header from './components/layout/Header.jsx'
import GettingStartedStrip from './components/sections/GettingStartedStrip.jsx'
import HeroPanel from './components/sections/HeroPanel.jsx'
import SidebarPanels from './components/sections/SidebarPanels.jsx'

const stats = [
  { label: 'Today', value: '12 commits', hint: '+4 from yesterday' },
  { label: 'Weekly pace', value: '38 updates', hint: 'Across 4 repos' },
  { label: 'AI quality', value: '92%', hint: 'Readable summaries' },
]

const repos = [
  { name: 'server-api', status: 'Connected', tone: 'from-emerald-500 to-cyan-500' },
  { name: 'client-app', status: 'Synced', tone: 'from-amber-500 to-orange-500' },
  { name: 'infra-scripts', status: 'Idle', tone: 'from-slate-500 to-slate-700' },
]

const logs = [
  {
    title: 'Weekly release notes',
    type: 'Weekly',
    repo: 'design-system',
    time: '2h ago',
  },
  {
    title: 'PR summary for auth flow',
    type: 'PR',
    repo: 'server-api',
    time: '5h ago',
  },
  {
    title: 'Standup recap',
    type: 'Standup',
    repo: 'client-app',
    time: 'Yesterday',
  },
]

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Header />

        <main className="grid flex-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <HeroPanel
            stats={stats}
            summaryLabel="Summary canvas"
            summaryTitle="This week at a glance"
            summaryDescription="A polished output area for standups, PR summaries, and weekly reports. Built to feel calm, sharp, and credible across desktop and mobile."
            focusTitle="Focus"
            focusText="Feature delivery, review-ready PR notes, and concise weekly progress."
            toneTitle="Tone"
            toneText="Professional, direct, and clean enough to paste into a client update."
          />

          <SidebarPanels repos={repos} logs={logs} />
        </main>

        <GettingStartedStrip />
      </div>
    </div>
  )
}

export default App
