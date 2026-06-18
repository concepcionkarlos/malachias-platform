// Admin email template detail API (auth-gated; all methods return 401 if unauthenticated).
// GET: returns the template matching the [id] route param (404 if not found).
// PATCH: applies a partial update to the template (404 if not found).
// DELETE: removes the template, but refuses system templates (isSystem) with 403; returns { ok: true } on success.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTemplates, updateTemplate, deleteTemplate } from '@/lib/venueStore'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const templates = await getTemplates()
  const tmpl = templates.find((t) => t.id === id)
  if (!tmpl) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tmpl)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json()
  try {
    const updated = await updateTemplate(id, patch)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const templates = await getTemplates()
  const tmpl = templates.find((t) => t.id === id)
  if (tmpl?.isSystem) return NextResponse.json({ error: 'Cannot delete system templates' }, { status: 403 })
  await deleteTemplate(id)
  return NextResponse.json({ ok: true })
}
