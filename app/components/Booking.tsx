'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const VENUES = [
  'Bars & Clubs', 'Rock Festivals', 'Metal Events',
  'Churches', 'VFW Halls', 'Military Events', 'Community Shows', 'Private Events',
];

const EVENT_TYPES = [
  'Bar / Club Night',
  'Rock Festival',
  'Metal / Hard Rock Event',
  'Outdoor Festival',
  'Church Concert',
  'Church Service',
  'Military Event',
  'Veteran Support Event',
  'Community Gathering',
  'Private Event',
  'Corporate / Fundraiser',
  'Other',
];

export default function Booking() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', venueOrOrg: '',
    eventDate: '', city: '', eventType: '', budgetRange: '',
    guestCount: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  }

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
                  width: '3rem', height: '1px',
                  background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
                }}
              />
            </motion.div>

            <motion.p {...fade(0.06)} className="text-[0.93rem] leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>
              Bars, festivals, churches, clubs, military events — if there&apos;s a stage,
              we&apos;ll be there. Reach out and we&apos;ll make it work.
            </motion.p>

            <motion.div {...fade(0.10)} className="space-y-2 mb-8">
              {VENUES.map((v) => (
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
                href="mailto:booking@malachiasmusic.com"
                className="text-[0.85rem] transition-colors duration-300"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                booking@malachiasmusic.com
              </a>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div {...fade(0.08)}>
            {sent ? (
              <div className="tac-box py-14 px-8 text-center">
                <p className="font-display text-2xl tracking-[0.16em] mb-3" style={{ color: 'var(--gold)' }}>
                  Message received.
                </p>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  We&apos;ll be in touch within a couple of days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="field"
                    type="text"
                    placeholder="Your name *"
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={set('fullName')}
                  />
                  <input
                    className="field"
                    type="email"
                    placeholder="Your email *"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={set('email')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="field"
                    type="tel"
                    placeholder="Phone (optional)"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                  <input
                    className="field"
                    type="text"
                    placeholder="Venue or organization"
                    value={form.venueOrOrg}
                    onChange={set('venueOrOrg')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="field"
                    type="date"
                    placeholder="Event date"
                    value={form.eventDate}
                    onChange={set('eventDate')}
                  />
                  <input
                    className="field"
                    type="text"
                    placeholder="City / Location"
                    value={form.city}
                    onChange={set('city')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select className="field" aria-label="Event type" value={form.eventType} onChange={set('eventType')}>
                    <option value="">Event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input
                    className="field"
                    type="text"
                    placeholder="Guest count (approx)"
                    value={form.guestCount}
                    onChange={set('guestCount')}
                  />
                </div>
                <input
                  className="field"
                  type="text"
                  placeholder="Budget range (optional)"
                  value={form.budgetRange}
                  onChange={set('budgetRange')}
                />
                <textarea
                  className="field resize-none"
                  rows={5}
                  placeholder="Tell us about the event — what you're looking for, any special needs."
                  required
                  value={form.message}
                  onChange={set('message')}
                />
                {error && (
                  <p style={{ color: '#c04020', fontSize: '0.82rem' }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full justify-center"
                  style={{ letterSpacing: '0.16em', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
