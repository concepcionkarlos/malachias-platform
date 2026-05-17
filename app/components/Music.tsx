'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const PLATFORMS = [
  {
    name: 'Spotify',
    color: '#1DB954',
    label: 'Stream on Spotify',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1DB954">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    embed: (
      <div className="w-full h-[152px] flex items-center justify-center rounded" style={{ background: '#111' }}>
        <div className="text-center">
          <div className="text-[#1DB954] text-xs tracking-widest uppercase mb-1">Spotify</div>
          <div className="text-[#4a4a4a] text-xs">Connect artist profile to enable embed</div>
        </div>
      </div>
    ),
  },
  {
    name: 'Apple Music',
    color: '#fc3c44',
    label: 'Stream on Apple Music',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.1.958 1.284 1.846.736 3.01a4.97 4.97 0 00-.272.788 12.158 12.158 0 00-.19 1.396c-.013.148-.018.298-.026.447v11.718c.008.15.013.298.026.447.04.535.11 1.07.272 1.589.536 1.745 1.73 2.87 3.51 3.354a8.28 8.28 0 001.65.248c.585.03 1.172.04 1.758.043H17.542a11.59 11.59 0 001.649-.166c1.015-.195 1.913-.608 2.651-1.279 1.034-.934 1.553-2.117 1.729-3.46.04-.312.07-.626.07-.94L24 6.124z"/>
      </svg>
    ),
    embed: (
      <div className="w-full h-[152px] flex items-center justify-center rounded" style={{ background: '#111' }}>
        <div className="text-center">
          <div className="text-[#fc3c44] text-xs tracking-widest uppercase mb-1">Apple Music</div>
          <div className="text-[#4a4a4a] text-xs">Connect artist profile to enable embed</div>
        </div>
      </div>
    ),
  },
  {
    name: 'YouTube',
    color: '#FF0000',
    label: 'Watch on YouTube',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    embed: (
      <div className="w-full aspect-video rounded overflow-hidden" style={{ background: '#0d0d0d' }}>
        <iframe
          width="100%" height="100%"
          src="https://www.youtube.com/embed/videoseries?list=PLplaceholder"
          title="Malachias YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ),
  },
  {
    name: 'Live Shows',
    color: '#c9a84c',
    label: 'Watch Live Footage',
    icon: <Play size={22} className="text-[#c9a84c]" />,
    embed: (
      <div className="w-full h-[152px] flex flex-col items-center justify-center gap-3 rounded cursor-pointer group"
        style={{ background: '#0d0a00', border: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="w-12 h-12 rounded-full border border-[#c9a84c]/40 flex items-center justify-center group-hover:border-[#c9a84c] transition-colors duration-300">
          <Play size={16} className="text-[#c9a84c] ml-0.5" />
        </div>
        <span className="text-xs tracking-widest uppercase text-[#c9a84c]/50">Coming Soon</span>
      </div>
    ),
  },
];

const ALBUMS = [
  { title: 'Faith on Fire',         year: '2024', tracks: 10, tag: 'Out Now' },
  { title: 'Under Orders',          year: '2023', tracks: 8,  tag: 'Album'   },
  { title: 'No Man Left Behind',    year: '2022', tracks: 7,  tag: 'EP'      },
];

export default function Music() {
  return (
    <section id="music" className="section-pad" style={{ background: '#040404' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div {...fade()} className="section-header">
          <p className="label-xs mb-4">Stream &amp; Watch</p>
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.08em] text-white">
            THE MUSIC
          </h2>
          <hr className="gold-rule max-w-xs mx-auto mt-5" />
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {PLATFORMS.map((p, i) => (
            <motion.div key={p.name} {...fade(i * 0.09)} className="card p-5 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {p.icon}
                  <div>
                    <div className="text-white text-sm font-semibold tracking-wide">{p.name}</div>
                    <div className="text-[0.68rem] text-[#4a4438]">{p.label}</div>
                  </div>
                </div>
                <a href="#" className="flex items-center gap-1 text-[0.62rem] tracking-widest uppercase transition-colors duration-300 hover:text-white"
                  style={{ color: p.color }}>
                  Open <ExternalLink size={11} />
                </a>
              </div>
              {p.embed}
            </motion.div>
          ))}
        </div>

        {/* Discography */}
        <motion.div {...fade(0.1)}>
          <p className="label-xs text-center mb-8">Discography</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ALBUMS.map((a, i) => (
              <motion.div key={a.title} {...fade(i * 0.08)} className="card group overflow-hidden cursor-pointer">
                <div className="aspect-square relative flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0f0a00 0%, #0a0a0a 100%)' }}>
                  <span className="font-display text-[5rem] text-[#c9a84c]/08 select-none leading-none">M</span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play size={28} className="text-[#c9a84c]" />
                  </div>
                </div>
                <div className="p-4 flex items-start justify-between">
                  <div>
                    <div className="text-white text-sm font-semibold tracking-wide">{a.title}</div>
                    <div className="text-[0.7rem] text-[#4a4438] mt-1">{a.year} · {a.tracks} tracks</div>
                  </div>
                  <span className="text-[0.58rem] tracking-widest uppercase px-2 py-1 border shrink-0"
                    style={{ color: '#c9a84c', borderColor: 'rgba(201,168,76,0.25)' }}>
                    {a.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
