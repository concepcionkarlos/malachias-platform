'use client'

// Homepage "Behind the Song" section — an accordion list of song stories (from
// /api/public/content) where each row expands to reveal its scripture verse, the
// narrative behind the song, and Spotify/Apple Music links. Hidden when there are none.

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SongStory } from '@/lib/data'

const SPOTIFY_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)
const APPLE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.1.958 1.284 1.846.736 3.01a4.97 4.97 0 00-.272.788 12.158 12.158 0 00-.19 1.396c-.013.148-.018.298-.026.447v11.718c.008.15.013.298.026.447.04.535.11 1.07.272 1.589.536 1.745 1.73 2.87 3.51 3.354a8.28 8.28 0 001.65.248c.585.03 1.172.04 1.758.043H17.542a11.59 11.59 0 001.649-.166c1.015-.195 1.913-.608 2.651-1.279 1.034-.934 1.553-2.117 1.729-3.46.04-.312.07-.626.07-.94L24 6.124z"/>
  </svg>
)

function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function StoryRow({ story, index, open, onToggle }: {
  story: SongStory
  index: number
  open: boolean
  onToggle: () => void
}) {
  const { ref, visible } = useVisible()
  const paragraphs = story.story.split('\n\n').filter(Boolean)

  return (
    <div
      ref={ref}
      style={{
        borderTop: '1px solid rgba(201,168,76,0.08)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s`,
      }}
    >
      {/* Row header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1.4rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Number */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.58rem',
          color: 'rgba(201,168,76,0.30)',
          letterSpacing: '0.2em',
          minWidth: '1.8rem',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + verse ref */}
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            letterSpacing: '0.06em',
            color: open ? '#c9a84c' : '#e8ddd0',
            lineHeight: 1,
            marginBottom: '0.35rem',
            transition: 'color 0.25s',
          }}>
            {story.title}
          </p>
          <p style={{
            fontSize: '0.55rem',
            letterSpacing: '0.30em',
            color: 'rgba(201,168,76,0.45)',
            textTransform: 'uppercase',
          }}>
            {story.verseRef}
          </p>
        </div>

        {/* Moment tag */}
        {story.moment && (
          <span style={{
            fontSize: '0.52rem',
            letterSpacing: '0.18em',
            color: 'rgba(232,221,208,0.20)',
            textTransform: 'uppercase',
            display: 'none',
          }}
            className="story-moment"
          >
            {story.moment}
          </span>
        )}

        {/* Toggle label */}
        <span style={{
          fontSize: '0.52rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: open ? '#c9a84c' : 'rgba(201,168,76,0.40)',
          transition: 'color 0.25s',
          whiteSpace: 'nowrap',
        }}>
          {open ? 'CLOSE ▲' : 'READ ▼'}
        </span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: '2.5rem', paddingLeft: '3.3rem' }}>

              {/* Verse block */}
              <blockquote style={{
                borderLeft: '2px solid rgba(201,168,76,0.35)',
                paddingLeft: '1.25rem',
                marginBottom: '2rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
                  lineHeight: 1.55,
                  letterSpacing: '0.03em',
                  color: 'rgba(201,168,76,0.75)',
                  fontStyle: 'italic',
                  marginBottom: '0.5rem',
                }}>
                  {story.verse}
                </p>
                <p style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.30em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.40)',
                }}>
                  — {story.verseRef}
                </p>
              </blockquote>

              {/* Story paragraphs */}
              <div style={{ maxWidth: '36rem' }}>
                {paragraphs.map((p, i) => (
                  <p key={i} style={{
                    fontSize: '0.90rem',
                    lineHeight: 1.85,
                    color: 'rgba(232,221,208,0.70)',
                    fontFamily: 'var(--font-body)',
                    marginBottom: i < paragraphs.length - 1 ? '1.25rem' : 0,
                  }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Moment + streaming */}
              <div style={{ marginTop: '1.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {story.moment && (
                  <span style={{
                    fontSize: '0.52rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.28)',
                    fontStyle: 'italic',
                  }}>
                    {story.moment}
                  </span>
                )}
                {story.spotifyUrl && (
                  <a href={story.spotifyUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.52rem', letterSpacing: '0.20em', textTransform: 'uppercase', color: '#1DB954', textDecoration: 'none', opacity: 0.8 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                  >
                    {SPOTIFY_ICON} Spotify
                  </a>
                )}
                {story.appleUrl && (
                  <a href={story.appleUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.52rem', letterSpacing: '0.20em', textTransform: 'uppercase', color: '#fc3c44', textDecoration: 'none', opacity: 0.8 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                  >
                    {APPLE_ICON} Apple Music
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SongStories() {
  const [stories, setStories] = useState<SongStory[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.songStories) && d.songStories.length > 0) setStories(d.songStories) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (stories.length === 0) return null

  return (
    <section id="stories" style={{ background: '#020202' }} className="section-pad relative overflow-hidden">
      <style>{`@media (min-width: 640px) { .story-moment { display: inline !important; } }`}</style>

      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', right: '-5%',
        width: '40vw', height: '50%',
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.07) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div className="max-w-5xl mx-auto px-6 relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <div
          ref={headerRef}
          style={{
            marginBottom: '3rem',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            The Sound · The Story
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            BEHIND THE SONG
          </h2>
          <div style={{
            width: '3rem', height: '1px', marginTop: '1rem',
            background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
          }} />
          <p style={{
            marginTop: '1rem',
            fontSize: '0.82rem',
            color: 'rgba(232,221,208,0.40)',
            maxWidth: '28rem',
            lineHeight: 1.7,
          }}>
            Every song came from somewhere real. These are the stories behind the music.
          </p>
        </div>

        {/* Song list */}
        <div style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          {stories.map((s, i) => (
            <StoryRow
              key={s.id}
              story={s}
              index={i}
              open={openId === s.id}
              onToggle={() => setOpenId(prev => prev === s.id ? null : s.id)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
