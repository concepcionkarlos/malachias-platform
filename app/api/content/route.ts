// API route for the site content store.
// Both methods require an authenticated session. GET: return the entire content store.
// PATCH: merge the request body into the store, limited to the admin-owned keys in
// ADMIN_KEYS. Arrays the public fills in (bookings, inquiries, subscribers, fan
// stories…) are never replaced wholesale — the admin's copy may be stale and would
// drop submissions that arrived meanwhile. They're edited one item at a time with a
// { <key>: 'merge-item', item } or { <key>: 'delete-item', id } sentinel, applied to
// the freshly stored array under the store lock. A booking moving to a terminal
// status also pauses its drip.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent, updateContent, type ContentStore } from '@/lib/store'
import { pauseBookingDrip, isTerminalBookingStatus } from '@/lib/venueStore'
import type { BookingRequest } from '@/lib/data'

// Keys the admin owns outright and may overwrite.
const ADMIN_KEYS = new Set<keyof ContentStore>([
  'shows', 'merch', 'bandMembers', 'siteContent', 'mediaItems', 'epkContent',
  'tasks', 'songStories', 'dailyReflections', 'adminNotes', 'monthlyGoal',
  'campaign', 'campaignSponsors', 'campaignUpdates', 'campaignInKind', 'campaignLedger', 'campaignPeerLinks',
])

// Public-intake arrays: per-item edits only.
const INTAKE_KEYS = ['bookingRequests', 'sponsorInquiries', 'lessonInquiries', 'fanStories'] as const
type IntakeKey = typeof INTAKE_KEYS[number]
type IntakeItem = { id: string }

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const store = await readContent()
  return NextResponse.json(store)
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates = await req.json().catch(() => null)
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Per-item sentinel for an intake array (BookingDetail, sponsor/lesson inquiry status…).
  const intakeKey = INTAKE_KEYS.find(k => updates[k] === 'merge-item' || updates[k] === 'delete-item')
  if (intakeKey) return patchIntakeItem(intakeKey, updates)

  const allowed: Partial<ContentStore> = {}
  const ignored: string[] = []
  for (const [k, v] of Object.entries(updates)) {
    if (ADMIN_KEYS.has(k as keyof ContentStore)) (allowed as Record<string, unknown>)[k] = v
    else ignored.push(k)
  }
  if (ignored.length) console.warn('[content PATCH] ignored keys:', ignored.join(', '))

  const store = await updateContent(() => (Object.keys(allowed).length ? allowed : null))
  return NextResponse.json(store)
}

async function patchIntakeItem(key: IntakeKey, updates: Record<string, unknown>) {
  const op = updates[key] as 'merge-item' | 'delete-item'
  const item = updates.item as IntakeItem | undefined
  const id = op === 'delete-item' ? (updates.id as string | undefined) ?? item?.id : item?.id
  if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'item id required' }, { status: 400 })

  let prev: IntakeItem | undefined
  const store = await updateContent(current => {
    const list = (current[key] ?? []) as IntakeItem[]
    prev = list.find(x => x.id === id)
    if (!prev) return null
    const next = op === 'delete-item'
      ? list.filter(x => x.id !== id)
      : list.map(x => (x.id === id ? { ...x, ...item, id } : x))
    return { [key]: next } as Partial<ContentStore>
  })
  if (!prev) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (key === 'bookingRequests' && op === 'merge-item') {
    const before = prev as BookingRequest
    const after = item as unknown as BookingRequest
    if (after.status && before.status !== after.status && isTerminalBookingStatus(after.status)) {
      await pauseBookingDrip(id)
    }
  }
  return NextResponse.json(store)
}
