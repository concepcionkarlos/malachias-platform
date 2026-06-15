// ── Show ─────────────────────────────────────────────────────────────────────

export type ShowStatus = 'Confirmed' | 'Pending' | 'Hold' | 'Cancelled'

export interface Show {
  id: string
  date: string
  venue: string
  city: string
  time: string
  ticketUrl?: string
  isFeatured?: boolean
  visible?: boolean
  guarantee?: number
  payout?: number
  travelBudget?: number
  loadInTime?: string
  soundCheckTime?: string
  setLength?: string
  showStatus?: ShowStatus
  contactPerson?: string
  contactEmail?: string
  showNotes?: string
  attendance?: number
  gigRating?: number
  gigHighlight?: string
  merchSoldAtShow?: number
  advanceChecklist?: string[]
  sourceVenueId?: string
}

// ── Merch ─────────────────────────────────────────────────────────────────────

export interface MerchItem {
  id: string
  name: string
  price: number
  image?: string
  images?: string[]
  category: 'apparel' | 'music' | 'accessories' | 'other'
  available: boolean
  externalUrl?: string
  visible: boolean
  description?: string
  specs?: { label: string; value: string }[]
  atShows?: boolean
  stockQuantity?: number
  story?: string
}

// ── Band Members ──────────────────────────────────────────────────────────────

export interface BandMember {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  branch?: string
  tours?: string
  visible?: boolean
  email?: string
}

// ── Site Content ──────────────────────────────────────────────────────────────

export interface SiteContent {
  heroHeadline: string
  heroSubheadline: string
  aboutText: string[]
  aboutShort: string
  aboutHeadline: string
  groupPhoto: string
  serviceArea: string
  footerTagline: string
  ctaPrimaryLabel: string
  ctaSecondaryLabel: string
  contactEmail: string
  facebook: string
  instagram?: string
  youtube?: string
  appleMusic?: string
  spotify?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  metaKeywords?: string
}

// ── Media ─────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string
  poster?: string
  caption: string
  isFeatured?: boolean
  visible: boolean
}

// ── EPK ───────────────────────────────────────────────────────────────────────

export interface EpkContent {
  tagline: string
  bookerIntro: string
  repertoire: { era: string; artists: string }[]
  techSpecs: { label: string; value: string }[]
  setlists?: { title: string; songs: string[] }[]
  pressQuotes?: string[]
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'New'
  | 'Contacted'
  | 'Quote Sent'
  | 'Follow-up'
  | 'Negotiating'
  | 'Confirmed'
  | 'Advance Sent'
  | 'Paid'
  | 'Completed'
  | 'Lost'
  | 'Archived'

export interface BookingRequest {
  id: string
  fullName: string
  venueOrOrg: string
  email: string
  phone: string
  eventDate: string
  city: string
  eventType: string
  budgetRange: string
  guestCount: string
  message: string
  source: string
  status: BookingStatus
  quoteAmount?: number
  assignedTo?: string
  followUpDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const bookingRequests: BookingRequest[] = []


// ── Subscribers ───────────────────────────────────────────────────────────────

export interface Subscriber {
  email: string
  joinedAt: string
}

export const subscribers: Subscriber[] = []

// ── Band Tasks ────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskCategory = 'show-prep' | 'outreach' | 'social' | 'rehearsal' | 'merch' | 'admin' | 'other'

export interface BandTask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
  createdAt: string
  completedAt?: string
}

export const TASK_CATEGORIES: { id: TaskCategory; label: string; emoji: string }[] = [
  { id: 'show-prep',  label: 'Show Prep',  emoji: '🎤' },
  { id: 'outreach',   label: 'Outreach',   emoji: '📣' },
  { id: 'social',     label: 'Social',     emoji: '📱' },
  { id: 'rehearsal',  label: 'Rehearsal',  emoji: '🎸' },
  { id: 'merch',      label: 'Merch',      emoji: '👕' },
  { id: 'admin',      label: 'Admin',      emoji: '📋' },
  { id: 'other',      label: 'Other',      emoji: '⚡' },
]

export const bandTasks: BandTask[] = []

// ── Fan Stories ───────────────────────────────────────────────────────────────

export interface FanStory {
  id: string
  name: string          // "" if anonymous
  email?: string
  story: string
  songTitle?: string    // song that meant the most to them
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// ── Song Stories ──────────────────────────────────────────────────────────────

export interface SongStory {
  id: string
  title: string
  verse: string
  verseRef: string
  story: string
  moment?: string
  spotifyUrl?: string
  appleUrl?: string
  youtubeUrl?: string
  order: number
  visible: boolean
  createdAt: string
}

export const songStories: SongStory[] = [
  {
    id: 'ss-1',
    title: 'Legacy',
    verse: '"Before I formed you in the womb I knew you; before you were born I set you apart."',
    verseRef: 'Jeremiah 1:5',
    story: "I was four years old the first time I told someone I wanted to be a soldier.\n\nNot a fireman. Not a superhero. A soldier.\n\nMy family had served across generations — uniforms in closets, photographs in frames, and a certain way of standing that I recognized before I could name it. I grew up inside that legacy. At school, in the backyard, in the hallways between classes — every chance I had, I was playing Army. And it wasn't pretend. Not really. It was practice.\n\nThe day after high school graduation, I walked into a recruiter's office.\n\nI wasn't running from something. I was running toward something I had been aimed at my entire life. I wanted to leave my own footprints in the line already set by the men in my family who came before me.\n\nI served for 17 years. The Army made me a medic — someone whose entire job is keeping other people alive. There is no more honest profession on earth. You see what the human body can take. You learn what it can't. And then you carry both of those things long after the uniform comes off.\n\nI was medically retired for Post Traumatic Stress Disorder and a mild Traumatic Brain Injury.\n\nLegacy is not a song about war. It's a song about the boy before the war — the one who couldn't wait to get there. The one who had no idea what he was about to learn about himself, about service, about what it actually costs.\n\nI'd do it again. Every single time.",
    moment: 'Chapter I — The Call',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 1,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-2',
    title: 'All For You',
    verse: '"Greater love has no one than this: to lay down one\'s life for one\'s friends."',
    verseRef: 'John 15:13',
    story: "In 2006, I re-enlisted.\n\nBy then, everyone knew what that meant. The war in Iraq was real — the casualty reports, the flag-draped coffins, the news that never stopped coming. And I was a combat medic. If I was going back in, I was going downrange. There was no version of that decision where I didn't end up in combat.\n\nNova knew it. I knew it. We sat with it together.\n\nMost people write love songs to escape hard things. Nova and I wrote this one to face them head-on. We put into words what we couldn't quite say out loud — that we understood the stakes, that we had chosen this together as a family, and that whatever happened on the other side of deployment, we were going in with our eyes wide open.\n\nThere is a particular kind of love that doesn't ask you to be safe. It just asks you to come back.\n\nAll For You is that love. It's what a family looks like when they understand the cost — and choose to pay it anyway.\n\nThis was the song we needed to write before I left. So we did.",
    moment: 'Chapter II — The Decision',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 2,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-3',
    title: 'Baptized by Fire',
    verse: '"When you walk through the fire, you will not be burned; the flames will not set you ablaze."',
    verseRef: 'Isaiah 43:2',
    story: "Nobody can accurately describe combat to someone who hasn't been in it.\n\nI've tried. The best I can do is this: it is organized chaos moving at a speed your brain was never designed to process — and somehow, in the middle of all of it, you do your job anyway.\n\nI was a medic. Which means when the shooting started, I didn't take cover and return fire. I moved toward the noise. Toward the ones going down. Toward whoever needed me. That's not heroism — that's the job. That's what you train for every single day so that when the moment comes, your body already knows what to do.\n\nThe first time I was in actual combat, something permanent happened inside me. Not a breakdown. Something more like a shift — a recalibration at a level I didn't have words for until long after it was over.\n\nYou hear people use fire as a metaphor for transformation. As soldiers, we know it's not a metaphor. You go in one way. You come out another. There is no going back to who you were before the first firefight. That person doesn't exist anymore.\n\nBaptized by Fire is a witness to what happens when the only thing holding you together is faith — and somehow, against everything, it holds.",
    moment: 'Chapter III — The Fire',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 3,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-4',
    title: 'Falling Down',
    verse: '"He gives strength to the weary and increases the power of the weak."',
    verseRef: 'Isaiah 40:29',
    story: "In 2003, the first guys from my Indiana National Guard unit started coming home from Iraq.\n\nMen I had served alongside for nine years.\n\nI didn't know what to say to them. So I asked. I sat down with them — one by one — and asked what it was actually like. What they saw. What they went through on the way home. And the one question I kept coming back to: how did it feel the first time you looked at yourself in the mirror?\n\nWhat they told me broke something open.\n\nThere's a moment every combat veteran knows — usually quiet, usually alone — where you look at your own face and don't recognize the person staring back. Not in a dramatic way. In the way a stranger's eyes feel. Like whoever you were before shipped out, and this is someone else entirely.\n\nI wrote Falling Down with my band from Indiana at the time — Severence. Nova co-wrote the lyrics with me. We were trying to capture that single, private moment. Not the battlefield. Not the homecoming parade. Just the mirror. The silence right before you start figuring out who this new person is.\n\nSome of the guys I sat down with for this song are still fighting.\n\nThis one is for them.",
    moment: 'Chapter IV — The Mirror',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 4,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-5',
    title: 'Wallet Size',
    verse: '"Love bears all things, believes all things, hopes all things, endures all things."',
    verseRef: '1 Corinthians 13:7',
    story: "After we got married, I was unpacking boxes.\n\nIn one of them, I found a folded piece of paper. Nova's handwriting — song lyrics she'd written in the 1990s, long before we met, long before either of us understood what they were really about.\n\nShe had written about what it's like to watch someone you love come back from somewhere they can never fully explain. The distance behind their eyes. The way they hold a coffee cup with both hands now. The things they laugh at that they didn't before. The things that don't reach them anymore.\n\nShe had written this alone, as a young woman, before she had a soldier to come home to her.\n\nI called my buddy Jef Conn — we've known each other since elementary school — and we sat down and built music around Nova's words. The original version was alternative rock, raw and sparse. Later, Paul Colman and Rory Ellis helped us rebuild it into what it is now.\n\nWallet Size is not told from the soldier's perspective. It's told by the person at home — the one who keeps a wallet-sized photo because that's the closest thing to having them there.\n\nNova wrote this without knowing she was writing about us.\n\nI don't think that was an accident.",
    moment: 'Chapter IV — What She Saw',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 5,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-6',
    title: 'Cut Off',
    verse: '"Even if my father and mother abandon me, the Lord will hold me close."',
    verseRef: 'Psalm 27:10',
    story: "I wrote this one for Nova.\n\nBecause she's the one who had to live with what I brought back. And because the hardest thing I ever needed to say to her, I couldn't say out loud.\n\nAfter combat — after years of deployment cycles, after the medical retirement — there is a specific kind of silence that moves in. You are surrounded by people who love you, and you feel nothing. Not sadness, exactly. Something worse: distance. A glass wall between you and everything that used to matter.\n\nYou go to the grocery store and can't explain why it feels wrong. You sit at the dinner table and the conversation sounds like it's happening in another room. You're there, but you're not there. You've come home, but some part of you is still in a place you can't point to on a map.\n\nCut Off is about that.\n\nIt's about the invisible wound — the one that doesn't look like PTSD in the movies. It doesn't look like anything. It feels like nothing. And that particular emptiness is the most dangerous kind, because nothing from the outside looks broken.\n\nMost of us never talk about it. We learn to perform normal. We smile at the right moments. We answer \"I'm fine\" before anyone finishes asking.\n\nI wrote this because Nova deserved to know what was actually happening inside me. And because I know I'm not the only one who's lived inside that silence.\n\nIf you recognize yourself here — you're not broken. You're not alone. And there is a way back.",
    moment: 'Chapter V — The Silence',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 6,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-7',
    title: 'For Those That Remain',
    verse: '"The Lord is close to the brokenhearted and saves those who are crushed in spirit."',
    verseRef: 'Psalm 34:18',
    story: "Some albums are named after the best song.\n\nThis one is named after the reason the album exists at all.\n\nFor Those That Remain isn't written for the ones who went to war. It's written for the ones who stayed home and waited. For the Gold Star families — those who received a knock on the door that ended everything. For the Green Star families — those who got their soldier back, but not quite whole. For the brothers and sisters who watched someone they served with disappear into the silence.\n\nFor anyone who has loved a veteran and tried — really tried — to understand a world they were never invited into.\n\nThis album took four years to write. When I finally understood what I was building, I realized it was a lifespan: from the boy who dreamed of serving, to the man who learned what service actually costs, to the question of what comes after. The title track is the dedication. Every song on this record — the combat, the homecoming, the mirror, the silence, the disconnection — all of it points back here.\n\nTo every veteran still standing.\n\nTo every family still together in spite of everything it put you through.\n\nTo everyone who has carried weight that no one around them could fully see — and kept carrying it anyway.\n\nWe made this for you.\n\nAll of it. Every word.",
    moment: 'Chapter VI — The Honor',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 7,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ss-8',
    title: "A Warrior's Garden",
    verse: '"He leads me beside quiet waters. He refreshes my soul."',
    verseRef: 'Psalm 23:2–3',
    story: "At some point after the uniform comes off, you have to answer a question nobody prepares you for:\n\nWho are you when you're not a soldier?\n\nI didn't have an answer for a long time. The military gives you structure, purpose, identity, and community — all at once, all the time, for years. When it ends, especially the way mine ended, a silence moves in where all of that used to be. And it's a silence that doesn't go away on its own.\n\nJ.T. Cooper and I wrote A Warrior's Garden trying to put words to what I had finally learned about that silence — and what I did with it.\n\nFor me, it was three things: music, the actual garden in my backyard, and my faith in God.\n\nI started gardening after my retirement. There's something about putting your hands in the dirt that combat never prepared me for. No mission. No enemy. No rules of engagement. Just patience, and care, and watching things come back that looked completely dead.\n\nI wrote a book about it — A Warrior's Garden: A Self Therapeutic Guide to Living with PTSD — because what I was discovering in that garden, I wanted other veterans to discover too. You don't recover from trauma by fighting it harder. You recover by finding the thing that makes you want to stay.\n\nMusic became that thing for me. And music became Malachias. And Malachias became the reason this entire album exists.\n\nWhatever your garden is — find it. Tend it every day. It will not let you down.",
    moment: 'Chapter VII — The Healing',
    spotifyUrl: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    appleUrl: 'https://music.apple.com/us/artist/malachias/937313536',
    order: 8,
    visible: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// ── Daily Reflections ─────────────────────────────────────────────────────────

export interface DailyReflection {
  id: string
  date: string
  verse: string
  verseRef: string
  reflection: string
  suggestedSong?: string
  createdAt: string
}

export const dailyReflections: DailyReflection[] = [
  {
    id: 'dr-1',
    date: '2026-06-13',
    verse: '"The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."',
    verseRef: 'Psalm 23:1–3',
    reflection: "After two tours, I came home needing to be led somewhere quiet. The Army trains you to be moving, scanning, ready. Psalm 23 is the antidote to that state — not because it promises no danger, but because it promises presence through it. Rest isn't weakness. It's where restoration happens.",
    suggestedSong: 'The Messenger',
    createdAt: '2026-06-13T06:00:00Z',
  },
]

// ── Admin Notes ───────────────────────────────────────────────────────────────

export type AdminNotePriority = 'normal' | 'high'

export interface AdminNote {
  id: string
  text: string
  done: boolean
  priority: AdminNotePriority
  createdAt: string
}

// ── Email Templates ───────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string
  slug: string
  name: string
  subject: string
  bodyHtml: string
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export type AutoReplyStatus = 'scheduled' | 'sent' | 'failed' | 'skipped'

export interface AutoReplyLog {
  id: string
  bookingId: string
  scheduledAt: string
  sentAt?: string
  resendEmailId?: string
  status: AutoReplyStatus
  errorMessage?: string
}

// ── Venue Finder ──────────────────────────────────────────────────────────────

export type VenueStatus =
  | 'New'
  | 'Reviewed'
  | 'Contact Added'
  | 'Draft Ready'
  | 'Sent'
  | 'Follow-up'
  | 'Interested'
  | 'Not Interested'
  | 'Booked'
  | 'Archived'

export interface VenueActivity {
  ts: string
  text: string
}

export interface Venue {
  id: string
  placeId: string
  name: string
  address: string
  website?: string
  phone?: string
  rating?: number
  types: string[]
  status: VenueStatus
  contactEmail?: string
  notes?: string
  assignedTo?: string
  followUpDate?: string
  lastContactedAt?: string
  activityLog?: VenueActivity[]
  createdAt: string
  updatedAt: string
}

export interface OutreachLog {
  id: string
  venueId: string
  venueName: string
  toEmail: string
  subject: string
  bodyHtml: string
  templateId: string
  templateSlug: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

export interface BookingEmailLog {
  id: string
  entityType: 'booking'
  entityId: string
  toEmail: string
  subject: string
  bodyHtml: string
  templateId: string
  templateSlug: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

export interface InboundEmail {
  id: string
  fromEmail: string
  fromName?: string
  toEmail: string
  subject: string
  bodyText?: string
  bodyHtml?: string
  receivedAt: string
  entityType?: 'booking' | 'venue'
  entityId?: string
  read: boolean
  resendMessageId?: string
}

export interface SentEmail {
  id: string
  toEmail: string
  toName?: string
  subject: string
  bodyHtml: string
  bodyText?: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

// ── Songs / Set List ──────────────────────────────────────────────────────────

export type SongStatus = 'ready' | 'learning' | 'shelved'

export interface Song {
  id: string
  title: string
  type: 'original' | 'cover'
  originalArtist?: string
  status: SongStatus
  notes?: string
  chords?: string
  lyrics?: string
  structure?: string
  order: number
  addedAt: string
}

// ── Show Set List ─────────────────────────────────────────────────────────────

export interface ShowSetListItem {
  songId: string
  order: number
  key?: string
  notes?: string
}

export interface ShowSetList {
  showId: string
  items: ShowSetListItem[]
  updatedAt: string
}

// ── Rehearsals ────────────────────────────────────────────────────────────────

export type RehearsalStatus = 'upcoming' | 'completed' | 'cancelled'

export interface RehearsalConfirmation {
  name: string
  email?: string
  status: 'confirmed' | 'declined'
  respondedAt: string
}

export interface Rehearsal {
  id: string
  date: string
  time?: string
  location?: string
  songIds: string[]
  notes?: string
  status: RehearsalStatus
  summary?: string
  token?: string
  confirmations: RehearsalConfirmation[]
  createdAt: string
}

// ── Daily Goals ───────────────────────────────────────────────────────────────

export type GoalCategory = 'booking' | 'music' | 'social' | 'admin' | 'other'

export interface Goal {
  id: string
  text: string
  category: GoalCategory
  done: boolean
  date: string
  createdAt: string
}

// ── Content Calendar ──────────────────────────────────────────────────────────

export type ContentPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'other'
export type ContentStatus   = 'idea' | 'draft' | 'scheduled' | 'posted'

export interface ContentPost {
  id: string
  platform: ContentPlatform
  status: ContentStatus
  caption?: string
  hashtags?: string
  mediaNote?: string
  scheduledFor?: string
  postedAt?: string
  showId?: string
  createdAt: string
}

// ── Finance Tracker ───────────────────────────────────────────────────────────

export type FinanceCategory = 'guarantee' | 'door' | 'merch' | 'streaming' | 'gas' | 'equipment' | 'rehearsal' | 'food' | 'lodging' | 'promotion' | 'other'

export interface FinanceEntry {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: FinanceCategory
  description: string
  showId?: string
  date: string
  createdAt: string
}

// ── Band Stats ────────────────────────────────────────────────────────────────

export interface BandStats {
  spotifyMonthlyListeners?: number
  spotifyFollowers?: number
  instagramFollowers?: number
  instagramAvgReach?: number
  facebookFollowers?: number
  youtubeSubscribers?: number
  youtubeViews?: number
  tiktokFollowers?: number
  totalShows?: number
  notes?: string
  updatedAt: string
}

// ── Live Session ──────────────────────────────────────────────────────────────

export type LivePlatform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'twitch'
export type LiveSessionStatus = 'planned' | 'live' | 'completed' | 'cancelled'

export interface LiveSession {
  id: string
  title: string
  description?: string
  platform: LivePlatform
  scheduledAt: string        // ISO datetime
  status: LiveSessionStatus
  platformUrl?: string       // link to the live / stream page
  setListIds?: string[]      // song IDs from setlist to feature
  caption?: string           // auto-generated or custom social caption
  recordingUrl?: string      // post-live recording link
  viewerCount?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface VenueStore {
  venues: Venue[]
  outreachLogs: OutreachLog[]
  emailTemplates: EmailTemplate[]
  autoReplyLogs: AutoReplyLog[]
  bookingEmailLogs: BookingEmailLog[]
  inboundEmails: InboundEmail[]
  sentEmails: SentEmail[]
  dripCampaigns: DripCampaign[]
  dripEnrollments: DripEnrollment[]
  songs: Song[]
  rehearsals: Rehearsal[]
  goals: Goal[]
  showSetLists: ShowSetList[]
  contentPosts: ContentPost[]
  finances: FinanceEntry[]
  bandStats: BandStats | null
  liveSessions: LiveSession[]
}

// ── Drip Campaigns ────────────────────────────────────────────────────────────

export interface DripStep {
  day: number
  templateSlug: string
}

export interface DripCampaign {
  id: string
  name: string
  description?: string
  trigger: 'booking-new' | 'manual'
  steps: DripStep[]
  active: boolean
  createdAt: string
}

export interface DripEnrollment {
  id: string
  campaignId: string
  entityType: 'booking'
  entityId: string
  toEmail: string
  entityName: string
  enrolledAt: string
  completedSteps: number[]
  status: 'active' | 'completed' | 'paused' | 'unsubscribed'
}

export interface PlaceSearchResult {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  types: string[]
}

// ── Default Data ──────────────────────────────────────────────────────────────

export const shows: Show[] = []

export const merch: MerchItem[] = [
  {
    id: '1',
    name: '"Faith Through Fire" Pullover Hoodie',
    price: 55,
    category: 'apparel',
    available: false,
    visible: true,
    atShows: true,
    story: 'Named after the song we wrote during the hardest season. Heavy cotton. Made to last.',
    description: 'Limited run of 100. Heavy 12oz fleece, kangaroo pocket, embroidered crest. Black.',
    specs: [
      { label: 'Fabric', value: '80/20 cotton-poly fleece, 12 oz' },
      { label: 'Fit', value: 'Unisex — relaxed' },
      { label: 'Print', value: 'Embroidered crest + back print' },
      { label: 'Color', value: 'Black only' },
      { label: 'Run', value: 'Limited — 100 units' },
    ],
  },
  {
    id: '2',
    name: '"No Man Left Behind" Field Tee',
    price: 28,
    category: 'apparel',
    available: false,
    visible: true,
    atShows: true,
    story: 'For the brothers who showed up. Chest graphic. Black on black.',
    description: 'Pre-shrunk cotton. Chest left graphic, oversized back print. Built for the field.',
    specs: [
      { label: 'Fabric', value: '100% pre-shrunk cotton, 6 oz' },
      { label: 'Fit', value: 'Unisex — slightly relaxed' },
      { label: 'Print', value: 'Direct-to-garment (DTG)' },
      { label: 'Color', value: 'Black only' },
    ],
  },
  {
    id: '3',
    name: '"Malachi 3:1" Field Patch Set',
    price: 18,
    category: 'accessories',
    available: false,
    visible: true,
    atShows: true,
    story: 'Embroidered. Iron-on. Malachias crest, a cross, and the scripture that started all of this.',
    description: '3-patch set. Embroidered, iron-on backing. Limited to 200 sets.',
    specs: [
      { label: 'Quantity', value: '3 patches per set' },
      { label: 'Material', value: 'Embroidered twill' },
      { label: 'Backing', value: 'Iron-on' },
      { label: 'Run', value: 'Limited — 200 sets' },
    ],
  },
  {
    id: '4',
    name: '"The Messenger" Debut LP',
    price: 30,
    category: 'music',
    available: false,
    visible: true,
    story: 'When the record is done. 12-inch. Limited first pressing.',
    description: 'Debut LP on vinyl. Limited first pressing. Pre-order list forming now.',
    specs: [
      { label: 'Format', value: '12-inch vinyl' },
      { label: 'Pressing', value: 'First run — limited' },
      { label: 'Color', value: 'Standard black' },
    ],
  },
]

export const bandMembers: BandMember[] = [
  {
    id: '1',
    name: 'The Founder',
    role: 'Founder · Guitar · Vocals',
    branch: 'U.S. Army',
    tours: 'OIF I · OIF II',
    bio: "Fort Wayne, Indiana. Indiana Army National Guard from 1994 to 2003 — medic first, then infantryman. Active duty Army from 2006 to 2014, deploying twice to Iraq: once as a medic, once as an Army bandsman.\n\nI accepted Jesus as my Savior in fifth grade at a Vacation Bible School. Raised in a home that didn't go to church, didn't pray, didn't talk about God. I came home from that summer and spent the next few decades trying to figure out what that moment actually meant — through two failed marriages, a DUI, years that wore me down. When I deployed to Iraq I found myself reaching deep into my faith. In 2011 I converted to Messianic Christian.\n\nMalachias came out of all of it. The mission is specific: reduce suicidal ideation, lift people from depression, help heal and lessen the triggers PTSD leaves behind. The music is for people who are real, who struggle with their faith, and who want to grow and heal.",
    visible: true,
  },
]

export const siteContent: SiteContent = {
  heroHeadline: 'WE PLAY FOR THE ONES WHO NEED IT MOST.',
  heroSubheadline: 'Music forged in faith. Carried through fire. For anyone still fighting their way back.',
  aboutHeadline: 'THE STORY',
  aboutShort: 'Born in Fort Wayne, Indiana. Now based in South Florida. Founded by a U.S. Army veteran. Malachias plays Christian rock with a mission: reduce suicidal ideation, lift people from depression, help heal the wounds PTSD leaves behind.',
  groupPhoto: '/Malachias.PNG',
  aboutText: [
    "Fort Wayne, Indiana. That's where this started.",
    "The founder served in the Indiana Army National Guard from 1994 to 2003 — first as a medic, then as an infantryman. Then active duty Army from 2006 to 2014, deploying twice to Iraq. Once as a medic. Once as an Army bandsman. Music and war in the same life.",
    "He accepted Jesus as his Savior in fifth grade at a Vacation Bible School. Raised in a home that didn't go to church, didn't pray, didn't talk about God. Spent years trying to figure out what that moment meant — through hard years, two failed marriages, a DUI. When he deployed to Iraq he found himself reaching back into that faith. In 2011 he converted to Messianic Christian.",
    "Malachias came out of all of it. The mission is specific: reduce suicidal ideation, lift people from depression, help heal and lessen the triggers PTSD leaves behind. The music is for people who are real, who struggle with their faith, and who want to grow and heal.",
    "The band is now based in South Florida — bringing the mission to new stages, new cities, and wherever the music can reach.",
  ],
  serviceArea: 'South Florida',
  footerTagline: 'South Florida. Faith. Two tours. One mission.',
  ctaPrimaryLabel: 'Book Malachias',
  ctaSecondaryLabel: 'View Press Kit',
  contactEmail: 'booking@malachiasmusic.com',
  facebook: 'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/malachiasmusic',
  youtube: 'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
  appleMusic: 'https://music.apple.com/us/artist/malachias/937313536',
  spotify: 'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
  metaDescription: 'Malachias is a Christian rock band based in South Florida, founded by a U.S. Army veteran. Bars, festivals, churches, military events — music with a mission: healing suicidal ideation, depression, and PTSD through faith.',
  ogTitle: 'MALACHIAS — Christian Rock. Veteran Spirit. South Florida.',
}

export const mediaItems: MediaItem[] = []

export const epkContent: EpkContent = {
  tagline: 'Christian Rock · Veteran-Founded · Faith Through Fire',
  bookerIntro: 'Contact us directly for availability, set length, and technical requirements. We play churches, military events, veteran support gatherings, and community stages.',
  repertoire: [
    { era: 'Faith', artists: 'Original faith-driven rock. Songs about doubt, redemption, survival, and hope.' },
    { era: 'Healing', artists: 'Music for veterans, trauma survivors, and anyone fighting their way back.' },
    { era: 'Brotherhood', artists: 'Songs about not leaving people behind. On stage and off.' },
  ],
  techSpecs: [
    { label: 'Set Length', value: '45 min · 1 hr · Full set (custom)' },
    { label: 'Setup Time', value: '90 minutes prior to show' },
    { label: 'Soundcheck', value: '30 minutes' },
    { label: 'PA System', value: 'Self-contained or house PA accepted' },
    { label: 'Stage Required', value: '12ft × 10ft minimum' },
    { label: 'Power', value: '2 × 20A circuits minimum' },
    { label: 'Special', value: 'Available for outdoor events, churches, VFW halls' },
  ],
}

export function formatDate(isoDate: string): {
  day: string; month: string; year: string; full: string; weekday: string
} {
  const date = new Date(isoDate + 'T00:00:00')
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    full: date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }),
  }
}
