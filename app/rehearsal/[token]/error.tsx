'use client'

export default function RehearsalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#030202', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase' }}>Error loading page</p>
        <h1 style={{ margin: '0 0 12px', fontSize: '1.6rem', color: '#e8ddd0', letterSpacing: '0.06em', fontFamily: 'Georgia, serif' }}>Something went wrong</h1>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#5c5044', lineHeight: 1.6 }}>
          {error.message || 'An unexpected error occurred while loading the rehearsal page.'}
        </p>
        {error.digest && (
          <p style={{ margin: '0 0 24px', fontSize: 11, color: '#3a2e26', fontFamily: 'monospace' }}>ref: {error.digest}</p>
        )}
        <button
          onClick={() => unstable_retry()}
          style={{ display: 'inline-block', padding: '10px 24px', background: '#c9a84c', color: '#030202', borderRadius: 6, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
