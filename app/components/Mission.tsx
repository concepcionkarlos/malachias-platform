'use client';

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const VALUES = [
  { word: 'Faith',       line: 'Not the comfortable kind.' },
  { word: 'Brotherhood', line: 'We don\'t leave anyone behind.' },
  { word: 'Service',     line: 'It didn\'t stop when we came home.' },
];

export default function Mission() {
  return (
    <section id="mission" className="section-pad relative overflow-hidden" style={{ background: '#070707' }}>

      {/* Ambient warm center glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(90,38,6,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-5xl mx-auto px-6 relative">

        {/* Section marker */}
        <motion.div {...fade()} className="mb-16">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Why We Play
          </p>
          <div style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.45), transparent)' }} />
        </motion.div>

        {/* Editorial two-column */}
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start mb-16">

          {/* Left — direct statement */}
          <div>
            <motion.p
              {...fade(0.06)}
              className="font-display leading-[1.04]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'rgba(237,229,216,0.90)' }}
            >
              We play because we need to.
            </motion.p>
            <motion.p
              {...fade(0.10)}
              className="font-display leading-[1.04] mt-1"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'rgba(237,229,216,0.28)' }}
            >
              And because someone out there does too.
            </motion.p>
          </div>

          {/* Right — raw honest copy */}
          <div className="space-y-5 lg:pt-2">
            <motion.p {...fade(0.10)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              The veterans who came home changed and can&apos;t explain to their families why.
              The believers whose faith got knocked around by years of hard living.
              The people sitting in a room who stopped feeling anything and don&apos;t know why.
            </motion.p>

            <motion.p {...fade(0.15)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              This is who we play for.
            </motion.p>

            <motion.p {...fade(0.20)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              Not as a marketing statement.
              Because we&apos;ve been in those rooms ourselves.
              Because music was the thing that cracked us open when nothing else could.
            </motion.p>

            {/* Values */}
            <motion.div
              {...fade(0.24)}
              className="pt-6 flex flex-col sm:flex-row gap-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {VALUES.map(v => (
                <div key={v.word}>
                  <p className="font-display text-sm tracking-[0.16em] mb-1" style={{ color: 'var(--gold)' }}>
                    {v.word}
                  </p>
                  <p className="text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                    {v.line}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div {...fade(0.22)}>
          <a href="#booking" className="btn btn-primary">
            Bring Us to Your Event
          </a>
        </motion.div>

      </div>
    </section>
  );
}
