'use client';

// Client component for /gallery: renders the photo grid and a keyboard-navigable
// lightbox (arrow keys + Escape) with prev/next controls and body-scroll locking.
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryPhoto {
  src: string;
  caption: string;
}

const PHOTOS: GalleryPhoto[] = [
  { src: '/together.jpeg',        caption: 'Together'                    },
  { src: '/Malachias 1.jpeg',     caption: 'Malachias — Press Photo'     },
  { src: '/malachias 2.jpeg',     caption: 'Malachias — Press Photo II'  },
  { src: '/Efrain Rhytms.PNG',    caption: 'Efrain'                      },
  { src: '/Efrain Rhytms 2.PNG',  caption: 'Efrain'                      },
  { src: '/Gabe Bass.PNG',        caption: 'Gabe'                        },
  { src: '/Gabe Bass 2.PNG',      caption: 'Gabe'                        },
  { src: '/Henry Drums.PNG',      caption: 'Henry'                       },
  { src: '/Henry Drums 2.PNG',    caption: 'Henry'                       },
  { src: '/JC Concepcion.PNG',    caption: 'JC Concepcion'               },
  { src: '/JC Concepcion 2.PNG',  caption: 'JC Concepcion'               },
];

export default function GalleryClient() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % PHOTOS.length));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  return (
    <>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        {PHOTOS.map((photo, i) => (
          <motion.button
            key={photo.src}
            onClick={() => setLightboxIndex(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              overflow: 'hidden',
              background: '#111',
              border: '1px solid rgba(201,168,76,0)',
              borderRadius: '2px',
              cursor: 'pointer',
              padding: 0,
              display: 'block',
              transition: 'border-color 0.25s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0)'; }}
            aria-label={`Open photo: ${photo.caption}`}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            />
            {/* Caption overlay on hover */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem 0.875rem 0.625rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.25s',
              }}
            >
              <p style={{ fontSize: '0.68rem', letterSpacing: '0.20em', color: '#e8ddd0', textTransform: 'uppercase' }}>
                {photo.caption}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Image container */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '85vh',
                width: '900px',
                aspectRatio: '4/3',
              }}
            >
              <Image
                src={PHOTOS[lightboxIndex].src}
                alt={PHOTOS[lightboxIndex].caption}
                fill
                sizes="90vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </motion.div>

            {/* Caption */}
            <div
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <p style={{ fontSize: '0.68rem', letterSpacing: '0.30em', color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase' }}>
                {PHOTOS[lightboxIndex].caption}
              </p>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.30)', marginTop: '0.25rem' }}>
                {lightboxIndex + 1} / {PHOTOS.length}
              </p>
            </div>

            {/* Prev arrow */}
            <button
              onClick={e => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(201,168,76,0.30)',
                borderRadius: '2px',
                color: '#c9a84c',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                lineHeight: 1,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.30)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.55)';
              }}
            >
              ‹
            </button>

            {/* Next arrow */}
            <button
              onClick={e => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(201,168,76,0.30)',
                borderRadius: '2px',
                color: '#c9a84c',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                lineHeight: 1,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.30)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.55)';
              }}
            >
              ›
            </button>

            {/* Close button */}
            <button
              onClick={e => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Close lightbox"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(201,168,76,0.30)',
                borderRadius: '2px',
                color: '#c9a84c',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.30)'; }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
