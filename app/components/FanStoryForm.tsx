'use client'

// "Tell Us How It Hit You" fan-story submission form — lets visitors share how the
// music/a show affected them (optional song, name, email) and POSTs to /api/fan-stories.
// Shows a thank-you confirmation once submitted.

import { useState, FormEvent } from 'react'

export default function FanStoryForm() {
  const [story, setStory] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/fan-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, story, songTitle }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong. Try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ background: '#080808', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Label */}
        <p style={{
          fontSize: '0.60rem',
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color: 'var(--gold, #c9a84c)',
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}>
          Your Story
        </p>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(2.4rem, 7vw, 3.6rem)',
          lineHeight: 0.95,
          letterSpacing: '0.06em',
          color: '#e8ddd0',
          marginBottom: '2.5rem',
        }}>
          TELL US HOW IT HIT YOU.
        </h2>

        {submitted ? (
          <div style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.22)',
            padding: '2rem 1.75rem',
            color: '#e8ddd0',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
              Your story is in. Thank you for sharing it.
            </p>
            <p style={{ fontSize: '0.80rem', color: 'rgba(232,221,208,0.55)', lineHeight: 1.6 }}>
              We read every submission. If you included your email, we may reach out.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Story textarea — required */}
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              rows={5}
              required
              placeholder="What did the music do for you? Which show? Which song?"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#e8ddd0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.90rem',
                lineHeight: 1.65,
                padding: '0.85rem 1rem',
                resize: 'vertical',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Song title — optional */}
            <input
              type="text"
              value={songTitle}
              onChange={e => setSongTitle(e.target.value)}
              placeholder="Which song meant the most?"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#e8ddd0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.90rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Name — optional */}
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (leave blank to be anonymous)"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#e8ddd0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.90rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Email — optional */}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email (not published)"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#e8ddd0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.90rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#c9a84c',
                  color: '#000',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  padding: '0.85rem 2rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'Sending…' : 'Share Your Story →'}
              </button>

              {error && (
                <p style={{
                  marginTop: '0.75rem',
                  fontSize: '0.80rem',
                  color: '#e05252',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                }}>
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
