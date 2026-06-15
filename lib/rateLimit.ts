import { NextRequest, NextResponse } from 'next/server'

const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  limit: number
  windowMs: number
}

function getKey(req: NextRequest, prefix: string): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `${prefix}:${ip}`
}

export function rateLimit(
  req: NextRequest,
  prefix: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60_000 }
): NextResponse | null {
  const now = Date.now()
  const key = getKey(req, prefix)
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }

  if (entry.count >= options.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(options.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  entry.count += 1
  return null
}
