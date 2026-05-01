import { useEffect, useState } from 'react'
import Header from '../components/layout/Header.jsx'
import GettingStartedStrip from '../components/sections/GettingStartedStrip.jsx'
import HeroPanel from '../components/sections/HeroPanel.jsx'
import SidebarPanels from '../components/sections/SidebarPanels.jsx'
import GenerateSummaryModal from '../components/modals/GenerateSummaryModal.jsx'
import githubService from '../services/github.service'
import logsService from '../services/logs.service'
import aiService from '../services/ai.service'

function Dashboard() {
  const [repos, setRepos] = useState([])
  const [logs, setLogs] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [errorRepos, setErrorRepos] = useState(null)
  const [errorLogs, setErrorLogs] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [generatingType, setGeneratingType] = useState(null)
  const [stats, setStats] = useState([
    { label: 'Today', value: '0 summaries', hint: '+0 from yesterday' },
    { label: 'Weekly pace', value: '0 updates', hint: 'Across 0 repos' },
    { label: 'AI quality', value: '92%', hint: 'Readable summaries' },
  ])

  const calculateStats = (logsList, reposList) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaysLogs = logsList.filter(log => {
      const logDate = new Date(log.createdAt)
      logDate.setHours(0, 0, 0, 0)
      return logDate.getTime() === today.getTime()
    })

    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - today.getDay())
    const weeklyLogs = logsList.filter(log => {
      const logDate = new Date(log.createdAt)
      logDate.setHours(0, 0, 0, 0)
      return logDate >= weekStart
    })

    return [
      { label: 'Today', value: `${todaysLogs.length} summaries`, hint: `+${Math.max(0, todaysLogs.length - 1)} from yesterday` },
      { label: 'Weekly pace', value: `${weeklyLogs.length} updates`, hint: `Across ${reposList.length} repos` },
      { label: 'AI quality', value: '92%', hint: 'Readable summaries' },
    ]
  }

  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleGenerate = async (owner, repo, type) => {
    setGeneratingType(type)
    try {
      const summaryFn = {
        standup: aiService.generateStandup,
        pr: aiService.generatePR,
        weekly: aiService.generateWeekly,
      }[type]

      await summaryFn(owner, repo)
      
      const data = await logsService.getAllLogs()
      const logList = Array.isArray(data?.data) ? data.data : data || []
      setLogs(logList.slice(0, 5).map((log) => ({
        title: log.content?.substring(0, 50) || 'Untitled log',
        type: log.type?.charAt(0).toUpperCase() + log.type?.slice(1) || 'Standup',
        repo: log.repoName || 'unknown',
        time: log.createdAt ? formatTime(new Date(log.createdAt)) : 'Recently',
      })))
      
      setStats(calculateStats(logList, repos))
      setModalOpen(false)
    } catch (error) {
      console.error('Failed to generate summary:', error)
      alert('Failed to generate summary. Please try again.')
    } finally {
      setGeneratingType(null)
    }
  }

  useEffect(() => {
    const fetchRepos = async () => {
      setLoadingRepos(true)
      try {
        const data = await githubService.getUserRepos()
        const repoList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setRepos(repoList.map((repo) => ({
          fullName: repo.fullName || repo.name,
          name: repo.fullName || repo.name,
          status: 'Connected',
          tone: 'from-emerald-500 to-cyan-500',
        })))
        setErrorRepos(null)
      } catch (error) {
        console.error('Failed to fetch repos:', error)
        setErrorRepos('Could not load repositories')
        setRepos([])
      } finally {
        setLoadingRepos(false)
      }
    }

    const fetchLogs = async () => {
      setLoadingLogs(true)
      try {
        const data = await logsService.getAllLogs()
        const logList = Array.isArray(data?.data) ? data.data : data || []
        setLogs(logList.slice(0, 5).map((log) => ({
          title: log.content?.substring(0, 50) || 'Untitled log',
          type: log.type?.charAt(0).toUpperCase() + log.type?.slice(1) || 'Standup',
          repo: log.repoName || 'unknown',
          time: log.createdAt ? formatTime(new Date(log.createdAt)) : 'Recently',
        })))
        setErrorLogs(null)
      } catch (error) {
        console.error('Failed to fetch logs:', error)
        setErrorLogs('Could not load logs')
        setLogs([])
      } finally {
        setLoadingLogs(false)
      }
    }

    fetchRepos()
    fetchLogs()
  }, [])

  useEffect(() => {
    if (logs.length > 0 && repos.length > 0) {
      setStats(calculateStats(logs, repos))
    }
  }, [logs, repos])

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Header />

        <main className="grid flex-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <HeroPanel
            stats={stats}
            summaryLabel="Today's standup"
            summaryTitle="Your AI-powered recap"
            summaryDescription="Based on your latest commits across all repos. Customize tone and export anywhere."
            focusTitle="Focus"
            focusText="Standups, PRs, weekly rollups"
            toneTitle="Tone"
            toneText="Professional or casual"
            onStartSummary={() => setModalOpen(true)}
            allRepos={repos}
          />
          <SidebarPanels 
            repos={repos} 
            logs={logs}
            loadingRepos={loadingRepos}
            loadingLogs={loadingLogs}
            errorRepos={errorRepos}
            errorLogs={errorLogs}
          />
        </main>

        <GettingStartedStrip />

        <GenerateSummaryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          repos={repos}
          onGenerate={handleGenerate}
          loading={generatingType !== null}
        />
      </div>
    </div>
  )
}

export default Dashboard
