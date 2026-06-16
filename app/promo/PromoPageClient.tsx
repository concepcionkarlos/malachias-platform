'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PromoPageClient() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

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

  const GOLD = '#c9a84c'

  return (
    <main style={{ background: '#030202', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>

      <div style={{ height: 4, background: `linear-gradient(to right, ${GOLD}, rgba(201,168,76,0.3))` }} />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'clamp(3rem,10vw,6rem) 1.5rem clamp(4rem,10vw,6rem)' }}>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            display: 'inline-block', padding: '0.35rem 1.1rem',
            background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.30)',
            fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD,
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
          15% OFF<br />THE STORE
        </h1>

        <p style={{ textAlign: 'center', fontSize: '0.90rem', color: 'rgba(232,221,208,0.50)', lineHeight: 1.75, margin: '0 0 2.5rem' }}>
          To celebrate our official merch launch, we&apos;re giving the community 15% off every order.
          Subscribe below — your code arrives instantly in your inbox.
        </p>

        <div style={{ width: '3rem', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, margin: '0 auto 2.5rem' }} />

        {state !== 'done' ? (
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
                background: state === 'loading' ? 'rgba(201,168,76,0.55)' : GOLD,
                border: 'none', cursor: state === 'loading' ? 'default' : 'pointer',
                color: '#030202', fontWeight: 700, fontSize: '0.80rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
              }}
            >
              {state === 'loading' ? 'Sending…' : 'Subscribe & Get 15% OFF →'}
            </button>
            {state === 'error' && (
              <p style={{ textAlign: 'center', fontSize: '0.80rem', color: '#c04020' }}>
                Something went wrong. Email us at{' '}
                <a href="mailto:hello@malachiasmusic.com" style={{ color: GOLD }}>hello@malachiasmusic.com</a>
              </p>
            )}
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              No spam. Unsubscribe any time.
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
              padding: '2rem 1.5rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📬</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#ffffff',
                letterSpacing: '0.06em', margin: '0 0 0.75rem',
              }}>
                Check your inbox!
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(232,221,208,0.60)', lineHeight: 1.75, margin: 0 }}>
                We sent your 15% OFF code to <strong style={{ color: '#e8ddd0' }}>{email}</strong>.
                Check your inbox — and spam folder just in case.
              </p>
            </div>

            <Link
              href="/merch"
              style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '1rem', background: GOLD, color: '#030202',
                fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)',
                textAlign: 'center', marginBottom: '1rem',
              }}
            >
              Shop the Store →
            </Link>

            <p style={{ fontSize: '0.68rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              God bless. Thank you for supporting the mission.
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
              { name: '☕ Support Mug',  price: 'From $8.95 → $7.61 with code' },
              { name: '🧢 Warrior Hat',  price: '$19.99 → $16.99 with code' },
              { name: '🧢 Trucker Hat',  price: '$19.99 → $16.99 with code' },
              { name: '👕 Premium Tee',  price: 'From $34.99 → $29.74 with code' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(232,221,208,0.65)' }}>{item.name}</span>
                <span style={{ fontSize: '0.72rem', color: GOLD, letterSpacing: '0.04em' }}>{item.price}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)', textDecoration: 'none' }}>
            ← Back to malachiasmusic.com
          </Link>
        </div>
      </div>
    </main>
  )
}
