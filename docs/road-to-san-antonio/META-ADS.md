# Road to San Antonio — Meta Ads (Facebook + Instagram) playbook

Prerequisite: a Facebook **Page** for Malachias (not the personal profile) linked to Instagram @malachiasmusic in Meta Business Suite, with Juan as admin. Without it nothing below is possible.

## What to advertise
Only two things, in this order: (1) **the campaign page** — `https://www.malachiasmusic.com/road-to-san-antonio` (donations + sponsors), (2) later, **voice lessons** — `https://www.malachiasmusic.com/voice-lessons` (local, South Florida only).

## Campaign 1 — Road to San Antonio (Traffic)
- **Objective:** Traffic → website. (Not "Engagement": we want clicks on the Cash App links, which Vercel Analytics records as `donate_click` / `cashapp_click`.)
- **Budget:** $7/day test for 7 days ($49). Keep the two best ad sets and raise to $10–15/day in October.
- **Creative:** the 30 s announcement Reel (EN for ad set A, ES for ad set B). Primary text = the bilingual launch post (admin → Social posts). Headline: *Help us bring the full band to San Antonio*. CTA button: *Learn more*.
- **Placements:** Advantage+ off → Instagram Reels, Facebook Reels, Instagram Stories, Facebook Feed. Skip Audience Network and Messenger.

### Ad sets (audiences)
| Set | Location | Age | Interests / signals | Language |
|---|---|---|---|---|
| A · Florida veterans | Florida | 25–65 | U.S. Army, Veterans of Foreign Wars, American Legion, Wounded Warrior Project, military family | English |
| B · Hispano Sur Florida | 40 km around Coral Springs + Miami + Hialeah | 25–65 | Rock cristiano, música cristiana, veteranos | Spanish |
| C · San Antonio | 40 km around San Antonio, TX | 25–65 | Veterans, Joint Base San Antonio, Christian rock, country rock | English |
| D · Warm (retargeting) | Page/IG engagers 90 d + site visitors (Meta pixel, optional) | all | — | both |

Pixel: optional. If you want retargeting from site visits, add the Meta pixel id to the site (one line in `app/layout.tsx`); until then use Page/IG engagers as the warm audience.

### What to read after 7 days
- **CPC under $0.60** and **landing-page views/clicks > 70 %** → keep the set.
- Vercel Analytics → Events: `campaign_page_view` by referrer, `donate_click`, `cashapp_click`. If people click Cash App from the ad traffic, scale that set.
- Kill any set with CPC > $1.20 after 500 impressions.

## Campaign 2 — Voice lessons (Leads via website)
- **Objective:** Traffic → `/voice-lessons#sign-up` (or Leads later once there are 10+ inquiries).
- **Audience:** 25 km around Coral Springs, 16–60, interests: singing, karaoke, worship team, music lessons, church choir. Spanish set for Hialeah/Miami: *clases de canto*.
- **Creative:** 15–30 s clip of Malachias singing + line "Voice lessons · $80 / 50 min · in person or Zoom · veterans discount". $5/day, 14 days.

## Boosting vs. Ads Manager
Boosting a post from the Page is fine for the launch post (choose "Get more website visitors", $20 over 5 days, audience A). Everything else in Ads Manager so you can split EN/ES and read the numbers.

## Don'ts
- No ads from the personal profile (impossible) and no "donate" objective on Facebook (that needs a registered nonprofit, which we are not claiming).
- No text about tax deductibility.
- Don't run both languages in one ad set — Meta will pick one and you won't know which.
