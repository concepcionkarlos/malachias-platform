# Road to San Antonio — internal budget model (5 musicians)

**Internal only. Never publish these tables.** The public goal stays **$12,000** until the band approves a change. Public copy says "artist compensation / musician support / performance-related expenses" — never a per-musician dollar figure.

Live version: Admin → Road to San Antonio → *Internal budget* (recomputes from the `Travelers` field; edit the planning numbers in `lib/campaign.ts` → `BUDGET_MODEL`).

## Planning numbers (replace with quotes as they arrive)

| Line | Basis | Amount | Note |
|---|---|---:|---|
| Airfare (round trip) | $500 × 5 | $2,500 | $400–600 each, FLL/MIA → SAT, Nov 11–13 |
| Instrument / checked baggage | $150 × 5 | $750 | Guitars, pedalboards, cases; oversize fees vary by airline |
| Hotel | fixed | $1,500 | ~3 nights, shared rooms (3 rooms) |
| Food / per diem | $180 × 5 | $900 | 3 travel days |
| Local transportation | fixed | $600 | Rental van + fuel; airport ↔ hotel ↔ venue |
| Artist compensation | $500 × 5 | $2,500 | Modest base; scenarios B/C raise it |
| **Subtotal** | | **$8,750** | |
| Contingency 10 % | | $875 | Flight changes, gear, fees |
| **Minimum mission model** | | **$9,625** | vs. public goal $12,000 — the gap is backline/gear allowance + campaign/payment fees |

## Three internal scenarios

| Scenario | Target | Artist comp / musician | What changes |
|---|---:|---:|---|
| A · Minimum mission | **$12,000** (public) | $500 | Gets five musicians there; modest support |
| B · Fully supported mission | $15,000 | $1,000 | Adds gear/backline allowance, fuller artist support |
| C · Full mission · stronger comp | $18,000–20,000 | $1,800 | Compensation closer to a professional date |

## How in-kind changes the math

Every **confirmed** in-kind item lowers the cash needed. Track it in Admin → *In-kind support* (category, sponsor, value, confirmed). Only confirmed items show publicly ("Plus $X in confirmed in-kind support"). Examples of what one sponsor removes from the table:

- Travel sponsor (5 tickets) → −$2,500
- Hotel sponsor (3 rooms × 3 nights) → −$1,500
- Transportation sponsor (van) → −$600
- Meal sponsor → −$900
- Gear sponsor (backline in SAT) → −$0 to −$800 depending on what the venue supplies

Still needed on the minimum model = model total − cash raised − confirmed in-kind. The admin shows this number.

## Open questions that move the numbers (ask the organizer)

airfare · hotel · meals · ground transport · backline · PA · baggage · passes · artist fee · guest accommodations. Record answers in Admin → *Organizer — what the event covers*.

## Public wording rules

- "Artist compensation", "musician support", "performance-related expenses" — never "$2,000 each".
- "Where your support goes" lists categories, no percentages, until quotes exist.
- Tax deductibility: `nonprofitVerified` went `true` on 2026-09-01, after the EIN
  Juan supplied (81-4794313) was checked against the IRS record — Warfighter
  Gardens, Coral Springs FL, subsection 3, deductibility code 1, ruling year 2017.
  The published wording is *"Contributions are tax deductible to the extent
  allowed by law"* plus a receipt contact. Keep that phrasing: what an individual
  can actually deduct depends on their own return, so a flat "your donation is tax
  deductible" claims more than the record supports.
