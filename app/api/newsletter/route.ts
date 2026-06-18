import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { addSentEmail } from '@/lib/venueStore'

const SITE_URL = 'https://www.malachiasmusic.com'
const DISCOUNT  = '15%'

function buildVerifyEmail(email: string, token: string): string {
  const verifyUrl = `${SITE_URL}/api/verify-email?token=${token}`
  const unsubUrl  = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
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
  <tr><td style="padding:40px;">
    <h1 style="margin:0 0 16px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">Confirm your spot.</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#444444;line-height:1.75;">
      You asked to join the Brotherhood List. One click confirms your spot and unlocks your ${DISCOUNT} off code.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${verifyUrl}" style="display:inline-block;background:#c9a84c;padding:16px 40px;color:#030202;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">
        Confirm My Spot →
      </a>
    </div>
    <p style="margin:0 0 8px;font-size:13px;color:#999999;line-height:1.6;">This link expires in 48 hours.</p>
    <p style="margin:0;font-size:11px;color:#cccccc;word-break:break-all;">Or paste: ${verifyUrl}</p>
  </td></tr>
  <tr><td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e8e0d5;">
    <p style="margin:0;font-size:11px;color:#999999;">
      If you didn't request this, ignore this email. &nbsp;·&nbsp;
      <a href="${unsubUrl}" style="color:#c9a84c;">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json({ subscribers: store.subscribers ?? [] })
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'newsletter', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const store = await readContent()
  const lowerEmail = (email as string).toLowerCase()

  // Already confirmed subscriber
  if ((store.subscribers ?? []).some(s => s.email.toLowerCase() === lowerEmail)) {
    return NextResponse.json({ ok: true, pending: false })
  }

  // Already pending — don't re-send
  const pending: { email: string; token: string; createdAt: string }[] =
    (store as any).pendingSubscribers ?? []
  if (pending.some(p => p.email.toLowerCase() === lowerEmail)) {
    return NextResponse.json({ ok: true, pending: true })
  }

  // Create token and store pending
  const { randomBytes } = await import('crypto')
  const token = randomBytes(32).toString('hex')
  await writeContent({
    pendingSubscribers: [...pending, { email: lowerEmail, token, createdAt: new Date().toISOString() }],
  } as any)

  // Send verification email
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const subject = 'Confirm your spot in the brotherhood'
    const bodyHtml = buildVerifyEmail(lowerEmail, token)
    const sentAt = new Date().toISOString()
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Malachias <hello@malachiasmusic.com>', to: [lowerEmail], subject, html: bodyHtml }),
    }).catch(() => null)
    const resData = res ? await res.json().catch(() => ({})) : {}
    await addSentEmail({ toEmail: lowerEmail, subject, bodyHtml, sentAt, resendEmailId: resData?.id, status: res?.ok ? 'sent' : 'failed' }).catch(() => {})
  }

  return NextResponse.json({ ok: true, pending: true })
}
