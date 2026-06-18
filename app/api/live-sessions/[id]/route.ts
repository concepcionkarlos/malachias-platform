// Admin API for a single live session by id (auth-gated via isAuthenticated; 401 otherwise).
// PATCH: applies the JSON body as a partial update and returns the updated session.
// DELETE: removes the live session from the venue store.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { updateLiveSession, deleteLiveSession } from '@/lib/venueStore'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json()
  const updated = await updateLiveSession(id, patch)
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteLiveSession(id)
  return NextResponse.json({ ok: true })
}
