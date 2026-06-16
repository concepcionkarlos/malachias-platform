import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.malachiasmusic.com'

interface DripEntry {
  email: string
  subscribedAt: string
  day3Sent: boolean
  day7Sent: boolean
}

function buildDay3Email(email: string): { subject: string; html: string } {
  const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  return {
    subject: 'Quick question — I\'m curious about something',
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
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">Hey,</p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      You subscribed a few days ago. I've been thinking about that.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      Quick question — what made you click? Was it a song, a post, a show, someone who shared us?
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      No right answer. I'm just genuinely curious.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      Hit reply and tell me. I read every one.
    </p>
    <p style="margin:0;font-size:16px;color:#222222;line-height:1.8;">
      God bless,<br>
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
  }
}

function buildDay7Email(email: string): { subject: string; html: string } {
  const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  return {
    subject: 'The song that started all this',
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
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">Hey,</p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      There's always one song that makes you think: <em>this could be something real.</em>
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      For us, it wasn't written in a studio. It wasn't written for a label.
      It was written at 3am when nothing else worked.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      That's when the music is real — when it's the only thing that makes sense.
    </p>
    <p style="margin:0 0 20px;font-size:16px;color:#222222;line-height:1.8;">
      I'd love to know: do you have a song like that? One that carried you through something?
      Hit reply. Tell me which one and why.
    </p>
    <p style="margin:0 0 28px;font-size:16px;color:#222222;line-height:1.8;">
      You can also hear ours at <a href="${SITE_URL}" style="color:#c9a84c;">malachiasmusic.com</a>.
    </p>
    <p style="margin:0;font-size:16px;color:#222222;line-height:1.8;">
      God bless,<br>
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
  }
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && !cronSecret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  if (cronSecret && auth !== `Bearer ${cronSecret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })

  const store = await readContent()
  const queue: DripEntry[] = (store as any).subscriberDrip ?? []
  const now = Date.now()
  const DAY = 86_400_000

  let sent = 0
  const updated = await Promise.all(queue.map(async entry => {
    const enrolledMs = new Date(entry.subscribedAt).getTime()

    if (!entry.day3Sent && now >= enrolledMs + 3 * DAY) {
      const { subject, html } = buildDay3Email(entry.email)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Malachias <hello@malachiasmusic.com>',
          to: [entry.email],
          subject,
          html,
        }),
      })
      if (res.ok) { entry = { ...entry, day3Sent: true }; sent++ }
    }

    if (!entry.day7Sent && now >= enrolledMs + 7 * DAY) {
      const { subject, html } = buildDay7Email(entry.email)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Malachias <hello@malachiasmusic.com>',
          to: [entry.email],
          subject,
          html,
        }),
      })
      if (res.ok) { entry = { ...entry, day7Sent: true }; sent++ }
    }

    return entry
  }))

  // Remove entries where both emails are done
  const remaining = updated.filter(e => !e.day3Sent || !e.day7Sent)
  await writeContent({ subscriberDrip: remaining } as any)

  return NextResponse.json({ sent, remaining: remaining.length })
}
