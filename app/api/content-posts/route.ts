// CRUD API route for content posts (force-dynamic, no caching).
// All methods require an authenticated session. GET: list all posts. POST: create a post
// from the request body. PATCH: update the post identified by body.id with the remaining
// fields. DELETE: remove the post identified by body.id. Backed by venueStore.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getContentPosts, addContentPost, updateContentPost, deleteContentPost } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getContentPosts())
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  return NextResponse.json(await addContentPost(body))
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...patch } = await req.json()
  return NextResponse.json(await updateContentPost(id, patch))
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await deleteContentPost(id)
  return NextResponse.json({ ok: true })
}
