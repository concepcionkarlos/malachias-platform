'use client'

import { useState, useEffect } from 'react'
import { LogOut, Download, Info, Shield, Mail, Database, Image as ImageIcon, Map, Users } from 'lucide-react'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '9px 18px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontWeight: 600 }
const SECTION_HDR: React.CSSProperties = { fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#e8ddd0', marginBottom: 14, fontWeight: 700 }

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

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.subscribers)) setSubscribers(d.subscribers) })
      .catch(() => {})
  }, [])

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

      {/* Environment status */}
      <div style={{ ...CARD, padding: '20px 24px', marginBottom: 20 }}>
        <div style={SECTION_HDR}>ENVIRONMENT STATUS</div>
        <div style={{ fontSize: 12, color: '#5c5044', marginBottom: 14, lineHeight: 1.5 }}>
          These features are active when the corresponding environment variable is configured in Vercel.
        </div>
        <InfoRow
          icon={<Mail size={15} />}
          label="Email (Resend)"
          note="Active when RESEND_API_KEY is set. Used for booking confirmations, venue outreach, and all outbound email."
        />
        <InfoRow
          icon={<Database size={15} />}
          label="Storage (Vercel KV)"
          note="Active when KV_REST_API_URL and KV_REST_API_TOKEN are set. Stores all bookings, shows, venues, and content."
        />
        <InfoRow
          icon={<ImageIcon size={15} />}
          label="Blob Uploads"
          note="Active when BLOB_READ_WRITE_TOKEN is set. Used for media uploads in the gallery and merch images."
        />
        <InfoRow
          icon={<Map size={15} />}
          label="Google Places API"
          note="Active when GOOGLE_PLACES_API_KEY is set. Powers the Venue Finder search feature."
        />
        <div style={{ paddingTop: 4 }}>
          <InfoRow
            icon={<Shield size={15} />}
            label="Admin Auth"
            note="Active when ADMIN_PASSWORD is set. Without it, the admin panel is unauthenticated — always set this in production."
          />
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
    </div>
  )
}
