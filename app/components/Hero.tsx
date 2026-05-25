'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Embers from './Embers';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const logoY   = useTransform(scrollY, [0, 700], [0, -72]);
  const textY   = useTransform(scrollY, [0, 700], [0, -24]);
  const masterO = useTransform(scrollY, [0, 420], [1,  0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #020202 0%, #080503 42%, #0a0602 65%, #030202 100%)' }}
    >

      {/* ─── Warm ambient depth — environment ────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute',
          top: '30%', left: '45%',
          transform: 'translate(-50%,-50%)',
          width: '68vw', height: '65vh',
          background: 'radial-gradient(ellipse, rgba(110,52,8,0.20) 0%, rgba(65,26,4,0.09) 48%, transparent 74%)',
          filter: 'blur(110px)',
          animation: 'glowPulse 20s ease-in-out infinite',
          willChange: 'opacity',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: '10%',
          width: '80vw', height: '30vh',
          background: 'radial-gradient(ellipse, rgba(70,30,5,0.12) 0%, transparent 75%)',
          filter: 'blur(80px)',
          animation: 'glowPulse 26s ease-in-out infinite 9s',
          willChange: 'opacity',
        }} />
      </div>

      {/* ─── Emblem — right-anchored, atmospheric ───────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{ y: logoY, zIndex: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Positioning wrapper — mobile: centered upper half; desktop: center-right */}
        <div
          style={mobile ? {
            position: 'absolute',
            top: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '82vw',
            aspectRatio: '1 / 1',
          } : {
            position: 'absolute',
            top: '50%',
            right: '0%',
            transform: 'translateY(-50%)',
            width: 'min(56vw, 800px)',
            aspectRatio: '1 / 1',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              opacity: mobile ? 0.52 : 0.44,
              WebkitMaskImage: mobile
                ? `radial-gradient(ellipse 80% 80% at 50% 46%, black 18%, rgba(0,0,0,.88) 42%, rgba(0,0,0,.40) 64%, transparent 80%)`
                : `radial-gradient(ellipse 76% 76% at 52% 50%, black 10%, rgba(0,0,0,.90) 34%, rgba(0,0,0,.52) 54%, rgba(0,0,0,.16) 70%, transparent 82%)`,
              maskImage: mobile
                ? `radial-gradient(ellipse 80% 80% at 50% 46%, black 18%, rgba(0,0,0,.88) 42%, rgba(0,0,0,.40) 64%, transparent 80%)`
                : `radial-gradient(ellipse 76% 76% at 52% 50%, black 10%, rgba(0,0,0,.90) 34%, rgba(0,0,0,.52) 54%, rgba(0,0,0,.16) 70%, transparent 82%)`,
            }}
          >
            <Image
              src="/Malachias.PNG"
              alt=""
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 90vw, 800px"
              style={{
                mixBlendMode: 'screen',
                filter: 'contrast(1.10) brightness(0.92) saturate(0.62)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Fog layers — protect text zone, merge edges ─────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {/* Left guard — full on desktop, light on mobile (badge is centered) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: mobile ? '30%' : '52%',
          background: mobile
            ? 'linear-gradient(to right, rgba(2,2,2,0.70) 0%, transparent 100%)'
            : 'linear-gradient(to right, rgba(2,2,2,0.97) 0%, rgba(2,2,2,0.80) 40%, rgba(2,2,2,0.40) 70%, transparent 100%)',
        }} />
        {/* Right edge fade */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '22%',
          background: 'linear-gradient(to left, rgba(2,2,2,0.88) 0%, transparent 100%)',
        }} />
        {/* Top fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '28%',
          background: 'linear-gradient(to bottom, rgba(2,2,2,0.98) 0%, rgba(2,2,2,0.55) 50%, transparent 100%)',
        }} />
        {/* Bottom fade — stronger on mobile to protect text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: mobile ? '50%' : '35%',
          background: mobile
            ? 'linear-gradient(to top, rgba(2,2,2,0.98) 0%, rgba(2,2,2,0.85) 30%, rgba(2,2,2,0.40) 65%, transparent 100%)'
            : 'linear-gradient(to top, rgba(2,2,2,0.88) 0%, transparent 100%)',
        }} />
      </div>

      {/* ─── Vignette ─────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none vignette" style={{ zIndex: 4 }} />

      {/* ─── Crimson ground glow — battle-born, beneath the words ────── */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ zIndex: 5, height: '55%' }}>
        <div style={{
          position: 'absolute',
          bottom: '8%', left: '2%',
          width: '45vw', height: '50%',
          background: 'radial-gradient(ellipse, rgba(120,18,8,0.12) 0%, rgba(80,10,5,0.05) 55%, transparent 80%)',
          filter: 'blur(70px)',
          animation: 'glowPulse 18s ease-in-out infinite 5s',
          willChange: 'opacity',
        }} />
      </div>

      {/* ─── Embers — rise from the ground, z above glow ─────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
        <Embers count={16} />
      </div>

      {/* ─── Text — emotional statement ──────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: masterO, zIndex: 10 }}
        className="absolute inset-x-0 bottom-0 px-6 lg:px-16 pb-[11vh]"
      >
        <div style={{ maxWidth: mobile ? '90vw' : 'min(46rem, 54vw)' }}>

          {/* Emotional statement */}
          <div
            className="font-display leading-[0.90] tracking-[0.03em]"
            style={{ textShadow: '0 8px 60px rgba(0,0,0,0.99)' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.85, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{ display: 'block', fontSize: mobile ? 'clamp(2.6rem, 10vw, 3.2rem)' : 'clamp(3rem, 7vw, 5.5rem)', color: 'rgba(237,229,216,0.42)' }}
            >
              WE PLAY
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.0, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{ display: 'block', fontSize: mobile ? 'clamp(2.6rem, 10vw, 3.2rem)' : 'clamp(3rem, 7vw, 5.5rem)', color: '#ede5d8' }}
            >
              FOR THE ONES
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.15, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{ display: 'block', fontSize: mobile ? 'clamp(2.6rem, 10vw, 3.2rem)' : 'clamp(3rem, 7vw, 5.5rem)', color: 'rgba(237,229,216,0.28)' }}
            >
              WHO NEED IT MOST.
            </motion.span>
          </div>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.18, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="gold-rule my-5"
            style={{ transformOrigin: 'left', maxWidth: '8rem' }}
          />

          {/* Sub-statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.22 }}
            className="text-[0.80rem] leading-relaxed italic mb-7"
            style={{ color: 'var(--text-2)', maxWidth: '24rem', letterSpacing: '0.02em' }}
          >
            Music forged in faith. Carried through fire.
            For anyone still fighting their way back.
          </motion.p>

          {/* CTAs — horizontal row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.48 }}
            className="flex flex-row flex-wrap items-center gap-3 mb-8"
          >
            <a
              href="https://music.apple.com/us/artist/malachias/937313536"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              ▶&ensp;Listen Now
            </a>
            <a href="#booking" className="btn btn-ghost">
              Book Us
            </a>
            <a
              href="/epk"
              className="btn btn-ghost"
              style={{ opacity: 0.55, fontSize: '0.62rem', letterSpacing: '0.20em', padding: '0.55rem 1rem' }}
            >
              Press Kit
            </a>
          </motion.div>

          {/* Scripture anchor */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.95 }}
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.44em',
              textTransform: 'uppercase',
              color: 'rgba(140,110,60,0.35)',
            }}
          >
            ✠ &nbsp; Malachi 3:1 &nbsp; ✠
          </motion.p>
        </div>
      </motion.div>

      {/* ─── Hard bottom fade ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          zIndex: 11,
          height: '40%',
          background: 'linear-gradient(to top, #030202 0%, rgba(3,2,2,0.90) 25%, rgba(3,2,2,0.42) 55%, transparent 100%)',
        }}
      />

      {/* ─── Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[5px]"
        style={{ zIndex: 12 }}
        aria-hidden="true"
      >
        <div className="w-px h-7 bg-gradient-to-b from-transparent to-[rgba(201,168,76,0.20)]" />
        <div
          className="w-[3px] h-[3px] rounded-full bounce-y"
          style={{ background: 'var(--gold)', opacity: 0.22 }}
        />
      </motion.div>

    </section>
  );
}
