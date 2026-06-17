import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { rateLimit } from '@/lib/rateLimit'
import { addSentEmail } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.malachiasmusic.com'
const COUPON_CODE = 'MALACHIAS15'
const DISCOUNT = '15%'

function buildCouponEmail(email: string): string {
  const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#030202;padding:24px 40px;border-bottom:3px solid #c9a84c;">
        <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">MALACHIAS</p>
        <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Christian Rock · Veteran Mission · Faith on Fire</p>
      </td></tr>

      <!-- Hero -->
      <tr><td style="background:#030202;padding:36px 40px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);">You subscribed. Here's your code.</p>
        <h1 style="margin:0 0 16px;font-size:32px;color:#ffffff;letter-spacing:2px;font-family:Georgia,serif;">${DISCOUNT} OFF — FOR YOU</h1>
        <p style="margin:0 0 28px;font-size:14px;color:rgba(232,221,208,0.60);line-height:1.7;">
          Thank you for being here. Use this code at checkout<br>and get ${DISCOUNT} off your entire first order.
        </p>

        <!-- Big coupon code box -->
        <div style="display:inline-block;background:#c9a84c;padding:20px 40px;margin:0 0 28px;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#030202;font-weight:700;">Your discount code</p>
          <p style="margin:0;font-size:36px;font-weight:900;letter-spacing:6px;color:#030202;font-family:Georgia,serif;">${COUPON_CODE}</p>
        </div>

        <br>
        <a href="${SITE_URL}/merch" style="display:inline-block;background:transparent;border:2px solid #c9a84c;padding:14px 36px;color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-weight:700;">
          Shop the Store →
        </a>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;">
          The official Malachias merch store is live. You got here first — that matters.
        </p>
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;">
          No label. No compromise. Faith, freedom, and music made the way it was meant to be made.
        </p>
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;">
          When you wear Malachias, you carry the mission with you. Every show, every song, every stage we earn.
        </p>

        <!-- Divider -->
        <div style="border-top:1px solid #e8e0d5;margin:28px 0;"></div>

        <!-- Product highlights -->
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888888;">What's in the store</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 12px 8px 0;font-size:14px;color:#444444;border-bottom:1px solid #f0ede8;">☕ Support Mug</td>
            <td style="padding:8px 0;font-size:14px;color:#c9a84c;text-align:right;border-bottom:1px solid #f0ede8;">From $8.95</td>
          </tr>
          <tr>
            <td style="padding:8px 12px 8px 0;font-size:14px;color:#444444;border-bottom:1px solid #f0ede8;">🧢 Warrior Hat</td>
            <td style="padding:8px 0;font-size:14px;color:#c9a84c;text-align:right;border-bottom:1px solid #f0ede8;">$19.99</td>
          </tr>
          <tr>
            <td style="padding:8px 12px 8px 0;font-size:14px;color:#444444;border-bottom:1px solid #f0ede8;">🧢 Trucker Hat</td>
            <td style="padding:8px 0;font-size:14px;color:#c9a84c;text-align:right;border-bottom:1px solid #f0ede8;">$19.99</td>
          </tr>
          <tr>
            <td style="padding:8px 12px 8px 0;font-size:14px;color:#444444;">👕 Premium Tee</td>
            <td style="padding:8px 0;font-size:14px;color:#c9a84c;text-align:right;">From $34.99</td>
          </tr>
        </table>

        <div style="margin-top:28px;text-align:center;">
          <a href="${SITE_URL}/merch" style="display:inline-block;background:#c9a84c;padding:14px 36px;color:#030202;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-weight:700;">
            Use Code ${COUPON_CODE} at Checkout →
          </a>
        </div>

        <p style="margin:28px 0 0;font-size:15px;color:#444444;line-height:1.75;">
          God bless,<br><strong>Malachias</strong>
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e8e0d5;">
        <p style="margin:0 0 8px;font-size:11px;color:#999999;line-height:1.5;">
          Malachias · Miami, FL · USA · <a href="mailto:hello@malachiasmusic.com" style="color:#999999;">hello@malachiasmusic.com</a>
        </p>
        <p style="margin:0;font-size:11px;color:#999999;">
          You subscribed at <a href="${SITE_URL}" style="color:#999999;">malachiasmusic.com</a>.
          &nbsp;·&nbsp;
          <a href="${unsubUrl}" style="color:#c9a84c;">Unsubscribe</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'promo', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const { email } = await req.json().catch(() => ({}))
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)) || String(email).length > 254) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
  }

  // Save to newsletter list
  const store = await readContent()
  const subscribers = store.subscribers ?? []
  const already = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())
  if (!already) {
    await writeContent({
      subscribers: [...subscribers, { email: email.toLowerCase(), joinedAt: new Date().toISOString() }],
    })
  } else {
    // Don't send another coupon to existing subscribers — prevents email relay abuse
    return NextResponse.json({ ok: true, code: COUPON_CODE })
  }

  // Send coupon email via Resend (new subscribers only)
  const couponSubject = `Your ${DISCOUNT} off code — welcome to the mission 🎸`
  const couponHtml = buildCouponEmail(email)
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Malachias <hello@malachiasmusic.com>', to: [email], subject: couponSubject, html: couponHtml }),
  })

  const sentAt = new Date().toISOString()
  const resData = await emailRes.json().catch(() => ({}))
  await addSentEmail({ toEmail: email, subject: couponSubject, bodyHtml: couponHtml, sentAt, resendEmailId: resData?.id, status: emailRes.ok ? 'sent' : 'failed' }).catch(() => {})

  if (!emailRes.ok) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, code: COUPON_CODE })
}
