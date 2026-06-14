'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Music, Mic } from 'lucide-react'
import type { Song, SongStatus } from '@/lib/data'

const STATUS_COLOR: Record<SongStatus, string> = {
  ready:    '#34d399',
  learning: '#c9a84c',
  shelved:  '#5c5044',
}

const STATUS_LABEL: Record<SongStatus, string> = {
  ready:    'Ready',
  learning: 'Learning',
  shelved:  'Shelved',
}

export default function AdminSetlist() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'original' as 'original' | 'cover', originalArtist: '', status: 'ready' as SongStatus, notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/songs').then(r => r.json()).then(d => { setSongs(d); setLoading(false) })
  }, [])

  async function save() {
    if (!form.title.trim()) return
    setSaving(true)
    const maxOrder = songs.length ? Math.max(...songs.map(s => s.order)) : 0
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, originalArtist: form.type === 'cover' ? form.originalArtist : undefined, order: maxOrder + 1 }),
    })
    const song = await res.json()
    setSongs(prev => [...prev, song].sort((a, b) => a.order - b.order))
    setForm({ title: '', type: 'original', originalArtist: '', status: 'ready', notes: '' })
    setAdding(false)
    setSaving(false)
  }

  async function toggleStatus(song: Song) {
    const next: SongStatus = song.status === 'ready' ? 'learning' : song.status === 'learning' ? 'shelved' : 'ready'
    const updated = await fetch('/api/songs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: song.id, status: next }),
    }).then(r => r.json())
    setSongs(prev => prev.map(s => s.id === song.id ? updated : s))
  }

  async function remove(id: string) {
    await fetch('/api/songs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSongs(prev => prev.filter(s => s.id !== id))
  }

  const originals = songs.filter(s => s.type === 'original')
  const covers    = songs.filter(s => s.type === 'cover')

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>SET LIST</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>
            {songs.filter(s => s.status === 'ready').length} songs performance ready · {songs.length} total
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}
        >
          <Plus size={14} /> Add Song
        </button>
      </div>

      {/* Add Form */}
      {adding && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, marginBottom: 10 }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Song title" style={INPUT} />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'original' | 'cover' }))} style={{ ...INPUT, width: 'auto' }}>
              <option value="original">Original</option>
              <option value="cover">Cover</option>
            </select>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as SongStatus }))} style={{ ...INPUT, width: 'auto' }}>
              <option value="ready">Ready</option>
              <option value="learning">Learning</option>
              <option value="shelved">Shelved</option>
            </select>
          </div>
          {form.type === 'cover' && (
            <input value={form.originalArtist} onChange={e => setForm(f => ({ ...f, originalArtist: e.target.value }))} placeholder="Original artist" style={{ ...INPUT, marginBottom: 10 }} />
          )}
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes (optional)" style={{ ...INPUT, marginBottom: 12 }} />
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {[
            { label: 'Originals', icon: Mic, items: originals },
            { label: 'Covers',    icon: Music, items: covers },
          ].map(({ label, icon: Icon, items }) => (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon size={13} style={{ color: '#c9a84c' }} />
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8a7f70' }}>{label}</span>
                <span style={{ fontSize: '0.7rem', color: '#3a2e26', marginLeft: 'auto' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map(song => (
                  <div
                    key={song.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#e8ddd0', flex: 1 }}>
                      {song.title}
                      {song.originalArtist && <span style={{ color: '#3a2e26', fontSize: '0.65rem', marginLeft: 6 }}>{song.originalArtist}</span>}
                    </span>
                    <button
                      onClick={() => toggleStatus(song)}
                      style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 99, border: 'none', cursor: 'pointer', background: 'transparent', color: STATUS_COLOR[song.status], letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}
                    >
                      {STATUS_LABEL[song.status]}
                    </button>
                    <button onClick={() => remove(song.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e26', padding: 2 }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {items.length === 0 && <p style={{ fontSize: 12, color: '#2a2215', padding: '8px 0' }}>No {label.toLowerCase()} yet</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
