'use client';

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const INITIATIVES = [
  {
    num: '01',
    title: 'Veteran Support',
    body: 'A portion of every ticket and merchandise purchase goes directly toward veteran mental health initiatives and transition programs.',
    tag: 'Support Our Heroes',
    accent: '#c9a84c',
  },
  {
    num: '02',
    title: 'Faith & Testimony',
    body: 'Every concert is an altar call. Music breaks walls that words alone cannot — opening hearts to truth, grace, and transformation.',
    tag: 'Spread the Gospel',
    accent: '#8b0000',
  },
  {
    num: '03',
    title: 'Community Outreach',
    body: 'We partner with churches, shelters, and local organizations to provide free concerts, mentorship, and tangible acts of service.',
    tag: 'Serve Together',
    accent: '#4a7a4a',
  },
  {
    num: '04',
    title: 'Youth Mentorship',
    body: 'We invest in the next generation through workshops and discipleship — showing them faith and rock music belong together.',
    tag: 'Build the Future',
    accent: '#c9a84c',
  },
];

const QUOTES = [
  {
    quote: 'This music found me at my lowest point. Three tours, a broken family, no faith left. Malachias was the soundtrack of my healing.',
    name: 'Sgt. Marcus T.',
    role: 'Army Veteran · 3 Tours',
  },
  {
    quote: 'We brought Malachias to our revival night. The presence of God was undeniable. They don\'t just perform — they minister.',
    name: 'Pastor David L.',
    role: 'Grace Community Church',
  },
  {
    quote: 'I never thought hard rock could move me to tears. But when they played "No Man Left Behind" I wept for every brother I\'ve lost.',
    name: 'Cpl. James R.',
    role: 'Marine Corps Veteran',
  },
];

export default function Mission() {
  return (
    <section id="mission" className="bg-black section-pad">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4" style={{ color: '#8b0000', opacity: 1 }}>Why We Play</p>
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.08em] text-white">
            THE MISSION
          </h2>
          <p className="text-[#8a7f70] max-w-xl mx-auto mt-4 text-sm leading-relaxed">
            Music is our weapon. Faith is our armor. Service is our calling.
            Malachias exists not to entertain, but to transform.
          </p>
          <hr className="gold-rule max-w-xs mx-auto mt-5" />
        </motion.div>

        {/* Initiatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {INITIATIVES.map((item, i) => (
            <motion.div key={item.num} {...fade(i * 0.1)} className="card p-8 group relative overflow-hidden">
              {/* Left accent on hover */}
              <div
                className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-500"
                style={{ background: item.accent }}
              />
              {/* Big number watermark */}
              <span
                className="absolute top-4 right-6 font-display text-[5rem] leading-none select-none pointer-events-none"
                style={{ color: item.accent, opacity: 0.05 }}
              >
                {item.num}
              </span>
              <div className="relative">
                <span
                  className="inline-block text-[0.58rem] tracking-[0.35em] uppercase px-2 py-1 mb-4"
                  style={{ color: item.accent, border: `1px solid ${item.accent}35` }}
                >
                  {item.tag}
                </span>
                <h3 className="font-display text-2xl tracking-wider text-white mb-3">{item.title}</h3>
                <p className="text-[0.85rem] text-[#8a7f70] leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <p className="label-xs text-center mb-8">Testimonies</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {QUOTES.map((q, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className="card p-6">
              <div className="font-display text-5xl text-[#c9a84c]/15 leading-none mb-3">"</div>
              <p className="text-[0.85rem] text-[#8a7f70] leading-relaxed italic mb-6">
                "{q.quote}"
              </p>
              <div className="border-t border-white/[0.05] pt-4">
                <div className="text-white text-sm font-semibold">{q.name}</div>
                <div className="text-[0.68rem] tracking-wider text-[#c9a84c]/50 mt-1">{q.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          {...fade(0.1)}
          className="relative overflow-hidden border border-[#8b0000]/30 p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #0d0303 0%, #0a0a0a 100%)' }}
        >
          <p className="label-xs mb-3" style={{ color: '#8b0000', opacity: 1 }}>Make a Difference</p>
          <h3 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-[0.1em] text-white mb-4">
            STAND WITH US
          </h3>
          <p className="text-[#8a7f70] max-w-lg mx-auto mb-8 text-sm leading-relaxed">
            Every show attended, every shirt worn, every prayer offered moves the mission forward.
            Stand for something bigger than yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#booking"    className="btn-crimson">Bring Us to Your Event</a>
            <a href="#newsletter" className="btn-gold">Join the Brotherhood</a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
