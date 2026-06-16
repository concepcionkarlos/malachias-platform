import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setSession, clearSession, isAuthenticated } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function GET() {
  const ok = await isAuthenticated()
  return NextResponse.json({ authenticated: ok })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'admin-login', { limit: 5, windowMs: 15 * 60_000 })
  if (limited) return limited

  const { password } = await req.json()
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  await setSession()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearSession()
  return NextResponse.json({ ok: true })
}
