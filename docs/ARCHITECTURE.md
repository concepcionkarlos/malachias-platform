# Architecture

A map of the codebase: where everything lives, how a request moves through it, and why the
awkward parts are the shape they are. The README says what the platform does; this says how.

One Next.js 16 application, App Router, on Vercel. No separate backend, no database server, no
ORM. State lives in two JSON blobs — in Vercel KV in production, on disk in development. Every
route handler is its own security boundary; there is no `middleware.ts`.

```
app/          routes: public pages, the admin shell, and every API handler
app/components/   the public site, one component per homepage section (25 files)
app/admin/sections/  the admin panel, one component per tab (34 files)
lib/          domain types, the two data layers, auth, captcha, rate limiting, email
data/         the dev-mode persistence files: content.json and venues.json
public/       band photos, logos, robots.txt
docs/         this file
```

## Data layers

Two modules own all persistence. Both follow the same pattern: a `useKV` flag derived from
`process.env.KV_REST_API_URL`, a KV path, and a local-JSON fallback.

**`lib/store.ts` — the content store.** One KV key, `malachias_content`, holding a single
`ContentStore`: shows, merch, band members, site copy, media, EPK, booking requests,
subscribers, tasks, song stories, reflections, fan stories, admin notes. `readContent()` merges
what is persisted over the defaults in `lib/data.ts`, so adding a field needs no migration.
`writeContent(updates)` reads the blob, spreads the patch over it, writes it all back.

**`lib/venueStore.ts` — the band-ops store.** One KV key per collection (`venues`,
`outreachLogs`, `emailTemplates`, `inboundEmails`, `sentEmails`, `songs`, `rehearsals`,
`goals`, `showSetLists`, `contentPosts`, `finances`, `bandStats`, `liveSessions`, and the drip
tables), mirrored to `data/venues.json` in dev. It also carries the seed data: the default
song catalogue and the system email templates.

**`lib/data.ts`** is types plus seed values, with no I/O. Every interface in the system —
`Show`, `BookingRequest`, `Venue`, `DripCampaign`, `Rehearsal`, `FinanceEntry` — is here.
Content that is deliberately *not* editable sits in `lib/bandRoster.ts` (the lineup, shared by
the homepage and the EPK so they cannot drift) and `lib/journalEntries.ts` (the posts).

Two consequences: writes are read-modify-write with no locking, so concurrent admin edits are
last-write-wins; and the content store is one value, read in full on every request that
touches it.

## Public routes

| Route | Purpose |
|---|---|
| `/` | The whole marketing site as one page: hero, mission, about, music, testimonies, band, shows, setlist, war room, journal, merch, press, booking form, fan-story form, newsletter |
| `/gallery` | Photo grid with a lightbox; server shell plus `GalleryClient` |
| `/epk` | Press kit for promoters — bio, lineup, repertoire, tech specs, contacts. `force-dynamic` |
| `/journal/[slug]` | One long-form post, statically pre-rendered from `JOURNAL_ENTRIES` |
| `/merch`, `/merch/[slug]` | Fourthwall catalogue revalidated every 5 minutes; each product pre-rendered per slug and revalidated hourly |
| `/support`, `/promo` | Ways to support the band; the noindex landing page for the 15%-off subscribe offer |
| `/verified` | Where the double opt-in link lands: success, or `missing` / `invalid` / `expired` |
| `/rehearsal/[token]` | Private per-rehearsal RSVP page, reached only by an invite token |
| `/sitemap.xml` | Generated in `app/sitemap.ts`, including Fourthwall products and journal posts |

`app/layout.tsx` supplies fonts, site-wide metadata and Open Graph tags, the `MusicGroup`
JSON-LD block, and the fixed film-grain overlay. `app/not-found.tsx` is the 404, `noindex`.

## Admin routes

`/admin` is a single client-rendered application, not a set of pages. It reads `?tab=` from the
query string, looks the key up in a `SECTIONS` map, and `next/dynamic`-imports the matching
component from `app/admin/sections/`. Thirty-four sections are registered, grouped into
Overview, Operations, Content, Music, Platform, Outreach, Reports and System. The remaining
files under `app/admin/` are redirect stubs — `/admin/bookings`, `/admin/community`,
`/admin/content`, `/admin/dashboard`, `/admin/email`, `/admin/events`, `/admin/media`,
`/admin/merch`, `/admin/settings` — each forwarding into `/admin?tab=…` so older links resolve.

The shell gates itself by calling `GET /api/admin/login` on mount and rendering `AdminLogin`
when the answer is `false`. That gate is cosmetic. The real protection is that every admin API
route calls `isAuthenticated()` itself.

## API surface

Public, unauthenticated:

| Endpoint | What it does |
|---|---|
| `GET /api/booking/captcha` | Issues a signed single-use math challenge. 30/min. `force-dynamic`, `no-store` |
| `POST /api/booking` | Booking intake: honeypot, captcha, field-quality validation, persist, auto-reply, drip enrolment, admin notification. 5/min |
| `POST /api/newsletter` | Stores a pending subscriber and sends the double opt-in email. 3/min |
| `GET /api/verify-email` | Confirms an opt-in token (48h TTL), promotes to subscriber, sends the welcome and coupon, redirects to `/verified` |
| `GET /api/newsletter/unsubscribe` | Removes an address and returns an HTML confirmation. 5/min |
| `POST /api/promo` | Same double opt-in flow, entered from the promo landing page. 3/min |
| `POST /api/fan-stories` | Public fan-story submission, saved as `pending`. Sends no mail, by design. 3/min |
| `GET /api/public/content` | Front-end-safe slice of the content store. Never returns bookings or subscribers |
| `GET,POST /api/rehearsals/[token]` | Read a rehearsal by invite token; record an attendance confirmation. 20/min and 5/min |

Machine-authenticated by shared secret, not by session: `GET /api/cron/drip` (due steps of
every active booking drip) and `GET /api/cron/subscriber-drip` (the day-3 and day-7 newsletter
mails) both require `Bearer CRON_SECRET`; `POST /api/webhooks/inbound` parses Google Apps
Script, Resend and Mailgun payloads under `WEBHOOK_INBOUND_SECRET`, and `POST
/api/inbound-email` does the same under `RESEND_WEBHOOK_SECRET`, additionally matching the
sender to a known booking or venue.

Admin session required:

| Endpoint | What it does |
|---|---|
| `/api/admin/login` | Session status, login (5 attempts / 15 min), logout |
| `/api/admin/status`, `/api/admin/test-email` | Which env vars are present, which backend is live, record counts; a Resend test send |
| `GET,PATCH /api/content` | Read or patch the whole content store. Understands a `merge-item` sentinel that updates one booking in place instead of replacing the array |
| `/api/bookings/[id]` and children | Delete a booking; read its outbound log or full sent/received thread; render a template against it and send |
| `/api/{bookings,subscribers,fan-stories}/scan-spam` | Heuristic spam scoring then bulk delete — one scanner per collection |
| `PATCH /api/fan-stories`, `GET /api/newsletter` | Fan-story moderation status; the confirmed subscriber list |
| `/api/venues[/id]`, `/email-thread`, `/send-email`, `/api/places/search` | Venue CRM, its mail thread, outreach sends that update status and activity log, and the Google Places proxy behind the venue finder |
| `/api/email-templates[/id]` | Template CRUD. System templates refuse deletion |
| `/api/email/{send,blast,sent}` | One branded email; a blast to every subscriber with per-recipient unsubscribe links; the sent log |
| `/api/inbound-emails[/id]` | Inbox: list, mark all read, mark one read, delete |
| `/api/drip/campaigns[/id]`, `/api/drip/enrollments[/id]` | Drip campaign definitions and enrolments |
| `/api/songs`, `/api/shows/setlist`, `/api/rehearsals`, `/api/rehearsals/invite` | Song catalogue, per-show set list, rehearsal CRUD, invite-token minting plus mailing |
| `/api/goals`, `/api/content-posts`, `/api/finances`, `/api/stats`, `/api/live-sessions[/id]`, `/api/admin/fan-outreach[/id]` | Daily goals, content calendar, finance ledger, band stats, live sessions, social-CRM contacts |
| `/api/upload`, `/api/upload-video` | Vercel Blob upload under a randomised name with an extension allowlist; register a video item, deriving the YouTube poster |

## A booking, end to end

1. `Booking.tsx` mounts and fetches `GET /api/booking/captcha` with `cache: 'no-store'`,
   receiving `{ a, b, token }`. Submit stays disabled until the challenge arrives.
2. The visitor fills the form. The client mirrors the server's name, phone and message checks,
   so most mistakes never leave the browser.
3. `POST /api/booking` rate-limits, then checks the honeypot field `website` — if filled it
   returns `201` and discards the payload, so the bot sees success.
4. `verifyChallenge` checks the captcha signature, expiry and answer.
5. Name, email, phone and message quality checks run.
6. Only now is the captcha nonce spent, via `consumeChallengeNonce`.
7. The booking is appended to `bookingRequests` with a random hex id and status `New`.
8. Three best-effort side effects follow, each wrapped so a failure cannot fail the request:
   `triggerAutoReply` (client auto-reply, scheduled five minutes out through Resend),
   `enrollInBookingDrip` (the active `booking-new` campaign), and `sendAdminNotification`,
   which runs only when `ADMIN_NOTIFY_EMAIL` is set.
9. The band opens `/admin?tab=bookings`. `AdminBookings` reads `GET /api/content` and writes
   status changes back through `PATCH /api/content`. Moving a booking to a terminal status
   pauses its drip enrolment inside that same handler.
10. The 14:00 UTC cron hits `/api/cron/drip`, sends any step whose day has elapsed, and marks
    the enrolment `completed` when the last step goes out.

Replies come back the other way: the mail provider posts to an inbound webhook, the message is
stored against the matching booking or venue, and the admin inbox renders sent and received
together as one thread.

## Admin authentication

All of it is in `lib/auth.ts`. No user accounts — one password, one cookie.

The signing key is `` `${SESSION_SECRET}:${ADMIN_PASSWORD}` ``. In production both must be set
or the module throws rather than fall back to a guessable default. A login mints
`<issuedAtMs>.<random>.<hmac>`: 18 random bytes, HMAC-SHA256 over the first two parts, set as
the `admin_session` cookie — `httpOnly`, `sameSite: 'lax'`, `secure` in production, 30-day
`maxAge`. Validation recomputes the HMAC, compares with `timingSafeEqual`, then checks
`issuedAt` against the 30-day window. Password comparison is constant-time too.

Two properties fall out of that. The client cannot extend its own session by editing the
cookie, because expiry rides inside the signed payload and is re-checked server-side. And
because the password is part of the signing key, changing the password invalidates every
outstanding session at once — a free logout-everyone lever.

Each admin route calls `isAuthenticated()` or `isAuthenticatedFromRequest(req)` itself. No
middleware does it centrally. That is a deliberate trade: a new route is unprotected until it
opts in, but no route's protection depends on a matcher pattern staying correct.

## Decisions worth understanding

**The captcha is signed, not stored.** The challenge is an HMAC over `answer.expiry.nonce`,
minted server-side. Nothing is written at issue time. A bot cannot forge a token for an answer
it chooses, because it lacks `SESSION_SECRET`, and cannot reuse an expired one, because the
expiry is inside the signature. Storing challenges would mean a write on every page view of a
public form and a rendezvous problem across serverless instances. Only the nonce is stored,
and only on a successful solve — `kv.set` with `nx` and a 15-minute TTL, which is the
anti-replay check. That also forces the issuing endpoint to be `force-dynamic` and `no-store`:
a CDN-cached challenge is a token everyone shares, and the first solver burns it for the rest.

**Verified early, consumed late.** Signature and answer are checked before any field
validation, so a bot never reaches the validators. The nonce is spent only once every other
check passes — otherwise a real visitor with a too-short message would have their token burned
by the failed attempt and be told to reload, losing what they typed.

**Double opt-in on every path that sends mail.** `POST /api/newsletter` and `POST /api/promo`
never add a subscriber. They write a `pendingSubscribers` entry with a 32-byte random token and
mail a confirmation link; `GET /api/verify-email` promotes it, and only within 48 hours. The
reward — the discount code — arrives at confirmation, not at signup, so there is no value in
submitting an address you do not control. Neither endpoint re-sends to an address already
pending, which stops the form being used to mail-bomb a stranger.

**Rate limiting is KV-backed for a specific reason.** The in-memory limiter in
`lib/rateLimit.ts` is per-instance and dies on cold start, so on serverless it barely limits
anything: an attacker spread across instances gets `limit × instances`. The KV path uses
`INCR` plus an `EXPIRE` on the first hit of a window, so the counter is shared and the
increment atomic. If KV is unreachable it falls back to the in-memory limiter rather than
letting traffic through unthrottled — degraded, not open.

**Failure modes are picked per feature, not globally.** `consumeChallengeNonce` fails *open*
when KV is absent or erroring: infrastructure trouble must never block a real promoter from
booking a show. The rate limiter fails *closed* onto its weaker backend. Outbound email fails
*silent* — every send in the booking path is `.catch(() => {})`, because a Resend outage
should not turn a captured booking into a 500 and a lost enquiry.

**The public routes fail softly.** `/rehearsal/[token]` carries an `error.tsx` boundary with a
retry button, and returns a plain "link not found" panel rather than a 404 when the token does
not resolve — an expired invite is an ordinary event, not an error. `not-found.tsx` covers
everything unmatched. The reasoning is commercial: a promoter who hits a stack trace on the way
to the booking form does not come back.

**No auto-reply on fan stories.** Bookings are answered automatically; fan stories are not, and
the handler carries the reason. The submitted address is unverified, so replying would let
anyone use the band's domain to relay mail into a stranger's inbox — costing sending reputation
as well as goodwill. Stories queue for a manual reply instead.

**The lineup is code, not content.** `lib/bandRoster.ts` is hand-authored and not editable from
the admin panel: the homepage and the EPK both read it, and a press kit disagreeing with the
site is worse than an inconvenient edit. Legacy admin URLs redirect rather than 404 for the
same class of reason — bookmarks and old emails still have to land somewhere useful.

## Running it

```bash
npm install && npm run dev        # http://localhost:3000
npm run build | npm run lint | npm run typecheck
```

With no environment set the app still runs end to end: `data/content.json` and
`data/venues.json` stand in for KV, rate limiting falls back to memory, and email is
`DEV_MODE` — every send logged to the console. Enough to develop everything except delivery.

| Variable | Needed for |
|---|---|
| `KV_REST_API_URL` | Switches both data layers, the rate limiter and the captcha nonce store to Vercel KV. Its presence alone is the switch |
| `ADMIN_PASSWORD` | The admin password, and half the session signing key. Required in production |
| `SESSION_SECRET` | The other half, and the captcha signing key. Required in production |
| `RESEND_API_KEY` | Outbound email. Absent means `DEV_MODE` |
| `RESEND_FROM_EMAIL` | From address. Defaults to `Malachias <booking@malachiasmusic.com>` |
| `ADMIN_NOTIFY_EMAIL` | Where new-booking notifications go. No notification if unset |
| `CRON_SECRET` | Both cron endpoints. They return 500 if it is unset, 401 on mismatch |
| `WEBHOOK_INBOUND_SECRET`, `RESEND_WEBHOOK_SECRET` | `POST /api/webhooks/inbound` and `POST /api/inbound-email` respectively |
| `GOOGLE_PLACES_API_KEY` | Venue finder. The endpoint returns 503 without it |
| `FOURTHWALL_STOREFRONT_TOKEN` | The merch catalogue |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap. Defaults to `https://malachiasmusic.com` |

The two cron jobs are declared in `vercel.json` and nowhere else — `/api/cron/drip` at 14:00
UTC, `/api/cron/subscriber-drip` at 15:00 UTC. Adding a scheduled job means editing that file.

`next.config.ts` sets security headers on every route (`X-Frame-Options: DENY`, HSTS,
`nosniff`, a `frame-ancestors 'none'` CSP), enables the React Compiler, and allowlists the five
remote image hosts. The image optimizer refuses SVG and the upload allowlist has no SVG entry.
`public/robots.txt` disallows `/admin`, `/api/` and `/rehearsal/`.
