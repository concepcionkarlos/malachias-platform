// Canonical band roster — the single source of truth for the lineup so the
// homepage (Band section) and the EPK (lineup section) can never drift apart.
// This is static, hand-authored data (not the editable content store) on
// purpose: it's the real, fixed lineup.

export interface BandRosterMember {
  num: string
  name: string
  role: string
  tag: string
  tagColor: string
  photos: string[]
  origin: string
  bio: string
  pull: string
  flip: boolean
}

export const BAND_ROSTER: BandRosterMember[] = [
  {
    num: '01',
    name: 'MALACHIAS',
    role: 'Director · Vocals · Guitar',
    tag: 'FOUNDER · DIRECTOR · VETERAN',
    tagColor: '#c9a84c',
    photos: ['/Malachias 1.jpeg', '/malachias 2.jpeg'],
    origin: 'Fort Wayne, IN  ·  Iraq (×2)',
    bio: 'The voice and the vision. After two tours in Iraq — first as a medic, then as an Army bandsman — he came home carrying something that needed to come out. Malachias is his name in its ancient form: the messenger. That\'s not a stage name. That\'s a calling. He leads the band the way he led in service: with conviction, without apology, and always for the ones who need it most.',
    pull: 'The messenger.\nThe mission.\nThe music.',
    flip: false,
  },
  {
    num: '02',
    name: 'GABE GRANTHAM',
    role: 'Bass',
    tag: 'BASSIST · VETERAN · SGT E-5',
    tagColor: '#5a7a5a',
    photos: ['/Gabe Bass.PNG', '/Gabe Bass 2.PNG'],
    origin: 'Hattiesburg, MS  →  Sebring, FL',
    bio: 'Born in Hattiesburg, Mississippi, raised in Florida, and pulled toward bass guitar before he ever thought about what it would become. After high school he enlisted in the U.S. Army as a Light Wheeled Vehicle Mechanic and Recovery Specialist — and at Fort Carson, Colorado, he kept playing. Bands on the weekend. Stages when he could find them. He left active duty as a Sergeant (E-5) and kept serving in the Florida Army National Guard while using the GI Bill to study Audio Engineering at Full Sail University. He went on to work at Festival Recording Studio and AM 690 WTIX in New Orleans. He builds custom cigar box guitars by hand. Since coming back to South Florida in 2013, he has never stopped — performing, recording, building. When he joined Malachias, he brought all of it with him: the service, the craft, and decades of groove that only comes from someone who has earned every note.',
    pull: 'The service.\nThe craft.\nThe groove.',
    flip: true,
  },
  {
    num: '03',
    name: 'NAYSHA “WAR” RAMOS',
    role: 'Drums',
    tag: 'DRUMMER · VETERAN',
    tagColor: '#a8483a',
    photos: ['/War Drums.jpeg', '/war2.jpeg'],
    origin: 'Tampa, FL  →  South Florida',
    bio: 'Naysha “War” Ramos brings a lifetime of discipline and resilience behind the kit. A U.S. Army veteran and former law enforcement officer, she found in drumming a place to turn intensity into purpose. Her playing is powerful, deliberate, and rooted in faith — serving the song while giving everything she has. Through every challenge, War believes God has used music to give her strength, direction, and a new way to tell her story. For her, drumming is more than music — it\'s purpose, perseverance, and release.',
    pull: 'Drums.\nIntensity.\nPrecision.',
    flip: false,
  },
]
