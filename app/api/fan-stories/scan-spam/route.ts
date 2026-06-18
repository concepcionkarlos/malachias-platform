// API route: fan-story spam scanning.
// GET (admin-auth via request header) heuristically scores every fan story for
// spam (disposable domains, suspicious TLDs, keyboard mashing, promo language,
// gibberish, etc.) and returns flagged candidates sorted by score. DELETE
// (admin-auth required) bulk-removes stories by an {ids} array.
import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import type { FanStory } from '@/lib/data'

export interface FanStorySpamCandidate {
  id: string
  name: string
  email?: string
  story: string
  songTitle?: string
  status: FanStory['status']
  createdAt: string
  score: number
  flags: string[]
}

// ── Disposable email domains ─────────────────────────────────────────────────

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.biz',
  'tempmail.com', 'temp-mail.org', 'throwam.com', 'yopmail.com', 'yopmail.fr',
  'sharklasers.com', 'spam4.me', 'trashmail.com', 'trashmail.net', 'trashmail.io',
  'dispostable.com', 'mailnull.com', 'maildrop.cc', 'fakeinbox.com',
  'mailnesia.com', 'discard.email', 'spamspot.com', '10minutemail.com',
  'mintemail.com', 'mytrashmail.com', 'one-time.email', 'oneoffmail.com',
  'mt2014.com', 'mt2015.com', 'spamgourmet.com', 'spam.la',
  'getnada.com', 'mail-temp.com', 'binkmail.com',
  'safetymail.info', 'spamevader.com', 'wegwerfmail.de', 'filzmail.com',
  'jetable.fr.nf', 'spamfree24.org', 'trashdevil.com', 'mailscrap.com',
])

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.click', '.loan', '.gq', '.ml', '.ga', '.cf', '.tk',
  '.pw', '.win', '.bid', '.stream', '.download',
])

const KB_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

const PROMO_PATTERNS = [
  /click here/i, /buy now/i, /free money/i, /visit my/i, /check out my/i,
  /earn \$\d+/i, /make money/i, /work from home/i, /limited offer/i,
  /act now/i, /guaranteed/i, /free gift/i, /winner/i, /you've been selected/i,
  /crypto/i, /bitcoin/i, /investment opportunity/i, /100% free/i,
]

// ── Scoring ──────────────────────────────────────────────────────────────────

function scoreEmail(email: string): string[] {
  const flags: string[] = []
  const lower = email.toLowerCase()
  const atIdx = lower.indexOf('@')
  if (atIdx < 1) { flags.push('Invalid email format'); return flags }

  const local = lower.slice(0, atIdx)
  const domain = lower.slice(atIdx + 1)
  const tld = '.' + domain.split('.').pop()

  if (DISPOSABLE_DOMAINS.has(domain)) flags.push('Disposable email domain')
  if (SUSPICIOUS_TLDS.has(tld)) flags.push(`Suspicious TLD (${tld})`)

  if (/^(test|admin|user|noreply|no-reply|example|fake|spam|temp|dummy|null|void|bot|robot)\d*$/.test(local)) {
    flags.push('Bot or test email prefix')
  }

  if (local.length <= 2) flags.push('Email local part too short')

  const digits = (local.match(/\d/g) ?? []).length
  if (local.length >= 5 && digits / local.length > 0.6) {
    flags.push('Email local part mostly numbers')
  }

  const localAlpha = local.replace(/[^a-z]/g, '')
  for (const row of KB_ROWS) {
    let streak = 0
    for (const ch of localAlpha) {
      streak = row.includes(ch) ? streak + 1 : 0
      if (streak >= 5) { flags.push('Keyboard mash in email'); break }
    }
    if (flags.some(f => f.includes('mash'))) break
  }

  return flags
}

function scoreName(name: string): string[] {
  const flags: string[] = []
  if (!name || name === 'Anonymous') return flags

  const trimmed = name.trim()
  if (trimmed.length < 2) { flags.push('Name too short'); return flags }

  if (/^\d+$/.test(trimmed)) flags.push('Name is all numbers')

  const lower = trimmed.toLowerCase().replace(/\s/g, '')
  if (new Set(lower.split('')).size <= 2 && lower.length > 3) {
    flags.push('Name is repeated characters')
  }

  for (const row of KB_ROWS) {
    let streak = 0
    for (const ch of lower) {
      streak = row.includes(ch) ? streak + 1 : 0
      if (streak >= 4) { flags.push('Name looks like keyboard mash'); break }
    }
    if (flags.some(f => f.includes('mash'))) break
  }

  // All caps (more than 2 words)
  const words = trimmed.split(/\s+/)
  if (words.length >= 2 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    flags.push('Name is all caps')
  }

  return flags
}

function scoreStory(story: string): string[] {
  const flags: string[] = []
  const trimmed = story.trim()

  if (trimmed.length < 30) flags.push('Story too short (< 30 chars)')

  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.length > 10) {
    flags.push('Story is all caps')
  }

  const words = trimmed.split(/\s+/)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()))
  if (words.length > 6 && uniqueWords.size / words.length < 0.4) {
    flags.push('Story has high word repetition (> 60%)')
  }

  const urlCount = (trimmed.match(/https?:\/\//g) ?? []).length
  if (urlCount > 2) flags.push(`Story contains ${urlCount} URLs`)

  // Body is only URLs
  const nonUrlText = trimmed.replace(/https?:\/\/\S+/g, '').trim()
  if (urlCount > 0 && nonUrlText.length < 20) {
    flags.push('Story body is almost entirely URLs')
  }

  // Keyboard mash in text
  const ltext = trimmed.toLowerCase().replace(/\s/g, '')
  for (const row of KB_ROWS) {
    let streak = 0
    for (const ch of ltext) {
      streak = row.includes(ch) ? streak + 1 : 0
      if (streak >= 7) { flags.push('Story contains keyboard mash'); break }
    }
    if (flags.some(f => f.includes('keyboard mash'))) break
  }

  // Promotional patterns
  for (const pat of PROMO_PATTERNS) {
    if (pat.test(trimmed)) {
      flags.push('Story contains promotional language')
      break
    }
  }

  // Gibberish detection — very low unique char ratio in long stories
  const alpha = trimmed.replace(/[^a-zA-Z]/g, '')
  if (alpha.length >= 30 && new Set(alpha.toLowerCase().split('')).size < 6) {
    flags.push('Story appears to be gibberish text')
  }

  return flags
}

function spamScore(story: FanStory): { flags: string[]; score: number } {
  const flags: string[] = []

  flags.push(...scoreName(story.name))
  if (story.email) flags.push(...scoreEmail(story.email))
  flags.push(...scoreStory(story.story))

  // Deduplicate
  const unique = [...new Set(flags)]
  return { flags: unique, score: unique.length }
}

// ── GET — scan all fan stories ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const store = await readContent()
  const fanStories: FanStory[] = (store as unknown as { fanStories?: FanStory[] }).fanStories ?? []

  const candidates: FanStorySpamCandidate[] = fanStories
    .map(s => {
      const { flags, score } = spamScore(s)
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        story: s.story,
        songTitle: s.songTitle,
        status: s.status,
        createdAt: s.createdAt,
        score,
        flags,
      }
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ candidates, total: fanStories.length })
}

// ── DELETE — bulk remove by id array ────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { ids: string[] }
  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 })
  }

  const idSet = new Set(body.ids)
  const store = await readContent()
  const all: FanStory[] = (store as unknown as { fanStories?: FanStory[] }).fanStories ?? []
  const remaining = all.filter(s => !idSet.has(s.id))
  await writeContent({ fanStories: remaining } as Parameters<typeof writeContent>[0])

  return NextResponse.json({ ok: true, removed: all.length - remaining.length, remaining: remaining.length })
}
