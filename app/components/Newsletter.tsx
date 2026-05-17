'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  return (
    <section
      id="newsletter"
      style={{
        background: '#020202',
        borderTop:    '1px solid rgba(201,168,76,0.09)',
        borderBottom: '1px solid rgba(201,168,76,0.05)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="grid lg:grid-cols-[5fr_6fr] gap-8 lg:gap-16 items-center"
        >

          {/* Left — Brotherhood framing */}
          <div>
            <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
              The Brotherhood
            </p>
            <h2
              className="font-display leading-[0.92] tracking-[0.06em] text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              JOIN THE LIST
            </h2>
            <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '30rem' }}>
              This isn&apos;t a newsletter. It&apos;s a dispatch.
              New music, upcoming shows, and honest updates from the road and the studio.
              For the people who believe something real is happening here.
            </p>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p
                  className="font-display text-xl tracking-[0.12em] mb-2"
                  style={{ color: 'var(--gold)' }}
                >
                  You&apos;re in.
                </p>
                <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  Welcome to the brotherhood. We&apos;ll be in touch when there&apos;s something real to say.
                </p>
              </motion.div>
            ) : (
              <div>
                <form
                  onSubmit={e => { e.preventDefault(); setSent(true); }}
                  className="flex flex-col sm:flex-row gap-3 mb-3"
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
                    Join the Brotherhood
                  </button>
                </form>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.10em', color: 'var(--text-3)' }}>
                  Private. Honest. No spam. Unsubscribe any time.
                </p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
