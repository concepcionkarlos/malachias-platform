import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent } from '@/lib/store'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check all critical env vars
  const checks = {
    resend:          !!process.env.RESEND_API_KEY,
    resendFrom:      process.env.RESEND_FROM_EMAIL ?? null,
    adminEmail:      process.env.ADMIN_NOTIFY_EMAIL ?? null,
    kvConfigured:    !!process.env.KV_REST_API_URL,
    cronSecret:      !!process.env.CRON_SECRET,
    fourthwall:      !!process.env.FOURTHWALL_STOREFRONT_TOKEN,
  }

  // Test storage by reading + counting records
  let storageOk = false
  let bookingCount = 0
  let subscriberCount = 0
  try {
    const store = await readContent()
    bookingCount = store.bookingRequests?.length ?? 0
    subscriberCount = store.subscribers?.length ?? 0
    storageOk = true
  } catch { /* storageOk stays false */ }

  return NextResponse.json({
    checks,
    storage: { ok: storageOk, bookingCount, subscriberCount, backend: checks.kvConfigured ? 'vercel-kv' : 'filesystem' },
    emailMode: checks.resend ? 'live' : 'dev-mode',
  })
}
