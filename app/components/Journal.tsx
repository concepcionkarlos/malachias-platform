'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { JOURNAL_ENTRIES } from '@/lib/journalEntries';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const TAG_COLORS: Record<string, string> = {
  Origin:    '#c9a84c',
  Service:   '#8a7f70',
  Mission:   'rgba(201,168,76,0.50)',
};

export default function Journal() {
  return (
    <section id="journal" style={{ background: '#080808' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} className="mb-12">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            From the Field
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            LATEST
          </h2>
          <div
            className="mt-4"
            style={{
              width: '3rem', height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {JOURNAL_ENTRIES.map((e, i) => (
            <motion.article
              key={e.title}
              {...fade(0.06 + i * 0.06)}
              style={{ background: '#080808', padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', transition: 'background 0.3s' }}
              onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.background = '#0d0d0d')}
              onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.background = '#080808')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.60rem', letterSpacing: '0.22em', color: TAG_COLORS[e.tag], textTransform: 'uppercase' }}>
                  {e.tag}
                </span>
                <span style={{ fontSize: '0.60rem', color: 'var(--text-3)' }}>·</span>
                <span style={{ fontSize: '0.60rem', letterSpacing: '0.10em', color: 'var(--text-3)' }}>
                  {e.date}
                </span>
              </div>

              <h3 className="font-display" style={{ fontSize: '1.25rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.1 }}>
                {e.title}
              </h3>

              <p style={{ fontSize: '0.80rem', lineHeight: 1.7, color: 'var(--text-3)', flex: 1 }}>
                {e.excerpt}
              </p>

              <Link
                href={`/journal/${e.slug}`}
                style={{
                  fontSize: '0.60rem',
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.70)',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  borderBottom: '1px solid rgba(201,168,76,0.25)',
                  paddingBottom: '1px',
                  transition: 'color 0.2s',
                }}
              >
                Read more →
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
