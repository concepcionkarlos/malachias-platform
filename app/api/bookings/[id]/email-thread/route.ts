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
