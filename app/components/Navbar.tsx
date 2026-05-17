'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { label: 'About',   href: '#about'   },
  { label: 'Music',   href: '#music'   },
  { label: 'Mission', href: '#mission' },
  { label: 'Merch',   href: '#merch'   },
  { label: 'Booking', href: '#booking' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [atTop,    setAtTop]    = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setAtTop(window.scrollY < 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0,   opacity: 1  }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      {/* Top gold accent line — visible only when scrolled */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-700"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)',
          opacity: scrolled ? 1 : 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* ── Logo mark ── */}
        <a href="#hero" className="flex items-center gap-3 group relative" aria-label="Malachias home">
          {/* Logo image — small emblem */}
          <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-full">
            {/* Gold ring on hover */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-500 z-10"
              style={{
                boxShadow: '0 0 0 1px rgba(201,168,76,0)',
              }}
            />
            <Image
              src="/Logo 1.PNG"
              alt="Malachias logo"
              width={36}
              height={36}
              className="object-cover w-full h-full scale-110 group-hover:scale-125 transition-transform duration-500"
              priority
            />
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="text-[0.85rem] font-black tracking-[0.22em] text-white group-hover:text-[#c9a84c] transition-colors duration-400"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.22em' }}
            >
              MALACHIAS
            </span>
            <span
              className="text-[0.45rem] tracking-[0.35em] text-[#c9a84c]/50 group-hover:text-[#c9a84c]/80 transition-colors duration-400 uppercase mt-[2px]"
            >
              Christian Rock
            </span>
          </div>
        </a>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.7rem] tracking-[0.22em] uppercase font-medium text-gray-400 hover:text-white transition-colors duration-300 group py-1"
            >
              {link.label}
              {/* Underline wipe */}
              <span
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d07a)' }}
              />
            </a>
          ))}

          {/* Book CTA */}
          <a
            href="#booking"
            className="relative ml-2 px-5 py-[7px] text-[0.65rem] tracking-[0.25em] uppercase font-bold overflow-hidden group"
            style={{ border: '1px solid rgba(201,168,76,0.5)' }}
          >
            <span
              className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400"
              style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d07a)' }}
            />
            <span className="relative z-10 text-[#c9a84c] group-hover:text-black transition-colors duration-300">
              Book Us
            </span>
          </a>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center text-[#c9a84c]"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{    rotate:  90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0,  opacity: 1 }}
                exit={{    rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0,    opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.05]"
          >
            {/* Gold top line */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

            <div className="px-6 pt-6 pb-8 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0,   opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="text-sm tracking-[0.2em] uppercase text-gray-400 hover:text-[#c9a84c] transition-colors duration-300 flex items-center gap-3"
                >
                  <span className="text-[#c9a84c]/30 text-xs">0{i + 1}</span>
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#booking"
                onClick={() => setOpen(false)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0,   opacity: 1 }}
                transition={{ delay: navLinks.length * 0.06 + 0.05, duration: 0.3 }}
                className="mt-2 py-3 text-center text-xs tracking-[0.25em] uppercase font-bold text-[#c9a84c] border border-[#c9a84c]/40 hover:bg-[#c9a84c]/10 transition-all duration-300"
              >
                Book Malachias
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
