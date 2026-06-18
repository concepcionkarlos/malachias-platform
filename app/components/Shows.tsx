'use client';

// Homepage "Upcoming Shows" section — fetches shows from /api/public/content and lists
// them with date block, venue/city/time, status badge, and ticket links. Renders a
// loading skeleton while fetching and hides the whole section when there are no shows.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Show } from '@/lib/data';
import { formatDate } from '@/lib/data';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const STATUS_COLOR: Record<string, string> = {
  Confirmed:  '#34d399',
  Pending:    '#c9a84c',
  Hold:       '#60a5fa',
  Cancelled:  '#5c5044',
};

export default function Shows() {
  const [shows, setShows] = useState<Show[] | null>(null);

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.shows)) setShows(d.shows); })
      .catch(() => setShows([]));
  }, []);

  // Don't render the section at all until we know if there are shows
  if (shows !== null && shows.length === 0) return null;

  return (
    <section id="shows" style={{ background: '#060606' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} className="mb-12">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Live
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            UPCOMING SHOWS
          </h2>
          <div
            className="mt-4"
            style={{
              width: '3rem', height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
        </motion.div>

        {/* Loading skeleton */}
        {shows === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: 72, background: '#060606', opacity: 0.5 }} />
            ))}
          </div>
        )}

        {/* Show list */}
        {shows && shows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
            {shows.map((show, i) => {
              const d = formatDate(show.date);
              const statusColor = STATUS_COLOR[show.showStatus ?? 'Confirmed'] ?? '#c9a84c';
              return (
                <motion.div
                  key={show.id}
                  {...fade(0.04 + i * 0.04)}
                  style={{
                    background: '#060606',
                    padding: '1.1rem 1.25rem',
                    display: 'grid',
                    gridTemplateColumns: '3.5rem 1fr auto',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'background 0.25s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#0a0a0a')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#060606')}
                >
                  {/* Date block */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#e8ddd0', lineHeight: 1, letterSpacing: '0.04em' }}>
                      {d.day}
                    </div>
                    <div style={{ fontSize: '0.56rem', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginTop: '0.15rem' }}>
                      {d.month}
                    </div>
                    <div style={{ fontSize: '0.52rem', letterSpacing: '0.14em', color: '#5c5044', marginTop: '0.1rem' }}>
                      {d.year}
                    </div>
                  </div>

                  {/* Venue info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#e8ddd0', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {show.venue}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#8a7f70', marginTop: '0.15rem', letterSpacing: '0.04em' }}>
                      {show.city}{show.time ? ` · ${show.time}` : ''}
                    </p>
                  </div>

                  {/* Right side — status + ticket */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: statusColor, textTransform: 'uppercase' }}>
                      {show.showStatus ?? 'Confirmed'}
                    </span>
                    {show.ticketUrl && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: '0.62rem', padding: '0.35rem 0.85rem', letterSpacing: '0.14em' }}
                      >
                        Tickets
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
