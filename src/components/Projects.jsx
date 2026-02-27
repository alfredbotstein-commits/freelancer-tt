import { useState } from 'react'
import { store } from '../store'
import { formatMoney } from '../utils'
import { isPremium, FREE_PROJECT_LIMIT } from '../premium'
import { Plus, X, Trash2, ChevronDown, User, Briefcase, Lock } from 'lucide-react'

export function Projects({ onUpdate }) {
  const [showClientForm, setShowClientForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [clientForm, setClientForm] = useState({ name: '', email: '' })
  const [projectForm, setProjectForm] = useState({ name: '', clientId: '', hourlyRate: '' })

  const clients = store.getClients()
  const projects = store.getProjects()

  const canAddProject = isPremium() || projects.length < FREE_PROJECT_LIMIT
  const projectsRemaining = FREE_PROJECT_LIMIT - projects.length

  const saveClient = () => {
    if (!clientForm.name.trim()) return
    store.saveClient({ name: clientForm.name.trim(), email: clientForm.email.trim() })
    setClientForm({ name: '', email: '' })
    setShowClientForm(false)
    onUpdate?.()
  }

  const saveProject = () => {
    if (!projectForm.name.trim() || !projectForm.clientId) return
    store.saveProject({
      name: projectForm.name.trim(),
      clientId: projectForm.clientId,
      hourlyRate: parseFloat(projectForm.hourlyRate) || 0,
    })
    setProjectForm({ name: '', clientId: '', hourlyRate: '' })
    setShowProjectForm(false)
    onUpdate?.()
  }

  const deleteClient = (id) => { store.deleteClient(id); onUpdate?.() }
  const deleteProject = (id) => { store.deleteProject(id); onUpdate?.() }

  return (
    <div className="space-y-6">
      {/* Clients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563eb]" /> Clients
          </h2>
          <button onClick={() => setShowClientForm(!showClientForm)} className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center">
            {showClientForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {showClientForm && (
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3 mb-3">
            <input type="text" value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
              placeholder="Client name" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            <input type="email" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
              placeholder="Email (optional)" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            <button onClick={saveClient} className="w-full py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-medium">Add Client</button>
          </div>
        )}

        {clients.length > 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] overflow-hidden">
            {clients.map(c => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-[#1e293b]">{c.name}</div>
                  {c.email && <div className="text-xs text-[#94a3b8]">{c.email}</div>}
                </div>
                <button onClick={() => deleteClient(c.id)} className="text-[#cbd5e1] hover:text-[#dc2626] p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#94a3b8] text-center py-4">No clients yet. Add one above.</p>
        )}
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#2563eb]" /> Projects
            </h2>
            {!isPremium() && (
              <p className="text-xs text-[#94a3b8]">
                {projectsRemaining > 0 ? `${projectsRemaining} free project${projectsRemaining === 1 ? '' : 's'} remaining` : 'Upgrade for more projects'}
              </p>
            )}
          </div>
          <button onClick={() => setShowProjectForm(!showProjectForm)} className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center">
            {showProjectForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {showProjectForm && (
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3 mb-3">
            <input type="text" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
              placeholder="Project name" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            <div className="relative">
              <select value={projectForm.clientId} onChange={e => setProjectForm({ ...projectForm, clientId: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm appearance-none pr-8">
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#94a3b8]">$</span>
              <input type="number" value={projectForm.hourlyRate} onChange={e => setProjectForm({ ...projectForm, hourlyRate: e.target.value })}
                placeholder="0.00" min="0" step="0.01" className="w-full pl-7 pr-16 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8]">/hour</span>
            </div>
            <button onClick={saveProject} disabled={clients.length === 0 || !canAddProject} className="w-full py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-medium disabled:opacity-40">
              Add Project
            </button>
            {clients.length === 0 && <p className="text-xs text-[#f59e0b] text-center">Add a client first</p>}
            {!canAddProject && (
              <div className="flex items-center gap-2 justify-center text-xs text-[#f59e0b]">
                <Lock className="w-3 h-3" />
                <span>Upgrade to Pro for unlimited projects</span>
              </div>
            )}
          </div>
        )}

        {projects.length > 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] overflow-hidden">
            {projects.map(p => {
              const c = clients.find(c => c.id === p.clientId)
              return (
                <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-[#1e293b]">{p.name}</div>
                    <div className="text-xs text-[#94a3b8]">{c?.name || 'No client'} · {formatMoney(p.hourlyRate || 0)}/hr</div>
                  </div>
                  <button onClick={() => deleteProject(p.id)} className="text-[#cbd5e1] hover:text-[#dc2626] p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-[#94a3b8] text-center py-4">No projects yet. Add a client first, then create a project.</p>
        )}
      </div>
    </div>
  )
}
