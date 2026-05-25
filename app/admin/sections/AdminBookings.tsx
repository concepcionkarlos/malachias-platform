'use client'

import { useEffect, useState, useRef } from 'react'
import { X, ChevronRight, Mail, Clock, Search, List, Columns, Send } from 'lucide-react'
import type { BookingRequest, BookingStatus, EmailTemplate, BookingEmailLog } from '@/lib/data'

// ── Style tokens ──────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }

const BOOKING_STATUSES: BookingStatus[] = ['New','Contacted','Quote Sent','Follow-up','Negotiating','Confirmed','Advance Sent','Paid','Completed','Lost']

const STATUS_COLOR: Record<BookingStatus, string> = {
  'New': '#c9a84c',
  'Contacted': '#60a5fa',
  'Quote Sent': '#a78bfa',
  'Follow-up': '#fb923c',
  'Negotiating': '#f472b6',
  'Confirmed': '#34d399',
  'Advance Sent': '#10b981',
  'Paid': '#059669',
  'Completed': '#8a7f70',
  'Lost': '#c04020',
  'Archived': '#5c5044',
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
      background: STATUS_COLOR[status] + '22',
      color: STATUS_COLOR[status],
      border: `1px solid ${STATUS_COLOR[status]}44`,
    }}>
      {status}
    </span>
  )
}

function fmtDate(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtTs(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// ── Variable extraction from template ─────────────────────────────────────────
function extractVars(tpl: EmailTemplate): string[] {
  const matches = (tpl.subject + ' ' + tpl.bodyHtml).match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}

function renderTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

// ── Email Composer ─────────────────────────────────────────────────────────────
function EmailComposer({ booking }: { booking: BookingRequest }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [vars, setVars] = useState<Record<string, string>>({})
  const [replyTo, setReplyTo] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/email-templates').then(r => r.json()).then((d: EmailTemplate[]) => {
      setTemplates(d)
      if (d.length) setSelectedId(d[0].id)
    }).catch(() => {})
  }, [])

  const tpl = templates.find(t => t.id === selectedId)
  const varNames = tpl ? extractVars(tpl) : []

  // seed vars with booking data on template change
  useEffect(() => {
    if (!tpl) return
    const seed: Record<string, string> = {
      clientName: booking.fullName,
      fullName: booking.fullName,
      venueOrOrg: booking.venueOrOrg,
      eventDate: fmtDate(booking.eventDate),
      city: booking.city,
      eventType: booking.eventType,
      budgetRange: booking.budgetRange,
    }
    setVars(seed)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    if (!tpl) return
    setSending(true); setError('')
    try {
      const res = await fetch(`/api/bookings/${booking.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: tpl, vars, replyTo: replyTo || undefined }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      setSent(true); setTimeout(() => setSent(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally { setSending(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={LABEL}>TEMPLATE</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
          style={{ ...INPUT, cursor: 'pointer' }}>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      {tpl && (
        <div style={{ padding: '8px 12px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, fontSize: 12, color: '#c9a84c' }}>
          Subject preview: {renderTemplate(tpl.subject, vars)}
        </div>
      )}
      {varNames.length > 0 && (
        <div>
          <label style={LABEL}>TEMPLATE VARIABLES</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {varNames.map(v => (
              <div key={v}>
                <label style={{ ...LABEL, marginBottom: 3 }}>{v}</label>
                <input value={vars[v] ?? ''} onChange={e => setVars(p => ({ ...p, [v]: e.target.value }))}
                  style={INPUT} placeholder={`Value for {{${v}}}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <label style={LABEL}>REPLY-TO (optional)</label>
        <input value={replyTo} onChange={e => setReplyTo(e.target.value)} style={INPUT} placeholder="reply@example.com" />
      </div>
      {error && <div style={{ fontSize: 12, color: '#c04020' }}>{error}</div>}
      <button onClick={handleSend} disabled={sending || !tpl}
        style={{ ...BTN, background: sent ? '#34d399' : '#c9a84c', color: '#070707', fontWeight: 700, justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
        <Send size={14} /> {sent ? 'Sent!' : sending ? 'Sending…' : 'Send Email'}
      </button>
    </div>
  )
}

// ── Email History ──────────────────────────────────────────────────────────────
function EmailHistory({ bookingId }: { bookingId: string }) {
  const [logs, setLogs] = useState<BookingEmailLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}/email-logs`).then(r => r.json()).then((d: BookingEmailLog[]) => {
      setLogs(d); setLoading(false)
    }).catch(() => setLoading(false))
  }, [bookingId])

  if (loading) return <div style={{ color: '#5c5044', fontSize: 13 }}>Loading…</div>
  if (!logs.length) return <div style={{ color: '#5c5044', fontSize: 13 }}>No emails sent yet.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {logs.map(l => (
        <div key={l.id} style={{ ...CARD, padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e8ddd0' }}>{l.subject}</span>
            <span style={{ fontSize: 11, color: l.status === 'sent' ? '#34d399' : '#c04020' }}>{l.status}</span>
          </div>
          <div style={{ fontSize: 11, color: '#8a7f70' }}>To: {l.toEmail} · {fmtTs(l.sentAt)}</div>
        </div>
      ))}
    </div>
  )
}

// ── Booking Drawer ─────────────────────────────────────────────────────────────
function BookingDrawer({
  booking, onClose, onUpdate,
}: {
  booking: BookingRequest
  onClose: () => void
  onUpdate: (updated: BookingRequest) => void
}) {
  const [tab, setTab] = useState<'details'|'email'|'history'>('details')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<BookingRequest>(booking)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setForm(booking); setEditing(false) }, [booking.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function setField(k: keyof BookingRequest, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRequests: 'merge-item', item: { ...form, updatedAt: new Date().toISOString() } }),
      })
      if (!res.ok) throw new Error()
      onUpdate({ ...form, updatedAt: new Date().toISOString() })
      setEditing(false)
    } catch {
      setError('Save failed')
    } finally { setSaving(false) }
  }

  async function saveField(k: keyof BookingRequest, v: unknown) {
    const updated = { ...booking, [k]: v, updatedAt: new Date().toISOString() }
    onUpdate(updated)
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingRequests: 'merge-item', item: updated }),
    })
  }

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px',
    fontSize: 12, letterSpacing: '0.08em', fontFamily: 'var(--font-body)',
    color: active ? '#c9a84c' : '#8a7f70',
    borderBottom: active ? '2px solid #c9a84c' : '2px solid transparent',
  })

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
      background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.07)',
      zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8ddd0' }}>{booking.fullName}</div>
          <div style={{ fontSize: 12, color: '#8a7f70', marginTop: 2 }}>{booking.venueOrOrg}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Status row */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <StatusBadge status={booking.status} />
        <select
          value={form.status}
          onChange={e => { const v = e.target.value as BookingStatus; setField('status', v); saveField('status', v) }}
          style={{ ...INPUT, width: 'auto', fontSize: 12, padding: '4px 8px', cursor: 'pointer' }}>
          {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button style={TAB_STYLE(tab === 'details')} onClick={() => setTab('details')}>DETAILS</button>
        <button style={TAB_STYLE(tab === 'email')} onClick={() => setTab('email')}><Mail size={12} /> SEND EMAIL</button>
        <button style={TAB_STYLE(tab === 'history')} onClick={() => setTab('history')}><Clock size={12} /> HISTORY</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {tab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Event Date', fmtDate(booking.eventDate)],
                ['City', booking.city],
                ['Event Type', booking.eventType],
                ['Budget', booking.budgetRange],
                ['Guest Count', booking.guestCount],
                ['Source', booking.source],
              ].map(([label, val]) => (
                <div key={label} style={{ ...CARD, padding: '8px 12px' }}>
                  <div style={{ ...LABEL, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#e8ddd0' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{ ...CARD, padding: '10px 14px' }}>
              <div style={{ ...LABEL, marginBottom: 6 }}>CONTACT</div>
              <div style={{ fontSize: 13, color: '#e8ddd0', marginBottom: 2 }}>{booking.email}</div>
              <div style={{ fontSize: 13, color: '#8a7f70' }}>{booking.phone}</div>
            </div>

            {/* Message */}
            <div>
              <label style={LABEL}>MESSAGE</label>
              <div style={{ fontSize: 13, color: '#e8ddd0', lineHeight: 1.6, padding: '10px 14px', ...CARD }}>
                {booking.message || <span style={{ color: '#5c5044' }}>No message</span>}
              </div>
            </div>

            {/* Editable fields */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ ...LABEL, marginBottom: 0 }}>ADMIN FIELDS</label>
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#e8ddd0', padding: '4px 10px', fontSize: 12 }}>
                    Edit
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={LABEL}>QUOTE AMOUNT</label>
                  <input type="number" value={form.quoteAmount ?? ''} readOnly={!editing}
                    onChange={e => setField('quoteAmount', e.target.value ? Number(e.target.value) : undefined)}
                    style={{ ...INPUT, background: editing ? 'rgba(255,255,255,0.05)' : 'transparent' }} placeholder="0.00" />
                </div>
                <div>
                  <label style={LABEL}>ASSIGNED TO</label>
                  <input value={form.assignedTo ?? ''} readOnly={!editing}
                    onChange={e => setField('assignedTo', e.target.value)}
                    style={{ ...INPUT, background: editing ? 'rgba(255,255,255,0.05)' : 'transparent' }} />
                </div>
                <div>
                  <label style={LABEL}>FOLLOW-UP DATE</label>
                  <input type="date" value={form.followUpDate ?? ''} readOnly={!editing}
                    onChange={e => setField('followUpDate', e.target.value)}
                    style={{ ...INPUT, background: editing ? 'rgba(255,255,255,0.05)' : 'transparent', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={LABEL}>NOTES</label>
                  <textarea value={form.notes ?? ''} readOnly={!editing}
                    onChange={e => setField('notes', e.target.value)}
                    onBlur={() => { if (!editing) saveField('notes', form.notes) }}
                    rows={4} style={{ ...INPUT, resize: 'vertical', background: editing ? 'rgba(255,255,255,0.05)' : 'transparent' }} />
                </div>
              </div>
              {editing && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={save} disabled={saving}
                    style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setForm(booking); setEditing(false) }}
                    style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#8a7f70' }}>
                    Cancel
                  </button>
                </div>
              )}
              {error && <div style={{ fontSize: 12, color: '#c04020', marginTop: 6 }}>{error}</div>}
            </div>

            <div style={{ fontSize: 11, color: '#5c5044', paddingTop: 4 }}>
              Created {fmtTs(booking.createdAt)} · Updated {fmtTs(booking.updatedAt)}
            </div>
          </div>
        )}
        {tab === 'email' && <EmailComposer booking={booking} />}
        {tab === 'history' && <EmailHistory bookingId={booking.id} />}
      </div>
    </div>
  )
}

// ── Kanban column ──────────────────────────────────────────────────────────────
function KanbanColumn({ status, bookings, onSelect }: {
  status: BookingStatus
  bookings: BookingRequest[]
  onSelect: (b: BookingRequest) => void
}) {
  return (
    <div style={{ minWidth: 230, maxWidth: 230, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[status], display: 'inline-block' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: STATUS_COLOR[status] }}>{status.toUpperCase()}</span>
        <span style={{ fontSize: 11, color: '#5c5044' }}>({bookings.length})</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bookings.length === 0 && (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#5c5044', fontSize: 12, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8 }}>
            Empty
          </div>
        )}
        {bookings.map(b => (
          <div key={b.id} onClick={() => onSelect(b)}
            style={{ ...CARD, padding: '10px 12px', cursor: 'pointer', borderLeft: `3px solid ${STATUS_COLOR[status]}` }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8ddd0', marginBottom: 3 }}>{b.fullName}</div>
            <div style={{ fontSize: 11, color: '#8a7f70', marginBottom: 3 }}>{b.venueOrOrg}</div>
            <div style={{ fontSize: 11, color: '#5c5044' }}>{fmtDate(b.eventDate)}</div>
            {b.eventType && <div style={{ fontSize: 11, color: '#5c5044' }}>{b.eventType}</div>}
            {b.budgetRange && <div style={{ fontSize: 11, color: '#c9a84c', marginTop: 4 }}>{b.budgetRange}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'kanban'|'list'>('kanban')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<BookingStatus|''>('')
  const [selected, setSelected] = useState<BookingRequest|null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setBookings(d.bookingRequests ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load bookings'); setLoading(false) })
  }, [])

  function handleUpdate(updated: BookingRequest) {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b))
    setSelected(updated)
  }

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !search || b.fullName.toLowerCase().includes(q) || b.venueOrOrg.toLowerCase().includes(q) || b.email.toLowerCase().includes(q)
    const matchStatus = !filterStatus || b.status === filterStatus
    return matchSearch && matchStatus
  })

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading bookings…</div>
  if (error) return <div style={{ color: '#c04020', padding: 40, textAlign: 'center' }}>{error}</div>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0', position: 'relative', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, color: '#e8ddd0', fontWeight: 700 }}>
          BOOKING REQUESTS
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5c5044' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings…"
              style={{ ...INPUT, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as BookingStatus|'')}
            style={{ ...INPUT, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
            <button onClick={() => setView('kanban')}
              style={{ ...BTN, borderRadius: 0, background: view === 'kanban' ? 'rgba(201,168,76,0.15)' : 'transparent', color: view === 'kanban' ? '#c9a84c' : '#8a7f70', border: 'none', padding: '6px 12px' }}>
              <Columns size={14} />
            </button>
            <button onClick={() => setView('list')}
              style={{ ...BTN, borderRadius: 0, background: view === 'list' ? 'rgba(201,168,76,0.15)' : 'transparent', color: view === 'list' ? '#c9a84c' : '#8a7f70', border: 'none', padding: '6px 12px' }}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary counts */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['New','Confirmed','Paid','Completed','Lost'] as BookingStatus[]).map(s => {
          const count = bookings.filter(b => b.status === s).length
          return (
            <div key={s} style={{ padding: '6px 12px', background: STATUS_COLOR[s] + '15', border: `1px solid ${STATUS_COLOR[s]}33`, borderRadius: 99, fontSize: 12, color: STATUS_COLOR[s] }}>
              {s}: {count}
            </div>
          )
        })}
        <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, fontSize: 12, color: '#8a7f70' }}>
          Total: {bookings.length}
        </div>
      </div>

      {/* Views */}
      {view === 'kanban' ? (
        <div style={{ overflowX: 'auto', paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
            {BOOKING_STATUSES.map(s => (
              <KanbanColumn key={s} status={s} bookings={filtered.filter(b => b.status === s)} onSelect={setSelected} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Name', 'Venue / Org', 'Event Date', 'Type', 'Budget', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#5c5044' }}>No bookings found</td></tr>
              )}
              {filtered.map((b, i) => (
                <tr key={b.id}
                  onClick={() => setSelected(b)}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}>
                  <td style={{ padding: '10px 14px', color: '#e8ddd0', fontWeight: 600 }}>{b.fullName}</td>
                  <td style={{ padding: '10px 14px', color: '#8a7f70' }}>{b.venueOrOrg}</td>
                  <td style={{ padding: '10px 14px', color: '#8a7f70' }}>{fmtDate(b.eventDate)}</td>
                  <td style={{ padding: '10px 14px', color: '#8a7f70' }}>{b.eventType}</td>
                  <td style={{ padding: '10px 14px', color: '#c9a84c' }}>{b.budgetRange}</td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: '10px 14px' }}><ChevronRight size={14} style={{ color: '#5c5044' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay backdrop */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}

      {/* Drawer */}
      {selected && (
        <BookingDrawer booking={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
      )}
    </div>
  )
}
