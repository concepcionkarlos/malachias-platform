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
      style={{ position: 'relative', width: '100%', background: '#040302' }}
    >
      {/* Gold line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)',
      }} />

      {/* Photo — natural size, no crop */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.03)',
        transition: 'opacity 1.2s ease, transform 1.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <Image
          src="/together.png"
          alt="Malachias — the full band together"
          width={360}
          height={360}
          sizes="100vw"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority={false}
        />
      </div>

      {/* Gradient overlay — top/bottom fade to black */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #040302 0%, transparent 12%, transparent 82%, #040302 100%)',
      }} />

      {/* Text overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(10px, 1.4vw, 14px)',
          letterSpacing: '0.40em',
          color: 'rgba(201,168,76,0.80)',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s',
        }}>
          Fort Wayne · Indiana
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 5vw, 56px)',
          letterSpacing: '0.22em',
          color: '#f0ebe3',
          textTransform: 'uppercase',
          textShadow: '0 2px 40px rgba(0,0,0,0.9)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s',
          lineHeight: 1,
        }}>
          MALACHIAS
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(9px, 1.1vw, 12px)',
          letterSpacing: '0.30em',
          color: 'rgba(232,221,208,0.45)',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.9s ease 0.65s, transform 0.9s ease 0.65s',
        }}>
          One Band · One Mission · No One Left Behind
        </div>
      </div>

      {/* Gold line bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)',
      }} />
    </section>
  )
}
