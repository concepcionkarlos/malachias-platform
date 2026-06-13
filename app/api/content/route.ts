import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent, writeContent } from '@/lib/store'
import type { BookingRequest } from '@/lib/data'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json(store)
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates = await req.json()

  // BookingDetail sends a merge-item sentinel to update a single booking in-place.
  // Handle it here so the raw sentinel never reaches writeContent (which would overwrite
  // bookingRequests with the string 'merge-item', corrupting the store).
  if (updates.bookingRequests === 'merge-item' && updates.item) {
    const item = updates.item as BookingRequest
    const current = await readContent()
    const bookingRequests = current.bookingRequests.map((b) =>
      b.id === item.id ? item : b
    )
    const store = await writeContent({ bookingRequests })
    return NextResponse.json(store)
  }

  const store = await writeContent(updates)
  return NextResponse.json(store)
}
