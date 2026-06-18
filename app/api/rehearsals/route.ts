// Rehearsals CRUD endpoint (admin-only; every method requires authentication).
// GET: list all rehearsals. POST: create a rehearsal from the request body.
// PATCH: update the rehearsal with the given id. DELETE: remove the rehearsal by id.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getRehearsals, addRehearsal, updateRehearsal, deleteRehearsal } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getRehearsals())
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  return NextResponse.json(await addRehearsal(body))
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...patch } = await req.json()
  return NextResponse.json(await updateRehearsal(id, patch))
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await deleteRehearsal(id)
  return NextResponse.json({ ok: true })
}
