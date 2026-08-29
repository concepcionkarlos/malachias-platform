'use client'

// /voice-lessons — hero, who Malachias is as a coach, what a lesson covers, the
// offer (price, length, formats, service area, discounts) and the sign-up form.
// The form reuses the site's signed math captcha and posts to /api/lessons.

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mic, MapPin, Video, BadgePercent } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LESSONS, usdLessons, type LessonFormat } from '@/lib/lessons'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function VoiceLessonsClient() {
  return (
    <main style={{ background: '#030201', minHeight: '100vh', color: '#e8ddd0' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 'clamp(7rem, 14vw, 10rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(120,60,10,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-10 items-center relative">
          <div>
            <motion.p {...fade()} className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>{LESSONS.eyebrow}</motion.p>
            <motion.h1 {...fade(0.05)} className="font-display mt-4 text-white" style={{ fontSize: 'clamp(2.9rem, 8vw, 5.6rem)', lineHeight: 0.9, letterSpacing: '0.04em' }}>
              VOICE LESSONS<br /><span style={{ color: '#c9a84c' }}>WITH MALACHIAS</span>
            </motion.h1>
            <motion.p {...fade(0.1)} className="mt-6 text-[1rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
              {LESSONS.intro}
            </motion.p>
            <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
              <a href="#sign-up" className="btn btn-primary" style={{ letterSpacing: '0.18em' }}>Sign up today</a>
              <a href="#offer" className="btn btn-ghost">Prices &amp; details</a>
            </motion.div>
          </div>
          <motion.div {...fade(0.1)} className="tac-box overflow-hidden mx-auto" style={{ position: 'relative', aspectRatio: '4/5', width: 'min(80vw, 380px)' }}>
            <Image src="/Malachias 1.jpeg" alt="Malachias — vocal coach, founder of the band Malachias" fill sizes="(max-width: 1024px) 80vw, 380px" className="object-cover object-top" style={{ filter: 'contrast(1.05) saturate(0.8)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #030201 0%, transparent 45%)' }} />
            <p className="absolute bottom-4 left-4 right-4 label-xs" style={{ color: '#c9a84c', letterSpacing: '0.30em' }}>30+ years on stage · Nashville · overseas</p>
          </motion.div>
        </div>
      </section>

      {/* ── What a lesson covers ── */}
      <section className="section-pad" style={{ background: '#060504' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>What you work on</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>VOICE. STYLE. THE ROOM.</motion.h2>
          <div className="mt-8 grid md:grid-cols-3 gap-3">
            {LESSONS.focus.map((f, i) => (
              <motion.div key={f.title} {...fade(0.05 + i * 0.05)} className="tac-box" style={{ padding: '1.4rem 1.5rem' }}>
                <p className="font-display" style={{ fontSize: '1.7rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{f.title.toUpperCase()}</p>
                <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offer ── */}
      <section id="offer" className="section-pad" style={{ background: '#030201', scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Lessons</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
            STARTING AT {usdLessons(LESSONS.price)} PER {LESSONS.lengthMinutes}-MINUTE LESSON
          </motion.h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Mic, title: `${LESSONS.lengthMinutes} minutes`, body: `One-on-one. ${usdLessons(LESSONS.price)} per lesson to start.` },
              { icon: MapPin, title: 'In person', body: `${LESSONS.inPersonCounties.join(', ')} counties, Florida.` },
              { icon: Video, title: 'Via Zoom', body: 'Anywhere. Same lesson, your room.' },
              { icon: BadgePercent, title: 'Discounts', body: `${LESSONS.discounts.join(' and ')} — ask when you sign up.` },
            ].map((c, i) => (
              <motion.div key={c.title} {...fade(0.05 + i * 0.04)} className="tac-box" style={{ padding: '1.2rem 1.3rem' }}>
                <c.icon size={20} style={{ color: '#c9a84c' }} aria-hidden="true" />
                <p className="font-display mt-3" style={{ fontSize: '1.4rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{c.title.toUpperCase()}</p>
                <p className="mt-2 text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sign-up ── */}
      <section id="sign-up" className="section-pad" style={{ background: '#050403', scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[2fr_3fr] gap-10">
          <div>
            <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Sign up</p>
            <h2 className="font-display leading-[0.95] tracking-[0.05em] text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>BOOK YOUR FIRST LESSON</h2>
            <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
              Tell us how you want to work and what you&apos;re after. Malachias replies personally with times and the veteran or package rate if it applies.
              Prefer email? <a href={`mailto:${LESSONS.contactEmail}?subject=${encodeURIComponent('Voice lessons')}`} style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>{LESSONS.contactEmail}</a>
            </p>
          </div>
          <LessonForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function LessonForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', format: 'In person' as LessonFormat, county: '', goal: '', veteran: false, message: '', company_url: '' })
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
      } catch { if (attempt < 2) await new Promise(r => setTimeout(r, 1000)) }
    }
    setCaptcha(null); setCaptchaError(true)
  }, [])
  useEffect(() => { const id = setTimeout(loadCaptcha, 0); return () => clearTimeout(id) }, [loadCaptcha])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!captcha) return
    setSending(true); setError('')
    try {
      const res = await fetch('/api/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, captchaToken: captcha.token, captchaAnswer: captcha.answer }) })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) { setError(d.error ?? 'Something went wrong. Please try again.'); if (/verification|already submitted/i.test(d.error ?? '')) loadCaptcha(); return }
      setSent(true)
    } catch { setError('Could not send. Please email us instead.') }
    finally { setSending(false) }
  }

  const label: React.CSSProperties = { display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 6 }

  if (sent) return (
    <div className="tac-box py-12 px-8 text-center" role="status">
      <p className="font-display text-2xl tracking-[0.12em] mb-3" style={{ color: 'var(--gold)' }}>Got it. Talk soon.</p>
      <p className="text-sm" style={{ color: 'var(--text-2)' }}>Malachias will reach out within a couple of days with times.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="text" name="company_url" value={form.company_url} onChange={set('company_url')} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label htmlFor="vl-name" style={label}>Name *</label><input id="vl-name" className="field" required autoComplete="name" value={form.name} onChange={set('name')} /></div>
        <div><label htmlFor="vl-email" style={label}>Email *</label><input id="vl-email" className="field" type="email" required autoComplete="email" value={form.email} onChange={set('email')} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label htmlFor="vl-phone" style={label}>Phone</label><input id="vl-phone" className="field" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></div>
        <div><label htmlFor="vl-format" style={label}>Format *</label>
          <select id="vl-format" className="field" value={form.format} onChange={set('format')}>
            {LESSONS.formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {form.format === 'In person' ? (
          <div><label htmlFor="vl-county" style={label}>County *</label>
            <select id="vl-county" className="field" required value={form.county} onChange={set('county')}>
              <option value="">Choose…</option>
              {LESSONS.inPersonCounties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ) : <div />}
        <div><label htmlFor="vl-goal" style={label}>What are you after?</label>
          <select id="vl-goal" className="field" value={form.goal} onChange={set('goal')}>
            <option value="">Choose…</option>
            {LESSONS.goals.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
        <input type="checkbox" checked={form.veteran} onChange={set('veteran')} /> I&apos;m a veteran (discount applies)
      </label>
      <div><label htmlFor="vl-msg" style={label}>Anything else</label><textarea id="vl-msg" className="field resize-none" rows={4} value={form.message} onChange={set('message')} placeholder="Experience so far, days that work, what you'd like to sing…" /></div>

      {captcha && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 6 }}>
          <label htmlFor="vl-captcha" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'rgba(201,168,76,0.9)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Human check</label>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{captcha.a} + {captcha.b} =</span>
          <input id="vl-captcha" type="number" inputMode="numeric" required className="field" placeholder="?" style={{ maxWidth: 72, textAlign: 'center' }} value={captcha.answer} onChange={e => setCaptcha(c => c ? { ...c, answer: e.target.value } : c)} />
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
        {sending ? 'Sending…' : 'Request a lesson'}
      </button>
    </form>
  )
}
