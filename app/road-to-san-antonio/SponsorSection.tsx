'use client'

// Sponsorship for the Road to San Antonio: tiers (benefits limited to what the band
// itself controls), specific sponsorship categories, the sponsors already on board
// (from the admin — never invented), and the inquiry form. The form reuses the
// site's signed math captcha (/api/booking/captcha) and posts to /api/sponsor.

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SPONSOR_TIERS, SPONSOR_CATEGORIES, SPONSOR_LEVEL_OPTIONS, usd, type CampaignConfig, type Sponsor } from '@/lib/campaign'
import { trackCampaign } from '@/lib/campaignAnalytics'

interface Props {
  config: CampaignConfig
  sponsors: Sponsor[]
}

const TIER_LABEL: Record<string, string> = { presenting: 'Presenting Partner', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', supporter: 'Supporter' }

export default function SponsorSection({ config, sponsors }: Props) {
  return (
    <section id="sponsors" className="section-pad" style={{ background: '#030303', scrollMarginTop: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>3 · Become a sponsor</p>
        <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
          PARTNER WITH THE ROAD
        </h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
          Veteran-owned businesses, churches, ministries, music companies, hotels, travel and transportation
          companies, and local businesses in South Florida and San Antonio: put your name on the road that gets a
          veteran-founded band to a Veterans Day stage. Recognition happens on this page and on our channels —
          the things we control and can promise.
        </p>

        {/* ── Current sponsors ── */}
        {sponsors.length > 0 && (
          <div className="mt-10">
            <p className="label-xs mb-4" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>On the road with us</p>
            <ul className="flex flex-wrap gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {sponsors.map(s => {
                const featured = s.tier === 'gold' || s.tier === 'presenting'
                const inner = (
                  <>
                    {s.logo && (
                      <span style={{ position: 'relative', width: featured ? 120 : 80, height: featured ? 60 : 40, display: 'block' }}>
                        <Image src={s.logo} alt="" fill sizes="120px" style={{ objectFit: 'contain' }} />
                      </span>
                    )}
                    <span className="font-display block" style={{ fontSize: featured ? '1.3rem' : '1rem', letterSpacing: '0.05em', color: '#ede5d8' }}>{s.name}</span>
                    <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>
                      {s.category ?? TIER_LABEL[s.tier]}
                    </span>
                  </>
                )
                return (
                  <li key={s.id} className="tac-box" style={{ padding: featured ? '1.25rem 1.5rem' : '0.9rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center', minWidth: 160, borderColor: featured ? 'rgba(201,168,76,0.40)' : undefined }}>
                    {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer sponsored" style={{ textDecoration: 'none', display: 'contents' }}>{inner}</a> : inner}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* ── Tiers ── */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SPONSOR_TIERS.map(t => (
            <div key={t.id} className="tac-box flex flex-col" style={{ padding: '1.4rem 1.4rem 1.5rem', borderColor: t.id === 'gold' ? 'rgba(201,168,76,0.45)' : undefined }}>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>{t.name}</p>
              <p className="font-display mt-1" style={{ fontSize: '2.1rem', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>
                {t.amount === null ? 'Custom' : usd(t.amount)}
              </p>
              <ul className="mt-4 flex flex-col gap-2" style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                {t.benefits.map(b => (
                  <li key={b} className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-2)', display: 'grid', gridTemplateColumns: '0.9rem 1fr', gap: '0.4rem' }}>
                    <span style={{ color: '#c9a84c' }}>✓</span>{b}
                  </li>
                ))}
              </ul>
              <a
                href="#sponsor-form"
                className="btn btn-ghost mt-5 justify-center"
                style={{ fontSize: '0.66rem', letterSpacing: '0.18em', padding: '0.65rem 1rem' }}
                onClick={() => trackCampaign('sponsor_click', { tier: t.id })}
              >
                {t.amount === null ? 'Talk to us' : `Sponsor at ${usd(t.amount)}`}
              </a>
            </div>
          ))}
        </div>

        {/* ── Named categories ── */}
        <div className="mt-8">
          <p className="label-xs mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Specific sponsorships</p>
          <ul className="flex flex-wrap gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {SPONSOR_CATEGORIES.map(c => (
              <li key={c} style={{ fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a89880', border: '1px solid rgba(201,168,76,0.22)', padding: '0.4rem 0.8rem' }}>{c}</li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            Covering a flight, hotel nights, ground transportation, gear or meals directly counts as sponsorship at the
            matching level. Sponsor information sheet:{' '}
            <Link href="/road-to-san-antonio/sponsors" style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }} onClick={() => trackCampaign('sponsor_click', { tier: 'kit' })}>
              view or print the sponsorship overview →
            </Link>
          </p>
        </div>

        <SponsorForm config={config} />
      </div>
    </section>
  )
}

// ── Inquiry form ─────────────────────────────────────────────────────────────

function SponsorForm({ config }: { config: CampaignConfig }) {
  const [form, setForm] = useState({ name: '', organization: '', email: '', phone: '', website: '', level: '', message: '', company_url: '' })
  const [captcha, setCaptcha] = useState<{ a: number; b: number; token: string; answer: string } | null>(null)
  const [captchaError, setCaptchaError] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const loadCaptcha = useCallback(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/booking/captcha', { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const d = await res.json()
        setCaptcha({ a: d.a, b: d.b, token: d.token, answer: '' })
        return
      } catch {
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000))
      }
    }
    setCaptcha(null); setCaptchaError(true)
  }, [])

  // Deferred a tick so no state is set synchronously inside the effect body.
  useEffect(() => { const id = setTimeout(loadCaptcha, 0); return () => clearTimeout(id) }, [loadCaptcha])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!captcha) return
    setSending(true); setError('')
    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken: captcha.token, captchaAnswer: captcha.answer }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) { setError(d.error ?? 'Something went wrong. Please try again.'); if (res.status === 400 && /verification|already submitted/i.test(d.error ?? '')) loadCaptcha(); return }
      setSent(true)
      trackCampaign('sponsor_form_submit', { level: form.level })
    } catch {
      setError('Could not send. Please email us instead.')
    } finally {
      setSending(false)
    }
  }

  const label: React.CSSProperties = { display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 6 }

  return (
    <div id="sponsor-form" className="mt-12 grid lg:grid-cols-[2fr_3fr] gap-10" style={{ scrollMarginTop: 90 }}>
      <div>
        <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Sponsor inquiry</p>
        <h3 className="font-display leading-[0.95] tracking-[0.05em] text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
          LET&apos;S BUILD IT TOGETHER
        </h3>
        <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
          Tell us who you are and the level you have in mind. We reply personally, usually within two days.
          Prefer email? <a href={`mailto:${config.sponsorEmail}?subject=${encodeURIComponent('Road to San Antonio sponsorship')}`} style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>{config.sponsorEmail}</a>
        </p>
      </div>

      {sent ? (
        <div className="tac-box py-12 px-8 text-center" role="status">
          <p className="font-display text-2xl tracking-[0.12em] mb-3" style={{ color: 'var(--gold)' }}>Received. Thank you.</p>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>We&apos;ll be in touch within a couple of days.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {/* honeypot */}
          <input type="text" name="company_url" value={form.company_url} onChange={set('company_url')} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label htmlFor="sp-name" style={label}>Name *</label><input id="sp-name" className="field" required autoComplete="name" value={form.name} onChange={set('name')} /></div>
            <div><label htmlFor="sp-org" style={label}>Business / organization *</label><input id="sp-org" className="field" required autoComplete="organization" value={form.organization} onChange={set('organization')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label htmlFor="sp-email" style={label}>Email *</label><input id="sp-email" className="field" type="email" required autoComplete="email" value={form.email} onChange={set('email')} /></div>
            <div><label htmlFor="sp-phone" style={label}>Phone</label><input id="sp-phone" className="field" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label htmlFor="sp-web" style={label}>Website</label><input id="sp-web" className="field" type="url" inputMode="url" placeholder="https://" autoComplete="url" value={form.website} onChange={set('website')} /></div>
            <div>
              <label htmlFor="sp-level" style={label}>Sponsorship level *</label>
              <select id="sp-level" className="field" required value={form.level} onChange={set('level')}>
                <option value="">Choose…</option>
                {SPONSOR_LEVEL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div><label htmlFor="sp-msg" style={label}>Message</label><textarea id="sp-msg" className="field resize-none" rows={4} value={form.message} onChange={set('message')} placeholder="What you'd like to support, questions, timing…" /></div>

          {captcha && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 6 }}>
              <label htmlFor="sp-captcha" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'rgba(201,168,76,0.9)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Human check</label>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{captcha.a} + {captcha.b} =</span>
              <input id="sp-captcha" type="number" inputMode="numeric" required className="field" placeholder="?" style={{ maxWidth: 72, textAlign: 'center' }} value={captcha.answer} onChange={e => setCaptcha(c => c ? { ...c, answer: e.target.value } : c)} />
            </div>
          )}
          {!captcha && captchaError && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(192,64,32,0.06)', border: '1px solid rgba(192,64,32,0.25)', borderRadius: 6 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Couldn&apos;t load the human check.</span>
              <button type="button" onClick={() => { setCaptchaError(false); loadCaptcha() }} style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', background: 'none', border: '1px solid rgba(201,168,76,0.4)', padding: '0.45rem 0.9rem', cursor: 'pointer' }}>Try again</button>
            </div>
          )}
          {error && <p role="alert" style={{ color: '#c04020', fontSize: '0.82rem' }}>{error}</p>}

          <button type="submit" disabled={sending || !captcha} className="btn btn-primary w-full justify-center" style={{ letterSpacing: '0.16em', opacity: sending || !captcha ? 0.6 : 1 }}>
            {sending ? 'Sending…' : 'Send sponsor inquiry'}
          </button>
        </form>
      )}
    </div>
  )
}
