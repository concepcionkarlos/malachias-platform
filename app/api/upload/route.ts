// Admin API for file uploads to Vercel Blob storage (auth required).
// POST: accepts a multipart 'file', validates the extension against an image/audio/video/pdf
// allowlist, stores it under a randomized sanitized name with public access, and returns its URL.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import path from 'path'
import { isAuthenticatedFromRequest } from '@/lib/auth'

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3', '.mp4', '.pdf'])

export async function POST(req: NextRequest) {
  if (!isAuthenticatedFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })

  // Sanitized name — random ID + extension only, no user-controlled path segments
  const safeName = `uploads/${crypto.randomBytes(8).toString('hex')}${ext}`

  const { put } = await import('@vercel/blob')
  const blob = await put(safeName, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
