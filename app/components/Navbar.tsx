'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const NAV = [
  { label: 'About',   href: '#about'   },
  { label: 'Music',   href: '#music'   },
  { label: 'Mission', href: '#mission' },
  { label: 'Merch',   href: '#merch'   },
  { label: 'Booking', href: '#booking' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1  }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 overflow-hidden rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <Image
              src="/Logo 2.PNG"
              alt="Malachias"
              fill
              className="object-cover scale-125"
              priority
            />
          </div>
          <span
            className="font-display text-[1.15rem] tracking-[0.18em] text-white group-hover:text-[#c9a84c] transition-colors duration-300"
          >
            MALACHIAS
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.68rem] font-medium tracking-[0.2em] uppercase text-[#8a7f70] hover:text-white transition-colors duration-300 group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[#c9a84c]" />
            </a>
          ))}
          <a href="#booking" className="btn-gold !py-2 !px-4 text-[0.62rem]">Book Us</a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-[#c9a84c] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open
              ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X    size={20} /></motion.span>
              : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0,    opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.05]"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0,   opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-[0.8rem] tracking-[0.2em] uppercase text-[#8a7f70] hover:text-white transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <a href="#booking" onClick={() => setOpen(false)} className="btn-crimson justify-center mt-1">
                Book Malachias
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
