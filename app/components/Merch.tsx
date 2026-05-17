'use client';

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const DROPS = [
  {
    category: 'Apparel',
    name:     '"Faith Through Fire"',
    item:     'Pullover Hoodie',
    status:   'In Production',
    badge:    'Limited — 100 Run',
    story:    'Named after the song we wrote during the hardest season. Heavy cotton. Made to last.',
  },
  {
    category: 'Apparel',
    name:     '"No Man Left Behind"',
    item:     'Field Tee',
    status:   'Coming Soon',
    badge:    'First Run',
    story:    'For the brothers who showed up. Chest graphic. Black on black.',
  },
  {
    category: 'Accessories',
    name:     '"Malachi 3:1"',
    item:     'Field Patch Set — 3 Patches',
    status:   'In Production',
    badge:    'Limited — 200 Sets',
    story:    'Embroidered. Iron-on. Malachias crest, a cross, and the scripture that started all of this.',
  },
  {
    category: 'Music',
    name:     '"The Messenger"',
    item:     'Debut LP — Vinyl',
    status:   'Pre-Order Soon',
    badge:    'First Pressing',
    story:    'When the record is done. 12-inch. Limited first pressing. Pre-order list forming now.',
  },
  {
    category: 'Music',
    name:     '"Frontline Sessions"',
    item:     'Live Recording — Digital',
    status:   'Coming Soon',
    badge:    'Supporters Only',
    story:    'Raw live recordings from actual shows. No studio polish. Just the room.',
  },
];

export default function Merch() {
  return (
    <section id="merch" style={{ background: '#040404' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} className="mb-14">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            The Store
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            FIRST DROP
          </h2>
          <div
            className="mt-4 mb-5"
            style={{
              width: '3rem',
              height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
          <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '32rem' }}>
            Every piece is tied to a song, a story, or a reason.
            Nothing here is filler.
          </p>
        </motion.div>

        {/* Status strip */}
        <motion.div
          {...fade(0.06)}
          className="flex flex-wrap items-center gap-4 mb-10"
          style={{
            borderTop: '1px solid rgba(201,168,76,0.08)',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
            padding: '0.85rem 0',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', animation: 'glowPulse 2s ease-in-out infinite' }} />
            Production Underway
          </span>
          <span style={{ fontSize: '0.60rem', color: 'var(--text-3)', letterSpacing: '0.12em' }}>·</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em' }}>
            Supporters hear first when the drop lands
          </span>
        </motion.div>

        {/* Drop grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mb-12"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {DROPS.map((d, i) => (
            <motion.div
              key={d.name}
              {...fade(0.04 + i * 0.04)}
              style={{ background: '#040404', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', transition: 'background 0.3s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#080808')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#040404')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.56rem', letterSpacing: '0.28em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
                  {d.category}
                </span>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: 'var(--gold)', background: 'rgba(201,168,76,0.07)', padding: '0.2rem 0.55rem', textTransform: 'uppercase' }}>
                  {d.status}
                </span>
              </div>

              <div>
                <p className="font-display" style={{ fontSize: '1.1rem', color: '#e8ddd0', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {d.name}
                </p>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                  {d.item}
                </p>
              </div>

              <p style={{ fontSize: '0.73rem', color: 'var(--text-3)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.65rem', marginTop: 'auto' }}>
                {d.story}
              </p>

              <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.38)', textTransform: 'uppercase' }}>
                {d.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div {...fade(0.22)} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '28rem' }}>
            No store yet. When the first drop is ready, supporters hear first.
          </p>
          <a href="#newsletter" className="btn btn-primary shrink-0">
            Join the List
          </a>
        </motion.div>

      </div>
    </section>
  );
}
