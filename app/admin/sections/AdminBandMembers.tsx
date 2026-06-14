'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, Upload, User } from 'lucide-react'
import type { BandMember } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }

const BLANK: Omit<BandMember, 'id'> = { name: '', role: '', bio: '', photo: '', branch: '', tours: '', visible: true, email: '' }

export default function AdminBandMembers() {
  const [members, setMembers] = useState<BandMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<BandMember, 'id'>>(BLANK)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setMembers(d.bandMembers ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load band members'); setLoading(false) })
  }, [])

  function openAdd() { setForm(BLANK); setEditId(null); setShowModal(true) }
  function openEdit(m: BandMember) { const { id, ...rest } = m; setForm({ ...BLANK, ...rest }); setEditId(id); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditId(null) }
  function setField(k: keyof Omit<BandMember, 'id'>, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function uploadPhoto(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setField('photo', url)
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  async function save() {
    setSaving(true)
    try {
      let updated: BandMember[]
      if (editId) {
        updated = members.map(m => m.id === editId ? { ...form, id: editId } : m)
      } else {
        updated = [...members, { ...form, id: Date.now().toString(36) }]
      }
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bandMembers: updated }) })
      if (!res.ok) throw new Error()
      setMembers(updated)
      closeModal()
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this member?')) return
    const updated = members.filter(m => m.id !== id)
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bandMembers: updated }) })
    setMembers(updated)
  }

  async function toggleVisible(m: BandMember) {
    const updated = members.map(x => x.id === m.id ? { ...x, visible: !x.visible } : x)
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bandMembers: updated }) })
    setMembers(updated)
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Band Members</h2>
        <button onClick={openAdd} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 14px' }}>
          <Plus size={14} /> Add Member
        </button>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {members.length === 0 && <p style={{ color: '#5c5044', gridColumn: '1/-1' }}>No band members yet.</p>}
        {members.map(m => (
          <div key={m.id} style={{ ...CARD, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} color="#5c5044" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e8ddd0' }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#c9a84c', marginTop: 2 }}>{m.role}</div>
                {m.branch && <div style={{ fontSize: 11, color: '#8a7f70', marginTop: 2 }}>{m.branch}{m.tours ? ` · ${m.tours}` : ''}</div>}
              </div>
            </div>

            {m.bio && <p style={{ fontSize: 12, color: '#8a7f70', lineHeight: 1.5, margin: 0 }}>{m.bio.slice(0, 120)}{m.bio.length > 120 ? '…' : ''}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: m.visible ? '#34d399' : '#5c5044' }}>
                <input type="checkbox" checked={!!m.visible} onChange={() => toggleVisible(m)} style={{ accentColor: '#c9a84c' }} />
                {m.visible ? 'Visible' : 'Hidden'}
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(m)} style={{ ...BTN_SM, background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}><Pencil size={12} /></button>
                <button onClick={() => del(m.id)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020' }}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ ...CARD, padding: 28, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 13, color: '#c9a84c' }}>{editId ? 'EDIT MEMBER' : 'ADD MEMBER'}</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f70' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[{ k: 'name', label: 'Name' }, { k: 'role', label: 'Role / Instrument' }, { k: 'branch', label: 'Military Branch' }, { k: 'tours', label: 'Tours / Deployments' }, { k: 'email', label: 'Email (for rehearsal invites)' }].map(({ k, label }) => (
                <div key={k}>
                  <label style={LABEL}>{label}</label>
                  <input type="text" value={(form as Record<string, unknown>)[k] as string ?? ''} onChange={e => setField(k as keyof Omit<BandMember, 'id'>, e.target.value)} style={INPUT} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={LABEL}>Bio</label>
              <textarea value={form.bio} onChange={e => setField('bio', e.target.value)} rows={4} style={{ ...INPUT, resize: 'vertical' }} />
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={LABEL}>Photo URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={form.photo ?? ''} onChange={e => setField('photo', e.target.value)} style={INPUT} placeholder="https://…" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '7px 12px', flexShrink: 0 }}>
                  <Upload size={13} /> {uploading ? '…' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f) }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#8a7f70', marginTop: 16 }}>
              <input type="checkbox" checked={!!form.visible} onChange={e => setField('visible', e.target.checked)} />
              Visible on site
            </label>

            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ ...BTN_SM, background: 'rgba(255,255,255,0.06)', color: '#8a7f70', padding: '8px 16px' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '8px 18px' }}>
                <Check size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
