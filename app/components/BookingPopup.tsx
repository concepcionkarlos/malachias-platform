'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const LS_KEY   = 'malachias_popup_ts'
const TTL_MS   = 7 * 24 * 60 * 60 * 1000   // resurface after 7 days
const DELAY_MS = 4000

export default function BookingPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const seen = parseInt(raw, 10)
      if (!isNaN(seen) && Date.now() - seen < TTL_MS) return
    }

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(LS_KEY, String(Date.now()))
  }

  function goBook() {
    dismiss()
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 28, scale: 0.94 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 312,
            background: 'linear-gradient(160deg, #0f0d0b 0%, #0a0806 100%)',
            border: '1px solid rgba(201,168,76,0.42)',
            boxShadow: '0 16px 72px rgba(0,0,0,0.88), 0 0 0 1px rgba(201,168,76,0.07), inset 0 1px 0 rgba(201,168,76,0.06)',
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
