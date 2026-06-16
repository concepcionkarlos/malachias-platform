'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Music, Mic2, Heart, Star } from 'lucide-react';
import type { FWProduct } from '@/lib/fourthwall';
import { fwPriceRange, fwMinPrice, fwIsAvailable, fwFirstImage, fwCategory } from '@/lib/fourthwall';

const GOLD = '#c9a84c'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const IMPACT = [
  { icon: Music,  label: 'Funds shows',      sub: 'Keeps us on stage' },
  { icon: Mic2,   label: 'Funds recording',   sub: 'Next album in the works' },
  { icon: Heart,  label: 'Veteran outreach',  sub: 'Music as medicine' },
  { icon: Star,   label: 'Faith community',   sub: "You're part of this" },
]

// Short punchy copy per product slug (falls back to generic)
const PRODUCT_HOOKS: Record<string, string> = {
  'support-the-mission-malachias-faith-freedom-music-mug':
    'Start every morning with the mission.',
  'malachias-warrior-hat-support-the-mission':
    'Wear it every day. Let people ask.',
  'malachias-warrior-trucker-hat-support-the-mission':
    'Built for the field. Built for faith.',
  'malachias-faith-freedom-music-premium-tee':
    'The signature piece. Carry the mission on your chest.',
}

function ProductCard({ product, index }: { product: FWProduct; index: number }) {
  const img = fwFirstImage(product);
  const available = fwIsAvailable(product);
  const category = fwCategory(product);
  const hook = PRODUCT_HOOKS[product.slug] ?? 'Every purchase keeps the mission alive.'

  return (
    <motion.div {...fade(0.04 + index * 0.05)} style={{ display: 'flex', flexDirection: 'column' }}>
      <Link href={`/merch/${product.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            background: '#080808',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', flexDirection: 'column', flex: 1,
            transition: 'border-color 0.3s, transform 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.30)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0d0d0d' }}>
            {img ? (
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ transition: 'transform 0.5s ease', filter: 'brightness(0.92)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={40} style={{ color: 'rgba(201,168,76,0.10)' }} />
              </div>
            )}

            {/* Availability badge */}
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              padding: '0.25rem 0.6rem',
              background: available ? 'rgba(52,211,153,0.15)' : 'rgba(201,168,76,0.12)',
              color: available ? '#34d399' : GOLD,
              backdropFilter: 'blur(8px)',
            }}>
              {available ? 'Available' : 'Soon'}
            </div>

            {/* Category badge */}
            <div style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              fontSize: '0.46rem', letterSpacing: '0.24em', textTransform: 'uppercase',
              padding: '0.22rem 0.55rem',
              background: 'rgba(0,0,0,0.55)',
              color: 'rgba(201,168,76,0.55)',
              backdropFilter: 'blur(8px)',
            }}>
              {category}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '1.1rem 1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
            <p
              className="font-display"
              style={{ fontSize: '1.05rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.15, margin: 0 }}
            >
              {product.name}
            </p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#5c5044', lineHeight: 1.55 }}>
              {hook}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.95rem', color: GOLD, letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}>
                {fwPriceRange(product)}
              </span>
              <span style={{
                fontSize: '0.54rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.60)', paddingBottom: '1px',
                borderBottom: '1px solid rgba(201,168,76,0.30)',
              }}>
                Shop →
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

  // Derive only categories that actually exist in the catalog
  const availableCategories = useMemo(() => {
    const cats = new Set(products.map(fwCategory))
    return ['All', ...(['Apparel', 'Music', 'Accessories', 'Merch'].filter(c => cats.has(c)))]
  }, [products])

  // Filter + sort cheapest first so the entry-point product leads
  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const matchesQuery = !query.trim()
          || p.name.toLowerCase().includes(query.toLowerCase())
          || p.description.toLowerCase().includes(query.toLowerCase());
        const matchesCat = activeCategory === 'All' || fwCategory(p) === activeCategory;
        return matchesQuery && matchesCat;
      })
      .sort((a, b) => fwMinPrice(a) - fwMinPrice(b));
  }, [products, query, activeCategory]);

  const hasProducts = products.length > 0;
  const minPrice = hasProducts ? Math.min(...products.map(fwMinPrice)) : 0;

  return (
    <main style={{ background: '#030202', minHeight: '100vh' }}>

      {/* Nav strip */}
      <div style={{ padding: '1.5rem 1.5rem 0', position: 'relative', zIndex: 10 }}>
        <Link
          href="/"
          style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = GOLD)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.55)')}
        >
          ← MALACHIAS.COM
        </Link>
      </div>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: '70vw', height: '50vh', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse, rgba(80,34,6,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />

      <div className="max-w-6xl mx-auto px-6 py-14 lg:py-20" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div {...fade()} style={{ marginBottom: '3rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.62rem', letterSpacing: '0.42em', color: GOLD, textTransform: 'uppercase' }}>
            Support the Mission
          </p>
          <h1
            className="font-display"
            style={{ margin: '0 0 1rem', fontSize: 'clamp(2.8rem, 7vw, 5rem)', letterSpacing: '0.06em', color: '#e8ddd0', lineHeight: 0.92 }}
          >
            WEAR THE<br />MISSION
          </h1>
          <div style={{ width: '3rem', height: '1px', marginBottom: '1.2rem', background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)' }} />
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.90rem', color: '#5c5044', lineHeight: 1.75, maxWidth: '36rem' }}>
            Veteran-founded. Faith-driven. No label, no middleman.<br />
            Every piece you buy funds the next show, the next song, and veteran outreach.
          </p>
          {hasProducts && minPrice > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                color: GOLD, padding: '0.3rem 0.85rem',
                background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.22)',
              }}>
                Starting at ${minPrice % 1 === 0 ? minPrice.toFixed(0) : minPrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: '#3a3228' }}>
                {products.length} {products.length === 1 ? 'item' : 'items'} in the store
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Impact Strip ──────────────────────────────────────────────── */}
        <motion.div
          {...fade(0.06)}
          style={{ display: 'grid', gap: 1, marginBottom: '3.5rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.10)' }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {IMPACT.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ background: '#030202', padding: '1.1rem 1rem', textAlign: 'center' }}>
              <Icon size={16} style={{ color: GOLD, margin: '0 auto 0.45rem', display: 'block', opacity: 0.7 }} />
              <p style={{ margin: '0 0 0.15rem', fontSize: '0.60rem', letterSpacing: '0.16em', color: '#e8ddd0', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.56rem', color: '#5c5044', letterSpacing: '0.08em' }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        {hasProducts ? (
          <>
            {/* ── Filter row ─────────────────────────────────────────────── */}
            {availableCategories.length > 2 && (
              <motion.div {...fade(0.08)} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '20rem' }}>
                  <input
                    type="text"
                    placeholder="Search…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 2rem 0.5rem 0.85rem',
                      fontSize: '0.78rem', color: '#e8ddd0', letterSpacing: '0.04em',
                      outline: 'none', fontFamily: 'var(--font-body)',
                      transition: 'border-color 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.40)')}
                    onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.40)', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Category pills */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        fontSize: '0.54rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                        padding: '0.38rem 0.8rem', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                        background: activeCategory === cat ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        color: activeCategory === cat ? GOLD : 'rgba(138,127,112,0.70)',
                        outline: activeCategory === cat ? `1px solid rgba(201,168,76,0.30)` : '1px solid transparent',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Product Grid ────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5"
                >
                  {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '4rem 0' }}
                >
                  <p style={{ color: '#5c5044', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
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
          /* No products yet */
          <motion.div {...fade(0.08)} style={{ textAlign: 'center', padding: '5rem 0' }}>
            <ShoppingBag size={32} style={{ color: 'rgba(201,168,76,0.18)', margin: '0 auto 1.5rem' }} />
            <p className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'rgba(237,229,216,0.10)', letterSpacing: '0.06em', marginBottom: '1.2rem' }}>
              FIRST DROP INCOMING
            </p>
            <p style={{ fontSize: '0.85rem', color: '#3a3228', maxWidth: '26rem', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Join the list and be the first to know when gear drops.
            </p>
            <Link
              href="/#newsletter"
              style={{ display: 'inline-block', padding: '0.75rem 2rem', background: GOLD, color: '#030202', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)' }}
            >
              Join the List
            </Link>
          </motion.div>
        )}

        {/* ── Mission CTA banner ───────────────────────────────────────── */}
        {hasProducts && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ marginTop: '5rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.10)', padding: '2.5rem', textAlign: 'center' }}
          >
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.56rem', letterSpacing: '0.38em', color: GOLD, textTransform: 'uppercase' }}>
              More than merch
            </p>
            <p style={{ margin: '0 0 0.8rem', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              You&apos;re funding the mission.
            </p>
            <p style={{ margin: '0 auto 1.8rem', fontSize: '0.85rem', color: '#5c5044', lineHeight: 1.75, maxWidth: '30rem' }}>
              Every sale directly supports live shows, original recordings, and veteran
              outreach. No label. No corporate backing. Just the band and the people who
              believe in it.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/support"
                style={{ display: 'inline-block', padding: '0.65rem 1.6rem', background: GOLD, color: '#030202', fontSize: '0.62rem', letterSpacing: '0.20em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)' }}
              >
                See all ways to support →
              </Link>
              <Link
                href="/#newsletter"
                style={{ display: 'inline-block', padding: '0.65rem 1.6rem', border: '1px solid rgba(201,168,76,0.28)', color: GOLD, fontSize: '0.62rem', letterSpacing: '0.20em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                Get first access to new drops →
              </Link>
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <p style={{ margin: 0, fontSize: '0.58rem', color: '#2e2820', letterSpacing: '0.18em', fontStyle: 'italic' }}>
            Checkout and fulfillment handled securely by Fourthwall
          </p>
          <p style={{ margin: 0, fontSize: '0.55rem', color: 'rgba(140,110,60,0.25)', letterSpacing: '0.38em', textTransform: 'uppercase' }}>
            ✠ &nbsp; Faith · Freedom · Music &nbsp; ✠
          </p>
        </motion.div>

      </div>
    </main>
  );
}
