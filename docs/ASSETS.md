# Missing assets

Every path below is referenced by the code but **is not committed**. Until the
real files land in `public/`, each one 404s — images fall back to the flat
`bg-brand-100` placeholder colour, and the font falls back to system sans.

Drop each file at the exact path shown (paths are relative to this `public/`
directory, so `/team/jeton-selimi.webp` means `public/team/jeton-selimi.webp`).

## Export rules

- **WebP, quality ~80.** Above that the files get big for no visible gain.
- **Match the listed pixel dimensions.** The `width`/`height` attributes are
  hardcoded in JSX to reserve layout space; a mismatched file makes the browser
  letterbox or crop it via `object-cover` and shifts the layout.
- **Before/after pairs must be pixel-identical in dimensions**, and shot at the
  same angle, distance and lighting. The two halves sit side by side in a
  `grid-cols-2` and any difference reads as a distortion, not a result.
- Photograph real patients only with **written consent** — `/our-work` states
  publicly that consent was given.

## Photography

| Path | Aspect | Dimensions | Used by |
| --- | --- | --- | --- |
| `/hero-clinic.webp` | 4:5 | 960 × 1200 | `src/pages/Home.jsx` — hero, eager + `fetchPriority="high"` |
| `/og-cover.jpg` | 1.91:1 | 1200 × 630 | `index.html` — `og:image`. JPEG, not WebP: some scrapers still reject WebP. |

> Note: `Home.jsx` currently declares `width="960" height="1120"`, which is not
> 4:5. Export the hero at **960 × 1200** to match the `aspect-[4/5]` class, and
> correct the `height` attribute in that file when you do.

## Team portraits — 1:1, 400 × 400

Referenced from `src/data/clinic.js`. Head and shoulders, centred, same
background for all three so the row reads as one set.

| Path | Doctor |
| --- | --- |
| `/team/jeton-selimi.webp` | Dr. Jeton Selimi |
| `/team/vleran-selimi.webp` | Dr. Vleran Selimi |
| `/team/donjet-selimi.webp` | Donjet Selimi |

## Case gallery — 4:3, 600 × 450 each

Referenced from `src/pages/Work.jsx`. Eight files, four before/after pairs.

| Case | Before | After |
| --- | --- | --- |
| Ceramic veneers | `/work/veneers-before.webp` | `/work/veneers-after.webp` |
| Single implant | `/work/implant-before.webp` | `/work/implant-after.webp` |
| Clear aligners | `/work/aligners-before.webp` | `/work/aligners-after.webp` |
| In-chair whitening | `/work/whitening-before.webp` | `/work/whitening-after.webp` |

## Font

| Path | Notes |
| --- | --- |
| `/fonts/inter-var.woff2` | Inter **variable** weight 100–900. Declared in `src/index.css` (`@font-face`, `font-display: swap`). Subset to latin + latin-ext. All site copy including the two street addresses is Latin script; add a Cyrillic subset only if the copy is translated to Macedonian. |

The `<link rel="preload">` for this font in `index.html` is **commented out** on
purpose, so a missing file costs nothing. Uncomment it in the same commit that
adds `public/fonts/inter-var.woff2` — without the preload the font is discovered
only after the CSS parses, which delays the swap by roughly one round trip.

Until the file lands, `font-display: swap` falls back to the system UI font. The
build prints one harmless warning: `/fonts/inter-var.woff2 ... didn't resolve at
build time`. It disappears once the file exists.

## Already committed

`/favicon.svg` and `/site.webmanifest` are in this directory — nothing to do.
