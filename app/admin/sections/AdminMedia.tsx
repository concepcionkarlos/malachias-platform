'use client'

import { useEffect, useState, useRef } from 'react'
import { Trash2, Upload, Star, Eye, EyeOff, Plus, Image as ImageIcon, Film } from 'lucide-react'
import type { MediaItem } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }

type Tab = 'photo' | 'video'

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('photo')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoCaption, setVideoCaption] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setItems(d.mediaItems ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load media'); setLoading(false) })
  }, [])

  async function patch(updated: MediaItem[]) {
    setSaving(true)
    try {
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mediaItems: updated }) })
      if (!res.ok) throw new Error()
      setItems(updated)
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function uploadPhoto(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      const newItem: MediaItem = { id: Date.now().toString(36), type: 'photo', url, caption: '', visible: true, isFeatured: false }
      await patch([...items, newItem])
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  async function addVideo() {
    if (!videoUrl.trim()) return
    try {
      const res = await fetch('/api/upload-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: videoUrl, caption: videoCaption }) })
      const newItem: MediaItem = await res.json()
      await patch([...items, newItem])
      setVideoUrl('')
      setVideoCaption('')
      setShowVideoForm(false)
    } catch { setError('Failed to add video') }
  }

  function updateCaption(id: string, caption: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, caption } : i))
  }

  async function saveCaption(id: string) {
    await patch(items)
  }

  async function toggle(id: string, k: 'visible' | 'isFeatured') {
    const updated = items.map(i => i.id === id ? { ...i, [k]: !i[k] } : i)
    await patch(updated)
  }

  async function del(id: string) {
    if (!confirm('Delete this item?')) return
    await patch(items.filter(i => i.id !== id))
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  const visible = items.filter(i => i.type === tab)

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Media</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {tab === 'photo' && (
            <>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 14px' }}>
                <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f) }} />
            </>
          )}
          {tab === 'video' && (
            <button onClick={() => setShowVideoForm(v => !v)} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 14px' }}>
              <Plus size={14} /> Add Video URL
            </button>
          )}
        </div>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      {saving && <p style={{ color: '#5c5044', fontSize: 12, marginBottom: 8 }}>Saving…</p>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0 }}>
        {(['photo', 'video'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 20px', fontSize: 13, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: tab === t ? '#c9a84c' : '#5c5044', borderBottom: tab === t ? '2px solid #c9a84c' : '2px solid transparent', marginBottom: -1 }}>
            {t === 'photo' ? <><ImageIcon size={13} style={{ marginRight: 6 }} />Photos</> : <><Film size={13} style={{ marginRight: 6 }} />Videos</>}
          </button>
        ))}
      </div>

      {/* Add video form */}
      {tab === 'video' && showVideoForm && (
        <div style={{ ...CARD, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Video URL (YouTube / Vimeo)</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={INPUT} placeholder="https://youtu.be/…" />
            </div>
            <div>
              <label style={LABEL}>Caption</label>
              <input type="text" value={videoCaption} onChange={e => setVideoCaption(e.target.value)} style={INPUT} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowVideoForm(false)} style={{ ...BTN_SM, background: 'rgba(255,255,255,0.06)', color: '#8a7f70', padding: '6px 14px' }}>Cancel</button>
            <button onClick={addVideo} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '6px 14px' }}>Add Video</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {visible.length === 0 && <p style={{ color: '#5c5044' }}>No {tab}s yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {visible.map(item => (
          <div key={item.id} style={{ ...CARD, overflow: 'hidden' }}>
            {item.type === 'photo' ? (
              <img src={item.url} alt={item.caption} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: 150, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {item.poster ? <img src={item.poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /> : null}
                <Film size={36} color="#5c5044" style={{ position: 'relative', zIndex: 1 }} />
              </div>
            )}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="text"
                value={item.caption}
                onChange={e => updateCaption(item.id, e.target.value)}
                onBlur={() => saveCaption(item.id)}
                placeholder="Caption…"
                style={{ ...INPUT, fontSize: 12, padding: '5px 8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => toggle(item.id, 'isFeatured')} title="Featured" style={{ ...BTN_SM, background: item.isFeatured ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', color: item.isFeatured ? '#c9a84c' : '#5c5044' }}>
                    <Star size={12} />
                  </button>
                  <button onClick={() => toggle(item.id, 'visible')} title="Visible" style={{ ...BTN_SM, background: item.visible ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)', color: item.visible ? '#34d399' : '#5c5044' }}>
                    {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <button onClick={() => del(item.id)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020' }}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
