import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const store = await readContent()
  const bookingRequests = (store.bookingRequests ?? []).filter(b => b.id !== id)
  await writeContent({ bookingRequests })
  return NextResponse.json({ ok: true })
}
