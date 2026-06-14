import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

const GOLD = '#c9a84c'
const DARK = '#030202'

function buildBlastHtml(subject: string, body: string): string {
  const paragraphs = body.split('\n').map(p =>
    p.trim()
      ? `<p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;font-family:Arial,sans-serif;">${p}</p>`
      : '<br>'
  ).join('')

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:${DARK};padding:24px 40px;border-bottom:2px solid ${GOLD};">
        <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">MALACHIAS</p>
        <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Christian Rock · Veteran Mission · Faith on Fire</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 24px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">${subject}</h1>
        ${paragraphs}
        <p style="margin:24px 0 0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong></p>
      </td></tr>
      <tr><td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e8e0d5;">
        <p style="margin:0;font-size:11px;color:#999999;line-height:1.5;font-family:Arial,sans-serif;">
          Malachias · <a href="https://malachiasmusic.com" style="color:#999999;">malachiasmusic.com</a>
          · <a href="mailto:booking@malachiasmusic.com" style="color:#999999;">booking@malachiasmusic.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 400 })

  const { subject, body } = await req.json()
  if (!subject || !body) return NextResponse.json({ error: 'subject and body required' }, { status: 400 })

  const store = await readContent()
  const subscribers = (store.subscribers ?? []).map(s => s.email)
  if (subscribers.length === 0) return NextResponse.json({ error: 'No subscribers' }, { status: 400 })

  const from = process.env.RESEND_FROM_EMAIL ?? 'Malachias <booking@malachiasmusic.com>'
  const html = buildBlastHtml(subject, body)

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const results: { email: string; ok: boolean }[] = []

  for (const email of subscribers) {
    try {
      await resend.emails.send({ from, to: email, subject, html })
      results.push({ email, ok: true })
    } catch {
      results.push({ email, ok: false })
    }
  }

  const sent = results.filter(r => r.ok).length
  return NextResponse.json({ ok: true, sent, total: subscribers.length, results })
}
