'use client';

import { motion } from 'framer-motion';
import Embers from './Embers';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const VALUES = [
  { word: 'Faith',       line: 'Not the comfortable kind.',          accent: 'var(--gold)'        },
  { word: 'Brotherhood', line: "We don't leave anyone behind.",      accent: 'var(--steel-warm)'  },
  { word: 'Service',     line: "It didn't stop when we came home.",  accent: '#c04020'             },
];

export default function Mission() {
  return (
    <section id="mission" className="section-pad relative overflow-hidden" style={{ background: '#020202' }}>

      {/* Ghost section numeral */}
      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', top: '4%', right: '-1%' }}>02</div>

      {/* Deep crimson ambient — wounds, sacrifice, fire */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 58% 48% at 50% 65%, rgba(100,14,8,0.14) 0%, rgba(60,8,4,0.06) 55%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      {/* Amber leak — hope bleeding through the darkness */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-10%', right: '-5%',
        width: '40vw', height: '50%',
        background: 'radial-gradient(ellipse, rgba(90,38,6,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Embers rising from the base */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <Embers count={12} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative" style={{ zIndex: 2 }}>

        {/* Section marker — crimson-tinted, signals the emotional shift */}
        <motion.div {...fade()} className="mb-16">
          <p className="label-xs mb-3" style={{ color: 'rgba(192,64,32,0.80)', letterSpacing: '0.40em' }}>
            Why We Play
          </p>
          <div style={{
            width: '3rem', height: '1px',
            background: 'linear-gradient(to right, rgba(192,64,32,0.55), rgba(201,168,76,0.12), transparent)',
          }} />
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
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'rgba(237,229,216,0.25)' }}
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

            {/* Values — Faith (gold) / Brotherhood (warm steel) / Service (crimson) */}
            <motion.div
              {...fade(0.24)}
              className="pt-6 flex flex-col sm:flex-row gap-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              {VALUES.map(v => (
                <div key={v.word}>
                  <p className="font-display text-sm tracking-[0.16em] mb-1" style={{ color: v.accent }}>
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

        {/* Battle rule signals the end of the darkest section */}
        <motion.div {...fade(0.28)}>
          <hr className="battle-rule mb-8" />
          <a href="#booking" className="btn btn-primary">
            Bring Us to Your Event
          </a>
        </motion.div>

      </div>
    </section>
  );
}
