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
        background: '#030201',
        borderTop: '1px solid rgba(201,168,76,0.07)',
        borderBottom: '1px solid rgba(201,168,76,0.07)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12"
        >
          {/* Left — label + description */}
          <div className="shrink-0">
            <p className="label-xs mb-1" style={{ color: 'var(--gold)' }}>
              Stay in Touch
            </p>
            <p className="text-[0.80rem]" style={{ color: 'var(--text-3)' }}>
              New music and upcoming shows. Nothing else.
            </p>
          </div>

          {/* Divider — desktop only */}
          <div
            className="hidden sm:block shrink-0 self-stretch"
            style={{ width: '1px', background: 'rgba(201,168,76,0.10)' }}
          />

          {/* Right — form */}
          <div className="flex-1">
            {sent ? (
              <p className="text-[0.82rem]" style={{ color: 'var(--text-2)' }}>
                You&apos;re in. We&apos;ll be in touch.
              </p>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                className="flex flex-col xs:flex-row gap-3"
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
                <button type="submit" className="btn btn-primary shrink-0 !py-[0.65rem] !px-5 !text-[0.78rem]">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
