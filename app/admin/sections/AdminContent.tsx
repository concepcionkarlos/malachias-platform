'use client'

import { useEffect, useState, useRef } from 'react'
import { Check, Plus, Trash2, Upload } from 'lucide-react'
import type { SiteContent } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN_SM: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }
const SECTION_HDR: React.CSSProperties = { fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c', marginBottom: 16 }
const GRID2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

const BLANK: SiteContent = {
  heroHeadline: '', heroSubheadline: '', aboutText: [], aboutShort: '', aboutHeadline: '',
  groupPhoto: '', serviceArea: '', footerTagline: '', ctaPrimaryLabel: '', ctaSecondaryLabel: '',
  contactEmail: '', facebook: '', instagram: '', youtube: '', appleMusic: '', spotify: '',
  metaDescription: '', ogTitle: '', ogDescription: '', metaKeywords: '',
}

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(BLANK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setContent({ ...BLANK, ...(d.siteContent ?? {}) }); setLoading(false) })
      .catch(() => { setError('Failed to load content'); setLoading(false) })
  }, [])

  function set<K extends keyof SiteContent>(k: K, v: SiteContent[K]) { setContent(c => ({ ...c, [k]: v })) }

  async function save() {
    setSaving(true); setSaved(false)
    try {
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteContent: content }) })
      if (!res.ok) throw new Error()
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function uploadGroupPhoto(file: File) {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      set('groupPhoto', url)
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  function addAboutPara() { set('aboutText', [...content.aboutText, '']) }
  function setAboutPara(i: number, v: string) { set('aboutText', content.aboutText.map((p, idx) => idx === i ? v : p)) }
  function delAboutPara(i: number) { set('aboutText', content.aboutText.filter((_, idx) => idx !== i)) }

  if (loading) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Site Content</h2>
        <button onClick={save} disabled={saving} style={{ ...BTN_SM, background: saved ? '#34d399' : '#c9a84c', color: '#070707', fontWeight: 600, padding: '7px 18px' }}>
          <Check size={14} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && <p style={{ color: '#c04020', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* Hero */}
      <div style={CARD}>
        <div style={SECTION_HDR}>HERO</div>
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Headline</label>
          <input type="text" value={content.heroHeadline} onChange={e => set('heroHeadline', e.target.value)} style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Subheadline</label>
          <textarea value={content.heroSubheadline} onChange={e => set('heroSubheadline', e.target.value)} rows={3} style={{ ...INPUT, resize: 'vertical' }} />
        </div>
      </div>

      {/* About */}
      <div style={CARD}>
        <div style={SECTION_HDR}>ABOUT</div>
        <div style={GRID2}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={LABEL}>Headline</label>
            <input type="text" value={content.aboutHeadline} onChange={e => set('aboutHeadline', e.target.value)} style={INPUT} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={LABEL}>Short Bio</label>
            <textarea value={content.aboutShort} onChange={e => set('aboutShort', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical' }} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ ...LABEL, margin: 0 }}>About Paragraphs</label>
            <button onClick={addAboutPara} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }}><Plus size={12} /> Add Paragraph</button>
          </div>
          {content.aboutText.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <textarea value={p} onChange={e => setAboutPara(i, e.target.value)} rows={3} style={{ ...INPUT, resize: 'vertical', flex: 1 }} />
              <button onClick={() => delAboutPara(i)} style={{ ...BTN_SM, background: 'rgba(192,64,32,0.15)', color: '#c04020', alignSelf: 'flex-start' }}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* General */}
      <div style={CARD}>
        <div style={SECTION_HDR}>GENERAL</div>
        <div style={GRID2}>
          <div>
            <label style={LABEL}>Service Area</label>
            <input type="text" value={content.serviceArea} onChange={e => set('serviceArea', e.target.value)} style={INPUT} />
          </div>
          <div>
            <label style={LABEL}>Contact Email</label>
            <input type="email" value={content.contactEmail} onChange={e => set('contactEmail', e.target.value)} style={INPUT} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={LABEL}>Footer Tagline</label>
            <input type="text" value={content.footerTagline} onChange={e => set('footerTagline', e.target.value)} style={INPUT} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={LABEL}>Group Photo URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" value={content.groupPhoto} onChange={e => set('groupPhoto', e.target.value)} style={INPUT} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...BTN_SM, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '7px 12px', flexShrink: 0 }}>
                <Upload size={13} /> {uploading ? '…' : 'Upload'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadGroupPhoto(f) }} />
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={CARD}>
        <div style={SECTION_HDR}>CALL TO ACTION LABELS</div>
        <div style={GRID2}>
          <div>
            <label style={LABEL}>Primary CTA</label>
            <input type="text" value={content.ctaPrimaryLabel} onChange={e => set('ctaPrimaryLabel', e.target.value)} style={INPUT} />
          </div>
          <div>
            <label style={LABEL}>Secondary CTA</label>
            <input type="text" value={content.ctaSecondaryLabel} onChange={e => set('ctaSecondaryLabel', e.target.value)} style={INPUT} />
          </div>
        </div>
      </div>

      {/* Social */}
      <div style={CARD}>
        <div style={SECTION_HDR}>SOCIAL LINKS</div>
        <div style={GRID2}>
          {[
            { k: 'facebook', label: 'Facebook' },
            { k: 'instagram', label: 'Instagram' },
            { k: 'youtube', label: 'YouTube' },
            { k: 'appleMusic', label: 'Apple Music' },
            { k: 'spotify', label: 'Spotify' },
          ].map(({ k, label }) => (
            <div key={k}>
              <label style={LABEL}>{label}</label>
              <input type="text" value={(content as unknown as Record<string, unknown>)[k] as string ?? ''} onChange={e => set(k as keyof SiteContent, e.target.value as SiteContent[keyof SiteContent])} style={INPUT} placeholder="https://…" />
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div style={CARD}>
        <div style={SECTION_HDR}>SEO / META</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { k: 'metaDescription', label: 'Meta Description', rows: 2 },
            { k: 'ogTitle', label: 'OG Title', rows: 1 },
            { k: 'ogDescription', label: 'OG Description', rows: 2 },
            { k: 'metaKeywords', label: 'Meta Keywords', rows: 1 },
          ].map(({ k, label, rows }) => (
            <div key={k}>
              <label style={LABEL}>{label}</label>
              {rows > 1 ? (
                <textarea value={(content as unknown as Record<string, unknown>)[k] as string ?? ''} onChange={e => set(k as keyof SiteContent, e.target.value as SiteContent[keyof SiteContent])} rows={rows} style={{ ...INPUT, resize: 'vertical' }} />
              ) : (
                <input type="text" value={(content as unknown as Record<string, unknown>)[k] as string ?? ''} onChange={e => set(k as keyof SiteContent, e.target.value as SiteContent[keyof SiteContent])} style={INPUT} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
