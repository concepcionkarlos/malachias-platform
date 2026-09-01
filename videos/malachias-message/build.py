#!/usr/bin/env python3
"""Build captioned cuts of Malachias's phone message.

LAYOUT — measured from the source, not guessed (5% grid on frames at 5/30/50/78/92 s):

    0 %  ─┬─ empty screened patio + sky ......... CLEAN
   11 %   │   chip
   22 %   │   HERO band (one promoted phrase per cut)
   38 %  ─┼─ ................................... top of his hair (40-45%)
          │
          │   HIS FACE — nothing is ever drawn here
          │
   78 %  ─┼─ ................................... bottom of the beard (75-78%)
   80 %   │   RAIL band (verbatim captions, over the dark shirt)
   93 %   │   CTA bar
  100 %  ─┴─

Two tracks, per the embedded-captions model: the RAIL carries the words, the
HERO is scarce (exactly one per cut) and lands on the beat the phrase is spoken.

Usage:  python3 build.py <cut> <lang>   → writes index.html
"""
import json, sys, html

W, H = 1080, 1920

# ── Measured safe geometry (px at 1080x1920) ────────────────────────────────
CHIP_TOP   = 150
HERO_TOP   = 430          # hero band 430-740; his hair starts at ~768
HERO_H     = 300
RAIL_TOP   = 1570         # rail band 1570-1750; his beard bottoms out at ~1540
RAIL_H     = 180
BAR_TOP    = 1780         # CTA bar 1780-1920
RAIL_FONT  = 54           # 2 lines max at this size inside RAIL_H

END_CARD   = 4.0
CUE_MAX_WORDS   = 5
CUE_MAX_SECONDS = 2.4
GAP_SPLIT       = 0.45
MIN_CUE         = 0.55   # a caption on screen for less than this is unreadable

# Rail emphasis — accent colour inline, still on the rail (never promoted).
GOLD = {
    'san', 'antonio', 'free', 'veterans', 'veteran', 'band', 'november',
    'travel', 'donations', 'home', 'fitzgerald', 'raise', 'entire', 'money',
}

# ── Source blocks: (media_start, duration) ──────────────────────────────────
BLOCKS = {
    'intro':   (0.30, 29.02),
    'band':    (29.32, 16.43),
    'free':    (47.10, 15.38),
    'how':     (62.48, 13.94),
    'money':   (76.42, 13.49),
    'signoff': (90.05, 4.55),
}

# Spanish rail — short chunks (3-6 words), timed to the English phrase
# boundaries taken from transcript.json. Times are relative to the block.
ES = {
    'intro': [
        (0.0, 3.4, 'Hola a todos, soy Malachias.'),
        (3.4, 8.6, 'Nos invitaron a tocar en San Antonio, Texas.'),
        (8.6, 14.0, 'En un local familiar llamado Fitzgerald.'),
        (14.0, 19.0, 'Las dueñas son hijas de un veterano.'),
        (19.0, 28.5, 'Para lograrlo tenemos que reunir los fondos.'),
    ],
    'band': [
        (0.0, 3.8, 'Tenemos que reunir los fondos del viaje.'),
        (4.3, 6.8, 'Hay dos maneras de llegar.'),
        (7.1, 11.7, 'Voy yo solo, con guitarra acústica…'),
        (11.8, 13.6, '…o va la banda completa.'),
        (13.7, 16.4, 'Depende de cuánto podamos recaudar.'),
    ],
    'free': [
        (0.0, 2.0, 'Ofrecemos hacer esto gratis.'),
        (2.0, 4.0, 'Porque es para los veteranos.'),
        (4.1, 4.9, 'Para los veteranos.'),
        (5.4, 6.7, 'Para las familias de veteranos.'),
        (7.1, 9.8, 'No queremos quitarle nada al evento'),
        (10.0, 11.7, 'pidiendo que nos paguen.'),
        (11.9, 15.4, 'Buscamos donaciones para el viaje.'),
    ],
    'how': [
        (0.03, 2.35, 'Voy a poner el enlace en los comentarios.'),
        (2.35, 4.29, 'Asegúrense de verlo.'),
        (4.36, 6.27, 'Pueden donar por Cash App.'),
        (6.27, 8.09, 'Pueden donar por PayPal.'),
        (8.09, 9.62, 'Pueden contactarme directamente'),
        (9.73, 13.90, 'y les envío el comprobante deducible de impuestos.'),
    ],
    'money': [
        (0.0, 2.0, 'No vamos a ganar dinero con esto.'),
        (2.1, 5.3, 'Todo lo recaudado se usa para llegar.'),
        (5.8, 7.5, 'Para mantenernos allá.'),
        (7.6, 8.6, 'Y para volver a casa.'),
        (9.0, 13.4, 'Lo que sobre se dona a otra organización de veteranos.'),
    ],
    'signoff': [
        (0.1, 2.7, 'Los quiero. Ojalá puedan ayudar.'),
        (2.7, 4.5, 'Dios los bendiga. Fuerza y honor.'),
    ],
}

# ── The cuts ────────────────────────────────────────────────────────────────
# hero: (block, source_second, duration, EN, ES) — exactly one, on the beat.
CUTS = {
    'free': {
        'blocks': ['free', 'signoff'],
        'chip': ('Road to San Antonio', 'Road to San Antonio'),
        'cta':  ('HELP US GET THERE', 'AYÚDANOS A LLEGAR'),
        'hero': ('free', 48.50, 2.7, 'FOR FREE', 'GRATIS'),
        'end':    ('WE PLAY FOR FREE.', 'HELP US GET THERE.'),
        'end_es': ('TOCAMOS GRATIS.', 'AYÚDANOS A LLEGAR.'),
    },
    'band': {
        'blocks': ['band', 'signoff'],
        'chip': ('Two ways to get there', 'Dos maneras de llegar'),
        'cta':  ('HELP US GET THERE', 'AYÚDANOS A LLEGAR'),
        'hero': ('band', 41.90, 3.0, 'THE ENTIRE BAND', 'LA BANDA COMPLETA'),
        'end':    ('BRING THE WHOLE BAND.', 'NOV 12 · SAN ANTONIO'),
        'end_es': ('QUE VAYA TODA LA BANDA.', '12 NOV · SAN ANTONIO'),
    },
    'money': {
        'blocks': ['money', 'signoff'],
        'chip': ('Where every dollar goes', 'A dónde va cada dólar'),
        'cta':  ('HELP US GET THERE', 'AYÚDANOS A LLEGAR'),
        'hero': ('money', 81.20, 3.0, 'TO GET US THERE', 'PARA LLEGAR ALLÁ'),
        'end':    ('EVERY DOLLAR GOES', 'TO THE ROAD.'),
        'end_es': ('CADA DÓLAR VA', 'AL CAMINO.'),
    },
    'message': {
        'blocks': ['intro', 'band', 'free', 'how', 'money', 'signoff'],
        'chip': ('Road to San Antonio', 'Road to San Antonio'),
        'cta':  ('HELP US GET THERE', 'AYÚDANOS A LLEGAR'),
        'hero': ('band', 41.90, 3.0, 'THE ENTIRE BAND', 'LA BANDA COMPLETA'),
        'end':    ('HELP US BRING', 'THE FULL BAND.'),
        'end_es': ('AYÚDANOS A LLEVAR', 'A TODA LA BANDA.'),
    },
}


# Words that naturally BEGIN a clause. When a long sentence has to be split,
# the break is nudged so the next cue starts on one of these instead of
# stranding it at the tail of the previous cue.
STARTERS = {
    'and', 'so', 'but', 'because', 'or', 'that', 'to', 'for', 'with', 'when',
    'if', 'we', 'they', 'it', 'all', 'any', 'the', 'a', 'an', 'of', 'my',
    'our', 'by', 'in', 'on', 'at', 'from', 'is', 'was', 'will',
}


def _bare(w):
    return w['text'].lower().strip(',.!?"\'')


def en_cues(words, media_start, duration, offset):
    """Group transcript words into rail cues, timed on the output timeline.

    Break on what the speaker actually does — punctuation and real pauses —
    then split anything still too long at a clause boundary. Fixed-width
    chunking is what strands 'and' or 'because it is' at the end of a line.
    """
    sel = [w for w in words
           if w['start'] >= media_start - 0.15
           and w['end'] <= media_start + duration + 0.25
           and w['start'] <= media_start + duration - 0.30]

    # 1) Clauses: end on punctuation or a real pause.
    clauses, cur = [], []
    for i, w in enumerate(sel):
        cur.append(w)
        gap = sel[i + 1]['start'] - w['end'] if i + 1 < len(sel) else 99.0
        if w['text'].rstrip()[-1:] in '.,?!' or gap > GAP_SPLIT:
            clauses.append(cur); cur = []
    if cur:
        clauses.append(cur)

    # 2) Split clauses that are too long, preferring a clause boundary.
    pieces = []
    for c in clauses:
        if len(c) <= CUE_MAX_WORDS and c[-1]['end'] - c[0]['start'] <= CUE_MAX_SECONDS:
            pieces.append(c); continue
        n = max(2, -(-len(c) // CUE_MAX_WORDS))
        target = -(-len(c) // n)
        i = 0
        while i < len(c):
            j = min(i + target, len(c))
            if j < len(c):
                for k in (j, j - 1, j + 1, j - 2):
                    if i + 2 <= k < len(c) and _bare(c[k]) in STARTERS:
                        j = k; break
            pieces.append(c[i:j]); i = j

    # 3) Merge neighbouring fragments back into readable lines. Never across a
    #    sentence end — that is what dragged the next sentence's first word
    #    onto the tail of the previous caption.
    groups = []
    for p in pieces:
        if groups:
            prev = groups[-1]
            n = len(prev) + len(p)
            span = p[-1]['end'] - prev[0]['start']
            ends_sentence = prev[-1]['text'].rstrip()[-1:] in '.?!'
            p_closes = p[-1]['text'].rstrip()[-1:] in '.,?!'
            ok = ((p_closes and n <= 7)          # p completes a clause
                  or (len(prev) <= 3 and n <= 7)  # prev is too short to stand alone
                  or (len(p) <= 2 and n <= 8))    # p is a fragment
            if not ends_sentence and span <= 3.2 and ok:
                groups[-1] = prev + p
                continue
        groups.append(p)

    out = []
    for g in groups:
        a = offset + (g[0]['start'] - media_start)
        b = offset + (g[-1]['end'] - media_start) + 0.20
        out.append((max(0.0, a), b, ' '.join(x['text'] for x in g)))
    return out


def mark_en(text):
    parts = []
    for tok in text.split():
        bare = tok.lower().strip('.,!?"\'')
        cls = ' class="g"' if bare in GOLD else ''
        parts.append(f'<span{cls}>{html.escape(tok)}</span>')
    return ' '.join(parts)


def build(cut_name, lang='en'):
    cut = CUTS[cut_name]
    words = json.load(open('transcript.json'))
    es = lang != 'en'

    # Lay the blocks out on the output timeline.
    media, cues, offset, starts = [], [], 0.0, {}
    for i, name in enumerate(cut['blocks']):
        ms, dur = BLOCKS[name]
        starts[name] = offset
        media.append(
            f'      <video id="v{i}" class="clip" src="assets/malachias.mp4" muted playsinline\n'
            f'        data-start="{offset:.2f}" data-duration="{dur:.2f}" data-media-start="{ms:.2f}"\n'
            f'        data-track-index="1" style="width:100%;height:100%;object-fit:cover;"></video>\n'
            f'      <audio id="a{i}" src="assets/malachias.mp4"\n'
            f'        data-start="{offset:.2f}" data-duration="{dur:.2f}" data-media-start="{ms:.2f}"\n'
            f'        data-track-index="9" data-volume="1"></audio>')
        if es:
            cues += [(offset + s, offset + e, html.escape(t)) for s, e, t in ES[name]]
        else:
            cues += [(s, e, mark_en(t)) for s, e, t in en_cues(words, ms, dur, offset)]
        offset += dur

    video_total = offset
    total = round(video_total + END_CARD, 2)

    # The rail is a single box, so no two cues may ever be on screen at once.
    # 1) handoff — each cue yields 0.04s before the next enters
    # 2) merge anything left under MIN_CUE (a flashed caption is unreadable)
    def handoff(cs):
        return [(a, min(b, cs[i + 1][0] - 0.04) if i + 1 < len(cs) else b, t)
                for i, (a, b, t) in enumerate(cs)]

    cues.sort(key=lambda c: c[0])
    cues = handoff(cues)
    merged = []
    for a, b, t in cues:
        if merged and b - a < MIN_CUE:
            pa, _, pt = merged[-1]
            merged[-1] = (pa, b, pt + ' ' + t)
        else:
            merged.append((a, b, t))
    cues = handoff(merged)

    rail = [
        f'      <div id="cue{i}" class="clip rail" data-start="{s:.2f}" '
        f'data-duration="{e - s:.2f}" data-track-index="3"><p><span class="t">{m}</span></p></div>'
        for i, (s, e, m) in enumerate(cues) if s < video_total - 0.1
    ]

    # The one promoted phrase, on the beat it is spoken.
    hb, hsec, hdur, hen, hes = cut['hero']
    hero_at = starts[hb] + (hsec - BLOCKS[hb][0])
    hero_txt = hes if es else hen
    hero = (f'      <div id="hero" class="clip heroband" data-start="{hero_at:.2f}" '
            f'data-duration="{hdur:.2f}" data-track-index="4"><span>{html.escape(hero_txt)}</span></div>')

    chip = cut['chip'][1 if es else 0]
    cta = cut['cta'][1 if es else 0]
    end1, end2 = cut['end_es'] if es else cut['end']
    tagline = 'Nov 12, 2026 · San Antonio, TX' if not es else '12 nov 2026 · San Antonio, TX'
    url = 'malachiasmusic.com/road-to-san-antonio'
    cash = 'Cash App · Warfighter Gardens · $AWarriorsGarden'

    doc = f'''<!doctype html>
<html lang="{lang}" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <title>Malachias — {cut_name} ({lang})</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: #000; }}
      body {{ font-family: "Inter", system-ui, sans-serif; color: #ede5d8; }}
      #root {{ position: relative; width: {W}px; height: {H}px; overflow: hidden; background: #030202; }}
      .clip {{ position: absolute; inset: 0; }}

      /* Sky scrim — stops at 620px, well above his hair (768px). */
      .skyfade {{ position: absolute; left: 0; right: 0; top: 0; height: 620px; z-index: 2;
        background: linear-gradient(to bottom, rgba(3,2,2,0.78) 0%, rgba(3,2,2,0.35) 55%, rgba(3,2,2,0) 100%); }}
      /* Shirt scrim — starts at 1500px, below the beard (1498px). */
      .shirtfade {{ position: absolute; left: 0; right: 0; top: 1500px; bottom: 0; z-index: 2;
        background: linear-gradient(to bottom, rgba(3,2,2,0) 0%, rgba(3,2,2,0.80) 30%, rgba(3,2,2,0.92) 100%); }}

      .chip {{ position: absolute; top: {CHIP_TOP}px; left: 60px; z-index: 6;
        display: inline-flex; align-items: center; gap: 14px;
        font-weight: 700; font-size: 26px; letter-spacing: 0.24em; text-transform: uppercase;
        color: #f5cf63; background: rgba(4,3,2,0.82); padding: 14px 24px; border-radius: 999px;
        border: 1px solid rgba(201,168,76,0.38); }}
      .chip i {{ display: block; width: 10px; height: 10px; border-radius: 50%; background: #f5cf63; }}
      .tag {{ position: absolute; top: {CHIP_TOP + 74}px; left: 74px; z-index: 6;
        font-weight: 600; font-size: 25px; letter-spacing: 0.20em; text-transform: uppercase;
        color: rgba(237,229,216,0.92); text-shadow: 0 2px 12px rgba(0,0,0,0.9); }}

      /* HERO — the one promoted phrase, in the dead sky above his head. */
      .heroband {{ z-index: 5; }}
      .heroband span {{ position: absolute; top: {HERO_TOP}px; left: 70px; width: {W - 140}px;
        height: {HERO_H}px; display: flex; align-items: center; justify-content: center; text-align: center;
        font-family: "Bebas Neue", sans-serif; font-size: 120px; line-height: 0.92; letter-spacing: 0.03em;
        color: #f5cf63; text-shadow: 0 6px 40px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.9); }}

      /* RAIL — verbatim captions, bottom band only. Fixed box: cannot drift up. */
      .rail {{ z-index: 5; }}
      .rail p {{ position: absolute; top: {RAIL_TOP}px; left: 60px; width: {W - 120}px; height: {RAIL_H}px;
        display: flex; align-items: center; justify-content: center; }}
      .rail .t {{ display: inline-block; max-width: 100%; text-align: center;
        font-weight: 800; font-size: {RAIL_FONT}px; line-height: 1.18; letter-spacing: -0.005em;
        color: #fff; background: rgba(5,4,3,0.78); border-radius: 16px; padding: 14px 28px;
        box-shadow: 0 14px 44px rgba(0,0,0,0.5); }}
      .rail .g {{ color: #f5cf63; }}

      .bar {{ position: absolute; top: {BAR_TOP}px; left: 0; right: 0; bottom: 0; z-index: 6;
        display: flex; align-items: center; justify-content: center;
        border-top: 1px solid rgba(201,168,76,0.30); background: rgba(2,2,2,0.90);
        font-weight: 700; font-size: 27px; letter-spacing: 0.28em; text-transform: uppercase; color: #c9a84c; }}

      .end {{ background: linear-gradient(160deg, #020202 0%, #0a0602 55%, #030202 100%); }}
      .end .glow {{ position: absolute; left: 50%; top: 40%; width: 1100px; height: 1100px;
        transform: translate(-50%,-50%); border-radius: 50%;
        background: radial-gradient(circle, rgba(120,60,10,0.45) 0%, rgba(120,60,10,0) 66%); }}
      .end .inner {{ position: absolute; left: 80px; right: 80px; top: 300px; bottom: 300px; z-index: 2;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; text-align: center; }}
      .display {{ font-family: "Bebas Neue", sans-serif; letter-spacing: 0.04em; line-height: 0.98; }}
      .gold {{ color: #c9a84c; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="{W}" data-height="{H}">

{chr(10).join(media)}

      <div id="scrim" class="clip" data-start="0" data-duration="{video_total:.2f}" data-track-index="2" aria-hidden="true" style="pointer-events:none;">
        <div class="skyfade"></div><div class="shirtfade"></div>
      </div>
      <div id="frame" class="clip" data-start="0" data-duration="{video_total:.2f}" data-track-index="2" style="pointer-events:none;">
        <div class="chip"><i></i><span>{html.escape(chip)}</span></div>
        <div class="tag">{html.escape(tagline)}</div>
        <div class="bar">{html.escape(cta)}</div>
      </div>

{hero}

{chr(10).join(rail)}

      <section id="end" class="clip end" data-start="{video_total:.2f}" data-duration="{END_CARD}" data-track-index="8">
        <div class="glow"></div>
        <div class="inner">
          <img id="end-emblem" src="assets/emblem-end.png" alt="" style="width:520px;height:347px;object-fit:contain;mix-blend-mode:screen;" />
          <p id="end-title" class="display" style="font-size:118px;">{html.escape(end1)}<br><span class="gold">{html.escape(end2)}</span></p>
          <p id="end-url" style="font-size:40px;font-weight:600;color:#e8ddd0;white-space:nowrap;">{url}</p>
          <p id="end-cash" style="font-size:30px;color:#a89880;">{cash}</p>
        </div>
      </section>

    </div>

    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
      const E = "power3.out";
      tl.fromTo("#hero span", {{ opacity: 0, y: 26, scale: 0.94 }},
        {{ opacity: 1, y: 0, scale: 1, duration: 0.55, ease: E }}, {hero_at:.2f});
      tl.to("#hero span", {{ opacity: 0, duration: 0.35, ease: "power2.in" }}, {hero_at + hdur - 0.35:.2f});
      tl.fromTo("#end-emblem", {{ opacity: 0, y: -18 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: E }}, {video_total:.2f});
      tl.fromTo("#end-title", {{ opacity: 0, y: 34 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: E }}, {video_total + 0.25:.2f});
      tl.fromTo(["#end-url", "#end-cash"], {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: E, stagger: 0.18 }}, {video_total + 0.7:.2f});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
    open('index.html', 'w').write(doc)
    print(f'{cut_name}/{lang}: video {video_total:.1f}s · total {total}s · '
          f'{len(rail)} rail cues · hero "{hero_txt}" @ {hero_at:.2f}s')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'en')
