'use client'

// Share controls for the campaign: native share sheet where the browser has one
// (phones), Facebook, email, copy link. Four controls, no clutter.

import { useState } from 'react'
import { Share2, Link as LinkIcon, Mail, Check } from 'lucide-react'
import { trackCampaign } from '@/lib/campaignAnalytics'

const FB_ICON = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

interface Props { url: string; text: string; compact?: boolean }

export default function ShareBar({ url, text, compact = false }: Props) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    trackCampaign('share_click', { channel: 'copy' })
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { /* blocked */ }
  }
  // Native share sheet where the browser has one (phones); otherwise copy the link.
  async function share() {
    if (typeof navigator.share === 'function') {
      trackCampaign('share_click', { channel: 'native' })
      try { await navigator.share({ title: 'Road to San Antonio — Malachias', text, url }) } catch { /* dismissed */ }
    } else {
      await copyLink()
    }
  }

  const btn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
    padding: compact ? '0.55rem 0.9rem' : '0.7rem 1.1rem',
    border: '1px solid rgba(201,168,76,0.28)', background: 'rgba(201,168,76,0.05)',
    color: '#e8ddd0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase',
    fontFamily: 'var(--font-body)', fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  }
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const mail = `mailto:?subject=${encodeURIComponent('Road to San Antonio — Malachias, Veterans Day 2026')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Share the campaign">
      <button type="button" style={btn} onClick={share}><Share2 size={15} aria-hidden="true" /> Share</button>
      <a href={fb} target="_blank" rel="noopener noreferrer" style={btn} onClick={() => trackCampaign('share_click', { channel: 'facebook' })}>
        {FB_ICON} Facebook
      </a>
      <a href={mail} style={btn} onClick={() => trackCampaign('share_click', { channel: 'email' })}><Mail size={15} aria-hidden="true" /> Email</a>
      <button type="button" style={btn} onClick={copyLink} aria-live="polite">
        {copied ? <><Check size={15} aria-hidden="true" /> Link copied</> : <><LinkIcon size={15} aria-hidden="true" /> Copy link</>}
      </button>
    </div>
  )
}
