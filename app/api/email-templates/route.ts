// Admin email templates API (auth-gated; both methods return 401 if unauthenticated).
// GET: returns the list of all email templates.
// POST: creates a template from name, slug, subject, and bodyHtml (400 if any are missing); returns the created template with 201.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTemplates, createTemplate } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const templates = await getTemplates()
  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, slug, subject, bodyHtml } = await req.json()
  if (!name || !slug || !subject || !bodyHtml) {
    return NextResponse.json({ error: 'name, slug, subject, and bodyHtml are required' }, { status: 400 })
  }
  const tmpl = await createTemplate({ name, slug, subject, bodyHtml })
  return NextResponse.json(tmpl, { status: 201 })
}
