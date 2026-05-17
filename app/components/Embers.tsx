'use client';

import { useMemo } from 'react';

interface Ember {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

interface EmbersProps {
  count?: number;
  className?: string;
}

export default function Embers({ count = 20, className = '' }: EmbersProps) {
  /* Deterministic seed — SSR and client always match */
  const embers = useMemo<Ember[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${((i * 37 + 11) % 100)}%`,
      size: 1 + (i % 4) * 0.65,
      duration: 4.5 + (i % 6) * 1.1,
      delay: (i % 9) * 0.75,
      drift: ((i % 7) - 3) * 18,
      color:
        i % 4 === 0 ? '#c9a84c' :
        i % 4 === 1 ? '#e06020' :
        i % 4 === 2 ? '#c03010' :
                      '#e8a020',
    }))
  , [count]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: e.left,
            width:  `${e.size}px`,
            height: `${e.size}px`,
            background: e.color,
            boxShadow: `0 0 ${e.size * 3}px ${e.color}99`,
            animation: `emberFloat ${e.duration}s ease-out ${e.delay}s infinite`,
            '--ember-drift': `${e.drift}px`,
            /* GPU composite layer — no layout/paint on animate */
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
