import type { Metadata } from 'next';
import { readContent } from '@/lib/store';
import { fetchFWProducts } from '@/lib/fourthwall';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Band         from './components/Band';
import Music        from './components/Music';
import Shows        from './components/Shows';
import Journal      from './components/Journal';
import Merch        from './components/Merch';
import Mission      from './components/Mission';
import Testimonies  from './components/Testimonies';
import Press        from './components/Press';
import Booking      from './components/Booking';
import Newsletter   from './components/Newsletter';
import Footer       from './components/Footer';
import SectionDivider from './components/SectionDivider';
import BandTogether   from './components/BandTogether';
import SongStories    from './components/SongStories';
import WarRoom        from './components/WarRoom';
import Setlist        from './components/Setlist';
import BookingPopup   from './components/BookingPopup';

export async function generateMetadata(): Promise<Metadata> {
  const { siteContent: c } = await readContent();
  return {
    title: c.ogTitle ?? 'MALACHIAS — Christian Rock. Veteran Spirit. South Florida.',
    description: c.metaDescription ?? 'Malachias is a Christian rock band based in South Florida, founded by a U.S. Army veteran. Bars, festivals, churches, military events — music with a mission: healing suicidal ideation, depression, and PTSD through faith.',
    keywords: c.metaKeywords ?? 'Christian rock band, veteran music, faith rock, South Florida band, Miami rock band, PTSD healing, Malachias',
    openGraph: {
      title: c.ogTitle ?? c.heroHeadline,
      description: c.ogDescription ?? c.metaDescription,
      type: 'website',
    },
  };
}

export default async function Home() {
  const fwProducts = await fetchFWProducts();

  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── 1. HOOK — visceral first impression ───────────────────── */}
      <Hero />
      <SectionDivider accent="gold" />

      {/* ── 2. WHY — purpose before story (Simon Sinek effect) ────── */}
      <Mission />

      {/* ── 3. WHO — origin story while they're emotionally open ──── */}
      <About />

      {/* ── 4. THE SOUND — give them music NOW, max retention ──────── */}
      <Music />

      {/* ── 5. PROOF — social validation at peak curiosity ──────────── */}
      <Testimonies />

      {/* ── 6. THE PEOPLE — humanize the band ────────────────────── */}
      <Band />
      <BandTogether />

      {/* ── 7. DEEP DIVE — story chapters for the invested visitor ─── */}
      <SongStories />

      {/* ── 8. LIVE — FOMO, see them in person ───────────────────── */}
      <Shows />

      {/* ── 9. THE SONGS — what they actually play ───────────────── */}
      <Setlist />

      {/* ── 10. SPIRIT — daily word for the devoted reader ──────── */}
      <WarRoom />

      {/* ── 11. CONTENT + COMMERCE ───────────────────────────────── */}
      <Journal />
      <Merch fourthwallProducts={fwProducts} />

      {/* ── 12. CREDIBILITY + CONVERSION ─────────────────────────── */}
      <SectionDivider accent="crimson" />
      <Press />
      <SectionDivider accent="gold" label="BROTHERHOOD" />
      <Booking />
      <Newsletter />
      <Footer />
      <BookingPopup />
    </main>
  );
}
