'use client';

import { motion } from 'framer-motion';

const VOICES = [
  {
    quote: "I came back from Iraq not knowing how to be in a room with my family anymore. I heard one of their songs at a church in Fresno and sat in my truck for an hour after. First time I cried since I got home.",
    from: "Army Veteran — 3 Tours",
    tag: "VETERAN",
    tagColor: '#c04020',
  },
  {
    quote: "My brother made me go. I wasn't expecting anything. But there was something in that music that felt like it was speaking to where I actually was — not some polished version of faith, but the broken kind.",
    from: "Fresno, CA — February 2025",
    tag: "ATTENDEE",
    tagColor: '#c9a84c',
  },
  {
    quote: "My son hasn't talked about his deployment in four years. After the show he sat down with me and we talked until 2 in the morning. I don't know what happened in that room. But something did.",
    from: "Parent of a Veteran",
    tag: "FAMILY",
    tagColor: '#7a8090',
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Testimonies() {
  return (
    <section
      id="testimonies"
      className="section-pad relative overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Ghost section numeral */}
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

        {/* Header */}
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

        {/* Testimonies — text floating in void, no cards */}
        <div className="space-y-16 lg:space-y-20">
          {VOICES.map((v, i) => (
            <motion.div
              key={v.tag}
              {...fade(0.08 + i * 0.10)}
              className="relative"
              style={{ paddingLeft: i === 1 ? 'min(8vw, 5rem)' : 0 }}
            >
              {/* Giant ghost quote mark — behind the words */}
              <div
                aria-hidden="true"
                className="font-display absolute select-none pointer-events-none"
                style={{
                  top: '-1.8rem',
                  left: i === 1 ? 'calc(min(7.5vw, 4.5rem) - 0.5rem)' : '-0.5rem',
                  fontSize: 'clamp(5rem, 12vw, 8rem)',
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: `1px ${v.tagColor}28`,
                  zIndex: 0,
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </div>

              <div className="relative" style={{ zIndex: 1 }}>
                {/* Tag */}
                <span style={{
                  display: 'block',
                  marginBottom: '0.9rem',
                  fontSize: '0.55rem',
                  letterSpacing: '0.45em',
                  color: v.tagColor,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                }}>
                  {v.tag}
                </span>

                {/* Quote — the voice itself */}
                <p style={{
                  fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                  lineHeight: 1.70,
                  color: 'rgba(232,221,208,0.74)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-body)',
                  maxWidth: '50rem',
                  marginBottom: '1.25rem',
                }}>
                  {`“${v.quote}”`}
                </p>

                {/* Attribution */}
                <p style={{
                  fontSize: '0.64rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(80,68,52,0.72)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                }}>
                  — {v.from}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
