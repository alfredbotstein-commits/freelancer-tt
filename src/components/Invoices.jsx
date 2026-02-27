import { useState, useRef } from 'react'
import { store } from '../store'
import { formatMoney, formatHours } from '../utils'
import { isPremium } from '../premium'
import { jsPDF } from 'jspdf'
import { FileText, Download, ChevronDown, Check, Settings, ArrowLeft, Trash2, Eye, CircleDot, Send, CheckCircle2, Upload, Plus, Lock, Sparkles } from 'lucide-react'

const STATUS_COLORS = {
  draft: { bg: 'bg-[#f1f5f9]', text: 'text-[#64748b]', label: 'Draft' },
  sent: { bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]', label: 'Sent' },
  paid: { bg: 'bg-[#dcfce7]', text: 'text-[#16a34a]', label: 'Paid' },
}

const PAYMENT_TERMS = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']

function getDueDate(issueDate, terms) {
  const d = new Date(issueDate)
  if (terms === 'Due on Receipt') return d
  const days = parseInt(terms.replace('Net ', ''))
  d.setDate(d.getDate() + days)
  return d
}

function InvoiceSettingsPanel({ onBack }) {
  const [settings, setSettings] = useState(store.getInvoiceSettings())
  const fileRef = useRef()
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update('logoDataUrl', ev.target.result)
    reader.readAsDataURL(file)
  }

  const save = () => {
    store.saveInvoiceSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-[#2563eb] font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </button>
      <h2 className="text-lg font-semibold text-[#1e293b]">Invoice Settings</h2>

      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-4">
        <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wide">Your Business</h3>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Company / Your Name</label>
          <input value={settings.companyName} onChange={e => update('companyName', e.target.value)}
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="Acme Freelancing" />
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Email</label>
          <input value={settings.companyEmail} onChange={e => update('companyEmail', e.target.value)}
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="you@email.com" />
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Address</label>
          <textarea value={settings.companyAddress} onChange={e => update('companyAddress', e.target.value)}
            rows={2} className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="123 Main St, City, State" />
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Phone</label>
          <input value={settings.companyPhone} onChange={e => update('companyPhone', e.target.value)}
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="(555) 123-4567" />
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Logo</label>
          <div className="flex items-center gap-3">
            {settings.logoDataUrl ? (
              <img src={settings.logoDataUrl} alt="Logo" className="w-12 h-12 object-contain rounded border border-[#e2e8f0]" />
            ) : (
              <div className="w-12 h-12 rounded border border-dashed border-[#cbd5e1] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#94a3b8]" />
              </div>
            )}
            <button onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-[#2563eb] border border-[#2563eb] rounded-lg hover:bg-[#eff6ff]">
              {settings.logoDataUrl ? 'Change' : 'Upload'}
            </button>
            {settings.logoDataUrl && (
              <button onClick={() => update('logoDataUrl', '')}
                className="px-3 py-1.5 text-xs font-medium text-[#ef4444] border border-[#ef4444] rounded-lg hover:bg-[#fef2f2]">
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-4">
        <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wide">Invoice Defaults</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Number Prefix</label>
            <input value={settings.prefix} onChange={e => update('prefix', e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="INV" />
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Next Number</label>
            <input type="number" min={1} value={settings.nextNumber} onChange={e => update('nextNumber', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Default Payment Terms</label>
          <div className="relative">
            <select value={settings.defaultPaymentTerms} onChange={e => update('defaultPaymentTerms', e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm appearance-none pr-8">
              {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Default Tax Rate (%)</label>
          <input type="number" min={0} max={100} step={0.1} value={settings.defaultTaxRate}
            onChange={e => update('defaultTaxRate', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="0" />
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] mb-1 block">Default Notes</label>
          <textarea value={settings.defaultNotes} onChange={e => update('defaultNotes', e.target.value)}
            rows={2} className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="Thank you for your business!" />
        </div>
      </div>

      <button onClick={save}
        className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          saved ? 'bg-[#16a34a]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
        }`}>
        {saved ? <><Check className="w-5 h-5" /> Saved!</> : 'Save Settings'}
      </button>
    </div>
  )
}

function buildPDF(invoiceData) {
  const { settings, client, lineItems, invoiceNumber, issueDate, dueDate, paymentTerms, taxRate, notes, subtotal, taxAmount, total } = invoiceData
  const doc = new jsPDF()
  let y = 20

  // Logo
  if (settings.logoDataUrl) {
    try { doc.addImage(settings.logoDataUrl, 'PNG', 20, y, 30, 30); } catch {}
    y += 5
  }

  // From (right side)
  const fromX = settings.logoDataUrl ? 60 : 20
  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text(settings.companyName || 'INVOICE', fromX, y)
  y += 6
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  if (settings.companyEmail) { doc.text(settings.companyEmail, fromX, y); y += 4 }
  if (settings.companyPhone) { doc.text(settings.companyPhone, fromX, y); y += 4 }
  if (settings.companyAddress) {
    const lines = settings.companyAddress.split('\n')
    lines.forEach(l => { doc.text(l.trim(), fromX, y); y += 4 })
  }

  // Invoice meta (right side)
  let metaY = 20
  doc.setFontSize(24)
  doc.setTextColor(30, 41, 59)
  doc.text('INVOICE', 190, metaY, { align: 'right' })
  metaY += 8
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`# ${invoiceNumber}`, 190, metaY, { align: 'right' })
  metaY += 5
  doc.text(`Issued: ${issueDate}`, 190, metaY, { align: 'right' })
  metaY += 5
  doc.text(`Due: ${dueDate}`, 190, metaY, { align: 'right' })
  metaY += 5
  doc.text(`Terms: ${paymentTerms}`, 190, metaY, { align: 'right' })

  y = Math.max(y, metaY) + 10

  // Bill To
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('BILL TO', 20, y)
  y += 6
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text(client.name || 'Client', 20, y)
  y += 5
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  if (client.email) { doc.text(client.email, 20, y); y += 4 }
  if (client.phone) { doc.text(client.phone, 20, y); y += 4 }
  if (client.address) {
    client.address.split('\n').forEach(l => { doc.text(l.trim(), 20, y); y += 4 })
  }
  y += 8

  // Table header
  doc.setFillColor(248, 250, 252)
  doc.rect(20, y - 4, 170, 8, 'F')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('DESCRIPTION', 22, y)
  doc.text('HOURS', 115, y, { align: 'right' })
  doc.text('RATE', 145, y, { align: 'right' })
  doc.text('AMOUNT', 188, y, { align: 'right' })
  y += 8

  // Line items
  doc.setTextColor(30, 41, 59)
  lineItems.forEach(item => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(10)
    doc.text(item.description, 22, y)
    doc.text(item.hours.toFixed(2), 115, y, { align: 'right' })
    doc.text(formatMoney(item.rate), 145, y, { align: 'right' })
    doc.text(formatMoney(item.amount), 188, y, { align: 'right' })
    y += 6

    // Sub-entries
    if (item.entries?.length > 1) {
      doc.setFontSize(7)
      doc.setTextColor(148, 163, 184)
      item.entries.forEach(e => {
        if (y > 270) { doc.addPage(); y = 20 }
        const desc = e.description || 'Time entry'
        doc.text(`  ${e.date}  ${desc}  (${(e.duration / 3600000).toFixed(2)}h)`, 24, y)
        y += 3.5
      })
      doc.setTextColor(30, 41, 59)
      y += 2
    }
  })

  // Totals
  y += 6
  doc.setDrawColor(226, 232, 240)
  doc.line(120, y, 190, y)
  y += 7

  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text('Subtotal', 120, y)
  doc.setTextColor(30, 41, 59)
  doc.text(formatMoney(subtotal), 188, y, { align: 'right' })
  y += 6

  if (taxRate > 0) {
    doc.setTextColor(100, 116, 139)
    doc.text(`Tax (${taxRate}%)`, 120, y)
    doc.setTextColor(30, 41, 59)
    doc.text(formatMoney(taxAmount), 188, y, { align: 'right' })
    y += 6
  }

  doc.line(120, y, 190, y)
  y += 7
  doc.setFontSize(13)
  doc.setTextColor(30, 41, 59)
  doc.text('TOTAL DUE', 120, y)
  doc.setFontSize(14)
  doc.setTextColor(22, 163, 74)
  doc.text(formatMoney(total), 188, y, { align: 'right' })

  // Notes
  if (notes) {
    y += 14
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('NOTES', 20, y)
    y += 5
    doc.setFontSize(9)
    doc.setTextColor(30, 41, 59)
    const splitNotes = doc.splitTextToSize(notes, 170)
    doc.text(splitNotes, 20, y)
  }

  // Footer
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text('Generated by Freelance Timer', 105, 288, { align: 'center' })

  return doc
}

function PremiumUpsell() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-bold text-[#1e293b] mb-2">Unlock Invoicing</h2>
      <p className="text-sm text-[#64748b] text-center mb-6 max-w-xs">
        Generate professional invoices, track payments, and export reports with Freelance Timer Pro.
      </p>
      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] w-full max-w-xs space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-[#1e293b]">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <span>Professional PDF invoices</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1e293b]">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <span>Invoice history & tracking</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1e293b]">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <span>CSV export</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1e293b]">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <span>Unlimited projects</span>
        </div>
      </div>
      <button className="w-full max-w-xs py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] transition-all active:scale-[0.98]">
        Upgrade to Pro
      </button>
      <p className="text-xs text-[#94a3b8] mt-3">One-time purchase · No subscription</p>
    </div>
  )
}

export function Invoices() {
  const [view, setView] = useState('list') // list | create | settings
  const [clientId, setClientId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [taxRate, setTaxRate] = useState('')
  const [notes, setNotes] = useState('')
  const [generated, setGenerated] = useState(false)

  // Client detail fields for invoice
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const clients = store.getClients()
  const projects = store.getProjects()
  const entries = store.getEntries()
  const invoices = store.getInvoices()
  const settings = store.getInvoiceSettings()

  // Defaults from settings
  const effectiveTerms = paymentTerms || settings.defaultPaymentTerms || 'Net 30'
  const effectiveTax = taxRate !== '' ? parseFloat(taxRate) : settings.defaultTaxRate
  const effectiveNotes = notes || settings.defaultNotes || ''

  // When client changes, populate their details
  const handleClientChange = (id) => {
    setClientId(id)
    const c = clients.find(cl => cl.id === id)
    if (c) {
      setClientEmail(c.email || '')
      setClientAddress(c.address || '')
      setClientPhone(c.phone || '')
    } else {
      setClientEmail('')
      setClientAddress('')
      setClientPhone('')
    }
  }

  // Filter entries
  const filteredEntries = entries.filter(e => {
    const project = projects.find(p => p.id === e.projectId)
    if (!project) return false
    if (clientId && project.clientId !== clientId) return false
    if (dateFrom && e.date < dateFrom) return false
    if (dateTo && e.date > dateTo) return false
    return true
  })

  // Group by project for line items
  const byProject = {}
  filteredEntries.forEach(e => {
    if (!byProject[e.projectId]) byProject[e.projectId] = { entries: [], totalMs: 0 }
    byProject[e.projectId].entries.push(e)
    byProject[e.projectId].totalMs += e.duration
  })

  const lineItems = Object.entries(byProject).map(([pid, data]) => {
    const project = projects.find(p => p.id === pid)
    const hours = data.totalMs / 3600000
    const rate = project?.hourlyRate || 0
    return {
      description: project?.name || 'Unknown Project',
      hours,
      rate,
      amount: hours * rate,
      entries: data.entries,
    }
  })

  const subtotal = lineItems.reduce((s, i) => s + i.amount, 0)
  const taxAmount = subtotal * (effectiveTax / 100)
  const total = subtotal + taxAmount

  const generatePDF = () => {
    const client = clients.find(c => c.id === clientId)
    const invoiceNumber = store.getNextInvoiceNumber()
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const dueDate = getDueDate(new Date(), effectiveTerms).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const invoiceData = {
      settings,
      client: {
        name: client?.name || 'All Clients',
        email: clientEmail,
        address: clientAddress,
        phone: clientPhone,
      },
      lineItems,
      invoiceNumber,
      issueDate,
      dueDate,
      paymentTerms: effectiveTerms,
      taxRate: effectiveTax,
      notes: effectiveNotes,
      subtotal,
      taxAmount,
      total,
    }

    const doc = buildPDF(invoiceData)
    doc.save(`${invoiceNumber}.pdf`)

    // Save client details back if they have an id
    if (client && (clientEmail || clientAddress || clientPhone)) {
      store.saveClient({ ...client, email: clientEmail, address: clientAddress, phone: clientPhone })
    }

    store.saveInvoice({
      number: invoiceNumber,
      clientId,
      clientName: client?.name || 'All Clients',
      dateFrom,
      dateTo,
      subtotal,
      taxRate: effectiveTax,
      taxAmount,
      totalAmount: total,
      entryCount: filteredEntries.length,
      paymentTerms: effectiveTerms,
      status: 'draft',
      lineItems: lineItems.map(({ description, hours, rate, amount }) => ({ description, hours, rate, amount })),
    })
    store.incrementInvoiceNumber()
    setGenerated(true)
    setTimeout(() => { setGenerated(false); setView('list') }, 1500)
  }

  const updateStatus = (id, status) => {
    const inv = invoices.find(i => i.id === id)
    if (inv) store.saveInvoice({ ...inv, status })
    // Force re-render
    setView('list')
  }

  const deleteInvoice = (id) => {
    store.deleteInvoice(id)
    setView('list')
  }

  // Gate invoices behind premium
  if (!isPremium()) {
    return <PremiumUpsell />
  }

  if (view === 'settings') {
    return <InvoiceSettingsPanel onBack={() => setView('list')} />
  }

  if (view === 'create') {
    return (
      <div className="space-y-4">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-[#2563eb] font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-lg font-semibold text-[#1e293b]">New Invoice</h2>

        {/* Client Selection */}
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3">
          <h3 className="text-sm font-semibold text-[#64748b]">Client</h3>
          <div className="relative">
            <select value={clientId} onChange={e => handleClientChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm appearance-none pr-8">
              <option value="">All clients</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
          </div>
          {clientId && (
            <div className="space-y-2 pt-1">
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm" placeholder="Client email" />
              <input value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm" placeholder="Client phone" />
              <textarea value={clientAddress} onChange={e => setClientAddress(e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm" placeholder="Client address" />
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3">
          <h3 className="text-sm font-semibold text-[#64748b]">Period</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[#94a3b8] mb-1 block">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] mb-1 block">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Invoice Options */}
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] space-y-3">
          <h3 className="text-sm font-semibold text-[#64748b]">Invoice Details</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Invoice #</span>
            <span className="font-mono font-medium text-[#1e293b]">{store.getNextInvoiceNumber()}</span>
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Payment Terms</label>
            <div className="relative">
              <select value={effectiveTerms} onChange={e => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm appearance-none pr-8">
                {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Tax Rate (%)</label>
            <input type="number" min={0} max={100} step={0.1}
              value={effectiveTax} onChange={e => setTaxRate(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" placeholder="0" />
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] mb-1 block">Notes</label>
            <textarea value={effectiveNotes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm" />
          </div>
        </div>

        {/* Line Items Preview */}
        {filteredEntries.length > 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e8f0]">
              <span className="text-sm font-semibold text-[#1e293b]">Line Items ({filteredEntries.length} entries)</span>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {lineItems.map((item, i) => (
                <div key={i} className="px-4 py-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#1e293b]">{item.description}</span>
                    <span className="font-semibold text-[#1e293b]">{formatMoney(item.amount)}</span>
                  </div>
                  <div className="text-xs text-[#94a3b8] mt-0.5">
                    {item.hours.toFixed(2)}h × {formatMoney(item.rate)}/hr
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#e2e8f0] space-y-1">
              <div className="flex justify-between text-sm text-[#64748b]">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {effectiveTax > 0 && (
                <div className="flex justify-between text-sm text-[#64748b]">
                  <span>Tax ({effectiveTax}%)</span>
                  <span>{formatMoney(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1e293b] pt-1 border-t border-[#e2e8f0]">
                <span>Total</span>
                <span className="text-[#16a34a]">{formatMoney(total)}</span>
              </div>
            </div>

            <div className="p-3">
              <button onClick={generatePDF}
                className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  generated ? 'bg-[#16a34a]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                }`}>
                {generated ? <><Check className="w-5 h-5" /> Invoice Created!</> : <><Download className="w-5 h-5" /> Generate & Download PDF</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-[#94a3b8]">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No entries match your filters.</p>
            <p className="text-xs mt-1">Track some time, then come back to invoice.</p>
          </div>
        )}
      </div>
    )
  }

  // LIST VIEW (default)
  const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1e293b]">Invoices</h2>
        <button onClick={() => setView('settings')} className="p-2 rounded-lg hover:bg-[#f1f5f9] text-[#64748b]">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <button onClick={() => setView('create')}
        className="w-full py-3 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
        <Plus className="w-5 h-5" /> Create Invoice
      </button>

      {sortedInvoices.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] overflow-hidden">
          {sortedInvoices.map(inv => {
            const st = STATUS_COLORS[inv.status || 'draft']
            return (
              <div key={inv.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-sm text-[#1e293b]">{inv.number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-0.5">
                      {inv.clientName} · {inv.entryCount} entries · {new Date(inv.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#16a34a]">{formatMoney(inv.totalAmount)}</span>
                </div>
                {/* Status actions */}
                <div className="flex items-center gap-2 mt-2">
                  {(inv.status || 'draft') === 'draft' && (
                    <button onClick={() => updateStatus(inv.id, 'sent')}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#2563eb] bg-[#eff6ff] rounded-lg hover:bg-[#dbeafe]">
                      <Send className="w-3 h-3" /> Mark Sent
                    </button>
                  )}
                  {(inv.status || 'draft') === 'sent' && (
                    <button onClick={() => updateStatus(inv.id, 'paid')}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#16a34a] bg-[#f0fdf4] rounded-lg hover:bg-[#dcfce7]">
                      <CheckCircle2 className="w-3 h-3" /> Mark Paid
                    </button>
                  )}
                  {(inv.status || 'draft') !== 'paid' && (
                    <button onClick={() => deleteInvoice(inv.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#ef4444] bg-[#fef2f2] rounded-lg hover:bg-[#fee2e2]">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[#94a3b8]">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No invoices yet</p>
          <p className="text-xs mt-1">Create your first invoice from tracked time entries.</p>
        </div>
      )}
    </div>
  )
}
