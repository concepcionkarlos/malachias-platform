import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { isAuthenticated } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import type { FanStory } from '@/lib/data'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json({ fanStories: (store as any).fanStories ?? [] })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'fan-stories', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  const { name, email, story, songTitle } = await req.json()
  if (!story || story.trim().length < 10) {
    return NextResponse.json({ error: 'Story is required' }, { status: 400 })
  }
  if (story.trim().length > 8000) return NextResponse.json({ error: 'Story is too long' }, { status: 400 })
  if (name && String(name).length > 120) return NextResponse.json({ error: 'Name is too long' }, { status: 400 })
  if (songTitle && String(songTitle).length > 200) return NextResponse.json({ error: 'Song title is too long' }, { status: 400 })
  const emailStr = email ? String(email).trim() : undefined
  if (emailStr && (emailStr.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr))) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  const entry: FanStory = {
    id: crypto.randomBytes(6).toString('hex'),
    name: (name ?? '').trim() || 'Anonymous',
    email: emailStr,
    story: story.trim(),
    songTitle: songTitle ? String(songTitle).trim() : undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const store = await readContent()
  const fanStories = [...((store as any).fanStories ?? []), entry]
  await writeContent({ fanStories } as any)

  // Auto-acknowledge with a personal-feeling email if they left an email
  if (entry.email) {
    const apiKey = process.env.RESEND_API_KEY
    const siteUrl = 'https://www.malachiasmusic.com'
    if (apiKey) {
      const firstName = entry.name === 'Anonymous' ? 'Hey' : entry.name.split(' ')[0]
      const unsubUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(entry.email)}`
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Malachias <hello@malachiasmusic.com>',
          to: [entry.email],
          subject: 'I read what you shared.',
          html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
  <tr><td style="background:#030202;padding:20px 40px;border-bottom:3px solid #c9a84c;">
    <p style="margin:0;color:#e8ddd0;font-size:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">MALACHIAS</p>
  </td></tr>
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">${firstName},</p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      I read what you shared. Thank you for trusting us with that.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      Stories like yours are exactly why we keep doing this. The music isn't just songs — it's these moments, the ones you don't usually tell anyone.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      If you ever want to talk more, hit reply. I'm here.
    </p>
    <p style="margin:0;font-size:16px;color:#222222;line-height:1.8;">
      God bless.<br>
      <strong>Malachias</strong>
    </p>
  </td></tr>
  <tr><td style="background:#f9f7f4;padding:16px 40px;border-top:1px solid #e8e0d5;">
    <p style="margin:0;font-size:11px;color:#999999;">
      Malachias · South Florida · <a href="mailto:hello@malachiasmusic.com" style="color:#999999;">hello@malachiasmusic.com</a>
      &nbsp;·&nbsp;<a href="${unsubUrl}" style="color:#c9a84c;">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
        }),
      }).catch(() => {/* non-blocking */})
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const store = await readContent()
  const fanStories = ((store as any).fanStories ?? []).map((s: FanStory) =>
    s.id === id ? { ...s, status } : s
  )
  await writeContent({ fanStories } as any)
  return NextResponse.json({ ok: true })
}
