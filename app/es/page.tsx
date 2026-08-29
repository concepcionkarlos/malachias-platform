// Page — /es: Spanish landing for the Hispanic audience in South Florida. One page
// that says what Malachias is, the Road to San Antonio campaign (live numbers),
// voice lessons, and how to book the band — with links into the English site for
// depth. Dynamic because it shows the campaign progress.
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getCampaign } from '@/lib/campaignServer'
import { campaignMath } from '@/lib/campaign'
import { fetchReleases, featuredRelease } from '@/lib/releases'
import EsLanding from './EsLanding'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.malachiasmusic.com'

export const metadata: Metadata = {
  title: 'Malachias — Rock cristiano fundado por un veterano · Coral Springs, Florida',
  description: 'Malachias es una banda de rock cristiano del sur de Florida fundada por un veterano del Ejército de EE. UU. Campaña Road to San Antonio (Día de los Veteranos 2026), clases de canto con Malachias y contratación para iglesias, bares, festivales y eventos militares.',
  keywords: ['banda rock cristiano Miami', 'rock cristiano sur de Florida', 'banda cristiana Coral Springs', 'clases de canto Broward', 'música cristiana veteranos', 'Malachias banda'],
  alternates: { canonical: `${SITE_URL}/es`, languages: { en: SITE_URL, es: `${SITE_URL}/es` } },
  openGraph: { title: 'Malachias — Rock cristiano. Espíritu de veterano. Sur de Florida.', description: 'Fundada por un veterano de dos misiones en Irak. Road to San Antonio, clases de canto y contrataciones.', type: 'website', url: `${SITE_URL}/es`, locale: 'es_US', siteName: 'Malachias' },
}

export default async function EsPage() {
  const [campaign, releases] = await Promise.all([getCampaign(), fetchReleases()])
  const math = campaignMath(campaign.config)
  const featured = featuredRelease(releases)
  return <EsLanding config={campaign.config} math={math} featured={featured ? { title: featured.title, credits: featured.credits, artwork: featured.artwork, appleUrl: featured.appleUrl } : null} />
}
