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
    sublabel: 'Send to ALL existing subscribers on Day 1 — BEFORE posting publicly on Facebook. They hear it first.',
    subject: `You get ${DISCOUNT} off — Malachias merch is live 🎸`,
    body: `Hey,

You've been here. That matters.

The official Malachias merch store is live — and as one of our subscribers, you get first access with ${DISCOUNT} off your entire first order.

Use code ${COUPON} at checkout.

☕ Support Mug — from $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — from $34.99

→ ${MERCH_URL}

No label. No compromise. Faith, freedom, and music made the way it was meant to be made.

When you wear Malachias, you carry the mission with you.

Thank you for being part of this.

God bless,
Malachias`,
  },
  {
    id: 'reminder',
    label: '3-Day Reminder',
    sublabel: 'Send on Day 3. Short. No pressure. Just a reminder the code still works.',
    subject: `Still here — your ${DISCOUNT} off code`,
    body: `Hey,

Still thinking about it? No rush.

Code: ${COUPON} — ${DISCOUNT} off → ${MERCH_URL}

The mug starts at $8.95. Take it or leave it — but the people who grabbed one haven't looked back.

God bless,
Malachias`,
  },
  {
    id: 'auto',
    label: 'Welcome Email — AUTOMATIC (no action needed)',
    sublabel: 'Sent instantly by the system when anyone subscribes at malachiasmusic.com/promo or the homepage form',
    subject: `[AUTO] Your ${DISCOUNT} off code — welcome to the mission 🎸`,
    body: `This email sends AUTOMATICALLY — you don't touch it.

Triggered when someone subscribes at:
  • malachiasmusic.com/promo (campaign landing page)
  • malachiasmusic.com (homepage newsletter form)

What the subscriber receives:
  → "You subscribed. Here's your code." (no pity angle — straight to value)
  → Big gold coupon box: ${COUPON}
  → ${DISCOUNT} off entire first order
  → "No label. No compromise. Faith, freedom, and music made the way it was meant to be made."
  → Product list with prices
  → Link to ${MERCH_URL}
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
    text: `This is for you.

You've been following the music. Showing up to shows. Sharing songs with the right people at the right moment.

You already know what this band is about.

So we made something.

Official Malachias merch is live — and you get first access with 15% off your first order. Subscribe below and the code goes straight to your inbox.

☕ Support Mug — from $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — from $34.99

No label. No compromise. Faith, freedom, and music made the way it was meant to be made.

Wear it. Let people ask.

Thank you for being here.
— Malachias

→ malachiasmusic.com/promo

#MalachiasBand #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #NoLabel #SupportTheMission #MerchLaunch #FaithAndFreedom`,
  },
  {
    id: 'p1_es',
    day: 'Day 1',
    label: 'The Big Launch — ESPAÑOL',
    note: 'Post the same day, 1–2 hours after the English version.',
    platform: 'Facebook / Instagram',
    text: `Esto es para ti.

Has estado siguiendo la música. Apareciendo en los shows. Compartiendo canciones con las personas correctas en el momento correcto.

Ya sabes de qué se trata esta banda.

Así que hicimos algo.

La tienda oficial de Malachias ya está disponible — y tienes acceso primero con 15% de descuento en tu primer pedido. Suscríbete abajo y el código llega directo a tu correo.

☕ Support Mug — desde $8.95
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
👕 Premium Tee — desde $34.99

Sin disquera. Sin compromiso. Fe, libertad y música hecha como debe hacerse.

Úsalo. Deja que la gente pregunte.

Gracias por estar aquí.
— Malachias

→ malachiasmusic.com/promo

#MalachiasBand #WearTheMission #RocaCristiana #MusicaVeterana #SouthFlorida #FeEnLlamas #SinDisquera #ApoyaLaMision #LanzamientoMerch #FeYLibertad`,
  },
  {
    id: 'p2',
    day: 'Day 2',
    label: 'The Mug — Daily Habit (Entry Price)',
    note: "Entry point at $8.95. Angle: how you start the day says something about what you're aligned with. Accessible for anyone.",
    platform: 'Facebook / Instagram',
    text: `How you start the day matters.

Start it on the right side of the mission.

☕ The Malachias Support Mug — from $8.95.

Less than the coffee you put in it. More than a reminder — a daily choice.

Every morning. Same cup. Same conviction.

Subscribe and get 15% off → malachiasmusic.com/promo
Code arrives in your inbox. Use it at checkout.

#MalachiasBand #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #SupportTheMission`,
  },
  {
    id: 'p3',
    day: 'Day 4',
    label: 'The Mission Post (Most Shareable)',
    note: 'No hard product push. Lead with who the band is and what it stands for — strength, not struggle. Post on a weekend when people have time to read and share. This is the one that reaches new people.',
    platform: 'Facebook / Instagram',
    text: `Some bands chase a deal.

We chase a mission.

No label. No filter. No apologies for what we believe.

Faith. Freedom. Music.

Not as a tagline — as a way of operating. Every show we play, every song we write, every stage we earn without anyone in a suit telling us what to do.

Five guys from South Florida who believe music still has something real to say. And who show up — to bars, churches, rock festivals, VFW halls, veteran events — because the music finds people where they are.

If you've been part of this from the start, thank you. That means something.
If you're just finding out what Malachias is — welcome.

The merch store is live. Wear the mission.

→ malachiasmusic.com/promo (15% off — subscribe, code hits your inbox)

God bless.
— Malachias

#MalachiasBand #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #NoLabel #IndependentArtist #MissionDrivenMusic #FaithAndFreedom #SupportTheMission`,
  },
  {
    id: 'p4',
    day: 'Day 5',
    label: 'The Hats — Conversation Starter',
    note: 'The hat is the most public item — it starts conversations. The angle is: you become a representative of the mission without having to say a word.',
    platform: 'Facebook / Instagram',
    text: `Wear it. Let people ask.

You don't need to explain the whole thing upfront.

Just wear the hat. And when someone sees "MALACHIAS" and wants to know — you'll know exactly what to say.

🧢 Warrior Hat + Trucker Hat — $19.99 each.

Faith. Freedom. Music. On your head. Everywhere you go.

Subscribe and get 15% off → malachiasmusic.com/promo

#MalachiasBand #WarriorHat #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #SupportTheMission #WearYourFaith`,
  },
  {
    id: 'p5',
    day: 'Day 7',
    label: 'The Premium Tee — Identity Statement',
    note: "The statement piece. Three words. Confidence over explanation. For people who are all-in.",
    platform: 'Facebook / Instagram',
    text: `Three words.

Faith. Freedom. Music.

If you know, you know.

No label. No compromise. No explanation needed.

👕 The Malachias Premium Tee — from $34.99.
Subscribe and get 15% off → malachiasmusic.com/promo

#MalachiasBand #PremiumTee #FaithFreedomMusic #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida #FaithOnFire #NoLabel #SupportTheMission`,
  },
  {
    id: 'p6',
    day: 'Day 10–14',
    label: 'Final Post — Confident, Not Desperate',
    note: 'Short and direct. No urgency pressure. The people ready to buy will. This is just a reminder that the code still works.',
    platform: 'Facebook / Instagram',
    text: `The code still works.

MALACHIAS15 — 15% off your first order.

The mug starts at $8.95. Subscribe, get the code, use it.

→ malachiasmusic.com/promo

God bless.
#MalachiasBand #MALACHIAS15 #WearTheMission #ChristianRock #VeteranMusic #SouthFlorida`,
  },
  {
    id: 'stories',
    day: 'All Week',
    label: 'Stories Script (Facebook / Instagram)',
    note: 'Post all 3 slides as Stories the same day as the launch post. Stories hit a different audience than the feed.',
    platform: 'Facebook Stories / Instagram Stories',
    text: `SLIDE 1 — The Hook
Background: Dark band photo or black
Text (large, gold or white): "OFFICIAL MERCH IS LIVE 🎸"
Subtext: "Faith. Freedom. Music."

---

SLIDE 2 — The Products
Background: Product photo
Text:
"☕ Mug from $8.95"
"🧢 Hats $19.99"
"👕 Tee from $34.99"
Bottom: "Subscribe → 15% off"

---

SLIDE 3 — The CTA
Background: Band photo (you, or the band together)
Text (large): "No label. Our way."
Smaller: "malachiasmusic.com/promo"
Action: Add a Link sticker pointing to malachiasmusic.com/promo

---

DM REPLY — When someone asks for the code in comments or DMs:
"Here's your code 🎸 → MALACHIAS15
Use it at: malachiasmusic.com/merch
God bless."`,
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
