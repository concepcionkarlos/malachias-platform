# Thanking donors — and the receipt that has to come from the charity

Fill in `[NAME]`, `[AMOUNT]`, `[DATE]`, `[METHOD]` and send. Two different things
live here and they are not interchangeable:

- **The thank-you** is from the band. Warm, fast, personal. Send it always.
- **The acknowledgment** is from Warfighter Gardens. It is the document a donor
  uses at tax time, so it has to come from the charity, not from "the band" —
  the charity is the entity that received the gift. Send it when the donor asks,
  and always for **$250 and over**, where the IRS requires a contemporaneous
  written acknowledgment before the donor can claim the deduction.

## Where donor names go

Into the **admin ledger only** (`campaignLedger`). Those rows never reach the
public page — the server reads them only to compute the total and the date of
the last reconciliation. Verified in `lib/campaignServer.ts`.

A donor's name goes on the **public sponsors list only if they ask for it.**
That list is public by design and is meant for businesses backing the campaign.
Never move someone there because they gave money.

**Default to private.** Individual donors are private unless they say otherwise:
no sponsors list, no campaign update, no social post, no screenshot of a Cash App
or PayPal notification with a name in it. Ask before naming anyone; some donors
say so up front, and that has already happened on this campaign.

Donor names and emails also **never go into this repository** — it is public on
GitHub, and git history keeps what it is given even after a later deletion. They
belong in the admin ledger, which lives in the content store, not in the code.
The templates below use placeholders for exactly this reason.

Putting a donor's own name on their acknowledgment letter is not "naming" them —
it is their document, addressed to them, and the letter is useless without it.

---

## 1 · The thank-you (band, send right away)

**EN**
> [NAME] — thank you.
>
> Your [AMOUNT] on [DATE] goes straight into getting the band to San Antonio for
> Veterans Day. Malachias is playing that event for free, so every dollar raised
> is the road: flights, hotel, transportation, instruments, meals.
>
> We'll keep you posted as it comes together. It means a lot.
>
> — Malachias

**ES**
> [NAME], gracias de verdad.
>
> Tus [AMOUNT] del [DATE] van directo a llevar a la banda a San Antonio para el
> Día de los Veteranos. Malachias va a tocar ese evento gratis, así que todo lo
> que se reúne es el camino: vuelos, hotel, transporte, instrumentos, comidas.
>
> Te vamos contando cómo avanza. Significa mucho.
>
> — Malachias

---

## 2 · The acknowledgment (Warfighter Gardens, for taxes)

The line about goods and services is the one that matters legally — without it
the letter does not do its job. It is true for a plain donation; it is **not**
true if the person bought merch, so do not send this for a store purchase.

**EN**
> **Warfighter Gardens**
> Coral Springs, FL · EIN 81-4794313
>
> [DATE]
>
> Dear [NAME],
>
> Thank you for your contribution of **[AMOUNT]**, received on **[DATE]** by
> [METHOD], in support of the Road to San Antonio.
>
> Warfighter Gardens is a registered 501(c)(3) nonprofit organization.
> **No goods or services were provided in exchange for this contribution.**
> Please retain this letter for your records; contributions are tax deductible to
> the extent allowed by law, and your own tax advisor can tell you what applies to
> your return.
>
> With gratitude,
> Warfighter Gardens

**ES**
> **Warfighter Gardens**
> Coral Springs, FL · EIN 81-4794313
>
> [DATE]
>
> Estimado/a [NAME]:
>
> Gracias por su contribución de **[AMOUNT]**, recibida el **[DATE]** por
> [METHOD], en apoyo al Road to San Antonio.
>
> Warfighter Gardens es una organización sin fines de lucro 501(c)(3) registrada.
> **No se entregaron bienes ni servicios a cambio de esta contribución.**
> Conserve esta carta para sus registros; las contribuciones son deducibles de
> impuestos en la medida que permite la ley, y su asesor fiscal puede indicarle
> qué aplica en su declaración.
>
> Con gratitud,
> Warfighter Gardens

*(An English acknowledgment is the one that counts for a US return. Send the
Spanish version alongside it for readability, not instead of it.)*

---

## 3 · Log it

In the admin, "Road to San Antonio" → **Verified support ledger**: one row with
the date, the source (`cashapp` / `merch` / `sponsor-cash`), the amount as
actually received, and the donor name in the note. Once any ledger row exists it
becomes the source of truth for the public number and the hand-entered "raised"
field is disabled — that is intended.

Record the amount **as received**, net of any fee, so the public total matches
what the campaign can actually spend.
