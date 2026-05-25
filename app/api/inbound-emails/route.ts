import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getInboundEmails, markAllInboundEmailsRead } from '@/lib/venueStore'
import { NextRequest } from 'next/server'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const emails = await getInboundEmails()
  return NextResponse.json(emails)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action } = await req.json()
  if (action === 'mark-all-read') {
    await markAllInboundEmailsRead()
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
