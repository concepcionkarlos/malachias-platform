// Page — /stories: the deep-dive half of the site, moved off the homepage so the
// front door stays short. Behind the Song, the setlist, the daily word (War Room),
// field notes (journal) and the fan-story form. Section ids are unchanged
// (#stories, #setlist, #warroom, #journal, #fanstory) so links can land on each.
//
// Same data rules as the homepage: read once on the server, handed down as props,
// and the setlist never carries lyrics, chords or notes.
import type { Metadata } from 'next';
import { readContent } from '@/lib/store';
import { getSongs } from '@/lib/venueStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SongStories from '../components/SongStories';
import Setlist, { type PublicSong } from '../components/Setlist';
import WarRoom from '../components/WarRoom';
import Journal from '../components/Journal';
import FanStoryForm from '../components/FanStoryForm';
import Newsletter from '../components/Newsletter';

export const metadata: Metadata = {
  title: 'Stories — MALACHIAS',
  description: 'The stories behind the songs, what Malachias plays live, a daily word from the War Room, field notes from the road — and a place to share what a song did for you.',
  alternates: { canonical: '/stories' },
  openGraph: {
    title: 'Stories — MALACHIAS',
    description: 'Behind the songs, the setlist, the daily word and field notes from Malachias.',
    type: 'website',
    url: '/stories',
    images: [{ url: '/og-malachias.jpg', width: 1200, height: 630, alt: 'Malachias — Christian Rock Band' }],
  },
};

export default async function StoriesPage() {
  const [content, songs] = await Promise.all([
    readContent(),
    getSongs().catch(() => []),
  ]);

  const songStories = (content.songStories ?? [])
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order);
  const reflections = (content.dailyReflections ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  // Only what the public section needs — never lyrics, chords, or notes.
  const publicSongs: PublicSong[] = songs
    .filter(s => s.status === 'ready')
    .sort((a, b) => a.order - b.order)
    .map(({ id, title, type, originalArtist }) => ({ id, title, type, originalArtist }));

  // Jump links only for the sections that will actually render.
  const jumps = [
    songStories.length > 0 && { href: '#stories', label: 'Behind the Song' },
    publicSongs.length > 0 && { href: '#setlist', label: 'Setlist' },
    reflections.length > 0 && { href: '#warroom', label: 'Daily Word' },
    { href: '#journal', label: 'Field Notes' },
    { href: '#fanstory', label: 'Share Your Story' },
  ].filter((j): j is { href: string; label: string } => Boolean(j));

  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />

      <section style={{ background: '#030201', paddingTop: 'clamp(7rem, 14vw, 10rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>For the ones who stay</p>
          <h1 className="font-display mt-4 text-white" style={{ fontSize: 'clamp(2.9rem, 8vw, 5.4rem)', lineHeight: 0.9, letterSpacing: '0.04em' }}>
            STORIES
          </h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            Where the songs came from, what we play when the lights go down, a word for the day, and notes from the field. If a song carried you somewhere, tell us at the bottom.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-x-6 gap-y-1">
            {jumps.map(j => (
              <a
                key={j.href}
                href={j.href}
                className="tap-link inline-flex items-center min-h-[44px]"
                style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c' }}
              >
                {j.label} →
              </a>
            ))}
          </nav>
        </div>
      </section>

      <SongStories stories={songStories} />
      <Setlist songs={publicSongs} />
      <WarRoom reflections={reflections} />
      <Journal />
      <FanStoryForm />
      <Newsletter />
      <Footer />
    </main>
  );
}
