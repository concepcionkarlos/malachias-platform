// Admin API returning the full email thread for a single venue (auth required).
// GET: fetches outreach logs sent to the venue plus inbound emails filtered to this venue,
// returning { sent, received }.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getOutreachLogsForVenue, getInboundEmails } from '@/lib/venueStore'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const [sent, allInbound] = await Promise.all([
    getOutreachLogsForVenue(id),
    getInboundEmails(),
  ])

  const received = allInbound.filter(e => e.entityType === 'venue' && e.entityId === id)

  return NextResponse.json({ sent, received })
}
