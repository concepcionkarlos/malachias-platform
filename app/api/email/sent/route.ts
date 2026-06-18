// API route: CRM sent-emails log.
// GET (admin-auth required) returns all logged sent emails. DELETE (admin-auth
// required) removes one entry by {id}.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getSentEmails, deleteSentEmail } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const emails = await getSentEmails()
  return NextResponse.json(emails)
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await deleteSentEmail(id)
  return NextResponse.json({ ok: true })
}
