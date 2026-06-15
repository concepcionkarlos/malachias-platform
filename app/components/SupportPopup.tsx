'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { X, Heart, ShoppingBag } from 'lucide-react'

const LS_KEY   = 'malachias_support_popup_ts'
const TTL_MS   = 3 * 24 * 60 * 60 * 1000   // show again after 3 days
const DELAY_MS = 12000                        // wait 12s before showing

export default function SupportPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const seen = parseInt(raw, 10)
      if (!isNaN(seen) && Date.now() - seen < TTL_MS) return
    }
    // Don't show on merch or support pages — user is already there
    if (window.location.pathname.startsWith('/merch') || window.location.pathname.startsWith('/support')) return

    const t = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    localStorage.setItem(LS_KEY, String(Date.now()))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            width: 'min(340px, calc(100vw - 2rem))',
            background: '#0d0b09',
            border: '1px solid rgba(201,168,76,0.22)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.06)',
            overflow: 'hidden',
          }}
          role="dialog"
          aria-label="Support Malachias"
        >
          {/* Gold accent top bar */}
          <div style={{ height: 3, background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.3))' }} />

          {/* Close */}
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#3a3228', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#8a7f70')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#3a3228')}
          >
            <X size={14} />
          </button>

          <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
            {/* Icon + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Heart size={13} style={{ color: '#c9a84c' }} />
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.30em', color: '#c9a84c', textTransform: 'uppercase' }}>
                Support the Band
              </span>
            </div>

            {/* Headline */}
            <p style={{ margin: '0 0 0.55rem', fontSize: '1.05rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', lineHeight: 1.2 }}>
              No label. Just the mission.
            </p>

            {/* Body */}
            <p style={{ margin: '0 0 1.2rem', fontSize: '0.78rem', color: '#5c5044', lineHeight: 1.7 }}>
              Every piece of gear you grab funds the next show, the next song, and veteran outreach. Direct support — no middleman.
            </p>

            {/* What you support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.3rem' }}>
              {['Live shows & touring', 'Original music', 'Veteran mission'].map(s => (
                <span key={s} style={{ fontSize: '0.72rem', color: '#8a7f70', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#c9a84c', fontSize: '0.58rem' }}>✓</span> {s}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Link
                href="/support"
                onClick={dismiss}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem 1rem', background: '#c9a84c', color: '#030202', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)', transition: 'opacity 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                <ShoppingBag size={12} /> Support Us
              </Link>
              <button
                onClick={dismiss}
                style={{ fontSize: '0.60rem', letterSpacing: '0.12em', color: '#3a3228', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', padding: '0.5rem 0' }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
