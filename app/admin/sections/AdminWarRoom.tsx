'use client'

// Admin section — War Room: posts and manages the band's Daily Reflection (a dated
// scripture verse, written reflection, and optional suggested song). One entry per day,
// newest marked LIVE, with delete and history. Persists via dailyReflections in /api/content.

import { useState, useEffect } from 'react'
import type { DailyReflection } from '@/lib/data'

const S = {
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: '#e8ddd0', padding: '7px 10px', fontSize: 13, fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box' as const },
  textarea: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 5, color: '#e8ddd0', padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box' as const, resize: 'vertical' as const },
  label: { fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 },
  btn: (c: string) => ({ background: c, border: 'none', borderRadius: 4, color: c === 'rgba(255,255,255,0.06)' ? '#8a7f70' : '#070707', cursor: 'pointer', padding: '6px 14px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }),
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function displayDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function AdminWarRoom() {
  const [reflections, setReflections] = useState<DailyReflection[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    date: today(),
    verse: '',
    verseRef: '',
    reflection: '',
    suggestedSong: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setReflections(d.dailyReflections ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.verse || !form.verseRef || !form.reflection) return
    setSaving(true)

    const newEntry: DailyReflection = {
      id: `dr-${Date.now()}`,
      date: form.date,
      verse: form.verse,
      verseRef: form.verseRef,
      reflection: form.reflection,
      suggestedSong: form.suggestedSong || undefined,
      createdAt: new Date().toISOString(),
    }

    const updated = [newEntry, ...reflections.filter(r => r.date !== form.date)]
      .sort((a, b) => b.date.localeCompare(a.date))

    const res = await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyReflections: updated }),
    })

    if (res.ok) {
      setReflections(updated)
      setForm({ date: today(), verse: '', verseRef: '', reflection: '', suggestedSong: '' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this reflection?')) return
    const updated = reflections.filter(r => r.id !== id)
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyReflections: updated }),
    })
    setReflections(updated)
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', marginBottom: 24, textTransform: 'uppercase' }}>
        War Room · Daily Reflection
      </h2>

      {/* New reflection form */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', color: '#c9a84c', marginBottom: 16, textTransform: 'uppercase' }}>
          Post a Reflection
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.label}>Date</label>
              <input type="date" style={S.input} value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Verse Reference *</label>
              <input style={S.input} value={form.verseRef} onChange={e => set('verseRef', e.target.value)} placeholder="Psalm 23:1–3" required />
            </div>
          </div>

          <div>
            <label style={S.label}>Verse (full text) *</label>
            <textarea style={S.textarea} rows={3} value={form.verse} onChange={e => set('verse', e.target.value)} placeholder='"The Lord is my shepherd; I shall not want…"' required />
          </div>

          <div>
            <label style={S.label}>Reflection * (your words — 2–5 sentences)</label>
            <textarea style={S.textarea} rows={4} value={form.reflection} onChange={e => set('reflection', e.target.value)} placeholder="After two tours, I came home needing…" required />
          </div>

          <div>
            <label style={S.label}>Suggested Song (optional)</label>
            <input style={S.input} value={form.suggestedSong} onChange={e => set('suggestedSong', e.target.value)} placeholder="The Messenger" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="submit" disabled={saving} style={S.btn('#c9a84c')}>
              {saving ? 'Posting…' : 'Post Reflection'}
            </button>
            {success && (
              <span style={{ fontSize: 12, color: '#34d399', letterSpacing: '0.08em' }}>
                Posted successfully
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Reflection history */}
      <p style={{ fontSize: 11, letterSpacing: '0.20em', color: '#5c5044', textTransform: 'uppercase', marginBottom: 14 }}>
        History ({reflections.length})
      </p>

      {reflections.length === 0 ? (
        <p style={{ color: '#5c5044', fontSize: 13 }}>No reflections yet. Post the first one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reflections.map((r, i) => (
            <div key={r.id} style={{
              background: i === 0 ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: 6, padding: '14px 18px',
              display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.14em', color: i === 0 ? '#c9a84c' : '#5c5044' }}>
                    {displayDate(r.date)}
                  </span>
                  {i === 0 && <span style={{ fontSize: 9, letterSpacing: '0.20em', color: '#c9a84c', background: 'rgba(201,168,76,0.12)', padding: '2px 6px', borderRadius: 3 }}>LIVE</span>}
                </div>
                <p style={{ fontSize: 12, color: '#8a7f70', fontStyle: 'italic', marginBottom: 4, lineHeight: 1.5 }}>
                  {r.verse.length > 100 ? r.verse.slice(0, 100) + '…' : r.verse} <span style={{ color: '#5c5044' }}>— {r.verseRef}</span>
                </p>
                <p style={{ fontSize: 12, color: '#5c5044', lineHeight: 1.5 }}>
                  {r.reflection.length > 120 ? r.reflection.slice(0, 120) + '…' : r.reflection}
                </p>
                {r.suggestedSong && (
                  <p style={{ fontSize: 11, color: '#4a3f2e', marginTop: 4 }}>♪ {r.suggestedSong}</p>
                )}
              </div>
              <button onClick={() => handleDelete(r.id)} style={{ ...S.btn('rgba(192,64,32,0.12)'), color: '#c04020', flexShrink: 0 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
