// Signed newsletter unsubscribe links. The token is an HMAC of the lowercased
// email, so only links we emailed can unsubscribe someone in one click; a bare
// ?email= link (older emails) gets a confirmation step instead.

import crypto from 'crypto'
import { getServerSecret } from './secret'

const SITE_URL = 'https://www.malachiasmusic.com'

export function unsubscribeToken(email: string): string {
  return crypto.createHmac('sha256', getServerSecret()).update(`unsubscribe:${email.trim().toLowerCase()}`).digest('base64url')
}

export function unsubscribeUrl(email: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`
}

export function verifyUnsubscribeToken(email: string, token: string | null | undefined): boolean {
  if (!token) return false
  const expected = Buffer.from(unsubscribeToken(email))
  const given = Buffer.from(token)
  return expected.length === given.length && crypto.timingSafeEqual(expected, given)
}
