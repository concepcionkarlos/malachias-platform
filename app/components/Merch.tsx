'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { FWProduct } from '@/lib/fourthwall';
import { fwPriceRange, fwIsAvailable, fwFirstImage, fwCategory } from '@/lib/fourthwall';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

interface MerchProps {
  // Passed from the server component — avoids client-side fetch of sensitive token
  fourthwallProducts?: FWProduct[];
}

function ProductCard({ product, index }: { product: FWProduct; index: number }) {
  const img = fwFirstImage(product);
  const available = fwIsAvailable(product);
  const price = fwPriceRange(product);

  return (
    <motion.div key={product.id} {...fade(0.04 + index * 0.05)}>
      <Link href={`/merch/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{ background: '#040404', border: '1px solid rgba(201,168,76,0.12)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'border-color 0.25s, transform 0.25s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '1/1', background: '#0a0a0a', overflow: 'hidden' }}>
            {img ? (
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ filter: 'brightness(0.92)' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={28} style={{ color: 'rgba(201,168,76,0.10)' }} />
              </div>
            )}
          </div>

          {/* Info + BIG buy button */}
          <div style={{ padding: '0.9rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p className="font-display" style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.15 }}>
              {product.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', color: '#c9a84c', letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}>
                {price}
              </span>
              <span style={{
                display: 'inline-block', padding: '0.45rem 1rem',
                background: available ? '#c9a84c' : 'rgba(201,168,76,0.15)',
                color: available ? '#030202' : '#c9a84c',
                fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: 700, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              }}>
                {available ? 'Buy Now' : 'Coming Soon'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Merch({ fourthwallProducts = [] }: MerchProps) {
  // Fallback: fetch legacy items if no Fourthwall products passed
  const [legacyItems, setLegacyItems] = useState<FWProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (fourthwallProducts.length > 0) { setLoaded(true); return; }
    // No Fourthwall products from server — try legacy content
    fetch('/api/public/content')
      .then(r => r.json())
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [fourthwallProducts.length]);

  // Sort cheapest first so the $8.95 mug (entry point) leads
  const products = fourthwallProducts.length > 0
    ? [...fourthwallProducts].sort((a, b) => {
        const aMin = a.variants.length ? Math.min(...a.variants.map(v => v.unitPrice.value)) : 0
        const bMin = b.variants.length ? Math.min(...b.variants.map(v => v.unitPrice.value)) : 0
        return aMin - bMin
      }).slice(0, 4)
    : [];
  const hasFourthwall = fourthwallProducts.length > 0;

  return (
    <section id="merch" style={{ background: '#040404', position: 'relative' }} className="section-pad overflow-hidden">

      {/* Background glow */}
      <motion.div
        animate={{ opacity: [0.03, 0.09, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Ghost section numeral */}
      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', bottom: '4%', right: '-1%' }}>05</div>

      <div className="max-w-5xl mx-auto px-6 relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div {...fade()} className="mb-14">
          {/* Store live badge */}
          <motion.div
            animate={{ boxShadow: ['0 0 0px rgba(201,168,76,0)', '0 0 16px rgba(201,168,76,0.20)', '0 0 0px rgba(201,168,76,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.20)', borderRadius: 999, padding: '0.35rem 0.9rem' }}
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }}
            />
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: '#c9a84c', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
              Store Live
            </span>
          </motion.div>
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Support the Mission
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            WEAR THE MISSION
          </h2>
          <div
            className="mt-4 mb-5"
            style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)' }}
          />
          <p className="text-[0.90rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '36rem' }}>
            No label. No corporate backing. Just a veteran, a guitar, and a mission.<br />
            When you wear Malachias, you carry that with you.
          </p>
        </motion.div>

        {/* Impact points */}
        <motion.div {...fade(0.05)} className="flex flex-wrap gap-x-8 gap-y-2 mb-10">
          {['Funds live shows', 'Funds original recordings', 'Supports veteran outreach', 'Faith-driven music'].map(s => (
            <span key={s} style={{ fontSize: '0.70rem', color: '#5c5044', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#c9a84c' }}>✓</span> {s}
            </span>
          ))}
        </motion.div>

        {/* Status strip */}
        <motion.div
          {...fade(0.06)}
          className="flex flex-wrap items-center gap-4 mb-10"
          style={{ borderTop: '1px solid rgba(201,168,76,0.08)', borderBottom: '1px solid rgba(201,168,76,0.08)', padding: '0.85rem 0' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', animation: 'glowPulse 2s ease-in-out infinite' }} />
            {hasFourthwall ? 'Store Live' : 'Coming Soon'}
          </span>
          <span style={{ fontSize: '0.60rem', color: 'var(--text-3)', letterSpacing: '0.12em' }}>·</span>
          {hasFourthwall ? (
            <>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em' }}>
                4 items · Starting at $8.95
              </span>
              <span style={{ fontSize: '0.60rem', color: 'var(--text-3)', letterSpacing: '0.12em' }}>·</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em' }}>
                Fulfilled by Fourthwall
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em' }}>
              Supporters hear first when the drop lands
            </span>
          )}
        </motion.div>

        {/* Loading skeleton */}
        {!loaded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mb-12" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ background: '#040404', padding: '1.5rem', height: 240, opacity: 0.3 + i * 0.05 }} />
            ))}
          </div>
        )}

        {/* Fourthwall products grid */}
        {loaded && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        {/* Coming soon state */}
        {loaded && products.length === 0 && (
          <motion.div {...fade(0.08)} style={{ textAlign: 'center', padding: '3rem 0' }} className="mb-12">
            <ShoppingBag size={28} style={{ color: 'rgba(201,168,76,0.15)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
              First drop incoming. Join the list to hear first.
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div {...fade(0.22)} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {hasFourthwall ? (
            <>
              <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '28rem' }}>
                Every purchase keeps the mission alive. No middleman, no label — just you and the band.
              </p>
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(201,168,76,0)', '0 0 22px rgba(201,168,76,0.32)', '0 0 0px rgba(201,168,76,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <Link href="/merch" className="btn btn-primary" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', padding: '0.75rem 2rem', display: 'inline-block' }}>
                  Support the Band →
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '28rem' }}>
                No store yet. When the first drop is ready, supporters hear first.
              </p>
              <Link href="#newsletter" className="btn btn-primary shrink-0">
                Join the List
              </Link>
            </>
          )}
        </motion.div>

      </div>
    </section>
  );
}
