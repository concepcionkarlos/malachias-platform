// API route: fan-story submissions.
// GET (admin-auth required) lists all fan stories. POST is public but
// rate-limited (3/min per client) and validates/sanitizes input, saving a new
// 'pending' story (no auto-reply email is sent, by design). PATCH (admin-auth
// required) updates a story's moderation status by {id, status}.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, updateContent } from '@/lib/store'
import { str } from '@/lib/str'
import { isAuthenticated } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import type { FanStory } from '@/lib/data'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json({ fanStories: store.fanStories ?? [] })
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'fan-stories', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const body = await req.json().catch(() => ({}))
  const name = str(body?.name, 200)
  const story = str(body?.story, 9000)
  const songTitle = str(body?.songTitle, 300)
  if (story.length < 10) {
    return NextResponse.json({ error: 'Story is required' }, { status: 400 })
  }
  if (story.length > 8000) return NextResponse.json({ error: 'Story is too long' }, { status: 400 })
  if (name.length > 120) return NextResponse.json({ error: 'Name is too long' }, { status: 400 })
  if (songTitle.length > 200) return NextResponse.json({ error: 'Song title is too long' }, { status: 400 })
  const emailStr = str(body?.email, 300) || undefined
  if (emailStr && (emailStr.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr))) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  const entry: FanStory = {
    id: crypto.randomBytes(6).toString('hex'),
    name: name || 'Anonymous',
    email: emailStr,
    story,
    songTitle: songTitle || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  await updateContent(store => ({ fanStories: [...(store.fanStories ?? []), entry] }))

  // NOTE: We intentionally do NOT auto-send an acknowledgement email here.
  // The submitted email is unverified — auto-replying would let anyone use us
  // to relay/bomb mail to a third party's inbox in Malachias's name and hurt
  // our sending reputation. The story is saved for review in the admin panel,
  // where the band can reply manually once they choose to.

  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  await updateContent(store => ({
    fanStories: (store.fanStories ?? []).map((s: FanStory) => s.id === id ? { ...s, status } : s),
  }))
  return NextResponse.json({ ok: true })
}
