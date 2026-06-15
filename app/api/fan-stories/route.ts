import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import type { FanStory } from '@/lib/data'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json({ fanStories: (store as any).fanStories ?? [] })
}

export async function POST(req: NextRequest) {
  const { name, email, story, songTitle } = await req.json()
  if (!story || story.trim().length < 10) {
    return NextResponse.json({ error: 'Story is required' }, { status: 400 })
  }
  const entry: FanStory = {
    id: crypto.randomBytes(6).toString('hex'),
    name: (name ?? '').trim() || 'Anonymous',
    email: email ?? undefined,
    story: story.trim(),
    songTitle: songTitle ?? undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const store = await readContent()
  const fanStories = [...((store as any).fanStories ?? []), entry]
  await writeContent({ fanStories } as any)
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const store = await readContent()
  const fanStories = ((store as any).fanStories ?? []).map((s: FanStory) =>
    s.id === id ? { ...s, status } : s
  )
  await writeContent({ fanStories } as any)
  return NextResponse.json({ ok: true })
}
