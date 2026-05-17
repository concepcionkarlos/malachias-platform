'use client';

const FILES = [
  { name: 'malachias-live-fresno.jpg',    type: 'Image',  size: '2.4 MB', date: 'Mar 2025' },
  { name: 'victory-church-set.jpg',       type: 'Image',  size: '3.1 MB', date: 'Feb 2025' },
  { name: 'studio-session-01.jpg',        type: 'Image',  size: '1.8 MB', date: 'Mar 2025' },
  { name: 'band-promo-2025.jpg',          type: 'Image',  size: '4.2 MB', date: 'Jan 2025' },
  { name: 'malachias-logo-primary.png',   type: 'Image',  size: '340 KB', date: 'Jan 2025' },
  { name: 'press-release-spring-2025.pdf',type: 'Doc',    size: '122 KB', date: 'Mar 2025' },
  { name: 'stage-plot.pdf',               type: 'Doc',    size: '88 KB',  date: 'Jan 2025' },
  { name: 'set-list-april.pdf',           type: 'Doc',    size: '54 KB',  date: 'Apr 2025' },
];

export default function MediaPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
            MEDIA
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Photos, documents, and press assets</p>
        </div>
      </div>

      {/* Upload zone */}
      <div style={{
        border: '1px dashed rgba(201,168,76,0.18)',
        background: 'rgba(201,168,76,0.025)',
        padding: '2.5rem',
        textAlign: 'center',
        marginBottom: '2rem',
        cursor: 'not-allowed',
        opacity: 0.6,
      }}>
        <div style={{ fontSize: '0.80rem', color: '#5c5044', marginBottom: '0.4rem' }}>Drop files here</div>
        <div style={{ fontSize: '0.68rem', color: '#342c24' }}>JPG, PNG, PDF, MP3 — max 50MB per file</div>
      </div>

      {/* File list */}
      <div style={{ marginBottom: '0.75rem', fontSize: '0.65rem', letterSpacing: '0.20em', color: '#342c24', textTransform: 'uppercase' }}>
        {FILES.length} files
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['File', 'Type', 'Size', 'Uploaded'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontSize: '0.60rem', letterSpacing: '0.18em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILES.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: '#8a7f70', fontFamily: 'monospace' }}>{f.name}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', color: '#5c5044' }}>{f.type}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', color: '#342c24' }}>{f.size}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', color: '#342c24' }}>{f.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
