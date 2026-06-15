import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#030202',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <p style={{ margin: '0 0 8px', fontSize: 11, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase' }}>
        404
      </p>
      <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#e8ddd0', letterSpacing: '0.08em', fontFamily: 'Georgia, serif' }}>
        Page Not Found
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: '#5c5044', maxWidth: 360, lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          background: '#c9a84c',
          color: '#030202',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}
      >
        Back to Home
      </Link>
    </main>
  )
}
