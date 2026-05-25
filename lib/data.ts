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

// ── Song Requests ─────────────────────────────────────────────────────────────

export type SongRequestStatus = 'New' | 'Review' | 'Consider' | 'Added' | 'Declined'

export interface SongRequest {
  id: string
  fullName: string
  email: string
  eventDate?: string
  song1: string
  song2?: string
  song3?: string
  notes?: string
  bookingRequestId?: string
  status: SongRequestStatus
  createdAt: string
  updatedAt: string
}

export const songRequests: SongRequest[] = []

// ── Subscribers ───────────────────────────────────────────────────────────────

export interface Subscriber {
  email: string
  joinedAt: string
}

export const subscribers: Subscriber[] = []

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
  entityType: 'booking' | 'song-request'
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
  entityType?: 'booking' | 'venue' | 'song-request'
  entityId?: string
  read: boolean
  resendMessageId?: string
}

export interface VenueStore {
  venues: Venue[]
  outreachLogs: OutreachLog[]
  emailTemplates: EmailTemplate[]
  autoReplyLogs: AutoReplyLog[]
  bookingEmailLogs: BookingEmailLog[]
  inboundEmails: InboundEmail[]
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
    bio: "Veteran. Came home from deployment changed, the way it changes most people who go. The transition took years — figuring out who he was without the uniform, without the mission structure, without the brothers who kept him standing. Music cracked something open in that time. Faith came through the crack. He started Malachias because he needed a mission, and because there are people in every room who need to hear something real. He plays guitar, writes every original, and fronts every show with the same thing he had on his hardest nights: nothing to prove and nothing left to lose.",
    visible: true,
  },
]

export const siteContent: SiteContent = {
  heroHeadline: 'WE PLAY FOR THE ONES WHO NEED IT MOST.',
  heroSubheadline: 'Music forged in faith. Carried through fire. For anyone still fighting their way back.',
  aboutHeadline: 'THE STORY',
  aboutShort: 'Founded by a U.S. Army veteran. Malachias plays Christian rock for the people in the room who need to hear something true.',
  groupPhoto: '/Malachias.PNG',
  aboutText: [
    "Malachias was started by a U.S. Army veteran who came back from deployment changed, the way most veterans do. Music and faith were the two things that still made sense in the aftermath — so he started a band.",
    "We play Christian rock. Loud, honest music that comes from real places. Songs about doubt, struggle, redemption, and the kind of hope that doesn't come easy.",
    "We're a small band, still growing. But every show we play is for the people in the room who need to hear something true tonight.",
  ],
  serviceArea: 'United States',
  footerTagline: 'Christian rock forged in faith. Every stage is a mission.',
  ctaPrimaryLabel: 'Book Malachias',
  ctaSecondaryLabel: 'View Press Kit',
  contactEmail: 'booking@malachias.com',
  facebook: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/malachiasmusic',
  youtube: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
  appleMusic: 'https://music.apple.com/us/artist/malachias/937313536',
  spotify: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
  metaDescription: 'Malachias is a Christian rock band founded by a U.S. Army veteran. Music forged in faith, healing through brotherhood.',
  ogTitle: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
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
