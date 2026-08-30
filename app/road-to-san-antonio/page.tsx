// Page — /road-to-san-antonio: the Veterans Day 2026 fundraising campaign. Reads the
// campaign (code defaults + admin overrides), sponsors, published updates and the
// Fourthwall campaign collection on the server, computes the progress math once,
// and renders the client page. Dynamic: the amount raised changes by hand in the admin.
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getCampaign, getCampaignProducts } from '@/lib/campaignServer'
import { CAMPAIGN, campaignMath, campaignUrl, formatEventDate } from '@/lib/campaign'
import CampaignPage from './CampaignPage'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'
const URL = campaignUrl(SITE_URL)

const TITLE = 'Veterans Day 2026 — Road to San Antonio'
const DESCRIPTION =
  'Help Malachias bring the full band to San Antonio for Veterans Day 2026 — November 12 — through Cash App contributions, merch and sponsorship.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'MALACHIAS — Veterans Day 2026 | Road to San Antonio',
    description: DESCRIPTION,
    type: 'website',
    url: URL,
    siteName: 'Malachias',
    // The generated opengraph-image.tsx next to this file is picked up automatically.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MALACHIAS — Road to San Antonio · Veterans Day 2026',
    description: DESCRIPTION,
  },
}

export default async function RoadToSanAntonioPage() {
  const view = await getCampaign()
  const products = await getCampaignProducts(view.config)
  const math = campaignMath(view.config)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Malachias — ${view.config.eventName}`,
    startDate: view.config.eventDate,
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: view.config.eventVenue || view.config.eventCity, address: { '@type': 'PostalAddress', addressLocality: 'San Antonio', addressRegion: 'TX', addressCountry: 'US' } },
    performer: { '@type': 'MusicGroup', name: 'Malachias', url: SITE_URL },
    description: `${view.config.headline}. ${formatEventDate(view.config.eventDate)}, ${view.config.eventCity}.`,
    url: URL,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CampaignPage
        config={view.config}
        qrReady={view.qrReady}
        sponsors={view.sponsors}
        updates={view.updates}
        inKind={view.inKind}
        inKindValue={view.inKindValue}
        peerLinks={view.peerLinks}
        products={products}
        math={math}
        url={URL}
        defaults={{ path: CAMPAIGN.path }}
      />
    </>
  )
}
