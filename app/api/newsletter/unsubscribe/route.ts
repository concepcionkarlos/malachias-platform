// Newsletter unsubscribe endpoint (public, rate-limited at 5 requests / 60s; 429 otherwise).
// GET ?email=&token=: a valid signed token (lib/unsubscribe.ts) unsubscribes in one click.
// GET without a valid token (links from older emails) offers to email a signed link,
// so only the inbox owner can unsubscribe an address.
// POST with a valid token (RFC 8058 one-click): removes the address.
// POST without one (the button above): emails the signed link instead.
// Unsubscribing removes the email from subscribers, pendingSubscribers and the
// onboarding drip queue, so no further mail of any kind goes out to it.
import { NextRequest, NextResponse } from 'next/server'
import { updateContent } from '@/lib/store'
import { rateLimit } from '@/lib/rateLimit'
import { str } from '@/lib/str'
import { verifyUnsubscribeToken, unsubscribeUrl } from '@/lib/unsubscribe'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function page(title: string, body: string, status = 200): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><style>body{font-family:Arial,sans-serif;background:#f4f1eb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;}div{background:#fff;padding:40px;border-radius:8px;text-align:center;max-width:400px;}h1{color:#111;font-size:20px;margin-bottom:8px;}p{color:#666;font-size:14px;}a{color:#c9a84c;}button{background:#c9a84c;color:#030202;border:none;padding:12px 28px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;margin-top:12px;}</style></head><body><div>${body}<p style="margin-top:20px;font-size:12px;"><a href="https://www.malachiasmusic.com">Visit malachiasmusic.com</a></p></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html' } }
  )
}

const DONE_HTML = '<h1>Unsubscribed</h1><p>You have been removed from the Malachias mailing list.</p>'

async function unsubscribe(email: string): Promise<void> {
  const lower = email.toLowerCase()
  await updateContent(store => ({
    subscribers: (store.subscribers ?? []).filter(s => s.email.toLowerCase() !== lower),
    pendingSubscribers: (store.pendingSubscribers ?? []).filter(p => p.email.toLowerCase() !== lower),
    subscriberDrip: (store.subscriberDrip ?? []).filter(e => e.email.toLowerCase() !== lower),
  }))
}

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, 'unsubscribe', { limit: 5, windowMs: 60_000 })
  if (limited) return new NextResponse('Too many requests. Please try again later.', { status: 429, headers: { 'Content-Type': 'text/plain' } })

  const email = str(req.nextUrl.searchParams.get('email'), 254)
  if (!email) {
    return new NextResponse('Missing email parameter.', { status: 400, headers: { 'Content-Type': 'text/plain' } })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (verifyUnsubscribeToken(email, token)) {
    await unsubscribe(email)
    return page('Unsubscribed', DONE_HTML)
  }

  // Unsigned (older) link: send a signed link to the address itself.
  return page('Unsubscribe', `<h1>Unsubscribe?</h1><p>We'll email a one-click unsubscribe link to <strong>${esc(email)}</strong>.</p>
    <form method="POST" action="/api/newsletter/unsubscribe"><input type="hidden" name="email" value="${esc(email)}"><button type="submit">Send the link</button></form>`)
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, 'unsubscribe', { limit: 5, windowMs: 60_000 })
  if (limited) return new NextResponse('Too many requests. Please try again later.', { status: 429, headers: { 'Content-Type': 'text/plain' } })

  // RFC 8058 one-click (email/token in the query), or the form on the GET page.
  const token = req.nextUrl.searchParams.get('token')
  let email = str(req.nextUrl.searchParams.get('email'), 254)
  if (!email) {
    const form = await req.formData().catch(() => null)
    email = str(form?.get('email'), 254)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return page('Unsubscribe', '<h1>Missing email</h1><p>That unsubscribe link is incomplete.</p>', 400)
  }

  if (verifyUnsubscribeToken(email, token)) {
    await unsubscribe(email)
    return page('Unsubscribed', DONE_HTML)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const link = unsubscribeUrl(email)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Malachias <hello@malachiasmusic.com>', to: [email.toLowerCase()], subject: 'Your unsubscribe link',
        html: `<p>Someone (hopefully you) asked to stop Malachias emails to this address.</p><p><a href="${esc(link)}">Unsubscribe now</a></p><p>If that wasn't you, ignore this email and nothing changes.</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null)
  }
  // Same reply whether or not the address is on a list — don't confirm membership.
  return page('Check your inbox', `<h1>Check your inbox</h1><p>If ${esc(email)} is on our list, a one-click unsubscribe link is on its way.</p>`)
}
