// Content store — the app's primary data layer. Reads/writes the whole editable
// site content blob (shows, merch, band members, EPK, bookings, subscribers,
// fan stories, etc.) to Vercel KV in production or a local JSON file in dev,
// always merging persisted data with the defaults from lib/data.ts.

import fs from 'fs'
import path from 'path'
import { withLock } from './kvLock'
import type { Show, MerchItem, BandMember, SiteContent, MediaItem, EpkContent, BookingRequest, AdminNote, Subscriber, BandTask, SongStory, DailyReflection, FanStory } from './data'
import type { CampaignOverrides, Sponsor, CampaignUpdate, SponsorInquiry, InKindItem, LedgerEntry, PeerLink } from './campaign'
import type { LessonInquiry } from './lessons'
import {
  shows as defaultShows,
  merch as defaultMerch,
  bandMembers as defaultBandMembers,
  siteContent as defaultSiteContent,
  mediaItems as defaultMediaItems,
  epkContent as defaultEpkContent,
  bookingRequests as defaultBookingRequests,
  subscribers as defaultSubscribers,
  bandTasks as defaultBandTasks,
  songStories as defaultSongStories,
  dailyReflections as defaultDailyReflections,
} from './data'

// Newsletter double opt-in: awaiting the confirmation click (48h TTL).
export interface PendingSubscriber {
  email: string
  token: string
  createdAt: string
}

// Newsletter onboarding drip (day 3 / day 7), processed by /api/cron/subscriber-drip.
export interface SubscriberDripEntry {
  email: string
  subscribedAt: string
  day3Sent: boolean
  day7Sent: boolean
}

export interface ContentStore {
  shows: Show[]
  merch: MerchItem[]
  bandMembers: BandMember[]
  siteContent: SiteContent
  mediaItems: MediaItem[]
  epkContent: EpkContent
  bookingRequests: BookingRequest[]
  subscribers: Subscriber[]
  tasks: BandTask[]
  songStories: SongStory[]
  dailyReflections: DailyReflection[]
  fanStories: FanStory[]
  adminNotes?: AdminNote[]
  monthlyGoal?: { month: string; bookingTarget: number; revenueTarget: number }
  // Road to San Antonio (Veterans Day 2026) — defaults live in lib/campaign.ts
  campaign?: CampaignOverrides
  campaignSponsors?: Sponsor[]
  campaignUpdates?: CampaignUpdate[]
  sponsorInquiries?: SponsorInquiry[]
  campaignInKind?: InKindItem[]
  campaignLedger?: LedgerEntry[]
  campaignPeerLinks?: PeerLink[]
  // Voice lessons with Malachias — offer lives in lib/lessons.ts
  lessonInquiries?: LessonInquiry[]
  pendingSubscribers?: PendingSubscriber[]
  subscriberDrip?: SubscriberDripEntry[]
}

const DATA_PATH = path.join(process.cwd(), 'data', 'content.json')
const KV_KEY = 'malachias_content'

function getDefaults(): ContentStore {
  return {
    shows: defaultShows,
    merch: defaultMerch,
    bandMembers: defaultBandMembers,
    siteContent: defaultSiteContent,
    mediaItems: defaultMediaItems,
    epkContent: defaultEpkContent,
    bookingRequests: defaultBookingRequests,
    subscribers: defaultSubscribers,
    tasks: defaultBandTasks,
    songStories: defaultSongStories,
    dailyReflections: defaultDailyReflections,
    fanStories: [],
  }
}

function mergeWithDefaults(parsed: Partial<ContentStore>): ContentStore {
  const defaults = getDefaults()
  return {
    ...defaults,
    ...parsed,
    siteContent: { ...defaults.siteContent, ...parsed.siteContent },
    epkContent: { ...defaults.epkContent, ...parsed.epkContent },
  }
}

function readLocal(): ContentStore {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const defaults = getDefaults()
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
      fs.writeFileSync(DATA_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return mergeWithDefaults(JSON.parse(raw) as Partial<ContentStore>)
  } catch {
    return getDefaults()
  }
}

function writeLocal(updates: Partial<ContentStore>): ContentStore {
  const current = readLocal()
  const next = { ...current, ...updates }
  fs.writeFileSync(DATA_PATH, JSON.stringify(next, null, 2), 'utf-8')
  return next
}

async function readKV(): Promise<ContentStore> {
  const { kv } = await import('@vercel/kv')
  const stored = await kv.get<ContentStore>(KV_KEY)
  if (!stored) {
    const initial = readLocal()
    await kv.set(KV_KEY, initial)
    return initial
  }
  return mergeWithDefaults(stored as Partial<ContentStore>)
}

async function writeKV(updates: Partial<ContentStore>, base?: ContentStore): Promise<ContentStore> {
  const { kv } = await import('@vercel/kv')
  const current = base ?? await readKV()
  const next = { ...current, ...updates }
  await kv.set(KV_KEY, next)
  return next
}

// The whole blob lives under one key, so every write is a read-merge-write of
// the entire store and must be serialized against every other write.
const LOCK_NAME = KV_KEY

const useKV = !!process.env.KV_REST_API_URL

export async function readContent(): Promise<ContentStore> {
  if (useKV) return readKV()
  return readLocal()
}

export async function writeContent(updates: Partial<ContentStore>): Promise<ContentStore> {
  if (useKV) return withLock(LOCK_NAME, () => writeKV(updates))
  return writeLocal(updates)
}

/**
 * Atomic read-modify-write: `fn` receives the freshly read store (under the
 * lock) and returns the keys to write, or null to write nothing. Use this for
 * anything that appends to / edits an array based on what's stored, so a
 * concurrent submission can't be dropped.
 */
export async function updateContent(
  fn: (current: ContentStore) => Partial<ContentStore> | null | Promise<Partial<ContentStore> | null>,
): Promise<ContentStore> {
  if (!useKV) {
    const current = readLocal()
    const updates = await fn(current)
    return updates ? writeLocal(updates) : current
  }
  return withLock(LOCK_NAME, async () => {
    const current = await readKV()
    const updates = await fn(current)
    return updates ? writeKV(updates, current) : current
  })
}
