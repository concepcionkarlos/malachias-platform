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

export async function generateMetadata(): Promise<Metadata> {
  const { siteContent: c } = await readContent();
  return {
    title: c.ogTitle ?? 'MALACHIAS — Christian Rock. Veteran Mission. Fort Wayne, Indiana.',
    description: c.metaDescription ?? 'Malachias is a Christian rock band founded by a U.S. Army veteran from Fort Wayne, Indiana. Music with a mission: healing suicidal ideation, depression, and PTSD through faith.',
    keywords: c.metaKeywords ?? 'Christian rock band, veteran music, faith rock, Fort Wayne Indiana, PTSD healing, Malachias',
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
      <Hero />
      <SectionDivider accent="gold" />
      <About />
      <Band />
      <BandTogether />
      <Music />
      <SongStories />
      <WarRoom />
      <Setlist />
      <Shows />
      <Journal />
      <Merch fourthwallProducts={fwProducts} />
      <SectionDivider accent="crimson" />
      <Mission />
      <Testimonies />
      <SectionDivider accent="gold" label="BROTHERHOOD" />
      <Press />
      <Booking />
      <Newsletter />
      <Footer />
    </main>
  );
}
