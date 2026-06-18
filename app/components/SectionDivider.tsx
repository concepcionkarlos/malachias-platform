'use client';

// Reusable decorative divider between sections — a horizontal rule with a centered
// cross ornament, diamond ticks, glow halo, and optional label. Accepts a gold or
// crimson accent.

import { motion } from 'framer-motion';

interface SectionDividerProps {
  /** Accent color for the cross and glow. Defaults to gold. */
  accent?: 'gold' | 'crimson';
  /** Optional label displayed beside the cross */
  label?: string;
}

const ACCENTS = {
  gold:    { hex: '#c9a84c', glow: 'rgba(201,168,76,0.35)',  faint: 'rgba(201,168,76,0.12)' },
  crimson: { hex: '#c04020', glow: 'rgba(192,64,32,0.35)',   faint: 'rgba(192,64,32,0.10)' },
};

export default function SectionDivider({ accent = 'gold', label }: SectionDividerProps) {
  const a = ACCENTS[accent];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.2 }}
      className="relative flex items-center justify-center py-2 overflow-hidden"
      aria-hidden="true"
    >
      {/* Full-width rule — left half */}
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${a.faint} 40%, ${a.glow} 100%)` }}
      />

      {/* Center ornament */}
      <div className="relative flex items-center gap-3 px-6 shrink-0">
        {/* Glow halo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{ background: a.glow }}
        />

        {/* Left diamond tick */}
        <div
          className="w-[5px] h-[5px] rotate-45 border"
          style={{ borderColor: a.hex, opacity: 0.5 }}
        />

        {/* Optional label */}
        {label && (
          <span
            className="relative text-[0.55rem] tracking-[0.5em] uppercase"
            style={{ color: a.hex, opacity: 0.7 }}
          >
            {label}
          </span>
        )}

        {/* Cross */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full blur-lg"
            style={{
              width: 32, height: 32,
              background: a.glow,
              opacity: 0.6,
              animation: 'radialPulse 4s ease-in-out infinite',
            }}
          />
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            className="relative z-10"
          >
            <rect x="6" y="0"  width="4" height="20" fill={a.hex} opacity="0.9" />
            <rect x="0" y="5"  width="16" height="4"  fill={a.hex} opacity="0.9" />
          </svg>
        </div>

        {/* Right diamond tick */}
        <div
          className="w-[5px] h-[5px] rotate-45 border"
          style={{ borderColor: a.hex, opacity: 0.5 }}
        />
      </div>

      {/* Full-width rule — right half */}
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${a.glow} 0%, ${a.faint} 60%, transparent 100%)` }}
      />
    </motion.div>
  );
}
