import { NextRequest, NextResponse } from 'next/server'
import { addInboundEmail, getVenues } from '@/lib/venueStore'
import { readContent } from '@/lib/store'

// Resend inbound email webhook — no auth required (validated by checking secret header)
export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (secret) {
    const sig = req.headers.get('svix-signature') ?? req.headers.get('webhook-signature')
    if (!sig || !sig.includes(secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const payload = await req.json()
  const { from, to, subject, text, html, messageId } = payload?.data ?? payload

  const fromEmail: string = typeof from === 'string' ? from.replace(/.*<(.+)>/, '$1') : ''
  const fromName: string = typeof from === 'string' && from.includes('<') ? from.split('<')[0].trim() : undefined as never

  // Try to match to a known booking or venue by email
  let entityType: 'booking' | 'venue' | 'song-request' | undefined
  let entityId: string | undefined

  try {
    const [content, venues] = await Promise.all([readContent(), getVenues()])
    const booking = content.bookingRequests.find((b) => b.email === fromEmail)
    if (booking) { entityType = 'booking'; entityId = booking.id }
    else {
      const venue = venues.find((v) => v.contactEmail === fromEmail)
      if (venue) { entityType = 'venue'; entityId = venue.id }
      else {
        const sr = content.songRequests.find((s) => s.email === fromEmail)
        if (sr) { entityType = 'song-request'; entityId = sr.id }
      }
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
