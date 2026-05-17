'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const pillars = [
  {
    icon: '✝',
    title: 'Faith',
    text: 'Every lyric is a testimony. Every chord is worship. We bring scripture to the stage and let truth cut through the noise.',
  },
  {
    icon: '🎖',
    title: 'Service',
    text: 'Founded by an Army veteran who traded combat boots for a guitar, Malachias carries the warrior ethos into every performance.',
  },
  {
    icon: '🤝',
    title: 'Brotherhood',
    text: 'No soldier fights alone. No believer walks alone. This band is a band of brothers united by faith, sacrifice, and purpose.',
  },
  {
    icon: '🔥',
    title: 'Purpose',
    text: 'Music is the mission. We play for the hurting, the seeking, the faithful, and the forgotten — igniting hope wherever we go.',
  },
];

function Pillar({ icon, title, text, delay }: { icon: string; title: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="relative p-6 border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-all duration-500 group bg-white/[0.02] hover:bg-white/[0.04]"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-3xl mb-4 block">{icon}</span>
      <h3 className="text-[#c9a84c] text-sm tracking-[0.25em] uppercase font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-28 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)' }}
        />
        {/* Large cross silhouette */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03]">
          <svg width="400" height="600" viewBox="0 0 400 600" fill="white">
            <rect x="170" y="0" width="60" height="600" />
            <rect x="0" y="160" width="400" height="60" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-4">Our Story</p>
          <h2
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-widest text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            FORGED IN FAITH
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <span className="text-[#c9a84c]">✝</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>
        </motion.div>

        {/* Story block */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[#c9a84c]/70 text-xs tracking-[0.4em] uppercase mb-4">
              — The Band
            </p>
            <p className="text-gray-200 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Malachias was born from the battlefields of faith and service. Founded by an Army veteran
              who returned home carrying wounds both seen and unseen, the band became a vehicle for
              healing, proclamation, and unashamed worship through rock music.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              The name Malachias — drawn from the Old Testament prophet whose name means
              <em className="text-[#c9a84c]"> "My Messenger"</em> — defines the band's calling.
              Every song is a dispatch from the front lines of faith. Every performance is a
              declaration that hope is alive, grace is real, and the battle is already won.
            </p>
            <p className="text-gray-400 leading-relaxed">
              From military bases to church stages, from festival fields to veteran communities,
              Malachias brings a sound that honors God, country, and the human spirit. Loud,
              intentional, and unapologetic — this is rock music with a higher calling.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#c9a84c]/15">
              {[
                { val: '100+', label: 'Shows' },
                { val: '15+', label: 'States' },
                { val: '∞', label: 'Faith' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
                    {stat.val}
                  </div>
                  <div className="text-[0.7rem] tracking-widest text-gray-500 uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual — placeholder band photo area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div
              className="aspect-[4/5] relative overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.25)' }}
            >
              {/* Placeholder image area */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#0d0d0d] to-[#0a1520]" />
              {/* Cross light effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-20 bg-[#c9a84c]/10 rounded-full blur-3xl" />
                  <svg width="120" height="160" viewBox="0 0 120 160" fill="none" className="relative z-10">
                    <rect x="52" y="0" width="16" height="160" fill="url(#crossGrad)" />
                    <rect x="0" y="44" width="120" height="16" fill="url(#crossGrad)" />
                    <defs>
                      <linearGradient id="crossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#8b6914" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-[0.65rem] tracking-[0.4em] text-[#c9a84c]/60 uppercase">
                  Band Photo
                </p>
                <p className="text-white text-sm font-semibold tracking-wider mt-1">Malachias</p>
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a84c]/60" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c9a84c]/60" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c9a84c]/60" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a84c]/60" />
            </div>
          </motion.div>
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <Pillar key={p.title} {...p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
