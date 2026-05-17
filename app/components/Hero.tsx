'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

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

      {/* ─── Emblem — background atmosphere, not focal point ─────────── */}
      <motion.div
        aria-hidden="true"
        style={{ y: logoY, zIndex: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          style={{
            position: 'relative',
            width: 'min(92vw, 720px)',
            aspectRatio: '3 / 2',
            marginTop: '-6vh',
            opacity: 0.26,
            WebkitMaskImage: `radial-gradient(
              ellipse 74% 68% at 50% 50%,
              black 10%, rgba(0,0,0,.80) 30%,
              rgba(0,0,0,.40) 50%, rgba(0,0,0,.08) 65%,
              transparent 78%
            )`,
            maskImage: `radial-gradient(
              ellipse 74% 68% at 50% 50%,
              black 10%, rgba(0,0,0,.80) 30%,
              rgba(0,0,0,.40) 50%, rgba(0,0,0,.08) 65%,
              transparent 78%
            )`,
          }}
        >
          <Image
            src="/Malachias.PNG"
            alt=""
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 92vw, 720px"
            style={{
              mixBlendMode: 'screen',
              filter: 'contrast(1.10) brightness(0.78) saturate(0.68)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* ─── Environmental fog — merges emblem into darkness ─────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '38%',
          background: 'linear-gradient(to right, rgba(2,2,2,0.92) 0%, rgba(2,2,2,0.50) 65%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '38%',
          background: 'linear-gradient(to left, rgba(2,2,2,0.92) 0%, rgba(2,2,2,0.50) 65%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '32%',
          background: 'linear-gradient(to bottom, rgba(2,2,2,0.96) 0%, rgba(2,2,2,0.50) 55%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(2,2,2,0.82) 0%, transparent 100%)',
        }} />
      </div>

      {/* ─── Vignette ─────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none vignette" style={{ zIndex: 4 }} />

      {/* ─── Text — MALACHIAS is the focal point ─────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: masterO, zIndex: 10 }}
        className="absolute inset-x-0 bottom-0 px-6 lg:px-16 pb-[13vh]"
      >
        <div style={{ maxWidth: '28rem' }}>

          {/* Band name — the statement */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            className="font-display leading-[0.88] tracking-[0.04em]"
            style={{
              fontSize: 'clamp(4.8rem, 12vw, 9.5rem)',
              color: '#ede5d8',
              textShadow: '0 0 80px rgba(190,140,60,0.09), 0 10px 50px rgba(0,0,0,0.98)',
            }}
          >
            MALACHIAS
          </motion.h1>

          {/* Gold rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="gold-rule my-5"
            style={{ transformOrigin: 'left', maxWidth: '10rem' }}
          />

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35 }}
            className="flex flex-col xs:flex-row items-start gap-3 mb-7"
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
          </motion.div>

          {/* Scripture — restrained anchor */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.9 }}
            style={{
              fontSize: '0.44rem',
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
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
