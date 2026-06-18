// Public newsletter double-opt-in confirmation endpoint (no auth; validated by token).
// GET: looks up the ?token in pendingSubscribers, enforcing a 48h TTL; on valid token it
// promotes the email to subscribers, enrolls it in the drip queue, and sends a welcome/coupon
// email via Resend, then redirects to /verified (with email or an error code).
import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { addSentEmail } from '@/lib/venueStore'

const SITE_URL = 'https://www.malachiasmusic.com'
const COUPON_CODE = 'MALACHIAS15'
const DISCOUNT = '15%'
const TTL_MS = 48 * 60 * 60 * 1000 // 48 hours

function buildWelcomeHtml(email: string): string {
  const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
  <tr><td style="background:#030202;padding:24px 40px;border-bottom:3px solid #c9a84c;">
    <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">MALACHIAS</p>
    <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Christian Rock · Veteran Mission · Faith on Fire</p>
  </td></tr>
  <tr><td style="background:#030202;padding:36px 40px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);">You're in. Here's your code.</p>
    <h1 style="margin:0 0 16px;font-size:28px;color:#ffffff;letter-spacing:2px;font-family:Georgia,serif;">${DISCOUNT} OFF — FOR YOU</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(232,221,208,0.55);line-height:1.7;">
      Welcome to the brotherhood. Use this at checkout — your first order, ${DISCOUNT} off.
    </p>
    <div style="display:inline-block;background:#c9a84c;padding:20px 40px;margin:0 0 28px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#030202;font-weight:700;">Your code</p>
      <p style="margin:0;font-size:36px;font-weight:900;letter-spacing:6px;color:#030202;font-family:Georgia,serif;">${COUPON_CODE}</p>
    </div>
    <br>
    <a href="${SITE_URL}/merch" style="display:inline-block;background:transparent;border:2px solid #c9a84c;padding:14px 36px;color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-weight:700;">Shop the Store →</a>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;">No label. No compromise. Faith, freedom, and music made the way it was meant to be made.</p>
    <p style="margin:0 0 20px;font-size:15px;color:#444444;line-height:1.75;">God bless,<br><strong>Malachias</strong></p>
  </td></tr>
  <tr><td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e8e0d5;">
    <p style="margin:0;font-size:11px;color:#999999;">
      You confirmed your subscription at <a href="${SITE_URL}" style="color:#999999;">malachiasmusic.com</a>.
      &nbsp;·&nbsp;<a href="${unsubUrl}" style="color:#c9a84c;">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(`${SITE_URL}/verified?error=missing`)

  const store = await readContent()
  const pending: { email: string; token: string; createdAt: string }[] =
    (store as any).pendingSubscribers ?? []

  const entry = pending.find(p => p.token === token)
  if (!entry) return NextResponse.redirect(`${SITE_URL}/verified?error=invalid`)

  // Check TTL
  if (Date.now() - new Date(entry.createdAt).getTime() > TTL_MS) {
    // Remove expired entry
    await writeContent({ pendingSubscribers: pending.filter(p => p.token !== token) } as any)
    return NextResponse.redirect(`${SITE_URL}/verified?error=expired`)
  }

  const { email } = entry

  // Check if already a subscriber (double-click protection)
  const subscribers = store.subscribers ?? []
  if (!subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    await writeContent({
      subscribers: [...subscribers, { email: email.toLowerCase(), joinedAt: new Date().toISOString() }],
      pendingSubscribers: pending.filter(p => p.token !== token),
    } as any)

    // Enroll in drip
    const dripQueue = (store as any).subscriberDrip ?? []
    const alreadyInDrip = dripQueue.some((e: { email: string }) => e.email.toLowerCase() === email.toLowerCase())
    if (!alreadyInDrip && dripQueue.length < 5000) {
      await writeContent({
        subscriberDrip: [...dripQueue, { email: email.toLowerCase(), subscribedAt: new Date().toISOString(), day3Sent: false, day7Sent: false }],
      } as any)
    }

    // Send welcome email
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const subject = `Welcome to the brotherhood — your ${DISCOUNT} code inside`
      const bodyHtml = buildWelcomeHtml(email)
      const sentAt = new Date().toISOString()
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'Malachias <hello@malachiasmusic.com>', to: [email], subject, html: bodyHtml }),
      }).catch(() => null)
      const resData = res ? await res.json().catch(() => ({})) : {}
      await addSentEmail({ toEmail: email, subject, bodyHtml, sentAt, resendEmailId: resData?.id, status: res?.ok ? 'sent' : 'failed' }).catch(() => {})
    }
  } else {
    // Already subscribed — just remove pending
    await writeContent({ pendingSubscribers: pending.filter(p => p.token !== token) } as any)
  }

  return NextResponse.redirect(`${SITE_URL}/verified?email=${encodeURIComponent(email)}`)
}
