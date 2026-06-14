import { NextRequest, NextResponse } from 'next/server'
import { addInboundEmail } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? ''

    let fromRaw = ''
    let toEmail = 'booking@malachiasmusic.com'
    let subject = '(no subject)'
    let bodyHtml: string | undefined
    let bodyText: string | undefined
    let emailId: string | undefined
    let receivedAt = new Date().toISOString()

    if (contentType.includes('application/json')) {
      const payload = await req.json()

      if (payload.fromEmail) {
        // Google Apps Script format — full body included
        fromRaw = payload.fromEmail ?? ''
        toEmail = payload.toEmail ?? toEmail
        subject = payload.subject ?? subject
        bodyHtml = payload.bodyHtml || undefined
        bodyText = payload.bodyText || undefined
        receivedAt = payload.receivedAt ?? receivedAt
        emailId = payload.gmailMessageId
      } else {
        // Resend format (envelope only — no body)
        const data = payload.data ?? payload
        fromRaw = data.from ?? ''
        const toRaw = data.to ?? []
        toEmail = Array.isArray(toRaw) ? (toRaw[0] ?? toEmail) : (toRaw || toEmail)
        subject = data.subject ?? subject
        emailId = data.email_id ?? data.id
        receivedAt = data.created_at ?? receivedAt
      }
    } else {
      // Mailgun / form-data format
      const form = await req.formData()
      const get = (key: string) => (form.get(key) as string | null) ?? undefined

      fromRaw = get('from') ?? get('sender') ?? ''
      toEmail = get('recipient') ?? toEmail
      subject = get('subject') ?? subject
      emailId = get('Message-Id') ?? get('message-id')
      receivedAt = new Date((parseInt(get('timestamp') ?? '0') || Date.now() / 1000) * 1000).toISOString()
      bodyHtml = get('stripped-html') ?? get('body-html')
      bodyText = get('stripped-text') ?? get('body-plain')
    }

    // Parse "Name <email>" format
    const fromMatch = fromRaw.match(/^(?:"?([^"<]*)"?\s*)?<?([^>@]+@[^>]+)>?$/)
    const fromName = fromMatch?.[1]?.trim() || undefined
    const fromEmail = fromMatch?.[2]?.trim() ?? fromRaw

    await addInboundEmail({
      fromEmail,
      fromName,
      toEmail,
      subject,
      bodyHtml,
      bodyText,
      receivedAt,
      read: false,
      resendMessageId: emailId,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Inbound webhook error:', err)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
