import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const { put } = await import('@vercel/blob')
  const blob = await put(file.name, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
