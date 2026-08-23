# assets

`Manrope-800-subset.ttf` is the face drawn into the Open Graph card
(`src/app/opengraph-image.tsx`). It is the same display face the site uses for
its headings, cut down to the characters the card actually shows.

Any character missing from it silently falls back to a different face, so when
the card's copy changes, rebuild the subset:

```sh
curl -sL -o "/tmp/Manrope[wght].ttf" \
  "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf"
fonttools varLib.instancer /tmp/Manrope[wght].ttf wght=800 -o /tmp/frozen.ttf

pyftsubset /tmp/frozen.ttf \
  --text="use-pwa React hook for detecting and handling PWA installation. kkweb.io Install" \
  --unicodes="U+0020-007E,U+00A0-00FF" \
  --output-file=assets/Manrope-800-subset.ttf \
  --no-hinting --desubroutinize --layout-features=''
```
