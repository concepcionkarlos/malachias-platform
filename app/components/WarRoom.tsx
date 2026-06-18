'use client'

// Homepage "War Room" daily-reflection section — fetches reflections from
// /api/public/content, shows today's verse + reflection + suggested song, an expandable
// archive of previous entries, and a newsletter subscribe CTA. Hidden when there are none.

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DailyReflection } from '@/lib/data'

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}

export default function WarRoom() {
  const [reflections, setReflections] = useState<DailyReflection[]>([])
  const [showArchive, setShowArchive] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.dailyReflections)) setReflections(d.dailyReflections) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.10 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (reflections.length === 0) return null

  const today = new Date().toISOString().split('T')[0]
  const current = reflections.find(r => r.date <= today) ?? reflections[0]
  const archive = reflections.filter(r => r.id !== current.id).slice(0, 6)

  return (
    <section
      ref={ref}
      id="warroom"
      style={{ background: '#010101', position: 'relative', overflow: 'hidden' }}
      className="section-pad"
    >
      {/* Cross watermark */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 0,
      }}>
        <svg viewBox="0 0 120 160" style={{ width: '40vw', maxWidth: 320, opacity: 0.018 }} fill="none">
          <rect x="48" y="0" width="24" height="160" rx="2" fill="white" />
          <rect x="0" y="52" width="120" height="24" rx="2" fill="white" />
        </svg>
      </div>

      {/* Ambient warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw', height: '50%',
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.10) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div className="max-w-3xl mx-auto px-6 relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3.5rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.55rem',
            letterSpacing: '0.50em',
            color: 'rgba(192,64,32,0.70)',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            Daily Reflection
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              letterSpacing: '0.12em',
              color: '#e8ddd0',
              lineHeight: 0.92,
            }}
          >
            WAR ROOM
          </h2>
          <div style={{
            width: '2rem', height: '1px', margin: '1rem auto 0',
            background: 'rgba(192,64,32,0.50)',
          }} />
        </div>

        {/* Current entry */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Date stamp */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.52rem',
            letterSpacing: '0.35em',
            color: 'rgba(201,168,76,0.30)',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            {formatDisplayDate(current.date)}
          </p>

          {/* Verse — the centerpiece */}
          <blockquote style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 3vw, 1.65rem)',
              lineHeight: 1.60,
              letterSpacing: '0.04em',
              color: 'rgba(201,168,76,0.82)',
              fontStyle: 'italic',
              marginBottom: '1rem',
            }}>
              {current.verse}
            </p>
            <p style={{
              fontSize: '0.55rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.35)',
            }}>
              — {current.verseRef}
            </p>
          </blockquote>

          {/* Gold divider */}
          <div style={{
            width: '3rem', height: '1px', margin: '2.5rem auto',
            background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.40), transparent)',
          }} />

          {/* Reflection text */}
          <p style={{
            fontSize: '0.92rem',
            lineHeight: 1.88,
            color: 'rgba(232,221,208,0.62)',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            maxWidth: '30rem',
            margin: '0 auto 1.25rem',
          }}>
            {current.reflection}
          </p>

          <p style={{
            textAlign: 'center',
            fontSize: '0.54rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.28)',
          }}>
            — The Founder
          </p>

          {/* Suggested song */}
          {current.suggestedSong && (
            <div style={{
              marginTop: '2rem',
              textAlign: 'center',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(201,168,76,0.08)',
              display: 'inline-block',
              left: '50%',
              position: 'relative',
              transform: 'translateX(-50%)',
            }}>
              <p style={{
                fontSize: '0.50rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.35)',
                marginBottom: '0.3rem',
              }}>
                Today&apos;s Sound
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.10em',
                color: 'rgba(232,221,208,0.60)',
              }}>
                {current.suggestedSong}
              </p>
            </div>
          )}

          {/* Subscribe CTA */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a
              href="#newsletter"
              className="btn btn-ghost"
              style={{ fontSize: '0.60rem', letterSpacing: '0.20em', padding: '0.65rem 1.6rem' }}
            >
              Subscribe · Get the Daily Reflection
            </a>
          </div>

          {/* Archive toggle */}
          {archive.length > 0 && (
            <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '2rem' }}>
              <button
                type="button"
                onClick={() => setShowArchive(v => !v)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0',
                }}
              >
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)' }}>
                  Previous Reflections
                </span>
                <span style={{ fontSize: '0.52rem', color: 'rgba(201,168,76,0.30)' }}>
                  {showArchive ? '▲' : '▼'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {showArchive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {archive.map(r => (
                        <div key={r.id} style={{
                          borderLeft: '1px solid rgba(201,168,76,0.12)',
                          paddingLeft: '1.25rem',
                        }}>
                          <p style={{
                            fontSize: '0.48rem',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: 'rgba(201,168,76,0.28)',
                            marginBottom: '0.4rem',
                          }}>
                            {formatDisplayDate(r.date)}
                          </p>
                          <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                            color: 'rgba(201,168,76,0.50)',
                            fontStyle: 'italic',
                            marginBottom: '0.5rem',
                            lineHeight: 1.5,
                          }}>
                            {r.verse.length > 120 ? r.verse.slice(0, 120) + '…' : r.verse}
                          </p>
                          <p style={{
                            fontSize: '0.48rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: 'rgba(201,168,76,0.22)',
                          }}>
                            — {r.verseRef}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
