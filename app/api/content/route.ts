import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent, writeContent } from '@/lib/store'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json(store)
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates = await req.json()
  const store = await writeContent(updates)
  return NextResponse.json(store)
}
