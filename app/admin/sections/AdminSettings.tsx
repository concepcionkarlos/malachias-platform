'use client'

import { useState, useEffect } from 'react'
import { LogOut, Download, Info, Shield, Mail, Database, Image as ImageIcon, Map, Users, CheckCircle, XCircle, Send, RefreshCw } from 'lucide-react'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '9px 18px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontWeight: 600 }
const SECTION_HDR: React.CSSProperties = { fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#e8ddd0', marginBottom: 14, fontWeight: 700 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, fontFamily: 'var(--font-body)' }

interface SystemStatus {
  checks: {
    resend: boolean
    resendFrom: string | null
    adminEmail: string | null
    kvConfigured: boolean
    cronSecret: boolean
    fourthwall: boolean
  }
  storage: { ok: boolean; bookingCount: number; subscriberCount: number; backend: string }
  emailMode: 'live' | 'dev-mode'
}

function StatusRow({ ok, label, detail, fix }: { ok: boolean; label: string; detail: string; fix?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        {ok
          ? <CheckCircle size={15} style={{ color: '#34d399' }} />
          : <XCircle size={15} style={{ color: '#c04020' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: ok ? '#e8ddd0' : '#c04020', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8a7f70', lineHeight: 1.5 }}>{detail}</div>
        {!ok && fix && (
          <div style={{ fontSize: 11, color: '#fb923c', marginTop: 4, fontFamily: 'monospace', background: 'rgba(251,146,60,0.08)', padding: '3px 8px', borderRadius: 4, display: 'inline-block' }}>
            Fix: {fix}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, note }: { icon: React.ReactNode; label: string; note: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ color: '#5c5044', flexShrink: 0, marginTop: 1 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#e8ddd0', fontWeight: 600, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8a7f70', lineHeight: 1.5 }}>{note}</div>
      </div>
    </div>
  )
}

export default function AdminSettings() {
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [subscribers, setSubscribers] = useState<{ email: string; joinedAt: string }[]>([])
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [testEmail, setTestEmail] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState<{ ok?: boolean; error?: string; messageId?: string } | null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.subscribers)) setSubscribers(d.subscribers) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/admin/status')
      .then(r => r.json())
      .then(d => { setStatus(d); setStatusLoading(false) })
      .catch(() => setStatusLoading(false))
  }, [])

  async function sendTestEmail() {
    if (!testEmail) return
    setTestSending(true); setTestResult(null)
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: testEmail }),
      })
      const data = await res.json()
      setTestResult(data)
    } catch {
      setTestResult({ error: 'Request failed' })
    } finally { setTestSending(false) }
  }

  function refreshStatus() {
    setStatusLoading(true); setStatus(null)
    fetch('/api/admin/status')
      .then(r => r.json())
      .then(d => { setStatus(d); setStatusLoading(false) })
      .catch(() => setStatusLoading(false))
  }

  async function handleExport() {
    setExporting(true); setExportMsg('')
    try {
      const res = await fetch('/api/content')
      if (!res.ok) throw new Error('Failed to fetch data')
      const data: unknown = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `malachias-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportMsg('Data exported successfully.')
    } catch {
      setExportMsg('Export failed. Try again.')
    } finally { setExporting(false) }
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
    } finally {
      window.location.href = '/admin'
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0', maxWidth: 640 }}>
      <h2 style={{ margin: '0 0 28px', fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, fontWeight: 700 }}>
        SETTINGS
      </h2>

      {/* Password section */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={SECTION_HDR}>PASSWORD</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8 }}>
          <Info size={16} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, color: '#c9a84c', fontWeight: 600, marginBottom: 6 }}>Environment Variable Authentication</div>
            <div style={{ fontSize: 13, color: '#8a7f70', lineHeight: 1.6 }}>
              The admin password is set via the <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>ADMIN_PASSWORD</code> environment variable.
            </div>
            <div style={{ fontSize: 13, color: '#8a7f70', lineHeight: 1.6, marginTop: 6 }}>
              To change it: go to your <strong style={{ color: '#e8ddd0' }}>Vercel project settings</strong> → Environment Variables → update <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>ADMIN_PASSWORD</code> → redeploy.
            </div>
          </div>
        </div>
      </div>

      {/* Live System Status */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={SECTION_HDR}>SYSTEM STATUS</div>
          <button onClick={refreshStatus} disabled={statusLoading}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5044', padding: 4 }}>
            <RefreshCw size={13} style={{ animation: statusLoading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {statusLoading ? (
          <div style={{ color: '#5c5044', fontSize: 13 }}>Checking status…</div>
        ) : !status ? (
          <div style={{ color: '#c04020', fontSize: 13 }}>Could not fetch status.</div>
        ) : (
          <>
            {/* Storage status */}
            <StatusRow
              ok={status.storage.ok}
              label={`Storage — ${status.storage.backend}`}
              detail={status.storage.ok
                ? `${status.storage.bookingCount} bookings · ${status.storage.subscriberCount} subscribers`
                : 'Storage read failed'}
              fix={!status.checks.kvConfigured ? 'Add KV_REST_API_URL + KV_REST_API_TOKEN in Vercel → Storage → Create KV' : undefined}
            />
            <StatusRow
              ok={status.checks.kvConfigured}
              label="Vercel KV (persistent storage)"
              detail={status.checks.kvConfigured
                ? 'KV_REST_API_URL is set — data persists across deploys'
                : 'Not configured — bookings & data may be lost on redeploy. Set up Vercel KV.'}
              fix={!status.checks.kvConfigured ? 'Vercel Dashboard → Project → Storage → Create KV Store → Connect' : undefined}
            />
            <StatusRow
              ok={status.checks.resend}
              label={`Email — ${status.emailMode === 'live' ? 'LIVE (sending)' : 'DEV MODE (silenced)'}`}
              detail={status.checks.resend
                ? `Sending from: ${status.checks.resendFrom ?? 'default'} · Admin alerts to: ${status.checks.adminEmail ?? 'contactEmail fallback'}`
                : 'RESEND_API_KEY not set — all emails are silently dropped. Booking confirmations and drip campaigns are NOT working.'}
              fix={!status.checks.resend ? 'Add RESEND_API_KEY in Vercel env vars' : undefined}
            />
            {status.checks.resend && !status.checks.resendFrom && (
              <StatusRow
                ok={false}
                label="Email FROM address"
                detail="RESEND_FROM_EMAIL not set — using booking@malachiasmusic.com which requires verified domain"
                fix="Add RESEND_FROM_EMAIL=onboarding@resend.dev (test) or your verified domain"
              />
            )}
            <StatusRow
              ok={!!status.checks.adminEmail}
              label="Admin notification email"
              detail={status.checks.adminEmail
                ? `Booking alerts go to: ${status.checks.adminEmail}`
                : 'ADMIN_NOTIFY_EMAIL not set — admin alerts go to contactEmail from site content'}
              fix={!status.checks.adminEmail ? 'Add ADMIN_NOTIFY_EMAIL=your@email.com in Vercel' : undefined}
            />
            <StatusRow
              ok={status.checks.cronSecret}
              label="Cron secret"
              detail={status.checks.cronSecret ? 'CRON_SECRET set — drip cron is secured' : 'CRON_SECRET not set — /api/cron/drip is publicly accessible (low risk, add for safety)'}
            />
            <StatusRow
              ok={status.checks.fourthwall}
              label="Fourthwall (merch)"
              detail={status.checks.fourthwall ? 'FOURTHWALL_STOREFRONT_TOKEN configured' : 'Not configured'}
            />

            {/* Alert banner if critical issues */}
            {(!status.checks.resend || !status.checks.kvConfigured) && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(192,64,32,0.10)', border: '1px solid rgba(192,64,32,0.25)', borderRadius: 8, fontSize: 13, color: '#fb923c', lineHeight: 1.6 }}>
                <strong style={{ color: '#c04020' }}>Action required.</strong> Scroll down for setup instructions.
              </div>
            )}
          </>
        )}
      </div>

      {/* Test email */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={SECTION_HDR}>TEST EMAIL</div>
        <div style={{ fontSize: 12, color: '#5c5044', marginBottom: 14 }}>
          Send a test email to verify Resend is configured correctly.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            style={{ ...INPUT, width: 260 }}
          />
          <button onClick={sendTestEmail} disabled={testSending || !testEmail}
            style={{ ...BTN, background: '#c9a84c', color: '#070707', opacity: (testSending || !testEmail) ? 0.6 : 1 }}>
            <Send size={13} /> {testSending ? 'Sending…' : 'Send Test'}
          </button>
        </div>
        {testResult && (
          <div style={{ marginTop: 10, fontSize: 13, color: testResult.ok ? '#34d399' : '#c04020', lineHeight: 1.5 }}>
            {testResult.ok
              ? `✓ Email sent successfully. Check your inbox. (ID: ${testResult.messageId})`
              : `✗ ${testResult.error}`}
          </div>
        )}
      </div>

      {/* Setup instructions */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={SECTION_HDR}>SETUP INSTRUCTIONS</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.10em', marginBottom: 8 }}>1 — VERCEL KV (STORAGE)</div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#8a7f70', lineHeight: 2 }}>
            <li>Go to <strong style={{ color: '#e8ddd0' }}>vercel.com</strong> → your project → <strong style={{ color: '#e8ddd0' }}>Storage</strong> tab</li>
            <li>Click <strong style={{ color: '#e8ddd0' }}>Create</strong> → select <strong style={{ color: '#e8ddd0' }}>KV</strong></li>
            <li>Name it <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 3, fontFamily: 'monospace' }}>malachias-db</code></li>
            <li>Click <strong style={{ color: '#e8ddd0' }}>Connect to Project</strong> — env vars are added automatically</li>
            <li>Redeploy the project</li>
          </ol>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.10em', marginBottom: 8 }}>2 — RESEND (EMAIL)</div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#8a7f70', lineHeight: 2 }}>
            <li>Create a free account at <strong style={{ color: '#e8ddd0' }}>resend.com</strong></li>
            <li>Go to <strong style={{ color: '#e8ddd0' }}>API Keys</strong> → Create Key → copy it</li>
            <li>In Vercel: Project → <strong style={{ color: '#e8ddd0' }}>Settings → Environment Variables</strong> → add:</li>
          </ol>
          <div style={{ marginLeft: 18, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['RESEND_API_KEY', 're_xxxxxxxxxxxxxxxxxxxxxxxx'],
              ['RESEND_FROM_EMAIL', 'onboarding@resend.dev  (or your verified domain later)'],
              ['ADMIN_NOTIFY_EMAIL', 'concepcionkarlos@gmail.com'],
              ['CRON_SECRET', 'any-random-string-you-choose'],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
                <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 3, fontFamily: 'monospace', color: '#a78bfa', flexShrink: 0 }}>{key}</code>
                <span style={{ color: '#5c5044' }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ marginLeft: 18, marginTop: 10, fontSize: 12, color: '#5c5044', lineHeight: 1.6 }}>
            <strong style={{ color: '#fb923c' }}>Note:</strong> <code style={{ fontFamily: 'monospace', fontSize: 11 }}>onboarding@resend.dev</code> works immediately without domain verification (max 100 emails/day on free plan). To use <code style={{ fontFamily: 'monospace', fontSize: 11 }}>booking@malachiasmusic.com</code> later, verify the domain in Resend → Domains.
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.10em', marginBottom: 8 }}>3 — REDEPLOY</div>
          <div style={{ fontSize: 13, color: '#8a7f70', lineHeight: 1.6 }}>
            After adding env vars, go to Vercel → <strong style={{ color: '#e8ddd0' }}>Deployments</strong> → click the latest → <strong style={{ color: '#e8ddd0' }}>Redeploy</strong>. Then come back here and click Refresh Status to verify.
          </div>
        </div>
      </div>

      {/* Subscribers */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Users size={15} style={{ color: '#c9a84c' }} />
          <div style={SECTION_HDR}>BROTHERHOOD LIST</div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#c9a84c', background: 'rgba(201,168,76,0.10)', padding: '2px 10px', borderRadius: 20 }}>
            {subscribers.length}
          </span>
        </div>
        {subscribers.length === 0 ? (
          <p style={{ fontSize: 13, color: '#5c5044' }}>No subscribers yet.</p>
        ) : (
          <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...subscribers].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).map(s => (
              <div key={s.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                <span style={{ color: '#e8ddd0' }}>{s.email}</span>
                <span style={{ color: '#5c5044', fontSize: 11 }}>{new Date(s.joinedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            const csv = 'Email,Joined\n' + subscribers.map(s => `${s.email},${s.joinedAt}`).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'subscribers.csv'
            document.body.appendChild(a); a.click()
            document.body.removeChild(a); URL.revokeObjectURL(url)
          }}
          disabled={subscribers.length === 0}
          style={{ ...BTN, marginTop: 14, background: 'rgba(255,255,255,0.04)', color: '#8a7f70', border: '1px solid rgba(255,255,255,0.08)', opacity: subscribers.length === 0 ? 0.4 : 1 }}
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Export */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={SECTION_HDR}>DATA EXPORT</div>
        <div style={{ fontSize: 13, color: '#8a7f70', marginBottom: 14, lineHeight: 1.5 }}>
          Download a full JSON snapshot of all site content, bookings, shows, venues, and templates.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleExport} disabled={exporting}
            style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#e8ddd0', border: '1px solid rgba(255,255,255,0.1)', opacity: exporting ? 0.7 : 1 }}>
            <Download size={14} /> {exporting ? 'Exporting…' : 'Export All Data'}
          </button>
          {exportMsg && (
            <span style={{ fontSize: 12, color: exportMsg.includes('fail') ? '#c04020' : '#34d399' }}>
              {exportMsg}
            </span>
          )}
        </div>
      </div>

      {/* Logout */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div style={SECTION_HDR}>SESSION</div>
        <div style={{ fontSize: 13, color: '#8a7f70', marginBottom: 14 }}>
          Sign out of the admin panel. You&apos;ll be redirected to the login page.
        </div>
        <button onClick={handleLogout} disabled={loggingOut}
          style={{ ...BTN, background: 'rgba(192,64,32,0.15)', color: '#c04020', border: '1px solid rgba(192,64,32,0.3)', opacity: loggingOut ? 0.7 : 1 }}>
          <LogOut size={14} /> {loggingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
