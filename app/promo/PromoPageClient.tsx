'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PromoPageClient() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [lang, setLang] = useState<'en' | 'es'>('en')

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

  const T = {
    badge:   { en: '✠ Merch Launch Special ✠',           es: '✠ Lanzamiento de Tienda ✠' },
    h1:      { en: '15% OFF\nTHE STORE',                  es: '15% DE\nDESCUENTO' },
    sub:     {
      en: 'To celebrate our official merch launch, we\'re giving the community 15% off every order. Enter your email — your code arrives instantly.',
      es: 'Para celebrar el lanzamiento de nuestra tienda oficial, le damos a la comunidad 15% de descuento en cada pedido. Ingresa tu correo — el código llega de inmediato.',
    },
    placeholder: { en: 'Your email address', es: 'Tu correo electrónico' },
    cta:     { en: 'Subscribe & Get 15% OFF →', es: 'Suscribirse y Obtener 15% →' },
    loading: { en: 'Sending…',                 es: 'Enviando…' },
    error:   {
      en: 'Something went wrong. Email us at hello@malachiasmusic.com',
      es: 'Algo salió mal. Escríbenos a hello@malachiasmusic.com',
    },
    no_spam: { en: 'No spam. Unsubscribe any time.', es: 'Sin spam. Cancela cuando quieras.' },
    done_h:  { en: 'Check your inbox!',   es: '¡Revisa tu correo!' },
    done_p:  {
      en: (e: string) => `We sent your 15% OFF code to ${e}. Check your inbox (and spam folder just in case).`,
      es: (e: string) => `Enviamos tu código de 15% de descuento a ${e}. Revisa tu bandeja de entrada (y spam, por si acaso).`,
    },
    done_cta:  { en: 'Shop the Store →', es: 'Ir a la Tienda →' },
    done_sub:  { en: 'God bless. Thank you for supporting the mission.', es: 'Que Dios los bendiga. Gracias por apoyar la misión.' },
    store_lbl: { en: 'What\'s in the store',  es: 'Qué hay en la tienda' },
    back:      { en: '← Back to malachiasmusic.com', es: '← Volver a malachiasmusic.com' },
  }

  const t = (key: keyof typeof T) => {
    const val = T[key]
    if (typeof val === 'object' && 'en' in val) {
      const v = val[lang]
      return typeof v === 'function' ? v(email) : v
    }
    return ''
  }

  const GOLD = '#c9a84c'

  return (
    <main style={{ background: '#030202', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>

      <div style={{ height: 4, background: `linear-gradient(to right, ${GOLD}, rgba(201,168,76,0.3))` }} />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'clamp(3rem,10vw,6rem) 1.5rem clamp(4rem,10vw,6rem)' }}>

        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', gap: '0.5rem' }}>
          {(['en', 'es'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '0.25rem 0.75rem', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                background: lang === l ? GOLD : 'rgba(201,168,76,0.08)',
                color: lang === l ? '#030202' : 'rgba(201,168,76,0.50)',
                fontWeight: lang === l ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              {l === 'en' ? 'EN' : 'ES'}
            </button>
          ))}
        </div>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            display: 'inline-block', padding: '0.35rem 1.1rem',
            background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.30)',
            fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD,
          }}>
            {t('badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.6rem, 10vw, 4.2rem)',
          letterSpacing: '0.04em', lineHeight: 0.92,
          color: '#ffffff', margin: '0 0 1rem', textAlign: 'center',
          whiteSpace: 'pre-line',
        }}>
          {t('h1')}
        </h1>

        <p style={{ textAlign: 'center', fontSize: '0.90rem', color: 'rgba(232,221,208,0.50)', lineHeight: 1.75, margin: '0 0 2.5rem' }}>
          {t('sub')}
        </p>

        <div style={{ width: '3rem', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, margin: '0 auto 2.5rem' }} />

        {state !== 'done' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('placeholder') as string}
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
              {state === 'loading' ? t('loading') : t('cta')}
            </button>
            {state === 'error' && (
              <p style={{ textAlign: 'center', fontSize: '0.80rem', color: '#c04020' }}>
                {t('error')}{' '}
                <a href="mailto:hello@malachiasmusic.com" style={{ color: GOLD }}>hello@malachiasmusic.com</a>
              </p>
            )}
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              {t('no_spam')}
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {/* Inbox confirmation — code arrives by email, not shown on screen */}
            <div style={{
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
              padding: '2rem 1.5rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📬</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#ffffff',
                letterSpacing: '0.06em', margin: '0 0 0.75rem',
              }}>
                {t('done_h')}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(232,221,208,0.60)', lineHeight: 1.75, margin: 0 }}>
                {t('done_p')}
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
              {t('done_cta')}
            </Link>

            <p style={{ fontSize: '0.68rem', color: 'rgba(232,221,208,0.25)', letterSpacing: '0.08em' }}>
              {t('done_sub')}
            </p>
          </div>
        )}

        {/* What's in the store */}
        {state !== 'done' && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.56rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: '1.1rem', textAlign: 'center' }}>
              {t('store_lbl')}
            </p>
            {[
              { name: '☕ Support Mug', priceEn: 'From $8.95 → $7.61 with code', priceEs: 'Desde $8.95 → $7.61 con código' },
              { name: '🧢 Warrior Hat', priceEn: '$19.99 → $16.99 with code', priceEs: '$19.99 → $16.99 con código' },
              { name: '🧢 Trucker Hat', priceEn: '$19.99 → $16.99 with code', priceEs: '$19.99 → $16.99 con código' },
              { name: '👕 Premium Tee', priceEn: 'From $34.99 → $29.74 with code', priceEs: 'Desde $34.99 → $29.74 con código' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(232,221,208,0.65)' }}>{item.name}</span>
                <span style={{ fontSize: '0.72rem', color: GOLD, letterSpacing: '0.04em' }}>
                  {lang === 'es' ? item.priceEs : item.priceEn}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)', textDecoration: 'none' }}>
            {t('back')}
          </Link>
        </div>
      </div>
    </main>
  )
}
