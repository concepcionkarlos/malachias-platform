'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const PERKS = ['New Music First', 'Tour Presale', 'Veteran Stories', 'Devotional Content'];

export default function Newsletter() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [sent, setSent] = useState(false);

  return (
    <section id="newsletter" style={{ background: '#040404' }} className="section-pad">
      <div className="max-w-2xl mx-auto px-6 text-center">

        <motion.div {...fade()}>
          <p className="label-xs mb-4">Stay Connected</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-[0.08em] text-white leading-none mb-2">
            JOIN THE
          </h2>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-[0.08em] text-[#c9a84c] leading-none mb-6">
            BROTHERHOOD
          </h2>
          <p className="text-[#8a7f70] text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Exclusive updates on new music, tour dates, veteran initiatives, and
            behind-the-scenes content. No spam — just mission.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div {...fade(0.1)} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {PERKS.map(p => (
            <span key={p} className="text-[0.68rem] tracking-[0.2em] uppercase text-[#4a4438]">
              ▸ {p}
            </span>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div {...fade(0.2)}>
          {sent ? (
            <div className="card py-12 px-8 text-center">
              <div className="font-display text-5xl text-[#c9a84c]/30 mb-3">✝</div>
              <h3 className="font-display text-2xl tracking-widest text-[#c9a84c] mb-2">WELCOME, BROTHER</h3>
              <p className="text-[#8a7f70] text-sm">You're in. Check your inbox — something's coming.</p>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSent(true); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                className="field flex-1"
                type="text"
                placeholder="First name"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
              <div className="relative flex-[2]">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4438] pointer-events-none" />
                <input
                  className="field w-full pl-8"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-gold shrink-0">Enlist Now</button>
            </form>
          )}
          <p className="text-[0.62rem] tracking-wider text-[#3a3028] mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>

        {/* Bottom rule */}
        <motion.div {...fade(0.3)} className="mt-16">
          <hr className="gold-rule opacity-30" />
        </motion.div>

      </div>
    </section>
  );
}
