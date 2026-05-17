'use client';

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function About() {
  return (
    <section id="about" className="section-pad" style={{ background: '#050505' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Section marker — left-aligned, not centered */}
        <motion.div {...fade()} className="mb-12">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Origin
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            THE STORY
          </h2>
          <div
            className="mt-4"
            style={{
              width: '3rem',
              height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
        </motion.div>

        {/* Editorial two-column */}
        <div className="grid lg:grid-cols-[5fr_3fr] gap-12 lg:gap-20 items-start">

          {/* Left — narrative */}
          <div className="space-y-5">
            <motion.p {...fade(0.06)} className="tac-label" style={{ color: 'var(--gold-dim)', letterSpacing: '0.34em', fontSize: '0.58rem' }}>
              Malachi&nbsp;3:1
            </motion.p>

            <motion.blockquote {...fade(0.10)} className="left-bar font-display text-[1.25rem] tracking-wide leading-snug" style={{ color: 'var(--text-1)' }}>
              "My messenger — that is what Malachias means."
            </motion.blockquote>

            <motion.p {...fade(0.14)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              The name comes from Malachi 3:1. It seemed right.
            </motion.p>

            <motion.p {...fade(0.18)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              Malachias was started by a U.S. Army veteran who came back from deployment
              changed, the way most veterans do. Music and faith were the two things that
              still made sense in the aftermath — so he started a band.
            </motion.p>

            <motion.p {...fade(0.22)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              We play Christian rock. Loud, honest music that comes from real places.
              Songs about doubt, struggle, redemption, and the kind of hope that
              doesn&apos;t come easy.
            </motion.p>

            <motion.p {...fade(0.26)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              We&apos;re a small band, still growing. But every show we play is for the
              people in the room who need to hear something true tonight.
            </motion.p>
          </div>

          {/* Right — pull quote, no box or border */}
          <motion.div {...fade(0.16)} className="lg:pt-16">
            <p
              className="font-display leading-[1.1] tracking-[0.04em]"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                color: 'rgba(237,229,216,0.10)',
              }}
            >
              We came back.
              <br />
              We found faith again.
              <br />
              We started a band.
            </p>
            <div
              className="mt-8"
              style={{
                width: '1.5rem',
                height: '1px',
                background: 'rgba(201,168,76,0.22)',
              }}
            />
            <p
              className="mt-4 text-[0.66rem] tracking-[0.22em] uppercase italic"
              style={{ color: 'rgba(120,100,70,0.42)' }}
            >
              Malachi 3:1
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
