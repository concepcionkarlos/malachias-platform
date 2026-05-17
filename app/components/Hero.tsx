'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

/* ─── Smoke particle config ─────────────────────────────────────────── */
const SMOKE_PARTICLES = [
  { cls: 'smoke-0', w: 380, h: 380, bottom: -60,  left: '38%',  blur: 80 },
  { cls: 'smoke-1', w: 280, h: 280, bottom: -40,  left: '55%',  blur: 60 },
  { cls: 'smoke-2', w: 440, h: 440, bottom: -80,  left: '28%',  blur: 90 },
  { cls: 'smoke-3', w: 220, h: 220, bottom: -20,  left: '62%',  blur: 50 },
  { cls: 'smoke-4', w: 500, h: 500, bottom: -100, left: '44%',  blur: 110 },
];

/* ─── Light beam config ─────────────────────────────────────────────── */
const LIGHT_BEAMS = [
  { angle: -32, opacity: 0.10, delay: '0s',    width: 180, color: 'rgba(201,168,76,0.9)' },
  { angle:  32, opacity: 0.10, delay: '0.8s',  width: 180, color: 'rgba(201,168,76,0.9)' },
  { angle: -14, opacity: 0.14, delay: '1.6s',  width: 220, color: 'rgba(255,240,200,0.9)' },
  { angle:  14, opacity: 0.14, delay: '2.4s',  width: 220, color: 'rgba(255,240,200,0.9)' },
  { angle:   0, opacity: 0.18, delay: '0.4s',  width: 260, color: 'rgba(255,250,230,0.9)' },
  { angle: -52, opacity: 0.06, delay: '1.2s',  width: 120, color: 'rgba(139,0,0,0.9)'    },
  { angle:  52, opacity: 0.06, delay: '2.0s',  width: 120, color: 'rgba(139,0,0,0.9)'    },
];

/* ─── Stagger variants ──────────────────────────────────────────────── */
const containerVar = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

  /* Parallax: logo drifts upward as user scrolls */
  const { scrollY } = useScroll();
  const rawY   = useTransform(scrollY, [0, 600], [0, -90]);
  const logoY  = useSpring(rawY, { stiffness: 60, damping: 20 });
  const rawO   = useTransform(scrollY, [0, 400], [1, 0]);
  const textO  = useSpring(rawO, { stiffness: 80, damping: 25 });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black film-grain"
    >

      {/* ── 1. DEEP BACKGROUND gradient ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(40,25,5,0.55) 0%, rgba(10,5,2,0.80) 50%, #000 100%)',
        }}
      />

      {/* ── 2. PATRIOTIC color wash (flag tones, ultra-subtle) ────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 120% 60% at 50% 60%, rgba(139,0,0,0.07) 0%, transparent 55%), ' +
              'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(26,45,90,0.10) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(26,45,90,0.10) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ── 3. LIGHT BEAMS emanating from logo center ──────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          width: '1px', height: '1px',
          transform: 'translate(-50%, -54%)',
        }}
      >
        {LIGHT_BEAMS.map((beam, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: 0, left: 0,
              width: `${beam.width}px`,
              height: '100vh',
              marginLeft: `-${beam.width / 2}px`,
              transformOrigin: 'top center',
              transform: `rotate(${beam.angle}deg)`,
              background: `linear-gradient(to bottom, ${beam.color} 0%, transparent 70%)`,
              opacity: beam.opacity,
              filter: 'blur(28px)',
              animation: `lightSweep 7s ease-in-out infinite`,
              animationDelay: beam.delay,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      {/* ── 4. FLOOR SMOKE particles ──────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden">
        {SMOKE_PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${p.cls}`}
            style={{
              width:  p.w,
              height: p.h,
              bottom: p.bottom,
              left:   p.left,
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse, rgba(180,165,140,0.18) 0%, rgba(100,85,60,0.06) 50%, transparent 80%)',
              filter: `blur(${p.blur}px)`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* ── 5. SCANLINE (cinematic film grain line) ──────────────── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 4 }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.03)',
            animation: 'scanlineMove 8s linear infinite',
          }}
        />
      </div>

      {/* ── 6. MAIN CONTENT ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto">

        {/* Logo + halo system */}
        <motion.div
          style={{ y: logoY }}
          className="relative flex items-center justify-center mb-10 select-none"
        >
          {/* Outer slow-spin decorative ring */}
          <div
            className="absolute"
            style={{
              top: '50%', left: '50%',
              width: 'clamp(480px, 62vw, 680px)',
              height: 'clamp(480px, 62vw, 680px)',
              borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.08)',
              animation: 'ringRotate 40s linear infinite',
              willChange: 'transform',
            }}
          />

          {/* Second ring, counter-rotate */}
          <div
            className="absolute"
            style={{
              top: '50%', left: '50%',
              width: 'clamp(420px, 54vw, 600px)',
              height: 'clamp(420px, 54vw, 600px)',
              borderRadius: '50%',
              border: '1px solid rgba(139,0,0,0.07)',
              animation: 'ringRotate 28s linear infinite reverse',
              willChange: 'transform',
            }}
          />

          {/* Halo glow behind logo */}
          <motion.div
            className="absolute"
            animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.06, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(340px, 46vw, 520px)',
              height: 'clamp(340px, 46vw, 520px)',
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse, rgba(201,168,76,0.22) 0%, rgba(180,130,40,0.10) 40%, transparent 70%)',
              filter: 'blur(24px)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Inner crimson glow pulse */}
          <motion.div
            className="absolute"
            animate={{ opacity: [0.15, 0.30, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(260px, 36vw, 400px)',
              height: 'clamp(260px, 36vw, 400px)',
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse, rgba(139,0,0,0.30) 0%, transparent 65%)',
              filter: 'blur(16px)',
            }}
          />

          {/* ── THE LOGO ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(12px)' }}
            animate={{ opacity: 1,  scale: 1,    filter: 'blur(0px)'  }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative logo-breathe"
            style={{
              width:  'clamp(280px, 42vw, 500px)',
              height: 'clamp(280px, 42vw, 500px)',
            }}
            onAnimationComplete={() => setLoaded(true)}
          >
            <Image
              src="/Logo 1.PNG"
              alt="MALACHIAS"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 320px, (max-width: 1200px) 440px, 500px"
            />
          </motion.div>
        </motion.div>

        {/* ── TYPOGRAPHY BLOCK ── */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate={loaded ? 'show' : 'hidden'}
          style={{ opacity: textO }}
          className="flex flex-col items-center gap-4"
        >
          {/* Divider rule */}
          <motion.div variants={itemVar} className="flex items-center gap-4 w-full max-w-sm">
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5))' }}
            />
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
              <rect x="5.5" y="0" width="3" height="18" fill="rgba(201,168,76,0.7)" />
              <rect x="0"   y="5" width="14" height="3" fill="rgba(201,168,76,0.7)" />
            </svg>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVar}
            className="text-[clamp(0.65rem,2vw,0.85rem)] tracking-[0.45em] uppercase text-[#c9a84c]/70 flicker-text"
          >
            Christian Rock &nbsp;·&nbsp; Veteran Spirit &nbsp;·&nbsp; Faith on Fire
          </motion.p>

          {/* Sub-line */}
          <motion.p
            variants={itemVar}
            className="text-[clamp(0.55rem,1.5vw,0.68rem)] tracking-[0.35em] uppercase text-[#7a6840]/70"
          >
            Est. in Faith &nbsp;·&nbsp; Forged in Service &nbsp;·&nbsp; Ignited in Purpose
          </motion.p>

          {/* ── CTA BUTTONS ── */}
          <motion.div
            variants={itemVar}
            className="flex flex-col sm:flex-row items-center gap-3 mt-6"
          >
            {/* Primary — Listen Now */}
            <a
              href="#music"
              className="group relative flex items-center gap-3 px-7 py-[13px] overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.55)' }}
            >
              {/* Fill wipe */}
              <span
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d07a)' }}
              />
              {/* Play icon */}
              <svg
                className="relative z-10 text-[#c9a84c] group-hover:text-black transition-colors duration-300 shrink-0"
                width="13" height="14" viewBox="0 0 13 14" fill="currentColor"
              >
                <path d="M0 0L13 7L0 14V0Z" />
              </svg>
              <span className="relative z-10 text-[0.68rem] tracking-[0.28em] uppercase font-bold text-[#c9a84c] group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                Listen Now
              </span>
            </a>

            {/* Secondary — Book the Band */}
            <a
              href="#booking"
              className="group relative flex items-center gap-3 px-7 py-[13px] overflow-hidden bg-[#8b0000] hover:bg-[#a30000] transition-colors duration-400"
            >
              <span className="text-[0.68rem] tracking-[0.28em] uppercase font-bold text-white whitespace-nowrap">
                Book the Band
              </span>
            </a>

            {/* Ghost — Shop Merch */}
            <a
              href="#merch"
              className="group relative flex items-center gap-3 px-7 py-[13px] overflow-hidden border border-white/10 hover:border-white/25 transition-colors duration-400"
            >
              <span className="text-[0.68rem] tracking-[0.28em] uppercase font-bold text-gray-500 group-hover:text-gray-300 transition-colors duration-300 whitespace-nowrap">
                Shop Merch
              </span>
            </a>
          </motion.div>

          {/* Patriotic footnote */}
          <motion.p
            variants={itemVar}
            className="mt-4 text-[0.55rem] tracking-[0.55em] text-[#3a3020]/80 uppercase"
          >
            ★ &nbsp; One Nation Under God &nbsp; ★
          </motion.p>
        </motion.div>
      </div>

      {/* ── 7. SCROLL INDICATOR ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[6px] z-10"
      >
        <span className="text-[0.5rem] tracking-[0.55em] text-[#4a3e28]/80 uppercase">Scroll</span>
        {/* Animated mouse */}
        <div
          className="w-5 h-8 rounded-full border border-[#c9a84c]/25 flex items-start justify-center pt-[6px]"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[3px] h-[6px] rounded-full bg-[#c9a84c]/60"
          />
        </div>
      </motion.div>

      {/* ── 8. VIGNETTE overlay ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none cinematic-vignette" style={{ zIndex: 6 }} />

      {/* ── 9. LETTERBOX bars (cinematic feel) ─────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-[22px] pointer-events-none"
        style={{ background: '#000', zIndex: 7, opacity: 0.85 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[22px] pointer-events-none"
        style={{ background: '#000', zIndex: 7, opacity: 0.85 }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #000 0%, transparent 100%)',
          zIndex: 8,
        }}
      />
    </section>
  );
}
