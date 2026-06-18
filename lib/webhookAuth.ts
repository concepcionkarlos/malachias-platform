// Webhook authentication — constant-time comparison of an incoming webhook
// secret against the expected value, used to verify inbound webhook requests
// without leaking timing information.

import crypto from 'crypto'

export function verifyWebhookSecret(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}
