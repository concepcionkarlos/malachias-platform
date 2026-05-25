'use client'

import { useEffect, useState } from 'react'
import { X, ChevronDown, ChevronUp, Send, Clock } from 'lucide-react'
import type { SongRequest, SongRequestStatus, EmailTemplate, BookingEmailLog } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }

const SONG_STATUSES: SongRequestStatus[] = ['New', 'Review', 'Consider', 'Added', 'Declined']

const STATUS_COLOR: Record<SongRequestStatus, string> = {
  'New': '#c9a84c',
  'Review': '#60a5fa',
  'Consider': '#a78bfa',
  'Added': '#34d399',
  'Declined': '#c04020',
}

function StatusBadge({ status }: { status: SongRequestStatus }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
      background: STATUS_COLOR[status] + '22', color: STATUS_COLOR[status],
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

function songs(s: SongRequest) {
  return [s.song1, s.song2, s.song3].filter(Boolean).join(', ')
}

function extractVars(tpl: EmailTemplate): string[] {
  const matches = (tpl.subject + ' ' + tpl.bodyHtml).match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}
function renderTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

// ── Send Reply Modal ───────────────────────────────────────────────────────────
function SendReplyModal({ songRequest, onClose }: { songRequest: SongRequest; onClose: () => void }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [vars, setVars] = useState<Record<string, string>>({})
  const [replyTo, setReplyTo] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/email-templates').then(r => r.json()).then((d: EmailTemplate[]) => {
      // Prioritize song-request-reply slug
      const sorted = [...d].sort((a, b) => {
        if (a.slug === 'song-request-reply') return -1
        if (b.slug === 'song-request-reply') return 1
        return 0
      })
      setTemplates(sorted)
      if (sorted.length) setSelectedId(sorted[0].id)
    }).catch(() => {})
  }, [])

  const tpl = templates.find(t => t.id === selectedId)
  const varNames = tpl ? extractVars(tpl) : []

  useEffect(() => {
    if (!tpl) return
    setVars({
      fullName: songRequest.fullName,
      song1: songRequest.song1,
      songs: songs(songRequest),
      eventDate: fmtDate(songRequest.eventDate),
    })
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    if (!tpl) return
    setSending(true); setError('')
    try {
      const res = await fetch(`/api/song-requests/${songRequest.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: tpl, vars, replyTo: replyTo || undefined }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      setSent(true); setTimeout(() => { setSent(false); onClose() }, 1500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally { setSending(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 480, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em', fontSize: 14, color: '#e8ddd0' }}>SEND REPLY</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044' }}><X size={16} /></button>
        </div>
        <div style={{ fontSize: 12, color: '#8a7f70', marginBottom: 16 }}>To: {songRequest.fullName} &lt;{songRequest.email}&gt;</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={LABEL}>TEMPLATE</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ ...INPUT, cursor: 'pointer' }}>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {tpl && (
            <div style={{ padding: '8px 12px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, fontSize: 12, color: '#c9a84c' }}>
              Subject: {renderTemplate(tpl.subject, vars)}
            </div>
          )}
          {varNames.map(v => (
            <div key={v}>
              <label style={LABEL}>{v}</label>
              <input value={vars[v] ?? ''} onChange={e => setVars(p => ({ ...p, [v]: e.target.value }))}
                style={INPUT} placeholder={`{{${v}}}`} />
            </div>
          ))}
          <div>
            <label style={LABEL}>REPLY-TO (optional)</label>
            <input value={replyTo} onChange={e => setReplyTo(e.target.value)} style={INPUT} placeholder="reply@example.com" />
          </div>
          {error && <div style={{ fontSize: 12, color: '#c04020' }}>{error}</div>}
          <button onClick={handleSend} disabled={sending || !tpl}
            style={{ ...BTN, background: sent ? '#34d399' : '#c9a84c', color: '#070707', fontWeight: 700, justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
            <Send size={14} /> {sent ? 'Sent!' : sending ? 'Sending…' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Email History ──────────────────────────────────────────────────────────────
function EmailHistory({ id }: { id: string }) {
  const [logs, setLogs] = useState<BookingEmailLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/song-requests/${id}/email-logs`).then(r => r.json()).then((d: BookingEmailLog[]) => {
      setLogs(d); setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ color: '#5c5044', fontSize: 12 }}>Loading…</div>
  if (!logs.length) return <div style={{ color: '#5c5044', fontSize: 12 }}>No emails sent yet.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      <div style={{ ...LABEL, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Clock size={11} /> EMAIL HISTORY
      </div>
      {logs.map(l => (
        <div key={l.id} style={{ ...CARD, padding: '8px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#e8ddd0' }}>{l.subject}</span>
            <span style={{ fontSize: 11, color: l.status === 'sent' ? '#34d399' : '#c04020' }}>{l.status}</span>
          </div>
          <div style={{ fontSize: 11, color: '#5c5044', marginTop: 2 }}>{fmtTs(l.sentAt)}</div>
        </div>
      ))}
    </div>
  )
}

// ── Row Expanded Detail ────────────────────────────────────────────────────────
function ExpandedRow({ sr, onUpdateStatus }: {
  sr: SongRequest
  onUpdateStatus: (id: string, status: SongRequestStatus) => void
}) {
  const [showReply, setShowReply] = useState(false)

  return (
    <tr>
      <td colSpan={8} style={{ padding: '0 0 0 40px', background: 'rgba(201,168,76,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ padding: '16px 20px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={LABEL}>SONG 1</div>
              <div style={{ fontSize: 13, color: '#e8ddd0' }}>{sr.song1}</div>
            </div>
            {sr.song2 && <div><div style={LABEL}>SONG 2</div><div style={{ fontSize: 13, color: '#e8ddd0' }}>{sr.song2}</div></div>}
            {sr.song3 && <div><div style={LABEL}>SONG 3</div><div style={{ fontSize: 13, color: '#e8ddd0' }}>{sr.song3}</div></div>}
          </div>
          {sr.notes && (
            <div style={{ marginBottom: 14 }}>
              <div style={LABEL}>NOTES</div>
              <div style={{ fontSize: 13, color: '#8a7f70', lineHeight: 1.6 }}>{sr.notes}</div>
            </div>
          )}
          {sr.bookingRequestId && (
            <div style={{ marginBottom: 14 }}>
              <div style={LABEL}>LINKED BOOKING</div>
              <div style={{ fontSize: 13, color: '#60a5fa' }}>#{sr.bookingRequestId}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <button onClick={() => setShowReply(true)}
              style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, padding: '6px 14px' }}>
              <Send size={13} /> Send Reply
            </button>
            <div style={{ fontSize: 11, color: '#5c5044' }}>Created {fmtTs(sr.createdAt)}</div>
          </div>
          <EmailHistory id={sr.id} />
        </div>
        {showReply && <SendReplyModal songRequest={sr} onClose={() => setShowReply(false)} />}
      </td>
    </tr>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminSongRequests() {
  const [requests, setRequests] = useState<SongRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<SongRequestStatus|''>('')
  const [expandedId, setExpandedId] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setRequests(d.songRequests ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load song requests'); setLoading(false) })
  }, [])

  async function updateStatus(id: string, status: SongRequestStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    const updated = requests.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r)
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songRequests: updated }),
    })
  }

  const filtered = requests.filter(r => !filterStatus || r.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading song requests…</div>
  if (error) return <div style={{ color: '#c04020', padding: 40, textAlign: 'center' }}>{error}</div>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, fontWeight: 700 }}>
          SONG REQUESTS
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as SongRequestStatus|'')}
            style={{ ...INPUT, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            {SONG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Status summary */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {SONG_STATUSES.map(s => {
          const count = requests.filter(r => r.status === s).length
          return (
            <div key={s} style={{ padding: '4px 12px', background: STATUS_COLOR[s] + '15', border: `1px solid ${STATUS_COLOR[s]}33`, borderRadius: 99, fontSize: 12, color: STATUS_COLOR[s] }}>
              {s}: {count}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5c5044' }}>No song requests found.</div>
      ) : (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['', 'Name', 'Email', 'Songs', 'Event Date', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <>
                  <tr key={r.id}
                    style={{ borderBottom: expandedId === r.id ? 'none' : '1px solid rgba(255,255,255,0.05)', background: expandedId === r.id ? 'rgba(201,168,76,0.05)' : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)') }}
                    onMouseEnter={e => { if (expandedId !== r.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (expandedId !== r.id) e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '10px 8px 10px 14px', width: 28 }}>
                      <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', display: 'flex', alignItems: 'center' }}>
                        {expandedId === r.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#e8ddd0', fontWeight: 600 }}>{r.fullName}</td>
                    <td style={{ padding: '10px 14px', color: '#8a7f70' }}>{r.email}</td>
                    <td style={{ padding: '10px 14px', color: '#8a7f70', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{songs(r)}</td>
                    <td style={{ padding: '10px 14px', color: '#8a7f70' }}>{fmtDate(r.eventDate)}</td>
                    <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '10px 14px', color: '#5c5044' }}>{fmtDate(r.createdAt)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <select value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value as SongRequestStatus)}
                        style={{ ...INPUT, width: 'auto', fontSize: 12, padding: '3px 7px', cursor: 'pointer' }}
                        onClick={e => e.stopPropagation()}>
                        {SONG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expandedId === r.id && (
                    <ExpandedRow key={`exp-${r.id}`} sr={r} onUpdateStatus={updateStatus} />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
