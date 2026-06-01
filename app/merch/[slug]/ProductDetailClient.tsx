'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FWProduct } from '@/lib/fourthwall';
import {
  fwFormatPrice, fwIsAvailable, fwCategory,
  fwColors, fwSizes, fwFindVariant, fwVariantInStock,
} from '@/lib/fourthwall';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ProductDetailClient({ product }: { product: FWProduct }) {
  const colors = fwColors(product);
  const sizes = fwSizes(product);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? '');

  const selectedVariant = fwFindVariant(product, selectedColor || undefined, selectedSize || undefined)
    ?? product.variants[0];

  const available = fwIsAvailable(product);
  const images = product.images.length > 0 ? product.images : (selectedVariant?.images ?? []);

  // Change image when color changes
  function handleColorSelect(colorName: string) {
    setSelectedColor(colorName);
    // Find the first variant image for this color
    const v = fwFindVariant(product, colorName, selectedSize || undefined)
      ?? product.variants.find(vv => vv.attributes.color?.name === colorName);
    if (v?.images[0]) {
      const idx = images.findIndex(img => img.id === v.images[0].id);
      if (idx >= 0) setActiveImg(idx);
    }
  }

  return (
    <main style={{ background: '#030202', minHeight: '100vh' }}>

      <div aria-hidden="true" style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '70vw', height: '50vh', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.06) 0%, transparent 70%)',
        filter: 'blur(100px)',
      }} />

      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16" style={{ position: 'relative', zIndex: 1 }}>

        {/* Breadcrumb */}
        <motion.div {...fade()} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          <Link href="/" style={{ color: 'rgba(201,168,76,0.45)', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <Link href="/merch" style={{ color: 'rgba(201,168,76,0.45)', textDecoration: 'none' }}>Store</Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span style={{ color: 'rgba(232,221,208,0.40)' }}>{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">

          {/* ── Image Gallery ─────────────────────────────────────────────── */}
          <motion.div {...fade(0.04)}>
            <div style={{
              position: 'relative', aspectRatio: '3/4', background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              {images.length > 0 ? (
                <Image
                  src={images[activeImg]?.url ?? images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  style={{ filter: 'brightness(0.94)' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={60} style={{ color: 'rgba(201,168,76,0.10)' }} />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.60)', border: 'none', borderRadius: 2, padding: '0.4rem', cursor: 'pointer', color: '#c9a84c', backdropFilter: 'blur(8px)' }}
                    aria-label="Previous"
                  ><ChevronLeft size={16} /></button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.60)', border: 'none', borderRadius: 2, padding: '0.4rem', cursor: 'pointer', color: '#c9a84c', backdropFilter: 'blur(8px)' }}
                    aria-label="Next"
                  ><ChevronRight size={16} /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{
                      position: 'relative', width: 56, height: 56, flexShrink: 0,
                      background: '#0d0d0d', padding: 0,
                      border: `1px solid ${activeImg === i ? 'rgba(201,168,76,0.60)' : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s',
                    }}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="56px" style={{ filter: 'brightness(0.90)' }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Product Info ───────────────────────────────────────────────── */}
          <div>
            <motion.span {...fade(0.06)} style={{ display: 'block', fontSize: '0.54rem', letterSpacing: '0.38em', color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {fwCategory(product)}
            </motion.span>

            <motion.h1 {...fade(0.08)} className="font-display" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '0.05em', color: '#e8ddd0', lineHeight: 0.95, marginBottom: '1rem' }}>
              {product.name}
            </motion.h1>

            <motion.p {...fade(0.10)} style={{ fontSize: '1.3rem', color: 'var(--gold)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              {selectedVariant ? fwFormatPrice(selectedVariant.unitPrice.value) : '—'}
            </motion.p>

            {selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice.value > selectedVariant.unitPrice.value && (
              <motion.p {...fade(0.11)} style={{ fontSize: '0.85rem', color: 'var(--text-3)', textDecoration: 'line-through', marginBottom: '0.4rem' }}>
                {fwFormatPrice(selectedVariant.compareAtPrice.value)}
              </motion.p>
            )}

            <motion.span {...fade(0.11)} style={{
              display: 'inline-block', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              padding: '0.22rem 0.6rem', marginBottom: '1.5rem',
              background: available ? 'rgba(52,211,153,0.12)' : 'rgba(201,168,76,0.10)',
              color: available ? '#34d399' : '#c9a84c',
            }}>
              {available ? 'In Stock' : 'Coming Soon'}
            </motion.span>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)', transformOrigin: 'left', marginBottom: '1.8rem' }}
            />

            {/* Color selector */}
            {colors.length > 0 && (
              <motion.div {...fade(0.14)} style={{ marginBottom: '1.4rem' }}>
                <p style={{ fontSize: '0.60rem', letterSpacing: '0.24em', color: 'rgba(138,127,112,0.80)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Color: <span style={{ color: '#c9a84c' }}>{selectedColor}</span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {colors.map(c => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => handleColorSelect(c.name)}
                      title={c.name}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: c.swatch,
                        border: `2px solid ${selectedColor === c.name ? '#c9a84c' : 'rgba(255,255,255,0.12)'}`,
                        cursor: 'pointer', padding: 0, transition: 'border-color 0.2s',
                        outline: selectedColor === c.name ? '1px solid rgba(201,168,76,0.30)' : 'none',
                        outlineOffset: 2,
                      }}
                      aria-label={c.name}
                      aria-pressed={selectedColor === c.name ? 'true' : 'false'}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <motion.div {...fade(0.16)} style={{ marginBottom: '1.8rem' }}>
                <p style={{ fontSize: '0.60rem', letterSpacing: '0.24em', color: 'rgba(138,127,112,0.80)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Size: <span style={{ color: '#c9a84c' }}>{selectedSize}</span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sizes.map(s => {
                    const v = fwFindVariant(product, selectedColor || undefined, s);
                    const inStock = v ? fwVariantInStock(v) : true;
                    const isActive = selectedSize === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => inStock && setSelectedSize(s)}
                        style={{
                          minWidth: 40, padding: '0.35rem 0.75rem',
                          fontSize: '0.65rem', letterSpacing: '0.08em', fontFamily: 'var(--font-body)',
                          border: `1px solid ${isActive ? 'rgba(201,168,76,0.60)' : 'rgba(255,255,255,0.10)'}`,
                          background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                          color: isActive ? '#c9a84c' : inStock ? '#8a7f70' : '#3a3530',
                          cursor: inStock ? 'pointer' : 'not-allowed',
                          textDecoration: !inStock ? 'line-through' : 'none',
                          transition: 'all 0.2s',
                        }}
                        aria-pressed={isActive ? 'true' : 'false'}
                        disabled={!inStock}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Buy button */}
            <motion.div {...fade(0.18)} style={{ marginBottom: '1.5rem' }}>
              {available ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.68rem', letterSpacing: '0.18em', padding: '0.75rem 1.8rem' }}
                >
                  <ShoppingBag size={14} />
                  Buy Now
                </a>
              ) : (
                <Link
                  href="/#newsletter"
                  className="btn btn-ghost"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.68rem', letterSpacing: '0.18em', padding: '0.75rem 1.6rem' }}
                >
                  Notify Me When Available
                </Link>
              )}
              <p style={{ marginTop: '0.5rem', fontSize: '0.52rem', color: 'var(--text-3)', letterSpacing: '0.12em' }}>
                Secure checkout &amp; fulfillment by Fourthwall
              </p>
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.div
                {...fade(0.20)}
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.4rem' }}
              >
                <p style={{ fontSize: '0.60rem', letterSpacing: '0.24em', color: 'rgba(138,127,112,0.70)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Details
                </p>
                <div
                  style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(220,210,195,0.65)', fontFamily: 'var(--font-body)' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Link
            href="/merch"
            style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', textDecoration: 'none' }}
          >
            ← Back to Store
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
