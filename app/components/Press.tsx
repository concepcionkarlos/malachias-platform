'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const WHAT_TO_EXPECT = [
  {
    heading: 'Full live set',
    body:    '45–90 minutes. Originals and select covers that fit the room. We read the crowd.',
  },
  {
    heading: 'No production drama',
    body:    'We bring what we need. Minimal requirements. We\'ve played in gymnasiums, chapels, and outdoor fields.',
  },
  {
    heading: 'Real interaction',
    body:    'We talk to the room. We don\'t hide behind a fog machine. People leave knowing something about us.',
  },
  {
    heading: 'Faith-centered message',
    body:    'Every show has a thread of purpose running through it. We don\'t preach. We witness.',
  },
];

const ASSETS = [
  { label: 'Press Kit (PDF)',      note: 'Band bio, photos, links'           },
  { label: 'Stage Plot',           note: '2025 — standard configuration'     },
  { label: 'Technical Rider',      note: 'Sound, lights, load-in requirements'},
  { label: 'Hi-Res Promo Photos',  note: '4 images, print-ready'             },
];

export default function Press() {
  return (
    <section id="press" style={{ background: '#050505' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="mb-14">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            For Event Organizers
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            PRESS & EPK
          </h2>
          <div
            className="mt-4"
            style={{
              width: '3rem',
              height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-[5fr_4fr] gap-12 lg:gap-20 items-start">

          {/* Left — what to expect */}
          <div>
            <motion.p {...fade(0.06)} className="text-[0.93rem] leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>
              If you&apos;re a church, a veteran organization, or a community promoter considering Malachias for your event — here&apos;s what you need to know.
            </motion.p>

            <div className="space-y-6 mb-10">
              {WHAT_TO_EXPECT.map((w, i) => (
                <motion.div key={w.heading} {...fade(0.08 + i * 0.05)}>
                  <p
                    className="font-display text-sm tracking-[0.14em] mb-1"
                    style={{ color: 'var(--gold)' }}
                  >
                    {w.heading}
                  </p>
                  <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                    {w.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div {...fade(0.22)} className="flex flex-col xs:flex-row gap-3">
              <a href="#booking" className="btn btn-primary">
                Submit a Booking Request
              </a>
              <a href="/epk" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                View Full EPK
              </a>
            </motion.div>
          </div>

          {/* Right — downloadable assets */}
          <motion.div {...fade(0.10)}>
            <p
              className="label-xs mb-5"
              style={{ color: 'var(--text-3)', letterSpacing: '0.28em' }}
            >
              Press Assets
            </p>
            <div className="space-y-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {ASSETS.map((a, i) => (
                <div
                  key={a.label}
                  style={{
                    background: '#050505',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'background 0.25s',
                    cursor: 'not-allowed',
                    opacity: 0.7,
                  }}
                  title="Available when backend is connected"
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#0a0a0a')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#050505')}
                >
                  <div>
                    <div style={{ fontSize: '0.80rem', color: '#8a7f70', marginBottom: '0.2rem' }}>{a.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>{a.note}</div>
                  </div>
                  <Download size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                </div>
              ))}
            </div>

            <p
              className="text-[0.65rem] tracking-wider mt-4 leading-relaxed"
              style={{ color: 'var(--text-3)' }}
            >
              Assets available upon request. Email{' '}
              <a
                href="mailto:press@malachias.com"
                style={{ color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
              >
                press@malachias.com
              </a>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
