'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  return (
    <section id="newsletter" className="section-pad" style={{ background: '#0a0a0a' }}>
      <div className="max-w-xl mx-auto px-6 text-center">

        <motion.div {...fade()}>
          <p className="label-xs mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.42em' }}>
            Stay Connected
          </p>
          <h2
            className="font-display text-[clamp(2.4rem,7vw,4.5rem)] tracking-[0.08em] text-white leading-none mb-4"
          >
            STAY IN TOUCH
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>
            New music and upcoming shows. Nothing else.
          </p>
          <hr className="gold-rule max-w-xs mx-auto mb-10" />
        </motion.div>

        <motion.div {...fade(0.1)}>
          {sent ? (
            <p className="text-sm py-6" style={{ color: 'var(--text-2)' }}>
              You&apos;re in. We&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSent(true); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                className="field flex-1"
                type="email"
                placeholder="your@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          )}
          <p
            className="text-[0.58rem] tracking-wider mt-5"
            style={{ color: 'var(--text-ghost)' }}
          >
            No spam. Unsubscribe any time.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
