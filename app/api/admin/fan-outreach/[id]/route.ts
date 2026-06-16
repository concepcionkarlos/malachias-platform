import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import type { FanContact } from '../route'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updates = await req.json()

  const store = await readContent()
  const contacts: FanContact[] = (store as any).fanOutreach ?? []
  const idx = contacts.findIndex(c => c.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  contacts[idx] = { ...contacts[idx], ...updates, id, updatedAt: new Date().toISOString() }
  await writeContent({ fanOutreach: contacts } as any)
  return NextResponse.json({ contact: contacts[idx] })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const store = await readContent()
  const contacts: FanContact[] = (store as any).fanOutreach ?? []
  const filtered = contacts.filter(c => c.id !== id)
  await writeContent({ fanOutreach: filtered } as any)
  return NextResponse.json({ ok: true })
}
