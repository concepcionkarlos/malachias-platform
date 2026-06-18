'use client'

// Client component for /rehearsal/[token]: the band-member RSVP flow. Walks through
// identity -> preparation commitment (per-song + general readiness checklist + notes)
// -> done, and POSTs the confirmed/declined response to /api/rehearsals/[token].
import { useState } from 'react'
import type { Rehearsal, Song } from '@/lib/data'

const GOLD = '#c9a84c'
const DARK = '#030202'
const BG   = '#0a0909'

const INSTRUMENTS = ['Vocals', 'Lead Guitar', 'Rhythm Guitar', 'Bass', 'Drums', 'Keys', 'Other']

const GENERAL_ITEMS = [
  'My gear is confirmed and ready to go',
  "I've listened to all recordings for the listed songs",
  'I know the arrangements and key changes',
  "I'll be on time (or early) for setup",
]

const INPUT: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: '#e8ddd0', fontSize: 15, padding: '12px 16px',
  fontFamily: 'Georgia, serif', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function RehearsalRSVP({ token, rehearsal, songs }: { token: string; rehearsal: Rehearsal; songs: Song[] }) {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [instrument, setInstrument] = useState('')
  const [step, setStep]           = useState<'identity' | 'prep' | 'done'>('identity')
  const [finalStatus, setFinalStatus] = useState<'confirmed' | 'declined' | null>(null)
  const [readySongs, setReadySongs] = useState<string[]>([])
  const [readyItems, setReadyItems] = useState<string[]>([])
  const [note, setNote]           = useState('')
  const [openSong, setOpenSong]   = useState<string | null>(null)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  function toggleSong(id: string) {
    setReadySongs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleItem(item: string) {
    setReadyItems(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  async function submit(status: 'confirmed' | 'declined', skipPrep = false) {
    if (!name.trim()) { setError('Please enter your name'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/rehearsals/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, instrument, status,
          readySongs: skipPrep ? [] : readySongs,
          readyItems: skipPrep ? [] : readyItems,
          note: skipPrep ? '' : note,
        }),
      })
      if (!res.ok) throw new Error()
      setFinalStatus(status)
      setStep('done')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#e8ddd0', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ background: DARK, borderBottom: `2px solid ${GOLD}`, padding: '20px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.22em', color: '#e8ddd0', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>MALACHIAS</div>
          <div style={{ fontSize: 10, letterSpacing: '0.20em', color: GOLD, textTransform: 'uppercase', opacity: 0.7, marginTop: 2, fontFamily: 'Arial, sans-serif' }}>Rehearsal Invite</div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.25rem' }}>

        {/* Date + Location */}
        <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.20)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 8 }}>
            {rehearsal.date}{rehearsal.time && ` · ${rehearsal.time}`}
          </div>
          {rehearsal.location && <div style={{ fontSize: 15, color: '#8a7f70' }}>{rehearsal.location}</div>}
          {rehearsal.notes && <div style={{ marginTop: 12, fontSize: 14, color: '#5c5044', lineHeight: 1.6 }}>{rehearsal.notes}</div>}
        </div>

        {/* Songs to practice */}
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
                      {hasDetails && <span style={{ fontSize: 11, color: '#3a2e26' }}>{isOpen ? '▲' : '▼'}</span>}
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
                            <pre style={{ margin: 0, fontSize: 13, color: GOLD, lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: 'rgba(201,168,76,0.05)', padding: '10px 12px', borderRadius: 6 }}>{song.chords}</pre>
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

        {/* ── STEP 1: Identity ─────────────────────────────────── */}
        {step === 'identity' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ fontSize: 13, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5c5044', margin: '0 0 1.25rem', fontFamily: 'Arial, sans-serif' }}>Your Response</h2>
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
              {/* Instrument selector */}
              <div>
                <label style={{ fontSize: 11, color: '#3a2e26', display: 'block', marginBottom: 8, letterSpacing: '0.14em', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>Your role</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {INSTRUMENTS.map(inst => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setInstrument(prev => prev === inst ? '' : inst)}
                      style={{
                        padding: '6px 14px', borderRadius: 99, fontSize: 13, cursor: 'pointer', fontFamily: 'Georgia, serif',
                        background: instrument === inst ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
                        border: instrument === inst ? `1px solid rgba(201,168,76,0.50)` : '1px solid rgba(255,255,255,0.10)',
                        color: instrument === inst ? GOLD : '#5c5044',
                        transition: 'all 0.15s',
                      }}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error && <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => { if (!name.trim()) { setError('Please enter your name'); return } setError(''); setStep('prep') }}
                style={{ flex: 1, padding: '14px', background: GOLD, color: DARK, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                I'll be there ✓
              </button>
              <button
                type="button"
                onClick={() => submit('declined', true)}
                disabled={loading}
                style={{ flex: 1, padding: '14px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                {loading ? '…' : 'Can\'t make it'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preparation ──────────────────────────────── */}
        {step === 'prep' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 13, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5c5044', marginBottom: 4, fontFamily: 'Arial, sans-serif' }}>Preparation Commitment</div>
              <div style={{ fontSize: 13, color: '#3a2e26', lineHeight: 1.5 }}>Check off what you commit to having ready for rehearsal.</div>
            </div>

            {/* Song readiness */}
            {songs.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', color: '#3a2e26', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Arial, sans-serif' }}>Songs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {songs.map(song => {
                    const checked = readySongs.includes(song.id)
                    return (
                      <label
                        key={song.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: checked ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.02)', border: checked ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.15s' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSong(song.id)}
                          style={{ accentColor: GOLD, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontSize: 14, color: checked ? '#e8ddd0' : '#8a7f70' }}>{song.title}</div>
                          {song.type === 'cover' && song.originalArtist && (
                            <div style={{ fontSize: 11, color: '#3a2e26' }}>{song.originalArtist}</div>
                          )}
                        </div>
                        {checked && <span style={{ marginLeft: 'auto', fontSize: 12, color: GOLD }}>✓ Ready</span>}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* General items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', color: '#3a2e26', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Arial, sans-serif' }}>General</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GENERAL_ITEMS.map(item => {
                  const checked = readyItems.includes(item)
                  return (
                    <label
                      key={item}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: checked ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.02)', border: checked ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.15s' }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(item)}
                        style={{ accentColor: GOLD, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 14, color: checked ? '#e8ddd0' : '#8a7f70' }}>{item}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 11, letterSpacing: '0.16em', color: '#3a2e26', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'Arial, sans-serif' }}>Notes (optional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Anything the band should know — gear issues, a question about a song, arriving late..."
                rows={3}
                style={{ ...INPUT, resize: 'none' }}
              />
            </div>

            {error && <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => submit('confirmed')}
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: GOLD, color: DARK, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Arial, sans-serif', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Saving…' : 'Confirm My Attendance'}
              </button>
              <button
                type="button"
                onClick={() => setStep('identity')}
                style={{ background: 'transparent', border: 'none', color: '#3a2e26', fontSize: 13, cursor: 'pointer', fontFamily: 'Georgia, serif', padding: '4px 0' }}
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ─────────────────────────────────────────────── */}
        {step === 'done' && (
          <div style={{ background: finalStatus === 'confirmed' ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${finalStatus === 'confirmed' ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{finalStatus === 'confirmed' ? '🤘' : '👋'}</div>
            <div style={{ fontSize: 18, color: finalStatus === 'confirmed' ? '#34d399' : '#8a7f70', fontWeight: 700, marginBottom: 8 }}>
              {finalStatus === 'confirmed' ? 'See you there!' : 'Got it — we\'ll miss you.'}
            </div>
            <div style={{ fontSize: 14, color: '#5c5044', marginBottom: finalStatus === 'confirmed' && readySongs.length > 0 ? 16 : 0 }}>
              {finalStatus === 'confirmed'
                ? `${rehearsal.date}${rehearsal.time ? ` at ${rehearsal.time}` : ''}${rehearsal.location ? ` · ${rehearsal.location}` : ''}`
                : 'Your response has been recorded.'}
            </div>
            {finalStatus === 'confirmed' && readySongs.length > 0 && (
              <div style={{ fontSize: 13, color: '#3a2e26' }}>
                You committed to {readySongs.length} song{readySongs.length !== 1 ? 's' : ''}. Come ready. 🎸
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
