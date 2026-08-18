# Malachias Platform

The website and back office for the band Malachias — [malachias.com](https://malachias.com).

Public site, booking pipeline and an admin area, built as one Next.js application. Everything
a promoter, a fan or the band itself needs goes through here: enquiring about a show, joining
the mailing list, reading the journal, buying merch, or running the band's own rehearsal prep.

**Live:** [malachias.com](https://malachias.com) · **Stack:** Next.js 16, React 19,
TypeScript, Tailwind 4, Vercel KV, Resend

---

## What it does

| Area | Route | Purpose |
|---|---|---|
| Home and gallery | `/`, `/gallery` | Public face of the band |
| EPK | `/epk` | Press kit for promoters: bio, lineup, media |
| Journal | `/journal/[slug]` | Long-form posts |
| Merch | `/merch` | Store front |
| Promo | `/promo` | Campaign landing pages |
| Rehearsal | `/rehearsal/[token]` | Per-member prep, reached by a private token link |
| Verified | `/verified` | Landing page for confirmed mailing-list opt-ins |
| Admin | `/admin/bookings`, `/admin/content`, `/admin/sections`, `/admin/settings` | Back office |

The API layer covers bookings and booking captcha, venues, places, songs, goals, fan stories,
email templates, a drip sequence, inbound email handling and the admin and content endpoints.

---

## Engineering notes

The parts that took real work were not the pages. They were the things that stop a public
form from becoming a liability.

**Booking cannot be used as a spam relay.** Every path that sends mail sits behind double
opt-in, KV-backed rate limiting and a signed captcha. Signing the captcha rather than storing
it means a replayed or already-spent token is rejected without a round trip, so a cached page
cannot resurrect one.

**Admin sessions are not a shared password.** Each login mints a random signed token with a
server-side expiry, so revoking access does not mean rotating a secret everyone knows.

**The public routes fail softly.** Error boundaries and a real not-found fallback, because a
promoter hitting a stack trace on the way to booking a show is a lost show.

**Validation matches reality, not a regex.** The booking form's name field was quietly
rejecting legitimate names; it now accepts what people are actually called.

---

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables are not committed. The app expects credentials for Vercel KV and
Resend, configured in the deployment environment.

---

## License

None. Published as a portfolio piece: the source is here to be read, not reused.
All rights reserved.
