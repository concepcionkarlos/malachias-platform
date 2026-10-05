// Promo / merch-discount signup endpoint (public, rate-limited: 3/min per client).
// POST: validates an email, and if it's neither an existing subscriber nor already
// pending, stores it as a pending subscriber with a confirmation token and sends a
// double opt-in verification email via Resend. The 15% off code is delivered only
// after the recipient confirms via /api/verify-email. Logs each send via addSentEmail.
import { NextRequest, NextResponse } from 'next/server'
import { updateContent } from '@/lib/store'
import { rateLimit } from '@/lib/rateLimit'
import { addSentEmail } from '@/lib/venueStore'
import { str } from '@/lib/str'
import { unsubscribeUrl } from '@/lib/unsubscribe'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.malachiasmusic.com'
const DISCOUNT = '15%'

// Double opt-in confirmation email. The 15% code is only delivered AFTER the
// recipient clicks this link (handled by /api/verify-email), which proves they
// own the address. This prevents anyone from adding arbitrary emails to the
// list or using us to relay mail to third parties.
function buildVerifyEmail(email: string, token: string): string {
  const verifyUrl = `${SITE_URL}/api/verify-email?token=${token}`
  const unsubUrl = unsubscribeUrl(email)
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
    <h1 style="margin:0 0 16px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">Confirm your email to unlock ${DISCOUNT} off.</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#444444;line-height:1.75;">
      You're one click away from the merch-launch deal. Confirm your email and we'll send your ${DISCOUNT} off code right away.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${verifyUrl}" style="display:inline-block;background:#c9a84c;padding:16px 40px;color:#030202;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">
        Confirm &amp; Get My Code →
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

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'promo', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const body = await req.json().catch(() => ({}))
  const email = str(body?.email, 300)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  const lowerEmail = email.toLowerCase()

  // Check + insert under the store lock so two quick signups can't drop each other.
  const { randomBytes } = await import('crypto')
  const token = randomBytes(32).toString('hex')
  let state = 'new' as 'subscribed' | 'pending' | 'new'
  await updateContent(store => {
    // Already a confirmed subscriber — don't re-send.
    if ((store.subscribers ?? []).some(s => s.email.toLowerCase() === lowerEmail)) { state = 'subscribed'; return null }
    // Already pending confirmation — don't send a second email.
    const pending = store.pendingSubscribers ?? []
    if (pending.some(p => p.email.toLowerCase() === lowerEmail)) { state = 'pending'; return null }
    // Store as pending (NOT a subscriber yet) with a confirmation token.
    return { pendingSubscribers: [...pending, { email: lowerEmail, token, createdAt: new Date().toISOString() }] }
  })
  if (state === 'subscribed') return NextResponse.json({ ok: true, pending: false })
  if (state === 'pending') return NextResponse.json({ ok: true, pending: true })

  // Send the confirmation email. The coupon itself is sent by /api/verify-email
  // once the link is clicked.
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const subject = 'Confirm your email to unlock your 15% off code'
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
