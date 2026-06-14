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
