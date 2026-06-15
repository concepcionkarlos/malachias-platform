import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json({ subscribers: store.subscribers ?? [] })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'newsletter', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const store = await readContent()
  const subscribers = store.subscribers ?? []
  const already = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())

  if (!already) {
    await writeContent({
      subscribers: [...subscribers, { email: email.toLowerCase(), joinedAt: new Date().toISOString() }],
    })
  }

  return NextResponse.json({ ok: true })
}
