import type { Metadata } from 'next';
import SupportPageClient from './SupportPageClient';

export const metadata: Metadata = {
  title: 'Support the Band — Malachias',
  description: 'No label. No corporate backing. Just a veteran, a guitar, and a mission. Every dollar keeps the music alive.',
};

export default function SupportPage() {
  return <SupportPageClient />;
}
