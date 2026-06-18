import Link from 'next/link'

export default async function VerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const { error, email } = await searchParams

  if (error) {
    const messages: Record<string, string> = {
      missing: 'No verification token found.',
      invalid: 'This link is invalid or has already been used.',
      expired: 'This link has expired. Please sign up again.',
    }
    return (
      <main style={{
        minHeight: '100vh', background: '#030202', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            letterSpacing: '0.35em', color: '#c04020', marginBottom: '1.5rem', textTransform: 'uppercase',
          }}>
            Verification Failed
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,3rem)',
            letterSpacing: '0.06em', color: '#e8ddd0', margin: '0 0 1.25rem', lineHeight: 0.95,
          }}>
            LINK EXPIRED
          </h1>
          <p style={{ color: 'rgba(232,221,208,0.5)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {messages[error] ?? 'Something went wrong.'}
          </p>
          <Link href="/#newsletter" style={{
            display: 'inline-block', background: 'transparent',
            border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c',
            padding: '0.75rem 2rem', fontSize: '0.72rem', letterSpacing: '0.20em',
            textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-body)',
          }}>
            Try Again →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#030202', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        {/* Gold line */}
        <div style={{
          width: '2.5rem', height: '2px',
          background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
          margin: '0 auto 2rem',
        }} />

        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '0.65rem',
          letterSpacing: '0.35em', color: '#c9a84c', marginBottom: '1.5rem', textTransform: 'uppercase',
        }}>
          Brotherhood Confirmed
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,4rem)',
          letterSpacing: '0.06em', color: '#e8ddd0', margin: '0 0 1.25rem', lineHeight: 0.95,
        }}>
          YOU&apos;RE IN.
        </h1>

        <p style={{
          color: 'rgba(232,221,208,0.55)', fontSize: '0.9rem',
          lineHeight: 1.75, marginBottom: '0.75rem',
        }}>
          Welcome to the brotherhood.{email ? ` Check ${email} for your 15% off code.` : ' Check your inbox for your 15% off code.'}
        </p>

        <p style={{
          color: 'rgba(232,221,208,0.35)', fontSize: '0.78rem',
          lineHeight: 1.7, marginBottom: '2.5rem',
        }}>
          New music, upcoming shows, honest dispatches from the road and the studio.
          For the people who believe something real is happening here.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/merch" style={{
            display: 'inline-block', background: '#c9a84c', color: '#030202',
            padding: '0.85rem 2rem', fontSize: '0.72rem', letterSpacing: '0.20em',
            textTransform: 'uppercase', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700,
          }}>
            Shop with 15% Off →
          </Link>
          <Link href="/" style={{
            display: 'inline-block', background: 'transparent',
            border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.7)',
            padding: '0.85rem 2rem', fontSize: '0.72rem', letterSpacing: '0.20em',
            textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-body)',
          }}>
            Back Home
          </Link>
        </div>

        <div style={{
          width: '2.5rem', height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
          margin: '3rem auto 0',
        }} />
      </div>
    </main>
  )
}
