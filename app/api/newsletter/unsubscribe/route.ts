import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'unsubscribe', { limit: 5, windowMs: 60_000 })
  if (limited) return new NextResponse('Too many requests. Please try again later.', { status: 429, headers: { 'Content-Type': 'text/plain' } })

  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return new NextResponse('Missing email parameter.', { status: 400, headers: { 'Content-Type': 'text/plain' } })
  }

  const store = await readContent()
  const subscribers = (store.subscribers ?? []).filter(
    s => s.email.toLowerCase() !== email.toLowerCase()
  )
  await writeContent({ subscribers })

  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribed</title><style>body{font-family:Arial,sans-serif;background:#f4f1eb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}div{background:#fff;padding:40px;border-radius:8px;text-align:center;max-width:400px;}h1{color:#111;font-size:20px;margin-bottom:8px;}p{color:#666;font-size:14px;}a{color:#c9a84c;}</style></head><body><div><h1>Unsubscribed</h1><p>You have been removed from the Malachias mailing list.</p><p style="margin-top:20px;font-size:12px;"><a href="https://www.malachiasmusic.com">Visit malachiasmusic.com</a></p></div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}
