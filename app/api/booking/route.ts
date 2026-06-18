// Public booking-request intake API. POST is rate-limited (5 req/min per
// client) and protected by a honeypot field plus a signed, single-use captcha
// (verified up front but only consumed after all validation passes). It
// validates name/email/phone/message quality, persists the new booking to the
// content store, then fires the applicant auto-reply, booking drip enrollment,
// and an admin notification email (all best-effort). Returns 201 with the id.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { triggerAutoReply, sendAdminNotification } from '@/lib/emailService'
import { enrollInBookingDrip } from '@/lib/venueStore'
import { rateLimit } from '@/lib/rateLimit'
import { verifyChallenge, consumeChallengeNonce } from '@/lib/captcha'
import type { BookingRequest } from '@/lib/data'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ── Validators ────────────────────────────────────────────────────────────────

function validatePhone(phone: string): string | null {
  if (!phone.trim()) return null // optional
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return 'Phone number is too short.'
  if (digits.length > 15) return 'Phone number is too long.'
  // All same digit or only 2 unique digits (e.g. 1212121212)
  if (new Set(digits.split('')).size <= 2) return 'Phone number is not valid.'
  // Sequential ascending (1234567890) or descending
  const asc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] + 1)
  const desc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] - 1)
  if (asc || desc) return 'Phone number is not valid.'
  return null
}

function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length < 2) return 'Name is too short.'
  if (trimmed.length > 120) return 'Name is too long.'
  // All numbers
  if (/^\d+$/.test(trimmed)) return 'Name cannot be only numbers.'
  // All the same character
  if (new Set(trimmed.toLowerCase().replace(/\s/g, '').split('')).size <= 1) return 'Please enter a real name.'
  // Keyboard-row mashing (asdf, qwerty, hjkl…): flag a run of 4+ letters that
  // appear CONSECUTIVELY in a keyboard row (forward or reversed). The previous
  // check counted any letters that merely belonged to the row, which rejected
  // real names like "Tyler Powers" or "Pastor Williams" (e,r,t,y,u,i,o,p are
  // common letters that all live on the top row).
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const lower = trimmed.toLowerCase().replace(/[^a-z]/g, '')
  for (const row of rows) {
    const rev = [...row].reverse().join('')
    for (let i = 0; i + 4 <= lower.length; i++) {
      const seg = lower.slice(i, i + 4)
      if (row.includes(seg) || rev.includes(seg)) return 'Please enter a real name.'
    }
  }
  return null
}

function validateMessage(msg: string): string | null {
  const trimmed = msg.trim()
  if (trimmed.length < 20) return 'Message is too short. Please describe the event.'
  if (trimmed.length > 4000) return 'Message is too long.'
  // All caps
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return 'Please don\'t write in all caps.'
  // Highly repeated words (spam / gibberish)
  const words = trimmed.split(/\s+/)
  const unique = new Set(words.map(w => w.toLowerCase()))
  if (words.length > 5 && unique.size / words.length < 0.3) return 'Message looks like repeated text.'
  // Too many URLs
  const urlCount = (trimmed.match(/https?:\/\//g) ?? []).length
  if (urlCount > 2) return 'Too many links in the message.'
  return null
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'booking', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  const body = await req.json()
  const {
    fullName, venueOrOrg, email, phone, eventDate, city,
    eventType, budgetRange, guestCount, message,
    website, captchaToken, captchaAnswer,
  } = body

  // Honeypot — bots fill this, humans never see it
  if (website) return NextResponse.json({ ok: true }, { status: 201 })

  // Human verification — the challenge is server-issued and signed, so the
  // answer alone can't be forged. We verify the signature/answer here but only
  // CONSUME the single-use token at the very end, so a fixable validation error
  // (bad phone, short message…) doesn't burn the captcha and trap the user.
  const captcha = verifyChallenge(captchaToken, captchaAnswer)
  if (!captcha.ok) {
    return NextResponse.json({ error: 'Verification failed. Please reload and solve the math question.' }, { status: 400 })
  }

  // Required fields
  if (!fullName || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  // Email format + length cap (RFC 5321)
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Field quality checks
  const nameErr = validateName(fullName)
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 })

  const phoneErr = validatePhone(phone ?? '')
  if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 })

  const msgErr = validateMessage(message)
  if (msgErr) return NextResponse.json({ error: msgErr }, { status: 400 })

  // All checks passed — now spend the single-use captcha token (anti-replay).
  if (captcha.nonce && !(await consumeChallengeNonce(captcha.nonce))) {
    return NextResponse.json({ error: 'This form was already submitted. Please reload and try again.' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const booking: BookingRequest = {
    id: crypto.randomBytes(8).toString('hex'),
    fullName: fullName.trim(), venueOrOrg: (venueOrOrg ?? '').trim(), email: email.trim().toLowerCase(),
    phone: (phone ?? '').trim(), eventDate: eventDate ?? '', city: (city ?? '').trim(),
    eventType: eventType ?? '', budgetRange: (budgetRange ?? '').trim(),
    guestCount: (guestCount ?? '').trim(), message: message.trim(),
    source: 'website', status: 'New',
    createdAt: now, updatedAt: now,
  }

  const store = await readContent()
  await writeContent({ bookingRequests: [...store.bookingRequests, booking] })

  await triggerAutoReply(booking).catch(() => {})
  await enrollInBookingDrip(booking).catch(() => {})

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (adminEmail) await sendAdminNotification({
    toEmail: adminEmail,
    subject: `New booking request from ${fullName}`,
    bodyHtml: `<p>New booking request received from <strong>${esc(fullName)}</strong> (${esc(email)}).</p>
               <p>Event: ${esc(eventType ?? '')} on ${esc(eventDate ?? '')} in ${esc(city ?? '')}</p>
               <p>Budget: ${esc(budgetRange ?? '')} | Guests: ${esc(guestCount ?? '')}</p>
               <p>Message: ${esc(message ?? '')}</p>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: booking.id }, { status: 201 })
}
