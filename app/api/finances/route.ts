// API route: finance entries CRUD (all methods admin-auth required, force-dynamic).
// GET returns all finance entries. POST adds a new entry from the JSON body.
// DELETE removes an entry by {id}.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getFinances, addFinanceEntry, deleteFinanceEntry } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getFinances())
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  return NextResponse.json(await addFinanceEntry(body))
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await deleteFinanceEntry(id)
  return NextResponse.json({ ok: true })
}
