'use client';

import { motion } from 'framer-motion';

const PILLARS = [
  { icon: '✝', label: 'Faith',       text: 'Every lyric is a testimony. Every chord is worship. Scripture brought to the stage.' },
  { icon: '⭐', label: 'Service',     text: 'Founded by an Army veteran who carried the warrior ethos from combat into music.' },
  { icon: '⚔', label: 'Brotherhood', text: 'No soldier fights alone. No believer walks alone. A band of brothers in every sense.' },
  { icon: '🔥', label: 'Purpose',    text: 'We play for the hurting, the seeking, and the faithful. Music as mission.' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

export default function About() {
  return (
    <section id="about" className="bg-black section-pad">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4">Our Story</p>
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.08em] text-white">
            FORGED IN FAITH
          </h2>
          <hr className="gold-rule max-w-xs mx-auto mt-5" />
        </motion.div>

        {/* Story grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">

          {/* Text */}
          <motion.div {...fade(0.1)}>
            <p className="text-[#e8e0d0] text-lg leading-relaxed mb-5 font-display tracking-wider">
              "My Messenger" — that is what the name Malachias means.
            </p>
            <p className="text-[#8a7f70] leading-relaxed mb-5 text-[0.95rem]">
              Born from the battlefields of faith and service, Malachias was founded by an
              Army veteran who returned home carrying wounds both seen and unseen. Music became
              the vehicle for healing, proclamation, and unashamed worship.
            </p>
            <p className="text-[#8a7f70] leading-relaxed mb-5 text-[0.95rem]">
              From military bases to church stages, from festival fields to veteran communities,
              Malachias brings a sound that honors God, country, and the human spirit.
              Loud, intentional, and unapologetic — rock music with a higher calling.
            </p>
            <p className="text-[#8a7f70] leading-relaxed text-[0.95rem]">
              Every song is a dispatch from the front lines of faith. Every performance is a
              declaration that hope is alive, grace is real, and the battle is already won.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/[0.06]">
              {[['100+','Shows'],['15+','States'],['∞','Faith']].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <div className="font-display text-3xl text-[#c9a84c] tracking-wider">{val}</div>
                  <div className="label-xs mt-1" style={{ color: 'var(--text-2)' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Photo placeholder */}
          <motion.div {...fade(0.2)}>
            <div
              className="card aspect-[3/4] flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #0f0a04 0%, #0a0a0a 60%, #04080f 100%)' }}
            >
              <div className="text-center px-8">
                <div className="font-display text-[4rem] text-[#c9a84c]/10 tracking-widest mb-2">M</div>
                <p className="label-xs" style={{ color: 'var(--text-3)' }}>Band Photo</p>
              </div>
              {/* Corner accents */}
              {['top-0 left-0 border-t border-l','top-0 right-0 border-t border-r',
                'bottom-0 left-0 border-b border-l','bottom-0 right-0 border-b border-r']
                .map((cls) => (
                  <div key={cls} className={`absolute w-6 h-6 ${cls} border-[#c9a84c]/30`} />
                ))}
            </div>
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p, i) => (
            <motion.div key={p.label} {...fade(i * 0.08)} className="card p-6 group">
              <div
                className="h-px w-0 group-hover:w-full mb-5 transition-all duration-500"
                style={{ background: 'var(--gold)' }}
              />
              <span className="text-2xl block mb-3">{p.icon}</span>
              <h3 className="font-display text-xl tracking-wider text-[#c9a84c] mb-2">{p.label}</h3>
              <p className="text-[0.82rem] text-[#8a7f70] leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
