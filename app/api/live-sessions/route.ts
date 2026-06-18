// Admin API for the live sessions collection (auth-gated via isAuthenticated; 401 otherwise).
// GET: returns all live sessions from the venue store.
// POST: creates a new live session from the JSON body and returns it with status 201.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getLiveSessions, addLiveSession } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sessions = await getLiveSessions()
  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const session = await addLiveSession(body)
  return NextResponse.json(session, { status: 201 })
}
