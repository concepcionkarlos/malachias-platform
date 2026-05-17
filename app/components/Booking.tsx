'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const VENUES = ['Churches', 'Military events', 'Community gatherings', 'Small venues'];

export default function Booking() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <section id="booking" style={{ background: '#060606' }} className="section-pad">
      <div className="max-w-5xl mx-auto px-6">

        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">

          {/* Left — info */}
          <div>
            <motion.div {...fade()}>
              <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
                Get in Touch
              </p>
              <h2
                className="font-display leading-[0.92] tracking-[0.06em] text-white"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
              >
                BOOK US
              </h2>
              <div
                className="mt-4 mb-8"
                style={{
                  width: '3rem',
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
                }}
              />
            </motion.div>

            <motion.p {...fade(0.06)} className="text-[0.93rem] leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>
              We play churches, community events, military gatherings, and small venues.
              If you want us there, reach out. We&apos;ll figure it out together.
            </motion.p>

            <motion.div {...fade(0.10)} className="space-y-2 mb-8">
              {VENUES.map((v, i) => (
                <div key={v} className="flex items-center gap-3">
                  <span style={{ color: 'var(--gold)', fontSize: '0.55rem', opacity: 0.6 }}>▸</span>
                  <span className="text-[0.80rem] tracking-wide" style={{ color: 'var(--text-3)' }}>{v}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fade(0.14)}>
              <p className="text-[0.68rem] tracking-[0.06em]" style={{ color: 'var(--text-3)' }}>
                Direct line
              </p>
              <a
                href="mailto:booking@malachias.com"
                className="text-[0.85rem] transition-colors duration-300"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                booking@malachias.com
              </a>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div {...fade(0.08)}>
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
                  rows={6}
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
