import { useState, useEffect, useRef, useCallback } from 'react'
import { store } from '../store'
import { formatDuration } from '../utils'
import { Play, Square, ChevronDown } from 'lucide-react'

export function Timer({ onEntryAdded }) {
  const [timer, setTimer] = useState(store.getTimer())
  const [elapsed, setElapsed] = useState(0)
  const [projectId, setProjectId] = useState(timer?.projectId || '')
  const [description, setDescription] = useState(timer?.description || '')
  const projects = store.getProjects()
  const clients = store.getClients()
  const intervalRef = useRef(null)
  const debounceRef = useRef(false)

  const running = timer?.running

  useEffect(() => {
    if (running) {
      const tick = () => setElapsed(Date.now() - timer.startedAt)
      tick()
      intervalRef.current = setInterval(tick, 1000)
      return () => clearInterval(intervalRef.current)
    } else {
      setElapsed(0)
    }
  }, [running, timer?.startedAt])

  const start = useCallback(() => {
    if (!projectId || debounceRef.current) return
    debounceRef.current = true
    setTimeout(() => { debounceRef.current = false }, 500)
    const t = { running: true, startedAt: Date.now(), projectId, description }
    store.setTimer(t)
    setTimer(t)
  }, [projectId, description])

  const stop = useCallback(() => {
    if (!timer || debounceRef.current) return
    debounceRef.current = true
    setTimeout(() => { debounceRef.current = false }, 500)
    const MAX_DURATION = 86400000 // 24 hours
    let duration = Date.now() - timer.startedAt
    let desc = timer.description || ''
    if (duration > MAX_DURATION) {
      desc = desc ? `${desc} (capped at 24h)` : '(capped at 24h)'
      duration = MAX_DURATION
    }
    store.saveEntry({
      projectId: timer.projectId,
      description: desc,
      startedAt: new Date(timer.startedAt).toISOString(),
      duration,
      date: new Date(timer.startedAt).toISOString().slice(0, 10),
    })
    store.clearTimer()
    setTimer(null)
    setDescription('')
    setElapsed(0)
    onEntryAdded?.()
  }, [timer, onEntryAdded])

  const project = projects.find(p => p.id === projectId)
  const client = project ? clients.find(c => c.id === project.clientId) : null

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#e2e8f0]">
        <div className="text-6xl font-mono font-light tracking-tight text-[#1e293b] tabular-nums">
          {formatDuration(elapsed)}
        </div>
        {running && project && (
          <div className="mt-3 text-sm text-[#64748b]">
            {project.name}{client ? ` · ${client.name}` : ''}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Project selector */}
        <div className="relative">
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            disabled={running}
            className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] appearance-none disabled:opacity-50 pr-10"
          >
            <option value="">Select a project...</option>
            {projects.map(p => {
              const c = clients.find(c => c.id === p.clientId)
              return <option key={p.id} value={p.id}>{p.name}{c ? ` (${c.name})` : ''}</option>
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
        </div>

        {/* Description */}
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={running}
          placeholder="What are you working on?"
          className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] placeholder-[#94a3b8] disabled:opacity-50"
        />

        {/* Start/Stop button */}
        <button
          onClick={running ? stop : start}
          disabled={!running && !projectId}
          className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 ${
            running
              ? 'bg-[#dc2626] hover:bg-[#b91c1c]'
              : 'bg-[#1B2A4A] hover:bg-[#132038]'
          }`}
        >
          {running ? <><Square className="w-5 h-5" /> Stop Timer</> : <><Play className="w-5 h-5" /> Start Timer</>}
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-center text-sm text-[#94a3b8]">
          Create a project first → go to the Projects tab
        </p>
      )}
    </div>
  )
}
