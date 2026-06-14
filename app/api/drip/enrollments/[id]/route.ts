import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { updateDripEnrollment } from '@/lib/venueStore'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json()
  const updated = await updateDripEnrollment(id, patch)
  return NextResponse.json(updated)
}
