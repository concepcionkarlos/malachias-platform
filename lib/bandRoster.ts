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
    name: 'JC CONCEPCION',
    role: 'Lead Guitar',
    tag: 'LEAD GUITARIST',
    tagColor: '#7a9ec0',
    photos: ['/JC Concepcion 2.PNG', '/JC Concepcion.PNG'],
    origin: 'Havana, Cuba  →  Miami, FL',
    bio: 'Born in Havana, Cuba — raised on fire, faith, and the sound of a guitar that could say what words couldn\'t. He crossed an ocean to call Miami home, and he found in the United States what every man of faith searches for: the freedom to worship without fear and play without limits. JC brings something ancient and unbreakable to every note he plays. His love for God isn\'t background to the music — it\'s the music. When he steps up to play, you\'re hearing a man who has already decided what matters.',
    pull: 'From Havana\nto the altar —\nevery string a prayer.',
    flip: false,
  },
  {
    num: '03',
    name: 'EFRAIN SIERRA',
    role: 'Rhythm Guitar · Riffs',
    tag: 'RHYTHM GUITARIST',
    tagColor: '#8b6e3a',
    photos: ['/Efrain Rhytms.PNG', '/Efrain Rhytms 2.PNG'],
    origin: 'Puerto Rico  →  Miami, FL',
    bio: 'Family first. Faith second. Guitar always. Efraín Sierra came out of Puerto Rico carrying all three — and when he found Malachias, he found a place where all three could live at once. He plays rhythm the way a man prays: consistent, intentional, and with everything behind it. His riffs aren\'t decoration — they\'re the backbone that lets the melody breathe and the message land. He\'s not here for the spotlight. He\'s here because God put a guitar in his hands and a mission in front of him.',
    pull: 'Every riff\nan act\nof worship.',
    flip: true,
  },
  {
    num: '04',
    name: 'GABE GRANTHAM',
    role: 'Bass',
    tag: 'BASSIST · VETERAN · SGT E-5',
    tagColor: '#5a7a5a',
    photos: ['/Gabe Bass.PNG', '/Gabe Bass 2.PNG'],
    origin: 'Hattiesburg, MS  →  Sebring, FL',
    bio: 'Born in Hattiesburg, Mississippi, raised in Florida, and pulled toward bass guitar before he ever thought about what it would become. After high school he enlisted in the U.S. Army as a Light Wheeled Vehicle Mechanic and Recovery Specialist — and at Fort Carson, Colorado, he kept playing. Bands on the weekend. Stages when he could find them. He left active duty as a Sergeant (E-5) and kept serving in the Florida Army National Guard while using the GI Bill to study Audio Engineering at Full Sail University. He went on to work at Festival Recording Studio and AM 690 WTIX in New Orleans. He builds custom cigar box guitars by hand. Since coming back to South Florida in 2013, he has never stopped — performing, recording, building. When he joined Malachias, he brought all of it with him: the service, the craft, and decades of groove that only comes from someone who has earned every note.',
    pull: 'The service.\nThe craft.\nThe groove.',
    flip: false,
  },
  {
    num: '05',
    name: 'HENRY',
    role: 'Drums',
    tag: 'DRUMMER',
    tagColor: '#c04020',
    photos: ['/Henry Drums.PNG', '/Henry Drums 2.PNG'],
    origin: 'Puerto Rico',
    bio: 'The pulse beneath the mission. Henry plays like a man who understands what it means to hold the line — steady when everything around you is shaking, driving forward when others go quiet. Every song hits harder because he\'s back there, anchoring the sound to something solid and unstoppable.',
    pull: 'The rhythm\nthat holds\nthe line.',
    flip: true,
  },
]
