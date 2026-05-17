'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const PRODUCTS = [
  { name: 'Faith on Fire Hoodie',     cat: 'Apparel',     price: '$59.99', tag: 'Best Seller', tagColor: '#c9a84c', colors: ['#111','#1a0800','#0a0510'] },
  { name: 'Veteran Spirit Tee',       cat: 'Apparel',     price: '$34.99', tag: 'New',         tagColor: '#8b0000', colors: ['#080808','#0a1020','#200a00'] },
  { name: 'Guitar Picks · Set of 12', cat: 'Gear',        price: '$14.99', tag: 'Fan Fav',     tagColor: '#4a7a4a', colors: ['#c9a84c','#8b0000','#1a2d5a'] },
  { name: 'Tactical Snapback',        cat: 'Headwear',    price: '$39.99', tag: null,          tagColor: '',        colors: ['#111','#2a2a1a','#181818'] },
  { name: 'Veteran Bundle',           cat: 'Bundle',      price: '$99.99', tag: 'Limited',     tagColor: '#c9a84c', colors: ['#8b0000','#c9a84c','#1a2d5a'] },
  { name: 'Dog Tag Necklace',         cat: 'Accessories', price: '$24.99', tag: 'New',         tagColor: '#6b7280', colors: ['#888','#c9a84c','#111'] },
];

export default function Merch() {
  return (
    <section id="merch" style={{ background: '#040404' }} className="section-pad">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4">Gear Up</p>
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.08em] text-white">
            MERCH STORE
          </h2>
          <p className="text-[#8a7f70] text-sm mt-3">
            10% of every purchase supports veteran outreach.
          </p>
          <hr className="gold-rule max-w-xs mx-auto mt-5" />
        </motion.div>

        {/* Category filter */}
        <motion.div {...fade(0.05)} className="flex flex-wrap gap-2 justify-center mb-10">
          {['All','Apparel','Gear','Headwear','Accessories','Bundles'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className="text-[0.62rem] tracking-[0.22em] uppercase px-4 py-2 transition-all duration-300"
              style={i === 0
                ? { background: '#c9a84c', color: '#000', fontWeight: 700 }
                : { border: '1px solid rgba(255,255,255,0.08)', color: '#8a7f70' }
              }
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PRODUCTS.map((p, i) => (
            <motion.div key={p.name} {...fade(i * 0.07)} className="card group overflow-hidden">

              {/* Product visual */}
              <div
                className="relative h-56 flex flex-col items-center justify-center gap-3"
                style={{ background: 'linear-gradient(160deg, #0e0e0e 0%, #080808 100%)' }}
              >
                {p.tag && (
                  <span
                    className="absolute top-3 left-3 text-[0.58rem] tracking-[0.25em] uppercase px-2 py-[3px] font-bold z-10"
                    style={{ background: p.tagColor, color: '#000' }}
                  >
                    {p.tag}
                  </span>
                )}

                {/* Product name as visual element */}
                <span className="font-display text-[2.2rem] tracking-wider text-white/[0.06] text-center leading-none px-4 group-hover:text-white/[0.10] transition-colors duration-500">
                  {p.name.split(' ').slice(0, 2).join('\n')}
                </span>

                {/* Color swatches */}
                <div className="flex gap-2 mt-1">
                  {p.colors.map((c, j) => (
                    <div
                      key={j}
                      className="w-4 h-4 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform duration-200"
                      style={{ background: c }}
                    />
                  ))}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info row */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="label-xs mb-1" style={{ color: 'var(--text-3)', opacity: 1 }}>{p.cat}</div>
                  <div className="text-white text-sm font-semibold tracking-wide">{p.name}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display text-lg text-[#c9a84c] tracking-wider">{p.price}</span>
                  <button
                    type="button"
                    aria-label={`Add ${p.name} to cart`}
                    className="w-8 h-8 border border-[#c9a84c]/25 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black transition-all duration-300"
                  >
                    <ShoppingCart size={13} />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        <motion.div {...fade(0.1)} className="text-center">
          <a href="#" className="btn-gold">View Full Store</a>
        </motion.div>

      </div>
    </section>
  );
}
