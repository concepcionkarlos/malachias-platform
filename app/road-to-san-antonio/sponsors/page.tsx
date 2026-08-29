// Page — /road-to-san-antonio/sponsors: the sponsorship overview a business or church
// can read on screen, print, or "Save as PDF" from the browser (print styles below
// strip the site chrome). Content comes from lib/campaign.ts so it never drifts
// from the campaign page. A designed PDF can be produced later from this page.
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { getCampaign } from '@/lib/campaignServer'
import { SPONSOR_TIERS, SPONSOR_CATEGORIES, campaignMath, campaignUrl, formatEventDate, usd } from '@/lib/campaign'
import { ARTIST } from '@/lib/releases'
import PrintButton from './PrintButton'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'

export const metadata: Metadata = {
  title: 'Sponsorship Opportunities — Road to San Antonio',
  description: 'Sponsorship overview for Malachias — Road to San Antonio, Veterans Day 2026 (November 12, San Antonio, Texas): tiers, benefits, what sponsorship supports, and contact.',
  alternates: { canonical: `${campaignUrl(SITE_URL)}/sponsors` },
  openGraph: { title: 'Sponsor the Road to San Antonio — Malachias', description: 'Sponsorship tiers and benefits for the Veterans Day 2026 campaign.', type: 'website', url: `${campaignUrl(SITE_URL)}/sponsors` },
}

const LABEL: React.CSSProperties = { fontSize: '0.6rem', letterSpacing: '0.36em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'var(--font-body)', fontWeight: 700 }
const RULE: React.CSSProperties = { border: 'none', borderTop: '1px solid rgba(201,168,76,0.18)', margin: '2.25rem 0' }

export default async function SponsorKitPage() {
  const { config } = await getCampaign()
  const math = campaignMath(config)
  const url = campaignUrl(SITE_URL)

  return (
    <div className="kit" style={{ minHeight: '100vh', background: '#060504', color: '#e8ddd0', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .kit a { color: #c9a84c; text-decoration: underline; text-underline-offset: 3px; }
        @media print {
          .kit { background: #fff !important; color: #111 !important; }
          .kit * { color: #111 !important; border-color: #999 !important; background: transparent !important; box-shadow: none !important; }
          .kit .no-print { display: none !important; }
          .kit .tier { break-inside: avoid; }
        }
      `}</style>

      <div className="no-print" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)', padding: '1.1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <Link href={config.path} style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', letterSpacing: '0.26em', color: '#e8ddd0', textDecoration: 'none' }}>← ROAD TO SAN ANTONIO</Link>
        <PrintButton />
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={LABEL}>Sponsorship opportunities</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 4.6rem)', lineHeight: 0.92, letterSpacing: '0.04em', margin: '0.75rem 0 0' }}>
          MALACHIAS<br />ROAD TO SAN ANTONIO<br /><span style={{ color: '#c9a84c' }}>VETERANS DAY 2026</span>
        </h1>
        <p style={{ marginTop: '1.25rem', fontSize: '1.05rem', color: '#a89880' }}>{formatEventDate(config.eventDate)} · {config.eventCity}</p>

        <hr style={RULE} />

        <p style={LABEL}>The band</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.75 }}>
          Malachias is a veteran-founded Christian rock band based in Coral Springs, South Florida. The founder served in the
          U.S. Army — two tours in Iraq, as a medic and as an Army bandsman. Since the debut album <em>For Those That Remain</em>
          (2022) the band has released a steady run of singles, most recently <em>Because of You</em> (August 2026). The mission
          is specific: reduce suicidal ideation, lift people from depression, and help heal what PTSD leaves behind — through music,
          played for bars, churches, festivals, VFW halls and veteran events.
        </p>

        <p style={{ ...LABEL, marginTop: '2rem' }}>The opportunity</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.75 }}>
          Malachias has been invited to perform at a {config.eventName} event in {config.eventCity} on {formatEventDate(config.eventDate)},
          dedicated to honoring America&apos;s veterans. The campaign exists to bring the full band — {config.travelers} people and
          their instruments — from South Florida to Texas.
        </p>

        <p style={{ ...LABEL, marginTop: '2rem' }}>Campaign goal</p>
        <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '2.4rem', letterSpacing: '0.04em' }}>{usd(math.goal)}</p>
        <p style={{ lineHeight: 1.75, color: '#a89880' }}>
          Sponsorship supports: {config.budgetLines.map(b => b.label.toLowerCase()).join(', ')}. The target is adjusted as the event
          organizer confirms what the event covers; any surplus funds free veteran outreach shows in South Florida.
        </p>

        <hr style={RULE} />

        <p style={LABEL}>Sponsorship tiers</p>
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {SPONSOR_TIERS.map(t => (
            <div key={t.id} className="tier" style={{ border: '1px solid rgba(201,168,76,0.2)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'minmax(8rem, 1fr) 2fr', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', margin: 0 }}>{t.name}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#c9a84c', margin: '0.2rem 0 0' }}>{t.amount === null ? 'Custom' : usd(t.amount)}</p>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                {t.benefits.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#a89880', lineHeight: 1.7 }}>
          Specific sponsorships: {SPONSOR_CATEGORIES.join(' · ')}. Covering a flight, hotel nights, ground transportation, gear or
          meals directly counts at the matching tier. Recognition covers what the band controls — the campaign page, its social
          channels and its own content. Anything involving the event&apos;s venue, signage or stage is the organizer&apos;s decision.
        </p>

        <hr style={RULE} />

        <p style={LABEL}>Contact</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.9 }}>
          Sponsorship: <a href={`mailto:${config.sponsorEmail}`}>{config.sponsorEmail}</a><br />
          Campaign page: <a href={url}>{url}</a><br />
          Sponsor form: <a href={`${url}#sponsor-form`}>{url}#sponsor-form</a><br />
          Website: <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, '')}</a>
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#a89880', lineHeight: 1.9 }}>
          Instagram @malachiasmusic · Facebook Malachias · <a href={ARTIST.spotifyArtistUrl}>Spotify</a> · <a href={ARTIST.appleArtistUrl}>Apple Music</a> · <a href={ARTIST.youtubeUrl}>YouTube</a>
        </p>
      </div>
    </div>
  )
}
