// ── Show ─────────────────────────────────────────────────────────────────────

export type ShowStatus = 'Confirmed' | 'Pending' | 'Hold' | 'Cancelled'

export interface Show {
  id: string
  date: string
  venue: string
  city: string
  time: string
  ticketUrl?: string
  isFeatured?: boolean
  visible?: boolean
  guarantee?: number
  payout?: number
  travelBudget?: number
  loadInTime?: string
  soundCheckTime?: string
  setLength?: string
  showStatus?: ShowStatus
  contactPerson?: string
  contactEmail?: string
  showNotes?: string
  attendance?: number
  gigRating?: number
  gigHighlight?: string
  merchSoldAtShow?: number
  advanceChecklist?: string[]
  sourceVenueId?: string
}

// ── Merch ─────────────────────────────────────────────────────────────────────

export interface MerchItem {
  id: string
  name: string
  price: number
  image?: string
  images?: string[]
  category: 'apparel' | 'music' | 'accessories' | 'other'
  available: boolean
  externalUrl?: string
  visible: boolean
  description?: string
  specs?: { label: string; value: string }[]
  atShows?: boolean
  stockQuantity?: number
  story?: string
}

// ── Band Members ──────────────────────────────────────────────────────────────

export interface BandMember {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  branch?: string
  tours?: string
  visible?: boolean
}

// ── Site Content ──────────────────────────────────────────────────────────────

export interface SiteContent {
  heroHeadline: string
  heroSubheadline: string
  aboutText: string[]
  aboutShort: string
  aboutHeadline: string
  groupPhoto: string
  serviceArea: string
  footerTagline: string
  ctaPrimaryLabel: string
  ctaSecondaryLabel: string
  contactEmail: string
  facebook: string
  instagram?: string
  youtube?: string
  appleMusic?: string
  spotify?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  metaKeywords?: string
}

// ── Media ─────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string
  poster?: string
  caption: string
  isFeatured?: boolean
  visible: boolean
}

// ── EPK ───────────────────────────────────────────────────────────────────────

export interface EpkContent {
  tagline: string
  bookerIntro: string
  repertoire: { era: string; artists: string }[]
  techSpecs: { label: string; value: string }[]
  setlists?: { title: string; songs: string[] }[]
  pressQuotes?: string[]
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'New'
  | 'Contacted'
  | 'Quote Sent'
  | 'Follow-up'
  | 'Negotiating'
  | 'Confirmed'
  | 'Advance Sent'
  | 'Paid'
  | 'Completed'
  | 'Lost'
  | 'Archived'

export interface BookingRequest {
  id: string
  fullName: string
  venueOrOrg: string
  email: string
  phone: string
  eventDate: string
  city: string
  eventType: string
  budgetRange: string
  guestCount: string
  message: string
  source: string
  status: BookingStatus
  quoteAmount?: number
  assignedTo?: string
  followUpDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const bookingRequests: BookingRequest[] = []


// ── Subscribers ───────────────────────────────────────────────────────────────

export interface Subscriber {
  email: string
  joinedAt: string
}

export const subscribers: Subscriber[] = []

// ── Band Tasks ────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskCategory = 'show-prep' | 'outreach' | 'social' | 'rehearsal' | 'merch' | 'admin' | 'other'

export interface BandTask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
  createdAt: string
  completedAt?: string
}

export const TASK_CATEGORIES: { id: TaskCategory; label: string; emoji: string }[] = [
  { id: 'show-prep',  label: 'Show Prep',  emoji: '🎤' },
  { id: 'outreach',   label: 'Outreach',   emoji: '📣' },
  { id: 'social',     label: 'Social',     emoji: '📱' },
  { id: 'rehearsal',  label: 'Rehearsal',  emoji: '🎸' },
  { id: 'merch',      label: 'Merch',      emoji: '👕' },
  { id: 'admin',      label: 'Admin',      emoji: '📋' },
  { id: 'other',      label: 'Other',      emoji: '⚡' },
]

export const bandTasks: BandTask[] = []

// ── Song Stories ──────────────────────────────────────────────────────────────

export interface SongStory {
  id: string
  title: string
  verse: string
  verseRef: string
  story: string
  moment?: string
  spotifyUrl?: string
  appleUrl?: string
  youtubeUrl?: string
  order: number
  visible: boolean
  createdAt: string
}

export const songStories: SongStory[] = [
  {
    id: 'ss-1',
    title: 'For Those That Remain',
    verse: '"Your loss is our loss too. And your pain — we feel it through and through."',
    verseRef: 'For Those That Remain — Malachias',
    story: "Some songs are written for the ones who didn't make it home.\n\nThis one is written for the ones who did.\n\nFor the families still setting a place at the table. For the brothers carrying the weight of the ones who aren't here. For anyone standing in the gap between who they were before and who they have to be now.\n\nWe got your six. Every day. Every night.",
    moment: 'Fort Wayne',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 1,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-2',
    title: 'Falling Down',
    verse: '"He gives strength to the weary and increases the power of the weak."',
    verseRef: 'Isaiah 40:29',
    story: "Coming soon — the story behind this one.",
    order: 2,
    visible: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-3',
    title: 'Adrenaline',
    verse: '"I can do all this through him who gives me strength."',
    verseRef: 'Philippians 4:13',
    story: "Coming soon — the story behind this one.",
    order: 3,
    visible: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-4',
    title: 'Rise Above',
    verse: '"But those who hope in the Lord will renew their strength."',
    verseRef: 'Isaiah 40:31',
    story: "Coming soon — the story behind this one.",
    order: 4,
    visible: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// ── Daily Reflections ─────────────────────────────────────────────────────────

export interface DailyReflection {
  id: string
  date: string
  verse: string
  verseRef: string
  reflection: string
  suggestedSong?: string
  createdAt: string
}

export const dailyReflections: DailyReflection[] = [
  {
    id: 'dr-1',
    date: '2026-06-13',
    verse: '"The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."',
    verseRef: 'Psalm 23:1–3',
    reflection: "After two tours, I came home needing to be led somewhere quiet. The Army trains you to be moving, scanning, ready. Psalm 23 is the antidote to that state — not because it promises no danger, but because it promises presence through it. Rest isn't weakness. It's where restoration happens.",
    suggestedSong: 'The Messenger',
    createdAt: '2026-06-13T06:00:00Z',
  },
]

// ── Admin Notes ───────────────────────────────────────────────────────────────

export type AdminNotePriority = 'normal' | 'high'

export interface AdminNote {
  id: string
  text: string
  done: boolean
  priority: AdminNotePriority
  createdAt: string
}

// ── Email Templates ───────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string
  slug: string
  name: string
  subject: string
  bodyHtml: string
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export type AutoReplyStatus = 'scheduled' | 'sent' | 'failed' | 'skipped'

export interface AutoReplyLog {
  id: string
  bookingId: string
  scheduledAt: string
  sentAt?: string
  resendEmailId?: string
  status: AutoReplyStatus
  errorMessage?: string
}

// ── Venue Finder ──────────────────────────────────────────────────────────────

export type VenueStatus =
  | 'New'
  | 'Reviewed'
  | 'Contact Added'
  | 'Draft Ready'
  | 'Sent'
  | 'Follow-up'
  | 'Interested'
  | 'Not Interested'
  | 'Booked'
  | 'Archived'

export interface VenueActivity {
  ts: string
  text: string
}

export interface Venue {
  id: string
  placeId: string
  name: string
  address: string
  website?: string
  phone?: string
  rating?: number
  types: string[]
  status: VenueStatus
  contactEmail?: string
  notes?: string
  assignedTo?: string
  followUpDate?: string
  lastContactedAt?: string
  activityLog?: VenueActivity[]
  createdAt: string
  updatedAt: string
}

export interface OutreachLog {
  id: string
  venueId: string
  venueName: string
  toEmail: string
  subject: string
  bodyHtml: string
  templateId: string
  templateSlug: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

export interface BookingEmailLog {
  id: string
  entityType: 'booking'
  entityId: string
  toEmail: string
  subject: string
  bodyHtml: string
  templateId: string
  templateSlug: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

export interface InboundEmail {
  id: string
  fromEmail: string
  fromName?: string
  toEmail: string
  subject: string
  bodyText?: string
  bodyHtml?: string
  receivedAt: string
  entityType?: 'booking' | 'venue'
  entityId?: string
  read: boolean
  resendMessageId?: string
}

export interface SentEmail {
  id: string
  toEmail: string
  toName?: string
  subject: string
  bodyHtml: string
  bodyText?: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

export interface VenueStore {
  venues: Venue[]
  outreachLogs: OutreachLog[]
  emailTemplates: EmailTemplate[]
  autoReplyLogs: AutoReplyLog[]
  bookingEmailLogs: BookingEmailLog[]
  inboundEmails: InboundEmail[]
  sentEmails: SentEmail[]
  dripCampaigns: DripCampaign[]
  dripEnrollments: DripEnrollment[]
}

// ── Drip Campaigns ────────────────────────────────────────────────────────────

export interface DripStep {
  day: number
  templateSlug: string
}

export interface DripCampaign {
  id: string
  name: string
  description?: string
  trigger: 'booking-new' | 'manual'
  steps: DripStep[]
  active: boolean
  createdAt: string
}

export interface DripEnrollment {
  id: string
  campaignId: string
  entityType: 'booking'
  entityId: string
  toEmail: string
  entityName: string
  enrolledAt: string
  completedSteps: number[]
  status: 'active' | 'completed' | 'paused' | 'unsubscribed'
}

export interface PlaceSearchResult {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  types: string[]
}

// ── Default Data ──────────────────────────────────────────────────────────────

export const shows: Show[] = []

export const merch: MerchItem[] = [
  {
    id: '1',
    name: '"Faith Through Fire" Pullover Hoodie',
    price: 55,
    category: 'apparel',
    available: false,
    visible: true,
    atShows: true,
    story: 'Named after the song we wrote during the hardest season. Heavy cotton. Made to last.',
    description: 'Limited run of 100. Heavy 12oz fleece, kangaroo pocket, embroidered crest. Black.',
    specs: [
      { label: 'Fabric', value: '80/20 cotton-poly fleece, 12 oz' },
      { label: 'Fit', value: 'Unisex — relaxed' },
      { label: 'Print', value: 'Embroidered crest + back print' },
      { label: 'Color', value: 'Black only' },
      { label: 'Run', value: 'Limited — 100 units' },
    ],
  },
  {
    id: '2',
    name: '"No Man Left Behind" Field Tee',
    price: 28,
    category: 'apparel',
    available: false,
    visible: true,
    atShows: true,
    story: 'For the brothers who showed up. Chest graphic. Black on black.',
    description: 'Pre-shrunk cotton. Chest left graphic, oversized back print. Built for the field.',
    specs: [
      { label: 'Fabric', value: '100% pre-shrunk cotton, 6 oz' },
      { label: 'Fit', value: 'Unisex — slightly relaxed' },
      { label: 'Print', value: 'Direct-to-garment (DTG)' },
      { label: 'Color', value: 'Black only' },
    ],
  },
  {
    id: '3',
    name: '"Malachi 3:1" Field Patch Set',
    price: 18,
    category: 'accessories',
    available: false,
    visible: true,
    atShows: true,
    story: 'Embroidered. Iron-on. Malachias crest, a cross, and the scripture that started all of this.',
    description: '3-patch set. Embroidered, iron-on backing. Limited to 200 sets.',
    specs: [
      { label: 'Quantity', value: '3 patches per set' },
      { label: 'Material', value: 'Embroidered twill' },
      { label: 'Backing', value: 'Iron-on' },
      { label: 'Run', value: 'Limited — 200 sets' },
    ],
  },
  {
    id: '4',
    name: '"The Messenger" Debut LP',
    price: 30,
    category: 'music',
    available: false,
    visible: true,
    story: 'When the record is done. 12-inch. Limited first pressing.',
    description: 'Debut LP on vinyl. Limited first pressing. Pre-order list forming now.',
    specs: [
      { label: 'Format', value: '12-inch vinyl' },
      { label: 'Pressing', value: 'First run — limited' },
      { label: 'Color', value: 'Standard black' },
    ],
  },
]

export const bandMembers: BandMember[] = [
  {
    id: '1',
    name: 'The Founder',
    role: 'Founder · Guitar · Vocals',
    branch: 'U.S. Army',
    tours: 'OIF I · OIF II',
    bio: "Fort Wayne, Indiana. Indiana Army National Guard from 1994 to 2003 — medic first, then infantryman. Active duty Army from 2006 to 2014, deploying twice to Iraq: once as a medic, once as an Army bandsman.\n\nI accepted Jesus as my Savior in fifth grade at a Vacation Bible School. Raised in a home that didn't go to church, didn't pray, didn't talk about God. I came home from that summer and spent the next few decades trying to figure out what that moment actually meant — through two failed marriages, a DUI, years that wore me down. When I deployed to Iraq I found myself reaching deep into my faith. In 2011 I converted to Messianic Christian.\n\nMalachias came out of all of it. The mission is specific: reduce suicidal ideation, lift people from depression, help heal and lessen the triggers PTSD leaves behind. The music is for people who are real, who struggle with their faith, and who want to grow and heal.",
    visible: true,
  },
]

export const siteContent: SiteContent = {
  heroHeadline: 'WE PLAY FOR THE ONES WHO NEED IT MOST.',
  heroSubheadline: 'Music forged in faith. Carried through fire. For anyone still fighting their way back.',
  aboutHeadline: 'THE STORY',
  aboutShort: 'Born in Fort Wayne, Indiana. Founded by a U.S. Army veteran. Malachias plays Christian rock with a mission: reduce suicidal ideation, lift people from depression, help heal the wounds PTSD leaves behind.',
  groupPhoto: '/Malachias.PNG',
  aboutText: [
    "Fort Wayne, Indiana. That's where this started.",
    "The founder served in the Indiana Army National Guard from 1994 to 2003 — first as a medic, then as an infantryman. Then active duty Army from 2006 to 2014, deploying twice to Iraq. Once as a medic. Once as an Army bandsman. Music and war in the same life.",
    "He accepted Jesus as his Savior in fifth grade at a Vacation Bible School. Raised in a home that didn't go to church, didn't pray, didn't talk about God. Spent years trying to figure out what that moment meant — through hard years, two failed marriages, a DUI. When he deployed to Iraq he found himself reaching back into that faith. In 2011 he converted to Messianic Christian.",
    "Malachias came out of all of it. The mission is specific: reduce suicidal ideation, lift people from depression, help heal and lessen the triggers PTSD leaves behind. The music is for people who are real, who struggle with their faith, and who want to grow and heal.",
  ],
  serviceArea: 'United States',
  footerTagline: 'Fort Wayne. Faith. Two tours. One mission.',
  ctaPrimaryLabel: 'Book Malachias',
  ctaSecondaryLabel: 'View Press Kit',
  contactEmail: 'booking@malachiasmusic.com',
  facebook: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/malachiasmusic',
  youtube: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
  appleMusic: 'https://music.apple.com/us/artist/malachias/937313536',
  spotify: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
  metaDescription: 'Malachias is a Christian rock band founded by a U.S. Army veteran from Fort Wayne, Indiana. Music with a mission: healing suicidal ideation, depression, and PTSD through faith.',
  ogTitle: 'MALACHIAS — Christian Rock. Veteran Mission. Fort Wayne, Indiana.',
}

export const mediaItems: MediaItem[] = []

export const epkContent: EpkContent = {
  tagline: 'Christian Rock · Veteran-Founded · Faith Through Fire',
  bookerIntro: 'Contact us directly for availability, set length, and technical requirements. We play churches, military events, veteran support gatherings, and community stages.',
  repertoire: [
    { era: 'Faith', artists: 'Original faith-driven rock. Songs about doubt, redemption, survival, and hope.' },
    { era: 'Healing', artists: 'Music for veterans, trauma survivors, and anyone fighting their way back.' },
    { era: 'Brotherhood', artists: 'Songs about not leaving people behind. On stage and off.' },
  ],
  techSpecs: [
    { label: 'Set Length', value: '45 min · 1 hr · Full set (custom)' },
    { label: 'Setup Time', value: '90 minutes prior to show' },
    { label: 'Soundcheck', value: '30 minutes' },
    { label: 'PA System', value: 'Self-contained or house PA accepted' },
    { label: 'Stage Required', value: '12ft × 10ft minimum' },
    { label: 'Power', value: '2 × 20A circuits minimum' },
    { label: 'Special', value: 'Available for outdoor events, churches, VFW halls' },
  ],
}

export function formatDate(isoDate: string): {
  day: string; month: string; year: string; full: string; weekday: string
} {
  const date = new Date(isoDate + 'T00:00:00')
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    full: date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }),
  }
}
