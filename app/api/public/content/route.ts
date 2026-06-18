// Public site content endpoint (no auth).
// GET: reads the content store and returns only front-end-safe data — site content,
// visible band members, visible upcoming shows (sorted by date), visible merch, visible
// media items, EPK content, visible song stories (sorted by order), and daily reflections
// (newest first). Private data such as bookings and subscribers is never exposed.
import { NextResponse } from 'next/server'
import { readContent } from '@/lib/store'

// Public — no auth. Returns only front-end-safe data (no bookings, no subscribers).
export async function GET() {
  const store = await readContent()
  const today = new Date().toISOString().split('T')[0]

  return NextResponse.json({
    siteContent: store.siteContent,
    bandMembers: store.bandMembers.filter(m => m.visible !== false),
    shows: store.shows
      .filter(s => s.visible !== false && (!s.date || s.date >= today))
      .sort((a, b) => a.date.localeCompare(b.date)),
    merch: store.merch.filter(m => m.visible !== false),
    mediaItems: store.mediaItems.filter(m => m.visible !== false),
    epkContent: store.epkContent,
    songStories: (store.songStories ?? [])
      .filter(s => s.visible !== false)
      .sort((a, b) => a.order - b.order),
    dailyReflections: (store.dailyReflections ?? [])
      .sort((a, b) => b.date.localeCompare(a.date)),
  })
}
