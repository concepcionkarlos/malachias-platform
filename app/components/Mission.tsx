'use client';

import { motion } from 'framer-motion';

const initiatives = [
  {
    number: '01',
    icon: '🎖',
    title: 'Veteran Support',
    description:
      'A portion of every ticket sale and merchandise purchase goes directly toward veteran mental health initiatives and transition programs. We never forget those who served.',
    tag: 'Support Our Heroes',
    color: '#c9a84c',
  },
  {
    number: '02',
    icon: '✝',
    title: 'Faith & Testimony',
    description:
      'Every concert is an altar call. Every song is a sermon. We believe music breaks down walls that words alone cannot — opening hearts to truth, grace, and transformation.',
    tag: 'Spread the Gospel',
    color: '#8b0000',
  },
  {
    number: '03',
    icon: '🤲',
    title: 'Community Outreach',
    description:
      'We show up for communities — partnering with churches, shelters, and local organizations to provide free concerts, mentorship, and tangible acts of service.',
    tag: 'Serve Together',
    color: '#4a7a4a',
  },
  {
    number: '04',
    icon: '🔥',
    title: 'Youth Mentorship',
    description:
      'The next generation deserves leaders, not just entertainers. We invest in youth through workshops, discipleship programs, and showing them that faith and rock music belong together.',
    tag: 'Build the Next Generation',
    color: '#c9a84c',
  },
];

const testimonies = [
  {
    quote: "This music found me at my lowest point. Three tours, a broken family, no faith left. Malachias was the soundtrack of my healing.",
    name: 'Sgt. Marcus T.',
    role: 'Army Veteran, 3 Tours',
  },
  {
    quote: "We brought Malachias to our church's revival night. The presence of God was undeniable. They don't just perform — they minister.",
    name: 'Pastor David L.',
    role: 'Grace Community Church',
  },
  {
    quote: "I never thought hard rock could move me to tears. But when they played 'No Man Left Behind,' I wept for every brother I've lost.",
    name: 'Cpl. James R.',
    role: 'Marine Corps Veteran',
  },
];

export default function Mission() {
  return (
    <section id="mission" className="relative py-28 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b0000]/50 to-transparent" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139,0,0,0.04) 0%, transparent 70%)' }}
        />
        {/* American flag stripes hint */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8b0000]/30 via-transparent to-[#8b0000]/30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a2d5a]/30 via-transparent to-[#1a2d5a]/30" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[#8b0000] text-xs tracking-[0.5em] uppercase mb-4">Why We Play</p>
          <h2
            className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-widest text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            THE MISSION
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Music is our weapon. Faith is our armor. Service is our calling.
            Malachias exists not to entertain, but to transform — one soul, one community, one concert at a time.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8b0000]/60" />
            <span className="text-[#8b0000]">✝</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8b0000]/60" />
          </div>
        </motion.div>

        {/* Initiatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {initiatives.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="relative p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 group overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: item.color }}
              />
              {/* Number */}
              <div
                className="text-6xl font-black opacity-[0.06] absolute top-4 right-6 leading-none select-none"
                style={{ fontFamily: 'Georgia, serif', color: item.color }}
              >
                {item.number}
              </div>
              {/* Content */}
              <div className="relative">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <div
                  className="text-[0.6rem] tracking-[0.4em] uppercase px-2 py-1 inline-block mb-3"
                  style={{ color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.tag}
                </div>
                <h3
                  className="text-xl font-bold text-white mb-3 tracking-wide"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-10 text-center">Testimonies</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonies.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative p-6 border border-[#c9a84c]/15 bg-gradient-to-b from-white/[0.02] to-transparent group hover:border-[#c9a84c]/35 transition-all duration-500"
              >
                {/* Quote mark */}
                <div className="text-5xl text-[#c9a84c]/20 font-serif leading-none mb-4">"</div>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                <div className="border-t border-[#c9a84c]/15 pt-4">
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#c9a84c]/60 text-xs tracking-wider mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Banner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 relative overflow-hidden border border-[#8b0000]/40 p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1a0505 0%, #0d0d0d 50%, #050a1a 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #8b0000, #8b0000 20px, transparent 20px, transparent 40px)' }}
          />
          <div className="relative z-10">
            <p className="text-[#8b0000] text-xs tracking-[0.5em] uppercase mb-4">Make a Difference</p>
            <h3
              className="text-3xl font-black text-white mb-4 tracking-widest"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              STAND WITH US
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
              Every show attended, every shirt worn, every prayer offered moves the mission forward.
              Join the brotherhood. Stand for something bigger than yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#booking"
                className="px-8 py-4 bg-[#8b0000] hover:bg-[#a00000] text-white text-sm tracking-widest uppercase font-bold transition-colors duration-300"
              >
                Bring Us to Your Event
              </a>
              <a
                href="#newsletter"
                className="px-8 py-4 border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 text-sm tracking-widest uppercase font-bold transition-all duration-300"
              >
                Join the Brotherhood
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
