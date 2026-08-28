'use client'

// "Bring Us To Your Community" booking modal. It never fires on a timer: a first-time
// visitor gets to listen first. It opens once when the visitor has shown intent —
// scrolled 60% of the page, or moved the cursor out the top of the window (exit
// intent) — and never if they already reached the booking form on their own.
// Suppressed for 7 days via localStorage. Escape / backdrop / clear close button.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

const LS_KEY        = 'malachias_popup_ts'
const TTL_MS        = 7 * 24 * 60 * 60 * 1000
const SCROLL_TRIGGER = 0.60   // fraction of the page scrolled
const MIN_DWELL_MS   = 15000  // never before 15 s on the page, whatever the scroll

export default function BookingPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const seen = parseInt(raw, 10)
      if (!isNaN(seen) && Date.now() - seen < TTL_MS) return
    }

    const arrived = Date.now()
    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      cleanup()
      setVisible(true)
    }

    const reachedBooking = () => {
      const el = document.getElementById('booking')
      if (!el) return false
      return el.getBoundingClientRect().top < window.innerHeight
    }

    const onScroll = () => {
      if (Date.now() - arrived < MIN_DWELL_MS) return
      if (reachedBooking()) { fired = true; cleanup(); return } // they found the form themselves
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) fire()
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && Date.now() - arrived >= MIN_DWELL_MS && !reachedBooking()) fire()
    }

    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onLeave)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return cleanup
  }, [])

  // Scroll-lock body + Escape key while open
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

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
          key="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={dismiss}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            cursor: 'pointer',
          }}
        >
          <motion.div
            key="popup-card"
            initial={{ scale: 0.88, y: 36 }}
            animate={{ scale: 1,    y: 0  }}
            exit={{    scale: 0.92, y: 20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              background: '#080604',
              border: '1px solid rgba(201,168,76,0.30)',
              boxShadow: '0 32px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(201,168,76,0.06)',
              overflow: 'hidden',
              cursor: 'default',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Book Malachias"
          >
            {/* Emblem watermark */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <Image
                src="/Malachias.PNG"
                alt=""
                fill
                sizes="560px"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'right center',
                  opacity: 0.055,
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.2) brightness(0.8)',
                  transform: 'scale(1.15) translateX(10%)',
                }}
              />
            </div>

            <div style={{ position: 'relative', zIndex: 1, height: 3, background: 'linear-gradient(to right, #c9a84c 0%, rgba(201,168,76,0.40) 60%, transparent 100%)' }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '40px 44px 44px' }}>

              {/* Close — clearly visible, 44px hit area */}
              <button
                onClick={dismiss}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 44,
                  height: 44,
                  background: 'none',
                  border: '1px solid rgba(201,168,76,0.25)',
                  cursor: 'pointer',
                  color: '#c9a84c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <X size={18} />
              </button>

              <div style={{
                fontSize: '0.62rem',
                letterSpacing: '0.40em',
                textTransform: 'uppercase',
                color: '#c9a84c',
                fontFamily: 'var(--font-display)',
                marginBottom: 20,
              }}>
                MALACHIAS — SOUTH FLORIDA
              </div>

              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 8vw, 4rem)',
                lineHeight: 0.92,
                letterSpacing: '0.02em',
                color: '#ede5d8',
                marginBottom: 24,
              }}>
                <span style={{ display: 'block' }}>BRING US</span>
                <span style={{ display: 'block', color: '#c9a84c' }}>TO YOUR</span>
                <span style={{ display: 'block' }}>COMMUNITY.</span>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.45) 0%, rgba(201,168,76,0.08) 70%, transparent 100%)', marginBottom: 24 }} />

              <p style={{
                fontSize: '0.88rem',
                lineHeight: 1.7,
                color: '#a89880',
                margin: '0 0 24px',
                fontFamily: 'var(--font-body)',
                maxWidth: '36ch',
              }}>
                Bars, festivals, churches, clubs, private events — we bring it wherever there&apos;s a stage.
                Takes 2 minutes to reach out. We move fast.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
                {['Bars & Clubs', 'Rock Festivals', 'Metal Events', 'Churches', 'VFW Halls', 'Private Events'].map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.62rem',
                    padding: '4px 12px',
                    border: '1px solid rgba(201,168,76,0.22)',
                    color: '#8a7f70',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={goBook}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '18px 0',
                  background: 'linear-gradient(135deg, #c9a84c 0%, #b8902e 100%)',
                  border: 'none',
                  color: '#000',
                  fontSize: '0.85rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  transition: 'filter 0.2s ease, transform 0.2s ease',
                  marginBottom: 14,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'brightness(1.12)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'brightness(1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Send a Booking Request →
              </button>

              <button
                onClick={dismiss}
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 0',
                  fontSize: '0.68rem',
                  color: '#8a7f70',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e8ddd0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8a7f70')}
              >
                Not right now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
