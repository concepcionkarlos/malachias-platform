'use client'

import { useEffect, useState, useRef } from 'react'
import { Trash2, CheckCheck, Mail, MailOpen } from 'lucide-react'
import type { InboundEmail } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }

function fmtTs(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

function fmtFull(ts: string) {
  return new Date(ts).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function EntityBadge({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  if (!entityType || !entityId) return null
  const colorMap: Record<string, string> = { booking: '#c9a84c', venue: '#60a5fa', 'song-request': '#a78bfa' }
  const color = colorMap[entityType] ?? '#8a7f70'
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: color + '1a', color, border: `1px solid ${color}44`, letterSpacing: '0.06em' }}>
      {entityType === 'booking' ? 'Booking' : entityType === 'venue' ? 'Venue' : 'Song Request'} #{entityId.slice(-6)}
    </span>
  )
}

export default function AdminInbox() {
  const [emails, setEmails] = useState<InboundEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<InboundEmail|null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    fetch('/api/inbound-emails')
      .then(r => r.json())
      .then((d: InboundEmail[]) => {
        const sorted = [...d].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
        setEmails(sorted); setLoading(false)
      })
      .catch(() => { setError('Failed to load inbox'); setLoading(false) })
  }, [])

  // Update iframe when selected email body changes
  useEffect(() => {
    if (!selected || !iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    if (selected.bodyHtml) {
      doc.open()
      doc.write(`<html><head><style>body{background:#0a0a0a;color:#e8ddd0;font-family:sans-serif;padding:16px;margin:0;font-size:14px;line-height:1.6;}a{color:#60a5fa;}</style></head><body>${selected.bodyHtml}</body></html>`)
      doc.close()
    }
  }, [selected?.id, selected?.bodyHtml]) // eslint-disable-line react-hooks/exhaustive-deps

  async function markRead(id: string) {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e))
    if (selected?.id === id) setSelected(s => s ? { ...s, read: true } : null)
    await fetch(`/api/inbound-emails/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
  }

  async function deleteEmail(id: string) {
    setEmails(prev => prev.filter(e => e.id !== id))
    if (selected?.id === id) setSelected(null)
    await fetch(`/api/inbound-emails/${id}`, { method: 'DELETE' })
  }

  async function markAllRead() {
    setMarkingAll(true)
    try {
      await fetch('/api/inbound-emails', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-all-read' }),
      })
      setEmails(prev => prev.map(e => ({ ...e, read: true })))
      if (selected) setSelected(s => s ? { ...s, read: true } : null)
    } finally { setMarkingAll(false) }
  }

  async function selectEmail(email: InboundEmail) {
    setSelected(email)
    if (!email.read) await markRead(email.id)
  }

  const unreadCount = emails.filter(e => !e.read).length

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading inbox…</div>
  if (error) return <div style={{ color: '#c04020', padding: 40, textAlign: 'center' }}>{error}</div>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, fontWeight: 700 }}>
            INBOX
          </h2>
          {unreadCount > 0 && (
            <span style={{ background: '#c9a84c', color: '#070707', borderRadius: 99, fontSize: 11, fontWeight: 700, padding: '2px 8px', minWidth: 20, textAlign: 'center' }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} disabled={markingAll}
            style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#8a7f70', fontSize: 12 }}>
            <CheckCheck size={13} /> {markingAll ? 'Marking…' : 'Mark All Read'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left — Email list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, ...CARD, overflow: 'hidden' }}>
          {emails.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5c5044' }}>
              <Mail size={32} style={{ color: '#2a2a2a', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
              No emails yet.
            </div>
          ) : (
            emails.map((email, i) => (
              <div key={email.id}
                onClick={() => selectEmail(email)}
                style={{
                  padding: '12px 16px',
                  borderBottom: i < emails.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: 'pointer',
                  background: selected?.id === email.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                  borderLeft: selected?.id === email.id ? '3px solid #c9a84c' : '3px solid transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (selected?.id !== email.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (selected?.id !== email.id) e.currentTarget.style.background = 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      {!email.read && (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9a84c', flexShrink: 0, display: 'inline-block' }} />
                      )}
                      <span style={{ fontSize: 13, fontWeight: email.read ? 400 : 700, color: email.read ? '#8a7f70' : '#e8ddd0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {email.fromName || email.fromEmail}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: email.read ? '#5c5044' : '#e8ddd0', fontWeight: email.read ? 400 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {email.subject}
                    </div>
                    {email.entityType && (
                      <div style={{ marginTop: 4 }}>
                        <EntityBadge entityType={email.entityType} entityId={email.entityId} />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#5c5044', flexShrink: 0 }}>{fmtTs(email.receivedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right — Email detail */}
        {selected ? (
          <div style={{ ...CARD, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, color: '#e8ddd0', fontWeight: 700, lineHeight: 1.3 }}>{selected.subject}</h3>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {!selected.read && (
                    <button onClick={() => markRead(selected.id)}
                      style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#8a7f70', padding: '5px 10px', fontSize: 12 }}>
                      <MailOpen size={12} /> Mark Read
                    </button>
                  )}
                  <button onClick={() => deleteEmail(selected.id)}
                    style={{ ...BTN, background: 'rgba(192,64,32,0.15)', color: '#c04020', border: '1px solid rgba(192,64,32,0.3)', padding: '5px 10px' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#5c5044' }}>From: </span>
                  <span style={{ color: '#e8ddd0' }}>{selected.fromName ? `${selected.fromName} <${selected.fromEmail}>` : selected.fromEmail}</span>
                </div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#5c5044' }}>To: </span>
                  <span style={{ color: '#8a7f70' }}>{selected.toEmail}</span>
                </div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#5c5044' }}>Date: </span>
                  <span style={{ color: '#8a7f70' }}>{fmtFull(selected.receivedAt)}</span>
                </div>
                {selected.entityType && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ color: '#5c5044', fontSize: 12, marginRight: 8 }}>Linked to:</span>
                    <EntityBadge entityType={selected.entityType} entityId={selected.entityId} />
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            {selected.bodyHtml ? (
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden' }}>
                <iframe
                  ref={iframeRef}
                  title="Email body"
                  style={{ width: '100%', height: 480, border: 'none', display: 'block' }}
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div style={{ fontSize: 14, color: '#e8ddd0', lineHeight: 1.7, whiteSpace: 'pre-wrap', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                {selected.bodyText || <span style={{ color: '#5c5044' }}>No content.</span>}
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...CARD, padding: '60px 20px', textAlign: 'center' }}>
            <Mail size={36} style={{ color: '#2a2a2a', display: 'block', margin: '0 auto 14px' }} />
            <div style={{ color: '#5c5044', fontSize: 13 }}>Select an email to read it.</div>
          </div>
        )}
      </div>
    </div>
  )
}
