import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function hash(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'malachias-admin'
  const secret = process.env.SESSION_SECRET ?? 'malachias-secret'
  return hash(password + secret)
}

export async function setSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, getExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
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
  const token = cookieStore.get(COOKIE)?.value
  return token === getExpectedToken()
}

export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE)?.value
  return token === getExpectedToken()
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'malachias-admin'
  return password === expected
}
