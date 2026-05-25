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
  { word: 'Faith',     line: 'Messianic. Struggled with it for years. Still here.',             accent: 'var(--gold)'       },
  { word: 'Service',   line: "Medic. Infantryman. Bandsman. It didn't stop when we came home.", accent: 'var(--steel-warm)' },
  { word: 'Healing',   line: 'Reduce suicidal ideation. Lift from depression. Heal PTSD.',      accent: '#c04020'            },
];

export default function Mission() {
  return (
    <section id="mission" className="section-pad relative overflow-hidden" style={{ background: '#020202' }}>

      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', top: '4%', right: '-1%' }}>02</div>

      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 58% 48% at 50% 65%, rgba(100,14,8,0.14) 0%, rgba(60,8,4,0.06) 55%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '40vw', height: '50%',
        background: 'radial-gradient(ellipse, rgba(90,38,6,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <Embers count={12} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative" style={{ zIndex: 2 }}>

        <motion.div {...fade()} className="mb-16">
          <p className="label-xs mb-3" style={{ color: 'rgba(192,64,32,0.80)', letterSpacing: '0.40em' }}>
            Why We Play
          </p>
          <div style={{
            width: '3rem', height: '1px',
            background: 'linear-gradient(to right, rgba(192,64,32,0.55), rgba(201,168,76,0.12), transparent)',
          }} />
        </motion.div>

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

          {/* Right — the real mission */}
          <div className="space-y-5 lg:pt-2">
            <motion.p {...fade(0.10)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              The veterans who came home from Iraq and Afghanistan carrying things
              nobody talks about at the dinner table.
              The believers whose faith got knocked sideways by years of hard living.
              The people sitting alone at 2am who don&apos;t know if they&apos;ll make it to morning.
            </motion.p>

            <motion.p {...fade(0.15)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              This is who we play for. Not as a tagline.
              Because we&apos;ve been in those rooms. The founder came home from two tours in Iraq
              and spent years finding his way back. Music opened the door.
              Faith came through it.
            </motion.p>

            <motion.p {...fade(0.20)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
              The mission of Malachias is specific: reduce suicidal ideation,
              lift people from depression, help heal and lessen the triggers PTSD leaves behind.
              Every show is that mission in action.
            </motion.p>

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
