'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SongRequest() {
  const [form, setForm] = useState({ fullName: '', email: '', song1: '', song2: '', song3: '', notes: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [expanded, setExpanded] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/song-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="song-request"
      style={{
        background: '#040404',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 lg:py-12">

        {!expanded && !sent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <p
                className="font-display tracking-[0.22em] text-white mb-1"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 1.3rem)' }}
              >
                HAVE A SONG REQUEST?
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
                Coming to a show — or hoping we play one near you. We read every one.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn btn-ghost shrink-0"
              style={{ fontSize: '0.64rem', letterSpacing: '0.20em' }}
            >
              Request a Song
            </button>
          </motion.div>
        )}

        {expanded && !sent && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="label-xs mb-1" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
                  Song Request
                </p>
                <p style={{ fontSize: '0.80rem', color: 'var(--text-3)' }}>
                  Up to three songs. We&apos;ll do our best.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3 max-w-2xl">
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
              <input
                className="field sm:col-span-2"
                type="text"
                placeholder="Song #1 — Title / artist *"
                required
                value={form.song1}
                onChange={set('song1')}
              />
              <input
                className="field"
                type="text"
                placeholder="Song #2 (optional)"
                value={form.song2}
                onChange={set('song2')}
              />
              <input
                className="field"
                type="text"
                placeholder="Song #3 (optional)"
                value={form.song3}
                onChange={set('song3')}
              />
              <textarea
                className="field resize-none sm:col-span-2"
                rows={3}
                placeholder="Anything you want us to know — a show you're coming to, a reason this song matters."
                value={form.notes}
                onChange={set('notes')}
              />
              {error && (
                <p className="sm:col-span-2" style={{ color: '#c04020', fontSize: '0.78rem' }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary sm:col-span-2 justify-center"
                style={{ opacity: loading ? 0.6 : 1, letterSpacing: '0.16em' }}
              >
                {loading ? 'Sending…' : 'Submit Request'}
              </button>
            </form>
          </motion.div>
        )}

        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-5"
          >
            <div
              style={{
                width: '2px',
                height: '3rem',
                background: 'linear-gradient(to bottom, rgba(201,168,76,0.55), transparent)',
                flexShrink: 0,
              }}
            />
            <div>
              <p className="font-display tracking-[0.14em] mb-1" style={{ color: 'var(--gold)', fontSize: '1rem' }}>
                Got it.
              </p>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-3)' }}>
                We&apos;ll keep it in mind when we build the setlist.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
