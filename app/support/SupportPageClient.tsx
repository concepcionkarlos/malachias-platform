'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WAYS = [
  {
    icon: '🎽',
    title: 'Wear the Mission',
    subtitle: 'Buy official Malachias gear',
    body: 'Every piece you buy funds studio time, live shows, and veteran outreach. No middleman. Direct to the band.',
    cta: 'Shop the Store →',
    href: '/merch',
    highlight: true,
  },
  {
    icon: '🎵',
    title: 'Stream & Share',
    subtitle: 'Free — costs you nothing',
    body: 'Follow on Spotify and Apple Music. Add songs to your playlists. Every stream and share puts the mission in front of new ears.',
    cta: 'Listen on Spotify →',
    href: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    highlight: false,
  },
  {
    icon: '📅',
    title: 'Book the Band',
    subtitle: 'Bring the mission to your stage',
    body: 'Churches, bars, military events, festivals — if you have a stage and a crowd, we have a show. Every booking sustains the mission.',
    cta: 'Book Us →',
    href: '/#booking',
    highlight: false,
  },
  {
    icon: '✉️',
    title: 'Spread the Word',
    subtitle: 'Share with someone who needs it',
    body: 'Know someone dealing with PTSD, depression, or searching for faith? Share a song. A share costs nothing and can change everything.',
    cta: 'Join the Newsletter →',
    href: '/#newsletter',
    highlight: false,
  },
];

const CHECKLIST = [
  'Live shows & touring costs',
  'Original music recording & mastering',
  'Veteran outreach events (free tickets, free merch)',
  'Gear maintenance & instrument repairs',
  'New content & music videos',
];

export default function SupportPageClient() {
  return (
    <main style={{ background: '#030201', minHeight: '100vh', color: '#e8ddd0' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 'clamp(7rem, 14vw, 11rem)',
          paddingBottom: 'clamp(4rem, 8vw, 7rem)',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          maxWidth: '64rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: '0.60rem',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: '#c9a84c',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
        }}>
          Support the Band
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 9vw, 6rem)',
            letterSpacing: '0.04em',
            lineHeight: 0.92,
            color: '#ffffff',
            marginBottom: '2rem',
          }}
        >
          NO LABEL.<br />JUST THE MISSION.
        </h1>

        <div style={{
          width: '3rem',
          height: '1px',
          background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.2))',
          margin: '0 auto 2rem',
        }} />

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.75,
          color: 'rgba(232,221,208,0.55)',
          maxWidth: '42rem',
          margin: '0 auto 2.5rem',
        }}>
          Malachias is a self-funded, independent band started by a U.S. Army veteran.
          No label backing. No corporate deals. Every show we play, every song we record,
          every veteran we reach — it&apos;s funded by people who believe in the mission.
        </p>

        <Link
          href="/merch"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.9rem 2.5rem',
            background: '#c9a84c',
            color: '#030201',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
          }}
        >
          Shop Merch — Support Us
        </Link>
      </section>

      {/* Where your support goes */}
      <section
        style={{
          borderTop: '1px solid rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <p style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.2rem', fontWeight: 700 }}>
            Where it goes
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '2rem' }}>
            YOUR SUPPORT FUNDS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CHECKLIST.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{
                  width: '1.2rem',
                  height: '1.2rem',
                  borderRadius: '2px',
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.55rem',
                  color: '#c9a84c',
                }}>
                  ✓
                </span>
                <span style={{ fontSize: '0.88rem', color: 'rgba(232,221,208,0.65)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to support */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
        <p style={{ fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.2rem', fontWeight: 700 }}>
          How to help
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '3rem' }}>
          EVERY ACTION COUNTS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.04)',
        }}>
          {WAYS.map(w => (
            <div
              key={w.title}
              style={{
                background: w.highlight ? '#0a0804' : '#040302',
                padding: '2rem',
                borderTop: w.highlight ? '2px solid rgba(201,168,76,0.45)' : '2px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{w.icon}</span>
              <p style={{ fontSize: '0.50rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.50)', fontWeight: 700 }}>
                {w.subtitle}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.04em', color: '#e8ddd0', margin: 0 }}>
                {w.title}
              </h3>
              <p style={{ fontSize: '0.83rem', lineHeight: 1.7, color: 'rgba(232,221,208,0.45)', margin: '0 0 0.5rem', flex: 1 }}>
                {w.body}
              </p>
              <a
                href={w.href}
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: w.highlight ? '#c9a84c' : 'rgba(201,168,76,0.45)',
                  textDecoration: 'none',
                  borderBottom: w.highlight ? '1px solid rgba(201,168,76,0.40)' : '1px solid rgba(201,168,76,0.15)',
                  paddingBottom: '1px',
                  alignSelf: 'flex-start',
                  fontWeight: 700,
                }}
              >
                {w.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Direct contact strip */}
      <section
        style={{
          borderTop: '1px solid rgba(201,168,76,0.08)',
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
          background: '#040302',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <p style={{ fontSize: '0.58rem', letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: '1rem', fontWeight: 700 }}>
            Want to tip directly?
          </p>
          <p style={{ fontSize: '0.90rem', lineHeight: 1.75, color: 'rgba(232,221,208,0.45)', marginBottom: '1.5rem' }}>
            We&apos;re setting up a direct tip jar. In the meantime, reach out — we&apos;d love to hear from you.
          </p>
          <a
            href="mailto:hello@malachiasmusic.com"
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(201,168,76,0.35)',
              paddingBottom: '1px',
              fontWeight: 700,
            }}
          >
            hello@malachiasmusic.com
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
