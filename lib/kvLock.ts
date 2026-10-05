// Short-lived mutex around read-modify-write cycles on a KV key. Upstash has no
// multi-key transactions here, so two simultaneous submissions could each read
// the same array, append, and the second write would drop the first. The lock
// is a `SET NX PX` with a random token, released only by its owner. No-op for
// the local JSON fallback (single dev process).

import crypto from 'crypto'

const useKV = !!process.env.KV_REST_API_URL
const LOCK_TTL_MS = 5000
const MAX_WAIT_MS = 6000

// Delete the key only if it still holds our token (atomic compare-and-delete).
const RELEASE_SCRIPT = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end"

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  if (!useKV) return fn()
  const { kv } = await import('@vercel/kv')
  const key = `lock:${name}`
  const token = crypto.randomBytes(12).toString('hex')
  const deadline = Date.now() + MAX_WAIT_MS
  let acquired = false
  let delay = 25
  while (!acquired) {
    try {
      acquired = (await kv.set(key, token, { nx: true, px: LOCK_TTL_MS })) === 'OK'
    } catch {
      break // KV hiccup: proceed unlocked rather than lose the write
    }
    if (acquired || Date.now() > deadline) break
    await sleep(delay + Math.floor(Math.random() * delay))
    delay = Math.min(delay * 2, 400)
  }
  // The TTL guarantees a stuck holder can't block forever; after waiting past
  // it we proceed anyway — a rare race beats dropping a public submission.
  if (!acquired) console.warn(`[kvLock] proceeding without lock ${key}`)
  try {
    return await fn()
  } finally {
    if (acquired) {
      try {
        await kv.eval(RELEASE_SCRIPT, [key], [token])
      } catch { /* expires on its own */ }
    }
  }
}
