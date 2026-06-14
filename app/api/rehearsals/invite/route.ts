import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { updateRehearsal, getRehearsalByToken, getSongs } from '@/lib/venueStore'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { rehearsalId, emails, currentToken } = await req.json()
  if (!rehearsalId) return NextResponse.json({ error: 'rehearsalId required' }, { status: 400 })

  const token = currentToken ?? crypto.randomBytes(16).toString('hex')
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'
  const inviteUrl = `${base}/rehearsal/${token}`

  const updated = await updateRehearsal(rehearsalId, { token })

  if (emails?.length && process.env.RESEND_API_KEY) {
    const songs = await getSongs()
    const rehearsalSongs = songs.filter(s => updated.songIds.includes(s.id))

    const songListHtml = rehearsalSongs.map(s =>
      `<li style="margin-bottom:4px;font-family:Arial,sans-serif;font-size:14px;color:#444444;">${s.title}${s.type === 'cover' && s.originalArtist ? ` <span style="color:#999999;">(${s.originalArtist})</span>` : ''}</li>`
    ).join('')

    const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#030202;padding:24px 40px;border-bottom:2px solid #c9a84c;">
        <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">MALACHIAS</p>
        <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Rehearsal Invite</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">Rehearsal: ${updated.date}${updated.time ? ` at ${updated.time}` : ''}</h1>
        ${updated.location ? `<p style="margin:0 0 20px;font-size:14px;color:#8a7f70;font-family:Arial,sans-serif;">${updated.location}</p>` : ''}
        ${rehearsalSongs.length > 0 ? `
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">Songs to practice:</p>
        <ul style="margin:0 0 24px;padding-left:20px;">${songListHtml}</ul>` : ''}
        ${updated.notes ? `<p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.6;font-family:Arial,sans-serif;">${updated.notes}</p>` : ''}
        <a href="${inviteUrl}" style="display:inline-block;padding:14px 28px;background:#c9a84c;color:#030202;text-decoration:none;font-weight:700;font-size:15px;border-radius:6px;font-family:Arial,sans-serif;">Confirm Attendance →</a>
        <p style="margin:24px 0 0;font-size:13px;color:#999999;font-family:Arial,sans-serif;">Or paste in browser: ${inviteUrl}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM_EMAIL ?? 'Malachias <booking@malachiasmusic.com>'

    for (const email of emails) {
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: `Rehearsal — ${updated.date}${updated.time ? ` at ${updated.time}` : ''}`,
          html,
        })
      } catch { /* best effort */ }
    }
  }

  return NextResponse.json({ ok: true, token, inviteUrl, rehearsal: updated })
}
