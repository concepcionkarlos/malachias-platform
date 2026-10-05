// Page — / (home): the front door. Kept to the essentials in order (hero, mission,
// campaign, about, music, band, shows, testimonies, merch, press, booking); the
// deep-dive sections (song stories, setlist, War Room, journal, fan-story form)
// live on /stories, with a short teaser block here.
//
// All data is read ONCE here on the server and handed down as props — CMS content,
// approved fan stories, live sessions, Fourthwall products and the live
// discography. Sections used to each fetch /api/public/content (or admin-only
// endpoints that 401'd) on mount.
import type { Metadata } from 'next';
import { readContent } from '@/lib/store';
import { fetchFWProducts, fwCardProduct } from '@/lib/fourthwall';
import { getSongs, getLiveSessions } from '@/lib/venueStore';
import { fetchReleases, featuredRelease, youtubeWatchUrl } from '@/lib/releases';
import { getCampaign } from '@/lib/campaignServer';
import { campaignMath } from '@/lib/campaign';
import CampaignBanner  from './components/CampaignBanner';
import CampaignSection from './components/CampaignSection';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Band         from './components/Band';
import Music        from './components/Music';
import Shows        from './components/Shows';
import Merch        from './components/Merch';
import Mission      from './components/Mission';
import Testimonies  from './components/Testimonies';
import Press        from './components/Press';
import Booking      from './components/Booking';
import Newsletter   from './components/Newsletter';
import Footer       from './components/Footer';
import SectionDivider from './components/SectionDivider';
import BandTogether   from './components/BandTogether';
import LessonsTeaser  from './components/LessonsTeaser';
import PressFeature   from './components/PressFeature';
import StoriesTeaser  from './components/StoriesTeaser';
import BookingPopup   from './components/BookingPopup';
import SupportPopup  from './components/SupportPopup';
import NextShowBanner     from './components/NextShowBanner';
import LiveSessionBanner, { type PublicLiveSession }  from './components/LiveSessionBanner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'

export async function generateMetadata(): Promise<Metadata> {
  const { siteContent: c } = await readContent();
  return {
    title: c.ogTitle ?? 'MALACHIAS — Christian Rock. Veteran Spirit. South Florida.',
    description: c.metaDescription ?? 'Malachias is a Christian rock band based in Coral Springs, South Florida, founded by a U.S. Army veteran. Bars, festivals, churches, military events — music with a mission: healing suicidal ideation, depression, and PTSD through faith.',
    keywords: c.metaKeywords ?? 'Christian rock band, veteran music, faith rock, South Florida band, Coral Springs band, Miami rock band, PTSD healing, Malachias',
    alternates: { canonical: SITE_URL, languages: { en: SITE_URL, es: `${SITE_URL}/es` } },
    openGraph: {
      title: c.ogTitle ?? c.heroHeadline,
      description: c.ogDescription ?? c.metaDescription,
      type: 'website',
      url: SITE_URL,
      siteName: 'Malachias',
      images: [{ url: '/og-malachias.jpg', width: 1200, height: 630, alt: 'Malachias — Christian Rock Band' }],
    },
  };
}

export default async function Home() {
  const [content, fwProducts, songs, liveSessions, releases, campaign] = await Promise.all([
    readContent(),
    fetchFWProducts(),
    getSongs().catch(() => []),
    getLiveSessions().catch(() => []),
    fetchReleases(),
    getCampaign(),
  ]);
  const campaignStats = campaignMath(campaign.config);
  const campaignLive = campaignStats.effectiveStatus === 'active' || campaignStats.effectiveStatus === 'funded';

  const today = new Date().toISOString().split('T')[0];
  const shows = content.shows
    .filter(s => s.visible !== false && (!s.date || s.date >= today))
    .sort((a, b) => a.date.localeCompare(b.date));
  // The deep-dive sections live on /stories; the teaser only needs to know
  // which of them have something to show.
  const hasSongStories = (content.songStories ?? []).some(s => s.visible !== false);
  const hasReflections = (content.dailyReflections ?? []).length > 0;
  const hasSetlist = songs.some(s => s.status === 'ready');
  const fanStories = (content.fanStories ?? [])
    .filter(s => s.status === 'approved')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const mediaItems = content.mediaItems.filter(m => m.visible !== false);

  const publicSessions: PublicLiveSession[] = liveSessions
    .filter(s => s.status === 'live' || s.status === 'planned')
    .map(({ id, title, description, platform, scheduledAt, status, platformUrl }) =>
      ({ id, title, description, platform, scheduledAt, status, platformUrl }));

  const featured = featuredRelease(releases);

  // Structured data for the newest release so search engines attach it to the band.
  const releaseJsonLd = featured && {
    '@context': 'https://schema.org',
    '@type': featured.type === 'album' ? 'MusicAlbum' : 'MusicRecording',
    name: featured.title,
    byArtist: { '@type': 'MusicGroup', name: 'Malachias', url: SITE_URL },
    datePublished: featured.releaseDate,
    image: featured.artwork,
    url: `${SITE_URL}/#latest`,
    sameAs: [featured.appleUrl, youtubeWatchUrl(featured)],
  };

  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      {releaseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(releaseJsonLd).replace(/</g, '\\u003c') }}
        />
      )}

      {/* One top strip at a time: a real upcoming show wins over the campaign. */}
      {shows.length > 0
        ? <NextShowBanner shows={shows} />
        : campaignLive && <CampaignBanner path={campaign.config.path} label="Road to San Antonio" percent={campaignStats.percent} daysToEvent={campaignStats.daysToEvent} />}
      <LiveSessionBanner sessions={publicSessions} />
      <Navbar />

      {/* ── 1. HOOK — the band on stage + the newest release ──────── */}
      <Hero release={featured} />
      <SectionDivider accent="gold" />

      {/* ── 2. WHY — purpose before story ─────────────────────────── */}
      <Mission />

      {/* ── 2b. THE ROAD — Veterans Day 2026 campaign (hidden when inactive) ── */}
      <CampaignSection config={campaign.config} math={campaignStats} />

      {/* ── 3. WHO — origin story while they're emotionally open ──── */}
      <About aboutText={content.siteContent.aboutText} />

      {/* ── 4. THE SOUND — featured single, discography, videos ────── */}
      <Music releases={releases} mediaItems={mediaItems} />

      {/* ── 5. THE PEOPLE — humanize the band ────────────────────── */}
      <Band />
      <BandTogether />

      {/* ── 6. LIVE — see them in person ─────────────────────────── */}
      <Shows shows={shows} />

      {/* ── 7. PROOF — real, approved fan stories (hidden until some exist) */}
      <Testimonies stories={fanStories} />

      {/* ── 8. DEEP DIVE — doorway to /stories ───────────────────── */}
      <StoriesTeaser hasSongStories={hasSongStories} hasSetlist={hasSetlist} hasReflections={hasReflections} />

      {/* ── 9. COMMERCE ──────────────────────────────────────────── */}
      <Merch fourthwallProducts={fwProducts.map(fwCardProduct)} />

      {/* ── 10. CREDIBILITY + CONVERSION ─────────────────────────── */}
      <SectionDivider accent="crimson" />
      <PressFeature background="#040404" />
      <Press />
      <LessonsTeaser />
      <SectionDivider accent="gold" label="BROTHERHOOD" />
      <Booking />
      <Newsletter />
      <Footer />
      <BookingPopup />
      <SupportPopup />
    </main>
  );
}
