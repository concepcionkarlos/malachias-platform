import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { isAuthenticated } from '@/lib/auth'
import { readContent, writeContent } from '@/lib/store'
import type { MediaItem } from '@/lib/data'

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, caption } = await req.json()
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })

  const ytId = youtubeId(url)
  const poster = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined

  const store = await readContent()
  const item: MediaItem = {
    id: crypto.randomBytes(8).toString('hex'),
    type: 'video', url,
    poster, caption: caption ?? '',
    visible: true,
  }
  await writeContent({ mediaItems: [...store.mediaItems, item] })

  return NextResponse.json(item, { status: 201 })
}
