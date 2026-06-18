import Link from 'next/link'
import RehearsalRSVP from './RehearsalRSVP'
import { getRehearsalByToken, getSongs } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export default async function RehearsalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [rehearsal, allSongs] = await Promise.all([
    getRehearsalByToken(token),
    getSongs(),
  ])
  if (!rehearsal) {
    return (
      <div style={{ minHeight: '100vh', background: '#030202', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase' }}>Rehearsal Invite</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '1.6rem', color: '#e8ddd0', letterSpacing: '0.06em', fontFamily: 'Georgia, serif' }}>Link not found</h1>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: '#5c5044', lineHeight: 1.6 }}>
            This invite link is invalid or has expired. Ask the band for a new link.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '10px 24px', background: '#c9a84c', color: '#030202', borderRadius: 6, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}>
            malachiasmusic.com
          </Link>
        </div>
      </div>
    )
  }
  const songs = allSongs.filter(s => (rehearsal.songIds ?? []).includes(s.id))
  return <RehearsalRSVP token={token} rehearsal={rehearsal} songs={songs} />
}
