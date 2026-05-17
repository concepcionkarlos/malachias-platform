'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

const platforms = [
  {
    name: 'Spotify',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#1DB954">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: '#1DB954',
    label: 'Listen on Spotify',
    embed: (
      <iframe
        src="https://open.spotify.com/embed/artist/placeholder?utm_source=generator&theme=0"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded"
        title="Spotify"
      />
    ),
  },
  {
    name: 'Apple Music',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.1.958 1.284 1.846.736 3.01a4.97 4.97 0 00-.272.788 12.158 12.158 0 00-.19 1.396c-.013.148-.018.298-.026.447v11.718c.008.15.013.298.026.447.04.535.11 1.07.272 1.589.536 1.745 1.73 2.87 3.51 3.354a8.28 8.28 0 001.65.248c.585.03 1.172.04 1.758.043H17.542a11.59 11.59 0 001.649-.166c1.015-.195 1.913-.608 2.651-1.279 1.034-.934 1.553-2.117 1.729-3.46.04-.312.07-.626.07-.94L24 6.124zm-9.354 6.944c-.326.682-.844 1.188-1.453 1.6-.48.32-.99.568-1.555.667a3.88 3.88 0 01-.634.065c-.847 0-1.627-.3-2.268-.855-.712-.617-1.088-1.41-1.088-2.347 0-.96.39-1.77 1.124-2.38.665-.554 1.48-.837 2.335-.837.368 0 .74.06 1.097.174l.05.018V5.988c0-.083.003-.164.008-.245.02-.296.088-.57.217-.83.247-.502.63-.864 1.138-1.09.345-.154.71-.23 1.086-.235h.06c.3 0 .596.048.88.14a2.55 2.55 0 011.143.764c.22.252.38.54.476.848.076.24.112.49.112.744v1.016c0 .212-.07.39-.197.543-.17.202-.404.31-.654.316-.063.002-.125-.002-.186-.014l-2.887-.622-.013-.003V11.3c0 .265-.042.522-.117.769zm0 0"/>
      </svg>
    ),
    color: '#fc3c44',
    label: 'Listen on Apple Music',
    embed: (
      <div className="w-full h-[152px] rounded flex items-center justify-center bg-gradient-to-br from-[#1a0a0a] to-[#0d0d0d] border border-[#fc3c44]/20">
        <div className="text-center">
          <p className="text-[#fc3c44] text-xs tracking-widest uppercase mb-2">Apple Music</p>
          <p className="text-gray-500 text-xs">Connect your artist profile to enable embed</p>
        </div>
      </div>
    ),
  },
  {
    name: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: '#FF0000',
    label: 'Watch on YouTube',
    embed: (
      <div className="w-full aspect-video rounded overflow-hidden bg-[#0d0d0d]">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/videoseries?list=PLplaceholder"
          title="Malachias YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    ),
  },
  {
    name: 'Live Videos',
    icon: <Play size={32} className="text-[#c9a84c]" fill="rgba(201,168,76,0.3)" />,
    color: '#c9a84c',
    label: 'Watch Live Performances',
    embed: (
      <div className="w-full h-[152px] rounded flex items-center justify-center bg-gradient-to-br from-[#0d0a00] to-[#0d0d0d] border border-[#c9a84c]/20 relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#c9a84c]/50 flex items-center justify-center mx-auto mb-3 group-hover:border-[#c9a84c] transition-colors duration-300">
            <Play size={20} className="text-[#c9a84c] ml-1" />
          </div>
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Live Performances</p>
          <p className="text-gray-500 text-xs mt-1">Coming Soon</p>
        </div>
      </div>
    ),
  },
];

const albums = [
  { title: 'Faith on Fire', year: '2024', tracks: 10, status: 'Out Now' },
  { title: 'Under Orders', year: '2023', tracks: 8, status: 'Album' },
  { title: 'No Man Left Behind', year: '2022', tracks: 7, status: 'EP' },
];

export default function Music() {
  return (
    <section id="music" className="relative py-28 bg-[#080808] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 100%)' }}
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
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-4">Stream & Watch</p>
          <h2
            className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-widest text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            THE MUSIC
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <span className="text-[#c9a84c]">✝</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 p-6 group"
            >
              <div className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}50, transparent)` }}
              />
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {p.icon}
                  <div>
                    <h3 className="font-bold text-white tracking-wider">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.label}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs tracking-wider uppercase transition-colors duration-300"
                  style={{ color: p.color }}
                >
                  Open <ExternalLink size={12} />
                </a>
              </div>
              {/* Embed */}
              {p.embed}
            </motion.div>
          ))}
        </div>

        {/* Discography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase mb-8 text-center">Discography</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {albums.map((album, i) => (
              <motion.div
                key={album.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative border border-[#c9a84c]/15 hover:border-[#c9a84c]/40 transition-all duration-500 group overflow-hidden cursor-pointer"
              >
                {/* Album art placeholder */}
                <div className="aspect-square relative bg-gradient-to-br from-[#1a0f00] to-[#0d0d0d] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-[#8b0000]/5" />
                  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="opacity-20">
                    <rect x="26" y="0" width="8" height="80" fill="#c9a84c" />
                    <rect x="0" y="22" width="60" height="8" fill="#c9a84c" />
                  </svg>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play size={32} className="text-[#c9a84c]" />
                  </div>
                </div>
                {/* Info */}
                <div className="p-4 bg-[#0d0d0d]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm tracking-wider">{album.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{album.year} · {album.tracks} tracks</p>
                    </div>
                    <span className="text-[0.6rem] tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-1">
                      {album.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
