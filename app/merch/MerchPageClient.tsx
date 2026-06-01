'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ShoppingBag } from 'lucide-react';
import type { FWProduct } from '@/lib/fourthwall';
import { fwPriceRange, fwIsAvailable, fwFirstImage, fwCategory } from '@/lib/fourthwall';

const CATEGORIES = ['All', 'Apparel', 'Music', 'Accessories', 'Merch'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function ProductCard({ product, index }: { product: FWProduct; index: number }) {
  const img = fwFirstImage(product);
  const available = fwIsAvailable(product);
  const category = fwCategory(product);

  return (
    <motion.div
      {...fade(0.04 + index * 0.04)}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Link href={`/merch/${product.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            background: '#080808',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            transition: 'border-color 0.3s, transform 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#0d0d0d' }}>
            {img ? (
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ transition: 'transform 0.5s ease', filter: 'brightness(0.92)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingBag size={40} style={{ color: 'rgba(201,168,76,0.15)' }} />
              </div>
            )}

            {/* Status badge */}
            <div style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              fontSize: '0.50rem', letterSpacing: '0.30em', textTransform: 'uppercase',
              padding: '0.25rem 0.6rem',
              background: available ? 'rgba(52,211,153,0.15)' : 'rgba(201,168,76,0.12)',
              color: available ? '#34d399' : '#c9a84c',
              backdropFilter: 'blur(8px)',
            }}>
              {available ? 'Available' : 'Coming Soon'}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '1.1rem 1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {/* Category */}
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.30em', color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase' }}>
              {category}
            </span>

            {/* Name */}
            <p
              className="font-display"
              style={{ fontSize: '1.05rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.15 }}
            >
              {product.name}
            </p>

            {/* Price */}
            <div style={{ marginTop: 'auto', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                {fwPriceRange(product)}
              </span>
              <span style={{
                fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.55)', paddingBottom: '1px',
                borderBottom: '1px solid rgba(201,168,76,0.30)',
              }}>
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MerchPageClient({ products }: { products: FWProduct[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesQuery = !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCategory === 'All' || fwCategory(p) === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [products, query, activeCategory]);

  const hasProducts = products.length > 0;

  return (
    <main style={{ background: '#030202', minHeight: '100vh' }}>

      {/* Back to site */}
      <div style={{ padding: '1.5rem 1.5rem 0', position: 'relative', zIndex: 10 }}>
        <Link
          href="/"
          style={{
            fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.55)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c9a84c')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.55)')}
        >
          ← MALACHIAS.COM
        </Link>
      </div>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '70vw', height: '50vh', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.06) 0%, transparent 70%)',
        filter: 'blur(100px)',
      }} />

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div {...fade()} className="mb-14">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Support the Mission
          </p>
          <h1
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            OFFICIAL MERCH
          </h1>
          <div style={{
            width: '3rem', height: '1px', marginTop: '1rem',
            background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
          }} />
          <p className="mt-4 text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '32rem' }}>
            Every piece is tied to a song, a story, or a reason. Nothing here is filler.
            Faith · Freedom · Music.
          </p>
        </motion.div>

        {hasProducts ? (
          <>
            {/* Search + Filter bar */}
            <motion.div {...fade(0.08)} className="mb-10 flex flex-col sm:flex-row gap-4">
              {/* Search input */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '24rem' }}>
                <Search size={13} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,0.40)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Search merch…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4, padding: '0.55rem 2.2rem 0.55rem 2.2rem',
                    fontSize: '0.78rem', color: '#e8ddd0', letterSpacing: '0.04em',
                    outline: 'none', fontFamily: 'var(--font-body)',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.40)')}
                  onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.40)', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                      padding: '0.4rem 0.85rem', border: 'none', cursor: 'pointer',
                      borderRadius: 2, transition: 'background 0.2s, color 0.2s',
                      fontFamily: 'var(--font-body)',
                      background: activeCategory === cat ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      color: activeCategory === cat ? '#c9a84c' : 'rgba(138,127,112,0.70)',
                      outline: activeCategory === cat ? '1px solid rgba(201,168,76,0.30)' : '1px solid transparent',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results count */}
            <motion.p {...fade(0.10)} style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.14em', marginBottom: '2rem' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </motion.p>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '4rem 0' }}
                >
                  <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                    No items match your search.
                  </p>
                  <button
                    onClick={() => { setQuery(''); setActiveCategory('All'); }}
                    style={{ marginTop: '1rem', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  >
                    Clear filters →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* No Fourthwall products yet — coming soon state */
          <motion.div {...fade(0.08)} style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ marginBottom: '2rem' }}>
              <ShoppingBag size={32} style={{ color: 'rgba(201,168,76,0.20)', margin: '0 auto' }} />
            </div>
            <p className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'rgba(237,229,216,0.10)', letterSpacing: '0.06em', marginBottom: '1.2rem' }}>
              FIRST DROP INCOMING
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', maxWidth: '26rem', margin: '0 auto', lineHeight: 1.7 }}>
              The store is almost ready. Join the list and be the first to know
              when gear drops.
            </p>
            <Link
              href="/#newsletter"
              className="btn btn-primary"
              style={{ display: 'inline-block', marginTop: '2rem', fontSize: '0.68rem', letterSpacing: '0.18em' }}
            >
              Join the List
            </Link>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{
            marginTop: '5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(201,168,76,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.18em', fontStyle: 'italic' }}>
            Checkout and fulfillment handled by Fourthwall
          </p>
          <p style={{ fontSize: '0.55rem', color: 'rgba(140,110,60,0.28)', letterSpacing: '0.38em', textTransform: 'uppercase' }}>
            ✠ &nbsp; Faith · Freedom · Music &nbsp; ✠
          </p>
        </motion.div>

      </div>
    </main>
  );
}
