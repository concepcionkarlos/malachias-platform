'use client'

// Homepage "Join the Brotherhood" newsletter section — email capture form that POSTs
// to /api/newsletter (double opt-in) and renders idle/loading/pending/already-subscribed
// states, with cycling benefit lines and animated gold glow accents.

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight } from 'lucide-react'

const REASONS = [
  'First access to new music',
  'Show announcements before anyone else',
  'Honest dispatches from the road',
  'Brotherhood — not a mailing list',
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'pending' | 'already'>('idle')
  const [error, setError] = useState('')
  const [reasonIdx, setReasonIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-100px' })

  useEffect(() => {
    const id = setInterval(() => setReasonIdx(i => (i + 1) % REASONS.length), 3000)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setState(data.pending ? 'pending' : 'already')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      setState('idle')
    }
  }

  return (
    <section
      id="newsletter"
      ref={ref}
      style={{ position: 'relative', overflow: 'hidden', background: '#020202' }}
    >
      {/* Animated gold glow */}
      <motion.div
        animate={inView ? { opacity: [0.04, 0.12, 0.04] } : { opacity: 0.04 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.20) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top border pulse */}
      <motion.div
        animate={inView ? { scaleX: [0.35, 1, 0.35], opacity: [0.25, 0.65, 0.25] } : {}}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 0, left: '5%', right: '5%',
          height: 1,
          background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
          transformOrigin: 'center',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20" style={{ position: 'relative' }}>

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <motion.div
            animate={{ boxShadow: ['0 0 0px rgba(201,168,76,0)', '0 0 22px rgba(201,168,76,0.22)', '0 0 0px rgba(201,168,76,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: 999, padding: '0.4rem 1.1rem',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }}
            />
            <span style={{ fontSize: '0.60rem', letterSpacing: '0.30em', color: '#c9a84c', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
              The Brotherhood
            </span>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-[5fr_6fr] gap-10 lg:gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <h2
              className="font-display leading-[0.9] tracking-[0.06em] text-white"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 3.8rem)', marginBottom: '1.25rem' }}
            >
              JOIN THE<br />
              <span style={{ color: '#c9a84c' }}>BROTHERHOOD</span>
            </h2>

            <p style={{ color: 'rgba(232,221,208,0.5)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1.75rem', maxWidth: '28rem' }}>
              This isn&apos;t a newsletter. It&apos;s a dispatch — for the people who believe something real is happening here.
            </p>

            {/* Cycling reasons */}
            <div style={{ height: '1.8rem', overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={reasonIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ArrowRight size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.80rem', color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)' }}>
                    {REASONS[reasonIdx]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <AnimatePresence mode="wait">

              {/* Form */}
              {(state === 'idle' || state === 'loading') && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,0.35)', pointerEvents: 'none' }} />
                      <input
                        className="field"
                        type="email"
                        placeholder="your@email.com"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ paddingLeft: '2.4rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Pulsing CTA */}
                    <motion.button
                      type="submit"
                      disabled={state === 'loading'}
                      className="btn btn-primary"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      animate={state === 'idle' ? {
                        boxShadow: [
                          '0 0 0px rgba(201,168,76,0)',
                          '0 0 20px rgba(201,168,76,0.30)',
                          '0 0 0px rgba(201,168,76,0)',
                        ],
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '100%', justifyContent: 'center',
                        letterSpacing: '0.16em',
                        opacity: state === 'loading' ? 0.65 : 1,
                        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {state === 'loading' ? 'Sending…' : 'Join the Brotherhood'}
                    </motion.button>

                    {error && (
                      <p style={{ fontSize: '0.75rem', color: '#c04020', lineHeight: 1.5 }}>{error}</p>
                    )}

                    <p style={{ fontSize: '0.60rem', letterSpacing: '0.10em', color: 'var(--text-3)', lineHeight: 1.6 }}>
                      Private. Honest. No spam. Unsubscribe any time.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* Pending verification */}
              {state === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  style={{
                    padding: '2rem',
                    background: 'rgba(201,168,76,0.05)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: 6,
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.18, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ display: 'inline-block', marginBottom: '1rem' }}
                  >
                    <Mail size={26} style={{ color: '#c9a84c' }} />
                  </motion.div>
                  <p className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '0.14em', color: '#c9a84c', marginBottom: '0.6rem' }}>
                    CHECK YOUR INBOX
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(232,221,208,0.55)', lineHeight: 1.65 }}>
                    We sent a confirmation link to{' '}
                    <strong style={{ color: '#e8ddd0' }}>{email}</strong>.<br />
                    Click it to confirm your spot and unlock your 15% off code.
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(232,221,208,0.25)', marginTop: '0.8rem' }}>
                    Check your spam folder if you don&apos;t see it within a minute.
                  </p>
                </motion.div>
              )}

              {/* Already confirmed */}
              {state === 'already' && (
                <motion.div
                  key="already"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(52,211,153,0.04)',
                    border: '1px solid rgba(52,211,153,0.15)',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={20} style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="font-display" style={{ fontSize: '1.05rem', letterSpacing: '0.12em', color: '#c9a84c', marginBottom: '0.4rem' }}>
                        YOU&apos;RE ALREADY IN.
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(232,221,208,0.5)', lineHeight: 1.65 }}>
                        {email} is already on the brotherhood list. We&apos;ll be in touch when there&apos;s something real to say.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{
            marginTop: '4rem', height: 1,
            background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.12), transparent)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </section>
  )
}
