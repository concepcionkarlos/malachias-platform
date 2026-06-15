'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Video, Radio, CheckCircle, XCircle, Clock, ExternalLink, Trash2, Edit2, Copy, X, Save } from 'lucide-react'
import type { LiveSession, LivePlatform, LiveSessionStatus, Song } from '@/lib/data'

const GOLD = '#c9a84c'
const DARK = '#0d0b09'

const PLATFORM_LABELS: Record<LivePlatform, string> = {
  tiktok: 'TikTok Live',
  instagram: 'Instagram Live',
  youtube: 'YouTube Live',
  facebook: 'Facebook Live',
  twitch: 'Twitch',
}

const PLATFORM_COLORS: Record<LivePlatform, string> = {
  tiktok: '#ff0050',
  instagram: '#c13584',
  youtube: '#ff0000',
  facebook: '#1877f2',
  twitch: '#9146ff',
}

const STATUS_META: Record<LiveSessionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  planned:   { label: 'Planned',   color: '#60a5fa', icon: <Clock size={11} /> },
  live:      { label: 'LIVE NOW',  color: '#22c55e', icon: <Radio size={11} /> },
  completed: { label: 'Done',      color: '#6b7280', icon: <CheckCircle size={11} /> },
  cancelled: { label: 'Cancelled', color: '#ef4444', icon: <XCircle size={11} /> },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function generateCaption(session: Partial<LiveSession>): string {
  const platform = session.platform ? PLATFORM_LABELS[session.platform] : 'Live'
  const lines = [
    `🎸 Going LIVE on ${platform}!`,
    '',
    session.title ? `${session.title}` : 'Malachias Live Session',
    '',
    session.description || 'Join us for a live rock session — raw, real, and straight from the room.',
    '',
    '#Malachias #LiveMusic #RockLive #ChristianRock #SouthFlorida #VeteranArtist',
  ]
  return lines.join('\n')
}

const EMPTY_FORM: Partial<LiveSession> = {
  title: '',
  platform: 'tiktok',
  status: 'planned',
  scheduledAt: '',
  description: '',
  platformUrl: '',
  caption: '',
  notes: '',
}

interface FormDrawerProps {
  initial?: LiveSession | null
  onSave: (data: Partial<LiveSession>) => Promise<void>
  onClose: () => void
}

function FormDrawer({ initial, onSave, onClose }: FormDrawerProps) {
  const [form, setForm] = useState<Partial<LiveSession>>(initial ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  function set(key: keyof LiveSession, value: string | string[]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function autoCaptionClick() {
    setForm(f => ({ ...f, caption: generateCaption(f) }))
  }

  async function submit() {
    if (!form.title || !form.scheduledAt || !form.platform) return
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const label: React.CSSProperties = { fontSize: 11, color: '#5c5044', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5, display: 'block' }
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '9px 12px', color: '#e8ddd0', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }
  const sel: React.CSSProperties = { ...input, cursor: 'pointer' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
    }}>
      <div style={{
        width: 460, height: '100vh', background: DARK, borderLeft: `1px solid ${GOLD}40`,
        overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ margin: 0, color: GOLD, fontSize: 16, fontWeight: 700 }}>
            {initial ? 'Edit Live Session' : 'New Live Session'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044' }}>
            <X size={18} />
          </button>
        </div>

        <div>
          <label style={label}>Title *</label>
          <input style={input} value={form.title ?? ''} onChange={e => set('title', e.target.value)} placeholder="Sunday Rehearsal Gig" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={label}>Platform *</label>
            <select style={sel} value={form.platform ?? 'tiktok'} onChange={e => set('platform', e.target.value)}>
              {(Object.entries(PLATFORM_LABELS) as [LivePlatform, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>Status</label>
            <select style={sel} value={form.status ?? 'planned'} onChange={e => set('status', e.target.value)}>
              {(Object.keys(STATUS_META) as LiveSessionStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={label}>Scheduled Date & Time *</label>
          <input style={input} type="datetime-local" value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ''} onChange={e => set('scheduledAt', new Date(e.target.value).toISOString())} />
        </div>

        <div>
          <label style={label}>Description</label>
          <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }} value={form.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="What's the session about? What songs or energy to expect." />
        </div>

        <div>
          <label style={label}>Platform URL (stream link)</label>
          <input style={input} value={form.platformUrl ?? ''} onChange={e => set('platformUrl', e.target.value)} placeholder="https://tiktok.com/@malachiasmusic/live" />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label style={{ ...label, margin: 0 }}>Social Caption</label>
            <button onClick={autoCaptionClick} style={{ background: 'none', border: `1px solid ${GOLD}40`, color: GOLD, fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.08em' }}>
              Auto-generate
            </button>
          </div>
          <textarea style={{ ...input, minHeight: 100, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} value={form.caption ?? ''} onChange={e => set('caption', e.target.value)} placeholder="Caption for TikTok / Instagram post announcing the live..." />
        </div>

        <div>
          <label style={label}>Recording URL (after live)</label>
          <input style={input} value={form.recordingUrl ?? ''} onChange={e => set('recordingUrl', e.target.value)} placeholder="https://youtube.com/..." />
        </div>

        <div>
          <label style={label}>Internal Notes</label>
          <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} placeholder="Equipment checklist, setlist plan, backup plan..." />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{ flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#8a7f70', borderRadius: 6, padding: '10px 0', cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={submit} disabled={saving} style={{ flex: 2, background: GOLD, color: '#0d0b09', border: 'none', borderRadius: 6, padding: '10px 0', cursor: saving ? 'wait' : 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save Session'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, onEdit, onDelete, songs }: { session: LiveSession; onEdit: () => void; onDelete: () => void; songs: Song[] }) {
  const [copied, setCopied] = useState(false)
  const status = STATUS_META[session.status]
  const platformColor = PLATFORM_COLORS[session.platform]

  function copyCaption() {
    if (!session.caption) return
    navigator.clipboard.writeText(session.caption).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
              background: `${platformColor}20`, color: platformColor,
            }}>
              {PLATFORM_LABELS[session.platform]}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
              background: `${status.color}20`, color: status.color,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {status.icon} {status.label}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8ddd0', marginBottom: 2 }}>{session.title}</div>
          <div style={{ fontSize: 12, color: '#5c5044' }}>{fmtDate(session.scheduledAt)}</div>
          {session.description && <div style={{ fontSize: 12, color: '#8a7f70', marginTop: 5, lineHeight: 1.6 }}>{session.description}</div>}
          {session.setListIds && session.setListIds.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {session.setListIds.map(id => {
                const song = songs.find(s => s.id === id)
                return song ? (
                  <span key={id} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 99,
                    background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.20)',
                    color: '#c9a84c',
                  }}>
                    {song.title}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {session.platformUrl && (
            <a href={session.platformUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5c5044', display: 'flex', alignItems: 'center' }}>
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 2 }}>
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 2 }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {session.caption && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: '#3a3228', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Caption</span>
            <button onClick={copyCaption} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#22c55e' : '#5c5044', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ margin: 0, fontSize: 11, color: '#8a7f70', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{session.caption}</pre>
        </div>
      )}

      {session.recordingUrl && (
        <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: GOLD, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Video size={12} /> View Recording
        </a>
      )}
    </div>
  )
}

export default function AdminLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<LiveSession | null>(null)
  const [filter, setFilter] = useState<LiveSessionStatus | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sessRes, songRes] = await Promise.all([
        fetch('/api/live-sessions'),
        fetch('/api/songs'),
      ])
      if (sessRes.ok) setSessions(await sessRes.json())
      if (songRes.ok) setSongs(await songRes.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(data: Partial<LiveSession>) {
    if (editing) {
      await fetch(`/api/live-sessions/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    } else {
      await fetch('/api/live-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    }
    setShowForm(false); setEditing(null); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this live session?')) return
    await fetch(`/api/live-sessions/${id}`, { method: 'DELETE' })
    load()
  }

  const shown = filter === 'all' ? sessions : sessions.filter(s => s.status === filter)
  const live = sessions.find(s => s.status === 'live')
  const upcoming = sessions.filter(s => s.status === 'planned').length

  return (
    <div style={{ padding: '28px 24px', maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#e8ddd0', fontWeight: 700 }}>Live Sessions</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#5c5044' }}>
            TikTok / Instagram rehearsal gigs, online shows, and streaming events
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} style={{
          background: GOLD, color: '#0d0b09', border: 'none', borderRadius: 7,
          padding: '9px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Plus size={14} /> New Session
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {live && (
          <div style={{ background: '#22c55e18', border: '1px solid #22c55e40', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={14} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>LIVE NOW: {live.title}</span>
          </div>
        )}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 16px' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#e8ddd0' }}>{upcoming}</span>
          <span style={{ fontSize: 12, color: '#5c5044', marginLeft: 6 }}>upcoming</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 16px' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#e8ddd0' }}>{sessions.filter(s => s.status === 'completed').length}</span>
          <span style={{ fontSize: 12, color: '#5c5044', marginLeft: 6 }}>completed</span>
        </div>
      </div>

      {/* Tips box */}
      <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}30`, borderRadius: 8, padding: '14px 18px', marginBottom: 24 }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tips for Online Gigs</p>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#8a7f70', lineHeight: 1.8 }}>
          <li>Stream <strong style={{ color: '#e8ddd0' }}>rehearsals as raw sessions</strong> — no polish needed, authenticity wins on TikTok</li>
          <li>Announce 24h ahead with a post using the auto-generated caption</li>
          <li>Pin the set list in comments so fans know what's coming</li>
          <li>Go live on TikTok first (biggest organic reach) then simulcast if you can</li>
          <li>Save the recording and repurpose it as clips after the live ends</li>
        </ul>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'live', 'planned', 'completed', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? GOLD : 'rgba(255,255,255,0.04)',
            color: filter === f ? '#0d0b09' : '#8a7f70',
            border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
            fontSize: 12, fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize',
          }}>
            {f === 'all' ? `All (${sessions.length})` : f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ color: '#3a3228', fontSize: 13 }}>Loading…</div>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#3a3228', fontSize: 13 }}>
          <Video size={32} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.3 }} />
          {filter === 'all' ? 'No live sessions yet. Schedule your first one!' : `No ${filter} sessions.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map(s => (
            <SessionCard key={s.id} session={s} songs={songs}
              onEdit={() => { setEditing(s); setShowForm(true) }}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <FormDrawer
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
