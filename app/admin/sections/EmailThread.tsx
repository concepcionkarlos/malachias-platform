'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronUp, AlertCircle, Mail } from 'lucide-react'

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 7,
  overflow: 'hidden',
}

export interface ThreadMessage {
  id: string
  direction: 'sent' | 'received'
  subject: string
  counterparty: string   // "to" when sent, "from" when received
  timestamp: string      // ISO
  status?: 'sent' | 'failed'
  bodyHtml?: string
  bodyText?: string
}

function fmtTs(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function MessageCard({ msg }: { msg: ThreadMessage }) {
  const [open, setOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isSent = msg.direction === 'sent'

  function handleOpen() {
    setOpen(o => {
      const next = !o
      if (next && msg.bodyHtml && iframeRef.current) {
        const doc = iframeRef.current.contentDocument
        if (doc) {
          doc.open()
          doc.write(`<html><head><style>body{margin:0;padding:16px;background:#fff;font-family:sans-serif;font-size:14px;line-height:1.6;}a{color:#0066cc;}</style></head><body>${msg.bodyHtml}</body></html>`)
          doc.close()
        }
      }
      return next
    })
  }

  return (
    <div style={CARD}>
      <button
        onClick={handleOpen}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
          textAlign: 'left', fontFamily: 'var(--font-body)',
        }}
      >
        {/* Direction icon */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isSent ? 'rgba(201,168,76,0.12)' : 'rgba(96,165,250,0.12)',
        }}>
          {isSent
            ? <ArrowUpRight size={13} style={{ color: '#c9a84c' }} />
            : <ArrowDownLeft size={13} style={{ color: '#60a5fa' }} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              {/* SENT / RECEIVED badge */}
              <span style={{
                fontSize: 9, letterSpacing: '0.14em', fontWeight: 700,
                color: isSent ? '#c9a84c' : '#60a5fa',
                textTransform: 'uppercase', marginBottom: 3, display: 'block',
              }}>
                {isSent ? '↑ Sent' : '↓ Received'}
                {msg.status === 'failed' && (
                  <span style={{ marginLeft: 6, color: '#c04020' }}>
                    <AlertCircle size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> Failed
                  </span>
                )}
              </span>
              <div style={{
                fontSize: 13, color: '#e8ddd0', fontWeight: 600,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {msg.subject}
              </div>
              <div style={{ fontSize: 11, color: '#5c5044', marginTop: 2 }}>
                {isSent ? 'To' : 'From'}: {msg.counterparty}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#3a3228' }}>{fmtTs(msg.timestamp)}</span>
              {open
                ? <ChevronUp size={12} style={{ color: '#5c5044' }} />
                : <ChevronDown size={12} style={{ color: '#5c5044' }} />}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {msg.bodyHtml ? (
            <iframe
              ref={iframeRef}
              title="Email body"
              style={{ width: '100%', height: 440, border: 'none', display: 'block', background: '#fff' }}
              sandbox="allow-same-origin"
            />
          ) : msg.bodyText ? (
            <div style={{
              padding: '14px 16px', fontSize: 13, color: '#8a7f70',
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {msg.bodyText}
            </div>
          ) : (
            <div style={{ padding: '14px 16px', fontSize: 13, color: '#3a3228' }}>No body content.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EmailThread({
  messages,
  loading,
}: {
  messages: ThreadMessage[]
  loading?: boolean
}) {
  if (loading) {
    return <div style={{ color: '#3a3228', fontSize: 13, padding: '20px 0' }}>Loading emails…</div>
  }

  if (messages.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Mail size={28} style={{ color: '#2a2215', display: 'block', margin: '0 auto 10px' }} />
        <div style={{ fontSize: 13, color: '#3a3228' }}>No emails yet.</div>
      </div>
    )
  }

  const sorted = [...messages].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, color: '#3a3228', letterSpacing: '0.08em', marginBottom: 4 }}>
        {messages.length} message{messages.length !== 1 ? 's' : ''} —{' '}
        {messages.filter(m => m.direction === 'sent').length} sent,{' '}
        {messages.filter(m => m.direction === 'received').length} received
      </div>
      {sorted.map(msg => <MessageCard key={msg.id} msg={msg} />)}
    </div>
  )
}
