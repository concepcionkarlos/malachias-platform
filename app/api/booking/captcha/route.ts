// Public booking-form captcha API. GET (rate-limited to 30 req/min per client)
// issues a fresh, signed, single-use math challenge (a, b, token). Marked
// force-dynamic and served with no-store headers so the single-use token is
// never cached by the browser or CDN.
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { issueChallenge } from '@/lib/captcha'

// Never cache — every caller must get a fresh, single-use challenge.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, 'booking-captcha', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  const { a, b, token } = issueChallenge()
  // Each token is single-use, so the browser/CDN must never serve a cached one.
  return NextResponse.json(
    { a, b, token },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  )
}
