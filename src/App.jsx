import { useState } from 'react'
import { Timer } from './components/Timer'
import { Dashboard } from './components/Dashboard'
import { Entries } from './components/Entries'
import { Projects } from './components/Projects'
import { Invoices } from './components/Invoices'
import { Clock, LayoutDashboard, List, FolderOpen, FileText } from 'lucide-react'

const tabs = [
  { id: 'timer', label: 'Timer', icon: Clock },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'entries', label: 'Entries', icon: List },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'invoices', label: 'Invoices', icon: FileText },
]

export default function App() {
  const [tab, setTab] = useState('timer')
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey(k => k + 1)

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between safe-area-pt">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-[#1e293b]">Freelance Timer</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 py-4 max-w-2xl mx-auto w-full">
        {tab === 'timer' && <Timer key={refreshKey} onEntryAdded={refresh} />}
        {tab === 'dashboard' && <Dashboard key={refreshKey} />}
        {tab === 'entries' && <Entries key={refreshKey} onUpdate={refresh} />}
        {tab === 'projects' && <Projects key={refreshKey} onUpdate={refresh} />}
        {tab === 'invoices' && <Invoices key={refreshKey} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] flex justify-around py-2 px-1 safe-area-pb">
        {tabs.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[56px] ${
                active ? 'text-[#2563eb]' : 'text-[#94a3b8] hover:text-[#64748b]'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
