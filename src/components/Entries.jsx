import { useState } from 'react'
import { store } from '../store'
import { formatDuration, formatMoney } from '../utils'
import { Plus, Trash2, X, ChevronDown } from 'lucide-react'

export function Entries({ onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ projectId: '', description: '', date: new Date().toISOString().slice(0, 10), hours: '', minutes: '' })
  const entries = store.getEntries().sort((a, b) => new Date(b.date) - new Date(a.date))
  const projects = store.getProjects()
  const clients = store.getClients()

  const save = () => {
    const h = Math.min(999, Math.max(0, parseFloat(form.hours || 0)))
    const m = Math.min(59, Math.max(0, parseFloat(form.minutes || 0)))
    const duration = (h * 3600 + m * 60) * 1000
    if (!form.projectId || duration <= 0) return
    store.saveEntry({
      projectId: form.projectId,
      description: form.description,
      date: form.date,
      duration,
      startedAt: new Date(form.date).toISOString(),
    })
    setShowForm(false)
    setForm({ projectId: '', description: '', date: new Date().toISOString().slice(0, 10), hours: '', minutes: '' })
    onUpdate?.()
  }

  const remove = (id) => {
    store.deleteEntry(id)
    onUpdate?.()
  }

  // Group by date
  const grouped = {}
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = []
    grouped[e.date].push(e)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1e293b]">Time Entries</h2>
        <button onClick={() => setShowForm(!showForm)} className="w-9 h-9 rounded-lg bg-[#2563eb] text-white flex items-center justify-center">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Manual entry form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3">
          <div className="relative">
            <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm appearance-none pr-8">
              <option value="">Select project...</option>
              {projects.map(p => {
                const c = clients.find(c => c.id === p.clientId)
                return <option key={p.id} value={p.id}>{p.name}{c ? ` (${c.name})` : ''}</option>
              })}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
          </div>
          <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
            max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
          <div className="flex gap-2">
            <input type="number" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })}
              placeholder="Hours" min="0" className="flex-1 px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            <input type="number" value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })}
              placeholder="Minutes" min="0" max="59" className="flex-1 px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
          </div>
          <button onClick={save} className="w-full py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-medium">
            Add Entry
          </button>
        </div>
      )}

      {/* Entries list grouped by date */}
      {Object.entries(grouped).map(([date, dayEntries]) => (
        <div key={date}>
          <div className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-2">
            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] overflow-hidden">
            {dayEntries.map(entry => {
              const project = projects.find(p => p.id === entry.projectId)
              const client = project ? clients.find(c => c.id === project.clientId) : null
              const rate = project?.hourlyRate || 0
              const earned = (entry.duration / 3600000) * rate
              return (
                <div key={entry.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#1e293b] truncate">
                      {project?.name || 'Unknown'}{client ? ` · ${client.name}` : ''}
                    </div>
                    {entry.description && <div className="text-xs text-[#94a3b8] truncate">{entry.description}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono text-[#1e293b]">{formatDuration(entry.duration)}</div>
                    {rate > 0 && <div className="text-xs text-[#16a34a]">{formatMoney(earned)}</div>}
                  </div>
                  <button onClick={() => remove(entry.id)} className="text-[#cbd5e1] hover:text-[#dc2626] p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-12 text-[#94a3b8]">
          <p className="text-sm">No entries yet.</p>
          <p className="text-xs mt-1">Start a timer or add one manually.</p>
        </div>
      )}
    </div>
  )
}
