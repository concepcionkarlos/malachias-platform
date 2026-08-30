// Road to San Antonio — Veterans Day 2026 fundraising campaign.
//
// This file is the ONE place campaign facts live: goal, event, Cash App identity,
// sponsor tiers, donation anchors, milestones, lifecycle copy. It is safe to import
// from client components (no fs / store access — see lib/campaignServer.ts for the
// server-side merge with the admin-editable overrides).
//
// How money is tracked: Cash App has no safe public API, so `raised` is entered by
// hand in the admin ("Road to San Antonio" section) after reconciling the Cash App
// activity. Nothing on the site pretends to be real-time. See docs/road-to-san-antonio/ADMIN.md.

export type CampaignStatus = 'prelaunch' | 'active' | 'funded' | 'traveling' | 'event-day' | 'completed'

export interface CashAppInfo {
  displayName: string   // name shown inside Cash App for the recipient
  cashtag: string       // "$AWarriorsGarden"
  url: string           // verified public pay link — https://cash.app/$cashtag
  qrImage: string       // path under /public; rendered only when the file exists
}

export interface BudgetLine { label: string; note: string }

export interface CampaignConfig {
  path: string
  title: string
  eyebrow: string
  headline: string
  subheadline: string
  eventName: string
  eventDate: string        // YYYY-MM-DD
  eventCity: string
  eventVenue: string       // '' until the organizer confirms it may be published
  goal: number             // USD
  raised: number           // USD — updated by hand after reconciling Cash App
  raisedAsOf: string       // YYYY-MM-DD of the last reconciliation ('' = never)
  status: CampaignStatus
  travelers: number        // people the budget must move
  cashApp: CashAppInfo
  donateUrl: string           // secure donation platform (Givebutter) — '' until an official link exists
  nonprofitVerified: boolean  // only true once the recipient's nonprofit status is documented; gates any tax wording
  sponsorEmail: string
  merchCollectionSlug: string   // Fourthwall collection that holds campaign merch
  shareText: string
  budgetLines: BudgetLine[]
  plannedEpisodes: string[]     // the content-hub roadmap (titles only)
}

// Fields the admin can override from the dashboard. Everything else stays in code.
export type CampaignOverrides = Partial<Pick<CampaignConfig,
  'goal' | 'raised' | 'raisedAsOf' | 'status' | 'eventVenue' | 'headline' | 'subheadline' | 'travelers' | 'donateUrl' | 'nonprofitVerified'
>> & { cashApp?: Partial<CashAppInfo> }

// In-kind support (a sponsor covering flights, rooms, a van, gear, meals). Tracked
// separately from cash: confirmed items lower what the campaign still needs.
export interface InKindItem {
  id: string
  category: 'Travel' | 'Lodging' | 'Transportation' | 'Meals' | 'Gear' | 'Other'
  sponsor: string
  description: string
  value: number         // USD equivalent
  confirmed: boolean    // only confirmed items count publicly
  addedAt: string
}

export type SponsorTierId = 'supporter' | 'bronze' | 'silver' | 'gold' | 'presenting'

export interface Sponsor {
  id: string
  name: string
  tier: SponsorTierId
  category?: string     // "Official Travel Sponsor" etc.
  url?: string
  logo?: string         // uploaded via admin (Vercel Blob) or a /public path
  visible: boolean
  addedAt: string
}

export interface CampaignUpdate {
  id: string
  episode: number
  title: string
  date: string          // YYYY-MM-DD
  body: string          // plain text, paragraphs separated by blank lines
  mediaUrl?: string     // YouTube / Instagram / image URL
  published: boolean
}

export type SponsorInquiryStatus = 'new' | 'contacted' | 'confirmed' | 'declined'

export interface SponsorInquiry {
  id: string
  name: string
  organization: string
  email: string
  phone: string
  website: string
  level: string
  message: string
  status: SponsorInquiryStatus
  createdAt: string
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const CAMPAIGN: CampaignConfig = {
  path: '/road-to-san-antonio',
  title: 'Road to San Antonio',
  eyebrow: 'Veterans Day 2026 · San Antonio, Texas',
  headline: 'Help us bring the full band to San Antonio',
  subheadline:
    "Malachias has been invited to perform at a Veterans Day event dedicated to honoring America's veterans. Help us get the full band there.",
  eventName: 'Veterans Day 2026',
  eventDate: '2026-11-12',
  eventCity: 'San Antonio, Texas',
  eventVenue: '',
  goal: 12000,
  raised: 0,
  raisedAsOf: '',
  status: 'active',
  travelers: 5,
  cashApp: {
    displayName: 'Warfighter Gardens',
    cashtag: '$AWarriorsGarden',
    url: 'https://cash.app/$AWarriorsGarden',
    qrImage: '/warfighter-gardens-cashapp-qr.jpg',
  },
  donateUrl: '',
  nonprofitVerified: false,
  sponsorEmail: 'booking@malachiasmusic.com',
  merchCollectionSlug: 'road-to-san-antonio',
  shareText: 'Help Malachias bring the full band to San Antonio for Veterans Day 2026.',
  budgetLines: [
    { label: 'Travel',                  note: 'Round-trip airfare for the band' },
    { label: 'Lodging',                 note: 'Hotel nights around the event' },
    { label: 'Instrument baggage',      note: 'Checked instruments and cases' },
    { label: 'Local transportation',    note: 'Airport, hotel, venue' },
    { label: 'Meals',                   note: 'Per diem on travel days' },
    { label: 'Production / equipment',  note: 'Backline the event does not supply' },
    { label: 'Campaign fees',           note: 'Payment processing and merch costs' },
    { label: 'Contingency',             note: 'The unplanned — flights change, gear breaks' },
  ],
  plannedEpisodes: [
    'We Got Invited',
    'Why Veterans Day Matters',
    'Meet the Band',
    'Rehearsal',
    '25% Funded',
    'Meet Our Sponsors',
    'Halfway There',
    'Preparing for Texas',
    'Final Rehearsal',
    'We Made It',
  ],
}

// ── Internal budget model (never rendered publicly) ──────────────────────────
// Planning numbers for FIVE musicians (a new drummer joined). Replace with real
// quotes as they arrive; the public goal stays at CAMPAIGN.goal until approved.
export interface BudgetLine2 { key: string; label: string; perMusician?: number; fixed?: number; note: string }
export const BUDGET_MODEL: BudgetLine2[] = [
  { key: 'airfare',   label: 'Airfare (round trip)',          perMusician: 500, note: '$400–600 per musician, FLL/MIA → SAT' },
  { key: 'baggage',   label: 'Instrument / checked baggage',  perMusician: 150, note: 'Guitars, pedalboards, cases' },
  { key: 'hotel',     label: 'Hotel',                          fixed: 1500,      note: '~3 nights, shared rooms' },
  { key: 'meals',     label: 'Food / per diem',                perMusician: 180, note: '3 travel days' },
  { key: 'transport', label: 'Local transportation',           fixed: 600,       note: 'Rental van / rides: airport, hotel, venue' },
  { key: 'artist',    label: 'Artist compensation',            perMusician: 500, note: 'Modest base; scenario B/C raise it' },
]
export const BUDGET_CONTINGENCY = 0.10
export const BUDGET_SCENARIOS = [
  { id: 'minimum',  name: 'Minimum mission',                  target: 12000, artistPerMusician: 500,  note: 'Current public goal. Gets five musicians there, modest artist support.' },
  { id: 'full',     name: 'Fully supported mission',          target: 15000, artistPerMusician: 1000, note: 'Adds backline/gear allowance and fuller artist support.' },
  { id: 'strong',   name: 'Full mission · stronger comp',     target: 19000, artistPerMusician: 1800, note: '$18–20k. Compensation closer to a professional date.' },
] as const

export function budgetTotal(travelers: number, artistPerMusician = 500) {
  const lines = BUDGET_MODEL.map(l => {
    const perM = l.key === 'artist' ? artistPerMusician : (l.perMusician ?? 0)
    const amount = l.fixed ?? perM * travelers
    return { ...l, amount }
  })
  const subtotal = lines.reduce((s, l) => s + l.amount, 0)
  const contingency = Math.round(subtotal * BUDGET_CONTINGENCY)
  return { lines, subtotal, contingency, total: subtotal + contingency }
}

// Verified-support ledger: every dollar that counts toward the public "raised"
// number has a row with its source and the reconciliation note. Cash sources add
// up to `raised`; in-kind stays separate (InKindItem). When the ledger has rows it
// is the source of truth and the manual `raised` override is ignored.
export type LedgerSource = 'givebutter' | 'cashapp' | 'merch' | 'sponsor-cash'
export const LEDGER_SOURCE_LABEL: Record<LedgerSource, string> = {
  givebutter: 'Givebutter donations', cashapp: 'Cash App donations', merch: 'Merch net contribution', 'sponsor-cash': 'Cash sponsorships',
}
export interface LedgerEntry {
  id: string
  date: string          // YYYY-MM-DD of the reconciliation
  source: LedgerSource
  amount: number        // USD, net of fees as received
  note: string          // "Givebutter payout #…", "Cash App activity Aug 25–31", sponsor name…
}
export const ledgerTotals = (rows: LedgerEntry[]) => {
  const by: Record<LedgerSource, number> = { givebutter: 0, cashapp: 0, merch: 0, 'sponsor-cash': 0 }
  for (const r of rows) by[r.source] += Math.max(0, r.amount)
  return { by, total: Object.values(by).reduce((s, n) => s + n, 0) }
}

// Peer-to-peer: each traveling musician's personal Givebutter team page. Empty
// until the team campaign exists; all links feed the same campaign total.
export interface PeerLink { id: string; name: string; role: string; url: string; visible: boolean }

export const inKindTotal = (items: InKindItem[]) => items.filter(i => i.confirmed).reduce((s, i) => s + Math.max(0, i.value), 0)

// Suggested contribution anchors. Each one links to `cash.app/$cashtag/<amount>`
// (see cashAppPayUrl); Cash App opens with the amount filled in (verified on iPhone, 2026-08-29).
export const DONATION_LEVELS = [
  { amount: 10,  label: 'Supporter' },
  { amount: 25,  label: 'Road Crew' },
  { amount: 50,  label: 'Veterans Day Supporter' },
  { amount: 100, label: 'Mission Supporter' },
  { amount: 250, label: 'Founding Supporter' },
] as const

export interface SponsorTier {
  id: SponsorTierId
  name: string
  amount: number | null   // null = custom
  benefits: string[]
}

// Benefits are limited to things the band controls (its own page, socials, content).
// Nothing about event signage or stage announcements — that is the organizer's to give.
export const SPONSOR_TIERS: SponsorTier[] = [
  { id: 'supporter', name: 'Supporter', amount: 250, benefits: [
    'Business or organization name on the campaign page',
    'Thank-you in the campaign wrap-up',
  ] },
  { id: 'bronze', name: 'Bronze Sponsor', amount: 500, benefits: [
    'Logo on the campaign page',
    'Social media thank-you',
    'Sponsor listing',
  ] },
  { id: 'silver', name: 'Silver Sponsor', amount: 1000, benefits: [
    'Prominent logo placement on the campaign page',
    'Social media recognition',
    'Acknowledgment in campaign content',
    'Sponsor listing with link',
  ] },
  { id: 'gold', name: 'Gold Sponsor', amount: 2500, benefits: [
    'Premium logo placement on the campaign page',
    'Major social recognition',
    'Featured sponsor placement',
    'Inclusion in selected campaign videos and posts',
  ] },
  { id: 'presenting', name: 'Presenting Partner', amount: null, benefits: [
    'Custom partnership — travel, hotel, transportation, gear or meals',
    'Recognition shaped around what you make possible',
    'Contact us to build it together',
  ] },
]

export const SPONSOR_CATEGORIES = [
  'Official Travel Sponsor',
  'Hotel Sponsor',
  'Transportation Sponsor',
  'Gear Sponsor',
  'Meal Sponsor',
  'Road to San Antonio Presenting Partner',
]

// Options offered in the sponsor inquiry form — validated server-side against this list.
export const SPONSOR_LEVEL_OPTIONS = [
  '$250 Supporter',
  '$500 Bronze',
  '$1,000 Silver',
  '$2,500 Gold',
  'Travel Sponsor',
  'Hotel Sponsor',
  'Transportation Sponsor',
  'Gear Sponsor',
  'Custom Sponsorship',
] as const

export const MILESTONES = [
  { at: 25,  title: 'The road has started' },
  { at: 50,  title: 'Halfway to San Antonio' },
  { at: 75,  title: "We're getting close" },
  { at: 90,  title: 'Final push' },
  { at: 100, title: 'San Antonio — here we come' },
] as const

export const STATUS_COPY: Record<CampaignStatus, { label: string; headline: string; note: string }> = {
  prelaunch:   { label: 'Coming soon',     headline: 'The road to San Antonio starts soon',  note: 'Campaign launches shortly. Follow along.' },
  active:      { label: 'Campaign active', headline: 'Help us bring the full band to San Antonio', note: '' },
  funded:      { label: 'Funded',          headline: 'San Antonio — here we come',          note: 'Goal reached. Anything beyond it covers the unexpected and the next mission.' },
  traveling:   { label: 'On the road',     headline: "We're on our way to Texas",            note: 'Follow the trip in the updates below.' },
  'event-day': { label: 'Today',           headline: "It's Veterans Day. We're in San Antonio.", note: 'Thank you for getting us here.' },
  completed:   { label: 'Completed',       headline: 'We made it to San Antonio',           note: 'Thank you to every supporter and sponsor who built this road.' },
}

// ── Pure helpers ─────────────────────────────────────────────────────────────

export function campaignMath(c: Pick<CampaignConfig, 'goal' | 'raised' | 'eventDate' | 'status'>, now = new Date()) {
  const goal = Math.max(0, c.goal)
  const raised = Math.max(0, c.raised)
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  const remaining = Math.max(0, goal - raised)
  const [y, m, d] = c.eventDate.split('-').map(Number)
  const event = Date.UTC(y, m - 1, d)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const daysToEvent = Math.round((event - today) / 86_400_000)
  const milestone = [...MILESTONES].reverse().find(ms => percent >= ms.at) ?? null
  // A manual status wins; an active campaign that reaches its goal reads as funded.
  const effectiveStatus: CampaignStatus =
    c.status === 'active' && goal > 0 && raised >= goal ? 'funded' : c.status
  return { goal, raised, percent, remaining, daysToEvent, milestone, effectiveStatus }
}

export const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/** Public pay link; with an amount, Cash App's `$cashtag/<amount>` form — the app opens with that amount filled in. */
export function cashAppPayUrl(cashApp: Pick<CashAppInfo, 'url'>, amount?: number): string {
  const base = cashApp.url.replace(/\/$/, '')
  return amount && amount > 0 ? `${base}/${Math.round(amount)}` : base
}

export function campaignUrl(siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, '')}${CAMPAIGN.path}`
}
