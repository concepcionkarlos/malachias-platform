// Band stats endpoint (admin-only; every method requires authentication).
// GET: returns the current band stats. PATCH: merges the request body into the
// stored band stats via saveBandStats and returns the updated stats.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getBandStats, saveBandStats } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getBandStats())
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const patch = await req.json()
  return NextResponse.json(await saveBandStats(patch))
}
