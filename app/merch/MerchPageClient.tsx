'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ShoppingBag, Music, Mic2, Heart, Star } from 'lucide-react';
import type { FWProduct } from '@/lib/fourthwall';
import { fwPriceRange, fwIsAvailable, fwFirstImage, fwCategory } from '@/lib/fourthwall';

const GOLD = '#c9a84c'
const CATEGORIES = ['All', 'Apparel', 'Music', 'Accessories', 'Merch'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const IMPACT = [
  { icon: Music,  label: 'Funds shows',       sub: 'Keeps us on stage' },
  { icon: Mic2,   label: 'Funds recording',    sub: 'Next album in the works' },
  { icon: Heart,  label: 'Veteran outreach',   sub: 'Music as medicine' },
  { icon: Star,   label: 'Faith community',    sub: "You're part of this" },
]

function ProductCard({ product, index, featured }: { product: FWProduct; index: number; featured?: boolean }) {
  const img = fwFirstImage(product);
  const available = fwIsAvailable(product);
  const category = fwCategory(product);

  if (featured) {
    return (
      <motion.div
        {...fade(0.08)}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: '#080808', border: '1px solid rgba(201,168,76,0.12)' }}
      >
        {/* Large image */}
        <Link href={`/merch/${product.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0d0d0d' }}>
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover"
              sizes="50vw"
              style={{ transition: 'transform 0.6s ease', filter: 'brightness(0.90)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.03)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={60} style={{ color: 'rgba(201,168,76,0.10)' }} />
            </div>
          )}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.50rem', letterSpacing: '0.28em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', background: available ? 'rgba(52,211,153,0.15)' : 'rgba(201,168,76,0.12)', color: available ? '#34d399' : GOLD, backdropFilter: 'blur(8px)' }}>
            {available ? 'Available Now' : 'Coming Soon'}
          </div>
        </Link>

        {/* Info panel */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.2rem' }}>
          <span style={{ fontSize: '0.52rem', letterSpacing: '0.36em', color: 'rgba(201,168,76,0.50)', textTransform: 'uppercase' }}>
            {category}
          </span>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#5c5044', lineHeight: 1.7 }}>
            Every piece is tied to a song, a story, or a reason.<br />
            Wear the mission.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, fontSize: '0.60rem', letterSpacing: '0.14em', color: '#3a3228' }}>YOUR PURCHASE SUPPORTS</p>
            {['Live shows & touring', 'Original music recording', 'Veteran mission outreach'].map(s => (
              <p key={s} style={{ margin: 0, fontSize: '0.78rem', color: '#8a7f70', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: GOLD }}>✓</span> {s}
              </p>
            ))}
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: GOLD, letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}>
              {fwPriceRange(product)}
            </p>
            <Link
              href={`/merch/${product.slug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.8rem', background: GOLD, color: '#030202', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <ShoppingBag size={13} /> Support the Band
            </Link>
          </div>
          <p style={{ margin: 0, fontSize: '0.52rem', color: '#2e2820', letterSpacing: '0.12em' }}>
            Secure checkout · Fulfilled by Fourthwall
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div {...fade(0.04 + index * 0.04)} style={{ display: 'flex', flexDirection: 'column' }}>
      <Link href={`/merch/${product.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flex: 1, transition: 'border-color 0.3s, transform 0.3s', cursor: 'pointer' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0d0d0d' }}>
            {img ? (
              <Image src={img} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ transition: 'transform 0.5s ease', filter: 'brightness(0.92)' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={40} style={{ color: 'rgba(201,168,76,0.10)' }} />
              </div>
            )}
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.50rem', letterSpacing: '0.28em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', background: available ? 'rgba(52,211,153,0.15)' : 'rgba(201,168,76,0.12)', color: available ? '#34d399' : GOLD, backdropFilter: 'blur(8px)' }}>
              {available ? 'Available' : 'Soon'}
            </div>
          </div>
          <div style={{ padding: '1.1rem 1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.30em', color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase' }}>{category}</span>
            <p className="font-display" style={{ fontSize: '1.05rem', letterSpacing: '0.04em', color: '#e8ddd0', lineHeight: 1.15 }}>{product.name}</p>
            <div style={{ marginTop: 'auto', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.88rem', color: GOLD, letterSpacing: '0.06em' }}>{fwPriceRange(product)}</span>
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', paddingBottom: '1px', borderBottom: '1px solid rgba(201,168,76,0.30)' }}>View →</span>
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
      const matchesQuery = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCategory === 'All' || fwCategory(p) === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [products, query, activeCategory]);

  const hasProducts = products.length > 0;
  const isSingleProduct = filtered.length === 1 && !query && activeCategory === 'All';

  return (
    <main style={{ background: '#030202', minHeight: '100vh' }}>

      {/* Nav strip */}
      <div style={{ padding: '1.5rem 1.5rem 0', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = GOLD)} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.55)')}>
          ← MALACHIAS.COM
        </Link>
      </div>

      {/* Ambient */}
      <div aria-hidden="true" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: '70vw', height: '50vh', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse, rgba(80,34,6,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />

      <div className="max-w-6xl mx-auto px-6 py-14 lg:py-20" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero Header ─────────────────────────────────────────── */}
        <motion.div {...fade()} style={{ marginBottom: '3rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.62rem', letterSpacing: '0.42em', color: GOLD, textTransform: 'uppercase' }}>
            Support the Mission
          </p>
          <h1 className="font-display" style={{ margin: '0 0 1rem', fontSize: 'clamp(2.8rem, 7vw, 5rem)', letterSpacing: '0.06em', color: '#e8ddd0', lineHeight: 0.92 }}>
            OFFICIAL MERCH
          </h1>
          <div style={{ width: '3rem', height: '1px', marginBottom: '1.2rem', background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)' }} />
          <p style={{ margin: 0, fontSize: '0.90rem', color: '#5c5044', lineHeight: 1.75, maxWidth: '36rem' }}>
            Veteran-founded. Faith-driven. Every piece tells a story.<br />
            When you wear Malachias, you carry the mission with you.
          </p>
        </motion.div>

        {/* ── Impact Strip ─────────────────────────────────────────── */}
        <motion.div
          {...fade(0.06)}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: '3.5rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.10)' }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {IMPACT.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ background: '#030202', padding: '1.2rem 1rem', textAlign: 'center' }}>
              <Icon size={18} style={{ color: GOLD, margin: '0 auto 0.5rem', display: 'block', opacity: 0.7 }} />
              <p style={{ margin: '0 0 0.2rem', fontSize: '0.62rem', letterSpacing: '0.16em', color: '#e8ddd0', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.58rem', color: '#5c5044', letterSpacing: '0.08em' }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        {hasProducts ? (
          <>
            {/* ── Featured single product ─────────────────────────── */}
            {isSingleProduct && <ProductCard product={filtered[0]} index={0} featured />}

            {/* ── Multiple products: search + grid ─────────────────── */}
            {!isSingleProduct && (
              <>
                <motion.div {...fade(0.08)} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '24rem' }}>
                      <Search size={13} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,0.40)', pointerEvents: 'none' }} />
                      <input type="text" placeholder="Search merch…" value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '0.55rem 2.2rem 0.55rem 2.2rem', fontSize: '0.78rem', color: '#e8ddd0', letterSpacing: '0.04em', outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.40)')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')} />
                      {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.40)', padding: 0 }}><X size={12} /></button>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '0.4rem 0.85rem', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s', fontFamily: 'var(--font-body)', background: activeCategory === cat ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', color: activeCategory === cat ? GOLD : 'rgba(138,127,112,0.70)', outline: activeCategory === cat ? `1px solid rgba(201,168,76,0.30)` : '1px solid transparent' }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.62rem', color: '#3a3228', letterSpacing: '0.14em' }}>{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {filtered.length > 0 ? (
                    <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '4rem 0' }}>
                      <p style={{ color: '#5c5044', fontSize: '0.85rem', letterSpacing: '0.08em' }}>No items match your search.</p>
                      <button onClick={() => { setQuery(''); setActiveCategory('All'); }} style={{ marginTop: '1rem', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear filters →</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </>
        ) : (
          /* No products yet */
          <motion.div {...fade(0.08)} style={{ textAlign: 'center', padding: '5rem 0' }}>
            <ShoppingBag size={32} style={{ color: 'rgba(201,168,76,0.18)', margin: '0 auto 1.5rem' }} />
            <p className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'rgba(237,229,216,0.10)', letterSpacing: '0.06em', marginBottom: '1.2rem' }}>FIRST DROP INCOMING</p>
            <p style={{ fontSize: '0.85rem', color: '#3a3228', maxWidth: '26rem', margin: '0 auto 2rem', lineHeight: 1.7 }}>Join the list and be the first to know when gear drops.</p>
            <Link href="/#newsletter" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: GOLD, color: '#030202', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-body)' }}>
              Join the List
            </Link>
          </motion.div>
        )}

        {/* ── Support CTA banner ───────────────────────────────────── */}
        {hasProducts && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
            style={{ marginTop: '5rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.10)', padding: '2.5rem', textAlign: 'center' }}
          >
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.58rem', letterSpacing: '0.36em', color: GOLD, textTransform: 'uppercase' }}>More than merch</p>
            <p style={{ margin: '0 0 0.8rem', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>You're funding the mission.</p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#5c5044', lineHeight: 1.75, maxWidth: '30rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Every sale directly supports live shows, original recordings, and veteran outreach. No label. No corporate backing. Just the band and the people who believe in it.
            </p>
            <Link href="/#newsletter" style={{ display: 'inline-block', padding: '0.65rem 1.6rem', border: '1px solid rgba(201,168,76,0.35)', color: GOLD, fontSize: '0.62rem', letterSpacing: '0.20em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.10)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              Join the inner circle →
            </Link>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.58rem', color: '#2e2820', letterSpacing: '0.18em', fontStyle: 'italic' }}>Checkout and fulfillment handled by Fourthwall</p>
          <p style={{ margin: 0, fontSize: '0.55rem', color: 'rgba(140,110,60,0.25)', letterSpacing: '0.38em', textTransform: 'uppercase' }}>✠ &nbsp; Faith · Freedom · Music &nbsp; ✠</p>
        </motion.div>

      </div>
    </main>
  );
}
