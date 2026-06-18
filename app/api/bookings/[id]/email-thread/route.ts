// API route for a booking's full email thread.
// GET: requires an authenticated session; returns { sent, received } for the booking
// matching the [id] path param — sent outbound logs plus inbound emails filtered to
// this booking entity (read-only).
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getBookingEmailLogs, getInboundEmails } from '@/lib/venueStore'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const [sent, allInbound] = await Promise.all([
    getBookingEmailLogs('booking', id),
    getInboundEmails(),
  ])

  const received = allInbound.filter(e => e.entityType === 'booking' && e.entityId === id)

  return NextResponse.json({ sent, received })
}
