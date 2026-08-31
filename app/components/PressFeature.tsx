'use client'

// "As featured in" — the real press coverage, given the room it deserves: the
// article as a paper card, the outlet, a verbatim pull quote and a link out to
// the publication. Used on the campaign page, the homepage press section and the
// EPK. `variant="band"` is the full block; `variant="inline"` is a compact strip.

import Image from 'next/image'
import { motion } from 'framer-motion'
import { PRESS } from '@/lib/campaign'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

interface Props {
  variant?: 'band' | 'inline'
  background?: string
  heading?: string
}

export default function PressFeature({ variant = 'band', background = '#050403', heading = 'As featured in' }: Props) {
  const feature = PRESS[0]
  if (!feature) return null

  if (variant === 'inline') {
    return (
      <a
        href={feature.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tac-box flex items-center gap-4"
        style={{ padding: '0.9rem 1rem', textDecoration: 'none' }}
      >
        {feature.image && (
          <span style={{ position: 'relative', width: 96, height: 64, flexShrink: 0, overflow: 'hidden', background: '#f5f2ec' }}>
            <Image src={feature.image} alt="" fill sizes="96px" className="object-cover object-left-top" />
          </span>
        )}
        <span style={{ minWidth: 0 }}>
          <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>{heading}</span>
          <span className="font-display block" style={{ fontSize: '1.2rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1.1 }}>{feature.outlet}</span>
          <span className="block" style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>{feature.title} · {feature.date}</span>
        </span>
      </a>
    )
  }

  return (
    <section id="press-feature" className="section-pad relative overflow-hidden" style={{ background, scrollMarginTop: 80 }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 55% at 22% 45%, rgba(120,60,10,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="max-w-6xl mx-auto px-6 relative grid lg:grid-cols-[5fr_6fr] gap-10 lg:gap-14 items-center">

        {/* The article, as paper */}
        <motion.a
          {...fade()}
          href={feature.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${feature.title} — ${feature.outlet}, ${feature.date} (opens ${new URL(feature.url).hostname})`}
          style={{ display: 'block', background: '#f5f2ec', padding: '0.9rem', borderRadius: 6, boxShadow: '0 40px 90px rgba(0,0,0,0.65)', transform: 'rotate(-1.5deg)' }}
        >
          {feature.image && (
            <span style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '886/467', overflow: 'hidden', borderRadius: 3 }}>
              <Image src={feature.image} alt={feature.imageAlt ?? ''} fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover object-top" />
            </span>
          )}
        </motion.a>

        {/* The claim */}
        <div>
          <motion.p {...fade(0.05)} className="label-xs mb-3" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>{heading}</motion.p>
          <motion.h2 {...fade(0.08)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>
            {feature.outlet.toUpperCase()}
          </motion.h2>
          <motion.p {...fade(0.11)} className="mt-3" style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
            {feature.title} · {feature.date}{feature.byline ? ` · ${feature.byline}` : ''}
          </motion.p>

          {feature.pullQuote && (
            <motion.blockquote {...fade(0.14)} className="mt-7" style={{ borderLeft: '2px solid rgba(201,168,76,0.5)', paddingLeft: '1.25rem' }}>
              <p className="font-display" style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)', lineHeight: 1.3, letterSpacing: '0.03em', color: 'rgba(201,168,76,0.92)', fontStyle: 'italic' }}>
                &ldquo;{feature.pullQuote}&rdquo;
              </p>
              <p className="mt-3" style={{ fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-2)' }}>— Malachias, in {feature.outlet}</p>
            </motion.blockquote>
          )}

          <motion.p {...fade(0.17)} className="mt-6 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
            {feature.note}
          </motion.p>

          <motion.div {...fade(0.2)} className="mt-7 flex flex-wrap gap-3">
            <a href={feature.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ letterSpacing: '0.16em' }}>
              Read it at {new URL(feature.url).hostname.replace('www.', '')} →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
