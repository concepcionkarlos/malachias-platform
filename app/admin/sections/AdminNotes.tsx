'use client'

// Admin section — Admin Notes: a simple to-do/checklist with normal/high priority,
// split into active and completed lists, with add, check-off, and delete actions.

import { useEffect, useState } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import type { AdminNote, AdminNotePriority } from '@/lib/data'

const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }

export default function AdminNotes() {
  const [notes, setNotes] = useState<AdminNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<AdminNotePriority>('normal')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setNotes(d.adminNotes ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load notes'); setLoading(false) })
  }, [])

  async function patch(updated: AdminNote[]) {
    const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminNotes: updated }) })
    if (!res.ok) throw new Error('Save failed')
    setNotes(updated)
  }

  async function addNote() {
    if (!text.trim()) return
    setAdding(true)
    try {
      const note: AdminNote = {
        id: Date.now().toString(36),
        text: text.trim(),
        done: false,
        priority,
        createdAt: new Date().toISOString(),
      }
      await patch([...notes, note])
      setText('')
      setPriority('normal')
    } catch { setError('Add failed') }
    finally { setAdding(false) }
  }

  async function toggleDone(id: string) {
    try { await patch(notes.map(n => n.id === id ? { ...n, done: !n.done } : n)) }
    catch { setError('Update failed') }
  }

  async function del(id: string) {
    try { await patch(notes.filter(n => n.id !== id)) }
    catch { setError('Delete failed') }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  const active = notes.filter(n => !n.done)
  const completed = notes.filter(n => n.done)

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0', maxWidth: 680 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', marginBottom: 24 }}>Admin Notes</h2>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* Add note */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '16px 20px', marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addNote() }}
            placeholder="Add a note…"
            style={{ ...INPUT, flex: 1 }}
          />
          <button
            onClick={() => setPriority(p => p === 'normal' ? 'high' : 'normal')}
            title="Toggle priority"
            style={{ ...BTN_SM, background: priority === 'high' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', color: priority === 'high' ? '#c9a84c' : '#5c5044', padding: '7px 10px', flexShrink: 0 }}
          >
            <AlertCircle size={14} />
            <span style={{ fontSize: 11 }}>{priority === 'high' ? 'High' : 'Normal'}</span>
          </button>
          <button onClick={addNote} disabled={adding || !text.trim()} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 14px', flexShrink: 0 }}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Active notes */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c', marginBottom: 12 }}>
          ACTIVE ({active.length})
        </div>
        {active.length === 0 && <p style={{ color: '#5c5044', fontSize: 13 }}>No active notes.</p>}
        {active.map(n => (
          <NoteRow key={n.id} note={n} onToggle={toggleDone} onDelete={del} formatDate={formatDate} />
        ))}
      </div>

      {/* Completed notes */}
      {completed.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#5c5044', marginBottom: 12 }}>
            COMPLETED ({completed.length})
          </div>
          {completed.map(n => (
            <NoteRow key={n.id} note={n} onToggle={toggleDone} onDelete={del} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteRow({ note, onToggle, onDelete, formatDate }: {
  note: AdminNote
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  formatDate: (iso: string) => string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
      background: 'rgba(255,255,255,0.03)', borderRadius: 7, marginBottom: 8,
      borderLeft: note.priority === 'high' ? '3px solid #c9a84c' : '3px solid transparent',
      opacity: note.done ? 0.5 : 1,
    }}>
      <input
        type="checkbox"
        checked={note.done}
        onChange={() => onToggle(note.id)}
        style={{ marginTop: 2, accentColor: '#c9a84c', cursor: 'pointer', flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 14, color: '#e8ddd0', textDecoration: note.done ? 'line-through' : 'none' }}>{note.text}</span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
          {note.priority === 'high' && (
            <span style={{ fontSize: 10, letterSpacing: '0.08em', color: '#c9a84c', background: 'rgba(201,168,76,0.12)', padding: '1px 7px', borderRadius: 10 }}>HIGH</span>
          )}
          <span style={{ fontSize: 11, color: '#5c5044' }}>{formatDate(note.createdAt)}</span>
        </div>
      </div>
      <button onClick={() => onDelete(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 4, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
        <Trash2 size={13} />
      </button>
    </div>
  )
}
