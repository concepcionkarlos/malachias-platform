// Cron endpoint: GET-only, authorized via Bearer CRON_SECRET (500 if unset, 401 if mismatch); also requires RESEND_API_KEY.
// Reads the subscriberDrip queue from content store and, per entry, sends the day-3 and day-7
// newsletter onboarding emails directly through the Resend API once their delays elapse.
// Only addresses still in `subscribers` get mail (unsubscribed ones are dropped from the queue).
// Each successful step is persisted right after it sends, so a crash or a Resend error
// mid-run never causes a duplicate send on the next run. Fully-completed entries are removed.
import { NextRequest, NextResponse } from 'next/server'
import { readContent, updateContent, type SubscriberDripEntry } from '@/lib/store'
import { addSentEmails } from '@/lib/venueStore'
import { unsubscribeUrl } from '@/lib/unsubscribe'
import type { SentEmail } from '@/lib/data'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.malachiasmusic.com'

function buildDay3Email(email: string): { subject: string; html: string } {
  const unsubUrl = unsubscribeUrl(email)
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
  const unsubUrl = unsubscribeUrl(email)
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
  if (!cronSecret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  if (auth !== `Bearer ${cronSecret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })

  const store = await readContent()
  const subscribed = new Set((store.subscribers ?? []).map(s => s.email.toLowerCase()))
  const queue: SubscriberDripEntry[] = store.subscriberDrip ?? []
  const now = Date.now()
  const DAY = 86_400_000

  // Mark one step done on the freshly stored entry (under the store lock), so
  // concurrent signups/unsubscribes in the meantime are preserved.
  const markSent = (email: string, step: 'day3Sent' | 'day7Sent') =>
    updateContent(cur => ({
      subscriberDrip: (cur.subscriberDrip ?? []).map(e => e.email.toLowerCase() === email.toLowerCase() ? { ...e, [step]: true } : e),
    }))

  let sent = 0
  let failed = 0
  const logs: Omit<SentEmail, 'id'>[] = []

  try {
    for (const entry of queue) {
      if (!subscribed.has(entry.email.toLowerCase())) continue // unsubscribed — never mail
      const enrolledMs = new Date(entry.subscribedAt).getTime()
      const steps: { key: 'day3Sent' | 'day7Sent'; due: boolean; build: (email: string) => { subject: string; html: string } }[] = [
        { key: 'day3Sent', due: !entry.day3Sent && now >= enrolledMs + 3 * DAY, build: buildDay3Email },
        { key: 'day7Sent', due: !entry.day7Sent && now >= enrolledMs + 7 * DAY, build: buildDay7Email },
      ]
      for (const step of steps) {
        if (!step.due) continue
        const { subject, html } = step.build(entry.email)
        const sentAt = new Date().toISOString()
        let res: Response
        try {
          res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: 'Malachias <hello@malachiasmusic.com>', to: [entry.email], subject, html }),
            signal: AbortSignal.timeout(10_000),
          })
          if (!res.ok) throw new Error(`resend ${res.status}`)
        } catch (err) {
          // Leave the step unsent; the next run retries just this one.
          failed++
          logs.push({ toEmail: entry.email, subject, bodyHtml: html, sentAt, status: 'failed', errorMessage: String(err).slice(0, 200) })
          break // don't send day 7 before day 3 went out
        }
        sent++
        await markSent(entry.email, step.key) // record progress before moving on
        const data = await res.json().catch(() => ({}))
        logs.push({ toEmail: entry.email, subject, bodyHtml: html, sentAt, resendEmailId: data?.id, status: 'sent' })
      }
    }
  } finally {
    await addSentEmails(logs).catch(() => {})
  }

  // Drop completed entries and anyone no longer subscribed.
  const after = await updateContent(cur => {
    const current = new Set((cur.subscribers ?? []).map(s => s.email.toLowerCase()))
    return {
      subscriberDrip: (cur.subscriberDrip ?? []).filter(e => (!e.day3Sent || !e.day7Sent) && current.has(e.email.toLowerCase())),
    }
  })

  return NextResponse.json({ sent, failed, remaining: (after.subscriberDrip ?? []).length })
}
