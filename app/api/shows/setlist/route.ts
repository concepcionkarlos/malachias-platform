// Show set list endpoint (admin-only; every method requires authentication).
// GET: returns the set list for the show given by the showId query param (400 if missing).
// POST: saves the provided set list items for the given showId and returns the result.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getShowSetList, saveShowSetList } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const showId = req.nextUrl.searchParams.get('showId')
  if (!showId) return NextResponse.json({ error: 'showId required' }, { status: 400 })
  return NextResponse.json(await getShowSetList(showId))
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { showId, items } = await req.json()
  return NextResponse.json(await saveShowSetList(showId, items))
}
