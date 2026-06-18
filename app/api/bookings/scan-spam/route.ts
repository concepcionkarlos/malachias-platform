// API route for spam triage of booking requests.
// GET: requires an authenticated session; heuristically scores each booking (name/phone/
// message/email checks) and returns flagged candidates sorted by score, plus total count.
// DELETE: requires an authenticated session; bulk-deletes bookings by an array of ids and
// returns deleted/remaining counts.
import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import type { BookingRequest } from '@/lib/data'

// ── Spam scoring ──────────────────────────────────────────────────────────────

interface SpamFlag { reason: string; severity: 'high' | 'medium' }

function spamFlags(b: BookingRequest): SpamFlag[] {
  const flags: SpamFlag[] = []
  const name = b.fullName.trim()
  const phone = b.phone.trim()
  const msg = b.message.trim()
  const email = b.email.trim()

  // Name checks
  if (name.length < 2) flags.push({ reason: 'Name too short', severity: 'high' })
  if (/^\d+$/.test(name)) flags.push({ reason: 'Name is only numbers', severity: 'high' })
  if (new Set(name.toLowerCase().replace(/\s/g, '').split('')).size <= 1 && name.length > 1)
    flags.push({ reason: 'Name is repeated character', severity: 'high' })
  const kbRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const lname = name.toLowerCase().replace(/\s/g, '')
  for (const row of kbRows) {
    let streak = 0
    for (const ch of lname) { streak = row.includes(ch) ? streak + 1 : 0; if (streak >= 4) { flags.push({ reason: 'Name looks like keyboard mash', severity: 'high' }); break } }
  }

  // Phone checks
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7) flags.push({ reason: 'Phone too short', severity: 'medium' })
    else if (digits.length > 15) flags.push({ reason: 'Phone too long', severity: 'medium' })
    else if (new Set(digits.split('')).size <= 2) flags.push({ reason: 'Phone is repeated/alternating digits', severity: 'high' })
    else {
      const asc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] + 1)
      const desc = digits.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] - 1)
      if (asc || desc) flags.push({ reason: 'Phone is sequential digits', severity: 'high' })
    }
  }

  // Message checks
  if (msg.length < 15) flags.push({ reason: 'Message too short', severity: 'high' })
  if (msg === msg.toUpperCase() && /[A-Z]/.test(msg)) flags.push({ reason: 'Message is all caps', severity: 'medium' })
  const words = msg.split(/\s+/)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()))
  if (words.length > 4 && uniqueWords.size / words.length < 0.3) flags.push({ reason: 'Message is repeated text', severity: 'high' })
  const urlCount = (msg.match(/https?:\/\//g) ?? []).length
  if (urlCount > 2) flags.push({ reason: `Message has ${urlCount} links`, severity: 'high' })
  // Keyboard mash in message
  for (const row of kbRows) {
    let streak = 0
    const lmsg = msg.toLowerCase().replace(/\s/g, '')
    for (const ch of lmsg) { streak = row.includes(ch) ? streak + 1 : 0; if (streak >= 6) { flags.push({ reason: 'Message contains keyboard mash', severity: 'high' }); break } }
  }

  // Email checks
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) flags.push({ reason: 'Invalid email format', severity: 'high' })
  if (/test@|fake@|spam@|noreply@|nobody@/.test(email.toLowerCase())) flags.push({ reason: 'Suspicious email address', severity: 'medium' })
  if (/\.test$|\.fake$|\.invalid$/.test(email.toLowerCase())) flags.push({ reason: 'Invalid email domain', severity: 'high' })

  // Already marked spam
  if (b.status === 'Spam') flags.push({ reason: 'Manually marked Spam', severity: 'high' })

  return flags
}

export interface SpamCandidate {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  message: string
  createdAt: string
  flags: SpamFlag[]
  score: number
}

// GET — return flagged bookings for review
export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await readContent()
  const bookings = store.bookingRequests ?? []

  const candidates: SpamCandidate[] = bookings
    .map(b => {
      const flags = spamFlags(b)
      const score = flags.reduce((s, f) => s + (f.severity === 'high' ? 2 : 1), 0)
      return { id: b.id, fullName: b.fullName, email: b.email, phone: b.phone, city: b.city, message: b.message, createdAt: b.createdAt, flags, score }
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ candidates, total: bookings.length })
}

// DELETE — bulk delete a list of IDs
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json() as { ids: string[] }
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'ids required' }, { status: 400 })

  const store = await readContent()
  const before = (store.bookingRequests ?? []).length
  const bookingRequests = (store.bookingRequests ?? []).filter(b => !ids.includes(b.id))
  await writeContent({ bookingRequests })

  return NextResponse.json({ deleted: before - bookingRequests.length, remaining: bookingRequests.length })
}
