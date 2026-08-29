// Page — /voice-lessons: Voice Lessons with Malachias. Metadata + Service JSON-LD
// (offer, price, area served) and the client page with the sign-up form.
import type { Metadata } from 'next'
import { LESSONS } from '@/lib/lessons'
import VoiceLessonsClient from './VoiceLessonsClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.malachiasmusic.com'
const URL = `${SITE_URL}${LESSONS.path}`

const DESCRIPTION = `Vocal, style and stage presence lessons with Malachias — international touring artist and former Nashville recording artist. $${LESSONS.price} per ${LESSONS.lengthMinutes}-minute lesson, in person in ${LESSONS.inPersonCounties.join(', ')} counties or via Zoom. Discounts for veterans and packages.`

export const metadata: Metadata = {
  title: 'Voice Lessons with Malachias — South Florida & Zoom',
  description: DESCRIPTION,
  keywords: ['voice lessons Broward', 'vocal coach Miami', 'singing lessons Palm Beach', 'stage presence coaching', 'voice lessons Zoom', 'rock vocal coach South Florida', 'worship vocal lessons'],
  alternates: { canonical: URL },
  openGraph: { title: 'Voice Lessons with Malachias', description: DESCRIPTION, type: 'website', url: URL, siteName: 'Malachias' },
  twitter: { card: 'summary_large_image', title: 'Voice Lessons with Malachias', description: DESCRIPTION },
}

export default function VoiceLessonsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: LESSONS.title,
    serviceType: 'Voice lessons, vocal coaching, stage presence coaching',
    description: DESCRIPTION,
    url: URL,
    provider: { '@type': 'Person', name: 'Malachias', url: SITE_URL },
    areaServed: [
      ...LESSONS.inPersonCounties.map(c => ({ '@type': 'AdministrativeArea', name: `${c} County, Florida` })),
      { '@type': 'Place', name: 'Online (Zoom)' },
    ],
    offers: {
      '@type': 'Offer',
      price: String(LESSONS.price),
      priceCurrency: 'USD',
      description: `Per ${LESSONS.lengthMinutes}-minute lesson. Discounts for veterans and bulk packages.`,
      availability: 'https://schema.org/InStock',
      url: `${URL}#sign-up`,
    },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VoiceLessonsClient />
    </>
  )
}
