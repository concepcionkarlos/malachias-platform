'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, Upload, Package } from 'lucide-react'
import type { MerchItem } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }

const CATEGORIES: MerchItem['category'][] = ['apparel', 'music', 'accessories', 'other']

const BLANK: Omit<MerchItem, 'id'> = {
  name: '', price: 0, image: '', category: 'apparel', available: true, visible: true,
  externalUrl: '', description: '', story: '', atShows: false, stockQuantity: undefined,
  specs: [],
}

export default function AdminMerch() {
  const [items, setItems] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<MerchItem, 'id'>>(BLANK)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [specsText, setSpecsText] = useState('[]')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setItems(d.merch ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load merch'); setLoading(false) })
  }, [])

  function openAdd() { setForm(BLANK); setSpecsText('[]'); setEditId(null); setShowModal(true) }
  function openEdit(m: MerchItem) {
    const { id, ...rest } = m
    setForm({ ...BLANK, ...rest })
    setSpecsText(JSON.stringify(rest.specs ?? [], null, 2))
    setEditId(id)
    setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditId(null) }
  function setField(k: keyof Omit<MerchItem, 'id'>, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setField('image', url)
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  async function save() {
    setSaving(true)
    try {
      let specs: { label: string; value: string }[] = []
      try { specs = JSON.parse(specsText) } catch { /* ignore */ }
      const entry = { ...form, specs }
      let updated: MerchItem[]
      if (editId) {
        updated = items.map(i => i.id === editId ? { ...entry, id: editId } : i)
      } else {
        updated = [...items, { ...entry, id: Date.now().toString(36) }]
      }
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merch: updated }) })
      if (!res.ok) throw new Error()
      setItems(updated)
      closeModal()
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this item?')) return
    const updated = items.filter(i => i.id !== id)
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merch: updated }) })
    setItems(updated)
  }

  async function toggleField(id: string, k: 'available' | 'visible') {
    const updated = items.map(i => i.id === id ? { ...i, [k]: !i[k] } : i)
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merch: updated }) })
    setItems(updated)
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Merch</h2>
        <button onClick={openAdd} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 14px' }}>
          <Plus size={14} /> Add Item
        </button>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {items.length === 0 && <p style={{ color: '#5c5044', gridColumn: '1/-1' }}>No merch items yet.</p>}
        {items.map(item => (
          <div key={item.id} style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
            {item.image ? (
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
            ) : (
              <div style={{ width: '100%', height: 160, background: 'rgba(255,255,255,0.04)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={36} color="#5c5044" />
              </div>
            )}
            <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#c9a84c', marginTop: 2 }}>${item.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, letterSpacing: '0.08em', color: '#8a7f70', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 10 }}>{item.category}</span>
                <span style={{ fontSize: 10, color: item.available ? '#34d399' : '#5c5044', background: item.available ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 10 }}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 11, color: item.available ? '#34d399' : '#5c5044' }}>
                    <input type="checkbox" checked={item.available} onChange={() => toggleField(item.id, 'available')} style={{ accentColor: '#34d399' }} />
                    Avail
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 11, color: item.visible ? '#60a5fa' : '#5c5044' }}>
                    <input type="checkbox" checked={item.visible} onChange={() => toggleField(item.id, 'visible')} style={{ accentColor: '#60a5fa' }} />
                    Visible
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button onClick={() => openEdit(item)} style={{ ...BTN_SM, background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}><Pencil size={12} /></button>
                  <button onClick={() => del(item.id)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020' }}><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ ...CARD, padding: 28, width: '100%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 13, color: '#c9a84c' }}>{editId ? 'EDIT ITEM' : 'ADD ITEM'}</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f70' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="merch-name" style={LABEL}>Name</label>
                <input id="merch-name" type="text" value={form.name} onChange={e => setField('name', e.target.value)} style={INPUT} placeholder="Item name" />
              </div>
              <div>
                <label htmlFor="merch-price" style={LABEL}>Price ($)</label>
                <input id="merch-price" type="number" value={form.price} onChange={e => setField('price', parseFloat(e.target.value) || 0)} style={INPUT} placeholder="0.00" />
              </div>
              <div>
                <label htmlFor="merch-category" style={LABEL}>Category</label>
                <select id="merch-category" value={form.category} onChange={e => setField('category', e.target.value as MerchItem['category'])} style={INPUT}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="merch-stock" style={LABEL}>Stock Quantity</label>
                <input id="merch-stock" type="number" value={form.stockQuantity ?? ''} onChange={e => setField('stockQuantity', e.target.value ? Number(e.target.value) : undefined)} style={INPUT} placeholder="Leave blank for unlimited" />
              </div>
              <div>
                <label htmlFor="merch-url" style={LABEL}>External URL</label>
                <input id="merch-url" type="text" value={form.externalUrl ?? ''} onChange={e => setField('externalUrl', e.target.value)} style={INPUT} placeholder="https://…" />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label htmlFor="merch-image" style={LABEL}>Image URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input id="merch-image" type="text" value={form.image ?? ''} onChange={e => setField('image', e.target.value)} style={INPUT} placeholder="https://…" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '7px 12px', flexShrink: 0 }}>
                  <Upload size={13} /> {uploading ? '…' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" aria-label="Upload image file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label htmlFor="merch-description" style={LABEL}>Description</label>
              <textarea id="merch-description" value={form.description ?? ''} onChange={e => setField('description', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical' }} placeholder="Short product description" />
            </div>

            <div style={{ marginTop: 14 }}>
              <label htmlFor="merch-story" style={LABEL}>Story</label>
              <textarea id="merch-story" value={form.story ?? ''} onChange={e => setField('story', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical' }} placeholder="The story behind this item" />
            </div>

            <div style={{ marginTop: 14 }}>
              <label htmlFor="merch-specs" style={LABEL}>Specs (JSON array of {"{"}"label","value"{"}"} objects)</label>
              <textarea id="merch-specs" value={specsText} onChange={e => setSpecsText(e.target.value)} rows={4} style={{ ...INPUT, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} placeholder='[{"label":"Size","value":"M"}]' />
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
              {[{ k: 'available', label: 'Available' }, { k: 'visible', label: 'Visible' }, { k: 'atShows', label: 'Sell at Shows' }].map(({ k, label }) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#8a7f70' }}>
                  <input type="checkbox" checked={!!(form as Record<string, unknown>)[k]} onChange={e => setField(k as keyof Omit<MerchItem, 'id'>, e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>

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
