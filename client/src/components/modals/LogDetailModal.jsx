import React, { useState } from 'react'
import aiService from '../../services/ai.service'

function LogDetailModal({ isOpen, onClose, log }) {
  const [loadingCopy, setLoadingCopy] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [loadingNotion, setLoadingNotion] = useState(false)
  const [loadingSlack, setLoadingSlack] = useState(false)

  if (!isOpen || !log) return null

  const handleCopy = async () => {
    try {
      setLoadingCopy(true)
      const res = await aiService.exportCopy(log.id)
      const text = res?.data || res?.content || log.content
      if (navigator.clipboard) await navigator.clipboard.writeText(text)
      else alert('Copy not supported in this browser')
      alert('Copied to clipboard')
    } catch (err) {
      console.error(err)
      alert('Failed to copy')
    } finally {
      setLoadingCopy(false)
    }
  }

  const handleDownload = async () => {
    try {
      setLoadingDownload(true)
      const res = await aiService.exportDownload(log.id)
      if (res?.url) {
        window.open(res.url, '_blank')
        return
      }
      const content = res?.data || res?.content || log.content || ''
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${log.repo || 'log'}-${log.id}.txt`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Download failed')
    } finally {
      setLoadingDownload(false)
    }
  }

  const handleNotion = async () => {
    try {
      setLoadingNotion(true)
      const res = await aiService.exportToNotion(log.id)
      alert(res?.message || 'Exported to Notion')
    } catch (err) {
      console.error(err)
      alert('Failed to export to Notion')
    } finally {
      setLoadingNotion(false)
    }
  }

  const handleSlack = async () => {
    try {
      setLoadingSlack(true)
      const res = await aiService.exportToSlack(log.id)
      alert(res?.message || 'Exported to Slack')
    } catch (err) {
      console.error(err)
      alert('Failed to export to Slack')
    } finally {
      setLoadingSlack(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-950 p-6 text-slate-100">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{log.title}</h3>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>

        <p className="mt-2 text-sm text-slate-400">{log.type} • {log.repo} • {log.time}</p>

        <div className="mt-4 max-h-64 overflow-auto rounded-md border border-white/6 bg-black/20 p-4 text-sm text-slate-200">
          {log.content}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={handleCopy} disabled={loadingCopy} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {loadingCopy ? 'Copying...' : 'Copy'}
          </button>
          <button onClick={handleDownload} disabled={loadingDownload} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {loadingDownload ? 'Downloading...' : 'Download'}
          </button>
          <button onClick={handleNotion} disabled={loadingNotion} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {loadingNotion ? 'Exporting...' : 'Export to Notion'}
          </button>
          <button onClick={handleSlack} disabled={loadingSlack} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {loadingSlack ? 'Exporting...' : 'Export to Slack'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogDetailModal
