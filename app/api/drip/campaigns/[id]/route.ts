// Admin drip campaign detail API (auth-gated; returns 401 if unauthenticated).
// PATCH: applies a partial update to the drip campaign identified by the [id] route param and returns the updated record.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { updateDripCampaign } from '@/lib/venueStore'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json()
  const updated = await updateDripCampaign(id, patch)
  return NextResponse.json(updated)
}
