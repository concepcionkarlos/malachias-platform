'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';


interface NavItem { label: string; href: string; gold?: boolean }

const NAV: NavItem[] = [
  { label: 'The Story',   href: '#about'   },
  { label: 'The Band',    href: '#band'    },
  { label: 'The Sound',   href: '#music'   },
  { label: 'The Field',   href: '#journal' },
  { label: 'The Store',   href: '/merch'   },
  { label: 'The Mission', href: '#mission' },
  { label: 'Support',     href: '/support', gold: true },
];

const SOCIAL_ICONS = [
  {
    label: 'Apple Music',
    href: 'https://music.apple.com/us/artist/malachias/937313536',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor" aria-hidden="true">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.1.958 1.284 1.846.736 3.01a4.97 4.97 0 00-.272.788 12.158 12.158 0 00-.19 1.396c-.013.148-.018.298-.026.447v11.718c.008.15.013.298.026.447.04.535.11 1.07.272 1.589.536 1.745 1.73 2.87 3.51 3.354a8.28 8.28 0 001.65.248c.585.03 1.172.04 1.758.043H17.542a11.59 11.59 0 001.649-.166c1.015-.195 1.913-.608 2.651-1.279 1.034-.934 1.553-2.117 1.729-3.46.04-.312.07-.626.07-.94L24 6.124z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/malachiasmusic',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0,   opacity: 1  }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background:    scrolled ? 'rgba(2,1,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)'       : 'none',
        borderBottom:  scrolled ? '1px solid rgba(201,168,76,0.07)' : 'none',
      }}
    >
      {/* ── Three-column layout: Logo | Nav | Socials+CTA ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[62px] grid grid-cols-[auto_1fr_auto] items-center gap-4">

        {/* LEFT — Wordmark only */}
        <a href="#hero" className="group shrink-0" aria-label="Malachias home">
          <span className="font-display text-[1.12rem] tracking-[0.26em] transition-colors duration-300 group-hover:text-[#c9a84c]"
            style={{ color: '#e8ddd0' }}>
            MALACHIAS
          </span>
        </a>

        {/* CENTER — Navigation links (desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          {NAV.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.65rem] font-semibold tracking-[0.22em] uppercase hover:text-white transition-colors duration-300 group py-1"
              style={{ color: link.gold ? '#c9a84c' : 'rgba(232,221,208,0.55)' }}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[#c9a84c]" />
            </a>
          ))}
        </div>

        {/* Spacer for mobile (keeps logo left-aligned) */}
        <div className="flex lg:hidden flex-1" />

        {/* RIGHT — Socials + Deploy CTA */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Social icons */}
          <div className="hidden sm:flex items-center gap-2 mr-1">
            {SOCIAL_ICONS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-7 h-7 flex items-center justify-center text-[#4a4030] hover:text-[#c9a84c] transition-colors duration-300"
              >
                {s.svg}
              </a>
            ))}
          </div>

          {/* Support CTA — desktop */}
          <a
            href="/support"
            className="hidden lg:inline-flex items-center gap-1.5 !py-2 !px-4 !text-[0.60rem] !tracking-[0.18em] uppercase font-bold transition-opacity duration-200 hover:opacity-85"
            style={{ background: '#c9a84c', color: '#030201', fontSize: '0.60rem', letterSpacing: '0.18em', textDecoration: 'none', fontFamily: 'var(--font-body)' }}
          >
            ♥ Support
          </a>

          {/* Book Us CTA — desktop */}
          <a
            href="#booking"
            className="hidden lg:inline-flex btn btn-ghost !py-2 !px-4 !text-[0.60rem] !tracking-[0.18em]"
          >
            Book Us
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden w-8 h-8 flex items-center justify-center text-[#c9a84c]"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X    size={18} /></motion.span>
                : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0,    opacity: 0  }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="lg:hidden overflow-hidden border-t border-white/[0.05]"
            style={{ background: 'rgba(2,1,0,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -14, opacity: 0 }}
                  animate={{ x: 0,   opacity: 1  }}
                  transition={{ delay: i * 0.04 }}
                  className="text-[0.72rem] tracking-[0.24em] uppercase hover:text-white transition-colors"
                  style={{ color: link.gold ? '#c9a84c' : 'rgba(232,221,208,0.55)' }}
                >
                  {link.gold ? `♥ ${link.label}` : link.label}
                </motion.a>
              ))}

              {/* Social row in drawer */}
              <div className="flex gap-3 pt-2 border-t border-white/[0.05] sm:hidden">
                {SOCIAL_ICONS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-[#4a4030] hover:text-[#c9a84c] transition-colors"
                  >
                    {s.svg}
                  </a>
                ))}
              </div>

              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="btn btn-primary justify-center mt-1"
              >
                Book Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
