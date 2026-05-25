import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import type { SongRequest } from '@/lib/data'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { fullName, email, eventDate, song1, song2, song3, notes, bookingRequestId } = body

  if (!fullName || !email || !song1) {
    return NextResponse.json({ error: 'Name, email, and at least one song are required' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const request: SongRequest = {
    id: crypto.randomBytes(8).toString('hex'),
    fullName, email, eventDate: eventDate ?? '',
    song1, song2: song2 ?? '', song3: song3 ?? '', notes: notes ?? '',
    bookingRequestId: bookingRequestId ?? '',
    status: 'New', createdAt: now, updatedAt: now,
  }

  const store = await readContent()
  await writeContent({ songRequests: [...store.songRequests, request] })

  return NextResponse.json({ ok: true, id: request.id }, { status: 201 })
}
