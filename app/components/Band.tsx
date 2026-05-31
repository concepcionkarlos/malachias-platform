'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MEMBERS = [
  {
    num: '01',
    name: 'MALACHIAS',
    role: 'Director · Vocals · Guitar',
    tag: 'FOUNDER & DIRECTOR',
    tagColor: '#c9a84c',
    photos: ['/Malachias 1.jpeg', '/malachias 2.jpeg'],
    bio: 'The voice and the vision. After two tours in Iraq — first as a medic, then as an Army bandsman — he came home carrying something that needed to come out. Malachias is his name in its ancient form: the messenger. That\'s not a stage name. That\'s a calling. He leads the band the way he led in service: with conviction, without apology, and always for the ones who need it most.',
    pull: 'The messenger.\nThe mission.\nThe music.',
    flip: false,
  },
  {
    num: '02',
    name: 'HENRY',
    role: 'Drums',
    tag: 'DRUMMER',
    tagColor: '#c04020',
    photos: ['/Henry Drums.PNG', '/Henry Drums 2.PNG'],
    bio: 'The pulse beneath the mission. Henry plays like a man who understands what it means to hold the line — steady when everything around you is shaking, driving forward when others go quiet. Every song hits harder because he\'s back there, anchoring the sound to something solid and unstoppable.',
    pull: 'The rhythm\nthat holds\nthe line.',
    flip: true,
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function MemberCard({ m, index }: { m: typeof MEMBERS[0]; index: number }) {
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const baseDelay = index * 0.12;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : m.flip ? '1fr 1fr' : '1fr 1fr',
        gap: mobile ? 0 : '4vw',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Ghost ordinal */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: mobile ? '-1rem' : '-2rem',
          [m.flip && !mobile ? 'right' : 'left']: '-0.5rem',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 18vw, 14rem)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.06)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {m.num}
      </div>

      {/* Photo column — order swaps on flip */}
      <motion.div
        {...fade(baseDelay)}
        style={{
          order: mobile ? 1 : m.flip ? 2 : 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Photo switcher */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: mobile ? '4/5' : '3/4',
            cursor: m.photos.length > 1 ? 'pointer' : 'default',
            overflow: 'hidden',
            borderRadius: 2,
          }}
          onClick={() => m.photos.length > 1 && setActive(p => (p + 1) % m.photos.length)}
        >
          {m.photos.map((src, i) => (
            <motion.div
              key={src}
              animate={{ opacity: active === i ? 1 : 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                WebkitMaskImage: mobile
                  ? 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.5) 75%, transparent 100%)'
                  : m.flip
                    ? 'linear-gradient(to right, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)'
                    : 'linear-gradient(to left, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)',
                maskImage: mobile
                  ? 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.5) 75%, transparent 100%)'
                  : m.flip
                    ? 'linear-gradient(to right, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)'
                    : 'linear-gradient(to left, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            >
              <Image
                src={src}
                alt={m.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1023px) 100vw, 45vw"
                style={{
                  filter: 'contrast(1.08) brightness(0.88) saturate(0.72)',
                  mixBlendMode: 'normal',
                }}
              />
            </motion.div>
          ))}

          {/* Warm glow beneath photo */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '40%',
            background: `radial-gradient(ellipse at 50% 100%, ${m.tagColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Photo toggle hint */}
          {m.photos.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                zIndex: 3,
                display: 'flex',
                gap: 5,
              }}
            >
              {m.photos.map((_, i) => (
                <div
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i); }}
                  style={{
                    width: active === i ? 18 : 6,
                    height: 3,
                    borderRadius: 99,
                    background: active === i ? m.tagColor : 'rgba(255,255,255,0.25)',
                    transition: 'width 0.3s, background 0.3s',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Text column */}
      <div
        style={{
          order: mobile ? 2 : m.flip ? 1 : 2,
          position: 'relative',
          zIndex: 1,
          paddingTop: mobile ? '1.5rem' : 0,
        }}
      >
        {/* Tag */}
        <motion.span
          {...fade(baseDelay + 0.06)}
          style={{
            display: 'block',
            fontSize: '0.54rem',
            letterSpacing: '0.42em',
            color: m.tagColor,
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          {m.tag}
        </motion.span>

        {/* Name */}
        <motion.h3
          {...fade(baseDelay + 0.10)}
          className="font-display"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.88,
            letterSpacing: '0.06em',
            color: '#ede5d8',
            marginBottom: '0.6rem',
          }}
        >
          {m.name}
        </motion.h3>

        {/* Role */}
        <motion.p
          {...fade(baseDelay + 0.13)}
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            color: 'rgba(201,168,76,0.45)',
            textTransform: 'uppercase',
            marginBottom: '1.8rem',
          }}
        >
          {m.role}
        </motion.p>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: baseDelay + 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '3rem',
            height: '1px',
            background: `linear-gradient(to right, ${m.tagColor}80, transparent)`,
            transformOrigin: 'left',
            marginBottom: '1.6rem',
          }}
        />

        {/* Bio */}
        <motion.p
          {...fade(baseDelay + 0.18)}
          style={{
            fontSize: '0.88rem',
            lineHeight: 1.78,
            color: 'rgba(220,210,195,0.65)',
            fontFamily: 'var(--font-body)',
            maxWidth: '30rem',
            marginBottom: '2.4rem',
          }}
        >
          {m.bio}
        </motion.p>

        {/* Pull quote */}
        <motion.p
          {...fade(baseDelay + 0.22)}
          className="font-display"
          style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
            lineHeight: 1.15,
            letterSpacing: '0.04em',
            color: 'rgba(237,229,216,0.08)',
            whiteSpace: 'pre-line',
          }}
        >
          {m.pull}
        </motion.p>
      </div>
    </div>
  );
}

export default function Band() {
  return (
    <section
      id="band"
      className="section-pad relative overflow-hidden"
      style={{ background: '#030202' }}
    >
      {/* Ghost section numeral */}
      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', top: '4%', right: '-1%' }}>02</div>

      {/* Ambient warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw', height: '60%',
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.07) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div {...fade()} className="mb-20 lg:mb-28">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            The People Behind the Sound
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            THE BAND
          </h2>
          <div style={{
            width: '3rem', height: '1px', marginTop: '1rem',
            background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
          }} />
        </motion.div>

        {/* Members */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5rem, 14vw, 10rem)' }}>
          {MEMBERS.map((m, i) => (
            <MemberCard key={m.name} m={m} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
