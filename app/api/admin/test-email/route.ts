import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toEmail } = await req.json()
  if (!toEmail) return NextResponse.json({ error: 'toEmail required' }, { status: 400 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured — emails are in DEV_MODE (silenced)', mode: 'dev' }, { status: 400 })
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'Malachias <onboarding@resend.dev>'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from,
      to: toEmail,
      subject: 'Malachias — Email test',
      html: `<p style="font-family:Arial;font-size:15px;color:#444;">This is a test email from the Malachias admin panel. If you received this, email is working correctly.</p><p style="font-family:Arial;font-size:13px;color:#888;">Sent from: ${from}<br>Time: ${new Date().toISOString()}</p>`,
    })
    return NextResponse.json({ ok: true, messageId: result.data?.id, from })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
