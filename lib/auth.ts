import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days, in seconds
const MAX_AGE_MS = MAX_AGE * 1000

// Signing key for session tokens. It is bound to the admin password as well as
// the secret, so rotating the password instantly invalidates every existing
// session (a free "log everyone out" lever).
function getSigningKey(): string {
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.SESSION_SECRET
  if (process.env.NODE_ENV === 'production' && (!password || !secret)) {
    // Hard-fail in production rather than use guessable defaults
    throw new Error('ADMIN_PASSWORD and SESSION_SECRET must be set in production')
  }
  return `${secret ?? 'malachias-secret'}:${password ?? 'malachias-admin'}`
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSigningKey()).update(payload).digest('base64url')
}

// Token format: <issuedAtMs>.<random>.<hmac>
// Unlike the old static sha256(password+secret), each login mints a unique,
// unforgeable token that carries its own server-side expiry — the client can't
// extend its lifetime by editing the cookie's maxAge.
function mintToken(): string {
  const payload = `${Date.now()}.${crypto.randomBytes(18).toString('base64url')}`
  return `${payload}.${sign(payload)}`
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [issuedAtStr, random, sig] = parts

  // Verify the signature in constant time.
  const expected = sign(`${issuedAtStr}.${random}`)
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return false

  // Enforce server-side expiry regardless of the cookie's own maxAge.
  const issuedAt = parseInt(issuedAtStr, 10)
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_MS) return false

  return true
}

export async function setSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, mintToken(), {
    httpOnly: true,                                   // not readable from JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',                                  // not sent on cross-site POST/PATCH/DELETE → CSRF defense
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidToken(cookieStore.get(COOKIE)?.value)
}

export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(COOKIE)?.value)
}

export function verifyPassword(password: string): boolean {
  if (!password) return false
  const expected = process.env.ADMIN_PASSWORD ?? 'malachias-admin'
  try {
    const a = Buffer.from(password, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}
