// Page — /road-to-san-antonio/sponsors: the sponsorship overview a business or church
// can read on screen, print, or "Save as PDF" from the browser (print styles below
// strip the site chrome). English by default, Spanish with ?lang=es (South Florida
// businesses). Content comes from lib/campaign.ts so it never drifts from the
// campaign page. A designed PDF can be produced later from this page.
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { getCampaign } from '@/lib/campaignServer'
import { SPONSOR_TIERS, SPONSOR_CATEGORIES, PRESS, campaignMath, campaignUrl, formatEventDate, usd, type SponsorTierId } from '@/lib/campaign'
import { ARTIST } from '@/lib/releases'
import PrintButton from './PrintButton'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.malachiasmusic.com'

export const metadata: Metadata = {
  title: 'Sponsorship Opportunities — Road to San Antonio',
  description: 'Sponsorship overview for Malachias — Road to San Antonio, Veterans Day 2026 (November 12, San Antonio, Texas): tiers, benefits, what sponsorship supports, and contact. English and Spanish.',
  alternates: { canonical: `${campaignUrl(SITE_URL)}/sponsors`, languages: { en: `${campaignUrl(SITE_URL)}/sponsors`, es: `${campaignUrl(SITE_URL)}/sponsors?lang=es` } },
  openGraph: { title: 'Sponsor the Road to San Antonio — Malachias', description: 'Sponsorship tiers and benefits for the Veterans Day 2026 campaign.', type: 'website', url: `${campaignUrl(SITE_URL)}/sponsors` },
}

const LABEL: React.CSSProperties = { fontSize: '0.6rem', letterSpacing: '0.36em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'var(--font-body)', fontWeight: 700 }
const RULE: React.CSSProperties = { border: 'none', borderTop: '1px solid rgba(201,168,76,0.18)', margin: '2.25rem 0' }

type Lang = 'en' | 'es'

const T = {
  en: {
    eyebrow: 'Sponsorship opportunities', dateLine: (d: string, c: string) => `${d} · ${c}`,
    band: 'The band',
    bandText: 'Malachias is a veteran-founded Christian rock band based in Coral Springs, South Florida. The founder served in the U.S. Army — two tours in Iraq, as a medic and as an Army bandsman. Since the debut album For Those That Remain (2022) the band has released a steady run of singles, most recently Because of You (August 2026). The mission is specific: reduce suicidal ideation, lift people from depression, and help heal what PTSD leaves behind — through music, played for bars, churches, festivals, VFW halls and veteran events.',
    opp: 'The opportunity',
    oppText: (ev: string, city: string, date: string, n: number) => `Malachias has been invited to perform at a ${ev} event in ${city} on ${date}, dedicated to honoring America's veterans. The campaign exists to bring the full band — ${n} people and their instruments — from South Florida to Texas.`,
    goal: 'Campaign goal',
    goalText: (lines: string) => `Sponsorship supports: ${lines}. The target is adjusted as the event organizer confirms what the event covers; any surplus funds free veteran outreach shows in South Florida.`,
    tiers: 'Sponsorship tiers', custom: 'Custom',
    specific: (cats: string) => `Specific sponsorships: ${cats}. Covering a flight, hotel nights, ground transportation, gear or meals directly counts at the matching tier. Recognition covers what the band controls — the campaign page, its social channels and its own content. Anything involving the event's venue, signage or stage is the organizer's decision.`,
    contact: 'Contact', sponsorship: 'Sponsorship', page: 'Campaign page', form: 'Sponsor form', site: 'Website',
    other: 'Leer en español', otherHref: '?lang=es',
  },
  es: {
    eyebrow: 'Oportunidades de patrocinio', dateLine: (d: string, c: string) => `${d} · ${c}`,
    band: 'La banda',
    bandText: 'Malachias es una banda de rock cristiano fundada por un veterano, con base en Coral Springs, sur de Florida. El fundador sirvió en el Ejército de EE. UU.: dos misiones en Irak, como médico y como músico del Ejército. Desde el álbum debut For Those That Remain (2022) la banda ha publicado sencillos de forma constante; el más reciente, Because of You (agosto de 2026). La misión es concreta: reducir la ideación suicida, levantar a la gente de la depresión y ayudar a sanar lo que deja el TEPT, a través de música tocada en bares, iglesias, festivales, salones de veteranos (VFW) y eventos militares.',
    opp: 'La oportunidad',
    oppText: (ev: string, city: string, date: string, n: number) => `Malachias ha sido invitado a tocar en un evento del Día de los Veteranos (${ev}) en ${city} el ${date}, dedicado a honrar a los veteranos de Estados Unidos. La campaña existe para llevar a toda la banda —${n} personas y sus instrumentos— del sur de Florida a Texas.`,
    goal: 'Meta de la campaña',
    goalText: (lines: string) => `El patrocinio cubre: ${lines}. La meta se ajusta a medida que el organizador confirma qué cubre el evento; cualquier excedente financia conciertos gratuitos para veteranos en el sur de Florida.`,
    tiers: 'Niveles de patrocinio', custom: 'A medida',
    specific: (cats: string) => `Patrocinios específicos: ${cats}. Cubrir un vuelo, noches de hotel, transporte terrestre, equipo o comidas cuenta directamente en el nivel correspondiente. El reconocimiento abarca lo que la banda controla: la página de la campaña, sus redes y su propio contenido. Todo lo relativo al recinto, la señalización o el escenario del evento lo decide el organizador.`,
    contact: 'Contacto', sponsorship: 'Patrocinio', page: 'Página de la campaña', form: 'Formulario de patrocinio', site: 'Sitio web',
    other: 'Read in English', otherHref: '?lang=en',
  },
} as const

const TIER_NAME_ES: Record<SponsorTierId, string> = { supporter: 'Colaborador', bronze: 'Patrocinador Bronce', silver: 'Patrocinador Plata', gold: 'Patrocinador Oro', presenting: 'Socio presentador' }
const BENEFITS_ES: Record<SponsorTierId, string[]> = {
  supporter: ['Nombre del negocio u organización en la página de la campaña', 'Agradecimiento en el cierre de la campaña'],
  bronze: ['Logo en la página de la campaña', 'Agradecimiento en redes sociales', 'Listado de patrocinadores'],
  silver: ['Logo destacado en la página de la campaña', 'Reconocimiento en redes sociales', 'Mención en el contenido de la campaña', 'Listado con enlace'],
  gold: ['Logo en posición premium en la página de la campaña', 'Reconocimiento principal en redes', 'Patrocinador destacado', 'Inclusión en vídeos y publicaciones seleccionados de la campaña'],
  presenting: ['Alianza a medida: viaje, hotel, transporte, equipo o comidas', 'Reconocimiento diseñado según lo que haces posible', 'Contáctanos para construirlo juntos'],
}
const CATEGORIES_ES = ['Patrocinador oficial de viaje', 'Patrocinador de hotel', 'Patrocinador de transporte', 'Patrocinador de equipo', 'Patrocinador de comidas', 'Socio presentador del Road to San Antonio']
const BUDGET_ES: Record<string, string> = { Travel: 'viaje', Lodging: 'alojamiento', 'Instrument baggage': 'equipaje de instrumentos', 'Local transportation': 'transporte local', Meals: 'comidas', 'Production / equipment': 'producción / equipo', 'Campaign fees': 'comisiones de la campaña', Contingency: 'imprevistos' }

function fmtDate(iso: string, lang: Lang) {
  if (lang === 'en') return formatEventDate(iso)
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('es-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export default async function SponsorKitPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang: rawLang } = await searchParams
  const lang: Lang = rawLang === 'es' ? 'es' : 'en'
  const t = T[lang]
  const { config } = await getCampaign()
  const math = campaignMath(config)
  const url = campaignUrl(SITE_URL)
  const date = fmtDate(config.eventDate, lang)
  const budget = lang === 'es'
    ? config.budgetLines.map(b => BUDGET_ES[b.label] ?? b.label.toLowerCase()).join(', ')
    : config.budgetLines.map(b => b.label.toLowerCase()).join(', ')

  return (
    <div className="kit" lang={lang} style={{ minHeight: '100vh', background: '#060504', color: '#e8ddd0', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .kit a { color: #c9a84c; text-decoration: underline; text-underline-offset: 3px; }
        @media print {
          .kit { background: #fff !important; color: #111 !important; }
          .kit * { color: #111 !important; border-color: #999 !important; background: transparent !important; box-shadow: none !important; }
          .kit .no-print { display: none !important; }
          .kit .tier { break-inside: avoid; }
        }
      `}</style>

      <div className="no-print" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)', padding: '1.1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href={config.path} style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', letterSpacing: '0.26em', color: '#e8ddd0', textDecoration: 'none' }}>← ROAD TO SAN ANTONIO</Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href={t.otherHref} style={{ fontSize: '0.64rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{t.other}</Link>
          <PrintButton />
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={LABEL}>{t.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 4.6rem)', lineHeight: 0.92, letterSpacing: '0.04em', margin: '0.75rem 0 0' }}>
          MALACHIAS<br />ROAD TO SAN ANTONIO<br /><span style={{ color: '#c9a84c' }}>{lang === 'es' ? 'DÍA DE LOS VETERANOS 2026' : 'VETERANS DAY 2026'}</span>
        </h1>
        <p style={{ marginTop: '1.25rem', fontSize: '1.05rem', color: '#a89880' }}>{t.dateLine(date, config.eventCity)}</p>

        <hr style={RULE} />

        <p style={LABEL}>{t.band}</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.75 }}>{t.bandText}</p>

        {PRESS.length > 0 && (
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#a89880', lineHeight: 1.7 }}>
            {lang === 'es' ? 'Reseñado anteriormente en ' : 'Previously featured in '}
            {PRESS.map((p, i) => (
              <span key={p.outlet}>{i > 0 && ' · '}<a href={p.url} target="_blank" rel="noopener noreferrer">{p.outlet}</a> ({p.date}, {lang === 'es' ? 'pág.' : 'p.'} 16)</span>
            ))}.
          </p>
        )}

        <p style={{ ...LABEL, marginTop: '2rem' }}>{t.opp}</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.75 }}>{t.oppText(config.eventName, config.eventCity, date, config.travelers)}</p>

        <p style={{ ...LABEL, marginTop: '2rem' }}>{t.goal}</p>
        <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '2.4rem', letterSpacing: '0.04em' }}>{usd(math.goal)}</p>
        <p style={{ lineHeight: 1.75, color: '#a89880' }}>{t.goalText(budget)}</p>

        <hr style={RULE} />

        <p style={LABEL}>{t.tiers}</p>
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {SPONSOR_TIERS.map(tier => (
            <div key={tier.id} className="tier" style={{ border: '1px solid rgba(201,168,76,0.2)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'minmax(8rem, 1fr) 2fr', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', margin: 0 }}>{lang === 'es' ? TIER_NAME_ES[tier.id] : tier.name}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#c9a84c', margin: '0.2rem 0 0' }}>{tier.amount === null ? t.custom : usd(tier.amount)}</p>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                {(lang === 'es' ? BENEFITS_ES[tier.id] : tier.benefits).map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#a89880', lineHeight: 1.7 }}>
          {t.specific((lang === 'es' ? CATEGORIES_ES : SPONSOR_CATEGORIES).join(' · '))}
        </p>

        <hr style={RULE} />

        <p style={LABEL}>{t.contact}</p>
        <p style={{ marginTop: '0.75rem', lineHeight: 1.9 }}>
          {t.sponsorship}: <a href={`mailto:${config.sponsorEmail}`}>{config.sponsorEmail}</a><br />
          {t.page}: <a href={url}>{url}</a><br />
          {t.form}: <a href={`${url}#sponsor-form`}>{url}#sponsor-form</a><br />
          {t.site}: <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, '')}</a>
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#a89880', lineHeight: 1.9 }}>
          Instagram @malachiasmusic · Facebook Malachias · <a href={ARTIST.spotifyArtistUrl}>Spotify</a> · <a href={ARTIST.appleArtistUrl}>Apple Music</a> · <a href={ARTIST.youtubeUrl}>YouTube</a>
        </p>
      </div>
    </div>
  )
}
