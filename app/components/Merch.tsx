'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MerchItem } from '@/lib/data';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const CATEGORY_LABEL: Record<string, string> = {
  apparel: 'Apparel',
  music: 'Music',
  accessories: 'Accessories',
  other: 'Other',
};

function statusLabel(item: MerchItem): string {
  if (!item.available) return 'Coming Soon';
  if (item.stockQuantity !== undefined && item.stockQuantity <= 0) return 'Sold Out';
  return 'Available';
}

function statusColor(item: MerchItem): string {
  if (!item.available) return 'var(--gold)';
  if (item.stockQuantity !== undefined && item.stockQuantity <= 0) return '#c04020';
  return '#34d399';
}

export default function Merch() {
  const [items, setItems] = useState<MerchItem[] | null>(null);

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.merch)) setItems(d.merch); })
      .catch(() => {});
  }, []);

  const drops = items ?? [];
  const hasItems = drops.length > 0;

  return (
    <section id="merch" style={{ background: '#040404' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} className="mb-14">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            The Store
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            FIRST DROP
          </h2>
          <div
            className="mt-4 mb-5"
            style={{
              width: '3rem', height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
          <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '32rem' }}>
            Every piece is tied to a song, a story, or a reason.
            Nothing here is filler.
          </p>
        </motion.div>

        {/* Status strip */}
        <motion.div
          {...fade(0.06)}
          className="flex flex-wrap items-center gap-4 mb-10"
          style={{
            borderTop: '1px solid rgba(201,168,76,0.08)',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
            padding: '0.85rem 0',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', animation: 'glowPulse 2s ease-in-out infinite' }} />
            Production Underway
          </span>
          <span style={{ fontSize: '0.60rem', color: 'var(--text-3)', letterSpacing: '0.12em' }}>·</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em' }}>
            Supporters hear first when the drop lands
          </span>
        </motion.div>

        {hasItems ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mb-12"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {drops.map((item, i) => (
              <motion.div
                key={item.id}
                {...fade(0.04 + i * 0.04)}
                style={{ background: '#040404', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', transition: 'background 0.3s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#080808')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#040404')}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.56rem', letterSpacing: '0.28em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
                    {CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                  <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: statusColor(item), background: 'rgba(201,168,76,0.07)', padding: '0.2rem 0.55rem', textTransform: 'uppercase' }}>
                    {statusLabel(item)}
                  </span>
                </div>

                {/* Image */}
                {(item.image ?? item.images?.[0]) && (
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#0a0a0a' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image ?? item.images![0]}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                    />
                  </div>
                )}

                {/* Name */}
                <div>
                  <p className="font-display" style={{ fontSize: '1.1rem', color: '#e8ddd0', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                    {item.description ?? ''}
                  </p>
                </div>

                {/* Story */}
                {item.story && (
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-3)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.65rem', marginTop: 'auto' }}>
                    {item.story}
                  </p>
                )}

                {/* Price + link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                    ${item.price}
                  </span>
                  {item.externalUrl && item.available && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ fontSize: '0.62rem', padding: '0.35rem 0.85rem', letterSpacing: '0.14em' }}
                    >
                      Buy
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          items !== null && (
            <motion.div {...fade(0.08)} className="mb-12" style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                First drop incoming. Join the list to hear first.
              </p>
            </motion.div>
          )
        )}

        {/* Loading skeleton */}
        {items === null && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mb-12"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{ background: '#040404', padding: '1.5rem', height: 200, opacity: 0.3 + i * 0.05 }}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div {...fade(0.22)} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '28rem' }}>
            No store yet. When the first drop is ready, supporters hear first.
          </p>
          <a href="#newsletter" className="btn btn-primary shrink-0">
            Join the List
          </a>
        </motion.div>

      </div>
    </section>
  );
}
