// API route for a single booking's sent-email logs.
// GET: requires an authenticated session; returns the list of outbound email logs
// recorded for the booking matching the [id] path param (read-only).
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getBookingEmailLogs } from '@/lib/venueStore'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const logs = await getBookingEmailLogs('booking', id)
  return NextResponse.json(logs)
}
