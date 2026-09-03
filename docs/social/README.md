# Social image generators

Open in a browser with a query string, screenshot at the stated size.

| File | Size | Query | Output |
|---|---|---|---|
| `carousel.html` | 1080×1080 | `?card=1..5` | Voice lessons carousel for Facebook / Instagram |

```bash
python3 -m http.server 8899           # from the repo root
for n in 1 2 3 4 5; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
    --disable-gpu --hide-scrollbars --window-size=1080,1080 --virtual-time-budget=7000 \
    --screenshot="$HOME/Desktop/Malachias-Carousel-Lessons/card-$n.png" \
    "http://localhost:8899/docs/social/carousel.html?card=$n"
done
```

## Why these are not the flyers

The flyers in `docs/print/` are built to be read up close, on paper, at 8.5×11.
A carousel is read small, on a phone, mid-scroll. Posting a flyer as a carousel
card gives you unreadable body text, the wrong aspect ratio, tear-off tabs that
mean nothing on a screen, and a QR code nobody can scan — you cannot scan the
phone you are holding. So the carousel carries the same offer, rebuilt square,
one idea per card, nothing under about 32px.

For the same reason there is **no QR on any card**. The call to action is the
phone number, the email, and the link in the caption.

## The band mention

Card 5 closes with a small "ALSO —" line about the band, matching the flyers.
A carousel is read in sequence rather than at a glance, so the second subject can
appear at the end without competing — unlike a posted flyer, where equal billing
leaves a passer-by unable to identify either.

Facts mirror `lib/lessons.ts`. Change them there and here together.
