'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield } from 'lucide-react';

export default function Newsletter() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="newsletter" className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080808 0%, #0d0808 50%, #080808 100%)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Flag-inspired horizontal stripes — very subtle */}
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${(i / 13) * 100}%`,
              height: '1px',
              background: i % 2 === 0 ? 'rgba(139,0,0,0.04)' : 'rgba(255,255,255,0.015)',
            }}
          />
        ))}
        {/* Center glow */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#c9a84c]/10 rounded-full blur-2xl scale-150" />
            <div className="relative w-16 h-16 border border-[#c9a84c]/30 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(0,0,0,0.5))' }}
            >
              <Shield size={24} className="text-[#c9a84c]" />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-4">Stay Connected</p>
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-widest text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            JOIN THE<br />
            <span style={{
              background: 'linear-gradient(90deg, #c9a84c, #f5d98b, #c9a84c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              MALACHIAS BROTHERHOOD
            </span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto">
            Get exclusive updates on new music, tour dates, veteran initiatives, and behind-the-scenes
            content — delivered straight to your inbox. No spam. Just mission.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {[
            '🎵 New Music First',
            '🎟 Presale Access',
            '🎖 Veteran Stories',
            '🙏 Devotional Content',
          ].map((perk) => (
            <div key={perk} className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-[0.7rem]">{perk}</span>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 px-8 border border-[#c9a84c]/30 bg-[#c9a84c]/05"
            >
              <div className="text-4xl mb-4">✝</div>
              <h3 className="text-xl font-black text-[#c9a84c] tracking-widest mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                WELCOME, BROTHER
              </h3>
              <p className="text-gray-400 text-sm">
                You're now part of the Malachias Brotherhood. Check your inbox — something's coming.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your first name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex-1 bg-white/[0.05] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 px-5 py-4 text-sm outline-none transition-colors duration-300"
              />
              <div className="relative flex-[2]">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 pl-10 pr-4 py-4 text-sm outline-none transition-colors duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[#c9a84c] hover:bg-[#d4b460] text-black text-sm tracking-[0.2em] uppercase font-black transition-colors duration-300 whitespace-nowrap"
              >
                Enlist Now
              </button>
            </form>
          )}

          <p className="text-gray-600 text-xs mt-4 tracking-wider">
            We respect your privacy. Unsubscribe anytime. No soldier left behind — and no inbox spammed.
          </p>
        </motion.div>

        {/* Cross divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center gap-4 mt-16"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
          <span className="text-[#c9a84c]/30 text-2xl">✝</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
        </motion.div>
      </div>
    </section>
  );
}
