// Public rehearsal RSVP endpoint, addressed by invite token (rate-limited per client).
// GET (20/min): looks up the rehearsal by token and returns it plus its songs (404 if not found).
// POST (5/min): records an attendance confirmation (name + status required, with length
// limits on name/email/note and caps on readySongs/readyItems) and returns the updated rehearsal.
// Anyone with the invite link can call this, so responses never include other
// members' emails (publicRehearsal).
import { NextRequest, NextResponse } from 'next/server'
import { getRehearsalByToken, addRehearsalConfirmation, getSongs, publicRehearsal } from '@/lib/venueStore'
import { rateLimit } from '@/lib/rateLimit'
import { str } from '@/lib/str'
import type { RehearsalConfirmation } from '@/lib/data'

const RSVP_STATUSES: RehearsalConfirmation['status'][] = ['confirmed', 'declined']

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = await rateLimit(req, 'rehearsal-token', { limit: 20, windowMs: 60_000 })
  if (limited) return limited
  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const allSongs = await getSongs()
  const songs = allSongs.filter(s => rehearsal.songIds.includes(s.id))
  return NextResponse.json({ rehearsal: publicRehearsal(rehearsal), songs })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const limited = await rateLimit(req, 'rehearsal-rsvp', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  const { token } = await params
  const rehearsal = await getRehearsalByToken(token)
  if (!rehearsal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const name = str(body.name, 200)
  const email = str(body.email, 300)
  const note = str(body.note, 700)
  const instrument = str(body.instrument, 60)
  const status = body.status as RehearsalConfirmation['status']
  if (!name || !status) return NextResponse.json({ error: 'name and status required' }, { status: 400 })
  if (!RSVP_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  if (name.length > 120) return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  if (email.length > 254) return NextResponse.json({ error: 'Email too long' }, { status: 400 })
  if (note.length > 600) return NextResponse.json({ error: 'Note too long' }, { status: 400 })
  const strings = (v: unknown, max: number) => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max).map(x => x.slice(0, 120)) : undefined
  const updated = await addRehearsalConfirmation(rehearsal.id, {
    name, email: email || undefined,
    instrument: instrument || undefined,
    status, readySongs: strings(body.readySongs, 30),
    readyItems: strings(body.readyItems, 10),
    note: note || undefined,
    respondedAt: new Date().toISOString(),
  })
  return NextResponse.json(publicRehearsal(updated))
}
