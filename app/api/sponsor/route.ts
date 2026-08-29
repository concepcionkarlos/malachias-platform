// Public sponsor-inquiry intake for the Road to San Antonio campaign. Same defenses
// as the booking form: rate limit (5/min per client), honeypot, signed single-use
// captcha (issued by /api/booking/captcha), server-side validation. Saves the
// inquiry to the content store and emails the admin (best-effort). Never sends
// mail to the address the visitor typed.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { sendAdminNotification } from '@/lib/emailService'
import { rateLimit } from '@/lib/rateLimit'
import { verifyChallenge, consumeChallengeNonce } from '@/lib/captcha'
import { SPONSOR_LEVEL_OPTIONS, type SponsorInquiry } from '@/lib/campaign'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'sponsor', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  // Honeypot — the visible form has a real "Website" field, so this one is named differently.
  if (body.company_url) return NextResponse.json({ ok: true }, { status: 201 })

  const captcha = verifyChallenge(body.captchaToken, body.captchaAnswer)
  if (!captcha.ok) {
    return NextResponse.json({ error: 'Verification failed. Please reload and solve the math question.' }, { status: 400 })
  }

  const name = str(body.name, 120)
  const organization = str(body.organization, 160)
  const email = str(body.email, 254).toLowerCase()
  const phone = str(body.phone, 40)
  let website = str(body.website, 200)
  const level = str(body.level, 60)
  const message = str(body.message, 4000)

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  if (organization.length < 2) return NextResponse.json({ error: 'Please enter your business or organization.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (phone && phone.replace(/\D/g, '').length < 7) return NextResponse.json({ error: 'Phone number looks too short.' }, { status: 400 })
  if (website) {
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`
    try { new URL(website) } catch { return NextResponse.json({ error: 'Website address is not valid.' }, { status: 400 }) }
  }
  if (!(SPONSOR_LEVEL_OPTIONS as readonly string[]).includes(level)) {
    return NextResponse.json({ error: 'Please choose a sponsorship level.' }, { status: 400 })
  }
  if (message.length > 0 && message.length < 10) return NextResponse.json({ error: 'Message is too short.' }, { status: 400 })
  if ((message.match(/https?:\/\//g) ?? []).length > 2) return NextResponse.json({ error: 'Too many links in the message.' }, { status: 400 })

  if (captcha.nonce && !(await consumeChallengeNonce(captcha.nonce))) {
    return NextResponse.json({ error: 'This form was already submitted. Please reload and try again.' }, { status: 400 })
  }

  const inquiry: SponsorInquiry = {
    id: crypto.randomBytes(8).toString('hex'),
    name, organization, email, phone, website, level, message,
    status: 'new',
    createdAt: new Date().toISOString(),
  }

  const store = await readContent()
  await writeContent({ sponsorInquiries: [...(store.sponsorInquiries ?? []), inquiry] })

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (adminEmail) await sendAdminNotification({
    toEmail: adminEmail,
    subject: `Road to San Antonio — sponsor inquiry from ${organization}`,
    bodyHtml: `<p><strong>${esc(name)}</strong> at <strong>${esc(organization)}</strong> wants to talk about <strong>${esc(level)}</strong>.</p>
               <p>Email: ${esc(email)}${phone ? ` · Phone: ${esc(phone)}` : ''}${website ? ` · Site: ${esc(website)}` : ''}</p>
               ${message ? `<p>${esc(message).replace(/\n/g, '<br>')}</p>` : ''}
               <p>Open the admin → Road to San Antonio → Sponsor inquiries.</p>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 })
}
