'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Booking() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <section id="booking" style={{ background: '#050505' }} className="section-pad">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.42em' }}>
            Get in Touch
          </p>
          <h2 className="font-display text-[clamp(3rem,9vw,6.5rem)] tracking-[0.08em] text-white leading-none">
            BOOK US
          </h2>
          <hr className="gold-rule max-w-xs mx-auto mt-6" />
        </motion.div>

        {/* Copy */}
        <motion.div {...fade(0.06)} className="max-w-xl mx-auto text-center mb-12">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            We play churches, community events, military gatherings, and small venues.
            If you want us there, reach out. We&apos;ll figure it out together.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div {...fade(0.1)} className="max-w-xl mx-auto">
          {sent ? (
            <div className="tac-box py-14 px-8 text-center">
              <p
                className="font-display text-2xl tracking-[0.16em] mb-3"
                style={{ color: 'var(--gold)' }}
              >
                Message received.
              </p>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                We&apos;ll be in touch within a couple of days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSent(true); }}
              className="space-y-4"
            >
              <input
                className="field"
                type="text"
                placeholder="Your name"
                required
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
              />
              <input
                className="field"
                type="email"
                placeholder="Your email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
              />
              <textarea
                className="field resize-none"
                rows={5}
                placeholder="Tell us about the event — date, location, what you're looking for."
                required
                value={form.message}
                onChange={set('message')}
              />
              <button
                type="submit"
                className="btn btn-primary w-full justify-center"
                style={{ letterSpacing: '0.16em' }}
              >
                Send Message
              </button>
            </form>
          )}

          {/* Direct email */}
          <p
            className="text-center text-[0.72rem] mt-6"
            style={{ color: 'var(--text-3)', letterSpacing: '0.04em' }}
          >
            Or email us directly:{' '}
            <a
              href="mailto:booking@malachias.com"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
            >
              booking@malachias.com
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
