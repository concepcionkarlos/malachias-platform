// Google Places text-search proxy (auth-gated via isAuthenticated; 401 otherwise).
// GET: requires the ?q= query (optional ?location=), calls the Google Places Text Search
// API with GOOGLE_PLACES_API_KEY, and returns up to 20 mapped PlaceSearchResult items.
// Responds 400 if q is missing, 503 if the API key is unset, and 502 on upstream errors.
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import type { PlaceSearchResult } from '@/lib/data'

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const location = searchParams.get('location') ?? ''

  if (!query) return NextResponse.json({ error: 'q is required' }, { status: 400 })

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 503 })

  const textQuery = location ? `${query} in ${location}` : query

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(textQuery)}&key=${apiKey}`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) return NextResponse.json({ error: 'Google Places API error' }, { status: 502 })

  const data = await res.json()
  const results: PlaceSearchResult[] = (data.results ?? []).slice(0, 20).map((p: {
    place_id: string; name: string; formatted_address: string;
    formatted_phone_number?: string; website?: string; rating?: number; types?: string[]
  }) => ({
    placeId: p.place_id,
    name: p.name,
    address: p.formatted_address,
    phone: p.formatted_phone_number,
    website: p.website,
    rating: p.rating,
    types: p.types ?? [],
  }))

  return NextResponse.json(results)
}
