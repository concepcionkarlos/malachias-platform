// Page — /journal/[slug]: individual journal ("field notes") article. Statically
// pre-rendered per entry from JOURNAL_ENTRIES; renders the post body and 404s on
// unknown slugs.
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { JOURNAL_ENTRIES } from '@/lib/journalEntries'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return JOURNAL_ENTRIES.map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const entry = JOURNAL_ENTRIES.find(e => e.slug === slug)
  if (!entry) return { title: 'Journal — MALACHIAS' }
  return {
    title: `${entry.title} — MALACHIAS Journal`,
    description: entry.excerpt,
  }
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params
  const entry = JOURNAL_ENTRIES.find(e => e.slug === slug)
  if (!entry) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#e8ddd0', fontFamily: 'var(--font-body)' }}>
      {/* Top nav */}
      <div style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(5,5,5,0.96)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.26em', color: '#e8ddd0', textDecoration: 'none', fontSize: '0.85rem' }}>MALACHIAS</Link>
        <Link href="/#journal" style={{ fontSize: '0.60rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', textDecoration: 'none' }}>← Field Notes</Link>
      </div>

      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        {/* Tag + date */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#c9a84c' }}>{entry.tag}</span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(201,168,76,0.30)' }}>·</span>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.16em', color: '#7a6e5e' }}>{entry.date}</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7vw, 4rem)', lineHeight: 0.95, letterSpacing: '0.04em', color: '#ede5d8', margin: '0 0 2rem' }}>
          {entry.title.toUpperCase()}
        </h1>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.45), transparent)', marginBottom: '2.5rem' }} />

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {entry.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(220,210,196,0.75)' }}>{para}</p>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.30)' }}>✠ Malachi 3:1</span>
          <Link href="/#booking" style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a84c', textDecoration: 'none', border: '1px solid rgba(201,168,76,0.28)', padding: '0.5rem 1rem' }}>Book Us</Link>
        </div>
      </article>
    </div>
  )
}
