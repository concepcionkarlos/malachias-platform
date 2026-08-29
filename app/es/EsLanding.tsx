'use client'

// /es — Spanish landing. Sections: hero (what Malachias is), the mission, the
// campaign (live progress + Cash App), the band, the newest single, voice lessons,
// booking. Every deep link goes to the English pages, which carry the full detail.

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usd, cashAppPayUrl, type CampaignConfig, type campaignMath } from '@/lib/campaign'
import { LESSONS, usdLessons } from '@/lib/lessons'
import { BAND_ROSTER } from '@/lib/bandRoster'
import { trackCampaign } from '@/lib/campaignAnalytics'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

interface Props {
  config: CampaignConfig
  math: ReturnType<typeof campaignMath>
  featured: { title: string; credits?: string; artwork?: string; appleUrl: string } | null
}

const ROLES_ES: Record<string, string> = {
  'Director · Vocals · Guitar': 'Director · Voz · Guitarra', 'Lead Guitar': 'Guitarra líder', 'Rhythm Guitar · Riffs': 'Guitarra rítmica · Riffs', 'Bass': 'Bajo',
}

export default function EsLanding({ config, math, featured }: Props) {
  const live = math.effectiveStatus === 'active' || math.effectiveStatus === 'funded'
  return (
    <main lang="es" style={{ background: '#030201', minHeight: '100vh', color: '#e8ddd0' }}>
      <Navbar />

      {/* ── Qué es Malachias ── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 'clamp(7rem, 14vw, 10rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(120,60,10,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-10 items-center relative">
          <div>
            <motion.p {...fade()} className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>Rock cristiano · Coral Springs, Florida</motion.p>
            <motion.h1 {...fade(0.05)} className="font-display mt-4 text-white" style={{ fontSize: 'clamp(2.9rem, 8vw, 5.6rem)', lineHeight: 0.9, letterSpacing: '0.04em' }}>
              TOCAMOS PARA<br /><span style={{ color: '#c9a84c' }}>LOS QUE MÁS</span><br />LO NECESITAN.
            </motion.h1>
            <motion.p {...fade(0.1)} className="mt-6 text-[1rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '38rem' }}>
              Malachias es una banda de rock cristiano del sur de Florida, fundada por un veterano del Ejército de EE. UU. con dos misiones en Irak — primero como médico, luego como músico del Ejército. La misión es concreta: reducir la ideación suicida, levantar a la gente de la depresión y ayudar a sanar lo que deja el TEPT. Música forjada en la fe, para cualquiera que siga luchando por volver.
            </motion.p>
            <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
              <a href="#campana" className="btn btn-primary" style={{ letterSpacing: '0.18em' }}>Road to San Antonio</a>
              <a href="#contratar" className="btn btn-ghost">Contratar a la banda</a>
              <Link href="/" className="btn btn-ghost" style={{ opacity: 0.8 }}>English site</Link>
            </motion.div>
          </div>
          <motion.div {...fade(0.1)} className="relative mx-auto" style={{ width: 'min(72vw, 420px)', aspectRatio: '1/1' }} aria-hidden="true">
            <Image src="/Malachias.PNG" alt="" fill priority sizes="(max-width: 1024px) 72vw, 420px" className="object-contain" style={{ mixBlendMode: 'screen', filter: 'contrast(1.06) saturate(0.85)' }} />
          </motion.div>
        </div>
      </section>

      {/* ── Campaña ── */}
      {live && (
        <section id="campana" className="section-pad" style={{ background: '#050403', scrollMarginTop: 80 }}>
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-10 items-center">
            <div>
              <motion.p {...fade()} className="label-xs mb-3" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>Día de los Veteranos 2026 · 12 de noviembre · San Antonio, Texas</motion.p>
              <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.6rem)' }}>
                AYÚDANOS A LLEVAR<br /><span style={{ color: '#c9a84c' }}>A TODA LA BANDA</span><br />A SAN ANTONIO
              </motion.h2>
              <motion.p {...fade(0.1)} className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '36rem' }}>
                Nos invitaron a tocar en un evento del Día de los Veteranos dedicado a honrar a los veteranos de Estados Unidos. Llevar a toda la banda desde Florida —vuelos, instrumentos, hotel, transporte— es lo que paga esta campaña. Tres formas de ayudar: donar, comprar merch o patrocinar como negocio o iglesia.
              </motion.p>
              <motion.div {...fade(0.15)} className="mt-7 flex flex-wrap gap-3">
                <a href={cashAppPayUrl(config.cashApp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ letterSpacing: '0.18em' }} onClick={() => trackCampaign('cashapp_click', { surface: 'es' })}>Donar por Cash App</a>
                <Link href={`${config.path}#sponsors`} className="btn btn-ghost" onClick={() => trackCampaign('sponsor_click', { surface: 'es' })}>Patrocinar</Link>
                <Link href="/road-to-san-antonio/sponsors?lang=es" className="btn btn-ghost">Info para negocios (ES)</Link>
              </motion.div>
              <p className="mt-4 text-[0.8rem]" style={{ color: 'var(--text-2)' }}>Cash App: <b style={{ color: '#ede5d8' }}>{config.cashApp.displayName}</b> · <span style={{ color: '#c9a84c' }}>{config.cashApp.cashtag}</span> — la cuenta que Malachias usa para esta campaña. Comprueba que el nombre coincida antes de enviar.</p>
            </div>
            <motion.div {...fade(0.1)} className="tac-box" style={{ padding: '1.5rem' }}>
              <div className="flex items-baseline justify-between gap-4">
                <div><p className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Recaudado</p><p className="font-display" style={{ fontSize: '2.4rem', color: '#c9a84c', letterSpacing: '0.04em', lineHeight: 1 }}>{usd(math.raised)}</p></div>
                <div style={{ textAlign: 'right' }}><p className="label-xs" style={{ color: 'var(--text-2)', letterSpacing: '0.28em' }}>Meta</p><p className="font-display" style={{ fontSize: '1.6rem', color: '#ede5d8', letterSpacing: '0.04em', lineHeight: 1 }}>{usd(math.goal)}</p></div>
              </div>
              <div className="mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={math.percent} aria-label={`${math.percent}% recaudado`}>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)' }}><div style={{ height: '100%', width: `${math.percent}%`, background: 'linear-gradient(90deg, #8b6e3a, #c9a84c)' }} /></div>
              </div>
              <div className="mt-3 flex justify-between" style={{ fontSize: '0.66rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
                <span>{math.percent}% recaudado</span>{math.daysToEvent > 0 && <span>faltan {math.daysToEvent} días</span>}
              </div>
              <Link href={config.path} className="mt-5 inline-block" style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>La campaña completa (EN) →</Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── La banda ── */}
      <section className="section-pad" style={{ background: '#030201' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>La banda</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>CUATRO HISTORIAS. UNA MISIÓN.</motion.h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BAND_ROSTER.map((m, i) => (
              <motion.div key={m.name} {...fade(0.05 + i * 0.04)} className="tac-box overflow-hidden">
                <div style={{ position: 'relative', aspectRatio: '4/5', background: '#0a0806' }}>
                  <Image src={m.photos[0]} alt={m.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover object-top" style={{ filter: 'contrast(1.06) saturate(0.75) brightness(0.9)' }} />
                </div>
                <div style={{ padding: '0.9rem 1rem' }}>
                  <p className="font-display" style={{ fontSize: '1.3rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{m.name}</p>
                  <p className="mt-1" style={{ fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{ROLES_ES[m.role] ?? m.role}</p>
                  <p className="mt-1 text-[0.78rem]" style={{ color: 'var(--text-2)' }}>{m.origin}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
            <div className="tac-box overflow-hidden" style={{ position: 'relative', aspectRatio: '4/3' }}>
              <Image src="/band-2026.jpg" alt="Malachias — la banda completa, 2026" fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover object-top" style={{ filter: 'contrast(1.05) saturate(0.8)' }} />
            </div>
            <div>
              {featured && (
                <div className="tac-box flex items-center gap-4" style={{ padding: '1rem' }}>
                  {featured.artwork && <span style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}><Image src={featured.artwork} alt="" fill sizes="84px" className="object-cover" /></span>}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>Nuevo sencillo</p>
                    <p className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>{featured.title}</p>
                    {featured.credits && <p style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{featured.credits}</p>}
                    <a href={featured.appleUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>Escuchar →</a>
                  </div>
                </div>
              )}
              <p className="mt-5 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Toda la música, las historias detrás de cada canción y el setlist están en el sitio en inglés: <Link href="/#music" style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>The Sound</Link> · <Link href="/#stories" style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: 3 }}>Behind the Song</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clases de canto ── */}
      <section className="section-pad" style={{ background: '#050403' }}>
        <div className="max-w-6xl mx-auto px-6 tac-box grid lg:grid-cols-[3fr_2fr] gap-8 items-center" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <div>
            <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Voz · Estilo · Presencia escénica</motion.p>
            <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)' }}>CLASES DE CANTO<br /><span style={{ color: '#c9a84c' }}>CON MALACHIAS</span></motion.h2>
            <motion.p {...fade(0.1)} className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '36rem' }}>
              Artista internacional (Irak, Kuwait, Dubái, China, Irlanda y medio Estados Unidos), ex artista de Nashville, más de 30 años en escenarios. Clases de técnica vocal, estilo y presencia escénica — presenciales en {LESSONS.inPersonCounties.join(', ')} o por Zoom. Descuentos para veteranos y paquetes. Las clases son en inglés.
            </motion.p>
          </div>
          <motion.div {...fade(0.12)} className="flex flex-col gap-3 lg:items-end">
            <p className="font-display" style={{ fontSize: '2.2rem', letterSpacing: '0.04em', color: '#ede5d8', lineHeight: 1 }}>Desde {usdLessons(LESSONS.price)} <span style={{ fontSize: '1rem', color: 'var(--text-2)', letterSpacing: '0.1em' }}>/ {LESSONS.lengthMinutes} min</span></p>
            <Link href={`${LESSONS.path}#sign-up`} className="btn btn-primary" style={{ letterSpacing: '0.18em' }}>Reservar una clase</Link>
          </motion.div>
        </div>
      </section>

      {/* ── Contratar ── */}
      <section id="contratar" className="section-pad" style={{ background: '#030201', scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.p {...fade()} className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>Contrataciones</motion.p>
          <motion.h2 {...fade(0.05)} className="font-display leading-[0.92] tracking-[0.06em] text-white" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>LLEVA A MALACHIAS A TU EVENTO</motion.h2>
          <motion.p {...fade(0.1)} className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            Iglesias, bares, festivales, salones de veteranos (VFW), eventos militares y comunitarios en todo el sur de Florida. Set de 45 min, 1 h o completo; equipo propio o el del local. Escríbenos en inglés o en español.
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-7 flex flex-wrap gap-3">
            <Link href="/#booking" className="btn btn-primary" style={{ letterSpacing: '0.18em' }}>Solicitar contratación</Link>
            <a href="mailto:booking@malachiasmusic.com" className="btn btn-ghost">booking@malachiasmusic.com</a>
            <Link href="/epk" className="btn btn-ghost">Press kit (EN)</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
