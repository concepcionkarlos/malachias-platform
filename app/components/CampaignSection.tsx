'use client'

// Homepage block for the Road to San Antonio campaign — the essentials and the
// three paths, nothing more; the campaign page carries the full story.

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usd, formatEventDate, type CampaignConfig, type campaignMath } from '@/lib/campaign'
import { trackCampaign } from '@/lib/campaignAnalytics'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

interface Props { config: CampaignConfig; math: ReturnType<typeof campaignMath> }

export default function CampaignSection({ config, math }: Props) {
  const live = math.effectiveStatus === 'active' || math.effectiveStatus === 'funded'
  if (!live) return null

  return (
    <section id="road-to-san-antonio" className="section-pad relative overflow-hidden" style={{ background: '#040302' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 15% 50%, rgba(120,60,10,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="max-w-6xl mx-auto px-6 relative grid lg:grid-cols-[3fr_2fr] gap-10 items-center">
        <div>
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>{config.eyebrow}</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}>
            ROAD TO<br /><span style={{ color: '#c9a84c' }}>SAN ANTONIO</span>
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '34rem' }}>
            {config.subheadline} {formatEventDate(config.eventDate)}.
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-7 flex flex-wrap gap-3">
            <Link href={`${config.path}#donate`} className="btn btn-primary" style={{ letterSpacing: '0.18em' }} onClick={() => trackCampaign('donate_click', { surface: 'home' })}>Support the Mission</Link>
            <Link href={`${config.path}#merch`} className="btn btn-ghost" onClick={() => trackCampaign('merch_click', { surface: 'home' })}>Buy Merch</Link>
            <Link href={`${config.path}#sponsors`} className="btn btn-ghost" onClick={() => trackCampaign('sponsor_click', { surface: 'home' })}>Become a Sponsor</Link>
          </motion.div>
        </div>

        <motion.div {...fade(0.1)} className="tac-box" style={{ padding: '1.5rem' }}>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Raised</p>
              <p className="font-display" style={{ fontSize: '2.4rem', color: '#c9a84c', letterSpacing: '0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{usd(math.raised)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Goal</p>
              <p className="font-display" style={{ fontSize: '1.6rem', color: '#ede5d8', letterSpacing: '0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{usd(math.goal)}</p>
            </div>
          </div>
          <div className="mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={math.percent} aria-label={`${math.percent}% funded`}>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)' }}>
              {/* Same minWidth as the campaign page bar, for the same reason. */}
              <div style={{ height: '100%', width: `${math.percent}%`, minWidth: math.raised > 0 ? 10 : 0, background: 'linear-gradient(90deg, #8b6e3a, #c9a84c)' }} />
            </div>
          </div>
          <div className="mt-3 flex justify-between" style={{ fontSize: '0.66rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
            <span>{math.percent}% funded</span>
            {math.daysToEvent > 0 && <span>{math.daysToEvent} days to go</span>}
          </div>
          <Link href={config.path} className="mt-5 inline-block" style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>
            The full story →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
