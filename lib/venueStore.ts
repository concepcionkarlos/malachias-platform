import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { Venue, OutreachLog, EmailTemplate, AutoReplyLog, BookingEmailLog, InboundEmail, VenueStore } from './data'

const VENUE_DATA_PATH = path.join(process.cwd(), 'data', 'venues.json')
const useKV = !!process.env.KV_REST_API_URL
const KV_KEYS = {
  venues: 'venues', outreachLogs: 'outreachLogs', emailTemplates: 'emailTemplates',
  autoReplyLogs: 'autoReplyLogs', bookingEmailLogs: 'bookingEmailLogs', inboundEmails: 'inboundEmails',
} as const

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
        <p style="margin:0;font-size:11px;color:#999999;line-height:1.5;font-family:Arial,sans-serif;">Malachias · malachias.com · <a href="mailto:booking@malachias.com" style="color:#999999;">booking@malachias.com</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: makeId(), slug: 'booking-auto-reply', name: 'Booking Auto-Reply',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'We received your message, {{clientName}}.',
    bodyHtml: emailShell(`
        <h1 style="margin:0 0 16px;font-size:22px;color:#111111;font-family:Arial,sans-serif;">We heard you.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}}, thank you for reaching out about <strong>{{eventType}}</strong> on <strong>{{eventDate}}</strong>.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We'll be in touch within 24–48 hours. We take every booking seriously — if you need us there, we'll figure it out together.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">In the meantime, you can learn more about us and hear the music at <a href="https://malachias.com" style="color:${GOLD};">malachias.com</a>.</p>
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
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">You can also check our press kit at <a href="https://malachias.com" style="color:${GOLD};">malachias.com</a>.</p>
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
    id: makeId(), slug: 'song-request-reply', name: 'Song Request Reply',
    isSystem: true, createdAt: now(), updatedAt: now(),
    subject: 'We got your request, {{clientName}}.',
    bodyHtml: emailShell(`
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">{{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">Thank you for sending in your request for <strong>{{songList}}</strong>. It means something that you reached out.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;font-family:Arial,sans-serif;">We'll review it as we build upcoming setlists. Keep following along — you might hear it live sooner than you think.</p>
        <p style="margin:0;font-size:15px;color:#444444;font-family:Arial,sans-serif;">— <strong>Malachias</strong></p>`),
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
  const existingSlugs = new Set(existing.map((t) => t.slug))
  const missing = DEFAULT_TEMPLATES.filter((t) => !existingSlugs.has(t.slug))
  if (missing.length === 0) return { templates: existing, changed: false }
  return { templates: [...existing, ...missing], changed: true }
}

// ── Local FS ──────────────────────────────────────────────────────────────────

function readLocal(): VenueStore {
  try {
    const dir = path.dirname(VENUE_DATA_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(VENUE_DATA_PATH)) {
      const seed: VenueStore = { venues: [], outreachLogs: [], emailTemplates: DEFAULT_TEMPLATES, autoReplyLogs: [], bookingEmailLogs: [], inboundEmails: [] }
      fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(seed, null, 2))
      return seed
    }
    const raw = fs.readFileSync(VENUE_DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<VenueStore>
    let templates: EmailTemplate[] = parsed.emailTemplates ?? []
    let changed = false
    if (templates.length === 0) { templates = DEFAULT_TEMPLATES; changed = true }
    else { const sync = syncDefaultTemplates(templates); if (sync.changed) { templates = sync.templates; changed = true } }
    const store: VenueStore = {
      venues: parsed.venues ?? [], outreachLogs: parsed.outreachLogs ?? [],
      emailTemplates: templates, autoReplyLogs: parsed.autoReplyLogs ?? [],
      bookingEmailLogs: parsed.bookingEmailLogs ?? [], inboundEmails: parsed.inboundEmails ?? [],
    }
    if (changed) fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(store, null, 2))
    return store
  } catch {
    return { venues: [], outreachLogs: [], emailTemplates: DEFAULT_TEMPLATES, autoReplyLogs: [], bookingEmailLogs: [], inboundEmails: [] }
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
  const [venues, outreachLogs, emailTemplates, autoReplyLogs, bookingEmailLogs, inboundEmails] = await Promise.all([
    kv.get<Venue[]>(KV_KEYS.venues), kv.get<OutreachLog[]>(KV_KEYS.outreachLogs),
    kv.get<EmailTemplate[]>(KV_KEYS.emailTemplates), kv.get<AutoReplyLog[]>(KV_KEYS.autoReplyLogs),
    kv.get<BookingEmailLog[]>(KV_KEYS.bookingEmailLogs), kv.get<InboundEmail[]>(KV_KEYS.inboundEmails),
  ])
  let templates = emailTemplates ?? []
  if (templates.length === 0) { templates = DEFAULT_TEMPLATES; await kv.set(KV_KEYS.emailTemplates, templates) }
  else { const sync = syncDefaultTemplates(templates); if (sync.changed) { templates = sync.templates; await kv.set(KV_KEYS.emailTemplates, templates) } }
  return { venues: venues ?? [], outreachLogs: outreachLogs ?? [], emailTemplates: templates, autoReplyLogs: autoReplyLogs ?? [], bookingEmailLogs: bookingEmailLogs ?? [], inboundEmails: inboundEmails ?? [] }
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

export async function getBookingEmailLogs(entityType: 'booking' | 'song-request', entityId: string): Promise<BookingEmailLog[]> {
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
