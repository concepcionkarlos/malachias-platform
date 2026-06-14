'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Link, Mail, Users } from 'lucide-react'
import type { Rehearsal, RehearsalStatus, Song } from '@/lib/data'

const STATUS_ICON  = { upcoming: Clock, completed: CheckCircle, cancelled: XCircle }
const STATUS_COLOR = { upcoming: '#c9a84c', completed: '#34d399', cancelled: '#5c5044' }

export default function AdminRehearsals() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([])
  const [songs, setSongs]           = useState<Song[]>([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [form, setForm]             = useState({ date: '', time: '', location: '', songIds: [] as string[], notes: '' })
  const [saving, setSaving]         = useState(false)
  const [inviting, setInviting]     = useState<string | null>(null)
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [copiedId, setCopiedId]     = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/rehearsals').then(r => r.json()),
      fetch('/api/songs').then(r => r.json()),
    ]).then(([r, s]) => { setRehearsals(r); setSongs(s); setLoading(false) })
  }, [])

  function toggleSong(id: string) {
    setForm(f => ({ ...f, songIds: f.songIds.includes(id) ? f.songIds.filter(x => x !== id) : [...f.songIds, id] }))
  }

  async function save() {
    if (!form.date) return
    setSaving(true)
    const r = await fetch('/api/rehearsals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status: 'upcoming', confirmations: [] }),
    }).then(r => r.json())
    setRehearsals(prev => [r, ...prev])
    setForm({ date: '', time: '', location: '', songIds: [], notes: '' })
    setAdding(false); setSaving(false)
  }

  async function setStatus(id: string, status: RehearsalStatus, summary?: string) {
    const updated = await fetch('/api/rehearsals', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, ...(summary !== undefined ? { summary } : {}) }),
    }).then(r => r.json())
    setRehearsals(prev => prev.map(r => r.id === id ? updated : r))
  }

  async function remove(id: string) {
    await fetch('/api/rehearsals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setRehearsals(prev => prev.filter(r => r.id !== id))
  }

  async function generateInvite(rehearsal: Rehearsal) {
    setInviteLoading(true)
    const res = await fetch('/api/rehearsals/invite', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rehearsalId: rehearsal.id,
        currentToken: rehearsal.token,
        emails: inviteEmails.split(',').map(e => e.trim()).filter(Boolean),
      }),
    }).then(r => r.json())
    setRehearsals(prev => prev.map(r => r.id === rehearsal.id ? { ...r, token: res.token } : r))
    setInviteLoading(false)
    setInviting(null)
    setInviteEmails('')
  }

  async function copyLink(token: string, id: string) {
    const base = window.location.origin
    await navigator.clipboard.writeText(`${base}/rehearsal/${token}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const upcoming = rehearsals.filter(r => r.status === 'upcoming')
  const past     = rehearsals.filter(r => r.status !== 'upcoming')

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>REHEARSALS</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>{upcoming.length} upcoming · {past.length} completed</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}
        >
          <Plus size={14} /> Schedule
        </button>
      </div>

      {adding && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 4 }}>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={INPUT} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 4 }}>Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={INPUT} />
            </div>
          </div>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location / studio" style={{ ...INPUT, marginBottom: 10 }} />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Songs to practice</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {songs.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSong(s.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)',
                    background: form.songIds.includes(s.id) ? 'rgba(201,168,76,0.20)' : 'rgba(255,255,255,0.04)',
                    border: form.songIds.includes(s.id) ? '1px solid rgba(201,168,76,0.50)' : '1px solid rgba(255,255,255,0.08)',
                    color: form.songIds.includes(s.id) ? '#c9a84c' : '#5c5044',
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes / agenda" rows={2} style={{ ...INPUT, resize: 'none', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: '7px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setAdding(false)} style={{ padding: '7px 16px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : rehearsals.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>No rehearsals scheduled yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rehearsals.map(r => {
            const Icon = STATUS_ICON[r.status]
            const color = STATUS_COLOR[r.status]
            const songNames = r.songIds.map(id => songs.find(s => s.id === id)?.title).filter(Boolean)
            const isOpen = expanded === r.id
            const confirmed  = (r.confirmations ?? []).filter(c => c.status === 'confirmed')
            const declined   = (r.confirmations ?? []).filter(c => c.status === 'declined')
            const isInviting = inviting === r.id
            return (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                >
                  <Icon size={14} style={{ color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#e8ddd0' }}>{r.date}{r.time && ` · ${r.time}`}</div>
                    {r.location && <div style={{ fontSize: 11, color: '#5c5044' }}>{r.location}</div>}
                  </div>
                  {(r.confirmations ?? []).length > 0 && (
                    <span style={{ fontSize: 11, color: '#34d399' }}>{confirmed.length} going</span>
                  )}
                  <span style={{ fontSize: 11, color: '#3a2e26' }}>{songNames.length} songs</span>
                  {isOpen ? <ChevronUp size={13} style={{ color: '#5c5044' }} /> : <ChevronDown size={13} style={{ color: '#5c5044' }} />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {songNames.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {songNames.map(name => (
                          <span key={name} style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, color: '#8a7f70' }}>
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                    {r.notes && <p style={{ fontSize: 12, color: '#5c5044', margin: '8px 0 12px', lineHeight: 1.5 }}>{r.notes}</p>}
                    {r.summary && <p style={{ fontSize: 12, color: '#8a7f70', margin: '0 0 12px', padding: '8px 12px', background: 'rgba(52,211,153,0.06)', borderRadius: 6, lineHeight: 1.5 }}>{r.summary}</p>}

                    {/* Confirmations */}
                    {(r.confirmations ?? []).length > 0 && (
                      <div style={{ marginBottom: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: '#3a2e26', marginBottom: 6 }}>RSVPS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {confirmed.map(c => (
                            <span key={c.name} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.20)', color: '#34d399' }}>
                              {c.name} ✓
                            </span>
                          ))}
                          {declined.map(c => (
                            <span key={c.name} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#5c5044' }}>
                              {c.name} ✗
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Invite section */}
                    {r.status === 'upcoming' && (
                      <div style={{ marginBottom: 12 }}>
                        {isInviting ? (
                          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 6, padding: '10px 12px' }}>
                            <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Email addresses to invite (comma-separated)</label>
                            <input
                              value={inviteEmails}
                              onChange={e => setInviteEmails(e.target.value)}
                              placeholder="juan@example.com, pedro@example.com"
                              style={{ ...INPUT, marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => generateInvite(r)}
                                disabled={inviteLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '6px 12px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}
                              >
                                <Mail size={11} />{inviteLoading ? 'Sending…' : 'Send Invites'}
                              </button>
                              <button onClick={() => setInviting(null)} style={{ fontSize: 11, padding: '6px 10px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              onClick={() => { setInviting(r.id); setInviteEmails('') }}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '5px 12px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.20)', borderRadius: 5, color: '#c9a84c', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                            >
                              <Mail size={11} /> Send Invite
                            </button>
                            {r.token && (
                              <button
                                onClick={() => copyLink(r.token!, r.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: copiedId === r.id ? '#34d399' : '#5c5044', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                              >
                                <Link size={11} />{copiedId === r.id ? 'Copied!' : 'Copy Link'}
                              </button>
                            )}
                            {!r.token && (
                              <button
                                onClick={async () => {
                                  const res = await fetch('/api/rehearsals/invite', {
                                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ rehearsalId: r.id }),
                                  }).then(x => x.json())
                                  setRehearsals(prev => prev.map(x => x.id === r.id ? { ...x, token: res.token } : x))
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: '#5c5044', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                              >
                                <Link size={11} /> Generate Link
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {r.status === 'upcoming' && (
                        <>
                          <button onClick={() => { const s = prompt('Summary / notes from rehearsal:') ?? ''; setStatus(r.id, 'completed', s) }} style={{ fontSize: 11, padding: '5px 12px', background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 6, color: '#34d399', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                            Mark Completed
                          </button>
                          <button onClick={() => setStatus(r.id, 'cancelled')} style={{ fontSize: 11, padding: '5px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#5c5044', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                            Cancel
                          </button>
                        </>
                      )}
                      <button onClick={() => remove(r.id)} style={{ fontSize: 11, padding: '5px 12px', background: 'rgba(192,64,32,0.10)', border: '1px solid rgba(192,64,32,0.20)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', fontFamily: 'var(--font-body)', marginLeft: 'auto' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
