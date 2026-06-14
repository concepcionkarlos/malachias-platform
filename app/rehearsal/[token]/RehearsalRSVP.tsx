'use client'

import { useState } from 'react'
import type { Rehearsal, Song } from '@/lib/data'

const GOLD = '#c9a84c'
const DARK = '#030202'
const BG   = '#0a0909'

export default function RehearsalRSVP({ token, rehearsal, songs }: { token: string; rehearsal: Rehearsal; songs: Song[] }) {
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'confirmed' | 'declined' | null>(null)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [openSong, setOpenSong] = useState<string | null>(null)

  async function rsvp(choice: 'confirmed' | 'declined') {
    if (!name.trim()) { setError('Please enter your name'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/rehearsals/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, status: choice }),
      })
      if (!res.ok) throw new Error()
      setStatus(choice)
      setSent(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#e8ddd0', fontSize: 15, padding: '12px 16px',
    fontFamily: 'Georgia, serif', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#e8ddd0', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ background: DARK, borderBottom: `2px solid ${GOLD}`, padding: '20px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.22em', color: '#e8ddd0', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>MALACHIAS</div>
            <div style={{ fontSize: 10, letterSpacing: '0.20em', color: GOLD, textTransform: 'uppercase', opacity: 0.7, marginTop: 2, fontFamily: 'Arial, sans-serif' }}>Rehearsal Invite</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.25rem' }}>
        {/* Date + Location */}
        <div style={{ background: 'rgba(201,168,76,0.07)', border: `1px solid rgba(201,168,76,0.20)`, borderRadius: 12, padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 8 }}>
            {rehearsal.date}{rehearsal.time && ` · ${rehearsal.time}`}
          </div>
          {rehearsal.location && (
            <div style={{ fontSize: 15, color: '#8a7f70' }}>{rehearsal.location}</div>
          )}
          {rehearsal.notes && (
            <div style={{ marginTop: 12, fontSize: 14, color: '#5c5044', lineHeight: 1.6 }}>{rehearsal.notes}</div>
          )}
        </div>

        {/* Songs */}
        {songs.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 13, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5c5044', margin: '0 0 1rem', fontFamily: 'Arial, sans-serif' }}>Songs to Practice</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {songs.map(song => {
                const isOpen = openSong === song.id
                const hasDetails = song.chords || song.lyrics || song.structure
                return (
                  <div key={song.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
                    <div
                      style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: hasDetails ? 'pointer' : 'default' }}
                      onClick={() => hasDetails && setOpenSong(isOpen ? null : song.id)}
                    >
                      <div>
                        <span style={{ fontSize: 15, color: '#e8ddd0' }}>{song.title}</span>
                        {song.type === 'cover' && song.originalArtist && (
                          <span style={{ fontSize: 12, color: '#3a2e26', marginLeft: 8 }}>{song.originalArtist}</span>
                        )}
                        {song.type === 'original' && (
                          <span style={{ fontSize: 10, color: GOLD, marginLeft: 8, letterSpacing: '0.12em', opacity: 0.8 }}>ORIGINAL</span>
                        )}
                      </div>
                      {hasDetails && (
                        <span style={{ fontSize: 11, color: '#3a2e26' }}>{isOpen ? '▲' : '▼'}</span>
                      )}
                    </div>

                    {isOpen && hasDetails && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {song.structure && (
                          <div>
                            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#3a2e26', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Arial, sans-serif' }}>Structure</div>
                            <div style={{ fontSize: 13, color: '#8a7f70', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{song.structure}</div>
                          </div>
                        )}
                        {song.chords && (
                          <div>
                            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#3a2e26', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Arial, sans-serif' }}>Chords</div>
                            <pre style={{ margin: 0, fontSize: 13, color: '#c9a84c', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: 'rgba(201,168,76,0.05)', padding: '10px 12px', borderRadius: 6 }}>{song.chords}</pre>
                          </div>
                        )}
                        {song.lyrics && (
                          <div>
                            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#3a2e26', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Arial, sans-serif' }}>Lyrics</div>
                            <pre style={{ margin: 0, fontSize: 13, color: '#8a7f70', lineHeight: 1.8, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{song.lyrics}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* RSVP */}
        {!sent ? (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ fontSize: 13, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5c5044', margin: '0 0 1.25rem', fontFamily: 'Arial, sans-serif' }}>Confirm Your Attendance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.25rem' }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name *"
                style={INPUT}
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email (optional)"
                type="email"
                style={INPUT}
              />
            </div>
            {error && <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => rsvp('confirmed')}
                disabled={loading}
                style={{ flex: 1, padding: '14px', background: GOLD, color: DARK, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                {loading ? '…' : 'I\'ll be there ✓'}
              </button>
              <button
                onClick={() => rsvp('declined')}
                disabled={loading}
                style={{ flex: 1, padding: '14px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                Can't make it
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: status === 'confirmed' ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${status === 'confirmed' ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{status === 'confirmed' ? '🤘' : '👋'}</div>
            <div style={{ fontSize: 18, color: status === 'confirmed' ? '#34d399' : '#8a7f70', fontWeight: 700, marginBottom: 8 }}>
              {status === 'confirmed' ? 'See you there!' : 'Got it — we\'ll miss you.'}
            </div>
            <div style={{ fontSize: 14, color: '#5c5044' }}>
              {status === 'confirmed'
                ? `${rehearsal.date}${rehearsal.time ? ` at ${rehearsal.time}` : ''}${rehearsal.location ? ` · ${rehearsal.location}` : ''}`
                : 'Your response has been recorded.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
