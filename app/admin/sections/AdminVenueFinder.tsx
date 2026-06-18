'use client'

// Admin section — Venue Finder: searches Google Places for venues and adds them to a CRM.
// A per-venue drawer tracks pipeline status/notes/follow-ups, sends templated outreach
// emails, and shows the full sent/received email thread. Uses /api/places, /api/venues,
// /api/email-templates, plus per-venue email-thread and send-email endpoints.

import { useEffect, useState } from 'react'
import { Search, Plus, X, Trash2, Star, Send, Globe, Phone } from 'lucide-react'
import type { Venue, VenueStatus, EmailTemplate, PlaceSearchResult, OutreachLog, InboundEmail } from '@/lib/data'
import EmailThread, { type ThreadMessage } from './EmailThread'
import NextStepCard from './NextStepCard'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }

const VENUE_STATUSES: VenueStatus[] = ['New','Reviewed','Contact Added','Draft Ready','Sent','Follow-up','Interested','Not Interested','Booked','Archived']

const STATUS_COLOR: Record<VenueStatus, string> = {
  'New': '#c9a84c',
  'Reviewed': '#60a5fa',
  'Contact Added': '#a78bfa',
  'Draft Ready': '#fb923c',
  'Sent': '#f472b6',
  'Follow-up': '#fb923c',
  'Interested': '#34d399',
  'Not Interested': '#c04020',
  'Booked': '#10b981',
  'Archived': '#5c5044',
}

const VENUE_TEMPLATE_SLUGS = ['venue-first-outreach', 'venue-follow-up', 'venue-thanks-booked']

function StatusBadge({ status }: { status: VenueStatus }) {
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

function fmtTs(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function extractVars(tpl: EmailTemplate): string[] {
  const matches = (tpl.subject + ' ' + tpl.bodyHtml).match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}
function renderTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

// ── Venue Drawer ───────────────────────────────────────────────────────────────
function VenueDrawer({ venue, templates, onClose, onUpdate, onDelete }: {
  venue: Venue
  templates: EmailTemplate[]
  onClose: () => void
  onUpdate: (v: Venue) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState<Venue>(venue)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'details'|'email'|'thread'>('details')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [threadMsgs, setThreadMsgs] = useState<ThreadMessage[]>([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [threadLoaded, setThreadLoaded] = useState(false)
  const [vars, setVars] = useState<Record<string, string>>({})
  const [replyTo, setReplyTo] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ok: boolean; msg: string}|null>(null)
  const [deleting, setDeleting] = useState(false)

  const venueTemplates = templates.filter(t => VENUE_TEMPLATE_SLUGS.includes(t.slug) || !t.isSystem)
  const activeTpl = venueTemplates.find(t => t.id === selectedTemplateId) ?? venueTemplates[0]
  const varNames = activeTpl ? extractVars(activeTpl) : []

  useEffect(() => {
    setForm(venue)
    setThreadLoaded(false)
    setThreadMsgs([])
  }, [venue.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab !== 'thread' || threadLoaded) return
    setThreadLoading(true)
    fetch(`/api/venues/${venue.id}/email-thread`)
      .then(r => r.json())
      .then(({ sent, received }: { sent: OutreachLog[]; received: InboundEmail[] }) => {
        const msgs: ThreadMessage[] = [
          ...sent.map(s => ({
            id: s.id,
            direction: 'sent' as const,
            subject: s.subject,
            counterparty: s.toEmail,
            timestamp: s.sentAt,
            status: s.status,
            bodyHtml: s.bodyHtml,
          })),
          ...received.map(r => ({
            id: r.id,
            direction: 'received' as const,
            subject: r.subject,
            counterparty: r.fromName ? `${r.fromName} <${r.fromEmail}>` : r.fromEmail,
            timestamp: r.receivedAt,
            bodyHtml: r.bodyHtml,
            bodyText: r.bodyText,
          })),
        ]
        setThreadMsgs(msgs)
        setThreadLoaded(true)
      })
      .catch(() => setThreadLoaded(true))
      .finally(() => setThreadLoading(false))
  }, [tab, venue.id, threadLoaded])

  useEffect(() => {
    if (!activeTpl) return
    setVars({
      venueName: venue.name,
      venueAddress: venue.address,
      contactEmail: venue.contactEmail ?? '',
    })
  }, [activeTpl?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function setField(k: keyof Venue, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    try {
      const updated = { ...form, updatedAt: new Date().toISOString() }
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      onUpdate(updated)
    } catch {
      /* silently fail — could add error state */
    } finally { setSaving(false) }
  }

  async function handleSend() {
    if (!activeTpl) return
    setSending(true); setSendResult(null)
    try {
      const res = await fetch(`/api/venues/${venue.id}/send-email`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: activeTpl, vars, replyTo: replyTo || undefined }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      setSendResult({ ok: true, msg: 'Email sent!' })
    } catch (e: unknown) {
      setSendResult({ ok: false, msg: e instanceof Error ? e.message : 'Failed' })
    } finally { setSending(false) }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${venue.name}"?`)) return
    setDeleting(true)
    try {
      await fetch(`/api/venues/${venue.id}`, { method: 'DELETE' })
      onDelete(venue.id)
    } finally { setDeleting(false) }
  }

  const TAB = (active: boolean): React.CSSProperties => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px',
    fontSize: 11, letterSpacing: '0.08em', fontFamily: 'var(--font-body)',
    color: active ? '#c9a84c' : '#8a7f70',
    borderBottom: active ? '2px solid #c9a84c' : '2px solid transparent',
  })

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.07)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8ddd0' }}>{venue.name}</div>
          <div style={{ fontSize: 12, color: '#8a7f70', marginTop: 2 }}>{venue.address}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044' }}><X size={18} /></button>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button style={TAB(tab === 'details')} onClick={() => setTab('details')}>DETAILS</button>
        <button style={TAB(tab === 'email')} onClick={() => setTab('email')}>SEND EMAIL</button>
        <button style={TAB(tab === 'thread')} onClick={() => setTab('thread')}>EMAILS</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {tab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NextStepCard type="venue" status={form.status} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusBadge status={form.status} />
              <select value={form.status} onChange={e => setField('status', e.target.value as VenueStatus)}
                style={{ ...INPUT, width: 'auto', fontSize: 12, padding: '4px 8px', cursor: 'pointer' }}>
                {VENUE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {venue.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#c9a84c' }}>
                <Star size={13} fill="#c9a84c" /> {venue.rating.toFixed(1)}
              </div>
            )}
            {venue.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8a7f70' }}>
                <Phone size={13} /> {venue.phone}
              </div>
            )}
            {venue.website && (
              <a href={venue.website} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>
                <Globe size={13} /> {venue.website}
              </a>
            )}
            <div>
              <label style={LABEL}>CONTACT EMAIL</label>
              <input value={form.contactEmail ?? ''} onChange={e => setField('contactEmail', e.target.value)} style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>ASSIGNED TO</label>
              <input value={form.assignedTo ?? ''} onChange={e => setField('assignedTo', e.target.value)} style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>FOLLOW-UP DATE</label>
              <input type="date" value={form.followUpDate ?? ''} onChange={e => setField('followUpDate', e.target.value)}
                style={{ ...INPUT, colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={LABEL}>NOTES</label>
              <textarea value={form.notes ?? ''} onChange={e => setField('notes', e.target.value)} rows={4}
                style={{ ...INPUT, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} disabled={saving}
                style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, flex: 1, justifyContent: 'center' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ ...BTN, background: 'rgba(192,64,32,0.15)', color: '#c04020', border: '1px solid rgba(192,64,32,0.3)' }}>
                <Trash2 size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {venue.types.map(t => (
                <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(255,255,255,0.05)', color: '#8a7f70', borderRadius: 99, letterSpacing: '0.05em' }}>
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#5c5044' }}>Added {fmtTs(venue.createdAt)}</div>
          </div>
        )}
        {tab === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={LABEL}>TEMPLATE</label>
              <select
                value={selectedTemplateId || activeTpl?.id || ''}
                onChange={e => setSelectedTemplateId(e.target.value)}
                style={{ ...INPUT, cursor: 'pointer' }}>
                {venueTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                {venueTemplates.length === 0 && <option value="">No templates</option>}
              </select>
            </div>
            {activeTpl && (
              <div style={{ padding: '8px 12px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, fontSize: 12, color: '#c9a84c' }}>
                Subject: {renderTemplate(activeTpl.subject, vars)}
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
            {sendResult && (
              <div style={{ fontSize: 12, color: sendResult.ok ? '#34d399' : '#c04020' }}>{sendResult.msg}</div>
            )}
            <button onClick={handleSend} disabled={sending || !activeTpl}
              style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
              <Send size={14} /> {sending ? 'Sending…' : 'Send Email'}
            </button>
          </div>
        )}
        {tab === 'thread' && (
          <EmailThread messages={threadMsgs} loading={threadLoading} />
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminVenueFinder() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loadingVenues, setLoadingVenues] = useState(true)

  // Search state
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<PlaceSearchResult[]>([])
  const [searchError, setSearchError] = useState('')
  const [addingId, setAddingId] = useState<string|null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  // CRM state
  const [filterStatus, setFilterStatus] = useState<VenueStatus|''>('')
  const [selectedVenue, setSelectedVenue] = useState<Venue|null>(null)

  useEffect(() => {
    fetch('/api/venues').then(r => r.json()).then((d: Venue[]) => { setVenues(d); setLoadingVenues(false) }).catch(() => setLoadingVenues(false))
    fetch('/api/email-templates').then(r => r.json()).then((d: EmailTemplate[]) => setTemplates(d)).catch(() => {})
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true); setSearchError(''); setResults([])
    try {
      const params = new URLSearchParams({ q: query })
      if (location.trim()) params.set('location', location)
      const res = await fetch(`/api/places/search?${params}`)
      if (!res.ok) throw new Error()
      const d: PlaceSearchResult[] = await res.json()
      setResults(d)
    } catch {
      setSearchError('Search failed. Check your API configuration.')
    } finally { setSearching(false) }
  }

  async function addVenue(place: PlaceSearchResult) {
    setAddingId(place.placeId)
    try {
      const body: Omit<Venue, 'id'> = {
        placeId: place.placeId,
        name: place.name,
        address: place.address,
        website: place.website,
        phone: place.phone,
        rating: place.rating,
        types: place.types,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const res = await fetch('/api/venues', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      const created: Venue = await res.json()
      setVenues(prev => [created, ...prev])
      setAddedIds(prev => new Set(prev).add(place.placeId))
    } finally { setAddingId(null) }
  }

  function handleUpdate(updated: Venue) {
    setVenues(prev => prev.map(v => v.id === updated.id ? updated : v))
    setSelectedVenue(updated)
  }

  function handleDelete(id: string) {
    setVenues(prev => prev.filter(v => v.id !== id))
    setSelectedVenue(null)
  }

  const existingPlaceIds = new Set(venues.map(v => v.placeId))
  const filteredVenues = venues.filter(v => !filterStatus || v.status === filterStatus)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, fontWeight: 700 }}>
        VENUE FINDER
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left panel — Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...CARD, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 12, color: '#8a7f70', marginBottom: 14 }}>SEARCH & ADD VENUES</div>
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={LABEL}>VENUE / KEYWORD</label>
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5c5044' }} />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="music venue, church, VFW..."
                    style={{ ...INPUT, paddingLeft: 30 }} />
                </div>
              </div>
              <div>
                <label style={LABEL}>LOCATION (optional)</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" style={INPUT} />
              </div>
              <button type="submit" disabled={searching}
                style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, justifyContent: 'center', opacity: searching ? 0.7 : 1 }}>
                <Search size={13} /> {searching ? 'Searching…' : 'Search'}
              </button>
            </form>
          </div>
          {searchError && <div style={{ fontSize: 12, color: '#c04020', padding: '8px 12px', ...CARD }}>{searchError}</div>}
          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map(r => {
                const alreadyAdded = existingPlaceIds.has(r.placeId) || addedIds.has(r.placeId)
                return (
                  <div key={r.placeId} style={{ ...CARD, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e8ddd0', marginBottom: 3 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: '#8a7f70', marginBottom: 4, lineHeight: 1.4 }}>{r.address}</div>
                        {r.phone && <div style={{ fontSize: 11, color: '#5c5044' }}>{r.phone}</div>}
                        {r.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#c9a84c', marginTop: 4 }}>
                            <Star size={10} fill="#c9a84c" /> {r.rating.toFixed(1)}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                          {r.types.slice(0, 3).map(t => (
                            <span key={t} style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(255,255,255,0.05)', color: '#5c5044', borderRadius: 99 }}>
                              {t.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => addVenue(r)}
                        disabled={alreadyAdded || addingId === r.placeId}
                        style={{ ...BTN, background: alreadyAdded ? 'rgba(52,211,153,0.15)' : 'rgba(201,168,76,0.15)', color: alreadyAdded ? '#34d399' : '#c9a84c', border: `1px solid ${alreadyAdded ? 'rgba(52,211,153,0.3)' : 'rgba(201,168,76,0.3)'}`, flexShrink: 0, padding: '5px 10px', fontSize: 12 }}>
                        {alreadyAdded ? '✓ Added' : addingId === r.placeId ? '…' : <><Plus size={12} /> Add</>}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {results.length === 0 && !searching && query && !searchError && (
            <div style={{ textAlign: 'center', color: '#5c5044', fontSize: 12, padding: 16 }}>No results found.</div>
          )}
        </div>

        {/* Right panel — CRM */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#8a7f70' }}>{venues.length} venues in CRM</div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as VenueStatus|'')}
              style={{ ...INPUT, width: 'auto', cursor: 'pointer' }}>
              <option value="">All Statuses</option>
              {VENUE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {loadingVenues ? (
            <div style={{ color: '#5c5044', textAlign: 'center', padding: 40 }}>Loading venues…</div>
          ) : filteredVenues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5c5044' }}>No venues yet. Use search to add some.</div>
          ) : (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Name', 'Status', 'Last Contacted', 'Contact Email', 'Phone', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVenues.map((v, i) => (
                    <tr key={v.id}
                      onClick={() => setSelectedVenue(v)}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}>
                      <td style={{ padding: '10px 14px', color: '#e8ddd0', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</td>
                      <td style={{ padding: '10px 14px' }}><StatusBadge status={v.status} /></td>
                      <td style={{ padding: '10px 14px', color: '#5c5044', fontSize: 12 }}>{v.lastContactedAt ? fmtTs(v.lastContactedAt) : '—'}</td>
                      <td style={{ padding: '10px 14px', color: '#8a7f70', fontSize: 12 }}>{v.contactEmail ?? '—'}</td>
                      <td style={{ padding: '10px 14px', color: '#8a7f70', fontSize: 12 }}>{v.phone ?? '—'}</td>
                      <td style={{ padding: '10px 14px', color: '#5c5044' }}>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {selectedVenue && (
        <div onClick={() => setSelectedVenue(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}
      {selectedVenue && (
        <VenueDrawer
          venue={selectedVenue}
          templates={templates}
          onClose={() => setSelectedVenue(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
