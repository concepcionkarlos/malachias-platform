'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  const { scrollY } = useScroll();
  const logoY  = useTransform(scrollY, [0, 600], [0, -80]);
  const textO  = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Ambient warm glow — sits behind the logo, nowhere else */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -54%)',
          width: 700, height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(160,110,30,0.18) 0%, rgba(120,70,10,0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glowPulse 7s ease-in-out infinite',
        }}
      />

      {/* Floor smoke — 3 slow drifting blobs */}
      <div className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none overflow-hidden">
        <div className="smoke-a absolute rounded-full"
          style={{ width: 420, height: 280, bottom: -60, left: '36%', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(180,155,110,0.14) 0%, transparent 70%)',
            filter: 'blur(70px)' }} />
        <div className="smoke-b absolute rounded-full"
          style={{ width: 340, height: 220, bottom: -40, left: '60%', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(140,100,50,0.10) 0%, transparent 70%)',
            filter: 'blur(55px)' }} />
        <div className="smoke-c absolute rounded-full"
          style={{ width: 500, height: 300, bottom: -80, left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(100,75,35,0.08) 0%, transparent 65%)',
            filter: 'blur(90px)' }} />
      </div>

      {/* ── LOGO ── */}
      <motion.div
        style={{ y: logoY }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
          animate={{ opacity: 1,  scale: 1,    filter: 'blur(0px)'  }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="logo-breathe"
          style={{
            width:  'clamp(300px, 48vw, 520px)',
            height: 'clamp(300px, 48vw, 520px)',
            position: 'relative',
          }}
          onAnimationComplete={() => setReady(true)}
        >
          <Image
            src="/Logo 2.PNG"
            alt="MALACHIAS"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 320px, 520px"
          />
        </motion.div>

        {/* ── TEXT BLOCK ── */}
        <motion.div
          style={{ opacity: textO }}
          className="flex flex-col items-center gap-4 mt-2"
        >
          {/* Gold hairline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={ready ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="gold-rule w-48"
            style={{ transformOrigin: 'center' }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="label-xs text-center"
            style={{ letterSpacing: '0.42em' }}
          >
            Christian Rock &nbsp;·&nbsp; Veteran Spirit &nbsp;·&nbsp; Faith on Fire
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-4"
          >
            <a href="#music"   className="btn-gold">▶&ensp;Listen Now</a>
            <a href="#booking" className="btn-crimson">Book the Band</a>
            <a href="#merch"   className="btn-ghost">Shop Merch</a>
          </motion.div>

          {/* Micro footnote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-3 text-[0.52rem] tracking-[0.55em] uppercase"
            style={{ color: 'var(--text-3)' }}
          >
            ★ &nbsp; One Nation Under God &nbsp; ★
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[rgba(201,168,76,0.4)]" />
        <div
          className="w-[5px] h-[5px] rounded-full"
          style={{
            background: 'var(--gold)',
            opacity: 0.5,
            animation: 'chevronBounce 2s ease-in-out infinite',
          }}
        />
      </motion.div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />
    </section>
  );
}
