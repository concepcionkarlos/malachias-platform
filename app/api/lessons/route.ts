// Public intake for voice-lesson inquiries. Same defenses as the booking and
// sponsor forms: rate limit, honeypot, signed single-use captcha (issued by
// /api/booking/captcha), server-side validation. Stores the inquiry and emails
// the admin (best-effort). Never emails the address the visitor typed.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { sendAdminNotification } from '@/lib/emailService'
import { rateLimit } from '@/lib/rateLimit'
import { verifyChallenge, consumeChallengeNonce } from '@/lib/captcha'
import { LESSONS, type LessonInquiry, type LessonFormat } from '@/lib/lessons'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'lessons', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  if (body.company_url) return NextResponse.json({ ok: true }, { status: 201 }) // honeypot

  const captcha = verifyChallenge(body.captchaToken, body.captchaAnswer)
  if (!captcha.ok) return NextResponse.json({ error: 'Verification failed. Please reload and solve the math question.' }, { status: 400 })

  const name = str(body.name, 120)
  const email = str(body.email, 254).toLowerCase()
  const phone = str(body.phone, 40)
  const format = str(body.format, 20) as LessonFormat
  const county = str(body.county, 40)
  const goal = str(body.goal, 60)
  const message = str(body.message, 3000)
  const veteran = body.veteran === true

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (phone && phone.replace(/\D/g, '').length < 7) return NextResponse.json({ error: 'Phone number looks too short.' }, { status: 400 })
  if (!(LESSONS.formats as readonly string[]).includes(format)) return NextResponse.json({ error: 'Choose in person or Zoom.' }, { status: 400 })
  if (format === 'In person' && !LESSONS.inPersonCounties.includes(county)) {
    return NextResponse.json({ error: `In-person lessons are available in ${LESSONS.inPersonCounties.join(', ')} — or choose Zoom.` }, { status: 400 })
  }
  if (goal && !(LESSONS.goals as readonly string[]).includes(goal)) return NextResponse.json({ error: 'Please pick a goal from the list.' }, { status: 400 })
  if ((message.match(/https?:\/\//g) ?? []).length > 2) return NextResponse.json({ error: 'Too many links in the message.' }, { status: 400 })

  if (captcha.nonce && !(await consumeChallengeNonce(captcha.nonce))) {
    return NextResponse.json({ error: 'This form was already submitted. Please reload and try again.' }, { status: 400 })
  }

  const inquiry: LessonInquiry = {
    id: crypto.randomBytes(8).toString('hex'),
    name, email, phone, format, county: format === 'In person' ? county : '', goal, veteran, message,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  const store = await readContent()
  await writeContent({ lessonInquiries: [...(store.lessonInquiries ?? []), inquiry] })

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (adminEmail) await sendAdminNotification({
    toEmail: adminEmail,
    subject: `Voice lesson inquiry from ${name}`,
    bodyHtml: `<p><strong>${esc(name)}</strong> wants voice lessons — <strong>${esc(format)}</strong>${county ? ` (${esc(county)})` : ''}${veteran ? ' · veteran' : ''}.</p>
               <p>Email: ${esc(email)}${phone ? ` · Phone: ${esc(phone)}` : ''}${goal ? ` · Goal: ${esc(goal)}` : ''}</p>
               ${message ? `<p>${esc(message).replace(/\n/g, '<br>')}</p>` : ''}
               <p>Admin → Voice Lessons.</p>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 })
}
