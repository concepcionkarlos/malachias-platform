// Journal/blog content — static, hand-authored long-form entries (origin story,
// service, and mission) shown on the journal listing and individual entry pages.

export interface JournalEntry {
  slug: string
  tag: string
  date: string
  title: string
  excerpt: string
  body: string   // full text for individual page
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'why-this-started-here',
    tag: 'Origin',
    date: 'Fort Wayne, Indiana',
    title: 'Why this started here.',
    excerpt: "Fort Wayne is home. The Guard unit was here. The decision to enlist was made here. When I came back from Iraq the second time — as a bandsman, of all things — I came back here. Malachias started in Fort Wayne because everything that made it necessary happened in Fort Wayne.",
    body: `Fort Wayne, Indiana. That's where this started.

The Guard unit was here. The decision to enlist was made here. When I came back from Iraq the second time — as a bandsman, of all things — I came back here.

Malachias started in Fort Wayne because everything that made it necessary happened in Fort Wayne. The years of the National Guard. Two marriages that didn't make it. A DUI. Faith that went quiet for a long time and then came back louder than before.

You don't start a band about healing unless you needed to be healed. Fort Wayne is where that happened. It's where the songs got written. It's where the mission got clear.

The band is now in South Florida. But Fort Wayne is where it was born. And that doesn't change.`,
  },
  {
    slug: 'two-deployments-two-different-men',
    tag: 'Service',
    date: 'Iraq · 2006–2014',
    title: 'Two deployments. Two different men.',
    excerpt: "First tour as a medic. Second tour as an Army bandsman. I went over there holding people together with my hands. I came back the second time holding a guitar. Those aren't as different as they sound. Both are about being present when someone needs something real.",
    body: `First tour as a medic. Second tour as an Army bandsman.

I went over there holding people together with my hands. I came back the second time holding a guitar. Those aren't as different as they sound. Both are about being present when someone needs something real.

The medic work is immediate. You're there in the worst moment of someone's life and your job is to keep them in it. The music work is slower. But it reaches the same places — the places that don't show up on a body scan.

I served in the Indiana Army National Guard from 1994 to 2003. Then active duty from 2006 to 2014. Two deployments to Iraq. I came home the second time and I didn't know what to do with myself except play.

Malachias is what happened when the medic and the musician finally figured out they were the same person.`,
  },
  {
    slug: 'the-mission',
    tag: 'Mission',
    date: 'The reason we play',
    title: "Reduce suicidal ideation. That's the mission.",
    excerpt: "That's not a general statement. That's the specific reason Malachias exists. Veterans carrying things nobody talks about. People whose faith got worn down by years of hard living. Anyone who's at the bottom and not sure what's on the other side. That's who this music is for.",
    body: `Reduce suicidal ideation. Lift people from depression. Help heal and lessen the triggers PTSD leaves behind.

That's not a general statement. That's the specific reason Malachias exists.

I've sat with veterans who came home and couldn't find a reason to stay. I've played in rooms where I could feel it — the people who needed the music to say something true. Not inspirational. Not polished. True.

Veterans carrying things nobody talks about. People whose faith got worn down by years of hard living. Anyone who's at the bottom and not sure what's on the other side. That's who this music is for.

The songs aren't about winning. They're about staying. About getting through the next hour and the one after that. About faith that doesn't pretend the dark isn't real but shows up anyway.

We play wherever there's a stage. But this is why.`,
  },
]
