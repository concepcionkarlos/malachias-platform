import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { Venue, OutreachLog, EmailTemplate, AutoReplyLog, BookingEmailLog, InboundEmail, SentEmail, VenueStore, DripCampaign, DripEnrollment, Song, Rehearsal, Goal } from './data'

const VENUE_DATA_PATH = path.join(process.cwd(), 'data', 'venues.json')
const useKV = !!process.env.KV_REST_API_URL
const KV_KEYS = {
  venues: 'venues', outreachLogs: 'outreachLogs', emailTemplates: 'emailTemplates',
  autoReplyLogs: 'autoReplyLogs', bookingEmailLogs: 'bookingEmailLogs', inboundEmails: 'inboundEmails',
  sentEmails: 'sentEmails',
  songs: 'songs', rehearsals: 'rehearsals', goals: 'goals',
} as const

const DEFAULT_SONGS: Song[] = [
  { id: 's1',  title: "A Warrior's Garden",      type: 'original', status: 'ready', order: 1,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's2',  title: 'Introduction',             type: 'original', status: 'ready', order: 2,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's3',  title: 'Adrenaline',               type: 'original', status: 'ready', order: 3,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's4',  title: 'Falling Down',             type: 'original', status: 'ready', order: 4,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's5',  title: 'For Those That Remain',    type: 'original', status: 'ready', order: 5,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's6',  title: 'Rise Above',               type: 'original', status: 'ready', order: 6,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's7',  title: "Knocking on Heaven's Door", type: 'cover', originalArtist: "Bob Dylan / Guns N' Roses", status: 'ready', order: 7,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's8',  title: 'Something in the Way',     type: 'original', status: 'ready', order: 8,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's9',  title: 'Enter Sandman',            type: 'cover', originalArtist: 'Metallica',     status: 'ready', order: 9,  addedAt: '2026-06-14T00:00:00Z' },
  { id: 's10', title: 'Freedom',                  type: 'original', status: 'ready', order: 10, addedAt: '2026-06-14T00:00:00Z' },
  { id: 's11', title: 'Even Flow',                type: 'cover', originalArtist: 'Pearl Jam',     status: 'ready', order: 11, addedAt: '2026-06-14T00:00:00Z' },
  { id: 's12', title: 'My Kinda Party',           type: 'cover', originalArtist: 'Jason Aldean',  status: 'ready', order: 12, addedAt: '2026-06-14T00:00:00Z' },
]

function makeId() { return crypto.randomBytes(8).toString('hex') }
const now = () => new Date().toISOString()

// ── Malachias default email templates ──────────────────────────────────────────

const GOLD = '#c9a84c'
const DARK = '#030202'

function emailShell(body: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:${DARK};padding:24px 40px;border-bottom:2px solid ${GOLD};">
        <p style="margin:0;color:#e8ddd0;font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">MALACHIAS</p>
        <p style="margin:4px 0 0;color:rgba(201,168,76,0.65);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Christian Rock · Veteran Mission · Faith on Fire</p>
      </td></tr>
      <tr><td style="padding:40px;">${body}</td></tr>
      <tr><td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e8e0d5;">
        <p style="margin:0;font-size:11px;color:#999999;line-height:1.5;font-family:Arial,sans-serif;">Malachias · malachiasmusic.com · <a href="mailto:booking@malachiasmusic.com" style="color:#999999;">booking@malachiasmusic.com</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

const DEFAULT_DRIP_CAMPAIGNS: DripCampaign[] = [
  {
    id: 'drip-booking-default',
    name: 'New Booking Follow-up',
    description: 'Automatic 3-touch sequence for new booking inquiries (Day 2, 5, 10)',
    trigger: 'booking-new',
    active: true,
    steps: [
      { day: 2,  templateSlug: 'drip-booking-d2'  },
      { day: 5,  templateSlug: 'drip-booking-d5'  },
      { day: 10, templateSlug: 'drip-booking-d10' },
    ],
    createdAt: now(),
  },
]

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: makeId(), slug: 'booking-auto-reply', name: 'Booking Auto-Reply',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'We received your message, {{clientName}}.',
    bodyHtml: emailShell(`
        <h1 style="margin:0 0 16px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">We heard you.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}}, thank you for reaching out about <strong>{{eventType}}</strong> on <strong>{{eventDate}}</strong>.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We'll be in touch within 24–48 hours. We take every booking seriously — if you need us there, we'll figure it out together.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">In the meantime, you can learn more about us and hear the music at <a href="https://www.malachiasmusic.com" style="color:${GOLD};">malachiasmusic.com</a>.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong></p>`),
  },
  {
    id: makeId(), slug: 'booking-reply-initial', name: 'Booking Reply — Initial Contact',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Re: Your Booking Inquiry — Malachias',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Thank you for reaching out. We're glad you did. We'd love to be part of your event on <strong>{{eventDate}}</strong>.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Malachias is a Christian rock band founded by a U.S. Army veteran. We play original faith-driven rock — honest, loud, and built for rooms that need something real. We play churches, veteran events, community gatherings, and anywhere people need to hear music that means something.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">A few things that would help us put together a quote:</p>
        <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.9;color:#444444;font-family:Arial,sans-serif;">
          <li>Type of event and venue</li>
          <li>Approximate number of attendees</li>
          <li>Set length and any special requirements</li>
        </ul>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">You can also check our press kit at <a href="https://www.malachiasmusic.com" style="color:${GOLD};">malachiasmusic.com</a>.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong><br><a href="mailto:{{replyEmail}}" style="color:${GOLD};">{{replyEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'booking-reply-confirmed', name: 'Booking Reply — Confirmed',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: "You're confirmed — Malachias · {{eventDate}}",
    bodyHtml: emailShell(`
        <h1 style="margin:0 0 8px;font-size:26px;color:#111111;font-family:Arial,sans-serif;">Confirmed.</h1>
        <p style="margin:0 0 24px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">Malachias · {{eventDate}}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}}, we're in. We'll be there on <strong>{{eventDate}}</strong> and we're going to give everything we have.</p>
        <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.9;color:#444444;font-family:Arial,sans-serif;">
          <li>We'll reach out a few days before to confirm load-in and logistics</li>
          <li>Standard setup is 90 minutes before showtime</li>
          <li>We bring our own gear — no extra equipment needed from your end</li>
        </ul>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Questions between now and the show: <a href="mailto:{{replyEmail}}" style="color:${GOLD};">{{replyEmail}}</a></p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">See you on stage,<br><strong>Malachias</strong></p>`),
  },
  {
    id: makeId(), slug: 'drip-booking-d2', name: 'Drip — Day 2 Follow-up',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Quick question about your event, {{clientName}}',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Just checking in — we received your booking inquiry a couple days ago and wanted to make sure you didn't have any questions.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We'd love to be part of what you're planning. Malachias brings our own setup and we've been told we leave rooms different than we found them.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Would it help to hop on a quick call? Or if you'd like our full press kit, just reply here and we'll send it right over.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong><br><a href="mailto:{{replyEmail}}" style="color:${GOLD};">{{replyEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'drip-booking-d5', name: 'Drip — Day 5 Mission Touch',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'What Malachias actually does, {{clientName}}',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">I wanted to share something beyond the booking details.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Malachias was founded by a U.S. Army veteran with a specific mission: reduce suicidal ideation, lift people from depression, and help heal the wounds PTSD leaves behind. Our music is original, faith-driven rock — built for people who are real, who struggle but want to grow and heal.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We've played churches, veteran support events, and community stages. We bring our own PA and we're easy to work with. Every show, we put everything we have into the room.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">If the date is still on your radar, we'd be honored to be there.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong><br><a href="mailto:{{replyEmail}}" style="color:${GOLD};">{{replyEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'drip-booking-d10', name: 'Drip — Day 10 Final',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Last check-in, {{clientName}}',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">This is my last follow-up — I don't want to fill up your inbox.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">If the timing didn't work out or plans changed, no hard feelings at all. We'll still be here.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">But if the date is still alive and you'd like Malachias to be part of it, just reply to this email. We move fast.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">Either way — thank you for reaching out. The door is always open.<br><br>— <strong>Malachias</strong><br><a href="mailto:{{replyEmail}}" style="color:${GOLD};">{{replyEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'venue-first-outreach', name: 'Venue / Church First Outreach',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Christian Rock Band — Available for Bookings · {{venueName}}',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Hello {{venueName}} team,</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">My name is [Name], and I represent <strong>Malachias</strong> — a Christian rock band founded by a U.S. Army veteran, based in {{serviceArea}}.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We play original faith-driven rock — honest, loud, and built for people who need to hear something real. We've played churches, veteran support events, community gatherings, and small venues. We bring our own PA and are easy to work with.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Would {{venueName}} be open to discussing a booking? I'd love to send over our full press kit and available dates.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">Thank you,<br><strong>Malachias</strong><br><a href="mailto:{{contactEmail}}" style="color:${GOLD};">{{contactEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'venue-follow-up', name: 'Venue Follow-Up',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Following Up — Malachias at {{venueName}}',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Hello {{venueName}} team,</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">I reached out recently about bringing <strong>Malachias</strong> to your venue. Wanted to follow up in case my last message got buried.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We're a veteran-founded Christian rock band — original music, full live setup, available for churches, community events, and venues. If there are upcoming dates that might be a fit, I'd love to connect.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">Thank you,<br><strong>Malachias</strong><br><a href="mailto:{{contactEmail}}" style="color:${GOLD};">{{contactEmail}}</a></p>`),
  },
  {
    id: makeId(), slug: 'venue-thanks-booked', name: 'Thanks & Booked Confirmation',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'Confirmed — Malachias at {{venueName}} · {{eventDate}}',
    bodyHtml: emailShell(`
        <h1 style="margin:0 0 16px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">We're confirmed.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We're thrilled to be confirmed at <strong>{{venueName}}</strong> on <strong>{{eventDate}}</strong>. We'll give everything we have.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We'll be in touch closer to the show to coordinate load-in and logistics. Standard setup is 90 minutes before showtime.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Questions before then: <a href="mailto:{{contactEmail}}" style="color:${GOLD};">{{contactEmail}}</a></p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">See you on stage,<br><strong>Malachias</strong></p>`),
  },
]

function syncDefaultTemplates(existing: EmailTemplate[]): { templates: EmailTemplate[]; changed: boolean } {
  let changed = false
  // Update bodyHtml/subject of existing system templates when defaults change
  const updated = existing.map(t => {
    if (!t.isSystem) return t
    const def = DEFAULT_TEMPLATES.find(d => d.slug === t.slug)
    if (!def) return t
    if (def.bodyHtml !== t.bodyHtml || def.subject !== t.subject) {
      changed = true
      return { ...t, bodyHtml: def.bodyHtml, subject: def.subject, updatedAt: new Date().toISOString() }
    }
    return t
  })
  const existingSlugs = new Set(existing.map((t) => t.slug))
  const missing = DEFAULT_TEMPLATES.filter((t) => !existingSlugs.has(t.slug))
  if (missing.length > 0) changed = true
  return { templates: [...updated, ...missing], changed }
}

// ── Local FS ──────────────────────────────────────────────────────────────────

function readLocal(): VenueStore {
  try {
    const dir = path.dirname(VENUE_DATA_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(VENUE_DATA_PATH)) {
      const seed: VenueStore = { venues: [], outreachLogs: [], emailTemplates: DEFAULT_TEMPLATES, autoReplyLogs: [], bookingEmailLogs: [], inboundEmails: [], sentEmails: [], dripCampaigns: DEFAULT_DRIP_CAMPAIGNS, dripEnrollments: [], songs: DEFAULT_SONGS, rehearsals: [], goals: [] }
      fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(seed, null, 2))
      return seed
    }
    const raw = fs.readFileSync(VENUE_DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<VenueStore>
    let templates: EmailTemplate[] = parsed.emailTemplates ?? []
    let changed = false
    if (templates.length === 0) { templates = DEFAULT_TEMPLATES; changed = true }
    else { const sync = syncDefaultTemplates(templates); if (sync.changed) { templates = sync.templates; changed = true } }
    let dripCampaigns: DripCampaign[] = parsed.dripCampaigns ?? []
    if (dripCampaigns.length === 0) { dripCampaigns = DEFAULT_DRIP_CAMPAIGNS; changed = true }
    const store: VenueStore = {
      venues: parsed.venues ?? [], outreachLogs: parsed.outreachLogs ?? [],
      emailTemplates: templates, autoReplyLogs: parsed.autoReplyLogs ?? [],
      bookingEmailLogs: parsed.bookingEmailLogs ?? [], inboundEmails: parsed.inboundEmails ?? [],
      sentEmails: parsed.sentEmails ?? [],
      dripCampaigns, dripEnrollments: parsed.dripEnrollments ?? [],
      songs: (parsed.songs && parsed.songs.length > 0) ? parsed.songs : DEFAULT_SONGS, rehearsals: parsed.rehearsals ?? [], goals: parsed.goals ?? [],
    }
    if (changed) fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(store, null, 2))
    return store
  } catch {
    return { venues: [], outreachLogs: [], emailTemplates: DEFAULT_TEMPLATES, autoReplyLogs: [], bookingEmailLogs: [], inboundEmails: [], sentEmails: [], dripCampaigns: DEFAULT_DRIP_CAMPAIGNS, dripEnrollments: [], songs: DEFAULT_SONGS, rehearsals: [], goals: [] }
  }
}

function writeLocal(updates: Partial<VenueStore>): VenueStore {
  const current = readLocal()
  const merged = { ...current, ...updates }
  fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(merged, null, 2))
  return merged
}

// ── Vercel KV ─────────────────────────────────────────────────────────────────

async function readKV(): Promise<VenueStore> {
  const { kv } = await import('@vercel/kv')
  const [venues, outreachLogs, emailTemplates, autoReplyLogs, bookingEmailLogs, inboundEmails, dripCampaigns, dripEnrollments, sentEmails] = await Promise.all([
    kv.get<Venue[]>(KV_KEYS.venues), kv.get<OutreachLog[]>(KV_KEYS.outreachLogs),
    kv.get<EmailTemplate[]>(KV_KEYS.emailTemplates), kv.get<AutoReplyLog[]>(KV_KEYS.autoReplyLogs),
    kv.get<BookingEmailLog[]>(KV_KEYS.bookingEmailLogs), kv.get<InboundEmail[]>(KV_KEYS.inboundEmails),
    kv.get<DripCampaign[]>('dripCampaigns'), kv.get<DripEnrollment[]>('dripEnrollments'),
    kv.get<SentEmail[]>(KV_KEYS.sentEmails),
  ])
  let templates = emailTemplates ?? []
  if (templates.length === 0) { templates = DEFAULT_TEMPLATES; await kv.set(KV_KEYS.emailTemplates, templates) }
  else { const sync = syncDefaultTemplates(templates); if (sync.changed) { templates = sync.templates; await kv.set(KV_KEYS.emailTemplates, templates) } }
  let campaigns = dripCampaigns ?? []
  if (campaigns.length === 0) { campaigns = DEFAULT_DRIP_CAMPAIGNS; await kv.set('dripCampaigns', campaigns) }
  const [songs, rehearsals, goals] = await Promise.all([
    kv.get<Song[]>(KV_KEYS.songs), kv.get<Rehearsal[]>(KV_KEYS.rehearsals), kv.get<Goal[]>(KV_KEYS.goals),
  ])
  return { venues: venues ?? [], outreachLogs: outreachLogs ?? [], emailTemplates: templates, autoReplyLogs: autoReplyLogs ?? [], bookingEmailLogs: bookingEmailLogs ?? [], inboundEmails: inboundEmails ?? [], sentEmails: sentEmails ?? [], dripCampaigns: campaigns, dripEnrollments: dripEnrollments ?? [], songs: (songs && songs.length > 0) ? songs : DEFAULT_SONGS, rehearsals: rehearsals ?? [], goals: goals ?? [] }
}

async function writeKV(updates: Partial<VenueStore>): Promise<VenueStore> {
  const { kv } = await import('@vercel/kv')
  const current = await readKV()
  const merged = { ...current, ...updates }
  await Promise.all(Object.entries(updates).map(([key, value]) => kv.set(key, value)))
  return merged
}

export async function readVenueStore(): Promise<VenueStore> {
  return useKV ? readKV() : Promise.resolve(readLocal())
}

// ── Venues ────────────────────────────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const store = await readVenueStore()
  return store.venues.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function addVenue(venue: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue> {
  const store = await readVenueStore()
  const newVenue: Venue = { ...venue, id: makeId(), createdAt: now(), updatedAt: now() }
  const venues = [...store.venues, newVenue]
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
  return newVenue
}

export async function updateVenue(id: string, patch: Partial<Venue>): Promise<Venue> {
  const store = await readVenueStore()
  const idx = store.venues.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error(`Venue ${id} not found`)
  const updated: Venue = { ...store.venues[idx], ...patch, updatedAt: now() }
  const venues = store.venues.map((v) => (v.id === id ? updated : v))
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
  return updated
}

export async function deleteVenue(id: string): Promise<void> {
  const store = await readVenueStore()
  const venues = store.venues.filter((v) => v.id !== id)
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
}

// ── Email Templates ───────────────────────────────────────────────────────────

export async function getTemplates(): Promise<EmailTemplate[]> {
  const store = await readVenueStore(); return store.emailTemplates
}

export async function getTemplateBySlug(slug: string): Promise<EmailTemplate | undefined> {
  const store = await readVenueStore(); return store.emailTemplates.find((t) => t.slug === slug)
}

export async function createTemplate(data: Pick<EmailTemplate, 'name' | 'slug' | 'subject' | 'bodyHtml'>): Promise<EmailTemplate> {
  const store = await readVenueStore()
  const tmpl: EmailTemplate = { ...data, id: makeId(), isSystem: false, createdAt: now(), updatedAt: now() }
  const emailTemplates = [...store.emailTemplates, tmpl]
  useKV ? await writeKV({ emailTemplates }) : writeLocal({ emailTemplates })
  return tmpl
}

export async function deleteTemplate(id: string): Promise<void> {
  const store = await readVenueStore()
  const emailTemplates = store.emailTemplates.filter((t) => t.id !== id)
  useKV ? await writeKV({ emailTemplates }) : writeLocal({ emailTemplates })
}

export async function updateTemplate(id: string, patch: Partial<Pick<EmailTemplate, 'name' | 'subject' | 'bodyHtml'>>): Promise<EmailTemplate> {
  const store = await readVenueStore()
  const idx = store.emailTemplates.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error(`Template ${id} not found`)
  const updated: EmailTemplate = { ...store.emailTemplates[idx], ...patch, updatedAt: now() }
  const emailTemplates = store.emailTemplates.map((t) => (t.id === id ? updated : t))
  useKV ? await writeKV({ emailTemplates }) : writeLocal({ emailTemplates })
  return updated
}

// ── Outreach Logs ─────────────────────────────────────────────────────────────

export async function addOutreachLog(log: Omit<OutreachLog, 'id'>): Promise<OutreachLog> {
  const store = await readVenueStore()
  const newLog: OutreachLog = { ...log, id: makeId() }
  const outreachLogs = [...store.outreachLogs, newLog]
  useKV ? await writeKV({ outreachLogs }) : writeLocal({ outreachLogs })
  return newLog
}

export async function getOutreachLogsForVenue(venueId: string): Promise<OutreachLog[]> {
  const store = await readVenueStore()
  return store.outreachLogs.filter((l) => l.venueId === venueId).sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

// ── Auto-Reply Logs ───────────────────────────────────────────────────────────

export async function getAutoReplyLogForBooking(bookingId: string): Promise<AutoReplyLog | undefined> {
  const store = await readVenueStore(); return store.autoReplyLogs.find((l) => l.bookingId === bookingId)
}

export async function addAutoReplyLog(log: Omit<AutoReplyLog, 'id'>): Promise<AutoReplyLog> {
  const store = await readVenueStore()
  const newLog: AutoReplyLog = { ...log, id: makeId() }
  const autoReplyLogs = [...store.autoReplyLogs, newLog]
  useKV ? await writeKV({ autoReplyLogs }) : writeLocal({ autoReplyLogs })
  return newLog
}

export async function updateAutoReplyLog(id: string, patch: Partial<AutoReplyLog>): Promise<AutoReplyLog> {
  const store = await readVenueStore()
  const idx = store.autoReplyLogs.findIndex((l) => l.id === id)
  if (idx === -1) throw new Error(`AutoReplyLog ${id} not found`)
  const updated: AutoReplyLog = { ...store.autoReplyLogs[idx], ...patch }
  const autoReplyLogs = store.autoReplyLogs.map((l) => (l.id === id ? updated : l))
  useKV ? await writeKV({ autoReplyLogs }) : writeLocal({ autoReplyLogs })
  return updated
}

// ── Booking / Song-Request Email Logs ─────────────────────────────────────────

export async function addBookingEmailLog(log: Omit<BookingEmailLog, 'id'>): Promise<BookingEmailLog> {
  const store = await readVenueStore()
  const newLog: BookingEmailLog = { ...log, id: makeId() }
  const bookingEmailLogs = [...(store.bookingEmailLogs ?? []), newLog]
  useKV ? await writeKV({ bookingEmailLogs }) : writeLocal({ bookingEmailLogs })
  return newLog
}

export async function getBookingEmailLogs(entityType: 'booking', entityId: string): Promise<BookingEmailLog[]> {
  const store = await readVenueStore()
  return (store.bookingEmailLogs ?? []).filter((l) => l.entityType === entityType && l.entityId === entityId).sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

// ── Inbound Emails ────────────────────────────────────────────────────────────

export async function addInboundEmail(email: Omit<InboundEmail, 'id'>): Promise<InboundEmail> {
  const store = await readVenueStore()
  const newEmail: InboundEmail = { ...email, id: makeId() }
  const inboundEmails = [...(store.inboundEmails ?? []), newEmail]
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
  return newEmail
}

export async function getInboundEmails(): Promise<InboundEmail[]> {
  const store = await readVenueStore()
  return (store.inboundEmails ?? []).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
}

export async function markInboundEmailRead(id: string): Promise<void> {
  const store = await readVenueStore()
  const inboundEmails = (store.inboundEmails ?? []).map((e) => e.id === id ? { ...e, read: true } : e)
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
}

export async function markAllInboundEmailsRead(): Promise<void> {
  const store = await readVenueStore()
  const inboundEmails = (store.inboundEmails ?? []).map((e) => ({ ...e, read: true }))
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
}

export async function deleteInboundEmail(id: string): Promise<void> {
  const store = await readVenueStore()
  const inboundEmails = (store.inboundEmails ?? []).filter((e) => e.id !== id)
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
}

// ── Sent Emails ───────────────────────────────────────────────────────────────

export async function addSentEmail(email: Omit<SentEmail, 'id'>): Promise<SentEmail> {
  const store = await readVenueStore()
  const newEmail: SentEmail = { ...email, id: makeId() }
  const sentEmails = [newEmail, ...(store.sentEmails ?? [])]
  useKV ? await writeKV({ sentEmails }) : writeLocal({ sentEmails })
  return newEmail
}

export async function getSentEmails(): Promise<SentEmail[]> {
  const store = await readVenueStore()
  return store.sentEmails ?? []
}

export async function deleteSentEmail(id: string): Promise<void> {
  const store = await readVenueStore()
  const sentEmails = (store.sentEmails ?? []).filter((e) => e.id !== id)
  useKV ? await writeKV({ sentEmails }) : writeLocal({ sentEmails })
}

// ── Drip Campaigns ────────────────────────────────────────────────────────────

export async function getDripCampaigns(): Promise<DripCampaign[]> {
  const store = await readVenueStore()
  return store.dripCampaigns
}

export async function updateDripCampaign(id: string, patch: Partial<DripCampaign>): Promise<DripCampaign> {
  const store = await readVenueStore()
  const idx = store.dripCampaigns.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error(`Campaign ${id} not found`)
  const updated: DripCampaign = { ...store.dripCampaigns[idx], ...patch }
  const dripCampaigns = store.dripCampaigns.map((c) => (c.id === id ? updated : c))
  useKV ? await writeKV({ dripCampaigns }) : writeLocal({ dripCampaigns })
  return updated
}

// ── Drip Enrollments ──────────────────────────────────────────────────────────

export async function getDripEnrollments(): Promise<DripEnrollment[]> {
  const store = await readVenueStore()
  return store.dripEnrollments.sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
}

export async function getActiveDripEnrollments(): Promise<DripEnrollment[]> {
  const store = await readVenueStore()
  return store.dripEnrollments.filter((e) => e.status === 'active')
}

export async function addDripEnrollment(data: Omit<DripEnrollment, 'id'>): Promise<DripEnrollment> {
  const store = await readVenueStore()
  const existing = store.dripEnrollments.find(
    (e) => e.entityId === data.entityId && e.campaignId === data.campaignId && e.status === 'active'
  )
  if (existing) return existing
  const enrollment: DripEnrollment = { ...data, id: makeId() }
  const dripEnrollments = [...store.dripEnrollments, enrollment]
  useKV ? await writeKV({ dripEnrollments }) : writeLocal({ dripEnrollments })
  return enrollment
}

export async function updateDripEnrollment(id: string, patch: Partial<DripEnrollment>): Promise<DripEnrollment> {
  const store = await readVenueStore()
  const idx = store.dripEnrollments.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error(`Enrollment ${id} not found`)
  const updated: DripEnrollment = { ...store.dripEnrollments[idx], ...patch }
  const dripEnrollments = store.dripEnrollments.map((e) => (e.id === id ? updated : e))
  useKV ? await writeKV({ dripEnrollments }) : writeLocal({ dripEnrollments })
  return updated
}

export async function enrollInBookingDrip(booking: { id: string; email: string; fullName: string; createdAt: string }): Promise<void> {
  const store = await readVenueStore()
  const campaign = store.dripCampaigns.find((c) => c.trigger === 'booking-new' && c.active)
  if (!campaign) return
  await addDripEnrollment({
    campaignId: campaign.id,
    entityType: 'booking',
    entityId: booking.id,
    toEmail: booking.email,
    entityName: booking.fullName,
    enrolledAt: booking.createdAt,
    completedSteps: [],
    status: 'active',
  })
}

// ── Songs / Set List ──────────────────────────────────────────────────────────

export async function getSongs(): Promise<Song[]> {
  const store = await readVenueStore()
  return [...store.songs].sort((a, b) => a.order - b.order)
}

export async function addSong(data: Omit<Song, 'id' | 'addedAt'>): Promise<Song> {
  const store = await readVenueStore()
  const song: Song = { ...data, id: makeId(), addedAt: now() }
  const songs = [...store.songs, song]
  useKV ? await writeKV({ songs }) : writeLocal({ songs })
  return song
}

export async function updateSong(id: string, patch: Partial<Omit<Song, 'id'>>): Promise<Song> {
  const store = await readVenueStore()
  const song = store.songs.find(s => s.id === id)
  if (!song) throw new Error('Song not found')
  const updated = { ...song, ...patch }
  const songs = store.songs.map(s => s.id === id ? updated : s)
  useKV ? await writeKV({ songs }) : writeLocal({ songs })
  return updated
}

export async function deleteSong(id: string): Promise<void> {
  const store = await readVenueStore()
  const songs = store.songs.filter(s => s.id !== id)
  useKV ? await writeKV({ songs }) : writeLocal({ songs })
}

// ── Rehearsals ────────────────────────────────────────────────────────────────

export async function getRehearsals(): Promise<Rehearsal[]> {
  const store = await readVenueStore()
  return [...store.rehearsals].sort((a, b) => b.date.localeCompare(a.date))
}

export async function addRehearsal(data: Omit<Rehearsal, 'id' | 'createdAt'>): Promise<Rehearsal> {
  const store = await readVenueStore()
  const rehearsal: Rehearsal = { ...data, id: makeId(), createdAt: now() }
  const rehearsals = [...store.rehearsals, rehearsal]
  useKV ? await writeKV({ rehearsals }) : writeLocal({ rehearsals })
  return rehearsal
}

export async function updateRehearsal(id: string, patch: Partial<Omit<Rehearsal, 'id'>>): Promise<Rehearsal> {
  const store = await readVenueStore()
  const rehearsal = store.rehearsals.find(r => r.id === id)
  if (!rehearsal) throw new Error('Rehearsal not found')
  const updated = { ...rehearsal, ...patch }
  const rehearsals = store.rehearsals.map(r => r.id === id ? updated : r)
  useKV ? await writeKV({ rehearsals }) : writeLocal({ rehearsals })
  return updated
}

export async function deleteRehearsal(id: string): Promise<void> {
  const store = await readVenueStore()
  const rehearsals = store.rehearsals.filter(r => r.id !== id)
  useKV ? await writeKV({ rehearsals }) : writeLocal({ rehearsals })
}

// ── Daily Goals ───────────────────────────────────────────────────────────────

export async function getGoals(date?: string): Promise<Goal[]> {
  const store = await readVenueStore()
  if (date) return store.goals.filter(g => g.date === date)
  return store.goals
}

export async function addGoal(data: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const store = await readVenueStore()
  const goal: Goal = { ...data, id: makeId(), createdAt: now() }
  const goals = [...store.goals, goal]
  useKV ? await writeKV({ goals }) : writeLocal({ goals })
  return goal
}

export async function updateGoal(id: string, patch: Partial<Omit<Goal, 'id'>>): Promise<Goal> {
  const store = await readVenueStore()
  const goal = store.goals.find(g => g.id === id)
  if (!goal) throw new Error('Goal not found')
  const updated = { ...goal, ...patch }
  const goals = store.goals.map(g => g.id === id ? updated : g)
  useKV ? await writeKV({ goals }) : writeLocal({ goals })
  return updated
}

export async function deleteGoal(id: string): Promise<void> {
  const store = await readVenueStore()
  const goals = store.goals.filter(g => g.id !== id)
  useKV ? await writeKV({ goals }) : writeLocal({ goals })
}
