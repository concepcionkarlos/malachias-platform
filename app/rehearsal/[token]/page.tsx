import { notFound } from 'next/navigation'
import RehearsalRSVP from './RehearsalRSVP'
import type { Rehearsal, Song } from '@/lib/data'

async function getData(token: string): Promise<{ rehearsal: Rehearsal; songs: Song[] } | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${base}/api/rehearsals/${token}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function RehearsalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const data = await getData(token)
  if (!data) notFound()
  return <RehearsalRSVP token={token} rehearsal={data.rehearsal} songs={data.songs} />
}
