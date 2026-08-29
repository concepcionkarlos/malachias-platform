'use client'

// Site-wide strip for the Road to San Antonio campaign. Same fixed-top pattern as
// NextShowBanner (44px + spacer); page.tsx only mounts one top strip at a time.
// Dismissal is remembered for 3 days. Never a popup.

import { useState } from 'react'
import Link from 'next/link'
import { trackCampaign } from '@/lib/campaignAnalytics'

const LS_KEY = 'malachias_rtsa_banner_ts'
const TTL_MS = 3 * 24 * 60 * 60 * 1000

interface Props { path: string; label: string; percent: number }

function initiallyDismissed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(LS_KEY)
    const ts = raw ? parseInt(raw, 10) : NaN
    return !isNaN(ts) && Date.now() - ts < TTL_MS
  } catch { return false }
}

export default function CampaignBanner({ path, label, percent }: Props) {
  const [dismissed, setDismissed] = useState(initiallyDismissed)
  if (dismissed) return null

  function dismiss() {
    try { localStorage.setItem(LS_KEY, String(Date.now())) } catch { /* private mode */ }
    setDismissed(true)
  }

  return (
    <>
      <div
        role="region"
        aria-label="Road to San Antonio campaign"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9997, height: 44,
          background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 52px 0 16px',
        }}
      >
        <Link
          href={path}
          onClick={() => trackCampaign('campaign_banner_click')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', minWidth: 0 }}
        >
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>
          <span aria-hidden="true" style={{ color: 'rgba(201,168,76,0.4)' }}>·</span>
          <span style={{ fontSize: '0.7rem', color: '#e8ddd0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Help us reach Veterans Day 2026{percent > 0 ? ` · ${percent}% funded` : ''}
          </span>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c9a84c', borderBottom: '1px solid rgba(201,168,76,0.4)', whiteSpace: 'nowrap' }}>Support →</span>
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss campaign banner"
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'none', border: 'none', color: 'rgba(201,168,76,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ✕
        </button>
      </div>
      <div style={{ height: 44 }} aria-hidden="true" />
    </>
  )
}
