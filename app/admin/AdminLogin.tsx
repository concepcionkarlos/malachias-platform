'use client'
import { useState } from 'react'

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      onLogin()
    } else {
      setError('Invalid password.')
      setPassword('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#070707',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem',
            letterSpacing: '0.22em', color: '#e8ddd0', marginBottom: '0.4rem',
          }}>
            MALACHIAS
          </div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.26em', color: '#c9a84c', textTransform: 'uppercase', opacity: 0.65 }}>
            Admin Access
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: error ? '1px solid rgba(192,64,32,0.6)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4, color: '#e8ddd0', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
          {error && (
            <div style={{ color: '#c04020', fontSize: '0.78rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '0.75rem',
              background: loading || !password ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.18)',
              border: '1px solid rgba(201,168,76,0.30)',
              color: loading || !password ? '#5c5044' : '#c9a84c',
              borderRadius: 4, fontSize: '0.78rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
