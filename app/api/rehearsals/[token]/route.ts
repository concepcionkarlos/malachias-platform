import { NextRequest, NextResponse } from 'next/server'
import { getRehearsalByToken, addRehearsalConfirmation, getSongs } from '@/lib/venueStore'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = rateLimit(req, 'rehearsal-token', { limit: 20, windowMs: 60_000 })
  if (limited) return limited
  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const allSongs = await getSongs()
  const songs = allSongs.filter(s => rehearsal.songIds.includes(s.id))
  return NextResponse.json({ rehearsal, songs })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = rateLimit(req, 'rehearsal-rsvp', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json()
  const { name, email, status } = body
  if (!name || !status) return NextResponse.json({ error: 'name and status required' }, { status: 400 })
  if (String(name).length > 120) return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  if (email && String(email).length > 254) return NextResponse.json({ error: 'Email too long' }, { status: 400 })
  const updated = await addRehearsalConfirmation(rehearsal.id, {
    name, email, status, respondedAt: new Date().toISOString(),
  })
  return NextResponse.json(updated)
}
