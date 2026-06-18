// Admin API for detecting spam/bot newsletter subscribers (auth required on all methods).
// GET: scores every subscriber email against disposable/placeholder domains, suspicious TLDs,
// bot prefixes, keyboard-mash and numeric/random patterns; returns ranked candidates with severity.
// DELETE: bulk-removes subscribers by an array of emails from the content store.
import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticatedFromRequest } from '@/lib/auth'

export interface SubSpamCandidate {
  email: string
  joinedAt: string
  score: number
  flags: string[]
  severity: 'high' | 'medium' | 'low'
}

// ── Domain lists ─────────────────────────────────────────────────────────────

const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.biz',
  'tempmail.com', 'temp-mail.org', 'throwam.com', 'yopmail.com', 'yopmail.fr',
  'sharklasers.com', 'spam4.me', 'trashmail.com', 'trashmail.net', 'trashmail.io',
  'dispostable.com', 'mailnull.com', 'maildrop.cc', 'fakeinbox.com',
  'mailnesia.com', 'discard.email', 'spamspot.com', '10minutemail.com',
  'mintemail.com', 'mytrashmail.com', 'one-time.email', 'oneoffmail.com',
  'mt2014.com', 'mt2015.com', 'spamgourmet.com', 'spam.la',
  'getnada.com', 'mail-temp.com', 'binkmail.com', 'safetymail.info',
  'spamevader.com', 'wegwerfmail.de', 'filzmail.com', 'jetable.fr.nf',
  'spamfree24.org', 'trashdevil.com', 'mailscrap.com', 'throwam.com',
  'inboxkitten.com', 'tempinbox.com', 'fakemailgenerator.com',
])

const PLACEHOLDER_DOMAINS = new Set([
  'example.com', 'test.com', 'fake.com', 'email.com', 'nomail.com',
  'noemail.com', 'abc.com', 'xyz.com', '123.com', 'domain.com',
  'sample.com', 'website.com', 'yoursite.com', 'mysite.com',
])

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.click', '.loan', '.gq', '.ml', '.ga', '.cf', '.tk',
  '.pw', '.win', '.bid', '.stream', '.download', '.icu', '.buzz',
])

const KB_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

const BOT_PREFIXES = /^(test|admin|user|noreply|no-reply|example|fake|spam|temp|dummy|null|void|bot|robot|info|contact|mail|email|hello|nobody|someone|anonymous|asdf|qwerty|abcd)\d*$/

// ── Core scoring ─────────────────────────────────────────────────────────────

interface Flag { msg: string; weight: number }

function scoreEmail(email: string): Flag[] {
  const flags: Flag[] = []
  const lower = email.toLowerCase().trim()
  const atIdx = lower.indexOf('@')

  // No @ or starts with @
  if (atIdx < 1) {
    flags.push({ msg: 'Not a valid email address', weight: 10 })
    return flags
  }

  const local = lower.slice(0, atIdx)
  const domain = lower.slice(atIdx + 1)
  const domainParts = domain.split('.')
  const tld = '.' + domainParts[domainParts.length - 1]
  const domainBase = domainParts[0]

  // ── Domain checks ────────────────────────────────────────────────────────

  if (DISPOSABLE.has(domain)) flags.push({ msg: 'Disposable email service', weight: 5 })
  if (PLACEHOLDER_DOMAINS.has(domain)) flags.push({ msg: 'Placeholder/fake domain', weight: 5 })
  if (SUSPICIOUS_TLDS.has(tld)) flags.push({ msg: `Suspicious TLD (${tld})`, weight: 3 })
  if (domainBase.length <= 1) flags.push({ msg: 'Domain name is a single character', weight: 4 })
  if (!domain.includes('.')) flags.push({ msg: 'Domain has no TLD', weight: 5 })

  // ── Local part checks ────────────────────────────────────────────────────

  if (local.length <= 1) flags.push({ msg: 'Email local part too short (1 char)', weight: 4 })
  if (local.length <= 3) flags.push({ msg: 'Email local part very short', weight: 2 })

  // All digits — phone number or random number in email field
  if (/^\d+$/.test(local)) {
    flags.push({ msg: 'Local part is entirely numbers (phone number as email?)', weight: 5 })
  }

  // Very high digit ratio
  const digits = (local.match(/\d/g) ?? []).length
  const digitRatio = digits / local.length
  if (local.length >= 4 && digitRatio >= 0.8 && !/^\d+$/.test(local)) {
    flags.push({ msg: 'Local part is mostly numbers', weight: 3 })
  } else if (local.length >= 6 && digitRatio >= 0.6) {
    flags.push({ msg: 'High number of digits in email', weight: 2 })
  }

  // Local mirrors domain base (gmail@gmail.com)
  if (local === domainBase) flags.push({ msg: 'Local part mirrors domain (e.g. gmail@gmail.com)', weight: 4 })

  // Bot/test prefixes
  if (BOT_PREFIXES.test(local)) flags.push({ msg: 'Bot or test email prefix', weight: 4 })

  // Keyboard mash
  const localAlpha = local.replace(/[^a-z]/g, '')
  for (const row of KB_ROWS) {
    let streak = 0
    for (const ch of localAlpha) {
      streak = row.includes(ch) ? streak + 1 : 0
      if (streak >= 4) { flags.push({ msg: 'Keyboard mash pattern detected', weight: 4 }); break }
    }
    if (flags.some(f => f.msg.includes('mash'))) break
  }

  // All same letter (aaaa@, 1111@)
  const noSep = local.replace(/[._-]/g, '')
  if (noSep.length >= 3 && new Set(noSep.split('')).size === 1) {
    flags.push({ msg: 'Local part is one repeated character', weight: 5 })
  }

  // Very few unique chars overall (aabbaabb@)
  if (local.length >= 6 && new Set(local.replace(/[._-]/g, '').split('')).size <= 2) {
    flags.push({ msg: 'Local part uses only 1-2 unique characters', weight: 3 })
  }

  // Sequential digit run (12345, 98765)
  const digitStr = local.replace(/\D/g, '')
  if (digitStr.length >= 5) {
    const asc = digitStr.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] + 1)
    const desc = digitStr.split('').every((d, i, a) => i === 0 || +d === +a[i - 1] - 1)
    if (asc || desc) flags.push({ msg: 'Sequential digit sequence (e.g. 12345, 98765)', weight: 3 })
  }

  // Alternating letter-digit (a1b2c3d4) — bot-generated pattern
  if (local.length >= 8 && /^([a-z]\d){3,}$|^(\d[a-z]){3,}$/.test(local)) {
    flags.push({ msg: 'Alternating letter-digit pattern (bot-generated)', weight: 4 })
  }

  // Long + high entropy = randomly generated
  if (local.length >= 16 && new Set(local.replace(/[^a-z0-9]/g, '')).size >= 10) {
    flags.push({ msg: 'Long random-looking address', weight: 2 })
  }

  // Trailing long digit string (name12345678)
  if (/[a-z]{2,}\d{6,}$/.test(local)) {
    flags.push({ msg: 'Long digit suffix (e.g. john12345678)', weight: 3 })
  }

  // Domain is just digits (123@456789.com)
  if (/^\d+$/.test(domainBase)) {
    flags.push({ msg: 'Domain name is all numbers', weight: 4 })
  }

  return flags
}

function toCandidate(email: string, joinedAt: string): SubSpamCandidate {
  const flagObjs = scoreEmail(email)
  const score = flagObjs.reduce((sum, f) => sum + f.weight, 0)
  const flags = flagObjs.map(f => f.msg)
  const severity: SubSpamCandidate['severity'] =
    score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low'
  return { email, joinedAt, score, flags, severity }
}

// ── GET — scan all subscribers ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await readContent()
  const subscribers = store.subscribers ?? []

  const all = subscribers.map(s => toCandidate(s.email, s.joinedAt))
  const candidates = all.filter(c => c.score > 0).sort((a, b) => b.score - a.score)

  // Detect bot floods: many signups within 10 minutes of each other
  const times = subscribers.map(s => new Date(s.joinedAt).getTime()).sort((a, b) => a - b)
  let burstStart = -1
  const burstEmails = new Set<string>()
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] < 10 * 60 * 1000) {
      if (burstStart < 0) burstStart = i - 1
    } else {
      burstStart = -1
    }
  }
  if (burstEmails.size > 0) {
    candidates.forEach(c => {
      if (burstEmails.has(c.email)) c.flags.push('Part of a rapid-signup burst (possible bot flood)')
    })
  }

  return NextResponse.json({ candidates, total: subscribers.length, all })
}

// ── DELETE — bulk remove by email array ─────────────────────────────────────

export async function DELETE(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { emails } = await req.json() as { emails: string[] }
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: 'No emails provided' }, { status: 400 })
  }

  const store = await readContent()
  const emailSet = new Set(emails.map(e => e.toLowerCase()))
  const remaining = (store.subscribers ?? []).filter(s => !emailSet.has(s.email.toLowerCase()))
  await writeContent({ subscribers: remaining })

  return NextResponse.json({ ok: true, removed: emails.length, remaining: remaining.length })
}
