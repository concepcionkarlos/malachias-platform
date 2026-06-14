'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Song } from '@/lib/data'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function Setlist() {
  const [songs, setSongs] = useState<Song[] | null>(null)

  useEffect(() => {
    fetch('/api/songs')
      .then(r => r.json())
      .then((d: Song[]) => setSongs(d.filter(s => s.status === 'ready')))
      .catch(() => setSongs([]))
  }, [])

  if (songs !== null && songs.length === 0) return null

  const originals = songs?.filter(s => s.type === 'original') ?? []
  const covers    = songs?.filter(s => s.type === 'cover')    ?? []

  return (
    <section id="setlist" style={{ background: '#030202', borderTop: '1px solid rgba(255,255,255,0.04)' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} style={{ marginBottom: '3rem' }}>
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Live Set
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}
          >
            WHAT WE PLAY
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)' }} />
            {songs && (
              <span style={{ fontSize: '0.75rem', color: '#5c5044', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {songs.length} songs performance ready
              </span>
            )}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>

          {/* Originals */}
          <motion.div {...fade(0.08)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#c9a84c', padding: '3px 8px', border: '1px solid rgba(201,168,76,0.30)', borderRadius: 3 }}>
                Originals
              </span>
              <span style={{ fontSize: '0.7rem', color: '#3a2e26' }}>{originals.length} songs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)' }}>
              {songs === null
                ? [0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ height: 44, background: '#030202', opacity: 0.4 }} />
                  ))
                : originals.map((song, i) => (
                    <div
                      key={song.id}
                      style={{
                        background: '#030202', padding: '0.75rem 1rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        borderLeft: '2px solid rgba(201,168,76,0.15)',
                      }}
                    >
                      <span style={{ fontSize: '0.65rem', color: '#2a2215', fontFamily: 'var(--font-display)', minWidth: 20 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#e8ddd0', letterSpacing: '0.02em', fontFamily: 'var(--font-body)' }}>
                        {song.title}
                      </span>
                    </div>
                  ))
              }
            </div>
          </motion.div>

          {/* Covers */}
          <motion.div {...fade(0.14)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#8a7f70', padding: '3px 8px', border: '1px solid rgba(138,127,112,0.25)', borderRadius: 3 }}>
                Covers
              </span>
              <span style={{ fontSize: '0.7rem', color: '#3a2e26' }}>{covers.length} songs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)' }}>
              {songs === null
                ? [0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ height: 50, background: '#030202', opacity: 0.4 }} />
                  ))
                : covers.map((song, i) => (
                    <div
                      key={song.id}
                      style={{
                        background: '#030202', padding: '0.75rem 1rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        borderLeft: '2px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <span style={{ fontSize: '0.65rem', color: '#2a2215', fontFamily: 'var(--font-display)', minWidth: 20 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', color: '#c8bfb0', letterSpacing: '0.02em', fontFamily: 'var(--font-body)' }}>
                          {song.title}
                        </div>
                        {song.originalArtist && (
                          <div style={{ fontSize: '0.7rem', color: '#3a2e26', marginTop: 2 }}>
                            {song.originalArtist}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          </motion.div>
        </div>

        <motion.p {...fade(0.22)} style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#2a2215', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Set expanding — more originals in progress
        </motion.p>
      </div>
    </section>
  )
}
