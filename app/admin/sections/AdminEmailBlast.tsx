'use client'

import { useState, useEffect } from 'react'
import { Send, Users } from 'lucide-react'

export default function AdminEmailBlast() {
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult]   = useState<{ sent: number; total: number } | null>(null)
  const [error, setError]     = useState('')
  const [subCount, setSubCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/newsletter')
      .then(r => r.json())
      .then(d => setSubCount((d.subscribers ?? []).length))
      .catch(() => {})
  }, [])

  async function send() {
    if (!subject.trim() || !body.trim()) { setError('Subject and body are required'); return }
    setSending(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/email/blast', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Send failed'); return }
      setResult({ sent: data.sent, total: data.total })
      setSubject(''); setBody('')
    } catch {
      setError('Network error — try again')
    } finally {
      setSending(false)
    }
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 14, padding: '10px 14px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>EMAIL BLAST</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>Send a newsletter to all subscribers</p>
      </div>

      {subCount !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 8, marginBottom: '1.5rem' }}>
          <Users size={14} style={{ color: '#c9a84c' }} />
          <span style={{ fontSize: 13, color: '#c9a84c' }}>{subCount} subscriber{subCount !== 1 ? 's' : ''} on the list</span>
        </div>
      )}

      {result && (
        <div style={{ padding: '14px 16px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.20)', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Send size={14} style={{ color: '#34d399' }} />
          <span style={{ fontSize: 13, color: '#34d399' }}>Sent to {result.sent} of {result.total} subscribers ✓</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, marginBottom: '1.25rem', fontSize: 13, color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Subject *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="New show announced, new music drop…" style={INPUT} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Body *</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your message here. Each paragraph will be a separate block in the email."
            rows={10}
            style={{ ...INPUT, resize: 'vertical', lineHeight: 1.7 }}
          />
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#2a2215' }}>One blank line = paragraph break · plain text, no HTML needed</p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={send}
            disabled={sending || !subject.trim() || !body.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', opacity: (sending || !subject.trim() || !body.trim()) ? 0.5 : 1 }}
          >
            <Send size={14} /> {sending ? 'Sending…' : 'Send to All Subscribers'}
          </button>
        </div>

        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: '#3a2e26', letterSpacing: '0.10em', marginBottom: 6 }}>PREVIEW</div>
          <div style={{ fontSize: 14, color: '#8a7f70', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {body || <span style={{ color: '#2a2215', fontStyle: 'italic' }}>Your message will appear here</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
