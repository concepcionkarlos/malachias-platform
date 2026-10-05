// Server-side signing secret shared by the captcha and unsubscribe-link helpers.
// Read lazily (never at module load) so `next build` doesn't trip on it, and
// refuse the dev fallback anywhere that looks like production.

const DEV_FALLBACK = 'malachias-secret'

export function getServerSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret) return secret
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.error('[secret] SESSION_SECRET is not set — refusing to sign with the dev fallback')
    throw new Error('SESSION_SECRET must be set in production')
  }
  return DEV_FALLBACK
}
