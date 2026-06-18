import { notFound } from 'next/navigation'
import RehearsalRSVP from './RehearsalRSVP'
import { getRehearsalByToken, getSongs } from '@/lib/venueStore'

export const dynamic = 'force-dynamic'

export default async function RehearsalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [rehearsal, allSongs] = await Promise.all([
    getRehearsalByToken(token),
    getSongs(),
  ])
  if (!rehearsal) notFound()
  const songs = allSongs.filter(s => rehearsal.songIds.includes(s.id))
  return <RehearsalRSVP token={token} rehearsal={rehearsal} songs={songs} />
}
