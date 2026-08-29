'use client'

// Homepage block for Voice Lessons with Malachias — the offer in one line and a
// link to /voice-lessons. Sits after the band so it reads as "learn from him".

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LESSONS, usdLessons } from '@/lib/lessons'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function LessonsTeaser() {
  return (
    <section id="lessons" className="section-pad" style={{ background: '#050403' }}>
      <div className="max-w-6xl mx-auto px-6 tac-box grid lg:grid-cols-[3fr_2fr] gap-8 items-center" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div>
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>{LESSONS.eyebrow}</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)' }}>
            VOICE LESSONS<br /><span style={{ color: '#c9a84c' }}>WITH MALACHIAS</span>
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '36rem' }}>
            International touring artist, former Nashville recording artist, 30+ years on stage. Vocal, style and stage presence — in person in
            {' '}{LESSONS.inPersonCounties.join(', ')} or via Zoom. Discounts for veterans and packages.
          </motion.p>
        </div>
        <motion.div {...fade(0.12)} className="flex flex-col gap-3 lg:items-end">
          <p className="font-display" style={{ fontSize: '2.2rem', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>
            From {usdLessons(LESSONS.price)} <span style={{ fontSize: '1rem', color: 'var(--text-2)', letterSpacing: '0.1em' }}>/ {LESSONS.lengthMinutes} min</span>
          </p>
          <Link href={`${LESSONS.path}#sign-up`} className="btn btn-primary" style={{ letterSpacing: '0.18em' }}>Sign up today</Link>
          <Link href={LESSONS.path} style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>Details →</Link>
        </motion.div>
      </div>
    </section>
  )
}
