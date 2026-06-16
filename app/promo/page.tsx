import type { Metadata } from 'next'
import PromoPageClient from './PromoPageClient'

export const metadata: Metadata = {
  title: '15% OFF Merch — MALACHIAS | Subscribe & Save',
  description: 'Subscribe and get 15% off your first Malachias merch order. Veteran-founded Christian rock band from South Florida. Code delivered by email.',
  alternates: { canonical: 'https://malachiasmusic.com/promo' },
  robots: { index: false },
}

export default function PromoPage() {
  return <PromoPageClient />
}
