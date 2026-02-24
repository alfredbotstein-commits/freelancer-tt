// localStorage-backed store for all app data
const KEYS = {
  clients: 'ftt_clients',
  projects: 'ftt_projects',
  entries: 'ftt_entries',
  timer: 'ftt_timer',
  invoices: 'ftt_invoices',
};

function get(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

export const store = {
  // Clients
  getClients: () => get(KEYS.clients),
  saveClient: (client) => {
    const clients = get(KEYS.clients);
    const existing = clients.findIndex(c => c.id === client.id);
    if (existing >= 0) clients[existing] = client;
    else clients.push({ ...client, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.clients, clients);
    return clients;
  },
  deleteClient: (id) => {
    const clients = get(KEYS.clients).filter(c => c.id !== id);
    set(KEYS.clients, clients);
    return clients;
  },

  // Projects
  getProjects: () => get(KEYS.projects),
  saveProject: (project) => {
    const projects = get(KEYS.projects);
    const existing = projects.findIndex(p => p.id === project.id);
    if (existing >= 0) projects[existing] = project;
    else projects.push({ ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.projects, projects);
    return projects;
  },
  deleteProject: (id) => {
    const projects = get(KEYS.projects).filter(p => p.id !== id);
    set(KEYS.projects, projects);
    return projects;
  },

  // Time entries
  getEntries: () => get(KEYS.entries),
  saveEntry: (entry) => {
    const entries = get(KEYS.entries);
    const existing = entries.findIndex(e => e.id === entry.id);
    if (existing >= 0) entries[existing] = entry;
    else entries.push({ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.entries, entries);
    return entries;
  },
  deleteEntry: (id) => {
    const entries = get(KEYS.entries).filter(e => e.id !== id);
    set(KEYS.entries, entries);
    return entries;
  },

  // Timer state
  getTimer: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.timer)); } catch { return null; }
  },
  setTimer: (timer) => { localStorage.setItem(KEYS.timer, JSON.stringify(timer)); },
  clearTimer: () => { localStorage.removeItem(KEYS.timer); },

  // Invoices
  getInvoices: () => get(KEYS.invoices),
  saveInvoice: (invoice) => {
    const invoices = get(KEYS.invoices);
    invoices.push({ ...invoice, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.invoices, invoices);
    return invoices;
  },
};
