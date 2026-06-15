'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Show } from '@/lib/data';

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatShowDate(iso: string): string {
  // parse without new Date() — split on '-'
  const parts = iso.split('-');
  const month = parseInt(parts[1] ?? '1', 10) - 1;
  const day   = parseInt(parts[2] ?? '1', 10);
  const year  = parts[0] ?? '';
  const mon   = MONTH_ABBR[month] ?? '';
  return `${mon} ${day}, ${year}`;
}

function todayISO(): string {
  // Build today's ISO date string via Date parts — avoids TZ offset pitfalls
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function NextShowBanner() {
  const [show, setShow] = useState<Show | null | undefined>(undefined); // undefined = loading
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then((d: { shows?: Show[] }) => {
        const today = todayISO();
        const upcoming = (d.shows ?? [])
          .filter(s => s.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date));
        setShow(upcoming[0] ?? null);
      })
      .catch(() => setShow(null));
  }, []);

  // Check localStorage dismissal once we know the show id
  useEffect(() => {
    if (!show) return;
    const key = `malachias_banner_${show.id}`;
    if (typeof window !== 'undefined' && localStorage.getItem(key) === 'dismissed') {
      setDismissed(true);
    }
  }, [show]);

  const handleDismiss = () => {
    if (show) {
      localStorage.setItem(`malachias_banner_${show.id}`, 'dismissed');
    }
    setDismissed(true);
  };

  // Not ready yet or no show
  if (show === undefined || show === null || dismissed) return null;

  return (
    <>
      {/* Fixed banner */}
      <motion.div
        initial={{ y: -44 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9997,
          height: 44,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        {/* Inner row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, justifyContent: 'center' }}>
          {/* Pulsing gold dot */}
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#c9a84c',
              display: 'inline-block',
              flexShrink: 0,
              animation: 'bannerDotPulse 2s ease-in-out infinite',
            }}
          />

          {/* NEXT SHOW label */}
          <span
            style={{
              fontSize: '0.52rem',
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              fontWeight: 600,
            }}
          >
            Next Show
          </span>

          <span style={{ color: 'rgba(201,168,76,0.40)', fontSize: '0.7rem' }}>·</span>

          {/* Date */}
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#e8ddd0' }}>
            {formatShowDate(show.date)}
          </span>

          <span style={{ color: 'rgba(201,168,76,0.40)', fontSize: '0.7rem' }}>·</span>

          {/* Venue + City */}
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: '#a89880' }}>
            {show.venue}{show.city ? ` · ${show.city}` : ''}
          </span>

          {/* Ticket link */}
          {show.ticketUrl && (
            <a
              href={show.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                color: '#c9a84c',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.35)',
                paddingBottom: '1px',
                marginLeft: '0.25rem',
                whiteSpace: 'nowrap',
              }}
            >
              Get Tickets →
            </a>
          )}
        </div>

        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'rgba(201,168,76,0.5)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            padding: '0.25rem',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c9a84c'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,168,76,0.5)'; }}
        >
          ✕
        </button>
      </motion.div>

      {/* Spacer so content is pushed below the fixed bar */}
      <div style={{ height: 44 }} aria-hidden="true" />

      {/* Keyframe for pulsing dot */}
      <style>{`
        @keyframes bannerDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </>
  );
}
