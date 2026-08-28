'use client';

// Homepage "Voices from the Room" section — real fan stories submitted through the
// FanStoryForm and approved in the admin. Passed in from the server (page.tsx);
// renders nothing until at least one story has been approved, so the site never
// shows made-up quotes.

import { motion } from 'framer-motion';
import type { FanStory } from '@/lib/data';

const ACCENTS = ['#c04020', '#c9a84c', '#7a8090'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

interface TestimoniesProps {
  stories: FanStory[];
}

export default function Testimonies({ stories }: TestimoniesProps) {
  if (stories.length === 0) return null;
  const voices = stories.slice(0, 3);

  return (
    <section
      id="testimonies"
      className="section-pad relative overflow-hidden"
      style={{ background: '#000000' }}
    >
      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', bottom: '4%', right: '-1%' }}>03</div>

      {/* Faint warm center glow — a candle in the dark */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '35%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '65vw', height: '55%',
        background: 'radial-gradient(ellipse, rgba(55,22,4,0.12) 0%, transparent 72%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-5xl mx-auto px-6 relative" style={{ zIndex: 1 }}>

        <motion.div {...fade()} className="mb-16 lg:mb-20">
          <p className="label-xs mb-3" style={{ color: 'rgba(192,64,32,0.72)', letterSpacing: '0.40em' }}>
            Voices from the Room
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            WHAT HAPPENED
          </h2>
          <div style={{
            width: '3rem', height: '1px', marginTop: '1rem',
            background: 'linear-gradient(to right, rgba(192,64,32,0.50), transparent)',
          }} />
        </motion.div>

        <div className="space-y-16 lg:space-y-20">
          {voices.map((v, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const who = v.name && v.name !== 'Anonymous' ? v.name : 'Anonymous';
            return (
              <motion.div
                key={v.id}
                {...fade(0.08 + i * 0.10)}
                className="relative"
                style={{ paddingLeft: i === 1 ? 'min(8vw, 5rem)' : 0 }}
              >
                <div
                  aria-hidden="true"
                  className="font-display absolute select-none pointer-events-none"
                  style={{
                    top: '-1.8rem',
                    left: i === 1 ? 'calc(min(7.5vw, 4.5rem) - 0.5rem)' : '-0.5rem',
                    fontSize: 'clamp(5rem, 12vw, 8rem)',
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `1px ${accent}28`,
                    zIndex: 0,
                  }}
                >
                  &ldquo;
                </div>

                <div className="relative" style={{ zIndex: 1 }}>
                  <span style={{
                    display: 'block',
                    marginBottom: '0.9rem',
                    fontSize: '0.62rem',
                    letterSpacing: '0.40em',
                    color: accent,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                  }}>
                    {v.songTitle ? `On “${v.songTitle}”` : 'Fan story'}
                  </span>

                  <p style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                    lineHeight: 1.70,
                    color: 'rgba(232,221,208,0.74)',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-body)',
                    maxWidth: '50rem',
                    marginBottom: '1.25rem',
                    whiteSpace: 'pre-line',
                  }}>
                    {`“${v.story}”`}
                  </p>

                  <p style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.22em',
                    color: 'rgba(150,130,100,0.85)',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                  }}>
                    — {who}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fade(0.3)} style={{ marginTop: '4rem' }}>
          <a href="#fanstory" className="btn btn-ghost" style={{ fontSize: '0.62rem', letterSpacing: '0.20em' }}>
            Share what a song did for you
          </a>
        </motion.div>

      </div>
    </section>
  );
}
