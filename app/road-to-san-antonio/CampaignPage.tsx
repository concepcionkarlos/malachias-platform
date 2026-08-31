'use client'

// Road to San Antonio — campaign page shell. Server-computed props only (no fetches
// here): hero → progress → the three support paths → story → where the money goes
// → donate (Cash App) → merch → sponsors → updates → share. Every number on the
// page comes from lib/campaign.ts + the admin overrides; nothing is simulated.

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HandCoins, Shirt, Handshake, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonateSection from './DonateSection'
import SponsorSection from './SponsorSection'
import UpdatesSection from './UpdatesSection'
import ShareBar from './ShareBar'
import { STATUS_COPY, MILESTONES, PRESS, usd, formatEventDate, type CampaignConfig, type Sponsor, type CampaignUpdate, type CampaignStatus, type InKindItem, type PeerLink } from '@/lib/campaign'
import type { campaignMath } from '@/lib/campaign'
import type { FWProduct } from '@/lib/fourthwall'
import { fwFirstImage, fwPriceRange } from '@/lib/fourthwall'
import { trackCampaign } from '@/lib/campaignAnalytics'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

interface Props {
  config: CampaignConfig
  qrReady: boolean
  sponsors: Sponsor[]
  updates: CampaignUpdate[]
  inKind: InKindItem[]
  inKindValue: number
  peerLinks: PeerLink[]
  products: FWProduct[]
  math: ReturnType<typeof campaignMath>
  url: string
  defaults: { path: string }
}

const ENDED: CampaignStatus[] = ['traveling', 'event-day', 'completed']

export default function CampaignPage({ config, qrReady, sponsors, updates, inKind, inKindValue, peerLinks, products, math, url }: Props) {
  const status = math.effectiveStatus
  const copy = STATUS_COPY[status]
  const live = status === 'active' || status === 'funded'
  const eventDate = formatEventDate(config.eventDate)

  useEffect(() => { trackCampaign('campaign_page_view', { status }) }, [status])

  return (
    <main style={{ background: '#030201', minHeight: '100vh', color: '#e8ddd0' }}>
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 'clamp(7rem, 14vw, 10rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(120,60,10,0.20) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-10 items-center relative">
          <div>
            <motion.p {...fade()} className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>
              {config.eyebrow}
            </motion.p>
            <motion.h1 {...fade(0.05)} className="font-display mt-4 text-white" style={{ fontSize: 'clamp(2.9rem, 8vw, 5.6rem)', lineHeight: 0.9, letterSpacing: '0.04em' }}>
              {status === 'active' ? config.headline : copy.headline}
            </motion.h1>
            <motion.p {...fade(0.1)} className="mt-6 text-[1rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '36rem' }}>
              {status === 'active' ? config.subheadline : copy.note || config.subheadline}
            </motion.p>

            <motion.dl {...fade(0.15)} className="mt-7 flex flex-wrap gap-x-8 gap-y-3" style={{ margin: '1.75rem 0 0' }}>
              <div>
                <dt className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Date</dt>
                <dd className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#ede5d8', margin: 0 }}>{eventDate}</dd>
              </div>
              <div>
                <dt className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Where</dt>
                <dd className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#ede5d8', margin: 0 }}>{config.eventVenue ? `${config.eventVenue} · ` : ''}{config.eventCity}</dd>
              </div>
              {live && math.daysToEvent > 0 && (
                <div>
                  <dt className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Countdown</dt>
                  <dd className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#c9a84c', margin: 0 }}>{math.daysToEvent} days</dd>
                </div>
              )}
            </motion.dl>

            {live && (
              <motion.div {...fade(0.2)} className="mt-8 flex flex-wrap gap-3">
                <a href="#donate" className="btn btn-primary" style={{ letterSpacing: '0.18em' }} onClick={() => trackCampaign('donate_click', { surface: 'hero' })}>Support the Mission</a>
                <a href="#merch" className="btn btn-ghost" onClick={() => trackCampaign('merch_click', { surface: 'hero' })}>Buy Merch</a>
                <a href="#sponsors" className="btn btn-ghost" onClick={() => trackCampaign('sponsor_click', { surface: 'hero' })}>Become a Sponsor</a>
              </motion.div>
            )}
          </div>

          <motion.div {...fade(0.1)} className="relative mx-auto" style={{ width: 'min(72vw, 420px)', aspectRatio: '1/1' }} aria-hidden="true">
            <Image src="/Malachias.PNG" alt="" fill priority sizes="(max-width: 1024px) 72vw, 420px" className="object-contain" style={{ mixBlendMode: 'screen', filter: 'contrast(1.06) saturate(0.85)' }} />
          </motion.div>
        </div>
      </section>

      {/* ── 2. PROGRESS ─────────────────────────────────────────────────── */}
      <section id="progress" className="px-6" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <motion.div {...fade()} className="max-w-6xl mx-auto tac-box" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.36em' }}>{config.title} · {copy.label}</p>
            {config.raisedAsOf && <p style={{ fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-2)' }}>Updated {formatEventDate(config.raisedAsOf)}</p>}
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Goal" value={usd(math.goal)} />
            <Stat label="Raised" value={usd(math.raised)} accent />
            <Stat label="Remaining" value={usd(math.remaining)} />
            <Stat label="Funded" value={`${math.percent}%`} />
          </div>

          <div className="mt-6" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={math.percent} aria-label={`${math.percent}% of the ${usd(math.goal)} goal raised`}>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${math.percent}%`, background: 'linear-gradient(90deg, #8b6e3a, #c9a84c)', transition: 'width 1s ease' }} />
            </div>
            <div className="mt-2 flex justify-between" aria-hidden="true">
              {MILESTONES.map(m => (
                <span key={m.at} style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: math.percent >= m.at ? '#c9a84c' : 'var(--text-2)' }}>{m.at}%</span>
              ))}
            </div>
          </div>

          {math.milestone && (
            <p className="font-display mt-5" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', letterSpacing: '0.05em', color: '#c9a84c' }}>
              {math.milestone.title}
            </p>
          )}
          {inKindValue > 0 && (
            <p className="mt-4 text-[0.85rem]" style={{ color: 'var(--text-2)' }}>
              Plus <b style={{ color: '#ede5d8' }}>{usd(inKindValue)}</b> in confirmed in-kind support ({[...new Set(inKind.map(i => i.category.toLowerCase()))].join(', ')}) — real costs already covered by sponsors.
            </p>
          )}
          {math.raised === 0 && live && (
            <p className="mt-4 text-[0.85rem]" style={{ color: 'var(--text-2)' }}>
              The road starts with the first supporter. Be the one.
            </p>
          )}
        </motion.div>
      </section>

      {/* ── 3. THREE PATHS ───────────────────────────────────────────────── */}
      {live && (
        <section id="support" className="section-pad" style={{ background: '#060504', scrollMarginTop: 80 }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 {...fade()} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>SUPPORT THE MISSION</motion.h2>
            <div className="mt-8 grid md:grid-cols-3 gap-3">
              {[
                { n: '1', title: 'Donate', body: 'Help directly support travel and campaign expenses.', href: '#donate', icon: HandCoins, ev: 'donate_click' as const, primary: true },
                { n: '2', title: 'Buy merch', body: 'Support the campaign while representing Malachias.', href: '#merch', icon: Shirt, ev: 'merch_click' as const, primary: false },
                { n: '3', title: 'Become a sponsor', body: 'Partner with the campaign as a business, church or organization.', href: '#sponsors', icon: Handshake, ev: 'sponsor_click' as const, primary: false },
              ].map((p, i) => (
                <motion.a
                  key={p.n}
                  {...fade(0.05 + i * 0.05)}
                  href={p.href}
                  className="tac-box flex flex-col gap-3"
                  style={{ padding: '1.5rem', textDecoration: 'none', borderColor: p.primary ? 'rgba(201,168,76,0.45)' : undefined }}
                  onClick={() => trackCampaign(p.ev, { surface: 'paths' })}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display" style={{ fontSize: '2rem', color: 'rgba(201,168,76,0.4)', lineHeight: 1 }}>{p.n}.</span>
                    <p.icon size={22} style={{ color: '#c9a84c' }} aria-hidden="true" />
                  </div>
                  <p className="font-display" style={{ fontSize: '1.8rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{p.title.toUpperCase()}</p>
                  <p className="text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-2)', flex: 1 }}>{p.body}</p>
                  <span style={{ fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{p.primary ? 'Support now →' : 'See how →'}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. STORY ────────────────────────────────────────────────────── */}
      <section id="story" className="section-pad" style={{ background: '#030201' }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-10 items-start">
          <div>
            <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Why this matters</motion.p>
            <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
              {ENDED.includes(status) ? 'WE MADE THE ROAD TOGETHER' : 'WE GOT THE INVITATION.\nNOW WE BUILD THE ROAD.'}
            </motion.h2>
            <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
              <motion.p {...fade(0.1)}>
                {`Malachias has been invited to perform in ${config.eventCity} on ${eventDate} — a ${config.eventName} event dedicated to honoring America's veterans.`}
              </motion.p>
              <motion.p {...fade(0.15)}>
                This band was founded by a U.S. Army veteran who served two tours in Iraq, as a medic and as an Army bandsman. The
                mission has always been specific: reduce suicidal ideation, lift people from depression, help heal what PTSD leaves
                behind. A Veterans Day stage is the mission in its purest form.
              </motion.p>
              <motion.p {...fade(0.2)}>
                Bringing the whole band from South Florida to Texas — flights, instruments, lodging, ground transportation — costs
                real money for an independent band with no label. We would rather earn it with the people who believe in what we do
                than show up short a guitar.
              </motion.p>
              <motion.p {...fade(0.25)}>
                Every contribution, every piece of merch, every sponsor and every share moves the road forward. Thank you for walking it with us.
              </motion.p>
              {PRESS.length > 0 && (
                <motion.p {...fade(0.3)} className="text-[0.82rem]" style={{ color: 'var(--text-3)', borderTop: '1px solid rgba(201,168,76,0.12)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                  Previously featured in{' '}
                  {PRESS.map((p, i) => (
                    <span key={p.outlet}>
                      {i > 0 && ' · '}
                      <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>{p.outlet}</a>
                      {' '}({p.date})
                    </span>
                  ))}.
                </motion.p>
              )}
            </div>
          </div>
          <motion.div {...fade(0.15)} className="tac-box overflow-hidden" style={{ position: 'relative', aspectRatio: '4/5' }}>
            <Image src="/Malachias 1.jpeg" alt="Malachias — founder, vocals and guitar" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover object-top" style={{ filter: 'contrast(1.05) saturate(0.8)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #030201 0%, transparent 45%)' }} />
            <p className="absolute bottom-4 left-4 right-4 label-xs" style={{ color: '#c9a84c', letterSpacing: '0.30em' }}>Founder · Two tours · One mission</p>
          </motion.div>
        </div>
      </section>

      {/* ── 5. WHERE IT GOES ────────────────────────────────────────────── */}
      <section id="budget" className="section-pad" style={{ background: '#050403' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Transparency</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>WHERE YOUR SUPPORT GOES</motion.h2>
          <motion.p {...fade(0.1)} className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            The {usd(math.goal)} target covers moving {config.travelers} people and their instruments to {config.eventCity} and back.
            We are confirming with the organizer what the event itself covers; the target and this list will be adjusted — and
            published — as those answers come in.
          </motion.p>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3" style={{ listStyle: 'none', margin: '2rem 0 0', padding: 0 }}>
            {config.budgetLines.map((b, i) => (
              <motion.li key={b.label} {...fade(0.05 + i * 0.03)} className="tac-box" style={{ padding: '1rem 1.1rem' }}>
                <p className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '0.05em', color: '#ede5d8' }}>{b.label}</p>
                <p className="text-[0.78rem] mt-1" style={{ color: 'var(--text-2)' }}>{b.note}</p>
              </motion.li>
            ))}
          </ul>
          <p className="mt-5 text-[0.76rem]" style={{ color: 'var(--text-2)' }}>
            If the campaign raises more than the trip costs, the difference goes to the next mission — free veteran outreach shows in South Florida.
          </p>
        </div>
      </section>

      {/* ── 6. DONATE ───────────────────────────────────────────────────── */}
      {live && <DonateSection config={config} qrReady={qrReady} />}

      {/* ── 6b. PEER-TO-PEER — one card per traveling musician (only when the team exists) ── */}
      {live && peerLinks.length > 0 && (
        <section id="team" className="section-pad" style={{ background: '#030201', scrollMarginTop: 80 }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Road to San Antonio team</motion.p>
            <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>SUPPORT ONE MUSICIAN&apos;S ROAD</motion.h2>
            <motion.p {...fade(0.1)} className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
              Every member has a personal page. Whichever one you pick, it all lands in the same campaign total.
            </motion.p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {peerLinks.map((p, i) => (
                <motion.a key={p.id} {...fade(0.05 + i * 0.04)} href={p.url} target="_blank" rel="noopener noreferrer" className="tac-box block" style={{ padding: '1.2rem 1.2rem', textDecoration: 'none' }} onClick={() => trackCampaign('donate_click', { surface: 'peer' })}>
                  <p className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{p.name}</p>
                  <p className="mt-1" style={{ fontSize: '0.64rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{p.role}</p>
                  <p className="mt-3" style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-2)' }}>Support {p.name.split(' ')[0]}&apos;s road →</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. MERCH ────────────────────────────────────────────────────── */}
      <section id="merch" className="section-pad" style={{ background: '#040404', scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>2 · Buy merch</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>WEAR THE MISSION</motion.h2>
          <motion.p {...fade(0.1)} className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            {products.length > 0
              ? `Limited Road to San Antonio merch. Every purchase helps support Malachias' journey to ${config.eventName} in San Antonio.`
              : `Limited Road to San Antonio pieces are in production. Until they drop, every purchase from the current collection helps support the journey to ${config.eventName}.`}
          </motion.p>

          {products.length > 0 && (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {products.slice(0, 4).map((p, i) => {
                const img = fwFirstImage(p)
                return (
                  <motion.div key={p.id} {...fade(0.05 + i * 0.04)}>
                    <Link href={`/merch/${p.slug}`} className="tac-box block overflow-hidden" style={{ textDecoration: 'none' }} onClick={() => trackCampaign('merch_click', { surface: 'grid' })}>
                      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#0a0a0a' }}>
                        {img && <Image src={img} alt={p.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />}
                      </div>
                      <div style={{ padding: '0.8rem 0.9rem' }}>
                        <p className="font-display" style={{ fontSize: '0.95rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.15 }}>{p.name}</p>
                        <p className="font-display mt-1" style={{ fontSize: '0.95rem', color: '#c9a84c' }}>{fwPriceRange(p)}</p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}

          <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/merch#road-to-san-antonio" className="btn btn-primary" onClick={() => trackCampaign('merch_click', { surface: 'cta' })}>
              {products.length > 0 ? 'Shop Road to San Antonio merch' : 'Shop the store'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 8. SPONSORS ─────────────────────────────────────────────────── */}
      <SponsorSection config={config} sponsors={sponsors} />

      {/* ── 9. UPDATES ──────────────────────────────────────────────────── */}
      <UpdatesSection config={config} updates={updates} />

      {/* ── 10. SHARE ───────────────────────────────────────────────────── */}
      <section id="share" className="section-pad" style={{ background: '#030201' }}>
        <div className="max-w-6xl mx-auto px-6 tac-box" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Sharing is support</p>
          <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>SEND THE ROAD TO SOMEONE</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '36rem' }}>{config.shareText}</p>
          <div className="mt-5"><ShareBar url={url} text={config.shareText} /></div>
          <p className="mt-5 text-[0.78rem]" style={{ color: 'var(--text-2)' }}>
            Questions about the campaign? <a href={`mailto:${config.sponsorEmail}`} style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>{config.sponsorEmail}</a>
            &ensp;·&ensp;<a href={config.cashApp.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'underline', textUnderlineOffset: 3 }}>Cash App {config.cashApp.cashtag} <ExternalLink size={11} aria-hidden="true" /></a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>{label}</p>
      <p className="font-display" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.6rem)', letterSpacing: '0.04em', color: accent ? '#c9a84c' : '#ede5d8', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
    </div>
  )
}
