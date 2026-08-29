'use client'

// Admin section — Road to San Antonio (Veterans Day 2026) campaign desk. Edits the
// admin-owned campaign fields (goal, amount raised after reconciling Cash App, status,
// venue, Cash App identity), the sponsors shown on the campaign page, the published
// updates (episodes), the organizer checklist, and reviews sponsor inquiries.
// Persists through /api/content (PATCH) like every other admin section.

import { useEffect, useState } from 'react'
import { Check, Plus, Trash2, ExternalLink, Copy } from 'lucide-react'
import { OUTREACH_TEMPLATES, SOCIAL_TEMPLATES, SOCIAL_TEMPLATES_ES, DONOR_TEMPLATES, type Template } from '@/lib/campaignOutreach'
import {
  CAMPAIGN, SPONSOR_TIERS, SPONSOR_CATEGORIES, campaignMath, usd,
  type CampaignOverrides, type CampaignStatus, type Sponsor, type CampaignUpdate, type SponsorInquiry, type SponsorTierId,
} from '@/lib/campaign'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#c9a84c', color: '#030202', fontWeight: 700 }
const BTN_SM: React.CSSProperties = { border: '1px solid rgba(255,255,255,0.12)', background: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4, color: '#a89880' }
const HDR: React.CSSProperties = { fontFamily: 'var(--font-display)', letterSpacing: '0.12em', fontSize: 11, color: '#c9a84c', marginBottom: 16 }
const GRID2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

const STATUSES: CampaignStatus[] = ['prelaunch', 'active', 'funded', 'traveling', 'event-day', 'completed']

// Internal planning only — never rendered publicly.
const ORGANIZER_ITEMS = ['Airfare', 'Hotel', 'Meals', 'Local transportation', 'Backline', 'PA', 'Equipment', 'Baggage', 'Artist compensation', 'Passes', 'Guest accommodations']
type Coverage = 'unknown' | 'yes' | 'no' | 'partial'

interface StoreSlice {
  campaign?: CampaignOverrides & { organizerCoverage?: Record<string, Coverage> }
  campaignSponsors?: Sponsor[]
  campaignUpdates?: CampaignUpdate[]
  sponsorInquiries?: SponsorInquiry[]
}

const rid = () => Math.random().toString(36).slice(2, 10)

function TemplateList({ items, copiedKey, onCopy }: { items: Template[]; copiedKey: string | null; onCopy: (t: Template) => void }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {items.map(t => (
        <details key={t.id} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '8px 12px' }}>
          <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 13, color: '#e8ddd0' }}>
            <span>{t.title} <span style={{ color: '#8a7f70', fontSize: 11 }}>· {t.channel}</span></span>
            <button type="button" style={BTN_SM} onClick={e => { e.preventDefault(); onCopy(t) }}>
              {copiedKey === t.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </summary>
          {t.subject && <p style={{ fontSize: 12, color: '#c9a84c', margin: '8px 0 4px' }}>Subject: {t.subject}</p>}
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 12, color: '#a89880', margin: '6px 0 4px', lineHeight: 1.6 }}>{t.body}</pre>
        </details>
      ))}
    </div>
  )
}
const today = () => new Date().toISOString().slice(0, 10)

export default function AdminRoadToSanAntonio() {
  const [o, setO] = useState<StoreSlice['campaign']>({})
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [updates, setUpdates] = useState<CampaignUpdate[]>([])
  const [inquiries, setInquiries] = useState<SponsorInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function copyTemplate(t: Template) {
    const text = t.subject ? `Subject: ${t.subject}\n\n${t.body}` : t.body
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedKey(t.id)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then((d: StoreSlice) => {
      setO(d.campaign ?? {})
      setSponsors(d.campaignSponsors ?? [])
      setUpdates(d.campaignUpdates ?? [])
      setInquiries(d.sponsorInquiries ?? [])
      setLoading(false)
    }).catch(() => { setError('Failed to load'); setLoading(false) })
  }, [])

  const merged = { ...CAMPAIGN, ...o, cashApp: { ...CAMPAIGN.cashApp, ...(o?.cashApp ?? {}) } }
  const math = campaignMath(merged)

  async function save(extra: Partial<StoreSlice> = {}) {
    setSaving(true); setSaved(false); setError('')
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign: o, campaignSponsors: sponsors, campaignUpdates: updates, sponsorInquiries: inquiries, ...extra }),
      })
      if (!res.ok) throw new Error()
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { setError('Save failed') } finally { setSaving(false) }
  }

  const setField = <K extends keyof CampaignOverrides>(k: K, v: CampaignOverrides[K]) => setO(c => ({ ...c, [k]: v }))
  const num = (v: string) => { const n = Number(v.replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n }

  if (loading) return <p style={{ color: '#8a7f70' }}>Loading…</p>

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.06em', color: '#e8ddd0', margin: 0 }}>ROAD TO SAN ANTONIO</h2>
          <p style={{ color: '#8a7f70', fontSize: 12, margin: '4px 0 0' }}>
            {usd(math.raised)} of {usd(math.goal)} · {math.percent}% · {math.daysToEvent} days to the event · status <b style={{ color: '#c9a84c' }}>{math.effectiveStatus}</b>
            &ensp;<a href={CAMPAIGN.path} target="_blank" rel="noreferrer" style={{ color: '#c9a84c' }}>open page <ExternalLink size={11} style={{ verticalAlign: -1 }} /></a>
          </p>
        </div>
        <button style={BTN} onClick={() => save()} disabled={saving}>{saved ? <><Check size={14} /> Saved</> : saving ? 'Saving…' : 'Save everything'}</button>
      </div>
      {error && <p style={{ color: '#c04020', fontSize: 13 }}>{error}</p>}

      {/* ── Money & status ── */}
      <div style={CARD}>
        <p style={HDR}>CAMPAIGN NUMBERS</p>
        <p style={{ fontSize: 12, color: '#8a7f70', marginTop: 0 }}>
          Cash App does not report to the website. After you reconcile the Cash App activity (donations tagged for the road),
          type the total here and the date you did it. This is the only place the public number comes from.
        </p>
        <div style={{ ...GRID2, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <div><label style={LABEL}>Goal (USD)</label><input style={INPUT} inputMode="numeric" value={o?.goal ?? CAMPAIGN.goal} onChange={e => setField('goal', num(e.target.value))} /></div>
          <div><label style={LABEL}>Raised so far (USD)</label><input style={INPUT} inputMode="numeric" value={o?.raised ?? CAMPAIGN.raised} onChange={e => setField('raised', num(e.target.value))} /></div>
          <div><label style={LABEL}>Reconciled on</label><input style={INPUT} type="date" value={o?.raisedAsOf ?? ''} onChange={e => setField('raisedAsOf', e.target.value)} /></div>
          <div><label style={LABEL}>Status</label>
            <select style={INPUT} value={o?.status ?? CAMPAIGN.status} onChange={e => setField('status', e.target.value as CampaignStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ ...GRID2, marginTop: 14 }}>
          <div><label style={LABEL}>Travelers (people the budget must move)</label><input style={INPUT} inputMode="numeric" value={o?.travelers ?? CAMPAIGN.travelers} onChange={e => setField('travelers', num(e.target.value))} /></div>
          <div><label style={LABEL}>Venue (leave empty until the organizer says it can be published)</label><input style={INPUT} value={o?.eventVenue ?? ''} onChange={e => setField('eventVenue', e.target.value)} /></div>
        </div>
        <div style={{ ...GRID2, marginTop: 14 }}>
          <div><label style={LABEL}>Headline override</label><input style={INPUT} placeholder={CAMPAIGN.headline} value={o?.headline ?? ''} onChange={e => setField('headline', e.target.value || undefined)} /></div>
          <div><label style={LABEL}>Subheadline override</label><input style={INPUT} placeholder={CAMPAIGN.subheadline} value={o?.subheadline ?? ''} onChange={e => setField('subheadline', e.target.value || undefined)} /></div>
        </div>
      </div>

      {/* ── Cash App ── */}
      <div style={CARD}>
        <p style={HDR}>CASH APP</p>
        <div style={{ ...GRID2, gridTemplateColumns: '1fr 1fr 2fr' }}>
          <div><label style={LABEL}>Display name</label><input style={INPUT} value={o?.cashApp?.displayName ?? CAMPAIGN.cashApp.displayName} onChange={e => setO(c => ({ ...c, cashApp: { ...(c?.cashApp ?? {}), displayName: e.target.value } }))} /></div>
          <div><label style={LABEL}>$Cashtag</label><input style={INPUT} value={o?.cashApp?.cashtag ?? CAMPAIGN.cashApp.cashtag} onChange={e => setO(c => ({ ...c, cashApp: { ...(c?.cashApp ?? {}), cashtag: e.target.value } }))} /></div>
          <div><label style={LABEL}>Pay link</label><input style={INPUT} value={o?.cashApp?.url ?? CAMPAIGN.cashApp.url} onChange={e => setO(c => ({ ...c, cashApp: { ...(c?.cashApp ?? {}), url: e.target.value } }))} /></div>
        </div>
        <p style={{ fontSize: 12, color: '#8a7f70', margin: '10px 0 0' }}>QR image file: <code>public{CAMPAIGN.cashApp.qrImage}</code> — replace the file in the repo to change it; the page hides the QR automatically if the file is missing.</p>
      </div>

      {/* ── Sponsors ── */}
      <div style={CARD}>
        <p style={HDR}>SPONSORS ON THE PAGE ({sponsors.length})</p>
        {sponsors.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 2fr auto auto', gap: 8, alignItems: 'end', marginBottom: 8 }}>
            <div><label style={LABEL}>Name</label><input style={INPUT} value={s.name} onChange={e => setSponsors(l => l.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></div>
            <div><label style={LABEL}>Tier</label>
              <select style={INPUT} value={s.tier} onChange={e => setSponsors(l => l.map((x, j) => j === i ? { ...x, tier: e.target.value as SponsorTierId } : x))}>
                {SPONSOR_TIERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div><label style={LABEL}>Category (optional)</label>
              <select style={INPUT} value={s.category ?? ''} onChange={e => setSponsors(l => l.map((x, j) => j === i ? { ...x, category: e.target.value || undefined } : x))}>
                <option value="">—</option>
                {SPONSOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={LABEL}>Website / logo URL (logo: paste an uploaded image URL after &quot;|&quot;)</label>
              <input style={INPUT} value={`${s.url ?? ''}${s.logo ? `|${s.logo}` : ''}`} onChange={e => { const [url, logo] = e.target.value.split('|'); setSponsors(l => l.map((x, j) => j === i ? { ...x, url: url || undefined, logo: logo || undefined } : x)) }} />
            </div>
            <label style={{ ...LABEL, marginBottom: 8 }}><input type="checkbox" checked={s.visible} onChange={e => setSponsors(l => l.map((x, j) => j === i ? { ...x, visible: e.target.checked } : x))} /> shown</label>
            <button style={BTN_SM} aria-label="Remove sponsor" onClick={() => setSponsors(l => l.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
          </div>
        ))}
        <button style={BTN_SM} onClick={() => setSponsors(l => [...l, { id: rid(), name: '', tier: 'supporter', visible: true, addedAt: today() }])}><Plus size={13} /> Add sponsor</button>
      </div>

      {/* ── Updates ── */}
      <div style={CARD}>
        <p style={HDR}>UPDATES / EPISODES ({updates.length})</p>
        <p style={{ fontSize: 12, color: '#8a7f70', marginTop: 0 }}>Planned road: {CAMPAIGN.plannedEpisodes.map((t, i) => `${i + 1}. ${t}`).join(' · ')}</p>
        {updates.map((u, i) => (
          <div key={u.id} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px auto auto', gap: 8, alignItems: 'end' }}>
              <div><label style={LABEL}>Episode #</label><input style={INPUT} inputMode="numeric" value={u.episode} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, episode: num(e.target.value) } : x))} /></div>
              <div><label style={LABEL}>Title</label><input style={INPUT} value={u.title} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} /></div>
              <div><label style={LABEL}>Date</label><input style={INPUT} type="date" value={u.date} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} /></div>
              <label style={{ ...LABEL, marginBottom: 8 }}><input type="checkbox" checked={u.published} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, published: e.target.checked } : x))} /> published</label>
              <button style={BTN_SM} aria-label="Remove update" onClick={() => setUpdates(l => l.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
            </div>
            <div style={{ marginTop: 8 }}><label style={LABEL}>Video / post URL (YouTube embeds; anything else links out)</label><input style={INPUT} value={u.mediaUrl ?? ''} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, mediaUrl: e.target.value || undefined } : x))} /></div>
            <div style={{ marginTop: 8 }}><label style={LABEL}>Text (blank line between paragraphs)</label><textarea style={{ ...INPUT, minHeight: 90 }} value={u.body} onChange={e => setUpdates(l => l.map((x, j) => j === i ? { ...x, body: e.target.value } : x))} /></div>
          </div>
        ))}
        <button style={BTN_SM} onClick={() => setUpdates(l => [...l, { id: rid(), episode: l.length + 1, title: CAMPAIGN.plannedEpisodes[l.length] ?? '', date: today(), body: '', published: false }])}><Plus size={13} /> Add update</button>
      </div>

      {/* ── Organizer checklist (internal) ── */}
      <div style={CARD}>
        <p style={HDR}>ORGANIZER — WHAT THE EVENT COVERS (internal, never shown publicly)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {ORGANIZER_ITEMS.map(item => (
            <div key={item}><label style={LABEL}>{item}</label>
              <select style={INPUT} value={o?.organizerCoverage?.[item] ?? 'unknown'} onChange={e => setO(c => ({ ...c, organizerCoverage: { ...(c?.organizerCoverage ?? {}), [item]: e.target.value as Coverage } }))}>
                <option value="unknown">unknown</option><option value="yes">covered</option><option value="partial">partial</option><option value="no">not covered</option>
              </select>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#8a7f70', margin: '10px 0 0' }}>Once these are answered, revisit the goal above and the budget lines in <code>lib/campaign.ts</code>.</p>
      </div>

      {/* ── Inquiries ── */}
      <div style={CARD}>
        <p style={HDR}>SPONSOR INQUIRIES ({inquiries.length})</p>
        {inquiries.length === 0 && <p style={{ fontSize: 12, color: '#8a7f70', margin: 0 }}>None yet. They arrive here and by email.</p>}
        {[...inquiries].reverse().map(q => (
          <div key={q.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
            <div style={{ fontSize: 13, color: '#e8ddd0' }}>
              <b>{q.organization}</b> — {q.name} · <a href={`mailto:${q.email}`} style={{ color: '#c9a84c' }}>{q.email}</a>{q.phone ? ` · ${q.phone}` : ''}{q.website ? <> · <a href={q.website} target="_blank" rel="noreferrer" style={{ color: '#c9a84c' }}>site</a></> : null}
              <div style={{ fontSize: 12, color: '#8a7f70', marginTop: 2 }}>{q.level} · {new Date(q.createdAt).toLocaleDateString('en-US')}</div>
              {q.message && <div style={{ fontSize: 12, color: '#a89880', marginTop: 4, whiteSpace: 'pre-wrap' }}>{q.message}</div>}
            </div>
            <select style={{ ...INPUT, width: 130 }} value={q.status} onChange={e => setInquiries(l => l.map(x => x.id === q.id ? { ...x, status: e.target.value as SponsorInquiry['status'] } : x))}>
              <option value="new">new</option><option value="contacted">contacted</option><option value="confirmed">confirmed</option><option value="declined">declined</option>
            </select>
          </div>
        ))}
      </div>

      {/* ── Donor replies ── */}
      <div style={CARD}>
        <p style={HDR}>DONOR REPLIES — ANSWER WITHIN THE DAY</p>
        <p style={{ fontSize: 12, color: '#8a7f70', marginTop: 0 }}>Cash App shows who sent it. Thank them by name (Cash App note, DM or text), then ask them to share. Larger gifts get the personal note.</p>
        <TemplateList items={DONOR_TEMPLATES} copiedKey={copiedKey} onCopy={copyTemplate} />
      </div>

      {/* ── Outreach templates ── */}
      <div style={CARD}>
        <p style={HDR}>SPONSOR OUTREACH — COPY &amp; SEND BY HAND</p>
        <p style={{ fontSize: 12, color: '#8a7f70', marginTop: 0 }}>Fill the [brackets], send from your own email or DMs. Nothing is sent automatically. Full text also in docs/road-to-san-antonio/OUTREACH.md.</p>
        <TemplateList items={OUTREACH_TEMPLATES} copiedKey={copiedKey} onCopy={copyTemplate} />
      </div>

      <div style={CARD}>
        <p style={HDR}>SOCIAL POSTS — FACEBOOK / INSTAGRAM / STORIES</p>
        <TemplateList items={SOCIAL_TEMPLATES} copiedKey={copiedKey} onCopy={copyTemplate} />
      </div>

      <div style={CARD}>
        <p style={HDR}>POSTS EN ESPAÑOL — SIEMPRE JUNTO AL INGLÉS</p>
        <p style={{ fontSize: 12, color: '#8a7f70', marginTop: 0 }}>Publica EN arriba y ES debajo (o ES en el primer comentario). Misma imagen, mismo enlace.</p>
        <TemplateList items={SOCIAL_TEMPLATES_ES} copiedKey={copiedKey} onCopy={copyTemplate} />
      </div>

      <button style={BTN} onClick={() => save()} disabled={saving}>{saved ? <><Check size={14} /> Saved</> : saving ? 'Saving…' : 'Save everything'}</button>
    </div>
  )
}
