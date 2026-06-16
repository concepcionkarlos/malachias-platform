'use client'

import { useState } from 'react'
import Link from 'next/link'

const COUPON = 'MALACHIAS20'

export default function PromoPageClient() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setState('done')
    } catch {
      setState('error')
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(COUPON).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <main style={{ background: '#030202', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>

      {/* Gold top bar */}
      <div style={{ height: 4, background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.3))' }} />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'clamp(3rem,10vw,6rem) 1.5rem clamp(4rem,10vw,6rem)' }}>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            display: 'inline-block', padding: '0.35rem 1.1rem',
            background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.30)',
            fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c9a84c',
          }}>
            ✠ Merch Launch Special ✠
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.6rem, 10vw, 4.2rem)',
          letterSpacing: '0.04em', lineHeight: 0.92,
          color: '#ffffff', margin: '0 0 1rem', textAlign: 'center',
        }}>
          20% OFF<br />THE STORE
        </h1>

        <p style={{ textAlign: 'center', fontSize: '0.90rem', color: 'rgba(232,221,208,0.50)', lineHeight: 1.75, margin: '0 0 2.5rem' }}>
          To celebrate our official merch launch, we&apos;re giving the community 20% off every order. Enter your email — your code arrives instantly.
        </p>

        {/* Gold rule */}
        <div style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, #c9a84c, transparent)', margin: '0 auto 2.5rem' }} />

        {state !== 'done' ? (
          /* ── Email form ── */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.25)',
                padding: '1rem 1.2rem',
                fontSize: '1rem', color: '#e8ddd0',
                fontFamily: 'var(--font-body)', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.60)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{
                width: '100%', padding: '1rem',
                background: state === 'loading' ? 'rgba(201,168,76,0.55)' : '#c9a84c',
                border: 'none', cursor: state === 'loading' ? 'default' : 'pointer',
                color: '#030202', fontWeight: 700, fontSize: '0.80rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
              }}
            >
              {state === 'loading' ? 'Sending…' : 'Get My 20% OFF Code →'}
            </button>
            {state === 'error' && (
              <p style={{ textAlign: 'center', fontSize: '0.80rem', color: '#c04020' }}>
                Algo salió mal. Escríbenos a{' '}
                <a href="mailto:hello@malachiasmusic.com" style={{ color: '#c9a84c' }}>hello@malachiasmusic.com</a>
              </p>
            )}
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              No spam. Unsubscribe any time.
            </p>
          </form>
        ) : (
          /* ── Coupon reveal ── */
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.70rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.75rem' }}>
              Your discount code
            </p>

            {/* Big coupon box */}
            <button
              onClick={copyCode}
              title="Click to copy"
              style={{
                display: 'block', width: '100%', marginBottom: '1rem',
                background: '#c9a84c', border: 'none', cursor: 'pointer',
                padding: '1.6rem 1rem',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 10vw, 3rem)',
                letterSpacing: '0.12em', color: '#030202',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              {COUPON}
            </button>

            <p style={{ fontSize: '0.72rem', color: 'rgba(201,168,76,0.55)', marginBottom: '2rem', letterSpacing: '0.10em' }}>
              {copied ? '✓ Copied to clipboard!' : 'Tap the code to copy it'}
            </p>

            <p style={{ fontSize: '0.85rem', color: 'rgba(232,221,208,0.50)', lineHeight: 1.7, marginBottom: '2rem' }}>
              We also sent it to <strong style={{ color: '#e8ddd0' }}>{email}</strong> so you don&apos;t lose it.
            </p>

            <Link
              href="/merch"
              style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '1rem', background: '#c9a84c', color: '#030202',
                fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)',
                textAlign: 'center', marginBottom: '1rem',
              }}
            >
              Shop Now — Use {COUPON} at Checkout →
            </Link>

            <p style={{ fontSize: '0.68rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              Thank you for supporting the mission. God bless.
            </p>
          </div>
        )}

        {/* What's in the store */}
        {state !== 'done' && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.56rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: '1.1rem', textAlign: 'center' }}>
              What&apos;s in the store
            </p>
            {[
              { name: '☕ Support Mug', price: 'From $8.95 → $7.16 with code' },
              { name: '🧢 Warrior Hat', price: '$19.99 → $15.99 with code' },
              { name: '🧢 Trucker Hat', price: '$19.99 → $15.99 with code' },
              { name: '👕 Premium Tee', price: 'From $34.99 → $27.99 with code' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(232,221,208,0.65)' }}>{item.name}</span>
                <span style={{ fontSize: '0.72rem', color: '#c9a84c', letterSpacing: '0.04em' }}>{item.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)', textDecoration: 'none' }}>
            ← Back to malachiasmusic.com
          </Link>
        </div>
      </div>
    </main>
  )
}
