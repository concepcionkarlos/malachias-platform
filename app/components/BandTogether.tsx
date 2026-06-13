'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function BandTogether() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        background: '#040302',
        padding: '64px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}
    >
      {/* Top label */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: '0.38em',
        color: 'rgba(201,168,76,0.65)',
        textTransform: 'uppercase',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        Fort Wayne · Indiana
      </div>

      {/* Photo with gold frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.97)',
        transition: 'opacity 1s ease 0.15s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.15s',
      }}>
        {/* Gold border frame */}
        <div style={{
          position: 'absolute',
          inset: -6,
          border: '1px solid rgba(201,168,76,0.30)',
          borderRadius: 4,
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          inset: -12,
          border: '1px solid rgba(201,168,76,0.10)',
          borderRadius: 6,
          zIndex: 0,
        }} />

        <Image
          src="/together.png"
          alt="Malachias — the full band together"
          width={360}
          height={360}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: 2,
            position: 'relative',
            zIndex: 1,
          }}
          priority={false}
        />
      </div>

      {/* Band name + tagline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
      }}>
        {/* Gold divider */}
        <div style={{
          width: 48,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)',
          marginBottom: 8,
        }} />

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(18px, 3vw, 26px)',
          letterSpacing: '0.28em',
          color: '#e8ddd0',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          MALACHIAS
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.26em',
          color: 'rgba(232,221,208,0.35)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          One Band · One Mission · No One Left Behind
        </div>
      </div>
    </section>
  )
}
