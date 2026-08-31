// Page — /press: the band's verified coverage in one place. A link a sponsor,
// promoter or journalist can be sent to. Only entries that can be clicked and
// checked; wording stays factual ("featured in"), no logos, no endorsement implied.
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PressFeature from '../components/PressFeature'
import { PRESS } from '@/lib/campaign'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.malachiasmusic.com'

export const metadata: Metadata = {
  title: 'Press — MALACHIAS',
  description: 'Press coverage of Malachias, the veteran-founded Christian rock band from South Florida — including the Cashbox Magazine Artist Spotlight (March 2023).',
  alternates: { canonical: `${SITE_URL}/press` },
  openGraph: { title: 'Press — MALACHIAS', description: 'Coverage of Malachias, veteran-founded Christian rock from South Florida.', type: 'website', url: `${SITE_URL}/press` },
}

export default function PressPage() {
  const rest = PRESS.slice(1)
  return (
    <main style={{ background: '#030201', minHeight: '100vh', color: '#e8ddd0' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(7rem, 14vw, 10rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="label-xs" style={{ color: '#c9a84c', letterSpacing: '0.40em' }}>Coverage</p>
          <h1 className="font-display mt-4 text-white" style={{ fontSize: 'clamp(2.9rem, 8vw, 5.4rem)', lineHeight: 0.9, letterSpacing: '0.04em' }}>
            PRESS
          </h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '40rem' }}>
            What other people have written about the band and the man who started it. Every item links to the original — read it there.
          </p>
        </div>
      </section>

      <PressFeature background="#050403" />

      {rest.length > 0 && (
        <section className="section-pad" style={{ background: '#030201' }}>
          <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rest.map(p => (
              <a key={p.outlet + p.date} href={p.url} target="_blank" rel="noopener noreferrer" className="tac-box block" style={{ padding: '1.2rem 1.3rem', textDecoration: 'none' }}>
                <p className="font-display" style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1 }}>{p.outlet}</p>
                <p className="mt-2" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{p.date}</p>
                <p className="mt-3 text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>{p.title}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad" style={{ background: '#050403' }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>For media</p>
            <h2 className="font-display leading-[0.95] tracking-[0.05em] text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>WRITING ABOUT US?</h2>
            <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
              Bio, lineup, set lengths, technical requirements and contacts are in the press kit. Photos and stage plot on request.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/epk" className="btn btn-primary" style={{ letterSpacing: '0.16em' }}>Open the press kit</Link>
              <a href="mailto:press@malachiasmusic.com" className="btn btn-ghost">press@malachiasmusic.com</a>
            </div>
          </div>
          <div className="tac-box" style={{ padding: '1.4rem 1.5rem' }}>
            <p className="label-xs mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.30em' }}>Right now</p>
            <p className="font-display" style={{ fontSize: '1.6rem', letterSpacing: '0.05em', color: '#ede5d8', lineHeight: 1.05 }}>
              ROAD TO SAN ANTONIO — VETERANS DAY 2026
            </p>
            <p className="mt-3 text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-2)' }}>
              Malachias has been invited to perform at a Veterans Day event in San Antonio, Texas on November 12, 2026. The band is raising the cost of bringing all five musicians.
            </p>
            <Link href="/road-to-san-antonio" className="mt-4 inline-block" style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>The campaign →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
