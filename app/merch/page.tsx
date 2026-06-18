// Page — /merch: store landing. Server-fetches the Fourthwall product catalog
// (revalidated every 5 min) and hands it to the MerchPageClient for display.
import type { Metadata } from 'next';
import { fetchFWProducts } from '@/lib/fourthwall';
import MerchPageClient from './MerchPageClient';

export const revalidate = 300;  // Re-fetch Fourthwall catalog every 5 minutes

export const metadata: Metadata = {
  title: 'Official Merch — MALACHIAS | Christian Rock Band South Florida',
  description: 'Support a veteran-founded Christian rock band. Official Malachias gear funds live shows, original music, and veteran outreach events. No label. Every purchase matters.',
  alternates: { canonical: 'https://malachiasmusic.com/merch' },
  openGraph: {
    title: 'Support Malachias — Official Band Merch',
    description: 'Veteran-founded Christian rock band. Every purchase funds shows, recordings, and veteran outreach. No label. Direct to the band.',
    type: 'website',
    url: 'https://malachiasmusic.com/merch',
  },
};

export default async function MerchPage() {
  const products = await fetchFWProducts();
  return <MerchPageClient products={products} />;
}
