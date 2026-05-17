'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Music, Church, Shield, Users } from 'lucide-react';

const eventTypes = [
  { icon: <Church size={20} />, label: 'Church Service', desc: 'Worship nights, revivals, special events' },
  { icon: <Shield size={20} />, label: 'Veteran Event', desc: 'Memorial Day, Veterans Day, base concerts' },
  { icon: <Music size={20} />, label: 'Rock Festival', desc: 'Outdoor stages, multi-band lineups' },
  { icon: <Users size={20} />, label: 'Private Event', desc: 'Corporate, fundraiser, private venue' },
];

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventType: '',
    date: '',
    location: '',
    capacity: '',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="booking" className="relative py-28 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b0000]/40 to-transparent" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,0,0,0.04) 0%, transparent 70%)' }}
        />
        {/* Military angle accent */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.03]"
          style={{ background: 'conic-gradient(from 135deg, #8b0000 0deg, transparent 90deg)' }}
        />
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03]"
          style={{ background: 'conic-gradient(from 315deg, #1a2d5a 0deg, transparent 90deg)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#8b0000] text-xs tracking-[0.5em] uppercase mb-4">Ready to Deploy</p>
          <h2
            className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-widest text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            BOOK MALACHIAS
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Whether you're filling a sanctuary, honoring veterans, or rocking a festival crowd —
            Malachias brings faith-driven rock with unmatched energy and purpose.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8b0000]/60" />
            <span className="text-[#8b0000]">✝</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8b0000]/60" />
          </div>
        </motion.div>

        {/* Event types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {eventTypes.map((et) => (
            <div
              key={et.label}
              className="p-5 border border-[#8b0000]/20 bg-white/[0.02] hover:border-[#8b0000]/50 hover:bg-white/[0.04] transition-all duration-400 group text-center cursor-pointer"
            >
              <div className="text-[#8b0000] flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                {et.icon}
              </div>
              <h4 className="text-white text-xs font-bold tracking-wider mb-1">{et.label}</h4>
              <p className="text-gray-500 text-[0.65rem] leading-relaxed">{et.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Form + Info grid */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-[#c9a84c]/30"
                style={{ background: 'linear-gradient(135deg, #0d0a00, #0d0d0d)' }}
              >
                <div className="text-5xl mb-6">✝</div>
                <h3 className="text-2xl font-black text-[#c9a84c] tracking-widest mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  MISSION RECEIVED
                </h3>
                <p className="text-gray-400 mb-2">Your booking inquiry has been submitted.</p>
                <p className="text-gray-500 text-sm">
                  Our team will contact you within 48 hours. Hooah.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Smith', required: true },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
                    { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
                    { id: 'organization', label: 'Church / Organization', type: 'text', placeholder: 'Grace Community Church' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-[0.65rem] tracking-[0.3em] text-[#c9a84c]/70 uppercase mb-2">
                        {f.label}{f.required && ' *'}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={formData[f.id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 px-4 py-3 text-sm outline-none transition-colors duration-300"
                      />
                    </div>
                  ))}
                </div>

                {/* Event type */}
                <div>
                  <label className="block text-[0.65rem] tracking-[0.3em] text-[#c9a84c]/70 uppercase mb-2">
                    Event Type *
                  </label>
                  <select
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#c9a84c]/50 text-white px-4 py-3 text-sm outline-none transition-colors duration-300"
                  >
                    <option value="" className="bg-[#1a1a1a]">Select event type...</option>
                    <option value="church" className="bg-[#1a1a1a]">Church Service / Revival</option>
                    <option value="veteran" className="bg-[#1a1a1a]">Veteran / Military Event</option>
                    <option value="festival" className="bg-[#1a1a1a]">Rock Festival</option>
                    <option value="corporate" className="bg-[#1a1a1a]">Corporate / Fundraiser</option>
                    <option value="private" className="bg-[#1a1a1a]">Private Venue</option>
                    <option value="other" className="bg-[#1a1a1a]">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { id: 'date', label: 'Event Date', type: 'date', placeholder: '' },
                    { id: 'capacity', label: 'Expected Attendance', type: 'text', placeholder: '500' },
                    { id: 'budget', label: 'Budget Range', type: 'text', placeholder: '$2,000 – $5,000' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-[0.65rem] tracking-[0.3em] text-[#c9a84c]/70 uppercase mb-2">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={formData[f.id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 px-4 py-3 text-sm outline-none transition-colors duration-300"
                        style={f.type === 'date' ? { colorScheme: 'dark' } : {}}
                      />
                    </div>
                  ))}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[0.65rem] tracking-[0.3em] text-[#c9a84c]/70 uppercase mb-2">
                    Venue / Location
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      placeholder="City, State or full venue address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 pl-10 pr-4 py-3 text-sm outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[0.65rem] tracking-[0.3em] text-[#c9a84c]/70 uppercase mb-2">
                    Additional Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your event, vision, and any special requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#c9a84c]/50 text-white placeholder-gray-600 px-4 py-3 text-sm outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#8b0000] hover:bg-[#a00000] text-white text-sm tracking-[0.3em] uppercase font-bold transition-colors duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Submit Booking Inquiry</span>
                  <div className="absolute inset-0 bg-[#c9a84c] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 mix-blend-overlay opacity-30" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Response time */}
            <div className="p-6 border border-[#c9a84c]/20 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={18} className="text-[#c9a84c]" />
                <span className="text-white text-sm font-bold tracking-wider">Response Time</span>
              </div>
              <p className="text-gray-400 text-sm">We respond to all inquiries within <span className="text-[#c9a84c]">48 hours</span>.</p>
            </div>

            {/* Availability */}
            <div className="p-6 border border-[#c9a84c]/20 bg-white/[0.02]">
              <p className="text-[0.65rem] tracking-[0.35em] text-[#c9a84c]/60 uppercase mb-3">Available For</p>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  'Churches & Worship Events',
                  'Veteran & Military Events',
                  'Christian Rock Festivals',
                  'Youth & Campus Events',
                  'Fundraisers & Galas',
                  'Private Concerts',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-[#8b0000] text-xs">✝</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct contact */}
            <div className="p-6 border border-[#8b0000]/25 bg-[#8b0000]/05">
              <p className="text-[0.65rem] tracking-[0.35em] text-[#8b0000] uppercase mb-4">Direct Contact</p>
              <div className="space-y-3 text-sm">
                <a href="mailto:booking@malachias.com" className="block text-gray-400 hover:text-[#c9a84c] transition-colors duration-300">
                  booking@malachias.com
                </a>
                <a href="tel:+15550001234" className="block text-gray-400 hover:text-[#c9a84c] transition-colors duration-300">
                  +1 (555) 000-1234
                </a>
              </div>
            </div>

            {/* Rider note */}
            <div className="p-4 border-l-2 border-[#c9a84c]/40 bg-white/[0.01]">
              <p className="text-xs text-gray-500 italic leading-relaxed">
                "No stage is too small or too large when the mission is God's glory."
              </p>
              <p className="text-[0.6rem] text-[#c9a84c]/50 tracking-widest mt-2 uppercase">— Malachias</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
