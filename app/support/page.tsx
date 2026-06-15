import type { Metadata } from 'next';
import SupportPageClient from './SupportPageClient';

export const metadata: Metadata = {
  title: 'Support Malachias — Veteran-Founded Christian Rock Band',
  description: 'Malachias is a self-funded Christian rock band founded by a U.S. Army veteran. Your support funds live shows, studio recordings, and free veteran outreach events in South Florida.',
  alternates: { canonical: 'https://malachiasmusic.com/support' },
  openGraph: {
    title: 'Support Malachias — Veteran-Founded Christian Rock Band',
    description: 'No label. No corporate backing. Your support funds shows, recordings, and veteran outreach in South Florida. Every action counts.',
    type: 'website',
    url: 'https://malachiasmusic.com/support',
  },
};

export default function SupportPage() {
  return <SupportPageClient />;
}
