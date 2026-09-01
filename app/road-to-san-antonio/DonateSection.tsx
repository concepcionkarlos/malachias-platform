'use client'

// Donation block for the Road to San Antonio page. Recipient identity (Cash App name
// + $cashtag) is always visible so a donor can verify where money goes. On phones
// the direct Cash App link and "copy $cashtag" come first — nobody scans a QR on
// the same phone that displays it; the QR sits below for people on another device.
// On desktop the QR is the centerpiece. Every suggested amount, the QR and the
// recipient block are real links into Cash App (`$cashtag/<amount>` for the tiles);
// nothing on the card is a dead click.

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { DONATION_LEVELS, usd, cashAppPayUrl, paypalPayUrl, type CampaignConfig } from '@/lib/campaign'
import { trackCampaign, type CampaignEvent } from '@/lib/campaignAnalytics'

interface Props {
  config: CampaignConfig
  qrReady: boolean
}

export default function DonateSection({ config, qrReady }: Props) {
  const { cashApp, paypal, nonprofit } = config
  const [copied, setCopied] = useState('')

  async function copy(value: string, key: string, event: CampaignEvent) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      trackCampaign(event)
      setTimeout(() => setCopied(''), 2500)
    } catch {
      // Clipboard blocked — the value is printed on screen, nothing else to do.
    }
  }

  return (
    <section id="donate" className="section-pad" style={{ background: '#050403', scrollMarginTop: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>1 · Donate</p>
        <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
          WAYS TO GIVE
        </h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
          Help support Malachias&apos; Road to San Antonio for {config.eventName}. Cash App is the fastest way — scan the
          QR code or tap an amount{paypal ? ', and PayPal is below if you prefer it' : ''}. Every contribution goes to{' '}
          {cashApp.displayName} and helps move the road forward.
        </p>

        <div className="tac-box mt-10 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0 overflow-hidden">

          {/* ── Identity + direct actions (first on phones) ── */}
          <div className="p-6 md:p-8 flex flex-col gap-6 order-1">
            <div>
              <p className="label-xs mb-2" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Recipient</p>
              <a
                href={cashAppPayUrl(cashApp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${cashApp.displayName} (${cashApp.cashtag}) in Cash App`}
                style={{ display: 'block', textDecoration: 'none' }}
                onClick={() => trackCampaign('cashapp_click', { surface: 'recipient' })}
              >
                <p className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>
                  {cashApp.displayName}
                </p>
                <p className="mt-2 font-mono" style={{ fontSize: '1.15rem', color: '#c9a84c', letterSpacing: '0.02em', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  {cashApp.cashtag}
                </p>
              </a>
              <p className="mt-2 text-[0.78rem]" style={{ color: 'var(--text-2)' }}>
                {cashApp.displayName} is the Cash App account Malachias uses for this campaign. Check that the name and $cashtag in Cash App match the ones above before you send.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {config.donateUrl && (
                <a
                  href={config.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary justify-center"
                  style={{ letterSpacing: '0.18em', padding: '1rem 1.25rem', fontSize: '0.85rem' }}
                  onClick={() => trackCampaign('donate_click', { surface: 'secure' })}
                >
                  <ExternalLink size={16} aria-hidden="true" />&ensp;Donate securely
                </a>
              )}
              <a
                href={cashApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className={config.donateUrl ? 'btn btn-ghost justify-center' : 'btn btn-primary justify-center'}
                style={{ letterSpacing: '0.18em', padding: '1rem 1.25rem', fontSize: '0.85rem' }}
                onClick={() => trackCampaign('cashapp_click', { surface: 'donate' })}
              >
                <ExternalLink size={16} aria-hidden="true" />&ensp;Open Cash App
              </a>
              <button
                type="button"
                onClick={() => copy(cashApp.cashtag, 'cashtag', 'cashtag_copy')}
                className="btn btn-ghost justify-center"
                style={{ letterSpacing: '0.16em', padding: '0.9rem 1.25rem', fontSize: '0.78rem' }}
                aria-live="polite"
              >
                {copied === 'cashtag'
                  ? <><Check size={15} aria-hidden="true" />&ensp;Copied {cashApp.cashtag}</>
                  : <><Copy size={15} aria-hidden="true" />&ensp;Copy $Cashtag</>}
              </button>
            </div>

            {/* Suggested amounts — each one opens Cash App with that amount in the link */}
            <div>
              <p className="label-xs mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Tap an amount to open Cash App</p>
              <ul className="grid grid-cols-3 gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {DONATION_LEVELS.map(l => (
                  <li key={l.amount}>
                    <a
                      href={cashAppPayUrl(cashApp, l.amount)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tac-box block"
                      style={{ padding: '0.7rem 0.6rem', textAlign: 'center', textDecoration: 'none' }}
                      aria-label={`Open Cash App to send ${usd(l.amount)} to ${cashApp.cashtag}`}
                      onClick={() => trackCampaign('donate_click', { surface: 'amount', amount: l.amount })}
                    >
                      <span className="font-display block" style={{ fontSize: '1.35rem', color: '#ede5d8', letterSpacing: '0.04em' }}>{usd(l.amount)}</span>
                      <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-2)', marginTop: 2 }}>{l.label}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={cashAppPayUrl(cashApp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tac-box block"
                    style={{ padding: '0.7rem 0.6rem', textAlign: 'center', textDecoration: 'none' }}
                    aria-label={`Open Cash App to send any amount to ${cashApp.cashtag}`}
                    onClick={() => trackCampaign('donate_click', { surface: 'amount', amount: 0 })}
                  >
                    <span className="font-display block" style={{ fontSize: '1.35rem', color: '#c9a84c', letterSpacing: '0.04em' }}>Any</span>
                    <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-2)', marginTop: 2 }}>Custom</span>
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-[0.72rem]" style={{ color: 'var(--text-2)' }}>
                Each amount opens Cash App with that amount ready to send — just confirm. Any amount helps.
              </p>
            </div>
          </div>

          {/* ── QR (centerpiece on desktop, "for another device" on phones) ── */}
          <div
            className="order-2 flex flex-col items-center justify-center gap-4 p-6 md:p-8"
            style={{ background: '#0a0806', borderTop: '1px solid rgba(201,168,76,0.10)' }}
          >
            <p className="label-xs md:hidden" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Scanning from another device?</p>
            {qrReady ? (
              <a
                href={cashAppPayUrl(cashApp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${cashApp.displayName} in Cash App`}
                style={{ background: '#ffffff', padding: 14, borderRadius: 18, width: 'min(100%, 300px)', display: 'block' }}
                onClick={() => trackCampaign('cashapp_click', { surface: 'qr' })}
              >
                <Image
                  src={cashApp.qrImage}
                  alt={`Cash App QR code for ${cashApp.displayName} (${cashApp.cashtag})`}
                  width={720}
                  height={720}
                  unoptimized
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10 }}
                />
              </a>
            ) : (
              <div
                role="status"
                className="flex flex-col items-center justify-center text-center"
                style={{ width: 'min(100%, 300px)', aspectRatio: '1/1', border: '1px dashed rgba(201,168,76,0.35)', borderRadius: 18, padding: '1.5rem' }}
              >
                <QrCode size={36} style={{ color: 'rgba(201,168,76,0.5)' }} aria-hidden="true" />
                <p className="mt-3 text-[0.8rem]" style={{ color: 'var(--text-2)' }}>Cash App QR code coming soon.</p>
                <p className="mt-1 text-[0.72rem]" style={{ color: 'var(--text-2)' }}>Use the Open Cash App button or the $cashtag above.</p>
              </div>
            )}
            <a
              href={cashAppPayUrl(cashApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center"
              style={{ textDecoration: 'none', display: 'block' }}
              onClick={() => trackCampaign('cashapp_click', { surface: 'qr-caption' })}
            >
              <p className="font-display" style={{ fontSize: '1.2rem', letterSpacing: '0.05em', color: '#ede5d8' }}>{cashApp.displayName}</p>
              <p className="font-mono" style={{ fontSize: '0.95rem', color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 4 }}>{cashApp.cashtag}</p>
              <p className="mt-1" style={{ fontSize: '0.66rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-2)' }}>Scan with Cash App · or tap to open</p>
            </a>
          </div>
        </div>

        {/* ── PayPal — the account is identified by email, so the address is shown
             next to the button: that path works in the PayPal app no matter how
             the donate flow behaves. ── */}
        {paypal && (
          <div className="tac-box mt-4 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="label-xs mb-2" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Prefer PayPal?</p>
              <p className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1.1 }}>
                {cashApp.displayName}
              </p>
              <p className="font-mono mt-1" style={{ fontSize: '0.9rem', color: '#c9a84c', wordBreak: 'break-all' }}>{paypal.email}</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Send to this address in PayPal, or use the button.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:w-[15rem] shrink-0">
              <a
                href={paypalPayUrl(paypal)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary justify-center"
                style={{ letterSpacing: '0.16em', padding: '0.9rem 1.25rem', fontSize: '0.78rem' }}
                aria-label={`Give with PayPal to ${paypal.email}`}
                onClick={() => trackCampaign('paypal_click', { surface: 'paypal-card' })}
              >
                <ExternalLink size={16} aria-hidden="true" />&ensp;Give with PayPal
              </a>
              <button
                type="button"
                onClick={() => copy(paypal.email, 'paypal', 'paypal_copy')}
                className="btn btn-ghost justify-center"
                style={{ letterSpacing: '0.16em', padding: '0.9rem 1.25rem', fontSize: '0.78rem' }}
                aria-live="polite"
              >
                {copied === 'paypal'
                  ? <><Check size={15} aria-hidden="true" />&ensp;Copied address</>
                  : <><Copy size={15} aria-hidden="true" />&ensp;Copy PayPal address</>}
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '44rem' }}>
          Contributions go to {cashApp.displayName} and are applied to the Road to San Antonio travel budget.
          The amount raised shown on this page is updated by the band after reconciling contributions — it is not a live feed.
        </p>

        {/* Tax wording appears only when the nonprofit status has been checked
            against the IRS record — see `nonprofitVerified` in lib/campaign.ts. */}
        {config.nonprofitVerified && nonprofit && (
          <p className="mt-3 text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '44rem' }}>
            {nonprofit.legalName} is a registered 501(c)(3) nonprofit organization (EIN {nonprofit.ein}),
            based in {nonprofit.city}, {nonprofit.state}. Contributions are tax deductible to the extent allowed by law.
            For a receipt, contact{' '}
            <a href={`mailto:${config.sponsorEmail}`} style={{ color: '#c9a84c' }}>{config.sponsorEmail}</a>.
            Please consult your tax advisor about your own situation.
          </p>
        )}
      </div>
    </section>
  )
}
