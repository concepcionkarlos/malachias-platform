'use client';

import { useState, useEffect, useCallback } from 'react';
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

// Validation helpers (mirrors server-side logic)
function phoneError(phone: string): string | null {
  if (!phone.trim()) return null // optional
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return 'Phone number is too short.'
  if (digits.length > 15) return 'Phone number is too long.'
  if (new Set(digits.split('')).size <= 2) return 'That doesn\'t look like a real phone number.'
  const asc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] + 1)
  const desc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] - 1)
  if (asc || desc) return 'That doesn\'t look like a real phone number.'
  return null
}

function nameError(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length < 2) return 'Please enter your name.'
  if (/^\d+$/.test(trimmed)) return 'Name can\'t be only numbers.'
  if (new Set(trimmed.toLowerCase().replace(/\s/g, '').split('')).size <= 1) return 'Please enter a real name.'
  // Keyboard-row mashing: a run of 4+ letters consecutive in a row (fwd/rev).
  // (Mirrors the server check in app/api/booking/route.ts.)
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const lower = trimmed.toLowerCase().replace(/[^a-z]/g, '')
  for (const row of rows) {
    const rev = [...row].reverse().join('')
    for (let i = 0; i + 4 <= lower.length; i++) {
      const seg = lower.slice(i, i + 4)
      if (row.includes(seg) || rev.includes(seg)) return 'That doesn\'t look like a real name.'
    }
  }
  return null
}

function messageError(msg: string): string | null {
  const trimmed = msg.trim()
  if (trimmed.length < 20) return 'Please tell us a bit more about the event (at least 20 characters).'
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return 'Please don\'t use all caps.'
  const words = trimmed.split(/\s+/)
  const unique = new Set(words.map(w => w.toLowerCase()))
  if (words.length > 4 && unique.size / words.length < 0.3) return 'Your message looks like repeated text. Please describe the event.'
  return null
}

export default function Booking() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', venueOrOrg: '',
    eventDate: '', city: '', eventType: '', budgetRange: '',
    guestCount: '', message: '', website: '',
  });
  const [captcha, setCaptcha] = useState<{ a: number; b: number; token: string; answer: string } | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // The challenge is issued and signed by the server — the browser no longer
  // makes up its own numbers, so a bot can't pre-compute a valid submission.
  // `no-store` keeps the browser/CDN from serving a stale single-use token, and
  // we retry a couple of times so a transient hiccup never leaves a dead button.
  const loadCaptcha = useCallback(async () => {
    setCaptchaError(false);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/booking/captcha', { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCaptcha({ a: data.a, b: data.b, token: data.token, answer: '' });
        return;
      } catch {
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
      }
    }
    setCaptcha(null);
    setCaptchaError(true);
  }, []);

  useEffect(() => { loadCaptcha(); }, [loadCaptcha]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Client-side field validation
    const nErr = nameError(form.fullName)
    if (nErr) { setError(nErr); return; }

    const pErr = phoneError(form.phone)
    if (pErr) { setError(pErr); return; }

    const mErr = messageError(form.message)
    if (mErr) { setError(mErr); return; }

    // Math captcha
    if (!captcha || captcha.answer.trim() === '' || parseInt(captcha.answer) !== captcha.a + captcha.b) {
      setError(`Please answer the verification question: ${captcha?.a ?? '?'} + ${captcha?.b ?? '?'} = ?`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          captchaToken: captcha.token,
          captchaAnswer: captcha.answer,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Submission failed');
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
      // Fetch a fresh signed challenge on failure (the previous token is now spent)
      loadCaptcha();
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
              {/* Availability pulse */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.9rem' }}
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
                  Available to book
                </span>
              </motion.div>
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
              We play bars, rock festivals, churches, VFW halls, and military events
              across South Florida — a veteran-founded band with a specific mission:
              healing through music. If you have an audience that needs to hear
              something real, reach out. We&apos;ll be there.
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
                <p className="font-display text-2xl tracking[0.16em] mb-3" style={{ color: 'var(--gold)' }}>
                  Message received.
                </p>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  We&apos;ll be in touch within a couple of days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — hidden from humans, bots fill it */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set('website')}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

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

                {/* Human verification — server-issued math captcha */}
                {captcha && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(201,168,76,0.04)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: 6,
                  }}>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      Human check
                    </span>
                    <span style={{ fontSize: '0.90rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                      {captcha.a} + {captcha.b} =
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      required
                      value={captcha.answer}
                      onChange={e => setCaptcha(c => c ? { ...c, answer: e.target.value } : c)}
                      className="field"
                      placeholder="?"
                      style={{ maxWidth: 72, textAlign: 'center' }}
                    />
                  </div>
                )}

                {/* Verification failed to load — give a clear way out instead of a dead button */}
                {!captcha && captchaError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(192,64,32,0.06)',
                    border: '1px solid rgba(192,64,32,0.25)',
                    borderRadius: 6,
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                      Couldn&apos;t load the human check.
                    </span>
                    <button
                      type="button"
                      onClick={() => loadCaptcha()}
                      style={{
                        fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'var(--gold)', background: 'none', border: '1px solid rgba(201,168,76,0.4)',
                        padding: '0.45rem 0.9rem', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      Try again
                    </button>
                  </div>
                )}

                {error && (
                  <p style={{ color: '#c04020', fontSize: '0.82rem', lineHeight: 1.5 }}>{error}</p>
                )}
                <motion.button
                  type="submit"
                  disabled={loading || !captcha}
                  className="btn btn-primary w-full justify-center"
                  whileHover={(!loading && !!captcha) ? { scale: 1.015 } : {}}
                  whileTap={(!loading && !!captcha) ? { scale: 0.98 } : {}}
                  animate={(!loading && !!captcha) ? {
                    boxShadow: [
                      '0 0 0px rgba(201,168,76,0)',
                      '0 0 18px rgba(201,168,76,0.28)',
                      '0 0 0px rgba(201,168,76,0)',
                    ],
                  } : {}}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ letterSpacing: '0.16em', opacity: (loading || !captcha) ? 0.6 : 1 }}
                >
                  {loading ? 'Sending…' : 'Send Booking Request'}
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
