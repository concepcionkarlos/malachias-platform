import { NextRequest, NextResponse } from 'next/server'

// In-memory fallback store — used for local dev (no KV) and if KV is unreachable.
// On serverless this is per-instance and resets on cold start, so production
// relies on the KV-backed path below.
const memStore = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  limit: number
  windowMs: number
}

const useKV = !!process.env.KV_REST_API_URL

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function tooMany(retryAfterSec: number, limit: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, retryAfterSec)),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

function memLimit(key: string, options: RateLimitOptions): NextResponse | null {
  const now = Date.now()
  const entry = memStore.get(key)
  if (!entry || now >= entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }
  if (entry.count >= options.limit) {
    return tooMany(Math.ceil((entry.resetAt - now) / 1000), options.limit)
  }
  entry.count += 1
  return null
}

async function kvLimit(key: string, options: RateLimitOptions): Promise<NextResponse | null> {
  const { kv } = await import('@vercel/kv')
  const windowSec = Math.ceil(options.windowMs / 1000)
  // Atomic increment; first hit in the window sets the expiry.
  const count = await kv.incr(key)
  if (count === 1) {
    await kv.expire(key, windowSec)
  }
  if (count > options.limit) {
    const ttl = await kv.ttl(key)
    return tooMany(ttl > 0 ? ttl : windowSec, options.limit)
  }
  return null
}

/**
 * Fixed-window rate limiter. KV-backed in production (shared across all
 * serverless instances), in-memory in local dev. Returns a 429 NextResponse
 * when the caller is over the limit, or null when the request may proceed.
 */
export async function rateLimit(
  req: NextRequest,
  prefix: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60_000 }
): Promise<NextResponse | null> {
  const key = `rl:${prefix}:${getIp(req)}`
  if (useKV) {
    try {
      return await kvLimit(key, options)
    } catch {
      // KV unreachable — fail safe to the in-memory limiter rather than
      // letting the request through unthrottled.
      return memLimit(key, options)
    }
  }
  return memLimit(key, options)
}
