// captcha.ts — server-issued, signed, single-use math challenge.
//
// The browser can no longer make up its own challenge: it must GET one from
// /api/booking/captcha, which returns the two numbers plus an opaque token.
// The token is an HMAC over (answer, expiry, nonce) so a bot can't forge a
// valid token for an arbitrary answer without the server secret, can't reuse
// an expired one, and (via consumeChallengeNonce) can't replay the same token
// across many submissions.

import crypto from 'crypto'

const SECRET = process.env.SESSION_SECRET ?? 'malachias-secret'
const TTL_MS = 10 * 60 * 1000 // 10 minutes to fill out the form

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
}

export interface Challenge {
  a: number
  b: number
  token: string
}

export function issueChallenge(): Challenge {
  const a = crypto.randomInt(1, 10) // 1..9
  const b = crypto.randomInt(1, 10) // 1..9
  const exp = Date.now() + TTL_MS
  const nonce = crypto.randomBytes(9).toString('base64url')
  const payload = `${a + b}.${exp}.${nonce}`
  return { a, b, token: `${payload}.${sign(payload)}` }
}

export interface VerifyResult {
  ok: boolean
  nonce?: string
}

export function verifyChallenge(token: unknown, answer: unknown): VerifyResult {
  if (typeof token !== 'string') return { ok: false }
  const parts = token.split('.')
  if (parts.length !== 4) return { ok: false }
  const [sumStr, expStr, nonce, sig] = parts

  // Verify signature in constant time.
  const expected = sign(`${sumStr}.${expStr}.${nonce}`)
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { ok: false }
  }

  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return { ok: false }

  const sum = parseInt(sumStr, 10)
  const ans = parseInt(String(answer), 10)
  if (!Number.isFinite(ans) || ans !== sum) return { ok: false }

  return { ok: true, nonce }
}

/**
 * Marks a challenge nonce as used so the same solved token can't be replayed.
 * Returns true if the nonce was fresh (and is now consumed), false if it was
 * already used. Best-effort: fails open in local dev (no KV) and on KV errors
 * so legitimate users are never blocked by infrastructure hiccups.
 */
export async function consumeChallengeNonce(nonce: string): Promise<boolean> {
  if (!process.env.KV_REST_API_URL) return true
  try {
    const { kv } = await import('@vercel/kv')
    const res = await kv.set(`captcha:used:${nonce}`, 1, { nx: true, ex: 15 * 60 })
    return res === 'OK'
  } catch {
    return true
  }
}
