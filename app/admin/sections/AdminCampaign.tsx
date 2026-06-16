'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, ExternalLink, Users, Tag, BookOpen, Mail, Share2, Lightbulb, RefreshCw, Hash, CalendarDays } from 'lucide-react'

const COUPON = 'MALACHIAS15'
const DISCOUNT = '15%'
const PROMO_URL = 'https://www.malachiasmusic.com/promo'
const MERCH_URL = 'https://www.malachiasmusic.com/merch'
const FW_URL = 'https://dashboard.fourthwall.com/discounts'

type Tab = 'guide' | 'posts' | 'templates' | 'hashtags' | 'tips'

function useCopy() {
  const [key, setKey] = useState<string | null>(null)
  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setKey(id)
    setTimeout(() => setKey(null), 2500)
  }
  return { copy, copiedKey: key }
}

const S = {
  card: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: '1.25rem 1.5rem',
  } as React.CSSProperties,
  label: {
    fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const,
    color: '#3a2e26', marginBottom: '0.5rem', display: 'block',
  },
  h3: { fontSize: '0.85rem', color: '#e8ddd0', fontWeight: 600, margin: '0 0 0.35rem', letterSpacing: '0.02em' },
  p: { fontSize: '0.78rem', color: '#5c5044', lineHeight: 1.65, margin: 0 } as React.CSSProperties,
  copyBtn: (active: boolean) => ({
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.4rem 0.85rem', border: 'none', cursor: active ? 'default' : 'pointer',
    background: active ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.08)',
    color: active ? '#c9a84c' : '#7a6a52',
    fontSize: '0.60rem', letterSpacing: '0.18em', textTransform: 'uppercase' as const,
    fontFamily: 'var(--font-body)', borderRadius: 4, transition: 'all 0.2s', flexShrink: 0,
  } as React.CSSProperties),
  textarea: {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)',
    padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#8a7f70',
    fontFamily: 'var(--font-body)', lineHeight: 1.65, resize: 'vertical' as const, outline: 'none',
    borderRadius: 4,
  },
}

// ── Email Templates ───────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: 'launch',
    label: 'Launch Blast',
    sublabel: 'Send to ALL existing subscribers on Day 1 — BEFORE posting publicly on Facebook',
    subject: `🎸 You get ${DISCOUNT} off — our merch store is live`,
    body: `Hey,

You've been following us. Today we're giving something back.

The official Malachias merch store is live — and as one of our subscribers, you're getting first access with ${DISCOUNT} off your entire first order.

Use code ${COUPON} at checkout.

☕ Support Mug — from $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — from $34.99

→ Shop now: ${MERCH_URL}

No label. No middleman. Every purchase goes directly to live shows, recording the next album, and veteran outreach events.

Thank you for being part of this from the start.

God bless,
Malachias

—

Hola,

Nos has estado siguiendo. Hoy te devolvemos algo.

La tienda oficial de Malachias ya está disponible — y como suscriptor, tienes acceso exclusivo con ${DISCOUNT} de descuento en todo tu primer pedido.

Usa el código ${COUPON} al pagar.

☕ Support Mug — desde $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — desde $34.99

→ Ver la tienda: ${MERCH_URL}

Sin disquera. Sin intermediarios. Cada compra va directamente a shows en vivo, grabar el próximo álbum y eventos para veteranos.

Gracias por estar con nosotros desde el principio.

Que Dios los bendiga,
Malachias`,
  },
  {
    id: 'reminder',
    label: '3-Day Reminder',
    sublabel: 'Send on Day 3 — short, no pressure, just a nudge',
    subject: `The code still works — ${DISCOUNT} off at Malachias merch`,
    body: `Hey,

Still thinking about it? Code is still valid.

Use ${COUPON} at checkout → ${MERCH_URL}

The mug starts at $8.95. That's less than coffee out. Every purchase keeps the shows coming.

God bless,
Malachias

—

¿Todavía lo estás pensando? El código sigue vigente.

Usa ${COUPON} al pagar → ${MERCH_URL}

El mug empieza en $8.95. Menos que un café afuera. Cada compra mantiene los shows.

Que Dios los bendiga,
Malachias`,
  },
  {
    id: 'auto',
    label: 'Welcome Email — AUTOMATIC (no action needed)',
    sublabel: 'Sent instantly by the system when anyone subscribes at malachiasmusic.com/promo or the homepage form',
    subject: `[AUTO] Your ${DISCOUNT} OFF code → welcome to the Malachias family 🎸`,
    body: `This email sends AUTOMATICALLY — you don't touch it.

Triggered when someone subscribes at:
  • malachiasmusic.com/promo (campaign landing page)
  • malachiasmusic.com (homepage newsletter form)

What the email delivers to the subscriber:
  → Bilingual welcome (English + Spanish)
  → Big gold box with code ${COUPON}
  → ${DISCOUNT} off entire first order
  → Full product list with prices
  → Direct link to ${MERCH_URL}
  → CAN-SPAM compliant unsubscribe link

To change the discount or code, contact your developer.`,
  },
]

// ── Campaign Posts (Facebook) ─────────────────────────────────────────────────

const CAMPAIGN_POSTS = [
  {
    id: 'p1_en',
    day: 'Day 1',
    label: 'The Big Launch — ENGLISH',
    note: 'POST THIS FIRST. Pin it to the top of your page. Best time: Tuesday or Wednesday, 9–10am.',
    platform: 'Facebook / Instagram',
    text: `We made merch.

Not because every band does it.
Not because we needed another income stream.

Because shows cost money we don't have. Recording costs money we don't have. Getting free tickets to veterans who've never been to a live rock show — that costs money we don't have.

We're not on a label. Nobody's writing us checks. It's five guys, a shared mission, and whatever we can build between day jobs and late-night rehearsals.

So we made something you can hold. Something you can wear. Something that keeps the mission alive between shows.

The official Malachias merch store is live.

☕ Support Mug — from $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — from $34.99

Subscribe at the link below and your 15% off code arrives in your inbox — our way of thanking you personally.

Every piece you buy keeps us on the road, in the studio, and at veterans events doing what we came here to do.

No label. No middleman. Just the mission.

God bless.
— Malachias

→ malachiasmusic.com/promo

#MalachiasBand #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #IndependentArtist #HealingThroughMusic #SupportTheMission #MerchLaunch #VeteranOwned #NoLabel #MissionDrivenMusic #FaithAndFreedom`,
  },
  {
    id: 'p1_es',
    day: 'Day 1',
    label: 'The Big Launch — ESPAÑOL',
    note: 'Publicar el mismo día, 1–2 horas después del post en inglés, o al mismo tiempo en otra plataforma.',
    platform: 'Facebook / Instagram',
    text: `Hicimos merch.

No porque toda banda lo hace.
No porque necesitábamos otra fuente de ingresos.

Porque los shows cuestan dinero que no tenemos. Grabar cuesta dinero que no tenemos. Conseguir entradas gratis para veteranos que nunca han estado en un show de rock — eso cuesta dinero que no tenemos.

No estamos en una disquera. Nadie nos escribe cheques. Somos cinco tipos, una misión compartida, y lo que podemos construir entre trabajos y ensayos nocturnos.

Entonces hicimos algo que puedes sostener. Algo que puedes usar. Algo que mantiene la misión viva entre shows.

La tienda oficial de Malachias ya está disponible.

☕ Support Mug — desde $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — desde $34.99

Suscríbete en el enlace de abajo y tu código de 15% de descuento llega a tu correo — nuestra forma de agradecerte personalmente.

Cada cosa que compras nos mantiene en la carretera, en el estudio, y en eventos para veteranos haciendo lo que vinimos a hacer.

Sin disquera. Sin intermediarios. Solo la misión.

Que Dios los bendiga.
— Malachias

→ malachiasmusic.com/promo

#MalachiasBand #WearTheMission #RocaCristiana #MusicaVeterana #SouthFlorida #FeEnLlamas #ArtistaIndependiente #SanarConMusica #ApoyaLaMision #LanzamientoMerch #VeteranoFundador #SinDisquera #MisionMusical #FeYLibertad`,
  },
  {
    id: 'p2',
    day: 'Day 2',
    label: 'The Mug — Bilingual (Entry Price)',
    note: "The cheapest item. Great for people who want to support but can't spend $35. Daily habit angle.",
    platform: 'Facebook / Instagram',
    text: `Every morning.
Same cup.
Same mission.

🌅 The Malachias Support Mug — starting at $8.95.

That's less than the coffee you put in it. And every morning when you pick it up, you remember what you're part of.

A veteran-founded band. Five guys. No label. A mission to be on every stage that will have them — bars, churches, rock festivals, VFW halls — because the music finds people where they are.

One mug. One morning at a time.

Subscribe and get 15% off → malachiasmusic.com/promo
Code arrives in your inbox. Use it at checkout.

—

Cada mañana.
La misma taza.
La misma misión.

☕ El Malachias Support Mug — desde $8.95.

Eso es menos que el café que le pones adentro. Y cada mañana que lo agarras, recuerdas de qué eres parte.

Una banda fundada por un veterano. Cinco tipos. Sin disquera. Con una misión de estar en cada escenario que los reciba — bares, iglesias, festivales de rock, salones VFW — porque la música encuentra a las personas donde están.

Una taza. Una mañana a la vez.

Suscríbete y obtén 15% de descuento → malachiasmusic.com/promo

#MalachiasBand #SupportMug #WearTheMission #ChristianRock #RocaCristiana #VeteranMusic #MusicaVeterana #SouthFlorida #FaithOnFire #FeEnLlamas #SupportTheMission #ApoyaLaMision`,
  },
  {
    id: 'p3',
    day: 'Day 4',
    label: 'The Mission Story — Bilingual (Most Shareable)',
    note: 'NO product push in the opening. This is the WHY. Post on a weekend — people share emotional content on Sat/Sun. This is the post that reaches new people.',
    platform: 'Facebook / Instagram',
    text: `A veteran picked up a guitar instead of a bottle.

That's not poetry. That's what happened.

When PTSD was loud and everything else went quiet. When depression made the world feel like something happening to someone else. When suicidal ideation made it hard to find a reason to wake up in the morning.

Music was the thing that made sense. Not therapy. Not medication. Not a program. A guitar. A chord progression that somehow said what couldn't be said in words.

The songs Malachias writes aren't performance. They're testimony.

And somewhere along the way, people started showing up. South Florida. Indiana. People who found us through an algorithm, at a show, or through a friend who said "you need to hear this." Something in the music said what they couldn't say.

We don't have a label telling us what to write. We don't have a PR team managing what we say. We have a mission — and we have you.

If this music has meant anything to you, the merch store is the most direct way to keep it going.

And if you're going through something right now and the music is helping — reach out. That's exactly why we're here.

→ malachiasmusic.com/promo (15% off your first order)
→ malachiasmusic.com (our full story)

Share this post if someone you know needs to hear it. It costs nothing. It might mean everything to someone.

God bless.
— Malachias

—

Un veterano agarró una guitarra en vez de una botella.

Eso no es poesía. Eso fue lo que pasó.

Cuando el PTSD estaba en su punto más alto y todo lo demás se quedó en silencio. Cuando la depresión hacía que el mundo se sintiera como algo que le estaba pasando a otra persona. Cuando los pensamientos suicidas hacían difícil encontrar una razón para despertar por la mañana.

La música fue lo que tenía sentido. No la terapia. No los medicamentos. No un programa. Una guitarra. Una progresión de acordes que de alguna manera decía lo que no se podía decir con palabras.

Las canciones que Malachias escribe no son actuación. Son testimonio.

Y en algún punto, la gente empezó a aparecer. South Florida. Indiana. Personas que nos encontraron en el algoritmo, en un show, o a través de un amigo que dijo "tienes que escuchar esto." Algo en la música decía lo que ellos no podían decir.

No tenemos una disquera que nos diga qué escribir. Tenemos una misión — y los tenemos a ustedes.

Si esta música ha significado algo para ti, la tienda de merch es la forma más directa de mantenerla viva.

Y si estás pasando por algo ahora mismo y la música te está ayudando — comunícate. Para eso exactamente estamos aquí.

→ malachiasmusic.com/promo (15% de descuento en tu primer pedido)
→ malachiasmusic.com (nuestra historia completa)

Comparte este post si conoces a alguien que necesita escucharlo. No cuesta nada. Podría significar todo para alguien.

Que Dios los bendiga.
— Malachias

#MalachiasBand #VeteranMusic #MusicaVeterana #HealingThroughMusic #SanarConMusica #ChristianRock #RocaCristiana #PTSDAwareness #PTSDConciencia #FaithOnFire #FeEnLlamas #SupportTheMission #ApoyaLaMision #NoLabel #SinDisquera #IndependentArtist #ArtistaIndependiente #SouthFlorida #MissionDrivenMusic #VeteransMentalHealth`,
  },
  {
    id: 'p4',
    day: 'Day 5',
    label: 'The Hats — Bilingual',
    note: 'The hat is public & visible — someone sees it and asks. That organic conversation is marketing. Write to that angle.',
    platform: 'Facebook / Instagram',
    text: `Someone's going to ask you about this hat.

That's the point.

You'll be in line somewhere — the grocery store, church, the gym, a job site — and someone's going to read "MALACHIAS" and ask what it is.

And then you get to tell them.

About a veteran-founded band from South Florida. About faith and rock and healing. About five guys who show up to every show like it's their last one. About music that says what's hard to say any other way.

Let the hat start the conversation.

🧢 Warrior Hat + Trucker Hat — $19.99 each.
Subscribe and get 15% off → malachiasmusic.com/promo

—

Alguien te va a preguntar sobre este hat.

Ese es el punto.

Vas a estar en fila en algún lugar — el supermercado, la iglesia, el gym, en el trabajo — y alguien va a leer "MALACHIAS" y va a preguntar qué es.

Y ahí es cuando puedes contarles.

Sobre una banda fundada por un veterano en South Florida. Sobre la fe, el rock y la sanación. Sobre cinco tipos que se presentan a cada show como si fuera el último. Sobre música que dice lo que es difícil decir de otra manera.

Que el hat empiece la conversación.

🧢 Warrior Hat + Trucker Hat — $19.99 cada uno.
Suscríbete y obtén 15% de descuento → malachiasmusic.com/promo

#MalachiasBand #WarriorHat #TruckerHat #WearTheMission #ChristianRock #RocaCristiana #VeteranMusic #MusicaVeterana #SouthFlorida #FaithOnFire #FeEnLlamas #SupportTheMission #ApoyaLaMision #WearYourFaith #UsaTuFe`,
  },
  {
    id: 'p5',
    day: 'Day 7',
    label: 'The Premium Tee — Bilingual',
    note: 'The statement piece. For people who are all-in on the mission. Three words: Faith. Freedom. Music.',
    platform: 'Facebook / Instagram',
    text: `This is the one.

Three words on the front.
Faith. Freedom. Music.

That's the entire mission in a shirt. No label. No compromise. No apologies for what we believe.

The Malachias Premium Tee — from $34.99.
Subscribe and get 15% off → malachiasmusic.com/promo

Carry the mission on your chest.

—

Esta es la pieza.

Tres palabras al frente.
Fe. Libertad. Música.

Esa es toda la misión en una camiseta. Sin disquera. Sin compromiso. Sin disculpas por lo que creemos.

La Malachias Premium Tee — desde $34.99.
Suscríbete y obtén 15% de descuento → malachiasmusic.com/promo

Lleva la misión en tu pecho.

#MalachiasBand #PremiumTee #FaithFreedomMusic #FeLbertadMusica #WearTheMission #ChristianRock #RocaCristiana #VeteranMusic #MusicaVeterana #SouthFlorida #FaithOnFire #FeEnLlamas #SupportTheMission #ApoyaLaMision #NoLabel #SinDisquera`,
  },
  {
    id: 'p6',
    day: 'Day 10–14',
    label: 'Final Urgency — Bilingual',
    note: 'Short, direct. The people who were going to buy already have. This is for the ones still thinking.',
    platform: 'Facebook / Instagram',
    text: `Still thinking about it?

The mug is $8.95. The hats are $19.99. The code takes 15% off everything.

Subscribe → code goes to your inbox → use it at checkout.

→ malachiasmusic.com/promo

God bless.
#MalachiasBand #MALACHIAS15 #WearTheMission #SupportTheMission #ChristianRock #VeteranMusic

—

¿Todavía lo estás pensando?

El mug es $8.95. Los hats son $19.99. El código quita 15% de todo.

Suscríbete → el código llega a tu correo → úsalo al pagar.

→ malachiasmusic.com/promo

Que Dios los bendiga.
#MalachiasBand #MALACHIAS15 #WearTheMission #ApoyaLaMision #RocaCristiana #MusicaVeterana`,
  },
  {
    id: 'stories',
    day: 'All Week',
    label: 'Facebook / Instagram Stories (3-slide script)',
    note: 'Post as Stories throughout the campaign. Each slide = 1 screen. Use your band photo as background.',
    platform: 'Facebook Stories / Instagram Stories',
    text: `SLIDE 1:
Background: Black or dark band photo
Text overlay (big, gold or white):
"OFFICIAL MERCH IS LIVE 🎸"
Small text: "Faith. Freedom. Music."

---

SLIDE 2:
Background: Product photo (mug, hat, or tee)
Text overlay:
"☕ Mug from $8.95"
"🧢 Hats $19.99"
"👕 Tee from $34.99"
Smaller: "Subscribe → get 15% off"

---

SLIDE 3:
Background: You / the band
Text overlay (big):
"MALACHIAS15"
Smaller: "15% off · Link in bio"
"malachiasmusic.com/promo"
Sticker: Add a Link sticker pointing to malachiasmusic.com/promo

---

STORY 2 — Mission (1 slide):
Background: Band performing live photo
Text overlay:
"A veteran picked up a guitar instead of a bottle."
"That's why the music sounds like it does."
Bottom: "→ malachiasmusic.com"

---

STORY 3 — DM Reply (copy-paste when someone DMs asking about the code):
"¡Aquí está tu código! 🎸 → MALACHIAS15
Use it at checkout: malachiasmusic.com/merch
God bless / Que Dios te bendiga 🙏"`,
  },
]

// ── Hashtag Banks ─────────────────────────────────────────────────────────────

const HASHTAG_BANKS = [
  {
    id: 'brand',
    label: 'Brand — Use on EVERY post',
    tags: '#MalachiasBand  #WearTheMission  #SupportTheMission  #MalachiasMerch  #MalachiasMission',
  },
  {
    id: 'en_genre',
    label: 'English — Genre & Sound',
    tags: '#ChristianRock  #ChristianRockBand  #RockAndFaith  #FaithBasedMusic  #ChristianMetal  #FaithRock  #ChristianHardRock  #FaithDrivenMusic',
  },
  {
    id: 'en_veteran',
    label: 'English — Veteran',
    tags: '#VeteranMusic  #VeteranOwned  #VeteranFounded  #VeteransOfAmerica  #VeteranCommunity  #VeteranLife  #MilitaryMusic  #ArmyVeteran  #VeteranStrong',
  },
  {
    id: 'en_location',
    label: 'English — South Florida & National',
    tags: '#SouthFlorida  #Miami  #SouthMiami  #MiamiFL  #SoFlo  #FloridaMusic  #SouthFloridaMusic  #MiamiBand  #FloridaRock  #Hialeah  #Kendall  #Doral',
  },
  {
    id: 'en_mission',
    label: 'English — Mission & Faith',
    tags: '#FaithOnFire  #HealingThroughMusic  #MissionDrivenMusic  #FaithOverFear  #GodFirst  #ChristianLife  #NoLabel  #IndependentArtist  #FaithAndFreedom  #GodIsGood  #PraiseAndRock',
  },
  {
    id: 'en_health',
    label: 'English — Mental Health & Veteran Healing',
    tags: '#PTSDAwareness  #VeteransMentalHealth  #HealingJourney  #SuicidePrevention  #YouAreNotAlone  #MentalHealthMatters  #VeteranHealing  #PTSDRecovery',
  },
  {
    id: 'es_genre',
    label: 'Spanish — Género & Sonido',
    tags: '#RocaCristiana  #RockCristiano  #BandaCristiana  #MusicaCristiana  #RockEnEspanol  #RocaSuave  #MusciaCristiana  #MetalCristiano',
  },
  {
    id: 'es_veteran',
    label: 'Spanish — Veterano',
    tags: '#MusicaVeterana  #MusicoVeterano  #VeteranoMusico  #VeteranoDeLaMusica  #EjercitoVeterano  #OrguloVeterano',
  },
  {
    id: 'es_location',
    label: 'Spanish — South Florida & Nacional',
    tags: '#SurDeFlorida  #Miami  #SouthMiami  #SouthFlorida  #FloridaBanda  #BandaMiami  #MusicaMiami  #HispanoMiami  #ComunidadMiami',
  },
  {
    id: 'es_mission',
    label: 'Spanish — Misión & Fe',
    tags: '#FeEnLlamas  #SanarConMusica  #ApoyaLaMision  #ArtistaIndependiente  #SinDisquera  #MisionMusical  #FesobreMiedo  #DiosPrimero  #RocaConFe  #FeYLibertad',
  },
  {
    id: 'es_health',
    label: 'Spanish — Salud Mental & Veteranos',
    tags: '#PTSDConciencia  #SaludMentalVeteranos  #SanandoConMusica  #NoEstasSolo  #SaludMentalImporta  #RecuperacionPTSD  #SanarJuntos',
  },
]

// ── Launch Guide Steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 1, done: true,
    title: '✅ Create Fourthwall coupon MALACHIAS15',
    detail: 'Already done. Code is live at 15% off.',
    link: { label: 'View in Fourthwall →', url: FW_URL },
  },
  {
    n: 2,
    title: 'Send Launch Blast to existing subscribers (Day 1, morning)',
    detail: 'Go to Email Blast → paste the "Launch Blast" template from Templates tab → send to all subscribers. Do this BEFORE posting on Facebook — they should hear it first.',
  },
  {
    n: 3,
    title: 'Post "The Big Launch" on Facebook (Day 1, 9–10am)',
    detail: 'Copy the English or Spanish version from Campaign Posts tab. Post on your profile AND the band page. Then click "..." on the post → Pin to profile.',
    link: { label: 'Open Facebook →', url: 'https://facebook.com' },
  },
  {
    n: 4,
    title: 'Post as Stories (Day 1, same day)',
    detail: 'Copy the Story scripts from Campaign Posts → post all 3 slides as Facebook Stories and Instagram Stories. Add the link sticker pointing to malachiasmusic.com/promo.',
  },
  {
    n: 5,
    title: 'Engage every comment within 1 hour',
    detail: 'Reply to every single comment. Even "🙏 God bless." The Facebook algorithm treats engagement in the first hour as the signal to push the post further. This is not optional.',
  },
  {
    n: 6,
    title: 'Post "The Mug" (Day 2, 9am)',
    detail: 'Product focus post — entry price $8.95. Most accessible item. Use it to reach people who follow but haven\'t committed to a purchase yet.',
  },
  {
    n: 7,
    title: 'Post "The Hats" (Day 3, 9am) + Send 3-Day Email Blast',
    detail: 'Post the hats post on Facebook. Same day, go to Email Blast and send the "3-Day Reminder" email to all subscribers.',
  },
  {
    n: 8,
    title: 'Post "The Mission Story" (Day 4 — weekend preferred)',
    detail: 'This is the most shareable post. No hard product push — just the story. Post Saturday or Sunday morning. Tag South Florida venues, veteran pages, and Christian rock communities. This one gets shared the most.',
  },
  {
    n: 9,
    title: 'Post "The Premium Tee" (Day 7)',
    detail: 'The statement piece. By now anyone who was on the fence has either bought the mug or the hat. This post is for people ready to make the bigger commitment.',
  },
  {
    n: 10,
    title: 'Post "Final Urgency" (Day 10–14)',
    detail: 'Short, direct. The people who were going to act already did. This post is for the ones still sitting on it. One last nudge.',
  },
  {
    n: 11,
    title: 'Check your results',
    detail: `Watch the subscriber count on this page. Go to Fourthwall → Orders → look for orders using ${COUPON}. Two numbers: new subscribers + orders with the code. That's your entire campaign ROI.`,
    link: { label: 'Check Fourthwall Orders →', url: 'https://dashboard.fourthwall.com/orders' },
  },
]

// ── Tips ──────────────────────────────────────────────────────────────────────

const TIPS = [
  { icon: '⏰', title: 'Best posting times', body: 'Tuesday – Thursday, 9–11am or 6–9pm EST. Saturday 10am for emotional/shareable content. Avoid Monday mornings and Sunday evenings.' },
  { icon: '📌', title: 'Pin the main post', body: 'After posting the Launch post → click "..." on the post → "Pin to profile." Keeps it at the top of your page for the entire campaign without you doing anything.' },
  { icon: '💬', title: 'Reply to every comment — fast', body: 'The Facebook algorithm scores posts heavily on engagement in the first 60 minutes. Every reply counts. Even "🙏 God bless, link in bio." Get to every comment within the hour.' },
  { icon: '📸', title: 'Add a real photo to every post', body: 'Posts with images get 2–3× more organic reach than text-only posts. Use product photos, a shot of you wearing the hat, or a band performance photo. Your face in the photo beats a product-only shot every time.' },
  { icon: '📖', title: 'Share to Stories too — every post', body: 'After posting, tap Share → Share to Story. This hits a different audience (people who scroll Stories, not feed). Zero extra work, 2× the reach.' },
  { icon: '🎯', title: 'Tag relevant pages', body: 'On the Mission Story post, tag: veteran organizations in South Florida, Christian rock pages, local churches you\'ve played at. Comment on their posts the same day. This is the organic version of paid promotion.' },
  { icon: '🚫', title: "Don't post the coupon code publicly", body: `Keep ${COUPON} out of public posts. The entire point is "subscribe to get it" — that's what builds your email list. If you post the code publicly, people skip the signup and you lose the subscriber data.` },
  { icon: '📧', title: 'Email subscribers BEFORE posting publicly', body: 'Subscribers feel like insiders when they get it first. That trust converts. Public Facebook gets it second — that\'s fine. The order matters.' },
  { icon: '🤝', title: 'Cross-post to veteran and Christian groups', body: 'South Florida has active veteran Facebook groups (Vietnam Vets, Army Vets Miami, etc.) and Spanish-language Christian groups. Share the Mission Story post there — not the product posts. The story earns the reach; the product posts can come after.' },
  { icon: '📊', title: 'Measure only 2 things', body: `(1) Subscriber count growth on this page — refresh after each post to see impact. (2) Orders using ${COUPON} in Fourthwall → Orders. Everything else is noise.` },
  { icon: '🔁', title: 'When to run this campaign again', body: 'New merch drop, before a big show, around Veterans Day (Nov 11), Christmas season, or any time you have news. The same template works — just update the specific details.' },
  { icon: '📱', title: 'DM reply when someone asks for the code', body: 'Copy from Stories tab in Campaign Posts. Send it instantly when someone DMs. Don\'t make them wait — a 2-hour delay loses the sale.' },
]

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminCampaign() {
  const [tab, setTab] = useState<Tab>('guide')
  const [subCount, setSubCount] = useState<number | null>(null)
  const [loadingSubs, setLoadingSubs] = useState(false)
  const { copy, copiedKey } = useCopy()

  const fetchSubs = useCallback(async () => {
    setLoadingSubs(true)
    try {
      const res = await fetch('/api/newsletter')
      const data = await res.json()
      setSubCount((data.subscribers ?? []).length)
    } catch {
      setSubCount(null)
    } finally {
      setLoadingSubs(false)
    }
  }, [])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'guide',     label: 'Launch Guide',     icon: <CalendarDays size={13} /> },
    { key: 'posts',     label: 'Campaign Posts',   icon: <Share2 size={13} /> },
    { key: 'templates', label: 'Email Templates',  icon: <Mail size={13} /> },
    { key: 'hashtags',  label: 'Hashtag Bank',     icon: <Hash size={13} /> },
    { key: 'tips',      label: 'Tips',             icon: <Lightbulb size={13} /> },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={S.label}>Outreach</span>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', color: '#e8ddd0', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>
          MERCH CAMPAIGN
        </h1>
        <p style={S.p}>Full bilingual campaign management — South Florida + national audience. Posts, emails, hashtags, schedule, and tips all in one place.</p>
      </div>

      {/* Status bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

        <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={17} style={{ color: '#c9a84c' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: '#e8ddd0', lineHeight: 1 }}>
              {loadingSubs ? '—' : (subCount ?? '—')}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#3a2e26', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
              Total Subscribers
            </div>
          </div>
          <button onClick={fetchSubs} title="Refresh" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <RefreshCw size={13} style={{ color: loadingSubs ? '#c9a84c' : '#3a2e26' }} />
          </button>
        </div>

        <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tag size={17} style={{ color: '#c9a84c' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: '#c9a84c', letterSpacing: '0.08em' }}>{COUPON}</div>
            <div style={{ fontSize: '0.65rem', color: '#3a2e26', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
              {DISCOUNT} Off — Live ✓
            </div>
          </div>
          <button onClick={() => copy(COUPON, 'coupon')} style={S.copyBtn(copiedKey === 'coupon')}>
            {copiedKey === 'coupon' ? <Check size={11} /> : <Copy size={11} />}
            {copiedKey === 'coupon' ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ExternalLink size={17} style={{ color: '#c9a84c' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.78rem', color: '#e8ddd0' }}>/promo</div>
            <div style={{ fontSize: '0.65rem', color: '#3a2e26', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>Campaign Landing Page</div>
          </div>
          <a href={PROMO_URL} target="_blank" rel="noopener noreferrer" style={{ ...S.copyBtn(false), textDecoration: 'none' }}>
            <ExternalLink size={11} /> Open
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem 1rem', border: 'none', cursor: 'pointer',
            background: 'none', fontFamily: 'var(--font-body)',
            fontSize: '0.72rem', letterSpacing: '0.06em', whiteSpace: 'nowrap',
            color: tab === t.key ? '#c9a84c' : '#5c5044',
            borderBottom: tab === t.key ? '2px solid #c9a84c' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Guide */}
      {tab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ ...S.p, marginBottom: '0.5rem' }}>
            11 steps. Follow this sequence. The order matters — email subscribers before posting publicly, engage comments fast, post emotional content on weekends.
          </p>
          {STEPS.map(step => (
            <div key={step.n} style={{ ...S.card, display: 'flex', gap: '1.25rem', alignItems: 'flex-start', opacity: step.done ? 0.6 : 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: step.done ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.12)',
                border: `1px solid ${step.done ? 'rgba(201,168,76,0.50)' : 'rgba(201,168,76,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#c9a84c',
              }}>
                {step.done ? '✓' : step.n}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={S.h3}>{step.title}</h3>
                <p style={{ ...S.p, whiteSpace: 'pre-line' }}>{step.detail}</p>
                {step.link && (
                  <a href={step.link.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.65rem', fontSize: '0.68rem', color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.08em' }}>
                    <ExternalLink size={11} /> {step.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Campaign Posts */}
      {tab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={S.p}>
            6 posts + stories, fully written in English and Spanish. Each includes hashtags. Copy → paste → post. Follow the day sequence in the Launch Guide.
          </p>
          {CAMPAIGN_POSTS.map(post => (
            <div key={post.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.58rem', padding: '0.2rem 0.55rem', background: 'rgba(201,168,76,0.12)', color: '#c9a84c', borderRadius: 3, letterSpacing: '0.10em', fontWeight: 700 }}>
                      {post.day}
                    </span>
                    <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.55rem', background: 'rgba(255,255,255,0.04)', color: '#5c5044', borderRadius: 3, letterSpacing: '0.08em' }}>
                      {post.platform}
                    </span>
                  </div>
                  <h3 style={S.h3}>{post.label}</h3>
                  <p style={{ ...S.p, fontSize: '0.70rem', color: '#c9a84c', opacity: 0.7 }}>{post.note}</p>
                </div>
                <button onClick={() => copy(post.text, post.id)} style={S.copyBtn(copiedKey === post.id)}>
                  {copiedKey === post.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === post.id ? 'Copied!' : 'Copy Post'}
                </button>
              </div>
              <textarea
                readOnly
                value={post.text}
                rows={Math.min(post.text.split('\n').length + 2, 20)}
                style={S.textarea}
                onClick={e => (e.currentTarget as HTMLTextAreaElement).select()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab: Email Templates */}
      {tab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={S.p}>
            3 email templates — launch blast, 3-day reminder, and the automatic welcome. Bilingual (EN + ES) so they work for South Florida and national audiences in the same send.
          </p>
          {EMAIL_TEMPLATES.map(tpl => (
            <div key={tpl.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={S.h3}>{tpl.label}</h3>
                  <p style={{ ...S.p, fontSize: '0.70rem' }}>{tpl.sublabel}</p>
                </div>
                <button onClick={() => copy(`Subject: ${tpl.subject}\n\n${tpl.body}`, tpl.id)} style={S.copyBtn(copiedKey === tpl.id)}>
                  {copiedKey === tpl.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === tpl.id ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div style={{ marginBottom: '0.6rem' }}>
                <span style={{ ...S.label, marginBottom: '0.3rem' }}>Subject line</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <code style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#8a7f70', borderRadius: 4, fontFamily: 'monospace' }}>
                    {tpl.subject}
                  </code>
                  <button onClick={() => copy(tpl.subject, `${tpl.id}-sub`)} style={S.copyBtn(copiedKey === `${tpl.id}-sub`)}>
                    {copiedKey === `${tpl.id}-sub` ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
              <span style={{ ...S.label, marginBottom: '0.3rem' }}>Email body</span>
              <textarea
                readOnly
                value={tpl.body}
                rows={Math.min(tpl.body.split('\n').length + 2, 20)}
                style={S.textarea}
                onClick={e => (e.currentTarget as HTMLTextAreaElement).select()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab: Hashtag Bank */}
      {tab === 'hashtags' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={S.p}>
            Organized by category. Use the Brand tags on every post. Mix English + Spanish tags to reach South Florida and national audiences in the same post. Don't use more than 20–25 tags per post.
          </p>
          {HASHTAG_BANKS.map(bank => (
            <div key={bank.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.65rem' }}>
                <h3 style={S.h3}>{bank.label}</h3>
                <button onClick={() => copy(bank.tags, bank.id)} style={S.copyBtn(copiedKey === bank.id)}>
                  {copiedKey === bank.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === bank.id ? 'Copied!' : 'Copy Tags'}
                </button>
              </div>
              <p style={{ ...S.p, color: '#7a6a52', letterSpacing: '0.04em', lineHeight: 2.0 }}>{bank.tags}</p>
            </div>
          ))}
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: '0.75rem' }}>Recommended combo per post type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Launch Post', combo: 'Brand + EN Genre + EN Veteran + EN Location + ES Genre + ES Mission (20 tags max)' },
                { label: 'Mission Story', combo: 'Brand + EN Mission + EN Mental Health + EN Veteran + ES Mission + ES Mental Health — this post needs the healing hashtags most' },
                { label: 'Product Posts', combo: 'Brand + EN Genre + Location + ES Genre + ES Location (keep it lighter — 10–15 tags)' },
                { label: 'Stories', combo: 'No hashtags needed in Stories — the Link sticker does the work' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '0.6rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#e8ddd0', margin: '0 0 0.2rem', fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#5c5044', margin: 0, lineHeight: 1.65 }}>{item.combo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tips */}
      {tab === 'tips' && (
        <div>
          <p style={{ ...S.p, marginBottom: '1.5rem' }}>
            These are the specific decisions that separate a campaign that gets likes from one that gets sales and subscribers.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ ...S.card, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.4rem', flexShrink: 0, lineHeight: 1 }}>{tip.icon}</div>
                <div>
                  <h3 style={S.h3}>{tip.title}</h3>
                  <p style={S.p}>{tip.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...S.card }}>
            <h3 style={{ ...S.h3, marginBottom: '1rem', fontSize: '0.90rem' }}>Quick Reference FAQ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { q: 'What is the coupon code?', a: `${COUPON} — ${DISCOUNT} off entire order, no minimum, all products. Live in Fourthwall.` },
                { q: 'Where do people go to get the discount?', a: `malachiasmusic.com/promo — they enter their email, the code goes to their inbox automatically. They don't see it on the screen.` },
                { q: 'Do I manually send the coupon to each subscriber?', a: 'Never. The system sends it automatically the instant someone subscribes. You do nothing.' },
                { q: 'What if someone already subscribed and doesn\'t have the code?', a: 'They can go to malachiasmusic.com/promo and submit their email again. The API checks if they\'re already subscribed but still sends the email.' },
                { q: 'How do I know if someone used the code?', a: 'Fourthwall dashboard → Orders → filter or search for MALACHIAS15. Every order with that code was driven by this campaign.' },
                { q: 'Someone DM\'d me asking for the code — what do I say?', a: `Copy the DM Reply template from Campaign Posts tab. It includes the code and the merch link.` },
                { q: 'When should I run this again?', a: 'New merch drop, before a major show, Veterans Day (Nov 11), Christmas season, or any time you have news worth announcing.' },
                { q: 'How do I reach the Indiana and national audience?', a: 'The English versions of every post reach them. The Mission Story post is the one that travels farthest nationally — emotional content gets shared beyond your local network.' },
              ].map((item, i, arr) => (
                <div key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '0.6rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#e8ddd0', margin: '0 0 0.2rem', fontWeight: 600 }}>Q: {item.q}</p>
                  <p style={{ fontSize: '0.75rem', color: '#5c5044', margin: 0, lineHeight: 1.65 }}>A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
