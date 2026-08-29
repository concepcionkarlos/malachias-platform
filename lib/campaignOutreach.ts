// Road to San Antonio — copy-paste outreach and social templates, surfaced in the
// admin with one-click copy. Mirrors docs/road-to-san-antonio/OUTREACH.md and
// CONTENT-PLAN.md; nothing here is ever sent automatically. Placeholders in
// [brackets] are filled in by hand. Safe to import from client components.

import { CAMPAIGN, usd } from './campaign'

const URL = 'https://www.malachiasmusic.com/road-to-san-antonio'
const SHEET = `${URL}/sponsors`
const EMAIL = CAMPAIGN.sponsorEmail
const CASH = `${CAMPAIGN.cashApp.displayName} · ${CAMPAIGN.cashApp.cashtag} · cash.app/${CAMPAIGN.cashApp.cashtag}`

export interface Template { id: string; title: string; channel: string; subject?: string; body: string }

export const OUTREACH_TEMPLATES: Template[] = [
  { id: 'dm', title: 'Short sponsor DM', channel: 'Instagram / Facebook / text',
    body: `Hi [Name] — I'm with Malachias, a veteran-founded rock band out of Coral Springs. We've been invited to play a Veterans Day event in San Antonio on Nov 12 and we're raising the travel budget to bring the full band. Sponsorships start at $250 (name on the page) up to $2,500 (featured, logo, videos). Would [Business] want to be part of the road? Details: ${SHEET}` },
  { id: 'formal', title: 'Formal sponsor email', channel: 'Email', subject: 'Sponsorship — Malachias, Veterans Day 2026 in San Antonio',
    body: `Dear [Name],

Malachias is a veteran-founded Christian rock band based in Coral Springs, Florida. Our founder served two tours in Iraq as an Army medic and bandsman; the band exists to reduce suicidal ideation, lift people from depression and help heal what PTSD leaves behind — through music, on stages from bars to churches to VFW halls.

We have been invited to perform at a Veterans Day event in San Antonio, Texas on November 12, 2026. Getting the full band there — flights, instruments, lodging and ground transportation for ${CAMPAIGN.travelers} people — is the campaign we're calling the Road to San Antonio, with a target of ${usd(CAMPAIGN.goal)}.

We are inviting a small number of businesses and organizations to sponsor the road:
- Supporter — $250: name on the campaign page, thank-you in the wrap-up
- Bronze — $500: logo on the page, social thank-you, sponsor listing
- Silver — $1,000: prominent logo, social recognition, campaign content acknowledgment, listing with link
- Gold — $2,500: premium placement, major social recognition, featured sponsor, inclusion in selected campaign videos
- Presenting / in-kind (travel, hotel, transportation, gear, meals): let's build it together

Full overview: ${SHEET}

I'd welcome a short call this week. Thank you for considering it.

[Your name]
Malachias · ${EMAIL} · malachiasmusic.com` },
  { id: 'church', title: 'Church outreach email', channel: 'Email', subject: 'A Veterans Day mission your congregation can carry to San Antonio',
    body: `Pastor [Name],

I lead Malachias, a Messianic/Christian rock band founded by an Army veteran in Coral Springs. The music we play is aimed at the men and women who came home carrying what nobody talks about at the dinner table — veterans, families, believers whose faith got knocked sideways.

We've been invited to perform at a Veterans Day event in San Antonio on November 12. We are raising the cost of bringing the full band there, and we would be honored if [Church] would stand with us — as a sponsor, with a love offering, or simply by sharing the campaign with the congregation and the veterans among you.

Campaign: ${URL}
Sponsorship overview: ${SHEET}

We'd also gladly play for your community before or after the trip. Thank you, and God bless.

[Your name] · ${EMAIL}` },
  { id: 'veteran-biz', title: 'Veteran-owned business email', channel: 'Email', subject: 'Veteran-owned to veteran-founded — the Road to San Antonio',
    body: `[Name],

One veteran-built outfit to another. Malachias was founded by a two-tour Iraq vet (medic, then Army bandsman) and plays for the ones still fighting their way back. We've been invited to a Veterans Day event in San Antonio on Nov 12 and we're raising the travel budget to bring the full band.

Sponsorship tiers run $250–$2,500, with recognition on the campaign page and our channels; in-kind help (flights, hotel, a van, gear) counts at the matching tier. Overview: ${SHEET}

Would [Business] put its name on the road? Happy to jump on a call.

[Your name] · Malachias` },
  { id: 'music-co', title: 'Music company / gear sponsor email', channel: 'Email', subject: 'Gear sponsor for a Veterans Day performance — Malachias, San Antonio',
    body: `Hi [Name],

Malachias is a veteran-founded rock band from South Florida with a steady release run (latest single "Because of You", Aug 2026). We're performing at a Veterans Day event in San Antonio on November 12 and running a campaign to bring the full band.

We're looking for a Gear Sponsor: help with [strings / cases / backline rental / flight cases] in exchange for recognition on the campaign page, gear-in-use content across the campaign videos and social channels, and a Silver/Gold listing depending on value. Overview: ${SHEET}

Can I send a one-page summary of what we play and where it would appear?

[Your name] · Malachias` },
  { id: 'hotel', title: 'Hotel sponsorship request', channel: 'Email', subject: 'Hotel Sponsor — Veterans Day band travel, Nov 11–13, San Antonio',
    body: `Hi [Name],

Malachias, a veteran-founded rock band from Florida, is performing at a Veterans Day event in San Antonio on November 12. We're looking for a Hotel Sponsor for [number] rooms, [nights] nights (Nov 11–13), for ${CAMPAIGN.travelers} band members.

In return: "Hotel Sponsor" recognition on the campaign page (${URL}), thank-you posts across our channels during the trip, and inclusion in our travel content. Recognition equals our Silver or Gold tier depending on the value.

Would [Hotel] consider it? I can share the campaign overview and dates in detail.

[Your name] · ${EMAIL}` },
  { id: 'airline', title: 'Airline / travel sponsorship request', channel: 'Email', subject: 'Official Travel Sponsor — veteran-founded band, Veterans Day 2026',
    body: `Hi [Name],

Malachias is a veteran-founded rock band from Coral Springs, Florida invited to perform at a Veterans Day event in San Antonio on November 12, 2026. Our largest cost is moving ${CAMPAIGN.travelers} musicians and their instruments from South Florida to Texas and back.

We are inviting one company to be the Official Travel Sponsor of the Road to San Antonio — through flight credit, ticket coverage or a travel grant. Recognition: "Official Travel Sponsor" on the campaign page and in every travel-day post and video, plus our Gold-tier benefits. Overview: ${SHEET}

If [Company] has a veteran or community program this fits, I'd be glad to talk.

[Your name] · Malachias` },
  { id: 'transport', title: 'Local transportation request', channel: 'Email', subject: 'Transportation Sponsor — band + gear, San Antonio, Nov 11–13',
    body: `Hi [Name],

Malachias (veteran-founded rock band, Florida) is performing at a Veterans Day event in San Antonio on November 12. We need ground transportation for ${CAMPAIGN.travelers} people and instruments — airport ↔ hotel ↔ venue, Nov 11–13.

We'd recognize [Company] as the Transportation Sponsor on the campaign page and in our travel content, at the Silver/Gold tier depending on value. Overview: ${SHEET}

Could we talk about a van/shuttle arrangement for those days?

[Your name] · Malachias` },
  { id: 'followup', title: 'Follow-up (7 days later)', channel: 'Email', subject: 'Re: Sponsorship — Malachias, Veterans Day 2026',
    body: `Hi [Name] — following up on the note below. The campaign is now [XX]% funded with [N] sponsors on board, and there are [N] weeks to November 12. If [Business] would like a place on the road, the quickest path is the sponsor form here: ${URL}#sponsor-form — or just reply and I'll take care of it.

Either way, thank you for reading.

[Your name]` },
  { id: 'thanks', title: 'Thank-you (after confirmation)', channel: 'Email', subject: "Thank you — you're on the Road to San Antonio",
    body: `[Name],

Thank you. [Business] is officially on the road with us as a [Tier / Category]. Your name and logo are live on the campaign page, and you'll see the thank-you on our channels this week.

Here's what happens next: we'll send a short update every few weeks, tag you when the travel content goes out, and send photos from San Antonio after November 12.

On behalf of the whole band — this matters more than you know.

[Your name] · Malachias` },
]

// Bilingual: every social post ships EN + ES (a large part of the audience is Spanish-speaking).
export const SOCIAL_TEMPLATES_ES: Template[] = [
  { id: 'announce-es', title: 'Anuncio de campaña (ES)', channel: 'Facebook / Instagram',
    body: `NOS VAMOS A SAN ANTONIO.

Malachias ha sido invitado a tocar en el Día de los Veteranos 2026. Ahora trabajamos para llevar a toda la banda.

12 de noviembre. San Antonio, Texas.

Tres formas de ayudar: dona, llévate merch, o patrocina el camino como negocio o iglesia.
Apoya por Cash App → ${CASH}

Únete al Road to San Antonio → ${URL}

#RoadToSanAntonio #MalachiasBand #VeteransDay2026 #RockCristiano #Veteranos #SurDeFlorida #SanAntonio` },
  { id: 'full-band-es', title: 'Ayúdanos a llevar a toda la banda (ES)', channel: 'Facebook / Instagram',
    body: `AYÚDANOS A LLEVAR A TODA LA BANDA.

Cada donación, cada pieza de merch, cada patrocinador y cada vez que compartes nos acerca a San Antonio.

Cash App → ${CASH}
Campaña → ${URL}

#RoadToSanAntonio #VeteransDay2026 #MalachiasBand` },
  { id: 'road-es', title: 'Road to San Antonio (corto, ES)', channel: 'Stories / Reels',
    body: `ROAD TO SAN ANTONIO

Nos llegó la invitación. Ahora construimos el camino para llegar.

${URL}` },
  { id: 'progress-es', title: 'Actualización de progreso (ES)', channel: 'Stories',
    body: `[XX]% del camino a San Antonio. Faltan [$X,XXX] y [N] días.

Gracias a todos los que ya están en el camino. Sigamos → ${URL}
Cash App → ${CAMPAIGN.cashApp.cashtag}` },
  { id: 'sponsor-thanks-es', title: 'Agradecimiento a patrocinador (ES)', channel: 'Facebook / Instagram',
    body: `Bienvenido al camino, [Patrocinador] — nuevo patrocinador [Nivel / Categoría] para el Día de los Veteranos 2026 en San Antonio.

[Una línea sobre quiénes son y por qué encaja.]

Negocios e iglesias: todavía hay lugar en el camino → ${SHEET}

#RoadToSanAntonio #VeteransDay2026` },
  { id: 'share-es', title: 'Texto para compartir (ES)', channel: 'Donde sea',
    body: `Ayuda a Malachias a llevar a toda la banda a San Antonio para el Día de los Veteranos 2026. ${URL}` },
]

// Replies to donors — Cash App shows the sender's name; answer within the day.
export const DONOR_TEMPLATES: Template[] = [
  { id: 'donor-thanks', title: 'Thank a donor (EN)', channel: 'Cash App note / DM / text',
    body: `[Name] — thank you. Your gift just moved the Road to San Antonio forward. Every dollar goes to getting the full band to that Veterans Day stage on November 12. We'll post the progress at ${URL}. God bless. — Malachias` },
  { id: 'donor-thanks-es', title: 'Agradecer a un donante (ES)', channel: 'Nota de Cash App / DM / texto',
    body: `[Nombre] — gracias. Tu aporte acaba de mover el Road to San Antonio. Cada dólar va a llevar a toda la banda a ese escenario del Día de los Veteranos el 12 de noviembre. Vamos publicando el progreso en ${URL}. Dios te bendiga. — Malachias` },
  { id: 'donor-share', title: 'Ask a donor to share (EN)', channel: 'DM / text',
    body: `One more thing, if you're willing: sharing the campaign reaches people we can't. Here's the link and a line you can paste — "Help Malachias bring the full band to San Antonio for Veterans Day 2026. ${URL}". Thank you again.` },
  { id: 'donor-share-es', title: 'Pedir a un donante que comparta (ES)', channel: 'DM / texto',
    body: `Una cosa más, si puedes: compartir la campaña llega a gente a la que nosotros no llegamos. Aquí va el enlace y una frase para pegar — "Ayuda a Malachias a llevar a toda la banda a San Antonio para el Día de los Veteranos 2026. ${URL}". Gracias de nuevo.` },
  { id: 'donor-big', title: 'Larger gift ($100+) — personal note (EN)', channel: 'Email / call',
    body: `[Name], I saw your gift come through and I wanted to write to you myself. That's not a small thing, and it's not going unnoticed — it covers [a flight / a night of lodging / the instrument baggage] on this trip. If you'd like your name on the campaign page as a supporter, just say the word. Thank you for believing in what we do. — Malachias` },
]

export const SOCIAL_TEMPLATES: Template[] = [
  { id: 'announce', title: 'Campaign announcement', channel: 'Facebook / Instagram',
    body: `WE'RE GOING TO SAN ANTONIO.

Malachias has been invited to perform for Veterans Day 2026. Now we're working to bring the full band.

November 12. San Antonio, Texas.

Three ways to help: donate, grab merch, or sponsor the road as a business or church.
Support through Cash App → ${CASH}

Join the Road to San Antonio → ${URL}

#RoadToSanAntonio #MalachiasBand #VeteransDay2026 #ChristianRock #VeteranMusic #SouthFlorida #SanAntonio` },
  { id: 'full-band', title: 'Help us bring the full band', channel: 'Facebook / Instagram',
    body: `HELP US BRING THE FULL BAND.

Every donation, merch purchase, sponsor and share helps move us closer to San Antonio.

Cash App → ${CASH}
Campaign → ${URL}

#RoadToSanAntonio #VeteransDay2026 #MalachiasBand` },
  { id: 'road', title: 'Road to San Antonio (short)', channel: 'Stories / Reels caption',
    body: `ROAD TO SAN ANTONIO

We got the invitation. Now we're building the road to get there.

${URL}` },
  { id: 'progress', title: 'Progress update', channel: 'Stories',
    body: `[XX]% of the way to San Antonio. [$X,XXX] to go, [N] days left.

Thank you to everyone on the road so far. Keep it moving → ${URL}
Cash App → ${CAMPAIGN.cashApp.cashtag}` },
  { id: 'sponsor-thanks', title: 'Sponsor thank-you post', channel: 'Facebook / Instagram',
    body: `Welcome to the road, [Sponsor] — our newest [Tier / Category] sponsor for Veterans Day 2026 in San Antonio.

[One line about who they are and why it fits.]

Businesses and churches: there's still room on the road → ${SHEET}

#RoadToSanAntonio #VeteransDay2026` },
  { id: 'share', title: 'Share text (for supporters)', channel: 'Anywhere',
    body: `Help Malachias bring the full band to San Antonio for Veterans Day 2026. ${URL}` },
]
