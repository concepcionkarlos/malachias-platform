'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, ChevronRight, ChevronLeft, Trash2, MessageCircle, Star, X, Check } from 'lucide-react'
import type { FanContact } from '@/app/api/admin/fan-outreach/route'

// ── Stage config ──────────────────────────────────────────────────────────────

const STAGES: { key: FanContact['stage']; label: string; tip: string; color: string }[] = [
  {
    key: 'new',
    label: 'New',
    tip: 'Facebook notified you. Log them here.',
    color: '#5c5044',
  },
  {
    key: 'replied',
    label: 'Replied',
    tip: 'You replied to their comment publicly.',
    color: '#7a6a52',
  },
  {
    key: 'dm_sent',
    label: 'DM Sent',
    tip: "You sent a private message asking for feedback.",
    color: '#c9a84c',
  },
  {
    key: 'responded',
    label: 'Responded',
    tip: 'They replied to your DM. Real connection made.',
    color: '#a08540',
  },
  {
    key: 'supporter',
    label: 'Supporter',
    tip: 'Subscribed, bought merch, came to a show.',
    color: '#4caf70',
  },
]

const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Other'] as const

const S = {
  card: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: '1rem 1.1rem',
    marginBottom: '0.6rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  } as React.CSSProperties,
  label: {
    fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const,
    color: '#3a2e26', display: 'block', marginBottom: '0.4rem',
  },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    padding: '0.65rem 0.85rem', fontSize: '0.82rem', color: '#e8ddd0',
    fontFamily: 'var(--font-body)', outline: 'none', borderRadius: 4,
  },
  btn: (variant: 'primary' | 'ghost' | 'danger') => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: variant === 'primary' ? '0.55rem 1.1rem' : '0.4rem 0.75rem',
    border: 'none', cursor: 'pointer', borderRadius: 4,
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.08em',
    background: variant === 'primary' ? '#c9a84c' : variant === 'danger' ? 'rgba(192,64,32,0.12)' : 'rgba(255,255,255,0.06)',
    color: variant === 'primary' ? '#030202' : variant === 'danger' ? '#c04020' : '#8a7f70',
    fontWeight: variant === 'primary' ? 700 : 400,
    transition: 'opacity 0.15s',
  } as React.CSSProperties),
}

function platformColor(p: string) {
  if (p === 'Facebook') return '#1877f2'
  if (p === 'Instagram') return '#e1306c'
  if (p === 'TikTok') return '#69c9d0'
  if (p === 'YouTube') return '#ff0000'
  return '#5c5044'
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

// ── Add Contact Form ──────────────────────────────────────────────────────────

function AddForm({ onAdd, onClose }: { onAdd: (c: FanContact) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', platform: 'Facebook' as typeof PLATFORMS[number], engagement: '', notes: '' })
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/fan-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { contact } = await res.json()
      onAdd(contact)
      onClose()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={submit} style={{ ...S.card, cursor: 'default', marginBottom: '1.5rem', borderColor: 'rgba(201,168,76,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#e8ddd0', fontWeight: 600 }}>Log new fan contact</span>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 2 }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.65rem', marginBottom: '0.65rem' }}>
        <div>
          <span style={S.label}>Name (as on Facebook)</span>
          <input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Juan Rodriguez"
            style={S.input}
          />
        </div>
        <div>
          <span style={S.label}>Platform</span>
          <select
            value={form.platform}
            onChange={e => setForm(f => ({ ...f, platform: e.target.value as typeof PLATFORMS[number] }))}
            style={{ ...S.input, paddingRight: '0.5rem' }}
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '0.65rem' }}>
        <span style={S.label}>What they engaged with</span>
        <input
          value={form.engagement}
          onChange={e => setForm(f => ({ ...f, engagement: e.target.value }))}
          placeholder='e.g. Commented on "Live at VFW Hall" video'
          style={S.input}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span style={S.label}>Notes (optional)</span>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="What did they say? First impression..."
          rows={2}
          style={{ ...S.input, resize: 'vertical' as const, lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={saving} style={S.btn('primary')}>
          {saving ? 'Saving…' : <><Plus size={12} /> Add to pipeline</>}
        </button>
        <button type="button" onClick={onClose} style={S.btn('ghost')}>Cancel</button>
      </div>
    </form>
  )
}

// ── Contact Card ──────────────────────────────────────────────────────────────

function ContactCard({
  contact,
  onUpdate,
  onDelete,
}: {
  contact: FanContact
  onUpdate: (id: string, updates: Partial<FanContact>) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editNotes, setEditNotes] = useState(contact.notes)
  const [savingNotes, setSavingNotes] = useState(false)

  const stageIdx = STAGES.findIndex(s => s.key === contact.stage)
  const stageInfo = STAGES[stageIdx]

  function move(dir: 1 | -1) {
    const next = STAGES[stageIdx + dir]
    if (next) onUpdate(contact.id, { stage: next.key })
  }

  async function saveNotes() {
    setSavingNotes(true)
    await onUpdate(contact.id, { notes: editNotes })
    setSavingNotes(false)
  }

  return (
    <div
      style={{ ...S.card, borderLeft: `3px solid ${stageInfo.color}` }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <button
          onClick={() => setExpanded(x => !x)}
          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e8ddd0', fontWeight: 600 }}>{contact.name}</span>
            <span style={{
              fontSize: '0.55rem', padding: '0.15rem 0.45rem', borderRadius: 3,
              background: `${platformColor(contact.platform)}22`,
              color: platformColor(contact.platform),
              letterSpacing: '0.08em', fontWeight: 600,
            }}>
              {contact.platform}
            </span>
          </div>
          {contact.engagement && (
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.72rem', color: '#5c5044', lineHeight: 1.5 }}>
              {contact.engagement}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', color: stageInfo.color, fontWeight: 600 }}>{stageInfo.label}</span>
            <span style={{ fontSize: '0.60rem', color: '#3a2e26' }}>· {timeSince(contact.createdAt)}</span>
            {contact.notes && <MessageCircle size={11} style={{ color: '#3a2e26' }} />}
          </div>
        </button>

        {/* Stage nav */}
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
          {stageIdx > 0 && (
            <button onClick={() => move(-1)} title="Move back" style={{ ...S.btn('ghost'), padding: '0.3rem 0.5rem' }}>
              <ChevronLeft size={12} />
            </button>
          )}
          {stageIdx < STAGES.length - 1 && (
            <button onClick={() => move(1)} title={`Move to ${STAGES[stageIdx + 1].label}`} style={{ ...S.btn('ghost'), padding: '0.3rem 0.5rem' }}>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.85rem' }}>
          {/* Stage tip */}
          <p style={{ fontSize: '0.68rem', color: '#c9a84c', margin: '0 0 0.75rem', letterSpacing: '0.06em' }}>
            Next: {stageInfo.tip}
          </p>

          {/* All stages for quick jump */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            {STAGES.map(s => (
              <button
                key={s.key}
                onClick={() => onUpdate(contact.id, { stage: s.key })}
                style={{
                  padding: '0.25rem 0.6rem', border: 'none', cursor: 'pointer', borderRadius: 3,
                  fontFamily: 'var(--font-body)', fontSize: '0.60rem', letterSpacing: '0.06em',
                  background: contact.stage === s.key ? s.color : 'rgba(255,255,255,0.04)',
                  color: contact.stage === s.key ? (s.key === 'supporter' ? '#fff' : '#030202') : '#5c5044',
                  fontWeight: contact.stage === s.key ? 700 : 400,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Notes */}
          <span style={S.label}>Notes — DM content, feedback, what they said</span>
          <textarea
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            rows={3}
            style={{ ...S.input, resize: 'vertical', lineHeight: 1.65, marginBottom: '0.5rem' }}
            placeholder="Log what they said in the DM, any feedback, connection point..."
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={saveNotes}
              disabled={savingNotes || editNotes === contact.notes}
              style={S.btn('primary')}
            >
              {savingNotes ? 'Saving…' : <><Check size={11} /> Save notes</>}
            </button>
            <button onClick={() => onDelete(contact.id)} style={S.btn('danger')}>
              <Trash2 size={11} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminFanOutreach() {
  const [contacts, setContacts] = useState<FanContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<FanContact['stage'] | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/fan-outreach')
      const data = await res.json()
      setContacts(data.contacts ?? [])
    } catch { /* silent */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleUpdate(id: string, updates: Partial<FanContact>) {
    const res = await fetch(`/api/admin/fan-outreach/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const { contact } = await res.json()
      setContacts(prev => prev.map(c => c.id === id ? contact : c))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this contact?')) return
    await fetch(`/api/admin/fan-outreach/${id}`, { method: 'DELETE' })
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  function handleAdd(contact: FanContact) {
    setContacts(prev => [contact, ...prev])
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.stage === filter)
  const byStage = (key: FanContact['stage']) => contacts.filter(c => c.stage === key).length

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3a2e26', display: 'block', marginBottom: '0.4rem' }}>Outreach</span>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', color: '#e8ddd0', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>
          FAN OUTREACH
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#5c5044', lineHeight: 1.65, margin: 0 }}>
          Facebook notifies you of a comment → log the person here → reply publicly → send DM for feedback → track what happens.
        </p>
      </div>

      {/* Pipeline stats */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {STAGES.map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(f => f === s.key ? 'all' : s.key)}
            style={{
              padding: '0.45rem 0.85rem', border: 'none', cursor: 'pointer',
              borderRadius: 20, fontFamily: 'var(--font-body)',
              fontSize: '0.65rem', letterSpacing: '0.08em',
              background: filter === s.key ? s.color : 'rgba(255,255,255,0.04)',
              color: filter === s.key ? (s.key === 'supporter' ? '#fff' : '#030202') : '#5c5044',
              fontWeight: filter === s.key ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {s.label} · {byStage(s.key)}
          </button>
        ))}
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')} style={{ padding: '0.45rem 0.85rem', border: 'none', cursor: 'pointer', borderRadius: 20, fontFamily: 'var(--font-body)', fontSize: '0.65rem', background: 'none', color: '#c9a84c' }}>
            Show all ·{contacts.length}
          </button>
        )}
      </div>

      {/* Workflow reminder */}
      <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {['FB notifies you', '→ Log here', '→ Reply to comment', '→ Send DM', '→ Ask for feedback', '→ Track response', '→ They become a fan'].map((step, i) => (
            <span key={i} style={{ fontSize: '0.65rem', color: i === 0 ? '#c9a84c' : i % 2 === 0 ? '#e8ddd0' : '#3a2e26', letterSpacing: '0.04em' }}>{step}</span>
          ))}
        </div>
      </div>

      {/* Add button / form */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} style={{ ...S.btn('primary'), marginBottom: '1.5rem' }}>
          <Plus size={13} /> Log new contact
        </button>
      ) : (
        <AddForm onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Contact list */}
      {loading ? (
        <p style={{ fontSize: '0.78rem', color: '#3a2e26' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#3a2e26' }}>
          <Star size={24} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            {filter === 'all'
              ? 'No contacts yet. When Facebook notifies you of a comment, log them here.'
              : `No contacts in "${STAGES.find(s => s.key === filter)?.label}" stage.`}
          </p>
        </div>
      ) : (
        <div>
          {filter === 'all' ? (
            // Group by stage when showing all
            STAGES.map(stage => {
              const stageContacts = contacts.filter(c => c.stage === stage.key)
              if (!stageContacts.length) return null
              return (
                <div key={stage.key} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: stage.color, fontWeight: 700 }}>
                      {stage.label}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: '#3a2e26' }}>· {stageContacts.length}</span>
                    <div style={{ flex: 1, height: 1, background: `${stage.color}22` }} />
                  </div>
                  {stageContacts.map(c => (
                    <ContactCard key={c.id} contact={c} onUpdate={handleUpdate} onDelete={handleDelete} />
                  ))}
                </div>
              )
            })
          ) : (
            filtered.map(c => (
              <ContactCard key={c.id} contact={c} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))
          )}
        </div>
      )}

      {/* DM template */}
      {contacts.length > 0 && (
        <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: '#3a2e26', display: 'block', marginBottom: '0.5rem' }}>
            DM Template — Asking for Feedback
          </span>
          <p style={{ fontSize: '0.75rem', color: '#7a6a52', lineHeight: 1.75, margin: '0 0 0.6rem', fontStyle: 'italic' }}>
            "Hey [Name], I saw your comment — really appreciate it. Quick question: what did the music make you feel? Honest answer, good or bad. I use real feedback to make the next songs better. Thanks for being here."
          </p>
          <p style={{ fontSize: '0.65rem', color: '#3a2e26', margin: 0, lineHeight: 1.6 }}>
            Keep it short. Ask one real question. Don&apos;t pitch the merch — if they respond, they&apos;re already a fan. The merch comes naturally.
          </p>
        </div>
      )}

    </div>
  )
}
