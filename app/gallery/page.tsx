// Page — /gallery: server shell that renders the page header and delegates the
// interactive photo grid + lightbox to the GalleryClient component.
import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery — MALACHIAS',
};

export default function GalleryPage() {
  return (
    <main style={{ background: '#060606', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '7rem 1.5rem 3rem' }}>
        <p
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.40em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            marginBottom: '0.75rem',
          }}
        >
          Photos
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            lineHeight: 0.92,
            letterSpacing: '0.06em',
            color: '#fff',
            marginBottom: '1rem',
          }}
        >
          GALLERY
        </h1>
        <div
          style={{
            width: '3rem',
            height: '1px',
            background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            marginBottom: '3rem',
          }}
        />

        {/* Gallery grid + lightbox (client) */}
        <GalleryClient />
      </div>
    </main>
  );
}
