'use client'

// Admin section — Content Calendar: plans social media posts via /api/content-posts.
// Add/edit/delete posts with platform, status, schedule date, caption, hashtags, and
// media notes; filter by status and advance posts through idea → draft → scheduled → posted.

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import type { ContentPost, ContentPlatform, ContentStatus } from '@/lib/data'

const PLATFORM_COLORS: Record<ContentPlatform, string> = {
  instagram: '#e1306c', facebook: '#1877f2', youtube: '#ff0000',
  tiktok: '#69c9d0', other: '#8a7f70',
}
const STATUS_COLORS: Record<ContentStatus, string> = {
  idea: '#3a2e26', draft: '#c9a84c', scheduled: '#60a5fa', posted: '#34d399',
}

const PLATFORMS: ContentPlatform[] = ['instagram', 'facebook', 'youtube', 'tiktok', 'other']
const STATUSES: ContentStatus[] = ['idea', 'draft', 'scheduled', 'posted']

const BLANK = { platform: 'instagram' as ContentPlatform, status: 'idea' as ContentStatus, caption: '', scheduledFor: '', hashtags: '', mediaNote: '' }

export default function AdminContentCalendar() {
  const [posts, setPosts]   = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]  = useState(false)
  const [editId, setEditId]  = useState<string | null>(null)
  const [form, setForm]      = useState(BLANK)
  const [saving, setSaving]  = useState(false)
  const [filter, setFilter]  = useState<ContentStatus | 'all'>('all')

  useEffect(() => {
    fetch('/api/content-posts').then(r => r.json()).then(d => { setPosts(d); setLoading(false) })
  }, [])

  function openAdd() { setForm(BLANK); setEditId(null); setAdding(true) }
  function openEdit(p: ContentPost) {
    setForm({ platform: p.platform, status: p.status, caption: p.caption ?? '', scheduledFor: p.scheduledFor ?? '', hashtags: p.hashtags ?? '', mediaNote: p.mediaNote ?? '' })
    setEditId(p.id); setAdding(true)
  }

  async function save() {
    setSaving(true)
    if (editId) {
      const updated = await fetch('/api/content-posts', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      }).then(r => r.json())
      setPosts(prev => prev.map(p => p.id === editId ? updated : p))
    } else {
      const created = await fetch('/api/content-posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(r => r.json())
      setPosts(prev => [...prev, created])
    }
    setAdding(false); setEditId(null); setSaving(false)
  }

  async function remove(id: string) {
    await fetch('/api/content-posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  async function setStatus(id: string, status: ContentStatus) {
    const updated = await fetch('/api/content-posts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(r => r.json())
    setPosts(prev => prev.map(p => p.id === id ? updated : p))
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const visible = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>CONTENT CALENDAR</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>{posts.length} posts · {posts.filter(p => p.status === 'scheduled').length} scheduled</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
          <Plus size={14} /> Add Post
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
        {(['all', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)', border: '1px solid', textTransform: 'capitalize',
              background: filter === s ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderColor: filter === s ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
              color: filter === s ? '#e8ddd0' : '#5c5044',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {adding && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 10 }}>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as ContentPlatform }))} style={{ ...INPUT, width: 'auto' }}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ContentStatus }))} style={{ ...INPUT, width: 'auto' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="datetime-local" value={form.scheduledFor} onChange={e => setForm(f => ({ ...f, scheduledFor: e.target.value }))} style={{ ...INPUT, width: 'auto' }} />
          </div>
          <textarea value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Caption / post text" rows={3} style={{ ...INPUT, resize: 'none', marginBottom: 8 }} />
          <input value={form.hashtags} onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))} placeholder="#hashtags" style={{ ...INPUT, marginBottom: 8 }} />
          <input value={form.mediaNote} onChange={e => setForm(f => ({ ...f, mediaNote: e.target.value }))} placeholder="Media note (photo, reel, graphic…)" style={{ ...INPUT, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: '7px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
              <Check size={13} style={{ display: 'inline', marginRight: 4 }} />{saving ? 'Saving…' : editId ? 'Update' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setEditId(null) }} style={{ padding: '7px 16px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              <X size={13} style={{ display: 'inline', marginRight: 4 }} />Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : visible.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>No posts yet — add your first idea</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visible.map(post => (
            <div key={post.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_COLORS[post.platform], flexShrink: 0, marginTop: 5 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: PLATFORM_COLORS[post.platform] }}>{post.platform}</span>
                  <span style={{ fontSize: 10, color: '#2a2215' }}>·</span>
                  <span style={{ fontSize: 10, color: STATUS_COLORS[post.status], letterSpacing: '0.10em' }}>{post.status}</span>
                  {post.scheduledFor && (
                    <>
                      <span style={{ fontSize: 10, color: '#2a2215' }}>·</span>
                      <span style={{ fontSize: 10, color: '#3a2e26' }}>{new Date(post.scheduledFor).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                {post.caption && <p style={{ margin: '0 0 4px', fontSize: 13, color: '#e8ddd0', lineHeight: 1.5, wordBreak: 'break-word' }}>{post.caption.slice(0, 180)}{post.caption.length > 180 ? '…' : ''}</p>}
                {post.hashtags && <p style={{ margin: '0 0 4px', fontSize: 11, color: '#3a2e26' }}>{post.hashtags}</p>}
                {post.mediaNote && <p style={{ margin: 0, fontSize: 11, color: '#5c5044', fontStyle: 'italic' }}>{post.mediaNote}</p>}
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {STATUSES.filter(s => s !== post.status).slice(0, 1).map(next => (
                  <button key={next} onClick={() => setStatus(post.id, next)} style={{ fontSize: 10, padding: '3px 8px', border: `1px solid ${STATUS_COLORS[next]}22`, borderRadius: 4, background: 'transparent', color: STATUS_COLORS[next], cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    → {next}
                  </button>
                ))}
                <button onClick={() => openEdit(post)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 3 }}><Edit2 size={12} /></button>
                <button onClick={() => remove(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e26', padding: 3 }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
