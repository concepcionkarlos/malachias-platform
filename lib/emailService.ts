// emailService.ts — All outbound email logic via Resend
// Missing RESEND_API_KEY falls back to DEV_MODE (console logging only)

import type { BookingRequest } from './data'
import {
  getAutoReplyLogForBooking,
  addAutoReplyLog,
  updateAutoReplyLog,
  getTemplateBySlug,
  addSentEmail,
} from './venueStore'
import { renderTemplate } from './templateUtils'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Malachias <booking@malachiasmusic.com>'
const BCC  = 'booking@malachiasmusic.com'
const DEV_MODE = !process.env.RESEND_API_KEY

export async function triggerAutoReply(booking: BookingRequest): Promise<void> {
  const existing = await getAutoReplyLogForBooking(booking.id)
  if (existing && (existing.status === 'scheduled' || existing.status === 'sent')) return

  const scheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
  const log = await addAutoReplyLog({ bookingId: booking.id, scheduledAt, status: 'scheduled' })

  if (DEV_MODE) {
    console.log(`[auto-reply][DEV] Would send to ${booking.email} for booking ${booking.id}`)
    await updateAutoReplyLog(log.id, { status: 'sent', sentAt: new Date().toISOString() })
    return
  }

  const template = await getTemplateBySlug('booking-auto-reply')
  if (!template) {
    await updateAutoReplyLog(log.id, { status: 'failed', errorMessage: 'Template not found' })
    return
  }

  const clientName = booking.fullName.split(' ')[0] || booking.fullName
  const { subject, bodyHtml } = renderTemplate(template, {
    clientName,
    eventDate: booking.eventDate || '(date not specified)',
    eventType: booking.eventType || 'your event',
    bandName: 'Malachias',
  })

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({ from: FROM, to: booking.email, bcc: BCC, subject, html: bodyHtml, scheduledAt })
    await updateAutoReplyLog(log.id, { resendEmailId: result.data?.id, status: 'scheduled', scheduledAt })
    await addSentEmail({ toEmail: booking.email, subject, bodyHtml, sentAt: scheduledAt, resendEmailId: result.data?.id, status: 'sent' }).catch(() => {})
  } catch (err) {
    await updateAutoReplyLog(log.id, { status: 'failed', errorMessage: err instanceof Error ? err.message : String(err) })
  }
}

export async function sendAdminNotification(opts: { toEmail: string; subject: string; bodyHtml: string }): Promise<void> {
  if (DEV_MODE) {
    console.log(`[admin-notify][DEV] Would send to ${opts.toEmail}: ${opts.subject}`)
    return
  }
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: FROM, to: opts.toEmail, subject: opts.subject, html: opts.bodyHtml })
  } catch { /* intentionally ignored */ }
}

export async function sendOutreachEmail(opts: {
  toEmail: string; subject: string; bodyHtml: string; replyTo?: string
}): Promise<{ resendEmailId?: string }> {
  if (DEV_MODE) {
    console.log(`[outreach][DEV] Would send to ${opts.toEmail}: ${opts.subject}`)
    return { resendEmailId: `dev-${Date.now()}` }
  }
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from: FROM,
    to: opts.toEmail,
    bcc: BCC,
    subject: opts.subject,
    html: opts.bodyHtml,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  })
  await addSentEmail({ toEmail: opts.toEmail, subject: opts.subject, bodyHtml: opts.bodyHtml, sentAt: new Date().toISOString(), resendEmailId: result.data?.id, status: 'sent' }).catch(() => {})
  return { resendEmailId: result.data?.id }
}
