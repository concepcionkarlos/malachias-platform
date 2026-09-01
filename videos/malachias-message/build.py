#!/usr/bin/env python3
"""Build captioned cuts of Malachias's own message.

One source clip (assets/malachias.mp4, 95 s, vertical), several cuts. Each cut is
one or more parts of the source stitched on the timeline, with burned-in captions
taken from the word-level transcript (English) or hand-written (Spanish), plus a
branded end card. Usage:  python3 build.py <cut> <lang>   → writes index.html
"""
import json, sys, html, re

W, H = 1080, 1920
END_CARD = 4.0          # seconds of end card after the last part
CUE_MAX_WORDS = 4
CUE_MAX_SECONDS = 1.9
GAP_SPLIT = 0.45        # a pause longer than this starts a new cue

# Words that carry the message — shown in gold.
GOLD = {
    'san', 'antonio', 'free', 'veterans', 'veteran', 'band', 'november', 'travel',
    'donations', 'home', 'fitzgerald', 'fitzgerald.', 'raise', 'entire',
}

# ── The cuts ─────────────────────────────────────────────────────────────────
# parts: (media_start, duration) taken from the transcript's word timings.
CUTS = {
    # "We're playing for free" — the trust piece.
    'free': {
        'parts': [(47.10, 15.55), (90.05, 4.55)],
        'chip': 'Road to San Antonio',
        'end': ('WE PLAY FOR FREE.', 'HELP US GET THERE.'),
        'end_es': ('TOCAMOS GRATIS.', 'AYÚDANOS A LLEGAR.'),
        'es': [
            (0.0, 2.2, 'Ofrecemos tocar gratis.'),
            (2.2, 5.0, 'Porque es para los veteranos,'),
            (5.0, 7.4, 'y para las familias de los veteranos.'),
            (7.4, 11.6, 'No queremos quitarle nada al evento\npidiéndoles que nos paguen.'),
            (11.6, 15.5, 'Así que pedimos donaciones\nsolo para el viaje.'),
            (15.6, 18.4, 'Los quiero. Ojalá puedan ayudar.'),
            (18.4, 20.1, 'Dios los bendiga. Fuerza y honor.'),
        ],
    },
    # "Me or the whole band" — the unlock.
    'band': {
        'parts': [(29.30, 16.45), (90.05, 4.55)],
        'chip': 'Road to San Antonio',
        'end': ('BRING THE WHOLE BAND.', 'NOV 12 · SAN ANTONIO'),
        'end_es': ('QUE VAYA TODA LA BANDA.', '12 NOV · SAN ANTONIO'),
        'es': [
            (0.0, 3.0, 'Para lograrlo tenemos que reunir\nlos fondos del viaje.'),
            (3.0, 5.2, 'Hay dos maneras de llegar:'),
            (5.2, 9.6, 'que vaya yo solo\ncon una guitarra acústica…'),
            (9.6, 13.0, '…o que vaya la banda completa.'),
            (13.0, 16.4, 'Depende de cuánto podamos recaudar.'),
            (16.5, 19.3, 'Los quiero. Ojalá puedan ayudar.'),
            (19.3, 21.0, 'Dios los bendiga. Fuerza y honor.'),
        ],
    },
    # "Where every dollar goes" — transparency.
    'money': {
        'parts': [(76.40, 13.55), (90.05, 4.55)],
        'chip': 'Where every dollar goes',
        'end': ('EVERY DOLLAR GOES', 'TO THE ROAD.'),
        'end_es': ('CADA DÓLAR VA', 'AL CAMINO.'),
        'es': [
            (0.0, 3.0, 'No vamos a ganar dinero\ncon este evento.'),
            (3.0, 7.6, 'Todo lo recaudado se usa\npara llegar allá,'),
            (7.6, 10.4, 'mantenernos allí\ny volver a casa.'),
            (10.4, 13.5, 'Lo que sobre se dona a otra\norganización de veteranos.'),
            (13.6, 16.4, 'Los quiero. Ojalá puedan ayudar.'),
            (16.4, 18.1, 'Dios los bendiga. Fuerza y honor.'),
        ],
    },
    # The full message — for the website and the Facebook feed.
    'message': {
        'parts': [(0.30, 28.70), (29.30, 16.45), (47.10, 15.55), (76.40, 13.55), (90.05, 4.55)],
        'chip': 'Road to San Antonio',
        'end': ('HELP US BRING', 'THE FULL BAND.'),
        'end_es': ('AYÚDANOS A LLEVAR', 'A TODA LA BANDA.'),
        'es': [
            (0.0, 3.4, 'Hola a todos, soy Malachias,\nde la banda Malachias.'),
            (3.4, 8.6, 'Nos dieron la oportunidad de tocar\nen San Antonio, Texas,'),
            (8.6, 14.0, 'en un local familiar\nllamado Fitzgerald.'),
            (14.0, 19.0, 'Las dueñas son hijas\nde un veterano del Ejército.'),
            (19.0, 28.6, 'Para lograrlo tenemos que reunir\nlos fondos del viaje.'),
            (28.7, 31.5, 'Hay dos maneras de llegar:'),
            (31.5, 36.0, 'que vaya yo solo\ncon una guitarra acústica…'),
            (36.0, 40.0, '…o que vaya la banda completa.'),
            (40.0, 45.1, 'Depende de cuánto podamos recaudar.'),
            (45.2, 47.6, 'Ofrecemos tocar gratis.'),
            (47.6, 51.0, 'Porque es para los veteranos\ny sus familias.'),
            (51.0, 56.0, 'No queremos quitarle nada al evento\npidiéndoles que nos paguen.'),
            (56.0, 60.7, 'Pedimos donaciones\nsolo para el viaje.'),
            (60.8, 63.8, 'No vamos a ganar dinero\ncon este evento.'),
            (63.8, 68.4, 'Todo lo recaudado se usa\npara llegar allá,'),
            (68.4, 71.2, 'mantenernos allí\ny volver a casa.'),
            (71.2, 74.3, 'Lo que sobre se dona a otra\norganización de veteranos.'),
            (74.4, 77.2, 'Los quiero. Ojalá puedan ayudar.'),
            (77.2, 78.9, 'Dios los bendiga. Fuerza y honor.'),
        ],
    },
}


def load_words():
    return json.load(open('transcript.json'))


def cues_for_part(words, media_start, duration, offset):
    """Group transcript words inside [media_start, media_start+duration) into cues,
    timed against the output timeline (offset = where this part starts)."""
    sel = [w for w in words if w['start'] >= media_start - 0.02 and w['end'] <= media_start + duration + 0.25]
    cues, cur = [], []
    for w in sel:
        if cur:
            span = w['end'] - cur[0]['start']
            gap = w['start'] - cur[-1]['end']
            if len(cur) >= CUE_MAX_WORDS or span > CUE_MAX_SECONDS or gap > GAP_SPLIT:
                cues.append(cur); cur = []
        cur.append(w)
    if cur:
        cues.append(cur)
    out = []
    for c in cues:
        start = offset + (c[0]['start'] - media_start)
        end = offset + (c[-1]['end'] - media_start) + 0.18
        text = ' '.join(x['text'] for x in c)
        out.append((max(0.0, start), end, text))
    return out


def render_en_cue(text):
    parts = []
    for tok in text.split():
        bare = tok.lower().strip('.,!?"\'')
        cls = ' class="g"' if bare in GOLD else ''
        parts.append(f'<span{cls}>{html.escape(tok)}</span>')
    return ' '.join(parts)


def render_es_cue(text):
    return '<br>'.join(html.escape(line) for line in text.split('\n'))


def build(cut_name, lang):
    cut = CUTS[cut_name]
    words = load_words()
    parts = cut['parts']

    media, offset = [], 0.0
    for i, (ms, dur) in enumerate(parts):
        media.append(f'''      <video id="v{i}" class="clip" src="assets/malachias.mp4" muted playsinline
        data-start="{offset:.2f}" data-duration="{dur:.2f}" data-media-start="{ms:.2f}" data-track-index="1"
        style="width:100%;height:100%;object-fit:cover;"></video>
      <audio id="a{i}" src="assets/malachias.mp4"
        data-start="{offset:.2f}" data-duration="{dur:.2f}" data-media-start="{ms:.2f}" data-track-index="9" data-volume="1"></audio>''')
        offset += dur
    video_total = offset
    total = round(video_total + END_CARD, 2)

    if lang == 'en':
        cues, off = [], 0.0
        for ms, dur in parts:
            cues += cues_for_part(words, ms, dur, off)
            off += dur
        cue_html = [
            f'      <div id="cue{i}" class="clip cue" data-start="{s:.2f}" data-duration="{max(0.35, e - s):.2f}" data-track-index="3"><p>{render_en_cue(t)}</p></div>'
            for i, (s, e, t) in enumerate(cues) if s < video_total
        ]
        end1, end2 = cut['end']
        chip = cut['chip']
        cta = 'HELP US GET THERE'
        url = 'malachiasmusic.com/road-to-san-antonio'
        cash = 'Cash App · Warfighter Gardens · $AWarriorsGarden'
    else:
        cue_html = [
            f'      <div id="cue{i}" class="clip cue" data-start="{s:.2f}" data-duration="{max(0.35, e - s):.2f}" data-track-index="3"><p>{render_es_cue(t)}</p></div>'
            for i, (s, e, t) in enumerate(cut['es']) if s < video_total
        ]
        end1, end2 = cut['end_es']
        chip = 'Road to San Antonio'
        cta = 'AYÚDANOS A LLEGAR'
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
      .scrim {{ position: absolute; left: 0; right: 0; bottom: 0; height: 46%; z-index: 2;
        background: linear-gradient(to top, rgba(3,2,2,0.94) 0%, rgba(3,2,2,0.72) 42%, rgba(3,2,2,0) 100%); }}
      .topfade {{ position: absolute; left: 0; right: 0; top: 0; height: 16%; z-index: 2;
        background: linear-gradient(to bottom, rgba(3,2,2,0.75), rgba(3,2,2,0)); }}
      .chip {{ position: absolute; top: 210px; left: 60px; z-index: 4; display: flex; align-items: center; gap: 14px;
        font-weight: 700; font-size: 26px; letter-spacing: 0.26em; text-transform: uppercase; color: #f5cf63;
        background: rgba(4,3,2,0.82); padding: 14px 22px; border-radius: 999px;
        border: 1px solid rgba(201,168,76,0.35); }}
      .chip i {{ display: block; width: 10px; height: 10px; border-radius: 50%; background: #f5cf63; }}
      .cue {{ z-index: 5; display: flex; align-items: flex-end; justify-content: center;
        padding: 0 72px 470px; text-align: center; }}
      .cue p {{ display: inline-block; max-width: 900px; font-weight: 800; font-size: 74px; line-height: 1.18;
        letter-spacing: -0.01em; color: #fff; background: rgba(4,3,2,0.80); padding: 20px 30px; border-radius: 16px;
        box-shadow: 0 18px 60px rgba(0,0,0,0.55); }}
      .cue .g {{ color: #f5cf63; }}
      .bar {{ position: absolute; left: 0; right: 0; bottom: 0; height: 130px; z-index: 6; display: flex;
        align-items: center; justify-content: center; gap: 22px; border-top: 1px solid rgba(201,168,76,0.30);
        background: rgba(2,2,2,0.88); font-weight: 700; font-size: 27px; letter-spacing: 0.28em;
        text-transform: uppercase; color: #c9a84c; }}
      .end {{ background: linear-gradient(160deg, #020202 0%, #0a0602 55%, #030202 100%); }}
      .end .glow {{ position: absolute; left: 50%; top: 40%; width: 1100px; height: 1100px; transform: translate(-50%,-50%);
        border-radius: 50%; background: radial-gradient(circle, rgba(120,60,10,0.45) 0%, rgba(120,60,10,0) 66%); }}
      .end .inner {{ position: absolute; left: 80px; right: 80px; top: 300px; bottom: 300px; z-index: 2;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; text-align: center; }}
      .display {{ font-family: "Bebas Neue", sans-serif; letter-spacing: 0.04em; line-height: 0.98; }}
      .gold {{ color: #c9a84c; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="{W}" data-height="{H}">

{chr(10).join(media)}

      <div id="scrim" class="clip" data-start="0" data-duration="{video_total:.2f}" data-track-index="2" aria-hidden="true" style="pointer-events:none;"><div class="scrim"></div><div class="topfade"></div></div>
      <div id="frame" class="clip" data-start="0" data-duration="{video_total:.2f}" data-track-index="2" style="pointer-events:none;">
        <div class="chip"><i></i><span>{html.escape(chip)}</span></div>
        <div class="bar">{html.escape(cta)}</div>
      </div>

{chr(10).join(cue_html)}

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
      tl.fromTo("#end-emblem", {{ opacity: 0, y: -18 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: E }}, {video_total:.2f});
      tl.fromTo("#end-title", {{ opacity: 0, y: 34 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: E }}, {video_total + 0.25:.2f});
      tl.fromTo(["#end-url", "#end-cash"], {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: E, stagger: 0.18 }}, {video_total + 0.7:.2f});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
    open('index.html', 'w').write(doc)
    n_cues = len(cue_html)
    print(f'{cut_name}/{lang}: {len(parts)} parts · video {video_total:.1f}s · total {total}s · {n_cues} cues')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'en')
