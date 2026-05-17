'use client';

import { useState, useRef, MouseEvent, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

type Product = {
  name: string;
  cat: string;
  price: string;
  tag: string | null;
  tagColor: string;
  tagTextColor: string;
  colors: string[];
};

const PRODUCTS: Product[] = [
  { name: 'Faith on Fire Hoodie',     cat: 'Apparel',     price: '$59.99', tag: 'BEST SELLER', tagColor: '#c9a84c', tagTextColor: '#000',  colors: ['#111', '#1a0800', '#0a0510'] },
  { name: 'Veteran Spirit Tee',       cat: 'Apparel',     price: '$34.99', tag: 'NEW DROP',    tagColor: '#8b0000', tagTextColor: '#fff',  colors: ['#080808', '#0a1020', '#200a00'] },
  { name: 'Guitar Picks · Set of 12', cat: 'Gear',        price: '$14.99', tag: 'FAN FAV',     tagColor: '#2d6a2d', tagTextColor: '#fff',  colors: ['#c9a84c', '#8b0000', '#1a2d5a'] },
  { name: 'Tactical Snapback',        cat: 'Headwear',    price: '$39.99', tag: null,           tagColor: '',        tagTextColor: '',      colors: ['#111', '#2a2a1a', '#181818'] },
  { name: 'Veteran Bundle',           cat: 'Bundles',     price: '$99.99', tag: 'LIMITED',     tagColor: '#c9a84c', tagTextColor: '#000',  colors: ['#8b0000', '#c9a84c', '#1a2d5a'] },
  { name: 'Dog Tag Necklace',         cat: 'Accessories', price: '$24.99', tag: 'NEW',         tagColor: '#7a8090', tagTextColor: '#fff',  colors: ['#888', '#c9a84c', '#111'] },
];

const CATEGORIES = ['All', 'Apparel', 'Gear', 'Headwear', 'Accessories', 'Bundles'];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const spotRef    = useRef<HTMLDivElement>(null);

  /* Direct DOM mutation — zero re-renders on mouse move */
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !spotRef.current) return;
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    spotRef.current.style.background =
      `radial-gradient(circle 200px at ${x}% ${y}%, rgba(255,255,255,0.055), transparent 70%)`;
  }, []);

  return (
    <motion.div
      ref={cardRef}
      key={product.name}
      {...fade(index * 0.07)}
      className="tac-box group overflow-hidden relative cursor-pointer"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight — updated via ref, never triggers re-render */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{ willChange: 'background' }}
      />

      {/* Product visual area */}
      <div className="relative h-52 flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #111 0%, #080808 100%)' }}
      >
        {/* Tag badge */}
        {product.tag && (
          <span
            className="absolute top-3 left-3 text-[0.56rem] tracking-[0.28em] uppercase px-2 py-[3px] font-bold z-20"
            style={{ background: product.tagColor, color: product.tagTextColor }}
          >
            {product.tag}
          </span>
        )}

        {/* Faint watermark name */}
        <span
          className="font-display text-[2rem] tracking-wider text-center leading-tight px-4 select-none"
          style={{ color: 'rgba(255,255,255,0.05)' }}
        >
          {product.name.split(' ').slice(0, 2).join('\n')}
        </span>

        {/* Color swatches */}
        <div className="flex gap-2">
          {product.colors.map((c, j) => (
            <div
              key={j}
              className="w-3.5 h-3.5 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform duration-200"
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Shimmer pass */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          }}
        />
      </div>

      {/* Info row */}
      <div className="p-4 flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <div className="label-xs mb-1" style={{ color: 'var(--text-3)' }}>{product.cat}</div>
          <div className="text-white text-sm font-semibold tracking-wide truncate">{product.name}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-display text-lg tracking-wider" style={{ color: 'var(--gold)' }}>{product.price}</span>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="w-8 h-8 border border-[#c9a84c]/25 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black transition-all duration-300"
          >
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Merch() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === activeCategory);

  return (
    <section id="merch" style={{ background: '#050505' }} className="section-pad">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4">Gear Up, Soldier</p>
          <h2 className="font-display text-[clamp(3rem,9vw,6.5rem)] tracking-[0.08em] text-white leading-none">
            MERCH
          </h2>
          <p className="text-sm mt-3" style={{ color: 'var(--text-2)' }}>
            10% of every purchase supports veteran outreach
          </p>
          <hr className="gold-rule max-w-xs mx-auto mt-6" />
        </motion.div>

        {/* Category filter tabs */}
        <motion.div {...fade(0.05)} className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 text-xs tracking-[0.22em] uppercase font-semibold transition-all duration-300 border"
              style={{
                fontFamily: 'var(--font-body)',
                color: activeCategory === cat ? '#000' : 'var(--text-2)',
                background: activeCategory === cat ? 'var(--gold)' : 'transparent',
                borderColor: activeCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div {...fade(0.1)} className="text-center">
          <a href="#" className="btn btn-primary">View Full Armory</a>
        </motion.div>

      </div>
    </section>
  );
}
