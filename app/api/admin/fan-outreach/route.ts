import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'

export interface FanContact {
  id: string
  name: string
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube' | 'Other'
  engagement: string     // e.g. "Commented on 'Live at VFW Hall' video"
  stage: 'new' | 'replied' | 'dm_sent' | 'responded' | 'supporter'
  notes: string
  createdAt: string
  updatedAt: string
}

async function getContacts(): Promise<FanContact[]> {
  const store = await readContent()
  return (store as any).fanOutreach ?? []
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ contacts: await getContacts() })
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, platform, engagement, notes } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const contact: FanContact = {
    id: crypto.randomBytes(6).toString('hex'),
    name: name.trim(),
    platform: platform ?? 'Facebook',
    engagement: (engagement ?? '').trim(),
    stage: 'new',
    notes: (notes ?? '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const contacts = [...(await getContacts()), contact]
  await writeContent({ fanOutreach: contacts } as any)
  return NextResponse.json({ contact }, { status: 201 })
}
