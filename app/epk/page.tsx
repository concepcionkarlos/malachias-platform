export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { readContent } from '@/lib/store'

export async function generateMetadata() {
  const { siteContent } = await readContent()
  return {
    title: `Press Kit — MALACHIAS`,
    description: siteContent.metaDescription ?? 'Electronic Press Kit for Malachias — Christian rock, veteran-founded, based in South Florida.',
  }
}

const SOCIAL_LINKS = [
  { label: 'Apple Music', href: 'https://music.apple.com/us/artist/malachias/937313536' },
  { label: 'Spotify',     href: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl' },
  { label: 'YouTube',     href: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA' },
  { label: 'Instagram',   href: 'https://www.instagram.com/malachiasmusic' },
  { label: 'Facebook',    href: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr' },
]

const RULE: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid rgba(201,168,76,0.12)',
  margin: '2.5rem 0',
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: '0.55rem',
  letterSpacing: '0.42em',
  textTransform: 'uppercase' as const,
  color: 'rgba(201,168,76,0.55)',
  display: 'block',
  marginBottom: '1.25rem',
  fontFamily: 'var(--font-body)',
}

export default async function EpkPage() {
  const { epkContent, siteContent, bandMembers } = await readContent()

  const founder = bandMembers.find(m => m.visible !== false)
  const bio = siteContent.aboutText ?? []

  const techSpecs = epkContent.techSpecs.length > 0 ? epkContent.techSpecs : [
    { label: 'Set Length',     value: '45 min · 1 hr · Full set (custom)' },
    { label: 'Setup Time',     value: '90 minutes prior to show' },
    { label: 'Soundcheck',     value: '30 minutes' },
    { label: 'PA System',      value: 'Self-contained or house PA accepted' },
    { label: 'Stage Required', value: '12ft × 10ft minimum' },
    { label: 'Power',          value: '2 × 20A circuits minimum' },
    { label: 'Special',        value: 'Available for outdoor events, churches, VFW halls' },
  ]

  const repertoire = epkContent.repertoire.length > 0 ? epkContent.repertoire : [
    { era: 'Faith',       artists: 'Original faith-driven rock. Songs about doubt, redemption, survival, and hope.' },
    { era: 'Healing',     artists: 'Music for veterans, trauma survivors, and anyone fighting their way back.' },
    { era: 'Brotherhood', artists: 'Songs about not leaving people behind. On stage and off.' },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060504',
        color: '#e8ddd0',
        fontFamily: 'var(--font-body)',
      }}
    >
      <style>{`
        .epk-social-link:hover { color: #c9a84c !important; border-color: rgba(201,168,76,0.45) !important; }
        .epk-email-link:hover  { color: #c9a84c !important; }
      `}</style>
      {/* ── Top bar ─── */}
      <div
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          padding: '1.1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(6,5,4,0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(16px)',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.88rem',
            letterSpacing: '0.26em',
            color: '#e8ddd0',
            textDecoration: 'none',
          }}
        >
          MALACHIAS
        </Link>
        <span
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.45)',
          }}
        >
          Press Kit
        </span>
        <a
          href="mailto:booking@malachiasmusic.com"
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            color: '#c9a84c',
            textDecoration: 'none',
            border: '1px solid rgba(201,168,76,0.25)',
            padding: '0.45rem 1rem',
          }}
        >
          Contact Booking
        </a>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* ── Hero block ─── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p style={SECTION_LABEL}>Electronic Press Kit</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.2rem, 8vw, 5.5rem)',
              lineHeight: 0.9,
              letterSpacing: '0.05em',
              color: '#ede5d8',
              margin: '0 0 1.25rem',
            }}
          >
            MALACHIAS
          </h1>

          <p
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.60)',
              marginBottom: '1.75rem',
            }}
          >
            {epkContent.tagline || 'Christian Rock · Veteran-Founded · Faith Through Fire'}
          </p>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.75,
              color: 'rgba(220,210,196,0.72)',
              maxWidth: '54rem',
            }}
          >
            {epkContent.bookerIntro || siteContent.aboutShort}
          </p>
        </div>

        <hr style={RULE} />

        {/* ── About ─── */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={SECTION_LABEL}>About</p>

          {bio.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bio.map((para, i) => (
                <p
                  key={i}
                  style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(220,210,196,0.68)' }}
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(220,210,196,0.68)' }}>
              {siteContent.aboutShort}
            </p>
          )}

          {founder && (
            <div
              style={{
                marginTop: '2rem',
                paddingLeft: '1.25rem',
                borderLeft: '2px solid rgba(201,168,76,0.22)',
              }}
            >
              <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'rgba(220,210,196,0.50)', lineHeight: 1.7 }}>
                &ldquo;I came home from Iraq and I didn&apos;t know who I was anymore.
                Music cracked me open again. Faith came through the crack.&rdquo;
              </p>
              <p style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.30)', marginTop: '0.6rem' }}>
                — {founder.name}{founder.branch ? ` · ${founder.branch}` : ''}{founder.tours ? ` · ${founder.tours}` : ''}
              </p>
            </div>
          )}
        </div>

        <hr style={RULE} />

        {/* ── Repertoire ─── */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={SECTION_LABEL}>Repertoire</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {repertoire.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'baseline' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.14em',
                    color: '#c9a84c',
                    minWidth: '7rem',
                    flexShrink: 0,
                  }}
                >
                  {r.era}
                </span>
                <span style={{ fontSize: '0.84rem', lineHeight: 1.65, color: 'rgba(220,210,196,0.60)' }}>
                  {r.artists}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={RULE} />

        {/* ── Tech Specs ─── */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={SECTION_LABEL}>Technical Requirements</p>
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            {techSpecs.map((spec, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '11rem 1fr',
                  borderBottom: i < techSpecs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.55)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {spec.label}
                </div>
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.84rem',
                    color: 'rgba(220,210,196,0.68)',
                  }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Setlists (if any) ─── */}
        {epkContent.setlists && epkContent.setlists.length > 0 && (
          <>
            <hr style={RULE} />
            <div style={{ marginBottom: '3rem' }}>
              <p style={SECTION_LABEL}>Sample Setlists</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {(epkContent.setlists as { title: string; songs: string[] }[]).map((sl, i) => (
                  <div key={i} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.18em',
                        color: '#c9a84c',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {sl.title}
                    </p>
                    <ol style={{ margin: 0, padding: '0 0 0 1.1rem' }}>
                      {sl.songs.map((song, si) => (
                        <li
                          key={si}
                          style={{ fontSize: '0.78rem', lineHeight: 1.9, color: 'rgba(220,210,196,0.55)' }}
                        >
                          {song}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Press quotes (if any) ─── */}
        {epkContent.pressQuotes && epkContent.pressQuotes.length > 0 && (
          <>
            <hr style={RULE} />
            <div style={{ marginBottom: '3rem' }}>
              <p style={SECTION_LABEL}>Press</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {epkContent.pressQuotes.map((q, i) => (
                  <blockquote
                    key={i}
                    style={{
                      margin: 0,
                      paddingLeft: '1.25rem',
                      borderLeft: '2px solid rgba(201,168,76,0.18)',
                      fontSize: '0.90rem',
                      lineHeight: 1.75,
                      fontStyle: 'italic',
                      color: 'rgba(220,210,196,0.60)',
                    }}
                  >
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          </>
        )}

        <hr style={RULE} />

        {/* ── Listen ─── */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={SECTION_LABEL}>Listen & Follow</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="epk-social-link"
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.65)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  padding: '0.55rem 1rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.25s, color 0.25s',
                  display: 'inline-block',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <hr style={RULE} />

        {/* ── Contact & CTA ─── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2rem',
          }}
        >
          <p style={SECTION_LABEL}>Booking Contact</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { role: 'Booking', email: siteContent.contactEmail || 'booking@malachiasmusic.com' },
              { role: 'Press',   email: 'press@malachiasmusic.com' },
              { role: 'General', email: 'hello@malachiasmusic.com' },
            ].map(c => (
              <div key={c.role}>
                <p
                  style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.42)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {c.role}
                </p>
                <a
                  href={`mailto:${c.email}`}
                  className="epk-email-link"
                  style={{ fontSize: '0.82rem', color: 'rgba(220,210,196,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  {c.email}
                </a>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const, marginTop: '0.5rem' }}>
            <a
              href="/#booking"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: '#c9a84c',
                color: '#070707',
                fontFamily: 'var(--font-display)',
                fontSize: '0.70rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Submit Booking Request
            </a>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                border: '1px solid rgba(201,168,76,0.28)',
                color: 'rgba(201,168,76,0.70)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.70rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Back to Site
            </Link>
          </div>
        </div>

        {/* ── Footer note ─── */}
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p
            style={{
              fontSize: '0.60rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(80,68,52,0.55)',
              textAlign: 'center' as const,
            }}
          >
            © {new Date().getFullYear()} Malachias · South Florida · {siteContent.serviceArea || 'United States'} &nbsp;✠&nbsp; Malachi 3:1
          </p>
        </div>

      </div>
    </div>
  )
}
