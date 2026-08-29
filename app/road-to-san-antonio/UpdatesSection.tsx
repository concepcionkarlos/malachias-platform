'use client'

// Road to San Antonio content hub. Published updates (added from the admin) render
// as episodes, newest first; the planned episode list from the config shows the
// road ahead so the section is never empty on day one.

import { useState } from 'react'
import { Play } from 'lucide-react'
import type { CampaignConfig, CampaignUpdate } from '@/lib/campaign'
import { trackCampaign } from '@/lib/campaignAnalytics'

function youtubeId(url?: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function Episode({ u }: { u: CampaignUpdate }) {
  const [playing, setPlaying] = useState(false)
  const yt = youtubeId(u.mediaUrl)
  const paragraphs = u.body.split(/\n\s*\n/).filter(Boolean)
  return (
    <article className="tac-box" style={{ padding: '1.4rem 1.5rem' }}>
      <p style={{ fontSize: '0.62rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>
        Episode {String(u.episode).padStart(2, '0')} · {formatDate(u.date)}
      </p>
      <h3 className="font-display mt-1" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>{u.title}</h3>
      {yt && (
        <div className="mt-4" style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
              title={u.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            <button
              type="button"
              onClick={() => { setPlaying(true); trackCampaign('campaign_video_play', { episode: u.episode }) }}
              aria-label={`Play: ${u.title}`}
              style={{ position: 'absolute', inset: 0, width: '100%', border: 0, cursor: 'pointer', background: `center / cover no-repeat url(https://img.youtube.com/vi/${yt}/hqdefault.jpg)` }}
            >
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(201,168,76,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c' }}>
                  <Play size={22} aria-hidden="true" />
                </span>
              </span>
            </button>
          )}
        </div>
      )}
      {!yt && u.mediaUrl && (
        <a href={u.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block" style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a84c' }}>Watch / view →</a>
      )}
      <div className="mt-4 space-y-3">
        {paragraphs.map((p, i) => <p key={i} className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>{p}</p>)}
      </div>
    </article>
  )
}

export default function UpdatesSection({ config, updates }: { config: CampaignConfig; updates: CampaignUpdate[] }) {
  const publishedEpisodes = new Set(updates.map(u => u.episode))
  return (
    <section id="updates" className="section-pad" style={{ background: '#060504', scrollMarginTop: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Follow the road</p>
        <h2 className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
          ROAD TO SAN ANTONIO — UPDATES
        </h2>

        <div className="mt-10 grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
          <div className="flex flex-col gap-4">
            {updates.length === 0 ? (
              <div className="tac-box" style={{ padding: '1.5rem' }}>
                <p className="font-display" style={{ fontSize: '1.4rem', letterSpacing: '0.04em', color: '#ede5d8' }}>Episode 01 is on its way.</p>
                <p className="mt-2 text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  We&apos;ll post the story of the invitation, rehearsals, the people who join the road and every milestone here — and on Facebook and Instagram.
                </p>
              </div>
            ) : updates.map(u => <Episode key={u.id} u={u} />)}
          </div>

          <aside className="tac-box" style={{ padding: '1.25rem 1.4rem' }}>
            <p className="label-xs mb-3" style={{ color: 'var(--text-3)', letterSpacing: '0.30em' }}>The road ahead</p>
            <ol className="flex flex-col gap-2" style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {config.plannedEpisodes.map((t, i) => {
                const n = i + 1
                const done = publishedEpisodes.has(n)
                return (
                  <li key={t} style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: '0.5rem', alignItems: 'baseline' }}>
                    <span className="font-display" style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: done ? '#c9a84c' : 'rgba(201,168,76,0.35)' }}>{String(n).padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.86rem', color: done ? '#ede5d8' : 'var(--text-3)' }}>{t}</span>
                  </li>
                )
              })}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
