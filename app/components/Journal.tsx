'use client';

import { motion } from 'framer-motion';

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

const ENTRIES = [
  {
    tag:     'Origin',
    date:    'Fort Wayne, Indiana',
    title:   'Why this started here.',
    excerpt: "Fort Wayne is home. The Guard unit was here. The decision to enlist was made here. When I came back from Iraq the second time — as a bandsman, of all things — I came back here. Malachias started in Fort Wayne because everything that made it necessary happened in Fort Wayne.",
  },
  {
    tag:     'Service',
    date:    'Iraq · 2006–2014',
    title:   'Two deployments. Two different men.',
    excerpt: "First tour as a medic. Second tour as an Army bandsman. I went over there holding people together with my hands. I came back the second time holding a guitar. Those aren't as different as they sound. Both are about being present when someone needs something real.",
  },
  {
    tag:     'Mission',
    date:    'The reason we play',
    title:   'Reduce suicidal ideation. That\'s the mission.',
    excerpt: "That's not a general statement. That's the specific reason Malachias exists. Veterans carrying things nobody talks about. People whose faith got worn down by years of hard living. Anyone who's at the bottom and not sure what's on the other side. That's who this music is for.",
  },
];

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
          {ENTRIES.map((e, i) => (
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
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
