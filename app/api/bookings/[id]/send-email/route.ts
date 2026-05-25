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
  const booking = store.bookingRequests.find((b) => b.id === id)
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const body: { template: EmailTemplate; vars: Record<string, string>; replyTo?: string } = await req.json()
  const { template, vars, replyTo } = body

  const clientName = booking.fullName.split(' ')[0] || booking.fullName
  const { subject, bodyHtml } = renderTemplate(template, {
    clientName,
    eventDate: booking.eventDate || '(date not specified)',
    eventType: booking.eventType || 'your event',
    replyEmail: store.siteContent.contactEmail,
    ...vars,
  })

  let resendEmailId: string | undefined
  let status: 'sent' | 'failed' = 'sent'
  let errorMessage: string | undefined

  try {
    const result = await sendOutreachEmail({ toEmail: booking.email, subject, bodyHtml, replyTo })
    resendEmailId = result.resendEmailId
  } catch (err) {
    status = 'failed'
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  await addBookingEmailLog({
    entityType: 'booking', entityId: id,
    toEmail: booking.email, subject, bodyHtml,
    templateId: template.id, templateSlug: template.slug,
    sentAt: new Date().toISOString(), resendEmailId, status, errorMessage,
  })

  if (status === 'failed') return NextResponse.json({ error: errorMessage }, { status: 500 })
  return NextResponse.json({ ok: true, resendEmailId })
}
