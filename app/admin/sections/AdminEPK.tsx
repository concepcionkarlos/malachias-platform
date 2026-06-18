'use client'

// Admin section — Electronic Press Kit (EPK) editor: edits the band's press kit content
// via /api/content — tagline, booker intro, repertoire, tech specs, press quotes, and
// setlists (each with editable song lists), with add/remove controls per section.

import { useEffect, useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import type { EpkContent } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }
const ROW: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }

type Setlist = { id: string; title: string; songs: string[] }

const BLANK_EPK: EpkContent = {
  tagline: '', bookerIntro: '', repertoire: [], techSpecs: [], setlists: [], pressQuotes: [],
}

export default function AdminEPK() {
  const [epk, setEpk] = useState<EpkContent>(BLANK_EPK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setEpk({ ...BLANK_EPK, ...(d.epkContent ?? {}) }); setLoading(false) })
      .catch(() => { setError('Failed to load EPK'); setLoading(false) })
  }, [])

  async function save() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ epkContent: epk }) })
      if (!res.ok) throw new Error()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  // Repertoire
  function addRep() { setEpk(e => ({ ...e, repertoire: [...e.repertoire, { era: '', artists: '' }] })) }
  function setRep(i: number, k: 'era' | 'artists', v: string) { setEpk(e => ({ ...e, repertoire: e.repertoire.map((r, idx) => idx === i ? { ...r, [k]: v } : r) })) }
  function delRep(i: number) { setEpk(e => ({ ...e, repertoire: e.repertoire.filter((_, idx) => idx !== i) })) }

  // Tech specs
  function addSpec() { setEpk(e => ({ ...e, techSpecs: [...e.techSpecs, { label: '', value: '' }] })) }
  function setSpec(i: number, k: 'label' | 'value', v: string) { setEpk(e => ({ ...e, techSpecs: e.techSpecs.map((s, idx) => idx === i ? { ...s, [k]: v } : s) })) }
  function delSpec(i: number) { setEpk(e => ({ ...e, techSpecs: e.techSpecs.filter((_, idx) => idx !== i) })) }

  // Press quotes
  function addQuote() { setEpk(e => ({ ...e, pressQuotes: [...(e.pressQuotes ?? []), ''] })) }
  function setQuote(i: number, v: string) { setEpk(e => ({ ...e, pressQuotes: (e.pressQuotes ?? []).map((q, idx) => idx === i ? v : q) })) }
  function delQuote(i: number) { setEpk(e => ({ ...e, pressQuotes: (e.pressQuotes ?? []).filter((_, idx) => idx !== i) })) }

  // Setlists
  const setlists: Setlist[] = ((epk.setlists ?? []) as unknown as Setlist[])
  function addSetlist() { setEpk(e => ({ ...e, setlists: [...((e.setlists ?? []) as unknown as Setlist[]), { id: Date.now().toString(36), title: '', songs: [] }] as unknown as EpkContent['setlists'] })) }
  function setSlTitle(i: number, v: string) {
    const updated = setlists.map((s, idx) => idx === i ? { ...s, title: v } : s)
    setEpk(e => ({ ...e, setlists: updated as unknown as EpkContent['setlists'] }))
  }
  function addSong(i: number) {
    const updated = setlists.map((s, idx) => idx === i ? { ...s, songs: [...s.songs, ''] } : s)
    setEpk(e => ({ ...e, setlists: updated as unknown as EpkContent['setlists'] }))
  }
  function setSong(si: number, songIdx: number, v: string) {
    const updated = setlists.map((s, idx) => idx === si ? { ...s, songs: s.songs.map((t, ti) => ti === songIdx ? v : t) } : s)
    setEpk(e => ({ ...e, setlists: updated as unknown as EpkContent['setlists'] }))
  }
  function delSong(si: number, songIdx: number) {
    const updated = setlists.map((s, idx) => idx === si ? { ...s, songs: s.songs.filter((_, ti) => ti !== songIdx) } : s)
    setEpk(e => ({ ...e, setlists: updated as unknown as EpkContent['setlists'] }))
  }
  function delSetlist(i: number) { setEpk(e => ({ ...e, setlists: setlists.filter((_, idx) => idx !== i) as unknown as EpkContent['setlists'] })) }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Electronic Press Kit</h2>
        <button onClick={save} disabled={saving} style={{ ...BTN_SM, background: saved ? '#34d399' : '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 18px' }}>
          <Check size={14} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save EPK'}
        </button>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* Core fields */}
      <div style={CARD}>
        <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c', marginBottom: 16 }}>OVERVIEW</div>
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Tagline</label>
          <input type="text" value={epk.tagline} onChange={e => setEpk(ep => ({ ...ep, tagline: e.target.value }))} style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Booker Intro</label>
          <textarea value={epk.bookerIntro} onChange={e => setEpk(ep => ({ ...ep, bookerIntro: e.target.value }))} rows={4} style={{ ...INPUT, resize: 'vertical' }} />
        </div>
      </div>

      {/* Repertoire */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c' }}>REPERTOIRE</div>
          <button onClick={addRep} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }}><Plus size={12} /> Add</button>
        </div>
        {epk.repertoire.map((r, i) => (
          <div key={i} style={ROW}>
            <input type="text" placeholder="Era / Style" value={r.era} onChange={e => setRep(i, 'era', e.target.value)} style={{ ...INPUT, width: 140, flexShrink: 0 }} />
            <input type="text" placeholder="Artists / Description" value={r.artists} onChange={e => setRep(i, 'artists', e.target.value)} style={INPUT} />
            <button onClick={() => delRep(i)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', flexShrink: 0 }}><Trash2 size={12} /></button>
          </div>
        ))}
        {epk.repertoire.length === 0 && <p style={{ color: '#5c5044', fontSize: 13 }}>No repertoire entries.</p>}
      </div>

      {/* Tech specs */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c' }}>TECH SPECS</div>
          <button onClick={addSpec} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }}><Plus size={12} /> Add</button>
        </div>
        {epk.techSpecs.map((s, i) => (
          <div key={i} style={ROW}>
            <input type="text" placeholder="Label" value={s.label} onChange={e => setSpec(i, 'label', e.target.value)} style={{ ...INPUT, width: 160, flexShrink: 0 }} />
            <input type="text" placeholder="Value" value={s.value} onChange={e => setSpec(i, 'value', e.target.value)} style={INPUT} />
            <button onClick={() => delSpec(i)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', flexShrink: 0 }}><Trash2 size={12} /></button>
          </div>
        ))}
        {epk.techSpecs.length === 0 && <p style={{ color: '#5c5044', fontSize: 13 }}>No tech specs.</p>}
      </div>

      {/* Press quotes */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c' }}>PRESS QUOTES</div>
          <button onClick={addQuote} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }}><Plus size={12} /> Add</button>
        </div>
        {(epk.pressQuotes ?? []).map((q, i) => (
          <div key={i} style={ROW}>
            <input type="text" value={q} placeholder="Quote text…" onChange={e => setQuote(i, e.target.value)} style={INPUT} />
            <button onClick={() => delQuote(i)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', flexShrink: 0 }}><Trash2 size={12} /></button>
          </div>
        ))}
        {(epk.pressQuotes ?? []).length === 0 && <p style={{ color: '#5c5044', fontSize: 13 }}>No press quotes.</p>}
      </div>

      {/* Setlists */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c' }}>SETLISTS</div>
          <button onClick={addSetlist} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }}><Plus size={12} /> Add Setlist</button>
        </div>
        {setlists.length === 0 && <p style={{ color: '#5c5044', fontSize: 13 }}>No setlists.</p>}
        {setlists.map((sl, si) => (
          <div key={sl.id} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <input type="text" placeholder="Setlist title…" value={sl.title} onChange={e => setSlTitle(si, e.target.value)} style={{ ...INPUT, flex: 1 }} />
              <button onClick={() => addSong(si)} style={{ ...BTN_SM, background: 'rgba(96,165,250,0.12)', color: '#60a5fa', flexShrink: 0 }}><Plus size={12} /> Song</button>
              <button onClick={() => delSetlist(si)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', flexShrink: 0 }}><Trash2 size={12} /></button>
            </div>
            {sl.songs.map((song, ti) => (
              <div key={ti} style={{ ...ROW, marginLeft: 16 }}>
                <input type="text" placeholder={`Song ${ti + 1}`} value={song} onChange={e => setSong(si, ti, e.target.value)} style={INPUT} />
                <button onClick={() => delSong(si, ti)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', flexShrink: 0 }}><Trash2 size={12} /></button>
              </div>
            ))}
            {sl.songs.length === 0 && <p style={{ color: '#5c5044', fontSize: 12, marginLeft: 16 }}>No songs — click + Song to add.</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
