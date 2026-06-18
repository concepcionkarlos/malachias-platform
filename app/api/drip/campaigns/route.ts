// Admin drip campaigns API (auth-gated; returns 401 if unauthenticated).
// GET: returns the list of all drip campaigns.
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDripCampaigns } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const campaigns = await getDripCampaigns()
  return NextResponse.json(campaigns)
}
