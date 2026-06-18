'use client'

// Top-of-page live-stream banner — fetches /api/live-sessions and, if a session is
// live (or the next one is upcoming), shows a clickable bar linking to the platform,
// with a live "● LIVE NOW" state or a countdown to the scheduled start. Hidden otherwise.

import { useEffect, useState } from 'react'
import type { LiveSession } from '@/lib/data'

// Fallbacks for when an admin doesn't supply an explicit platformUrl — point at
// the band's verified, real profiles (same URLs used in Navbar/Footer/EPK).
const PLATFORM_URLS: Record<string, string> = {
  tiktok: 'https://www.tiktok.com/@malachiasmusic',
  instagram: 'https://www.instagram.com/malachiasmusic',
  youtube: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
  facebook: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
  twitch: 'https://www.twitch.tv/malachiasmusic',
}

function Countdown({ to }: { to: string }) {
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, new Date(to).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [to])

  if (diff <= 0) return <span style={{ color: '#22c55e', fontWeight: 700 }}>Starting now</span>

  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)

  if (h > 48) {
    const days = Math.ceil(diff / 86_400_000)
    return <span>in {days} days</span>
  }

  return (
    <span>
      {h > 0 && `${h}h `}{m}m {String(s).padStart(2, '0')}s
    </span>
  )
}

export default function LiveSessionBanner() {
  const [session, setSession] = useState<LiveSession | null>(null)

  useEffect(() => {
    fetch('/api/live-sessions')
      .then(r => r.ok ? r.json() : [])
      .then((sessions: LiveSession[]) => {
        const live = sessions.find(s => s.status === 'live')
        if (live) { setSession(live); return }
        const upcoming = sessions
          .filter(s => s.status === 'planned' && new Date(s.scheduledAt) > new Date())
          .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0]
        setSession(upcoming ?? null)
      })
      .catch(() => {})
  }, [])

  if (!session) return null

  const isLive = session.status === 'live'
  const url = session.platformUrl || PLATFORM_URLS[session.platform] || '#'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: isLive ? '#22c55e' : '#1a1510',
        borderBottom: isLive ? 'none' : '1px solid rgba(201,168,76,0.25)',
        color: isLive ? '#0d0b09' : '#e8ddd0',
        textDecoration: 'none',
        textAlign: 'center',
        padding: '10px 20px',
        fontSize: 13,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.03em',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {isLive ? (
        <>
          <span style={{ marginRight: 8, fontWeight: 900, letterSpacing: '0.12em' }}>● LIVE NOW</span>
          <span>{session.title}</span>
          <span style={{ margin: '0 8px', opacity: 0.6 }}>·</span>
          <span style={{ fontWeight: 700 }}>Watch →</span>
        </>
      ) : (
        <>
          <span style={{ color: '#c9a84c', fontWeight: 700, marginRight: 8 }}>
            Going Live
          </span>
          <span>{session.title}</span>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          <Countdown to={session.scheduledAt} />
        </>
      )}
    </a>
  )
}
