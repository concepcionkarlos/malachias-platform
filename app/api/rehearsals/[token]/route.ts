// Public rehearsal RSVP endpoint, addressed by invite token (rate-limited per client).
// GET (20/min): looks up the rehearsal by token and returns it plus its songs (404 if not found).
// POST (5/min): records an attendance confirmation (name + status required, with length
// limits on name/email/note and caps on readySongs/readyItems) and returns the updated rehearsal.
import { NextRequest, NextResponse } from 'next/server'
import { getRehearsalByToken, addRehearsalConfirmation, getSongs } from '@/lib/venueStore'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = await rateLimit(req, 'rehearsal-token', { limit: 20, windowMs: 60_000 })
  if (limited) return limited
  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const allSongs = await getSongs()
  const songs = allSongs.filter(s => rehearsal.songIds.includes(s.id))
  return NextResponse.json({ rehearsal, songs })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = await rateLimit(req, 'rehearsal-rsvp', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json()
  const { name, email, status, instrument, readySongs, readyItems, note } = body
  if (!name || !status) return NextResponse.json({ error: 'name and status required' }, { status: 400 })
  if (String(name).length > 120) return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  if (email && String(email).length > 254) return NextResponse.json({ error: 'Email too long' }, { status: 400 })
  if (note && String(note).length > 600) return NextResponse.json({ error: 'Note too long' }, { status: 400 })
  const updated = await addRehearsalConfirmation(rehearsal.id, {
    name, email,
    instrument: instrument ? String(instrument).slice(0, 60) : undefined,
    status, readySongs: Array.isArray(readySongs) ? readySongs.slice(0, 30) : undefined,
    readyItems: Array.isArray(readyItems) ? readyItems.slice(0, 10) : undefined,
    note: note ? String(note).slice(0, 600) : undefined,
    respondedAt: new Date().toISOString(),
  })
  return NextResponse.json(updated)
}
