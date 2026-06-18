// API route: inbound-email webhook (e.g. Resend).
// POST authenticates via a shared webhook secret (Bearer or x-webhook-secret
// header), parses the incoming email, attempts to match the sender to a known
// booking request or venue by email, and stores it as an unread inbound message.
import { NextRequest, NextResponse } from 'next/server'
import { addInboundEmail, getVenues } from '@/lib/venueStore'
import { readContent } from '@/lib/store'
import { verifyWebhookSecret } from '@/lib/webhookAuth'

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  const authHeader = req.headers.get('authorization') ?? ''
  const provided = authHeader.replace(/^Bearer\s+/i, '') || (req.headers.get('x-webhook-secret') ?? '')
  if (!verifyWebhookSecret(provided, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await req.json()
  const { from, to, subject, text, html, messageId } = payload?.data ?? payload

  const fromEmail: string = typeof from === 'string' ? from.replace(/.*<(.+)>/, '$1') : ''
  const fromName: string = typeof from === 'string' && from.includes('<') ? from.split('<')[0].trim() : undefined as never

  // Try to match to a known booking or venue by email
  let entityType: 'booking' | 'venue' | undefined
  let entityId: string | undefined

  try {
    const [content, venues] = await Promise.all([readContent(), getVenues()])
    const booking = content.bookingRequests.find((b) => b.email === fromEmail)
    if (booking) { entityType = 'booking'; entityId = booking.id }
    else {
      const venue = venues.find((v) => v.contactEmail === fromEmail)
      if (venue) { entityType = 'venue'; entityId = venue.id }
    }
  } catch { /* best effort */ }

  await addInboundEmail({
    fromEmail, fromName: fromName || undefined,
    toEmail: Array.isArray(to) ? to[0] : to ?? '',
    subject: subject ?? '(no subject)',
    bodyText: text ?? undefined, bodyHtml: html ?? undefined,
    receivedAt: new Date().toISOString(),
    entityType, entityId, read: false,
    resendMessageId: messageId ?? undefined,
  })

  return NextResponse.json({ ok: true })
}
