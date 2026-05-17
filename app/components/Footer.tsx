'use client';

import { motion } from 'framer-motion';

const socials = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Spotify',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Music', href: '#music' },
  { label: 'Mission', href: '#mission' },
  { label: 'Merch', href: '#merch' },
  { label: 'Booking', href: '#booking' },
  { label: 'Newsletter', href: '#newsletter' },
];

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-[#c9a84c]/15 overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

      {/* Background stars/stripes hint */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute right-0 top-0 bottom-0 w-32"
          style={{ background: 'repeating-linear-gradient(0deg, #8b0000, #8b0000 30px, transparent 30px, transparent 60px)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#c9a84c]/10 rounded-sm rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-[#c9a84c] font-bold">✝</span>
              </div>
              <span
                className="text-2xl font-black tracking-[0.2em] text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                MALACHIAS
              </span>
            </div>

            <p className="text-[#c9a84c]/60 text-xs tracking-[0.3em] uppercase mb-4">
              Christian Rock · Veteran Spirit · Faith on Fire
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              Music forged in faith, fired by service, and delivered with purpose.
              Every stage is a pulpit. Every song is a prayer.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all duration-300 hover:bg-[#c9a84c]/05"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-[0.65rem] tracking-[0.4em] text-[#c9a84c]/60 uppercase mb-6">Navigate</p>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-[#c9a84c] text-sm tracking-wider transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/60 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[0.65rem] tracking-[0.4em] text-[#c9a84c]/60 uppercase mb-6">Contact</p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs tracking-wider mb-1">Booking</p>
                <a href="mailto:booking@malachias.com" className="text-gray-400 hover:text-[#c9a84c] transition-colors duration-300">
                  booking@malachias.com
                </a>
              </div>
              <div>
                <p className="text-gray-600 text-xs tracking-wider mb-1">Press & Media</p>
                <a href="mailto:press@malachias.com" className="text-gray-400 hover:text-[#c9a84c] transition-colors duration-300">
                  press@malachias.com
                </a>
              </div>
              <div>
                <p className="text-gray-600 text-xs tracking-wider mb-1">General</p>
                <a href="mailto:hello@malachias.com" className="text-gray-400 hover:text-[#c9a84c] transition-colors duration-300">
                  hello@malachias.com
                </a>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-gray-600 text-xs tracking-wider mb-2">Based in</p>
                <p className="text-gray-400 text-sm">United States of America</p>
                <p className="text-[#c9a84c]/40 text-xs mt-1">One Nation Under God</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs tracking-wider text-center sm:text-left">
            © {new Date().getFullYear()} Malachias. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-xs tracking-wider">
            <span className="text-[#c9a84c]/40">✝</span>
            <span>Est. in Faith · Forged in Service</span>
            <span className="text-[#c9a84c]/40">★</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-600 tracking-wider">
            <a href="#" className="hover:text-gray-400 transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors duration-300">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
