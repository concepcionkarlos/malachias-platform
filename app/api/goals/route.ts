// API route: goals CRUD (all methods admin-auth required, force-dynamic).
// GET returns goals, optionally filtered by a ?date query param. POST adds a
// goal from the JSON body. PATCH updates a goal by {id, ...patch}. DELETE
// removes a goal by {id}.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getGoals, addGoal, updateGoal, deleteGoal } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const date = new URL(req.url).searchParams.get('date') ?? undefined
  return NextResponse.json(await getGoals(date))
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await addGoal(await req.json()))
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...patch } = await req.json()
  return NextResponse.json(await updateGoal(id, patch))
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await deleteGoal(id)
  return NextResponse.json({ ok: true })
}
