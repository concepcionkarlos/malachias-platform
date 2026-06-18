// Admin API for a single inbound email by id (auth-gated via isAuthenticated; 401 otherwise).
// PATCH: marks the email as read when the body has { read: true }.
// DELETE: removes the inbound email from the venue store.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { markInboundEmailRead, deleteInboundEmail } from '@/lib/venueStore'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { read } = await req.json()
  if (read === true) await markInboundEmailRead(id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteInboundEmail(id)
  return NextResponse.json({ ok: true })
}
