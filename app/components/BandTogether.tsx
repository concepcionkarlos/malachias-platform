'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function BandTogether() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(320px, 50vw, 560px)',
        overflow: 'hidden',
        background: '#040302',
      }}
    >
      {/* Photo */}
      <Image
        src="/together.jpeg"
        alt="Malachias — the full band together"
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 30%',
          transform: visible ? 'scale(1.0)' : 'scale(1.06)',
          transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1), opacity 1.2s ease',
          opacity: visible ? 1 : 0,
        }}
        priority={false}
      />

      {/* Top gradient — blends into dark section above */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #040302 0%, transparent 18%, transparent 72%, #040302 100%)',
        zIndex: 1,
      }} />

      {/* Gold line top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)',
        zIndex: 2,
      }} />

      {/* Text overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(10px, 1.4vw, 14px)',
          letterSpacing: '0.40em',
          color: 'rgba(201,168,76,0.75)',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s',
        }}>
          Fort Wayne · Indiana
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 4.5vw, 52px)',
          letterSpacing: '0.22em',
          color: '#f0ebe3',
          textTransform: 'uppercase',
          textShadow: '0 2px 32px rgba(0,0,0,0.85)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s',
          lineHeight: 1,
        }}>
          MALACHIAS
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(9px, 1.2vw, 12px)',
          letterSpacing: '0.32em',
          color: 'rgba(232,221,208,0.45)',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s ease 0.65s, transform 0.9s ease 0.65s',
        }}>
          One Band · One Mission · No One Left Behind
        </div>
      </div>

      {/* Gold line bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)',
        zIndex: 2,
      }} />
    </section>
  )
}
