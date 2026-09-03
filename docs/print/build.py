#!/usr/bin/env python3
"""Print-ready flyers with real, locally generated QR codes.

The QR is generated here with segno and inlined as SVG, so a flyer is one
self-contained file: it survives being emailed to a print shop or opened on a
machine that does not have this repo. No QR is ever fetched from a third-party
generator — the payload is a URL we control and it stays on this machine.

Error correction is level H (~30% recoverable), because these get taped to poles
and pinned to corkboards and will not stay pristine.

    python3 build.py          → writes voice-lessons.html and band.html

Print from Chrome: Cmd-P, Letter, margins None, Background graphics ON.
"""
import io
import re

import segno

OUT = {
    'voice-lessons': 'https://www.malachiasmusic.com/voice-lessons',
    'band': 'https://www.malachiasmusic.com',
}

PHONE = '+1 317 560 2356'
EMAIL = 'malachiasmusic@gmail.com'
SITE = 'malachiasmusic.com'


def qr_svg(url: str, size_in: float) -> str:
    """Inline SVG for `url`, scaled to size_in inches square.

    segno emits width/height but no viewBox. Sizing such an SVG with CSS resizes
    the canvas and CROPS the code — two of the three finder squares disappear and
    it stops scanning. So the intrinsic size is converted into a viewBox first,
    and only then does CSS drive the printed size.
    """
    buf = io.BytesIO()
    segno.make(url, error='h').save(
        buf, kind='svg', scale=10, border=2,
        dark='#000000', light='#ffffff', xmldecl=False,
    )
    svg = buf.getvalue().decode('utf-8')
    m = re.search(r'width="(\d+(?:\.\d+)?)" height="(\d+(?:\.\d+)?)"', svg)
    if not m:
        raise SystemExit('segno SVG changed shape — cannot derive a viewBox')
    w, h = m.group(1), m.group(2)
    return svg.replace(
        m.group(0),
        f'viewBox="0 0 {w} {h}" shape-rendering="crispEdges" '
        f'style="width:{size_in}in;height:{size_in}in;display:block"',
        1,
    )


CROSS_CSS = """
  .cross { width: 100%; border-top: 1px solid rgba(201,168,76,0.25); margin-top: 0.18in;
    padding-top: 0.13in; display: flex; align-items: baseline; gap: 0.14in;
    font-size: 9pt; color: #a89880; line-height: 1.45; }
  .cross b { font-family: "Bebas Neue", Impact, sans-serif; font-size: 13pt;
    letter-spacing: 0.06em; color: #c9a84c; white-space: nowrap; }
"""

SHARED_CSS = """
  /* An explicit size is required: without it print-to-pdf uses the default
     paper and the page geometry below no longer matches the sheet. */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #030202; color: #ede5d8; font-family: Inter, Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { position: relative; overflow: hidden; display: flex; flex-direction: column;
    background: linear-gradient(160deg, #020202 0%, #0a0602 55%, #030202 100%); }
  .glow { position: absolute; left: 50%; top: 26%; width: 120%; aspect-ratio: 1;
    transform: translate(-50%, -50%); border-radius: 50%;
    background: radial-gradient(circle, rgba(120,60,10,0.40) 0%, rgba(120,60,10,0) 65%); }
  .z { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }
  .eyebrow { font-weight: 700; text-transform: uppercase; color: #c9a84c; letter-spacing: 0.32em; }
  .display { font-family: "Bebas Neue", Impact, sans-serif; letter-spacing: 0.04em; line-height: 0.92; }
  .gold { color: #c9a84c; }
  .emblem { display: block; object-fit: contain; mix-blend-mode: screen; }
  .qrbox { background: #fff; border-radius: 12px; padding: 9px; display: inline-block; line-height: 0; }
  .mono { font-family: "JetBrains Mono", Menlo, monospace; color: #c9a84c; }
  .bar { margin-top: auto; border-top: 1px solid rgba(201,168,76,0.30); padding-top: 0.14in;
    display: flex; justify-content: space-between; gap: 1em; font-weight: 700;
    text-transform: uppercase; color: #c9a84c; letter-spacing: 0.20em; }
"""


def voice_lessons() -> str:
    # Ten tear-off tabs. On a corkboard this is the whole point of the flyer:
    # somebody takes the number without having to write anything down.
    tabs = ''.join(
        f'<div class="tab"><div class="rot">'
        f'<span class="who">Voice lessons</span>'
        f'<span class="num">{PHONE}</span>'
        f'</div></div>'
        for _ in range(10)
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Voice Lessons with Malachias — flyer</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap">
<style>
{SHARED_CSS}{CROSS_CSS}
  @page {{ size: 8.5in 11in; margin: 0; }}
  .page {{ width: 8.5in; height: 11in; padding: 0.55in 0.6in 0; }}
  .eyebrow {{ font-size: 11pt; }}
  h1 {{ font-size: 76pt; margin-top: 0.16in; }}
  .sub {{ font-size: 12.5pt; color: #c7bba9; margin-top: 0.16in; max-width: 6.6in; line-height: 1.5; }}
  .focus {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.22in; margin-top: 0.3in; }}
  .focus b {{ display: block; font-family: "Bebas Neue", Impact, sans-serif; font-size: 21pt;
    letter-spacing: 0.05em; color: #ede5d8; }}
  .focus span {{ font-size: 9.5pt; color: #a89880; line-height: 1.45; display: block; margin-top: 3pt; }}
  .deal {{ display: flex; align-items: baseline; gap: 0.22in; margin-top: 0.32in;
    border-top: 1px solid rgba(201,168,76,0.30); border-bottom: 1px solid rgba(201,168,76,0.30);
    padding: 0.16in 0; }}
  .deal .price {{ font-family: "Bebas Neue", Impact, sans-serif; font-size: 54pt; color: #c9a84c; line-height: 0.9; }}
  .deal .per {{ font-size: 12pt; color: #c7bba9; }}
  .deal .terms {{ margin-left: auto; text-align: right; font-size: 10pt; color: #a89880; line-height: 1.6; }}
  .contact {{ display: grid; grid-template-columns: 1.85in 1fr; gap: 0.28in; align-items: center; margin-top: 0.3in; }}
  .contact .phone {{ font-family: "Bebas Neue", Impact, sans-serif; font-size: 40pt; color: #ede5d8; line-height: 1; }}
  .contact .mail {{ font-size: 13pt; margin-top: 6pt; }}
  .contact .hint {{ font-size: 9.5pt; color: #a89880; margin-top: 8pt; line-height: 1.45; }}
  /* Tear-off strip */
  .tabs {{ margin-top: auto; display: grid; grid-template-columns: repeat(10, 1fr);
    border-top: 1px dashed rgba(201,168,76,0.55); height: 1.5in; }}
  .tab {{ border-left: 1px dashed rgba(201,168,76,0.40); display: flex; align-items: center;
    justify-content: center; }}
  .tab:first-child {{ border-left: 0; }}
  /* The rotated block's WIDTH runs along the tab's height, so it is sized against
     that (1.5in), not against the 0.73in tab width. */
  .rot {{ transform: rotate(-90deg); width: 1.34in; text-align: center; white-space: nowrap; }}
  .who {{ display: block; font-size: 5.6pt; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: #c9a84c; }}
  .num {{ display: block; font-size: 8.5pt; font-weight: 800; color: #ede5d8; margin-top: 1.5pt; }}
</style>
</head>
<body>
<div class="page">
  <div class="glow"></div>
  <div class="z">
    <p class="eyebrow">Voice lessons with Malachias</p>
    <h1 class="display">LEARN TO SING<br><span class="gold">LIKE YOU MEAN IT.</span></h1>
    <p class="sub">
      International touring artist — Iraq, Kuwait, Dubai, China, Ireland and over half the United States —
      and a former Nashville recording artist. Over 30 years of practical stage experience, teaching in
      South Florida and anywhere with a camera.
    </p>

    <div class="focus">
      <div><b>VOCAL TECHNIQUE</b><span>Breath, range, tone, control — the fundamentals that keep a voice healthy through a full set.</span></div>
      <div><b>STYLE</b><span>Rock, country, worship: phrasing and delivery that sound like you, not like an exercise.</span></div>
      <div><b>STAGE PRESENCE</b><span>What to do with your hands, your eyes and the room. Thirty years of stages, from VFW halls to overseas bases.</span></div>
    </div>

    <div class="deal">
      <div><span class="price">$80</span> <span class="per">per 50-minute lesson</span></div>
      <div class="terms">
        In person — Broward · Palm Beach · Miami-Dade<br>
        or anywhere via Zoom<br>
        <span class="gold">Discounts for veterans and bulk packages</span>
      </div>
    </div>

    <div class="contact">
      <div class="qrbox">{qr_svg(OUT['voice-lessons'], 1.65)}</div>
      <div>
        <p class="phone">{PHONE}</p>
        <p class="mail mono">{EMAIL}</p>
        <p class="hint">Scan the code to book a first lesson, see what a session covers,
        and ask about the veteran or package rate.<br>{SITE}/voice-lessons</p>
      </div>
    </div>

    <div class="cross">
      <b>ALSO —</b>
      <span>Malachias fronts a veteran-founded Christian rock band out of South Florida.
      Hear the music, catch a show or book them at <b style="font-size:9pt;letter-spacing:0">{SITE}</b></span>
    </div>

    <div class="tabs">{tabs}</div>
  </div>
</div>
</body>
</html>
"""


def band() -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>MALACHIAS — band flyer</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap">
<style>
{SHARED_CSS}{CROSS_CSS}
  @page {{ size: 8.5in 11in; margin: 0; }}
  body.card .cross {{ font-size: 5.4pt; margin-top: 0.07in; padding-top: 0.06in; gap: 0.08in; }}
  body.card .cross b {{ font-size: 7.5pt; }}
  /* Two sizes from one file: body.letter (8.5×11) for boards, body.card (4×6)
     for handing out and leaving on counters. Switch the body class. */
  body.letter .page {{ width: 8.5in; height: 11in; padding: 0.6in 0.65in; }}
  body.card   .page {{ width: 4in; height: 6in; padding: 0.3in 0.32in; }}
  .center {{ text-align: center; align-items: center; }}
  /* Without this the bar's margin-top:auto left a dead third at the bottom. */
  .body {{ flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; width: 100%; }}
  .rule {{ width: 100%; border-top: 1px solid rgba(201,168,76,0.30); }}
  .now b {{ display: block; font-family: "Bebas Neue", Impact, sans-serif;
    letter-spacing: 0.05em; color: #c9a84c; }}
  body.letter .now {{ margin: 0.26in 0; padding: 0.2in 0; }}
  body.card .now {{ margin: 0.1in 0; padding: 0.08in 0; }}
  body.letter .now b {{ font-size: 27pt; }}
  body.card .now b {{ font-size: 12pt; }}
  body.letter .now span {{ font-size: 10.5pt; color: #c7bba9; line-height: 1.5; }}
  body.card .now span {{ font-size: 6.2pt; color: #c7bba9; line-height: 1.4; }}
  body.letter .emblem {{ width: 3.1in; height: 2in; margin: 0.1in auto 0; }}
  body.card   .emblem {{ width: 1.55in; height: 1in; margin: 0 auto; }}
  body.letter .eyebrow {{ font-size: 10.5pt; }}
  body.card   .eyebrow {{ font-size: 6pt; letter-spacing: 0.24em; }}
  body.letter h1 {{ font-size: 96pt; margin-top: 0.14in; }}
  body.card   h1 {{ font-size: 44pt; margin-top: 0.06in; }}
  body.letter .tagline {{ font-size: 12pt; letter-spacing: 0.24em; margin-top: 0.1in; }}
  body.card   .tagline {{ font-size: 6.4pt; letter-spacing: 0.18em; margin-top: 0.05in; }}
  .tagline {{ text-transform: uppercase; font-weight: 700; color: #c9a84c; }}
  body.letter .sub {{ font-size: 13pt; color: #c7bba9; margin-top: 0.24in; max-width: 6in; line-height: 1.55; }}
  body.card   .sub {{ font-size: 7.6pt; color: #c7bba9; margin-top: 0.1in; line-height: 1.42; }}
  body.letter .press {{ font-size: 10pt; color: #a89880; margin-top: 0.2in; }}
  body.card   .press {{ font-size: 6pt; color: #a89880; margin-top: 0.08in; }}
  .press b {{ color: #ede5d8; }}
  .scan {{ display: flex; align-items: center; justify-content: center; }}
  body.letter .scan {{ gap: 0.32in; margin-top: 0.3in; }}
  body.card   .scan {{ gap: 0.14in; margin-top: 0.12in; }}
  .scan .what {{ text-align: left; }}
  body.letter .scan .what b {{ display: block; font-family: "Bebas Neue", Impact, sans-serif;
    font-size: 26pt; letter-spacing: 0.05em; color: #ede5d8; line-height: 1.15; }}
  body.card   .scan .what b {{ display: block; font-family: "Bebas Neue", Impact, sans-serif;
    font-size: 12pt; letter-spacing: 0.05em; color: #ede5d8; line-height: 1.2; }}
  body.letter .scan .what span {{ font-size: 10pt; color: #a89880; }}
  body.card   .scan .what span {{ font-size: 6pt; color: #a89880; }}
  body.letter .bar {{ font-size: 9.5pt; }}
  body.card   .bar {{ font-size: 5.6pt; letter-spacing: 0.14em; padding-top: 0.08in; }}
  /* qr_svg() writes the print size as an inline style, which is right for the
     letter sheet; the 4x6 card needs a much smaller code or it pushes the
     footer off the card. Inline styles only yield to !important. */
  body.card .qrbox {{ padding: 6px; border-radius: 8px; }}
  body.card .qrbox svg {{ width: 0.92in !important; height: 0.92in !important; }}
  body.card .sub {{ font-size: 7pt; }}
  body.card .now {{ margin: 0.07in 0; padding: 0.06in 0; }}
  body.card .now b {{ font-size: 11pt; }}
  body.card .now span {{ font-size: 5.6pt; line-height: 1.35; }}
</style>
</head>
<body class="letter">
<div class="page">
  <div class="glow"></div>
  <div class="z center">
    <img class="emblem" src="../../public/Malachias.PNG" alt="">
    <h1 class="display">MALACHIAS</h1>
    <p class="tagline">Christian Rock · Veteran Mission · Faith on Fire</p>
    <p class="sub">
      A veteran-founded five-piece out of South Florida. Original music about faith, service
      and what it takes to come home — played loud, and played like it matters.
    </p>
    <p class="press">As featured in <b>Cashbox Magazine</b> — Artist Spotlight, March 2023</p>

    <div class="body">
      <div class="rule"></div>
      <div class="now">
        <b>ROAD TO SAN ANTONIO · NOV 12, 2026</b>
        <span>Malachias was invited to play a Veterans Day event in San Antonio, Texas.<br>
        We are raising what it costs to get all five musicians there.<br>
        {SITE}/road-to-san-antonio</span>
      </div>
      <div class="rule"></div>

      <div class="scan">
        <div class="qrbox">{qr_svg(OUT['band'], 1.6)}</div>
        <div class="what">
          <b>LISTEN.<br>BOOK US.<br>FOLLOW.</b>
          <span>Scan for the music, the shows and the story.</span>
        </div>
      </div>
    </div>

    <div class="cross">
      <b>ALSO —</b>
      <span>Voice, style and stage-presence lessons with Malachias. $80 per 50 minutes,
      in person across Broward, Palm Beach and Miami-Dade, or anywhere via Zoom.
      Veteran and package rates at <b style="font-size:9pt;letter-spacing:0">{SITE}/voice-lessons</b></span>
    </div>

    <div class="bar">
      <span>{SITE}</span>
      <span>@malachiasmusic</span>
      <span>booking@malachiasmusic.com</span>
    </div>
  </div>
</div>
</body>
</html>
"""


def handout() -> str:
    """A 4x6 double-sided handout: band on the front, lessons on the back.

    This is the answer to wanting both messages in circulation without either
    one diluting the other. A posted flyer only ever shows one face, so those
    stay single-subject; a handout gets turned over, so each side can commit
    fully to its own ask. Print double-sided, flipping on the SHORT edge.
    """
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>MALACHIAS — double-sided handout (4x6)</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap">
<style>
{SHARED_CSS}
  @page {{ size: 4in 6in; margin: 0; }}
  .page {{ width: 4in; height: 6in; padding: 0.28in 0.3in; page-break-after: always; }}
  .page:last-child {{ page-break-after: auto; }}
  .center {{ text-align: center; align-items: center; }}
  .emblem {{ width: 1.5in; height: 0.98in; margin: 0 auto; }}
  .eyebrow {{ font-size: 6pt; letter-spacing: 0.26em; }}
  h1 {{ font-size: 40pt; margin-top: 0.05in; }}
  h2 {{ font-size: 27pt; margin-top: 0.06in; line-height: 0.95; }}
  .tagline {{ font-size: 6.2pt; letter-spacing: 0.18em; text-transform: uppercase;
    font-weight: 700; color: #c9a84c; margin-top: 0.05in; }}
  .sub {{ font-size: 7.2pt; color: #c7bba9; margin-top: 0.1in; line-height: 1.45; }}
  .press {{ font-size: 5.8pt; color: #a89880; margin-top: 0.07in; }}
  .press b {{ color: #ede5d8; }}
  .mid {{ flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }}
  .scan {{ display: flex; align-items: center; gap: 0.14in; }}
  .scan .what {{ text-align: left; }}
  .scan .what b {{ display: block; font-family: "Bebas Neue", Impact, sans-serif;
    font-size: 12pt; letter-spacing: 0.05em; color: #ede5d8; line-height: 1.2; }}
  .scan .what span {{ font-size: 5.8pt; color: #a89880; }}
  .qrbox svg {{ width: 0.95in !important; height: 0.95in !important; }}
  .qrbox {{ padding: 6px; border-radius: 8px; }}
  .price {{ font-family: "Bebas Neue", Impact, sans-serif; font-size: 30pt; color: #c9a84c; line-height: 0.9; }}
  .per {{ font-size: 7.5pt; color: #c7bba9; }}
  .terms {{ font-size: 6.4pt; color: #a89880; line-height: 1.55; margin-top: 0.08in; }}
  .phone {{ font-family: "Bebas Neue", Impact, sans-serif; font-size: 20pt; color: #ede5d8; line-height: 1; }}
  .mail {{ font-size: 7.4pt; margin-top: 2pt; }}
  .rule {{ width: 100%; border-top: 1px solid rgba(201,168,76,0.28); margin: 0.1in 0; }}
  .bar {{ font-size: 5.4pt; letter-spacing: 0.12em; padding-top: 0.08in; }}
</style>
</head>
<body>

<!-- FRONT — the band -->
<div class="page">
  <div class="glow"></div>
  <div class="z center">
    <img class="emblem" src="../../public/Malachias.PNG" alt="">
    <h1 class="display">MALACHIAS</h1>
    <p class="tagline">Christian Rock · Veteran Mission · Faith on Fire</p>
    <p class="sub">A veteran-founded five-piece out of South Florida. Original music about
    faith, service and what it takes to come home.</p>
    <p class="press">As featured in <b>Cashbox Magazine</b> — March 2023</p>
    <div class="mid">
      <div class="scan">
        <div class="qrbox">{qr_svg(OUT['band'], 1.0)}</div>
        <div class="what">
          <b>LISTEN.<br>BOOK US.<br>FOLLOW.</b>
          <span>The music, the shows, the story.</span>
        </div>
      </div>
      <p class="press" style="margin-top:0.12in">Road to San Antonio · Nov 12, 2026 · Veterans Day</p>
    </div>
    <div class="bar"><span>{SITE}</span><span>@malachiasmusic</span></div>
  </div>
</div>

<!-- BACK — the lessons -->
<div class="page">
  <div class="glow"></div>
  <div class="z center">
    <p class="eyebrow">Voice lessons with Malachias</p>
    <h2 class="display">LEARN TO SING<br><span class="gold">LIKE YOU MEAN IT.</span></h2>
    <p class="sub">International touring artist and former Nashville recording artist.
    Over 30 years on stage. Vocal technique, style and stage presence.</p>
    <div class="rule"></div>
    <div><span class="price">$80</span> <span class="per">per 50-minute lesson</span></div>
    <p class="terms">In person — Broward · Palm Beach · Miami-Dade · or anywhere via Zoom<br>
    <span class="gold">Discounts for veterans and bulk packages</span></p>
    <div class="mid">
      <div class="scan">
        <div class="qrbox">{qr_svg(OUT['voice-lessons'], 1.0)}</div>
        <div class="what">
          <p class="phone">{PHONE}</p>
          <p class="mail mono">{EMAIL}</p>
        </div>
      </div>
    </div>
    <div class="bar"><span>{SITE}/voice-lessons</span></div>
  </div>
</div>

</body>
</html>
"""

if __name__ == '__main__':
    for name, html in (('voice-lessons', voice_lessons()), ('band', band()), ('handout', handout())):
        open(f'{name}.html', 'w').write(html)
        print(f'{name}.html')
