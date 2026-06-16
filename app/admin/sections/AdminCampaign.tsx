'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, ExternalLink, Users, Tag, BookOpen, Mail, Share2, Lightbulb, RefreshCw } from 'lucide-react'

const COUPON = 'MALACHIAS15'
const DISCOUNT = '15%'
const PROMO_URL = 'https://www.malachiasmusic.com/promo'
const MERCH_URL = 'https://www.malachiasmusic.com/merch'
const FW_URL = 'https://dashboard.fourthwall.com/discounts'

type Tab = 'guide' | 'templates' | 'social' | 'tips'

// ── Copy helper ───────────────────────────────────────────────────────────────

function useCopy() {
  const [key, setKey] = useState<string | null>(null)
  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setKey(id)
    setTimeout(() => setKey(null), 2500)
  }
  return { copy, copiedKey: key }
}

// ── Shared styles ──────────────────────────────────────────────────────────────

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
    fontFamily: 'var(--font-body)', lineHeight: 1.65, resize: 'none' as const, outline: 'none',
    borderRadius: 4,
  },
}

// ── Email Templates ───────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: 'launch',
    label: 'Launch Blast',
    sublabel: 'Send to all existing subscribers on launch day',
    subject: `🎸 We just dropped something — and you get ${DISCOUNT} off`,
    body: `Hey,

The official Malachias merch store is LIVE — and as one of our subscribers, you're getting first access.

Use code ${COUPON} at checkout for ${DISCOUNT} off your entire first order.

👕 Premium Tee — from $34.99
🧢 Warrior Hat — $19.99
🧢 Trucker Hat — $19.99
☕ Support Mug — from $8.95

→ Shop now: ${MERCH_URL}

No label. No corporate backing. Every purchase goes directly to live shows, original recordings, and veteran outreach.

Thank you for being part of this mission.
God bless,
Malachias

—

Hola,

¡La tienda oficial de Malachias ya está disponible! Y como parte de nuestra comunidad, tienes acceso exclusivo.

Usa el código ${COUPON} al hacer tu pedido y obtén ${DISCOUNT} de descuento en toda tu primera compra.

→ Ver la tienda: ${MERCH_URL}

Sin disquera. Cada compra va directamente a shows en vivo, grabaciones originales y eventos para veteranos.

Gracias por apoyar la misión.
Que Dios los bendiga,
Malachias`,
  },
  {
    id: 'reminder',
    label: '3-Day Reminder',
    sublabel: 'Send 3 days after the launch blast — keeps it in front of them',
    subject: `⏰ Still thinking about it — your ${DISCOUNT} off code expires soon`,
    body: `Hey,

Quick reminder — your ${DISCOUNT} off code is still valid.

Use ${COUPON} at checkout → ${MERCH_URL}

The mug starts at $8.95. Less than a coffee. Every purchase supports the mission.

God bless,
Malachias

—

Hola,

Recordatorio rápido — tu código de ${DISCOUNT} de descuento sigue vigente.

Usa ${COUPON} al hacer tu pedido → ${MERCH_URL}

El mug empieza en $8.95. Menos que un café. Cada compra apoya la misión.

Que Dios los bendiga,
Malachias`,
  },
  {
    id: 'auto',
    label: 'Welcome Email (Automatic)',
    sublabel: 'Auto-sent when someone subscribes on the website — no action needed from you',
    subject: `[AUTO] Your ${DISCOUNT} OFF code is here — welcome to the Malachias family 🎸`,
    body: `This email is sent automatically by the system when someone subscribes at:
• malachiasmusic.com/promo
• malachiasmusic.com (homepage newsletter form)

You don't need to do anything. It sends instantly.

What the email includes:
→ Welcome message (bilingual EN/ES)
→ Big gold coupon box with code ${COUPON}
→ ${DISCOUNT} off at checkout
→ Product list with prices
→ Link to the merch store
→ Unsubscribe link (CAN-SPAM compliant)

To change the coupon code, contact your developer.`,
  },
]

// ── Social Post Templates ─────────────────────────────────────────────────────

const SOCIAL_TEMPLATES = [
  {
    id: 'fb_bilingual',
    label: 'Facebook — Bilingual (Recommended)',
    platform: 'Facebook / Instagram',
    text: `🎸 Official merch store is LIVE — get ${DISCOUNT} off your first order!
🎸 ¡La tienda oficial ya está disponible — obtén ${DISCOUNT} de descuento en tu primer pedido!

Subscribe → ${PROMO_URL}
Suscríbete → ${PROMO_URL}

Code arrives in your inbox / El código llega a tu correo. 🙏

#MalachiasBand #ChristianRock #RocaCristiana #VeteranMusic #SouthFlorida #FaithOnFire`,
  },
  {
    id: 'fb_en',
    label: 'Facebook — English',
    platform: 'Facebook',
    text: `🎸 We just dropped our official merch store — and we want to celebrate WITH you.

Subscribe at ${PROMO_URL} and get ${DISCOUNT} OFF your first order. Code arrives in your inbox.

No label. No corporate backing. Just a veteran-founded band with one mission: healing through music. 🙏

Every piece you wear carries that mission into the world.

→ ${PROMO_URL}

#MalachiasBand #ChristianRock #VeteranMusic #SupportTheMission #SouthFlorida #FaithOnFire`,
  },
  {
    id: 'fb_es',
    label: 'Facebook — Español',
    platform: 'Facebook',
    text: `🎸 ¡Acabamos de lanzar nuestra tienda oficial de mercancía — y queremos celebrarlo CONTIGO!

Suscríbete en ${PROMO_URL} y obtén ${DISCOUNT} DE DESCUENTO en tu primer pedido. El código llega a tu correo.

Sin disquera. Sin respaldo corporativo. Solo una banda fundada por un veterano con una misión: sanar a través de la música. 🙏

Cada prenda que uses lleva esa misión al mundo.

→ ${PROMO_URL}

#MalachiasBand #RocaCristiana #MusicaVeterana #ApoyaLaMision #SouthFlorida #FeEnLlamas`,
  },
  {
    id: 'dm',
    label: 'DM Reply — When someone asks in comments',
    platform: 'Facebook / Instagram DM',
    text: `¡Aquí está tu código! 🎸 → ${COUPON}
Here's your code! Use it at checkout: ${MERCH_URL}
God bless / Que Dios te bendiga 🙏`,
  },
]

// ── Launch Guide ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 1,
    title: 'Create the Fourthwall coupon',
    detail: `Open Fourthwall → Discounts → New Discount\nCode: ${COUPON} | Type: Percentage | Value: 15% | Min order: None\nActivate and save.`,
    link: { label: 'Open Fourthwall Discounts →', url: FW_URL },
  },
  {
    n: 2,
    title: 'Copy and post on Facebook',
    detail: 'Go to the Social Posts tab and copy the bilingual Facebook post. Post it on your personal profile AND the band page. Pin it to the top of the page.',
  },
  {
    n: 3,
    title: 'New subscribers get the code automatically',
    detail: `Anyone who subscribes at malachiasmusic.com/promo or the homepage form gets the coupon emailed immediately. This is fully automatic — you don't do anything.`,
    link: { label: 'View Promo Page →', url: PROMO_URL },
  },
  {
    n: 4,
    title: 'Send the launch blast to existing subscribers',
    detail: 'Go to Email Blast, use the "Launch Blast" template from the Templates tab, paste it in, and send to all subscribers.',
  },
  {
    n: 5,
    title: 'Engage every comment',
    detail: 'Reply to every comment on the Facebook post within 1 hour. Even a "🙏 God bless, link in bio!" helps. Use the DM reply template in Social Posts tab for people who ask.',
  },
  {
    n: 6,
    title: 'Day 3: Send the reminder blast',
    detail: 'Go to Email Blast and send the "3-Day Reminder" template. Keep it short. Don\'t overthink it — the goal is to stay top of mind.',
  },
  {
    n: 7,
    title: 'Check your results',
    detail: 'Watch the subscriber count on this page. Check Fourthwall dashboard for orders using MALACHIAS15. That\'s your entire ROI in two numbers.',
  },
]

// ── Tips ──────────────────────────────────────────────────────────────────────

const TIPS = [
  { icon: '⏰', title: 'Best posting times', body: 'Tuesday–Thursday, 9–11am or 6–9pm EST. Avoid Sundays — lowest engagement day for bands.' },
  { icon: '📌', title: 'Pin the post', body: 'After posting → click "..." on the post → Pin to profile. Keeps it visible for weeks without you doing anything.' },
  { icon: '💬', title: 'Reply to every comment', body: 'Facebook algorithm rewards early engagement. Reply within 1 hour. Even a "🙏" counts. More replies = more people see it.' },
  { icon: '📸', title: 'Add a photo to the post', body: 'Posts with images get 2–3× more organic reach. Use a product photo or a selfie with the merch. Your face > product photo.' },
  { icon: '📖', title: 'Share to Stories too', body: 'After posting, share to Facebook Story and Instagram Story. Different audience, zero extra work. Takes 10 seconds.' },
  { icon: '🚫', title: "Don't post the coupon code publicly", body: `Keep ${COUPON} out of public posts. The "subscribe to get it" exclusivity is what drives signups and builds your email list.` },
  { icon: '📧', title: 'Email existing subscribers first', body: 'Your list already trusts you. Send the launch blast BEFORE the public Facebook post. Early buyers create social proof.' },
  { icon: '📊', title: 'Measure only 2 things', body: `(1) Subscriber count growth on this page. (2) Orders using ${COUPON} in Fourthwall. Everything else is noise.` },
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
    { key: 'guide',     label: 'Launch Guide', icon: <BookOpen size={13} /> },
    { key: 'templates', label: 'Email Templates', icon: <Mail size={13} /> },
    { key: 'social',    label: 'Social Posts', icon: <Share2 size={13} /> },
    { key: 'tips',      label: 'Tips', icon: <Lightbulb size={13} /> },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={S.label}>Outreach</span>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', color: '#e8ddd0', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>
          MERCH CAMPAIGN
        </h1>
        <p style={S.p}>Manage your 15% off subscriber campaign — templates, tracking, and step-by-step guide.</p>
      </div>

      {/* Status bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

        {/* Subscriber count */}
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
          <button
            onClick={fetchSubs}
            title="Refresh"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e26', padding: 4, display: 'flex' }}
          >
            <RefreshCw size={13} style={{ color: loadingSubs ? '#c9a84c' : '#3a2e26' }} />
          </button>
        </div>

        {/* Active coupon */}
        <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tag size={17} style={{ color: '#c9a84c' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: '#c9a84c', letterSpacing: '0.08em' }}>
              {COUPON}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#3a2e26', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
              {DISCOUNT} Off — Active Coupon
            </div>
          </div>
          <button onClick={() => copy(COUPON, 'coupon')} style={S.copyBtn(copiedKey === 'coupon')}>
            {copiedKey === 'coupon' ? <Check size={11} /> : <Copy size={11} />}
            {copiedKey === 'coupon' ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Promo page link */}
        <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ExternalLink size={17} style={{ color: '#c9a84c' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.78rem', color: '#e8ddd0', letterSpacing: '0.02em' }}>/promo</div>
            <div style={{ fontSize: '0.65rem', color: '#3a2e26', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
              Campaign Landing Page
            </div>
          </div>
          <a
            href={PROMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...S.copyBtn(false), textDecoration: 'none' }}
          >
            <ExternalLink size={11} />
            Open
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1rem', border: 'none', cursor: 'pointer',
              background: 'none', fontFamily: 'var(--font-body)',
              fontSize: '0.72rem', letterSpacing: '0.06em',
              color: tab === t.key ? '#c9a84c' : '#5c5044',
              borderBottom: tab === t.key ? '2px solid #c9a84c' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Guide */}
      {tab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ ...S.p, marginBottom: '0.5rem' }}>
            Follow these 7 steps to run the campaign. Steps 1–2 you do once. Steps 3–4 are automated or semi-automated. Step 7 is how you know it worked.
          </p>
          {STEPS.map(step => (
            <div key={step.n} style={{ ...S.card, display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#c9a84c',
              }}>
                {step.n}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={S.h3}>{step.title}</h3>
                <p style={{ ...S.p, whiteSpace: 'pre-line' }}>{step.detail}</p>
                {step.link && (
                  <a
                    href={step.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      marginTop: '0.65rem', fontSize: '0.68rem', color: '#c9a84c',
                      textDecoration: 'none', letterSpacing: '0.08em',
                    }}
                  >
                    <ExternalLink size={11} />
                    {step.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Email Templates */}
      {tab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={S.p}>
            Copy these templates into Email Blast. All templates are bilingual (English + Spanish) — perfect for South Florida + national audience.
          </p>
          {EMAIL_TEMPLATES.map(tpl => (
            <div key={tpl.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={S.h3}>{tpl.label}</h3>
                  <p style={{ ...S.p, fontSize: '0.70rem' }}>{tpl.sublabel}</p>
                </div>
                <button
                  onClick={() => copy(`Subject: ${tpl.subject}\n\n${tpl.body}`, tpl.id)}
                  style={S.copyBtn(copiedKey === tpl.id)}
                >
                  {copiedKey === tpl.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === tpl.id ? 'Copied!' : 'Copy All'}
                </button>
              </div>

              {/* Subject line */}
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

              {/* Body */}
              <span style={{ ...S.label, marginBottom: '0.3rem' }}>Email body</span>
              <textarea
                readOnly
                value={tpl.body}
                rows={Math.min(tpl.body.split('\n').length + 2, 18)}
                style={S.textarea}
                onClick={e => (e.currentTarget as HTMLTextAreaElement).select()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab: Social Posts */}
      {tab === 'social' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={S.p}>
            Copy these directly into Facebook or Instagram. The bilingual post is recommended — reaches your South Florida (Spanish) and national (English) audience in one post.
          </p>
          {SOCIAL_TEMPLATES.map(tpl => (
            <div key={tpl.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={S.h3}>{tpl.label}</h3>
                  <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.55rem', background: 'rgba(201,168,76,0.08)', color: '#7a6a52', borderRadius: 3, letterSpacing: '0.08em' }}>
                    {tpl.platform}
                  </span>
                </div>
                <button onClick={() => copy(tpl.text, tpl.id)} style={S.copyBtn(copiedKey === tpl.id)}>
                  {copiedKey === tpl.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === tpl.id ? 'Copied!' : 'Copy Post'}
                </button>
              </div>
              <textarea
                readOnly
                value={tpl.text}
                rows={Math.min(tpl.text.split('\n').length + 2, 14)}
                style={S.textarea}
                onClick={e => (e.currentTarget as HTMLTextAreaElement).select()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab: Tips */}
      {tab === 'tips' && (
        <div>
          <p style={{ ...S.p, marginBottom: '1.5rem' }}>
            These tips make the difference between a campaign that gets a few shares and one that actually converts to subscribers and sales.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
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

          {/* FAQ */}
          <div style={{ marginTop: '2rem', ...S.card }}>
            <h3 style={{ ...S.h3, marginBottom: '1rem', fontSize: '0.90rem' }}>Quick Reference</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { q: 'What is the coupon code?', a: `${COUPON} — ${DISCOUNT} off, no minimum order, all products.` },
                { q: 'Where does someone go to subscribe?', a: `malachiasmusic.com/promo — the campaign landing page. Share this link on Facebook.` },
                { q: 'Do I manually send the coupon to each subscriber?', a: 'No. The system sends it automatically the moment someone subscribes. You do nothing.' },
                { q: 'How do I know if someone used the code?', a: 'Go to your Fourthwall dashboard → Orders, then filter or search for orders using MALACHIAS15.' },
                { q: 'What if someone DMs me on Facebook asking for the code?', a: 'Copy the DM Reply template from Social Posts. Send it to them directly. Easy.' },
                { q: 'When should I run this campaign again?', a: 'For new drops, holidays, or when you have a show announcement. Keep the same code — it already works.' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '0.6rem' }}>
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
