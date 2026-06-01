import type { Metadata } from 'next';
import { fetchFWProducts } from '@/lib/fourthwall';
import MerchPageClient from './MerchPageClient';

export const revalidate = 3600;  // Re-fetch Fourthwall catalog every hour

export const metadata: Metadata = {
  title: 'Official Merch — MALACHIAS',
  description: 'Support the mission. Official Malachias merchandise — faith, freedom, music. Every piece tied to a story.',
  openGraph: {
    title: 'Official Merch — MALACHIAS',
    description: 'Support the mission. Official Malachias merchandise.',
    type: 'website',
  },
};

export default async function MerchPage() {
  const products = await fetchFWProducts();
  return <MerchPageClient products={products} />;
}
