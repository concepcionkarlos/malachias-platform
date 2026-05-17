'use client';

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Mission() {
  return (
    <section id="mission" className="section-pad" style={{ background: '#070707' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Section marker */}
        <motion.div {...fade()} className="mb-16">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Why We Play
          </p>
          <div
            style={{
              width: '3rem',
              height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.45), transparent)',
            }}
          />
        </motion.div>

        {/* Editorial two-column — pull quote left, text right */}
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start mb-16">

          {/* Left — anchor statement in large type */}
          <motion.div {...fade(0.06)}>
            <p
              className="font-display leading-[1.05] tracking-[0.03em]"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                color: 'rgba(237,229,216,0.82)',
              }}
            >
              Some music is entertainment.
            </p>
            <p
              className="font-display leading-[1.05] tracking-[0.03em] mt-2"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                color: 'rgba(237,229,216,0.28)',
              }}
            >
              We don&apos;t make that kind.
            </p>
          </motion.div>

          {/* Right — honest supporting text */}
          <div className="space-y-5 lg:pt-2">
            <motion.p {...fade(0.10)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              We make music for the people who are carrying things they can&apos;t put down.
              Veterans who came home but can&apos;t sleep. People whose faith got knocked
              around by life. Anyone who needed something real and couldn&apos;t find it.
            </motion.p>

            <motion.p {...fade(0.15)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              We play because music was the thing that cracked us open and let light
              back in. We play because someone else might need that tonight.
            </motion.p>

            {/* Values — simple horizontal, no cards */}
            <motion.div
              {...fade(0.20)}
              className="pt-6 flex flex-col sm:flex-row gap-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {(['Faith', 'Brotherhood', 'Service'] as const).map(v => (
                <div key={v}>
                  <p
                    className="font-display text-sm tracking-[0.16em] mb-1"
                    style={{ color: 'var(--gold)' }}
                  >
                    {v}
                  </p>
                  <p className="text-[0.78rem] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                    {v === 'Faith'        && "Believing even when it's hard."}
                    {v === 'Brotherhood'  && 'Showing up for each other.'}
                    {v === 'Service'      && 'Giving what you have.'}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div {...fade(0.18)}>
          <a href="#booking" className="btn btn-primary">
            Book Us for Your Event
          </a>
        </motion.div>

      </div>
    </section>
  );
}
