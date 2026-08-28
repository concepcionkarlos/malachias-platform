// Discography — the band's releases, used by the homepage hero ("Out now" card),
// the Music section (featured player + discography grid + videos) and the EPK.
//
// The list is pulled live from Apple's public iTunes Lookup API (artist id below)
// so a new single shows up on the site the day it lands on Apple Music, with no
// deploy. YouTube ids come from the channel's public RSS feed, matched by title.
// Both calls are cached for six hours; if either is unreachable the hand-kept
// FALLBACK list below is used so the site never renders an empty section.

export interface Release {
  id: string            // Apple Music collection id
  title: string         // "Because of You"
  credits?: string      // "feat. Josh Hudson"
  artist: string        // primary artist on the release ("Malachias", "Josh Hudson")
  primary: boolean      // true = Malachias's own release; false = a guest feature on someone else's
  type: 'single' | 'album'
  releaseDate: string   // YYYY-MM-DD
  trackCount: number
  artwork?: string      // 600×600 cover
  appleUrl: string
  youtubeId?: string
}

export const ARTIST = {
  appleId: '937313536',
  youtubeChannelId: 'UCboGsplcNdd9Pha-n83mZYA',
  appleArtistUrl: 'https://music.apple.com/us/artist/malachias/937313536',
  spotifyArtistUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
  youtubeUrl: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
}

const REVALIDATE_SECONDS = 6 * 60 * 60

// Snapshot of the catalog (Aug 2026). Only used when the live lookup fails.
const SNAPSHOT: Omit<Release, 'artist' | 'primary'>[] = [
  { id: '6797267014', title: 'Because of You', credits: 'feat. Josh Hudson', type: 'single', releaseDate: '2026-08-28', trackCount: 1, youtubeId: 'THaEIdprrr0',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d7/d8/0a/d7d80ad6-0d2e-fa7a-6f06-6d0af768d7f3/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/because-of-you-feat-josh-hudson-single/6797267014' },
  { id: '6778771863', title: 'Chosen', credits: 'feat. Among Saints & Josh Hudson', type: 'single', releaseDate: '2026-07-03', trackCount: 1, youtubeId: '3LE0QWX6lp0',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/73/99/18739995-484f-6b5a-a581-5f88f5ec5f76/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/chosen-feat-among-saints-josh-hudson-single/6778771863' },
  { id: '1884556823', title: 'Thank God For You', credits: 'feat. Josh Hudson', type: 'single', releaseDate: '2026-03-27', trackCount: 1, youtubeId: '6l4yzm72FJQ',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/47/32/ad/4732ad34-45a6-bdb3-899d-e3ae86c71d7d/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/thank-god-for-you-feat-josh-hudson-single/1884556823' },
  { id: '1866780876', title: 'Rise Above', credits: 'feat. Among Saints & Josh Hudson', type: 'single', releaseDate: '2026-02-20', trackCount: 1, youtubeId: 'AYIi87dCi-Q',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/04/57/5c/04575ca4-2a68-ab45-584d-5d785f21a6f6/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/rise-above-feat-among-saints-josh-hudson-single/1866780876' },
  { id: '1865791189', title: 'Adrenaline', credits: 'feat. Josh Hudson & Among Saints', type: 'single', releaseDate: '2026-01-23', trackCount: 1, youtubeId: 'jx5Yymv3exk',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6b/c2/33/6bc23328-6822-75e1-a2f4-cff15f52f4bd/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/adrenaline-feat-josh-hudson-among-saints-single/1865791189' },
  { id: '1843009621', title: 'The War Within (the Spartan Pledge Song)', credits: 'feat. Among Saints & Josh Hudson', type: 'single', releaseDate: '2025-10-17', trackCount: 1, youtubeId: 'KwCXC5kHi-c',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/93/84/de/9384decc-d9c4-3414-c7cb-24c07decada0/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/the-war-within-the-spartan-pledge-song-feat-among/1843009621' },
  { id: '1870151953', title: 'The War Within', credits: 'feat. Among Saints & Josh Hudson', type: 'single', releaseDate: '2025-09-28', trackCount: 1, youtubeId: 'UjcCzA3emW8',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cb/db/20/cbdb2071-dee1-aece-6d56-8b74eec9be30/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/the-war-within-feat-among-saints-josh-hudson-single/1870151953' },
  { id: '1810128798', title: 'People Are People', credits: 'feat. Jesse Saint & Josh Hudson', type: 'single', releaseDate: '2025-05-30', trackCount: 1, youtubeId: 'jk8OEFKLTig',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/21/e4/74/21e47489-1f72-75c5-58b7-cfdb85695e16/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/people-are-people-feat-jesse-saint-josh-hudson-single/1810128798' },
  { id: '1762200808', title: 'No Dad of Mine', credits: 'feat. Josh Hudson', type: 'single', releaseDate: '2024-09-20', trackCount: 1, youtubeId: '6mlBvqYj99A',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a7/0d/8e/a70d8e18-d20a-396c-353f-12129b0720a5/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/no-dad-of-mine-feat-josh-hudson-single/1762200808' },
  { id: '1749740500', title: "Not My Father's Son", credits: 'feat. Khris Glaring', type: 'single', releaseDate: '2024-06-16', trackCount: 1, youtubeId: '6QyMVro93sA',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/75/43/95/754395f0-ed64-2206-7baf-a2a0511db853/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/not-my-fathers-son-feat-khris-glaring-single/1749740500' },
  { id: '1736862060', title: 'For Those That Remain', type: 'album', releaseDate: '2022-07-04', trackCount: 8, youtubeId: 'B1eWfry_Y9c',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/21/19/53/21195319-db10-f7fa-044f-1d2715e070e2/artwork.jpg/600x600bb.jpg',
    appleUrl: 'https://music.apple.com/us/album/for-those-that-remain/1736862060' },
]

const FALLBACK: Release[] = SNAPSHOT.map(r => ({ ...r, artist: 'Malachias', primary: true }))

// "Because of You (feat. Josh Hudson) - Single" → { title, credits }
function splitTitle(raw: string): { title: string; credits?: string } {
  const noType = raw.replace(/\s+-\s+(Single|EP)$/i, '').trim()
  const feat = noType.match(/^(.*?)\s*\(feat\.\s*([^)]+)\)\s*(.*)$/i)
  if (!feat) return { title: noType }
  const title = `${feat[1]}${feat[3] ? ' ' + feat[3] : ''}`.trim()
  return { title, credits: `feat. ${feat[2].trim()}` }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

interface ItunesCollection {
  wrapperType: string
  collectionType?: string
  collectionId: number
  collectionName: string
  artistName?: string
  releaseDate: string
  trackCount: number
  artworkUrl100?: string
  collectionViewUrl: string
}

async function fetchAppleCatalog(): Promise<Release[]> {
  const url = `https://itunes.apple.com/lookup?id=${ARTIST.appleId}&entity=album&limit=200&country=US`
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
  if (!res.ok) throw new Error(`itunes ${res.status}`)
  const json = (await res.json()) as { results: ItunesCollection[] }
  return json.results
    .filter(r => r.wrapperType === 'collection' && r.collectionId && r.collectionName)
    .map(r => {
      const { title, credits } = splitTitle(r.collectionName)
      const artist = r.artistName?.trim() || 'Malachias'
      return {
        id: String(r.collectionId),
        title,
        credits,
        artist,
        primary: /malachias/i.test(artist),
        type: (/\s-\s(Single|EP)$/i.test(r.collectionName) || r.trackCount <= 3) ? 'single' : 'album',
        releaseDate: r.releaseDate.slice(0, 10),
        trackCount: r.trackCount,
        artwork: r.artworkUrl100?.replace('100x100bb', '600x600bb'),
        appleUrl: r.collectionViewUrl.replace(/\?.*$/, ''),
      } satisfies Release
    })
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
}

async function fetchYouTubeIndex(): Promise<{ id: string; title: string }[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ARTIST.youtubeChannelId}`
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
  if (!res.ok) throw new Error(`youtube rss ${res.status}`)
  const xml = await res.text()
  const out: { id: string; title: string }[] = []
  const entry = /<entry>([\s\S]*?)<\/entry>/g
  let m: RegExpExecArray | null
  while ((m = entry.exec(xml))) {
    const id = m[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const title = m[1].match(/<title>([^<]+)<\/title>/)?.[1]
    if (id && title) out.push({ id, title })
  }
  return out
}

/** Live discography, newest first. Never throws — falls back to the snapshot. */
export async function fetchReleases(): Promise<Release[]> {
  let releases: Release[]
  try {
    releases = await fetchAppleCatalog()
    if (releases.length === 0) releases = FALLBACK
  } catch {
    releases = FALLBACK
  }

  try {
    const videos = await fetchYouTubeIndex()
    releases = releases.map(r => {
      const key = norm(`${r.title} ${r.credits ?? ''}`)
      const base = norm(r.title)
      const hit = videos.find(v => norm(v.title) === key) ?? videos.find(v => norm(v.title).startsWith(base))
      return hit ? { ...r, youtubeId: hit.id } : r
    })
  } catch {
    // keep whatever ids the fallback carried
    const byId = new Map(FALLBACK.map(f => [f.id, f.youtubeId]))
    releases = releases.map(r => r.youtubeId ? r : { ...r, youtubeId: byId.get(r.id) })
  }

  return releases
}

/** Newest release the band put out under its own name. */
export const featuredRelease = (releases: Release[]): Release | undefined =>
  releases.find(r => r.primary) ?? releases[0]

export const appleEmbedUrl = (r: Release) =>
  r.appleUrl.replace('https://music.apple.com', 'https://embed.music.apple.com')

export const youtubeWatchUrl = (r: Release) =>
  r.youtubeId ? `https://www.youtube.com/watch?v=${r.youtubeId}` : ARTIST.youtubeUrl

// Spotify has no keyless lookup, so deep-link into a search for the exact title —
// it lands on the track for a one-tap play.
export const spotifySearchUrl = (r: Release) =>
  `https://open.spotify.com/search/${encodeURIComponent(`Malachias ${r.title}`)}`

export function formatReleaseDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
