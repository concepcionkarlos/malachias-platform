// API route: send a single branded email.
// POST (admin-auth required) builds a styled HTML + plain-text email from
// {toEmail, subject, bodyText}, sends it via Resend (BCC'd to booking@), and
// logs the result (sent/failed) to the CRM sent-emails store.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { addSentEmail } from '@/lib/venueStore'

const GOLD = '#c9a84c'
const DARK = '#030202'

function buildEmailHtml(bodyText: string): string {
  const paragraphs = bodyText
    .split('\n')
    .map((p: string) =>
      p.trim()
        ? `<p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.75;font-family:Arial,sans-serif;">${p}</p>`
        : '<br>'
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

      <!-- Header / Logo -->
      <tr><td style="background:${DARK};padding:24px 40px;border-bottom:2px solid ${GOLD};">
        <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">MALACHIAS</p>
        <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Christian Rock · Veteran Mission · Faith on Fire</p>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:40px;">
        ${paragraphs}
      </td></tr>

      <!-- Signature -->
      <tr><td style="background:${DARK};padding:28px 40px;border-top:2px solid ${GOLD};">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0 0 2px;color:#e8ddd0;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">MALACHIAS</p>
              <p style="margin:0 0 12px;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;">Christian Rock · Veteran Mission · Faith on Fire</p>
              <p style="margin:0;font-size:12px;line-height:1.9;font-family:Arial,sans-serif;">
                <a href="mailto:booking@malachiasmusic.com" style="color:${GOLD};text-decoration:none;">booking@malachiasmusic.com</a><br>
                <a href="https://www.malachiasmusic.com" style="color:${GOLD};text-decoration:none;">malachiasmusic.com</a><br>
                <a href="https://www.instagram.com/malachiasmusic" style="color:${GOLD};text-decoration:none;">@malachiasmusic</a>
              </p>
            </td>
            <td align="right" valign="middle">
              <div style="width:52px;height:52px;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.30);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
                <p style="margin:0;color:${GOLD};font-size:18px;font-weight:700;font-family:Arial,sans-serif;line-height:1;text-align:center;padding-top:14px;">M</p>
              </div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f9f7f4;padding:16px 40px;border-top:1px solid #e8e0d5;">
        <p style="margin:0;font-size:11px;color:#999999;line-height:1.5;font-family:Arial,sans-serif;">
          MalachiasMusic · <a href="https://www.malachiasmusic.com" style="color:#999999;">malachiasmusic.com</a> · <a href="mailto:booking@malachiasmusic.com" style="color:#999999;">booking@malachiasmusic.com</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

const SIGNATURE_TEXT = `

--
MALACHIAS | Christian Rock · Veteran Mission · Faith on Fire
booking@malachiasmusic.com
malachiasmusic.com | @malachiasmusic`

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toEmail, subject, bodyText } = await req.json()
  if (!toEmail || !subject || !bodyText) {
    return NextResponse.json({ error: 'toEmail, subject, bodyText required' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 400 })

  const from = process.env.RESEND_FROM_EMAIL ?? 'MalachiasMusic <booking@malachiasmusic.com>'
  const bodyHtml = buildEmailHtml(bodyText)
  const fullText = bodyText + SIGNATURE_TEXT

  let resendEmailId: string | undefined
  let status: 'sent' | 'failed' = 'sent'
  let errorMessage: string | undefined

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({ from, to: toEmail, bcc: 'booking@malachiasmusic.com', subject, html: bodyHtml, text: fullText })
    resendEmailId = result.data?.id
  } catch (err) {
    status = 'failed'
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  const sent = await addSentEmail({
    toEmail, subject, bodyHtml, bodyText: fullText,
    sentAt: new Date().toISOString(), resendEmailId, status, errorMessage,
  })

  if (status === 'failed') return NextResponse.json({ error: errorMessage }, { status: 500 })
  return NextResponse.json({ ok: true, id: sent.id, resendEmailId })
}
