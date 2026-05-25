'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import type { Show, ShowStatus } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }

function statusColor(s?: ShowStatus) {
  if (s === 'Confirmed') return '#34d399'
  if (s === 'Pending') return '#c9a84c'
  if (s === 'Hold') return '#60a5fa'
  return '#5c5044'
}

const BLANK: Omit<Show, 'id'> = {
  date: '', venue: '', city: '', time: '', ticketUrl: '', showStatus: 'Pending',
  guarantee: undefined, payout: undefined, loadInTime: '', soundCheckTime: '', setLength: '',
  contactPerson: '', contactEmail: '', showNotes: '', isFeatured: false, visible: true,
}

export default function AdminShows() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Show, 'id'>>(BLANK)
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setShows(d.shows ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load shows'); setLoading(false) })
  }, [])

  function openAdd() { setForm(BLANK); setEditId(null); setShowModal(true) }
  function openEdit(s: Show) { const { id, ...rest } = s; setForm({ ...BLANK, ...rest }); setEditId(id); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditId(null) }

  function setField(k: keyof Omit<Show, 'id'>, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    try {
      let updated: Show[]
      if (editId) {
        updated = shows.map(s => s.id === editId ? { ...form, id: editId } : s)
      } else {
        updated = [...shows, { ...form, id: Date.now().toString(36) }]
      }
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shows: updated }) })
      if (!res.ok) throw new Error()
      setShows(updated)
      closeModal()
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this show?')) return
    const updated = shows.filter(s => s.id !== id)
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shows: updated }) })
    setShows(updated)
  }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Shows</h2>
        <button onClick={openAdd} style={{ ...BTN_SM, background: '#c9a84c', color: '#070707', fontWeight: 600 }}>
          <Plus size={14} /> Add Show
        </button>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ ...CARD, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Date', 'Venue', 'City', 'Status', 'Guarantee', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#5c5044', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shows.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '24px 16px', color: '#5c5044', textAlign: 'center' }}>No shows yet.</td></tr>
            )}
            {shows.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px 16px', color: '#e8ddd0' }}>{s.date}</td>
                <td style={{ padding: '10px 16px', color: '#e8ddd0' }}>{s.venue}</td>
                <td style={{ padding: '10px 16px', color: '#8a7f70' }}>{s.city}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 11, color: statusColor(s.showStatus), background: `${statusColor(s.showStatus)}18`, padding: '2px 8px', borderRadius: 12, border: `1px solid ${statusColor(s.showStatus)}30` }}>
                    {s.showStatus ?? 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', color: '#8a7f70' }}>{s.guarantee != null ? `$${s.guarantee}` : '—'}</td>
                <td style={{ padding: '10px 16px', display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(s)} style={{ ...BTN_SM, background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}><Pencil size={12} /></button>
                  <button onClick={() => del(s.id)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020' }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div ref={modalRef} style={{ ...CARD, padding: 28, width: '100%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 13, color: '#c9a84c' }}>{editId ? 'EDIT SHOW' : 'ADD SHOW'}</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f70' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { k: 'date', label: 'Date', type: 'date' },
                { k: 'time', label: 'Time' },
                { k: 'venue', label: 'Venue' },
                { k: 'city', label: 'City' },
                { k: 'loadInTime', label: 'Load-in Time' },
                { k: 'soundCheckTime', label: 'Soundcheck Time' },
                { k: 'setLength', label: 'Set Length' },
                { k: 'ticketUrl', label: 'Ticket URL' },
                { k: 'contactPerson', label: 'Contact Person' },
                { k: 'contactEmail', label: 'Contact Email' },
                { k: 'guarantee', label: 'Guarantee ($)', type: 'number' },
                { k: 'payout', label: 'Payout ($)', type: 'number' },
              ].map(({ k, label, type }) => (
                <div key={k}>
                  <label style={LABEL}>{label}</label>
                  <input
                    type={type ?? 'text'}
                    value={(form as Record<string, unknown>)[k] as string ?? ''}
                    onChange={e => setField(k as keyof Omit<Show, 'id'>, type === 'number' ? Number(e.target.value) || undefined : e.target.value)}
                    style={INPUT}
                  />
                </div>
              ))}

              <div>
                <label style={LABEL}>Show Status</label>
                <select value={form.showStatus ?? 'Pending'} onChange={e => setField('showStatus', e.target.value as ShowStatus)} style={{ ...INPUT }}>
                  {(['Confirmed', 'Pending', 'Hold', 'Cancelled'] as ShowStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={LABEL}>Show Notes</label>
              <textarea value={form.showNotes ?? ''} onChange={e => setField('showNotes', e.target.value)} rows={3} style={{ ...INPUT, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
              {[{ k: 'isFeatured', label: 'Featured' }, { k: 'visible', label: 'Visible' }].map(({ k, label }) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#8a7f70' }}>
                  <input type="checkbox" checked={!!(form as Record<string, unknown>)[k]} onChange={e => setField(k as keyof Omit<Show, 'id'>, e.target.checked)} />
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
