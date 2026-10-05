// Homepage "Stories" block — a short doorway to /stories, where the deep-dive
// sections live (Behind the Song, setlist, daily word, field notes, fan stories).
// Links are only shown for sections that have something in them.

import Link from 'next/link';

interface Props {
  hasSongStories: boolean;
  hasSetlist: boolean;
  hasReflections: boolean;
}

export default function StoriesTeaser({ hasSongStories, hasSetlist, hasReflections }: Props) {
  const links = [
    hasSongStories && { href: '/stories#stories', label: 'Behind the Song', note: 'Where each song came from' },
    hasSetlist     && { href: '/stories#setlist', label: 'The Setlist',     note: 'What we play live' },
    { href: '/stories#journal', label: 'Field Notes', note: 'From the road and the service' },
    hasReflections && { href: '/stories#warroom', label: 'Daily Word',      note: 'A verse and a song for today' },
  ].filter((l): l is { href: string; label: string; note: string } => Boolean(l));

  return (
    <section id="stories-teaser" className="section-pad" style={{ background: '#050403' }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[2fr_3fr] gap-8 lg:gap-14 items-start">
        <div>
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Go deeper</p>
          <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)' }}>
            THE STORIES<br /><span style={{ color: '#c9a84c' }}>BEHIND THE NOISE</span>
          </h2>
          <Link
            href="/stories"
            className="tap-link mt-5"
            style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}
          >
            All stories →
          </Link>
        </div>

        <ul className="grid sm:grid-cols-2 gap-px" style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.12)' }}>
          {links.map(l => (
            <li key={l.href} style={{ background: '#050403' }}>
              <Link href={l.href} className="group flex flex-col justify-center h-full min-h-[88px] px-5 py-4 transition-colors duration-300 hover:bg-[#0b0806]" style={{ textDecoration: 'none' }}>
                <span className="font-display group-hover:text-[#c9a84c] transition-colors duration-300" style={{ fontSize: '1.35rem', letterSpacing: '0.06em', color: '#ede5d8', lineHeight: 1.1 }}>
                  {l.label} →
                </span>
                <span className="mt-1 text-[0.8rem]" style={{ color: 'var(--text-2)' }}>{l.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
