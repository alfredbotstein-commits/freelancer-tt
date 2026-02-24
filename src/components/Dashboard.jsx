import { store } from '../store'
import { formatHours, formatMoney, isThisWeek } from '../utils'
import { Clock, DollarSign, Users, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const entries = store.getEntries()
  const projects = store.getProjects()
  const clients = store.getClients()

  const weekEntries = entries.filter(e => isThisWeek(e.date))
  const totalWeekMs = weekEntries.reduce((sum, e) => sum + e.duration, 0)
  const totalAllMs = entries.reduce((sum, e) => sum + e.duration, 0)

  // Billable totals
  const billableTotal = entries.reduce((sum, e) => {
    const project = projects.find(p => p.id === e.projectId)
    if (!project) return sum
    return sum + (e.duration / 3600000) * (project.hourlyRate || 0)
  }, 0)

  const weekBillable = weekEntries.reduce((sum, e) => {
    const project = projects.find(p => p.id === e.projectId)
    if (!project) return sum
    return sum + (e.duration / 3600000) * (project.hourlyRate || 0)
  }, 0)

  // Per-client breakdown
  const clientBreakdown = clients.map(client => {
    const clientProjects = projects.filter(p => p.clientId === client.id)
    const clientEntries = entries.filter(e => clientProjects.some(p => p.id === e.projectId))
    const totalMs = clientEntries.reduce((sum, e) => sum + e.duration, 0)
    const billable = clientEntries.reduce((sum, e) => {
      const project = clientProjects.find(p => p.id === e.projectId)
      return sum + (e.duration / 3600000) * (project?.hourlyRate || 0)
    }, 0)
    const weekMs = clientEntries.filter(e => isThisWeek(e.date)).reduce((sum, e) => sum + e.duration, 0)
    return { ...client, totalMs, billable, weekMs, entryCount: clientEntries.length }
  }).filter(c => c.entryCount > 0).sort((a, b) => b.billable - a.billable)

  const StatCard = ({ icon: Icon, label, value, sub, color = '#2563eb' }) => (
    <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-[#1e293b]">{value}</div>
      {sub && <div className="text-xs text-[#94a3b8] mt-0.5">{sub}</div>}
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e293b]">Dashboard</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Clock} label="This Week" value={`${formatHours(totalWeekMs)}h`} sub={`${weekEntries.length} entries`} />
        <StatCard icon={DollarSign} label="Week Billable" value={formatMoney(weekBillable)} color="#16a34a" />
        <StatCard icon={TrendingUp} label="All Time" value={`${formatHours(totalAllMs)}h`} sub={`${entries.length} entries`} />
        <StatCard icon={DollarSign} label="Total Billable" value={formatMoney(billableTotal)} color="#16a34a" />
      </div>

      {/* Client breakdown */}
      {clientBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2563eb]" />
            <h3 className="text-sm font-semibold text-[#1e293b]">Per Client</h3>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {clientBreakdown.map(c => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-[#1e293b]">{c.name}</div>
                  <div className="text-xs text-[#94a3b8]">{formatHours(c.totalMs)}h total · {formatHours(c.weekMs)}h this week</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-[#16a34a]">{formatMoney(c.billable)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-12 text-[#94a3b8]">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No time tracked yet.</p>
          <p className="text-xs mt-1">Start a timer or add a manual entry.</p>
        </div>
      )}
    </div>
  )
}
