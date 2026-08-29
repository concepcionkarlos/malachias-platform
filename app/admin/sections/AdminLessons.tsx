'use client'

// Admin section — Voice Lessons: the inquiries from /voice-lessons with a status
// per request. The offer itself (price, counties, discounts) lives in lib/lessons.ts.

import { useEffect, useState } from 'react'
import { Check, ExternalLink } from 'lucide-react'
import { LESSONS, usdLessons, type LessonInquiry } from '@/lib/lessons'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, fontFamily: 'var(--font-body)' }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#c9a84c', color: '#030202', fontWeight: 700 }
const HDR: React.CSSProperties = { fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c', marginBottom: 16 }

export default function AdminLessons() {
  const [inquiries, setInquiries] = useState<LessonInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => { setInquiries(d.lessonInquiries ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [])

  async function save() {
    setSaving(true); setSaved(false); setError('')
    try {
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonInquiries: inquiries }) })
      if (!res.ok) throw new Error()
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { setError('Save failed') } finally { setSaving(false) }
  }

  if (loading) return <p style={{ color: '#8a7f70' }}>Loading…</p>
  const fresh = inquiries.filter(q => q.status === 'new').length

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.06em', color: '#e8ddd0', margin: 0 }}>VOICE LESSONS</h2>
          <p style={{ color: '#8a7f70', fontSize: 12, margin: '4px 0 0' }}>
            {usdLessons(LESSONS.price)} / {LESSONS.lengthMinutes} min · in person in {LESSONS.inPersonCounties.join(', ')} or Zoom · {fresh} new
            &ensp;<a href={LESSONS.path} target="_blank" rel="noreferrer" style={{ color: '#c9a84c' }}>open page <ExternalLink size={11} style={{ verticalAlign: -1 }} /></a>
          </p>
        </div>
        <button style={BTN} onClick={save} disabled={saving}>{saved ? <><Check size={14} /> Saved</> : saving ? 'Saving…' : 'Save statuses'}</button>
      </div>
      {error && <p style={{ color: '#c04020', fontSize: 13 }}>{error}</p>}

      <div style={CARD}>
        <p style={HDR}>INQUIRIES ({inquiries.length})</p>
        {inquiries.length === 0 && <p style={{ fontSize: 12, color: '#8a7f70', margin: 0 }}>None yet. They arrive here and by email. Price, counties and discounts are edited in <code>lib/lessons.ts</code>.</p>}
        {[...inquiries].reverse().map(q => (
          <div key={q.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
            <div style={{ fontSize: 13, color: '#e8ddd0' }}>
              <b>{q.name}</b> · <a href={`mailto:${q.email}`} style={{ color: '#c9a84c' }}>{q.email}</a>{q.phone ? ` · ${q.phone}` : ''}{q.veteran ? ' · veteran' : ''}
              <div style={{ fontSize: 12, color: '#8a7f70', marginTop: 2 }}>{q.format}{q.county ? ` · ${q.county}` : ''}{q.goal ? ` · ${q.goal}` : ''} · {new Date(q.createdAt).toLocaleDateString('en-US')}</div>
              {q.message && <div style={{ fontSize: 12, color: '#a89880', marginTop: 4, whiteSpace: 'pre-wrap' }}>{q.message}</div>}
            </div>
            <select style={{ ...INPUT, width: 130 }} value={q.status} onChange={e => setInquiries(l => l.map(x => x.id === q.id ? { ...x, status: e.target.value as LessonInquiry['status'] } : x))}>
              <option value="new">new</option><option value="contacted">contacted</option><option value="booked">booked</option><option value="declined">declined</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
