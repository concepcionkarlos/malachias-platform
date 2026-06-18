// Admin API for the venues collection (auth required on all methods).
// GET: returns all venues. POST: creates a venue from the request body and returns it (201).
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getVenues, addVenue } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const venues = await getVenues()
  return NextResponse.json(venues)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const venue = await addVenue(body)
  return NextResponse.json(venue, { status: 201 })
}
