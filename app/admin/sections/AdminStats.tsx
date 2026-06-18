'use client'

// Admin section — Band Stats editor: form to manually enter and save streaming/social
// metrics (Spotify, Instagram, Facebook, YouTube, TikTok) plus free-form notes.
// Loads and persists via /api/stats.

import { useState, useEffect } from 'react'
import { Save, TrendingUp } from 'lucide-react'
import type { BandStats } from '@/lib/data'

const FIELDS: { key: keyof BandStats; label: string; platform: string; color: string }[] = [
  { key: 'spotifyMonthlyListeners', label: 'Monthly Listeners',    platform: 'Spotify',    color: '#1db954' },
  { key: 'spotifyFollowers',        label: 'Followers',            platform: 'Spotify',    color: '#1db954' },
  { key: 'instagramFollowers',      label: 'Followers',            platform: 'Instagram',  color: '#e1306c' },
  { key: 'instagramAvgReach',       label: 'Avg Post Reach',       platform: 'Instagram',  color: '#e1306c' },
  { key: 'facebookFollowers',       label: 'Followers',            platform: 'Facebook',   color: '#1877f2' },
  { key: 'youtubeSubscribers',      label: 'Subscribers',          platform: 'YouTube',    color: '#ff0000' },
  { key: 'youtubeViews',            label: 'Total Views',          platform: 'YouTube',    color: '#ff0000' },
  { key: 'tiktokFollowers',         label: 'Followers',            platform: 'TikTok',     color: '#69c9d0' },
]

export default function AdminStats() {
  const [stats, setStats]   = useState<Partial<BandStats>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d ?? {}); setLoading(false) })
  }, [])

  async function save() {
    setSaving(true)
    const updated = await fetch('/api/stats', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    }).then(r => r.json())
    setStats(updated)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 14, padding: '10px 14px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const platforms = ['Spotify', 'Instagram', 'Facebook', 'YouTube', 'TikTok']

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>BAND STATS</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>
          Manually update streaming & social numbers
          {stats.updatedAt && ` · Last updated ${new Date(stats.updatedAt).toLocaleDateString()}`}
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {platforms.map(platform => {
              const platformFields = FIELDS.filter(f => f.platform === platform)
              const color = platformFields[0]?.color ?? '#8a7f70'
              return (
                <div key={platform} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <TrendingUp size={13} style={{ color }} />
                    <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color, fontFamily: 'var(--font-display)' }}>{platform}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                    {platformFields.map(({ key, label }) => (
                      <div key={key}>
                        <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 5 }}>{label}</label>
                        <input
                          type="number"
                          min="0"
                          value={(stats as Record<string, unknown>)[key] as number ?? ''}
                          onChange={e => setStats(s => ({ ...s, [key]: e.target.value ? parseInt(e.target.value) : undefined }))}
                          placeholder="0"
                          style={INPUT}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Notes */}
            <div>
              <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Notes</label>
              <textarea
                value={stats.notes ?? ''}
                onChange={e => setStats(s => ({ ...s, notes: e.target.value }))}
                placeholder="Any notes about this week's numbers…"
                rows={3}
                style={{ ...INPUT, resize: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={save}
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}
            >
              <Save size={14} /> {saving ? 'Saving…' : 'Save Stats'}
            </button>
            {saved && <span style={{ fontSize: 12, color: '#34d399' }}>Saved ✓</span>}
          </div>
        </>
      )}
    </div>
  )
}
