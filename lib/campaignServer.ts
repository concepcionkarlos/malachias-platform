// Server-side view of the Road to San Antonio campaign: code defaults from
// lib/campaign.ts merged with what the admin has saved in the content store
// (goal, amount raised, status, Cash App details, sponsors, updates). Also checks
// whether the Cash App QR file actually exists under /public so the page can show
// a clean "pending" state instead of a broken image. Never import from client code.

import fs from 'fs'
import path from 'path'
import { readContent } from './store'
import { fetchFWCollectionProducts, type FWProduct } from './fourthwall'
import { CAMPAIGN, type CampaignConfig, type Sponsor, type CampaignUpdate } from './campaign'

export interface CampaignView {
  config: CampaignConfig
  qrReady: boolean
  sponsors: Sponsor[]          // visible only, gold → supporter
  updates: CampaignUpdate[]    // published only, newest first
}

const TIER_ORDER = ['presenting', 'gold', 'silver', 'bronze', 'supporter']

export async function getCampaign(): Promise<CampaignView> {
  const store = await readContent()
  const o = store.campaign ?? {}
  const config: CampaignConfig = {
    ...CAMPAIGN,
    ...o,
    cashApp: { ...CAMPAIGN.cashApp, ...(o.cashApp ?? {}) },
  }

  const qrPath = path.join(process.cwd(), 'public', config.cashApp.qrImage.replace(/^\//, ''))
  const qrReady = config.cashApp.qrImage !== '' && fs.existsSync(qrPath)

  const sponsors = (store.campaignSponsors ?? [])
    .filter(s => s.visible !== false)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.addedAt.localeCompare(b.addedAt))

  const updates = (store.campaignUpdates ?? [])
    .filter(u => u.published)
    .sort((a, b) => b.date.localeCompare(a.date) || b.episode - a.episode)

  return { config, qrReady, sponsors, updates }
}

/** Campaign merch = the Fourthwall collection named in the config; [] if none yet. */
export async function getCampaignProducts(config: CampaignConfig): Promise<FWProduct[]> {
  return fetchFWCollectionProducts(config.merchCollectionSlug).catch(() => [])
}
