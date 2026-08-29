# Road to San Antonio — campaign administration

Veterans Day 2026 · November 12, 2026 · San Antonio, Texas
Campaign page: `/road-to-san-antonio` (also `/veterans-day-2026`) · Sponsor sheet: `/road-to-san-antonio/sponsors`

## Where things live

| What | Where | Who changes it |
|---|---|---|
| Defaults: goal, event, Cash App identity, tiers, donation anchors, milestones, budget lines, episode roadmap, copy | `lib/campaign.ts` | code (commit + deploy) |
| Live overrides: goal, **amount raised**, reconciliation date, status, venue, headline, Cash App name/$cashtag/link, organizer checklist | Admin → Outreach → **Road to San Antonio** | the band, any time |
| Sponsors shown on the page | same admin section | the band |
| Updates / episodes | same admin section | the band |
| Sponsor inquiries | same admin section (also emailed to `ADMIN_NOTIFY_EMAIL`) | the band |
| Cash App QR image | `public/warfighter-gardens-cashapp-qr.jpg` | code — replace the file; the page hides the QR if the file is missing |
| Campaign merch | Fourthwall collection with slug `road-to-san-antonio` (see `merchCollectionSlug`) | Fourthwall dashboard |
| Outreach templates / content plan | `docs/road-to-san-antonio/OUTREACH.md`, `CONTENT-PLAN.md` | the band |

Overrides are stored in the content store (`campaign`, `campaignSponsors`, `campaignUpdates`, `sponsorInquiries` keys) — Vercel KV in production, `data/content.json` locally.

## Updating the amount raised (the important one)

Cash App has no safe public API, and the site never pretends to be synced. The number people see is entered by hand:

1. Open Cash App → Activity. Add up the contributions that came in for the road (tip: ask donors to write "San Antonio" in the note — the campaign copy suggests it implicitly through the campaign name).
2. Add confirmed sponsor payments and any merch profit you decide to count.
3. Admin → Road to San Antonio → **Raised so far** → type the total → set **Reconciled on** to today → *Save everything*.
4. The campaign page, the homepage block and the top banner update immediately (the page is rendered per request). Milestone messages (25 / 50 / 75 / 90 / 100 %) switch on automatically from the real number.

Do this weekly during September, twice a week in October, daily from November 1.

## Lifecycle

`status` in the admin: `prelaunch` → `active` → (`funded` switches on by itself when raised ≥ goal) → `traveling` → `event-day` → `completed`.

- `active` / `funded`: full page, donation section, homepage block, top banner, store strip.
- `traveling` / `event-day` / `completed`: donation section and the three-path block are hidden; the hero reads the lifecycle headline; sponsors and updates stay. Nothing is deleted — the page becomes the record of the trip.

## Sponsors

Add a sponsor once the payment/in-kind support is confirmed. Tier decides size and order on the page. Logos: upload the image through Admin → Media (Vercel Blob) and paste its URL after a `|` in the website field, e.g. `https://sponsor.com|https://…blob…/logo.png`. Use `Category` for named sponsorships (Official Travel Sponsor, Hotel Sponsor…).

## Updates / episodes

One entry per episode. YouTube links embed (click-to-play); other URLs link out. Unpublished entries are drafts. The "road ahead" list on the page marks episodes that are published.

## Organizer checklist (internal)

The "what the event covers" grid is never shown publicly. Once the organizer confirms items, adjust the goal and edit `budgetLines` in `lib/campaign.ts` if categories drop out (e.g. hotel covered).

## Legal wording

Do not write "tax deductible", "501(c)(3)" or "tax-exempt" anywhere unless the recipient's documentation has been verified and the band explicitly approves it. Current copy uses "support the campaign / contribute / help the band reach San Antonio".

## Analytics

Vercel Analytics is mounted site-wide. Campaign events: `campaign_page_view`, `donate_click`, `cashapp_click`, `cashtag_copy`, `merch_click`, `sponsor_click`, `sponsor_form_submit`, `share_click`, `campaign_video_play`, `campaign_banner_click` (all carry `campaign=road-to-san-antonio` and a coarse `surface`/`channel`/`tier`). Enable Analytics for the project in the Vercel dashboard if it is not already on.

## Later (not built)

- Designed PDF sponsor kit — for now `/road-to-san-antonio/sponsors` → Print / Save as PDF.
- A dedicated OG image with a band photo of the current four-piece, once a new group photo exists (the generated one uses the emblem).
- Automatic contribution tracking would require a payment processor with webhooks (Stripe/Givebutter); Cash App alone cannot do it.
