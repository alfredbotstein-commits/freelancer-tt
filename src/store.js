// localStorage-backed store for all app data
const KEYS = {
  clients: 'ftt_clients',
  projects: 'ftt_projects',
  entries: 'ftt_entries',
  timer: 'ftt_timer',
  invoices: 'ftt_invoices',
  invoiceSettings: 'ftt_invoice_settings',
};

function get(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function set(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

// Sanitize string: trim, cap length, strip control chars (keep emojis)
function sanitizeString(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, '');
}

export const store = {
  // Clients
  getClients: () => get(KEYS.clients),
  saveClient: (client) => {
    const clients = get(KEYS.clients);
    const sanitized = { ...client, name: sanitizeString(client.name) };
    const existing = clients.findIndex(c => c.id === sanitized.id);
    if (existing >= 0) clients[existing] = { ...clients[existing], ...sanitized };
    else clients.push({ ...sanitized, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.clients, clients);
    return clients;
  },
  deleteClient: (id) => {
    // Get projects belonging to this client
    const projects = get(KEYS.projects);
    const clientProjectIds = projects.filter(p => p.clientId === id).map(p => p.id);

    // Delete entries belonging to client's projects
    const entries = get(KEYS.entries).filter(e => !clientProjectIds.includes(e.projectId));
    set(KEYS.entries, entries);

    // Delete client's projects
    const remainingProjects = projects.filter(p => p.clientId !== id);
    set(KEYS.projects, remainingProjects);

    // Delete client
    const clients = get(KEYS.clients).filter(c => c.id !== id);
    set(KEYS.clients, clients);
    return clients;
  },

  // Projects
  getProjects: () => get(KEYS.projects),
  saveProject: (project) => {
    const projects = get(KEYS.projects);
    const sanitized = { ...project, name: sanitizeString(project.name) };
    const existing = projects.findIndex(p => p.id === sanitized.id);
    if (existing >= 0) projects[existing] = sanitized;
    else projects.push({ ...sanitized, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    set(KEYS.projects, projects);
    return projects;
  },
  deleteProject: (id) => {
    // Delete entries belonging to this project
    const entries = get(KEYS.entries).filter(e => e.projectId !== id);
    set(KEYS.entries, entries);

    // Delete project
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
    if (invoice.id) {
      const idx = invoices.findIndex(i => i.id === invoice.id);
      if (idx >= 0) { invoices[idx] = { ...invoices[idx], ...invoice }; }
      else invoices.push({ ...invoice, createdAt: new Date().toISOString() });
    } else {
      invoices.push({ ...invoice, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    }
    set(KEYS.invoices, invoices);
    return invoices;
  },
  deleteInvoice: (id) => {
    const invoices = get(KEYS.invoices).filter(i => i.id !== id);
    set(KEYS.invoices, invoices);
    return invoices;
  },

  // Invoice settings
  getInvoiceSettings: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.invoiceSettings)) || {
        prefix: 'INV',
        nextNumber: 1,
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        companyPhone: '',
        logoDataUrl: '',
        defaultPaymentTerms: 'Net 30',
        defaultTaxRate: 0,
        defaultNotes: 'Thank you for your business!',
      };
    } catch {
      return { prefix: 'INV', nextNumber: 1, companyName: '', companyEmail: '', companyAddress: '', companyPhone: '', logoDataUrl: '', defaultPaymentTerms: 'Net 30', defaultTaxRate: 0, defaultNotes: 'Thank you for your business!' };
    }
  },
  saveInvoiceSettings: (settings) => {
    localStorage.setItem(KEYS.invoiceSettings, JSON.stringify(settings));
  },
  getNextInvoiceNumber: () => {
    const settings = store.getInvoiceSettings();
    const num = settings.nextNumber || 1;
    const prefix = settings.prefix || 'INV';
    return `${prefix}-${String(num).padStart(4, '0')}`;
  },
  incrementInvoiceNumber: () => {
    const settings = store.getInvoiceSettings();
    settings.nextNumber = (settings.nextNumber || 1) + 1;
    store.saveInvoiceSettings(settings);
  },
};
