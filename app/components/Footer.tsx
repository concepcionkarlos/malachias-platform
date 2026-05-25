'use client';

import { motion } from 'framer-motion';


const NAV_LINKS = [
  { label: 'The Story',    href: '#about'      },
  { label: 'The Sound',    href: '#music'      },
  { label: 'The Field',    href: '#journal'    },
  { label: 'The Store',    href: '#merch'      },
  { label: 'The Mission',  href: '#mission'    },
  { label: 'Press & EPK',  href: '#press'      },
  { label: 'Book Us',      href: '#booking'    },
  { label: 'Stay in Touch',href: '#newsletter' },
];

const CONTACTS = [
  { role: 'Booking', email: 'booking@malachias.com' },
  { role: 'Press',   email: 'press@malachias.com'   },
  { role: 'General', email: 'hello@malachias.com'   },
];

const SOCIALS = [
  {
    name: 'Apple Music',
    href: 'https://music.apple.com/us/artist/malachias/937313536',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.1.958 1.284 1.846.736 3.01a4.97 4.97 0 00-.272.788 12.158 12.158 0 00-.19 1.396c-.013.148-.018.298-.026.447v11.718c.008.15.013.298.026.447.04.535.11 1.07.272 1.589.536 1.745 1.73 2.87 3.51 3.354a8.28 8.28 0 001.65.248c.585.03 1.172.04 1.758.043H17.542a11.59 11.59 0 001.649-.166c1.015-.195 1.913-.608 2.651-1.279 1.034-.934 1.553-2.117 1.729-3.46.04-.312.07-.626.07-.94L24 6.124z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/malachiasmusic',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

/* Smoke blob — animated with smokeDrift keyframe from globals.css */
function SmokeBlob({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 320,
        height: 320,
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'smokeDrift 14s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#030201' }} className="relative overflow-hidden">

      {/* Smoke effect at top of footer */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none overflow-hidden" aria-hidden="true">
        <SmokeBlob style={{ left: '10%',  top: '-60px', animationDelay: '0s',   '--smoke-drift': '30px'  } as React.CSSProperties} />
        <SmokeBlob style={{ left: '45%',  top: '-80px', animationDelay: '4s',   '--smoke-drift': '-20px' } as React.CSSProperties} />
        <SmokeBlob style={{ left: '75%',  top: '-50px', animationDelay: '8s',   '--smoke-drift': '25px'  } as React.CSSProperties} />
      </div>

      {/* Heavy gold rule at top */}
      <hr className="gold-rule" style={{ opacity: 0.6 }} />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <a href="#hero" className="group mb-5 inline-block">
              <span className="font-display text-xl tracking-[0.22em] transition-colors duration-300 group-hover:text-[#c9a84c]"
                style={{ color: '#e8ddd0' }}>
                MALACHIAS
              </span>
            </a>

            <p className="label-xs mb-3" style={{ color: 'var(--text-3)' }}>
              Christian Rock · Veteran Spirit · Faith on Fire
            </p>
            <p className="text-[0.82rem] leading-relaxed max-w-xs mb-6" style={{ color: 'var(--text-3)' }}>
              Music forged in faith, fired by service, delivered with purpose.
              Every stage is a pulpit. Every song is a prayer.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mb-6">
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 border border-white/[0.07] flex items-center justify-center transition-all duration-300 hover:border-[#c9a84c]/40"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Scripture */}
            <p className="text-[0.65rem] tracking-[0.12em] italic leading-relaxed" style={{ color: 'var(--text-ghost)' }}>
              Malachi 3:1 — &ldquo;See, I will send my messenger&rdquo;
            </p>
          </motion.div>

          {/* Navigate column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="label-xs mb-5" style={{ color: 'var(--text-2)' }}>Navigate</p>
            <ul className="space-y-3">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[0.82rem] flex items-center gap-2 group transition-colors duration-300"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    <span className="w-3 h-px bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/50 transition-all duration-300" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="label-xs mb-5" style={{ color: 'var(--text-2)' }}>Contact</p>
            <div className="space-y-4 text-[0.82rem]">
              {CONTACTS.map(c => (
                <div key={c.role}>
                  <div className="label-xs mb-1" style={{ color: 'var(--text-3)' }}>{c.role}</div>
                  <a
                    href={`mailto:${c.email}`}
                    className="transition-colors duration-300"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/[0.04] relative overflow-hidden">

        {/* Cross watermark — absolutely positioned behind content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <svg
            viewBox="0 0 120 160"
            className="h-full max-h-24 w-auto"
            fill="none"
            style={{ opacity: 0.03 }}
          >
            <rect x="48" y="0"   width="24" height="160" rx="2" fill="white" />
            <rect x="0"  y="52"  width="120" height="24" rx="2" fill="white" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          {/* Copyright */}
          <p className="text-[0.66rem] tracking-wider" style={{ color: 'var(--text-ghost)' }}>
            &copy; {new Date().getFullYear()} Malachias. All rights reserved.
          </p>

          {/* Center — One Nation Under God */}
          <p className="text-[0.66rem] tracking-[0.22em] uppercase font-semibold" style={{ color: 'var(--text-ghost)', fontFamily: 'var(--font-display)' }}>
            One Nation Under God
          </p>

          {/* Privacy / Terms / Admin */}
          <div className="flex gap-4 text-[0.66rem] tracking-wider" style={{ color: 'var(--text-ghost)' }}>
            <a
              href="#"
              className="transition-colors duration-300"
              onMouseEnter={e => (e.currentTarget.style.color = '#4a4438')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-ghost)')}
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors duration-300"
              onMouseEnter={e => (e.currentTarget.style.color = '#4a4438')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-ghost)')}
            >
              Terms
            </a>
            <a
              href="/admin"
              className="transition-colors duration-300"
              onMouseEnter={e => (e.currentTarget.style.color = '#4a4438')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-ghost)')}
            >
              Admin
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
