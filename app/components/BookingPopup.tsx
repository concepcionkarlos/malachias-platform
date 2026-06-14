'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const SESSION_KEY = 'malachias_booking_popup_dismissed'
const DELAY_MS    = 5000

export default function BookingPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => {
      // Don't show if user has already scrolled past the fold to the booking section
      const booking = document.getElementById('booking')
      if (booking) {
        const rect = booking.getBoundingClientRect()
        if (rect.top < window.innerHeight) return
      }
      setVisible(true)
    }, DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  function goBook() {
    dismiss()
    const el = document.getElementById('booking')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{    opacity: 0, y: 24, scale: 0.96  }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 300,
            background: '#0d0b0a',
            border: '1px solid rgba(201,168,76,0.35)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,168,76,0.06)',
            overflow: 'hidden',
          }}
          role="dialog"
          aria-label="Book Malachias"
        >
          {/* Gold top stripe */}
          <div style={{ height: 2, background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.25), transparent)' }} />

          <div style={{ padding: '18px 18px 20px' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                  MALACHIAS
                </div>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: '#e8ddd0', lineHeight: 1.1 }}>
                  WE GOT YOU.
                </div>
              </div>
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#524437', padding: 2, marginTop: 2, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#8a7f70')}
                onMouseLeave={e => (e.currentTarget.style.color = '#524437')}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <p style={{ fontSize: '0.8rem', lineHeight: 1.65, color: '#a89880', margin: '0 0 16px', fontFamily: 'var(--font-body)' }}>
              Looking to book us for a church, military event, or community show?
              Takes 2 minutes — we&apos;ll get back to you fast.
            </p>

            {/* Venue tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
              {['Churches', 'VFW Halls', 'Festivals', 'Private Events'].map(tag => (
                <span
                  key={tag}
                  style={{ fontSize: '0.6rem', padding: '2px 8px', border: '1px solid rgba(201,168,76,0.18)', color: '#7a6e5e', letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={goBook}
              style={{
                width: '100%', padding: '11px 0',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(160,110,28,0.16) 100%)',
                border: '1px solid rgba(201,168,76,0.50)',
                color: '#c9a84c',
                fontSize: '0.72rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'background 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget
                btn.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.85) 0%, rgba(185,138,38,1) 100%)'
                btn.style.color = '#000'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget
                btn.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(160,110,28,0.16) 100%)'
                btn.style.color = '#c9a84c'
              }}
            >
              Send a Booking Request
            </button>

            <button
              onClick={dismiss}
              style={{ display: 'block', width: '100%', marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: '#524437', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', textAlign: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7a6e5e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#524437')}
            >
              Not right now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
