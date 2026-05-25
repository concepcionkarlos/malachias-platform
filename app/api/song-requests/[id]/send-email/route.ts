import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent } from '@/lib/store'
import { sendOutreachEmail } from '@/lib/emailService'
import { addBookingEmailLog } from '@/lib/venueStore'
import { renderTemplate } from '@/lib/templateUtils'
import type { EmailTemplate } from '@/lib/data'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const store = await readContent()
  const sr = store.songRequests.find((s) => s.id === id)
  if (!sr) return NextResponse.json({ error: 'Song request not found' }, { status: 404 })

  const body: { template: EmailTemplate; vars: Record<string, string>; replyTo?: string } = await req.json()
  const { template, vars, replyTo } = body

  const clientName = sr.fullName.split(' ')[0] || sr.fullName
  const songs = [sr.song1, sr.song2, sr.song3].filter(Boolean).join(', ')

  const { subject, bodyHtml } = renderTemplate(template, {
    clientName, songList: songs,
    replyEmail: store.siteContent.contactEmail,
    ...vars,
  })

  let resendEmailId: string | undefined
  let status: 'sent' | 'failed' = 'sent'
  let errorMessage: string | undefined

  try {
    const result = await sendOutreachEmail({ toEmail: sr.email, subject, bodyHtml, replyTo })
    resendEmailId = result.resendEmailId
  } catch (err) {
    status = 'failed'
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  await addBookingEmailLog({
    entityType: 'song-request', entityId: id,
    toEmail: sr.email, subject, bodyHtml,
    templateId: template.id, templateSlug: template.slug,
    sentAt: new Date().toISOString(), resendEmailId, status, errorMessage,
  })

  if (status === 'failed') return NextResponse.json({ error: errorMessage }, { status: 500 })
  return NextResponse.json({ ok: true, resendEmailId })
}
