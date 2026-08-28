'use client';

// Homepage "The Story" / Origin section — the founder's veteran-and-faith narrative.
// Paragraphs come from the CMS (siteContent.aboutText) via page.tsx, with the defaults
// below as a fallback; animated with framer-motion scroll reveals. Also carries the
// founder's book — the strongest proof of the mission the site has.

import { motion } from 'framer-motion';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const DEFAULT_PARAGRAPHS = [
  "Fort Wayne, Indiana. That's where this started.",
  "The founder served in the Indiana Army National Guard from 1994 to 2003 — first as a medic, then as an infantryman. Then active duty Army from 2006 to 2014, deploying twice to Iraq. Once as a medic. Once as an Army bandsman. Music and war in the same life.",
  "He accepted Jesus as his Savior in fifth grade at a Vacation Bible School. Raised in a home that didn't go to church, didn't pray, didn't talk about God. Spent years trying to figure out what that moment meant — through hard years, two failed marriages, a DUI. When he deployed to Iraq he found himself reaching back into that faith. In 2011 he converted to Messianic Christian.",
  "Malachias came out of all of it. The mission is specific: reduce suicidal ideation, lift people from depression, help heal and lessen the triggers PTSD leaves behind. The music is for people who are real, who struggle with their faith, and who want to grow and heal.",
  "The band is now based in South Florida — bringing the mission to new stages, new cities, and wherever the music can reach.",
];

const BOOK = {
  title: "A Warrior's Garden",
  subtitle: 'A Therapeutic Guide to Living with PTSD',
  href: 'https://www.amazon.com/dp/1944781420',
};

export default function About({ aboutText }: { aboutText?: string[] }) {
  const paragraphs = aboutText && aboutText.length > 0 ? aboutText : DEFAULT_PARAGRAPHS;

  return (
    <section id="about" className="section-pad relative overflow-hidden" style={{ background: '#050505' }}>
      <div aria-hidden="true" className="ghost-num" style={{ position: 'absolute', top: '4%', right: '-1%' }}>01</div>

      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '20%', left: '-5%',
        width: '55vw', height: '60%',
        background: 'radial-gradient(ellipse, rgba(80,34,6,0.08) 0%, transparent 68%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-5xl mx-auto px-6">

        <motion.div {...fade()} className="mb-12">
          <p className="label-xs mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.40em' }}>
            Origin
          </p>
          <h2
            className="font-display leading-[0.92] tracking-[0.06em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
          >
            THE STORY
          </h2>
          <div
            className="mt-4"
            style={{
              width: '3rem', height: '1px',
              background: 'linear-gradient(to right, rgba(201,168,76,0.60), transparent)',
            }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-[5fr_3fr] gap-12 lg:gap-20 items-start">

          {/* Left — narrative */}
          <div className="space-y-5">
            <motion.p {...fade(0.06)} className="tac-label" style={{ color: 'var(--gold-dim)', letterSpacing: '0.34em', fontSize: '0.58rem' }}>
              Malachi&nbsp;3:1
            </motion.p>

            <motion.blockquote {...fade(0.10)} className="left-bar font-display text-[1.25rem] tracking-wide leading-snug" style={{ color: 'var(--text-1)' }}>
              &ldquo;My messenger — that is what Malachias means.&rdquo;
            </motion.blockquote>

            {paragraphs.map((p, i) => (
              <motion.p key={i} {...fade(0.14 + i * 0.06)} className="leading-relaxed text-[0.93rem]" style={{ color: 'var(--text-2)' }}>
                {p}
              </motion.p>
            ))}

            <motion.blockquote
              {...fade(0.38)}
              className="left-bar mt-8"
              style={{ borderLeftColor: 'rgba(201,168,76,0.25)' }}
            >
              <p className="text-[0.82rem] leading-relaxed italic" style={{ color: 'var(--text-3)' }}>
                {"\"I came home from Iraq and I didn’t know who I was anymore. Music cracked me open again. Faith came through the crack.\""}
              </p>
              <p className="text-[0.65rem] tracking-[0.18em] uppercase mt-2" style={{ color: 'rgba(201,168,76,0.35)' }}>
                — The Founder
              </p>
            </motion.blockquote>
          </div>

          {/* Right — pull quote */}
          <motion.div {...fade(0.16)} className="lg:pt-16">
            <p
              className="font-display leading-[1.1] tracking-[0.04em]"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                color: 'rgba(237,229,216,0.22)',
              }}
            >
              Fort Wayne.
              <br />
              Two tours.
              <br />
              One mission.
            </p>
            <div
              className="mt-8"
              style={{ width: '1.5rem', height: '1px', background: 'rgba(201,168,76,0.22)' }}
            />
            <p
              className="mt-4 text-[0.66rem] tracking-[0.22em] uppercase italic"
              style={{ color: 'rgba(120,100,70,0.42)' }}
            >
              Indiana · Iraq · Faith
            </p>

            {/* The book — written by the founder, about the same road */}
            <a
              href={BOOK.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tac-box block mt-10 p-5 transition-colors duration-300"
              style={{ textDecoration: 'none' }}
            >
              <p className="label-xs mb-2" style={{ color: 'var(--gold)', letterSpacing: '0.34em' }}>
                The Book
              </p>
              <p className="font-display" style={{ fontSize: '1.35rem', letterSpacing: '0.05em', color: '#e8ddd0', lineHeight: 1.05 }}>
                {BOOK.title}
              </p>
              <p className="text-[0.78rem] leading-relaxed mt-2" style={{ color: 'var(--text-3)' }}>
                {BOOK.subtitle}. Written by the founder about the road home — music, a garden, and faith.
              </p>
              <p className="text-[0.62rem] tracking-[0.20em] uppercase mt-3" style={{ color: 'rgba(201,168,76,0.70)' }}>
                Read it on Amazon →
              </p>
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
