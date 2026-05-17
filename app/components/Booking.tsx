'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Mail, Phone } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const EVENT_TYPES = ['Church Service / Revival', 'Veteran / Military Event', 'Rock Festival', 'Corporate / Fundraiser', 'Private Venue', 'Other'];

export default function Booking() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', type: '', date: '', location: '', capacity: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <section id="booking" className="bg-black section-pad">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4" style={{ color: '#8b0000', opacity: 1 }}>Ready to Deploy</p>
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.08em] text-white">
            BOOK MALACHIAS
          </h2>
          <p className="text-[#8a7f70] max-w-xl mx-auto mt-4 text-sm leading-relaxed">
            Whether you're filling a sanctuary, honoring veterans, or rocking a festival crowd —
            Malachias brings faith-driven rock with unmatched energy and purpose.
          </p>
          <hr className="gold-rule max-w-xs mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">

          {/* Form */}
          <motion.div {...fade(0.1)}>
            {sent ? (
              <div className="card h-full flex flex-col items-center justify-center text-center p-16 gap-4">
                <div className="font-display text-6xl text-[#c9a84c]/30">✝</div>
                <h3 className="font-display text-3xl tracking-widest text-[#c9a84c]">MISSION RECEIVED</h3>
                <p className="text-[#8a7f70] text-sm">We'll respond within 48 hours. Hooah.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">

                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Name *</label>
                    <input className="field" type="text" placeholder="John Smith" required value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Email *</label>
                    <input className="field" type="email" placeholder="john@church.com" required value={form.email} onChange={set('email')} />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Phone</label>
                    <input className="field" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
                  </div>
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Organization</label>
                    <input className="field" type="text" placeholder="Grace Community Church" value={form.org} onChange={set('org')} />
                  </div>
                </div>

                {/* Event type */}
                <div>
                  <label htmlFor="booking-type" className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Event Type *</label>
                  <select id="booking-type" className="field" required value={form.type} onChange={set('type')}>
                    <option value="">Select event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Row 3 */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="booking-date" className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Event Date</label>
                    <input id="booking-date" className="field" type="date" title="Event date" value={form.date} onChange={set('date')} style={{ colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Attendance</label>
                    <input className="field" type="text" placeholder="500" value={form.capacity} onChange={set('capacity')} />
                  </div>
                  <div>
                    <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Budget</label>
                    <input className="field" type="text" placeholder="$2,000–$5,000" value={form.budget} onChange={set('budget')} />
                  </div>
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Venue / City</label>
                  <MapPin size={13} className="absolute left-3 bottom-[13px] text-[#4a4438]" />
                  <input className="field pl-8" type="text" placeholder="City, State or venue address" value={form.location} onChange={set('location')} />
                </div>

                {/* Message */}
                <div>
                  <label className="label-xs block mb-2" style={{ color: 'var(--text-2)', opacity: 1 }}>Details</label>
                  <textarea className="field resize-none" rows={4} placeholder="Tell us about your event, vision, and any special requirements…" value={form.message} onChange={set('message')} />
                </div>

                <button type="submit" className="btn-crimson w-full justify-center !py-4">
                  Submit Booking Inquiry
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div {...fade(0.2)} className="space-y-4">

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-[#c9a84c]" />
                <span className="text-white text-sm font-semibold tracking-wide">Response Time</span>
              </div>
              <p className="text-[0.82rem] text-[#8a7f70]">
                We respond to all inquiries within <span className="text-[#c9a84c]">48 hours</span>.
              </p>
            </div>

            <div className="card p-5">
              <p className="label-xs mb-4" style={{ color: 'var(--text-2)', opacity: 1 }}>We Play For</p>
              <ul className="space-y-2 text-[0.82rem] text-[#8a7f70]">
                {['Churches & Worship Events', 'Veteran & Military Events', 'Christian Rock Festivals', 'Youth & Campus Events', 'Fundraisers & Galas', 'Private Concerts'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-[#8b0000] text-[0.6rem]">▸</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 space-y-3">
              <p className="label-xs mb-1" style={{ color: 'var(--text-2)', opacity: 1 }}>Direct Contact</p>
              <a href="mailto:booking@malachias.com" className="flex items-center gap-2 text-[0.82rem] text-[#8a7f70] hover:text-[#c9a84c] transition-colors">
                <Mail size={13} />booking@malachias.com
              </a>
              <a href="tel:+15550001234" className="flex items-center gap-2 text-[0.82rem] text-[#8a7f70] hover:text-[#c9a84c] transition-colors">
                <Phone size={13} />+1 (555) 000-1234
              </a>
            </div>

            <div className="border-l-2 border-[#c9a84c]/30 pl-4 py-1">
              <p className="text-[0.78rem] text-[#4a4438] italic leading-relaxed">
                "No stage is too small when the mission is God's glory."
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
