import type { Metadata } from 'next'
import PromoPageClient from './PromoPageClient'

export const metadata: Metadata = {
  title: '20% OFF Merch Launch — MALACHIAS',
  description: 'Celebrate the official Malachias merch launch with 20% off your first order. Enter your email and get your code instantly.',
  alternates: { canonical: 'https://malachiasmusic.com/promo' },
  robots: { index: false },
}

export default function PromoPage() {
  return <PromoPageClient />
}
