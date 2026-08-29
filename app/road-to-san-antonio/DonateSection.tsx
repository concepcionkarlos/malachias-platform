'use client'

// Donation block for the Road to San Antonio page. Recipient identity (Cash App name
// + $cashtag) is always visible so a donor can verify where money goes. On phones
// the direct Cash App link and "copy $cashtag" come first — nobody scans a QR on
// the same phone that displays it; the QR sits below for people on another device.
// On desktop the QR is the centerpiece. Suggested amounts are anchors only and the
// copy says so — they do not preload Cash App.

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { DONATION_LEVELS, usd, type CampaignConfig } from '@/lib/campaign'
import { trackCampaign } from '@/lib/campaignAnalytics'

interface Props {
  config: CampaignConfig
  qrReady: boolean
}

export default function DonateSection({ config, qrReady }: Props) {
  const { cashApp } = config
  const [copied, setCopied] = useState(false)

  async function copyCashtag() {
    try {
      await navigator.clipboard.writeText(cashApp.cashtag)
      setCopied(true)
      trackCampaign('cashtag_copy')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard blocked — the cashtag is printed on screen, nothing else to do.
    }
  }

  return (
    <section id="donate" className="section-pad" style={{ background: '#050403', scrollMarginTop: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>1 · Donate</p>
        <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
          SUPPORT THROUGH CASH APP
        </h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
          Help support Malachias&apos; Road to San Antonio for {config.eventName}. Scan the QR code or open Cash App
          to contribute through {cashApp.displayName}. Every contribution helps move the road forward.
        </p>

        <div className="tac-box mt-10 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0 overflow-hidden">

          {/* ── Identity + direct actions (first on phones) ── */}
          <div className="p-6 md:p-8 flex flex-col gap-6 order-1">
            <div>
              <p className="label-xs mb-2" style={{ color: 'var(--text-3)', letterSpacing: '0.30em' }}>Recipient</p>
              <p className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>
                {cashApp.displayName}
              </p>
              <p className="mt-2 font-mono" style={{ fontSize: '1.15rem', color: '#c9a84c', letterSpacing: '0.02em' }}>
                {cashApp.cashtag}
              </p>
              <p className="mt-2 text-[0.78rem]" style={{ color: 'var(--text-3)' }}>
                Check that the name and $cashtag in Cash App match the ones above before you send.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={cashApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary justify-center"
                style={{ letterSpacing: '0.18em', padding: '1rem 1.25rem', fontSize: '0.85rem' }}
                onClick={() => trackCampaign('cashapp_click', { surface: 'donate' })}
              >
                <ExternalLink size={16} aria-hidden="true" />&ensp;Open Cash App
              </a>
              <button
                type="button"
                onClick={copyCashtag}
                className="btn btn-ghost justify-center"
                style={{ letterSpacing: '0.16em', padding: '0.9rem 1.25rem', fontSize: '0.78rem' }}
                aria-live="polite"
              >
                {copied
                  ? <><Check size={15} aria-hidden="true" />&ensp;Copied {cashApp.cashtag}</>
                  : <><Copy size={15} aria-hidden="true" />&ensp;Copy $Cashtag</>}
              </button>
            </div>

            {/* Suggested amounts — anchors, not buttons that preload anything */}
            <div>
              <p className="label-xs mb-3" style={{ color: 'var(--text-3)', letterSpacing: '0.30em' }}>Suggested amounts</p>
              <ul className="grid grid-cols-3 gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {DONATION_LEVELS.map(l => (
                  <li key={l.amount} className="tac-box" style={{ padding: '0.7rem 0.6rem', textAlign: 'center' }}>
                    <span className="font-display block" style={{ fontSize: '1.35rem', color: '#ede5d8', letterSpacing: '0.04em' }}>{usd(l.amount)}</span>
                    <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>{l.label}</span>
                  </li>
                ))}
                <li className="tac-box" style={{ padding: '0.7rem 0.6rem', textAlign: 'center' }}>
                  <span className="font-display block" style={{ fontSize: '1.35rem', color: '#c9a84c', letterSpacing: '0.04em' }}>Any</span>
                  <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>Custom</span>
                </li>
              </ul>
              <p className="mt-3 text-[0.72rem]" style={{ color: 'var(--text-3)' }}>
                Type the amount in Cash App — these are suggestions, not fixed levels.
              </p>
            </div>
          </div>

          {/* ── QR (centerpiece on desktop, "for another device" on phones) ── */}
          <div
            className="order-2 flex flex-col items-center justify-center gap-4 p-6 md:p-8"
            style={{ background: '#0a0806', borderTop: '1px solid rgba(201,168,76,0.10)' }}
          >
            <p className="label-xs md:hidden" style={{ color: 'var(--text-3)', letterSpacing: '0.30em' }}>Scanning from another device?</p>
            {qrReady ? (
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 18, width: 'min(100%, 300px)' }}>
                <Image
                  src={cashApp.qrImage}
                  alt={`Cash App QR code for ${cashApp.displayName} (${cashApp.cashtag})`}
                  width={720}
                  height={720}
                  unoptimized
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10 }}
                />
              </div>
            ) : (
              <div
                role="status"
                className="flex flex-col items-center justify-center text-center"
                style={{ width: 'min(100%, 300px)', aspectRatio: '1/1', border: '1px dashed rgba(201,168,76,0.35)', borderRadius: 18, padding: '1.5rem' }}
              >
                <QrCode size={36} style={{ color: 'rgba(201,168,76,0.5)' }} aria-hidden="true" />
                <p className="mt-3 text-[0.8rem]" style={{ color: 'var(--text-2)' }}>Cash App QR code coming soon.</p>
                <p className="mt-1 text-[0.72rem]" style={{ color: 'var(--text-3)' }}>Use the Open Cash App button or the $cashtag above.</p>
              </div>
            )}
            <div className="text-center">
              <p className="font-display" style={{ fontSize: '1.2rem', letterSpacing: '0.05em', color: '#ede5d8' }}>{cashApp.displayName}</p>
              <p className="font-mono" style={{ fontSize: '0.95rem', color: '#c9a84c' }}>{cashApp.cashtag}</p>
              <p className="mt-1" style={{ fontSize: '0.66rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Scan with Cash App</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '44rem' }}>
          Contributions go to {cashApp.displayName} via Cash App and are applied to the Road to San Antonio travel budget.
          The amount raised shown on this page is updated by the band after reconciling contributions — it is not a live feed.
        </p>
      </div>
    </section>
  )
}
