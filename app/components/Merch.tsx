'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Faith on Fire Hoodie',
    category: 'Apparel',
    price: '$59.99',
    badge: 'Best Seller',
    badgeColor: '#c9a84c',
    description: 'Heavy-weight fleece. Distressed cross graphic. Military-grade stitching.',
    icon: (
      <svg viewBox="0 0 100 80" className="w-20 h-20 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 10 L5 35 L20 35 L20 75 L80 75 L80 35 L95 35 L80 10 L65 20 C60 25 40 25 35 20 Z" />
        <path d="M35 20 C38 30 40 35 50 35 C60 35 62 30 65 20" />
      </svg>
    ),
    colors: ['#1a1a1a', '#2d1a00', '#1a0505'],
  },
  {
    id: 2,
    name: 'Veteran Spirit Tee',
    category: 'Apparel',
    price: '$34.99',
    badge: 'New',
    badgeColor: '#8b0000',
    description: 'Premium cotton. Eagle & cross design. Made in the USA.',
    icon: (
      <svg viewBox="0 0 100 80" className="w-20 h-20 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M25 5 L10 30 L25 30 L25 75 L75 75 L75 30 L90 30 L75 5 Z" />
        <path d="M38 5 L38 30" />
        <path d="M62 5 L62 30" />
      </svg>
    ),
    colors: ['#0a0a0a', '#1a2d5a', '#3d1a00'],
  },
  {
    id: 3,
    name: 'Guitar Picks Set (12)',
    category: 'Gear',
    price: '$14.99',
    badge: 'Fan Fav',
    badgeColor: '#4a7a4a',
    description: 'Custom MALACHIAS picks. Cross engraved. Medium & heavy gauges.',
    icon: (
      <svg viewBox="0 0 60 80" className="w-16 h-20 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M30 5 C50 5 55 25 55 35 C55 55 40 75 30 75 C20 75 5 55 5 35 C5 25 10 5 30 5Z" />
        <path d="M25 35 L35 35 M30 30 L30 40" />
      </svg>
    ),
    colors: ['#c9a84c', '#8b0000', '#1a2d5a'],
  },
  {
    id: 4,
    name: 'Tactical Snapback Cap',
    category: 'Headwear',
    price: '$39.99',
    badge: null,
    badgeColor: '',
    description: 'Structured cap. Embroidered cross logo. Camo brim option.',
    icon: (
      <svg viewBox="0 0 100 60" className="w-20 h-14 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 45 Q50 5 90 45" />
        <path d="M10 45 L5 50 L95 50 L90 45" />
        <path d="M5 50 L95 50" />
        <path d="M48 35 L52 35 M50 33 L50 37" />
      </svg>
    ),
    colors: ['#1a1a1a', '#4a4a3a', '#2d2d2d'],
  },
  {
    id: 5,
    name: 'Veteran Collection Bundle',
    category: 'Bundle',
    price: '$99.99',
    badge: 'Limited',
    badgeColor: '#c9a84c',
    description: 'Tee + hoodie + picks + dog tag necklace. Veteran discount available.',
    icon: (
      <svg viewBox="0 0 100 80" className="w-20 h-20 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="15" y="10" width="70" height="60" rx="3" />
        <path d="M25 30 L75 30 M25 45 L65 45 M25 55 L55 55" />
        <path d="M45 10 L45 25 L55 20 L55 10" />
      </svg>
    ),
    colors: ['#8b0000', '#c9a84c', '#1a2d5a'],
  },
  {
    id: 6,
    name: 'Dog Tag Necklace',
    category: 'Accessories',
    price: '$24.99',
    badge: 'New',
    badgeColor: '#6b7280',
    description: 'Stainless steel. Engraved scripture. Veteran & band editions.',
    icon: (
      <svg viewBox="0 0 60 90" className="w-16 h-20 opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="15" y="35" width="30" height="40" rx="3" />
        <circle cx="30" cy="12" r="8" />
        <path d="M30 20 L30 35" />
        <path d="M22 50 L38 50 M22 58 L38 58 M22 66 L32 66" />
      </svg>
    ),
    colors: ['#9a9a9a', '#c9a84c', '#1a1a1a'],
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative bg-[#0d0d0d] border border-white/[0.06] hover:border-[#c9a84c]/40 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/0 to-transparent group-hover:via-[#c9a84c]/40 transition-all duration-500" />

      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-3 left-3 text-[0.6rem] tracking-[0.3em] uppercase px-2 py-1 z-10 font-bold"
          style={{ background: product.badgeColor, color: '#000' }}
        >
          {product.badge}
        </div>
      )}

      {/* Product image area */}
      <div className="relative h-52 bg-gradient-to-br from-[#161616] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
        {/* Color swatches reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
        />
        {/* Icon */}
        <div className="text-[#c9a84c] group-hover:scale-110 transition-transform duration-500">
          {product.icon}
        </div>
        {/* Color dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.colors.map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform duration-200 cursor-pointer"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[0.6rem] tracking-[0.4em] text-[#c9a84c]/60 uppercase mb-2">{product.category}</p>
        <h3 className="font-bold text-white tracking-wide mb-2 text-sm">{product.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#c9a84c] font-black text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            {product.price}
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/0 border border-[#c9a84c]/30 hover:bg-[#c9a84c] hover:border-[#c9a84c] text-[#c9a84c] hover:text-black text-xs tracking-widest uppercase font-bold transition-all duration-300">
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Merch() {
  return (
    <section id="merch" className="relative py-28 bg-[#080808] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-4">Gear Up</p>
          <h2
            className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-widest text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            MERCH STORE
          </h2>
          <p className="text-gray-500 text-sm tracking-wider max-w-xl mx-auto mb-6">
            Wear the mission. Every purchase supports veteran outreach and keeps the music alive.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <span className="text-[#c9a84c]">✝</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {['All', 'Apparel', 'Gear', 'Headwear', 'Accessories', 'Bundles'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${
                i === 0
                  ? 'bg-[#c9a84c] text-black font-bold'
                  : 'border border-white/10 text-gray-400 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm mb-6">
            <Star size={12} className="inline mr-2 text-[#c9a84c]" />
            10% of all merch sales donated to veteran support organizations
            <Star size={12} className="inline ml-2 text-[#c9a84c]" />
          </p>
          <a
            href="#"
            className="inline-block px-10 py-4 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black text-sm tracking-widest uppercase font-bold transition-all duration-300"
          >
            View Full Store
          </a>
        </motion.div>
      </div>
    </section>
  );
}
