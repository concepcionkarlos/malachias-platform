'use client'

import { useState, useEffect } from 'react'
import type { SongStory } from '@/lib/data'

const S = {
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: '#e8ddd0', padding: '7px 10px', fontSize: 13, fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box' as const },
  textarea: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: '#e8ddd0', padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box' as const, resize: 'vertical' as const },
  label: { fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 },
  btn: (c: string) => ({ background: c, border: 'none', borderRadius: 4, color: c === 'rgba(255,255,255,0.06)' ? '#8a7f70' : '#070707', cursor: 'pointer', padding: '6px 14px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }),
}

const BLANK: Omit<SongStory, 'id' | 'createdAt'> = {
  title: '', verse: '', verseRef: '', story: '', moment: '',
  spotifyUrl: '', appleUrl: '', youtubeUrl: '', order: 99, visible: true,
}

function StoryForm({ initial, onSave, onCancel }: {
  initial: Omit<SongStory, 'id' | 'createdAt'>
  onSave: (data: Omit<SongStory, 'id' | 'createdAt'>) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof BLANK, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.verse || !form.story) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={S.label}>Song Title *</label>
          <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="The Messenger" required />
        </div>
        <div>
          <label style={S.label}>Verse Reference *</label>
          <input style={S.input} value={form.verseRef} onChange={e => set('verseRef', e.target.value)} placeholder="Malachi 3:1" required />
        </div>
      </div>

      <div>
        <label style={S.label}>Verse (full text) *</label>
        <textarea style={S.textarea} rows={3} value={form.verse} onChange={e => set('verse', e.target.value)} placeholder='"See, I will send my messenger…"' required />
      </div>

      <div>
        <label style={S.label}>Story * (use blank lines to separate paragraphs)</label>
        <textarea style={S.textarea} rows={10} value={form.story} onChange={e => set('story', e.target.value)} placeholder="This song didn't start as a song…" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={S.label}>Moment (optional)</label>
          <input style={S.input} value={form.moment ?? ''} onChange={e => set('moment', e.target.value)} placeholder="Fort Wayne, 2017" />
        </div>
        <div>
          <label style={S.label}>Order</label>
          <input style={S.input} type="number" min={1} max={999} value={form.order} onChange={e => set('order', Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <label style={{ ...S.label, marginBottom: 8 }}>Visible</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} />
            <span style={{ fontSize: 13, color: '#8a7f70' }}>Show on site</span>
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={S.label}>Spotify URL</label>
          <input style={S.input} value={form.spotifyUrl ?? ''} onChange={e => set('spotifyUrl', e.target.value)} placeholder="https://open.spotify.com/…" />
        </div>
        <div>
          <label style={S.label}>Apple Music URL</label>
          <input style={S.input} value={form.appleUrl ?? ''} onChange={e => set('appleUrl', e.target.value)} placeholder="https://music.apple.com/…" />
        </div>
        <div>
          <label style={S.label}>YouTube URL</label>
          <input style={S.input} value={form.youtubeUrl ?? ''} onChange={e => set('youtubeUrl', e.target.value)} placeholder="https://youtube.com/…" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button type="submit" disabled={saving} style={S.btn('#c9a84c')}>
          {saving ? 'Saving…' : 'Save Story'}
        </button>
        <button type="button" onClick={onCancel} style={S.btn('rgba(255,255,255,0.06)')}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminSongStories() {
  const [stories, setStories] = useState<SongStory[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setStories(d.songStories ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function save(updated: SongStory[]) {
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songStories: updated }),
    })
    setStories(updated)
  }

  async function handleAdd(data: Omit<SongStory, 'id' | 'createdAt'>) {
    const newStory: SongStory = { ...data, id: `ss-${Date.now()}`, createdAt: new Date().toISOString() }
    await save([...stories, newStory])
    setAdding(false)
  }

  async function handleEdit(id: string, data: Omit<SongStory, 'id' | 'createdAt'>) {
    await save(stories.map(s => s.id === id ? { ...s, ...data } : s))
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this story?')) return
    await save(stories.filter(s => s.id !== id))
  }

  async function toggleVisible(id: string) {
    await save(stories.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  const sorted = [...stories].sort((a, b) => a.order - b.order)

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase' }}>
          Behind the Song
        </h2>
        {!adding && (
          <button onClick={() => setAdding(true)} style={S.btn('#c9a84c')}>
            + Add Story
          </button>
        )}
      </div>

      {adding && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.14em', color: '#c9a84c', marginBottom: 16, textTransform: 'uppercase' }}>New Song Story</p>
          <StoryForm
            initial={{ ...BLANK }}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {sorted.length === 0 ? (
        <p style={{ color: '#5c5044', fontSize: 13 }}>No song stories yet. Add the first one.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map(s => (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
              {editingId === s.id ? (
                <div style={{ padding: '20px 24px' }}>
                  <StoryForm
                    initial={{ title: s.title, verse: s.verse, verseRef: s.verseRef, story: s.story, moment: s.moment, spotifyUrl: s.spotifyUrl, appleUrl: s.appleUrl, youtubeUrl: s.youtubeUrl, order: s.order, visible: s.visible }}
                    onSave={data => handleEdit(s.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <span style={{ fontSize: 11, color: '#5c5044', minWidth: 24, paddingTop: 2 }}>
                    {String(s.order).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: s.visible ? '#e8ddd0' : '#5c5044' }}>{s.title}</span>
                      <span style={{ fontSize: 10, letterSpacing: '0.18em', color: '#c9a84c', opacity: 0.6 }}>{s.verseRef}</span>
                      {!s.visible && <span style={{ fontSize: 10, color: '#5c5044', letterSpacing: '0.1em' }}>HIDDEN</span>}
                    </div>
                    <p style={{ fontSize: 12, color: '#5c5044', lineHeight: 1.5, maxWidth: 500 }}>
                      {s.story.slice(0, 120)}…
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleVisible(s.id)} style={S.btn('rgba(255,255,255,0.06)')}>
                      {s.visible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => setEditingId(s.id)} style={S.btn('rgba(255,255,255,0.06)')}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{ ...S.btn('rgba(192,64,32,0.15)'), color: '#c04020' }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
