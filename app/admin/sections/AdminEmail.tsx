'use client'

// Admin section — Email client: a Gmail-style inbox/sent mailbox for booking@malachiasmusic.com.
// Reads inbound and sent mail from the API, lets you read messages (sandboxed iframe body),
// mark read / mark-all-read, delete, compose new mail, and reply; includes deep links to Gmail.

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mail, MailOpen, Send, Trash2, Pencil, X, RefreshCw, Inbox, CheckCheck, ExternalLink } from 'lucide-react'
import type { InboundEmail, SentEmail } from '@/lib/data'

type Folder = 'inbox' | 'sent'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTs(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 7 * 86_400_000) return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtFull(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

const GMAIL_INBOX_URL = 'https://mail.google.com/mail/u/0/#search/to%3Abooking%40malachiasmusic.com'

function gmailSearchUrl(fromEmail: string, subject: string) {
  return `https://mail.google.com/mail/u/0/#search/from%3A${encodeURIComponent(fromEmail)}+subject%3A${encodeURIComponent(subject)}`
}

const S = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 } as React.CSSProperties,
  btn: (variant: 'gold' | 'ghost' | 'danger' = 'ghost'): React.CSSProperties => ({
    border: variant === 'ghost' ? '1px solid rgba(255,255,255,0.12)' : 'none',
    cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 12,
    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)',
    background: variant === 'gold' ? '#c9a84c' : variant === 'danger' ? 'rgba(192,64,32,0.15)' : 'transparent',
    color: variant === 'gold' ? '#070707' : variant === 'danger' ? '#ef4444' : '#8a7f70',
    fontWeight: variant === 'gold' ? 700 : 400,
  }),
}

// ── Compose Window ────────────────────────────────────────────────────────────

interface ComposeProps {
  onClose: () => void
  onSent: (email: SentEmail) => void
  defaultTo?: string
  defaultSubject?: string
}

function ComposeWindow({ onClose, onSent, defaultTo = '', defaultSubject = '' }: ComposeProps) {
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!to || !subject || !body) { setError('Fill in all fields'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: to, subject, bodyText: body }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Failed to send'); return }
      onSent({ id: d.id, toEmail: to, subject, bodyHtml: '', bodyText: body, sentAt: new Date().toISOString(), status: 'sent' })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error sending')
    } finally {
      setSending(false)
    }
  }

  const INPUT: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#e8ddd0', fontSize: 13, padding: '8px 0', outline: 'none', fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 24, width: 480, zIndex: 200,
      background: '#141010', border: '1px solid rgba(255,255,255,0.12)',
      borderBottom: 'none', borderRadius: '8px 8px 0 0',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
    }}>
      {/* Header */}
      <div style={{ background: '#1e1812', padding: '10px 16px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'default' }}>
        <span style={{ fontSize: 13, color: '#c9a84c', fontWeight: 600, letterSpacing: '0.04em' }}>New Message</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 2 }}>
          <X size={15} />
        </button>
      </div>

      <div style={{ padding: '0 16px' }}>
        <input
          value={to} onChange={e => setTo(e.target.value)}
          placeholder="To"
          style={INPUT}
        />
        <input
          value={subject} onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          style={INPUT}
        />
        <textarea
          value={body} onChange={e => setBody(e.target.value)}
          placeholder="Write your message..."
          rows={10}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            color: '#e8ddd0', fontSize: 13, padding: '12px 0', outline: 'none',
            fontFamily: 'var(--font-body)', resize: 'none', lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ padding: '10px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={handleSend} disabled={sending} style={{ ...S.btn('gold'), opacity: sending ? 0.7 : 1 }}>
          <Send size={13} /> {sending ? 'Sending…' : 'Send'}
        </button>
        {error && <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#3a2e26' }}>
          From: booking@malachiasmusic.com
        </span>
      </div>
    </div>
  )
}

// ── Email Row ─────────────────────────────────────────────────────────────────

function InboxRow({ email, selected, onClick }: { email: InboundEmail; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: selected ? 'rgba(201,168,76,0.07)' : 'transparent',
        borderLeft: selected ? '3px solid #c9a84c' : '3px solid transparent',
        display: 'flex', flexDirection: 'column', gap: 3,
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!email.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />}
          <span style={{ fontSize: 13, color: email.read ? '#8a7f70' : '#e8ddd0', fontWeight: email.read ? 400 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
            {email.fromName ?? email.fromEmail}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#3a2e26', flexShrink: 0 }}>{fmtTs(email.receivedAt)}</span>
      </div>
      <span style={{ fontSize: 12, color: '#5c5044', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {email.subject}
      </span>
    </div>
  )
}

function SentRow({ email, selected, onClick }: { email: SentEmail; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: selected ? 'rgba(201,168,76,0.07)' : 'transparent',
        borderLeft: selected ? '3px solid #c9a84c' : '3px solid transparent',
        display: 'flex', flexDirection: 'column', gap: 3,
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8a7f70', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
          To: {email.toEmail}
        </span>
        <span style={{ fontSize: 11, color: '#3a2e26', flexShrink: 0 }}>{fmtTs(email.sentAt)}</span>
      </div>
      <span style={{ fontSize: 12, color: '#5c5044', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {email.subject}
      </span>
    </div>
  )
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function EmailBody({ html, text }: { html?: string; text?: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const content = (html && html.trim()) ? html : (text && text.trim()) ? `<pre style="font-family:Arial,sans-serif;font-size:14px;line-height:1.75;white-space:pre-wrap;word-break:break-word;color:#333;margin:0;padding:24px;">${text}</pre>` : '<p style="color:#aaa;font-family:Arial,sans-serif;padding:24px;font-size:14px;">El contenido de este email está en Gmail. Usa el botón <strong>Ver en Gmail</strong> de arriba para leerlo.</p>'

  useEffect(() => {
    const iframe = ref.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(content)
    doc.close()
    // Auto-height after content loads
    setTimeout(() => {
      if (iframe.contentDocument?.body) {
        iframe.style.height = `${iframe.contentDocument.body.scrollHeight + 32}px`
      }
    }, 100)
  }, [content])

  return (
    <iframe
      ref={ref}
      style={{ width: '100%', border: 'none', minHeight: 400, background: '#fff', borderRadius: 6 }}
      sandbox="allow-same-origin"
      title="email-body"
    />
  )
}

function InboxDetail({ email, onDelete, onReply }: { email: InboundEmail; onDelete: () => void; onReply: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 16, color: '#e8ddd0', fontWeight: 600 }}>{email.subject}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, color: '#c9a84c' }}>
              {email.fromName ? `${email.fromName} <${email.fromEmail}>` : email.fromEmail}
            </div>
            <div style={{ fontSize: 11, color: '#3a2e26', marginTop: 2 }}>
              To: {email.toEmail} · {fmtFull(email.receivedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onReply} style={S.btn('gold')}>
              <Pencil size={12} /> Reply
            </button>
            <a
              href={gmailSearchUrl(email.fromEmail, email.subject)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...S.btn(), textDecoration: 'none' }}
            >
              <ExternalLink size={12} /> Ver en Gmail
            </a>
            <button onClick={onDelete} style={S.btn('danger')}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <EmailBody html={email.bodyHtml} text={email.bodyText} />
      </div>
    </div>
  )
}

function SentDetail({ email, onDelete }: { email: SentEmail; onDelete: () => void }) {

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: '#e8ddd0', fontWeight: 600 }}>{email.subject}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, color: '#8a7f70' }}>To: {email.toEmail}</div>
            <div style={{ fontSize: 11, color: '#3a2e26', marginTop: 2 }}>{fmtFull(email.sentAt)}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {email.status === 'failed' && (
              <span style={{ fontSize: 11, color: '#ef4444', padding: '4px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 99 }}>
                FAILED
              </span>
            )}
            <button onClick={onDelete} style={S.btn('danger')}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <EmailBody html={email.bodyHtml} text={email.bodyText} />
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AdminEmail() {
  const [folder, setFolder] = useState<Folder>('inbox')
  const [inbox, setInbox] = useState<InboundEmail[]>([])
  const [sent, setSent] = useState<SentEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInbox, setSelectedInbox] = useState<InboundEmail | null>(null)
  const [selectedSent, setSelectedSent] = useState<SentEmail | null>(null)
  const [composing, setComposing] = useState(false)
  const [replyDefaults, setReplyDefaults] = useState<{ to: string; subject: string }>({ to: '', subject: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const [inboxRes, sentRes] = await Promise.all([
      fetch('/api/inbound-emails').then(r => r.json()),
      fetch('/api/email/sent').then(r => r.json()),
    ])
    const sortedInbox = [...(inboxRes as InboundEmail[])].sort((a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    )
    const sortedSent = [...(sentRes as SentEmail[])].sort((a, b) =>
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    )
    setInbox(sortedInbox)
    setSent(sortedSent)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function selectInboxEmail(email: InboundEmail) {
    setSelectedInbox(email)
    setSelectedSent(null)
    if (!email.read) {
      await fetch(`/api/inbound-emails/${email.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) })
      setInbox(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e))
    }
  }

  async function deleteInboxEmail(id: string) {
    await fetch(`/api/inbound-emails/${id}`, { method: 'DELETE' })
    setInbox(prev => prev.filter(e => e.id !== id))
    setSelectedInbox(null)
  }

  async function deleteSentEmail(id: string) {
    await fetch('/api/email/sent', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSent(prev => prev.filter(e => e.id !== id))
    setSelectedSent(null)
  }

  async function markAllRead() {
    await fetch('/api/inbound-emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'mark-all-read' }) })
    setInbox(prev => prev.map(e => ({ ...e, read: true })))
  }

  function openReply(email: InboundEmail) {
    setReplyDefaults({
      to: email.fromEmail,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
    })
    setComposing(true)
  }

  function openCompose() {
    setReplyDefaults({ to: '', subject: '' })
    setComposing(true)
  }

  const unread = inbox.filter(e => !e.read).length

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 110px)', gap: 0, minWidth: 0 }}>

      {/* Left sidebar */}
      <div style={{
        width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4,
        paddingRight: 16, borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={openCompose}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
            background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 20,
            cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)',
            marginBottom: 12,
          }}
        >
          <Pencil size={13} /> Compose
        </button>

        {([
          { key: 'inbox', label: 'Inbox', icon: Inbox, count: unread },
          { key: 'sent', label: 'Sent', icon: Send, count: 0 },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => { setFolder(key); setSelectedInbox(null); setSelectedSent(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: folder === key ? 'rgba(201,168,76,0.10)' : 'transparent',
              color: folder === key ? '#c9a84c' : '#5c5044',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontFamily: 'var(--font-body)', textAlign: 'left', width: '100%',
              fontWeight: folder === key ? 600 : 400,
            }}
          >
            <Icon size={14} />
            {label}
            {count > 0 && (
              <span style={{ marginLeft: 'auto', background: '#c9a84c', color: '#070707', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>
                {count}
              </span>
            )}
          </button>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={load} style={{ ...S.btn(), justifyContent: 'center', width: '100%' }}>
            <RefreshCw size={12} /> Refresh
          </button>
          {folder === 'inbox' && unread > 0 && (
            <button onClick={markAllRead} style={{ ...S.btn(), justifyContent: 'center', width: '100%', fontSize: 11 }}>
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Email list */}
      <div style={{
        width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto',
      }}>
        {/* Gmail banner — always shown in inbox */}
        {!loading && folder === 'inbox' && (
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(201,168,76,0.06)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Mail size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#8a7f70', flex: 1, lineHeight: 1.4 }}>
              Emails nuevos llegan a tu Gmail
            </span>
            <a
              href={GMAIL_INBOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#c9a84c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}
            >
              Abrir <ExternalLink size={10} />
            </a>
          </div>
        )}

        {loading ? (
          <div style={{ padding: 20, color: '#3a2e26', fontSize: 13 }}>Loading…</div>
        ) : folder === 'inbox' ? (
          inbox.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>
              <Mail size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
              <div style={{ marginBottom: 12 }}>Inbox is empty</div>
              <a
                href={GMAIL_INBOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: '#c9a84c', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <ExternalLink size={12} /> Ver en Gmail
              </a>
            </div>
          ) : inbox.map(email => (
            <InboxRow
              key={email.id}
              email={email}
              selected={selectedInbox?.id === email.id}
              onClick={() => selectInboxEmail(email)}
            />
          ))
        ) : (
          sent.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>
              <Send size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
              No sent emails
            </div>
          ) : sent.map(email => (
            <SentRow
              key={email.id}
              email={email}
              selected={selectedSent?.id === email.id}
              onClick={() => { setSelectedSent(email); setSelectedInbox(null) }}
            />
          ))
        )}
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {selectedInbox ? (
          <InboxDetail
            email={selectedInbox}
            onDelete={() => deleteInboxEmail(selectedInbox.id)}
            onReply={() => openReply(selectedInbox)}
          />
        ) : selectedSent ? (
          <SentDetail
            email={selectedSent}
            onDelete={() => deleteSentEmail(selectedSent.id)}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: '#3a2e26' }}>
            {folder === 'inbox' ? <MailOpen size={40} style={{ opacity: 0.2 }} /> : <Send size={40} style={{ opacity: 0.2 }} />}
            <span style={{ fontSize: 13 }}>Select an email to read</span>
          </div>
        )}
      </div>

      {/* Compose window */}
      {composing && (
        <ComposeWindow
          onClose={() => setComposing(false)}
          onSent={newEmail => { setSent(prev => [newEmail, ...prev]); if (folder === 'sent') setSelectedSent(newEmail) }}
          defaultTo={replyDefaults.to}
          defaultSubject={replyDefaults.subject}
        />
      )}
    </div>
  )
}
