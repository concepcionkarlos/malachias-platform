// Campaign event tracking on top of the Vercel Analytics that is already mounted in
// app/layout.tsx. Client-only. Event names are fixed here so the dashboard stays
// tidy; props are limited to coarse labels (never names, emails or amounts typed
// by a person).

import { track } from '@vercel/analytics'

export type CampaignEvent =
  | 'campaign_page_view'
  | 'donate_click'
  | 'cashapp_click'
  | 'cashtag_copy'
  | 'paypal_click'
  | 'paypal_copy'
  | 'merch_click'
  | 'sponsor_click'
  | 'sponsor_form_submit'
  | 'share_click'
  | 'campaign_video_play'
  | 'campaign_banner_click'

export function trackCampaign(event: CampaignEvent, props: Record<string, string | number> = {}) {
  try {
    track(event, { campaign: 'road-to-san-antonio', ...props })
  } catch {
    // analytics must never break the page
  }
}
