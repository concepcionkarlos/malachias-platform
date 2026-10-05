'use client';

// Homepage hero — full-bleed live photo (War on drums, stage fire) under a dark
// gradient, the Malachias emblem as a small badge, rising embers, the "WE PLAY FOR
// THE ONES WHO NEED IT MOST" headline, the newest release, scripture anchor, and
// Listen/Book/Press CTAs. Uses scroll-linked parallax and fade.

import { useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Embers from './Embers';
import type { Release } from '@/lib/releases';

// Layout lives in CSS breakpoints (no flash on hydration); this flag only tunes
// the scroll-fade runway, which needs to be longer on tall phone heroes.
const MOBILE_QUERY = '(max-width: 1023px)';
const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export default function Hero({ release }: { release?: Release }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, () => false);

  const photoY  = useTransform(scrollY, [0, 700], [0, 90]);
  const textY   = useTransform(scrollY, [0, 700], [0, -24]);
  const fadeDesktop = useTransform(scrollY, [0, 420], [1, 0]);
  const fadeMobile  = useTransform(scrollY, [260, 1100], [1, 0]);
  const masterO = mobile ? fadeMobile : fadeDesktop;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden select-none flex flex-col justify-end"
      style={{ background: '#030201' }}
    >

      {/* ─── Live photo — the band on stage. Phone: top band so the face clears
             the text; desktop: right-anchored so the text sits on black. ────── */}
      <motion.div
        aria-hidden="true"
        style={{ y: photoY, zIndex: 1 }}
        className="absolute inset-x-0 top-0 h-[64%] lg:h-full lg:left-[30%] pointer-events-none"
      >
        <Image
          src="/War Drums.jpeg"
          alt=""
          fill
          preload
          sizes="(max-width: 1023px) 100vw, 70vw"
          className="object-cover object-[60%_82%] lg:object-[50%_46%]"
          style={{ filter: 'contrast(1.08) saturate(0.82) brightness(0.86)' }}
        />
      </motion.div>

      {/* ─── Overlay — keeps every line of copy at ≥4.5:1 over the photo ─── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {/* Phone: photo melts into black where the text begins */}
        <div className="lg:hidden absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(3,2,1,0.55) 0%, rgba(3,2,1,0.0) 16%, rgba(3,2,1,0.10) 30%, rgba(3,2,1,0.80) 48%, #030201 62%)',
        }} />
        {/* Desktop: black on the text side, fading into the stage */}
        <div className="hidden lg:block absolute inset-0" style={{
          background: 'linear-gradient(to right, #030201 0%, #030201 30%, rgba(3,2,1,0.82) 42%, rgba(3,2,1,0.35) 62%, rgba(3,2,1,0.10) 80%, rgba(3,2,1,0.45) 100%)',
        }} />
        <div className="hidden lg:block absolute inset-x-0 top-0 h-[22%]" style={{
          background: 'linear-gradient(to bottom, rgba(3,2,1,0.85) 0%, transparent 100%)',
        }} />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[38%]" style={{
          background: 'linear-gradient(to top, #030201 0%, rgba(3,2,1,0.70) 45%, transparent 100%)',
        }} />
      </div>

      {/* ─── Vignette ─────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none vignette" style={{ zIndex: 4, opacity: 0.45 }} />

      {/* ─── Crimson ground glow — battle-born, beneath the words ────── */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ zIndex: 5, height: '55%' }}>
        <div style={{
          position: 'absolute',
          bottom: '8%', left: '2%',
          width: '45vw', height: '50%',
          background: 'radial-gradient(ellipse, rgba(120,18,8,0.14) 0%, rgba(80,10,5,0.05) 55%, transparent 80%)',
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
        className="relative px-6 lg:px-16 pt-[150px] pb-12 lg:pb-[11vh]"
      >
        <div className="max-w-[90vw] lg:max-w-[min(46rem,54vw)]">

          {/* Emblem — a badge now; the people carry the frame */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            className="relative w-[84px] lg:w-[110px] aspect-[3/2] mb-3 lg:mb-5 -ml-1"
          >
            <Image
              src="/Malachias.PNG"
              alt=""
              fill
              className="object-contain"
              sizes="110px"
              style={{ mixBlendMode: 'screen', filter: 'contrast(1.06) brightness(1.1) saturate(0.85)' }}
            />
          </motion.div>

          {/* Luxury origin label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.0, delay: 0.65 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
          >
            <div className="hidden lg:block" style={{ width: '1.8rem', height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.45))' }} />
            <span className="whitespace-nowrap tracking-[0.16em] lg:whitespace-normal lg:tracking-[0.32em]" style={{
              fontSize: '0.7rem',
              color: 'rgba(201,168,76,0.85)', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', lineHeight: 1.8,
            }}>
              Christian Rock · Coral Springs, FL<span className="hidden lg:inline"> · Faith on Fire</span>
            </span>
            <div className="hidden lg:block" style={{ width: '1.8rem', height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.45))' }} />
          </motion.div>

          {/* Emotional statement — the page's one h1 */}
          <h1
            className="font-display leading-[0.90] tracking-[0.04em]"
            style={{ textShadow: '0 8px 60px rgba(0,0,0,0.99)' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.85, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="block text-[clamp(2.6rem,10vw,3.2rem)] lg:text-[clamp(3rem,7vw,5.5rem)]"
              style={{ color: 'rgba(237,229,216,0.72)' }}
            >
              WE PLAY
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.05, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="block text-[clamp(2.6rem,10vw,3.2rem)] lg:text-[clamp(3rem,7vw,5.5rem)]"
            >
              <span className="shimmer-gold">FOR THE ONES</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.20, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="block text-[clamp(2.6rem,10vw,3.2rem)] lg:text-[clamp(3rem,7vw,5.5rem)]"
              style={{ color: 'rgba(237,229,216,0.66)' }}
            >
              WHO NEED IT MOST.
            </motion.span>
          </h1>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.22, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            style={{
              transformOrigin: 'left',
              maxWidth: '10rem',
              height: 1,
              margin: '1.1rem 0',
              background: 'linear-gradient(90deg, rgba(201,168,76,0.80) 0%, rgba(201,168,76,0.30) 60%, transparent 100%)',
            }}
          />

          {/* Sub-statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.28 }}
            style={{
              fontSize: '0.82rem', lineHeight: 1.80, fontStyle: 'italic',
              color: 'rgba(168,152,128,0.80)', maxWidth: '24rem',
              letterSpacing: '0.025em', marginBottom: '1.3rem',
            }}
          >
            Music forged in faith. Carried through fire.<br />
            For anyone still fighting their way back.
          </motion.p>

          {/* Newest release — one tap to the on-page player */}
          {release && (
            <motion.a
              href="#latest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.40, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.9rem',
                padding: '0.55rem 1rem 0.55rem 0.55rem', marginBottom: '1.2rem', maxWidth: '100%',
                border: '1px solid rgba(201,168,76,0.28)', background: 'rgba(8,6,4,0.72)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', textDecoration: 'none',
              }}
            >
              <span style={{ position: 'relative', width: 52, height: 52, flexShrink: 0, overflow: 'hidden', background: '#111' }}>
                {release.artwork && (
                  <Image src={release.artwork} alt="" fill sizes="52px" className="object-cover" />
                )}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '0.66rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700, fontFamily: 'var(--font-body)' }}>
                  {release.type === 'album' ? 'New album' : 'New single'} · Out now
                </span>
                <span className="font-display" style={{ display: 'block', fontSize: '1.15rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1.1, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {release.title}{release.credits ? ` · ${release.credits}` : ''}
                </span>
              </span>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.85)', textTransform: 'uppercase', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                ▶ Play
              </span>
            </motion.a>
          )}

          {/* CTAs — horizontal row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.50, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="flex flex-row flex-wrap items-center gap-3 mb-5 lg:mb-8"
          >
            <motion.a
              href="#latest"
              className="btn btn-primary btn-solid"
              animate={{
                boxShadow: [
                  '0 2px 24px rgba(0,0,0,0.60)',
                  '0 2px 28px rgba(201,168,76,0.22)',
                  '0 2px 24px rgba(0,0,0,0.60)',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2.0 }}
              style={{ letterSpacing: '0.18em' }}
            >
              ▶&ensp;Listen Now
            </motion.a>
            <a href="#booking" className="btn btn-ghost" style={{ letterSpacing: '0.14em' }}>
              Book Us
            </a>
            <Link
              href="/epk"
              className="hero-text-link"
              style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}
            >
              Press Kit
            </Link>
          </motion.div>

          {/* Scripture anchor */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.0, delay: 2.1 }}
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.40em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.72)',
            }}
          >
            ✠ &nbsp; Malachi 3:1 &nbsp; ✠
          </motion.p>
        </div>
      </motion.div>

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
