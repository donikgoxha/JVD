# Assets

## Still missing — clinic photography

Every path below is referenced by the code but **is not committed**, because it
has to be a real photograph of the real clinic and team. Until each file lands,
`src/components/Img.jsx` draws a hatched brand placeholder in its place, so
nothing renders broken — and the photo fades in over it automatically once the
file exists. No code change is needed when you add them.

Drop each file at the exact path shown (paths are relative to `public/`, so
`/team/jeton-selimi.webp` means `public/team/jeton-selimi.webp`).

### Export rules

- **WebP, quality ~80.** Above that the files get big for no visible gain.
- **Match the listed pixel dimensions.** The `width`/`height` attributes are
  hardcoded in JSX to reserve layout space; a mismatched file is cropped by
  `object-cover` and the framing will not be what you chose.

| Path | Aspect | Dimensions | Used by |
| --- | --- | --- | --- |
| `/hero-clinic.webp` | 4:5 | 960 × 1200 | `src/pages/Home.jsx` — hero, eager + `fetchPriority="high"` |
| `/team/jeton-selimi.webp` | 1:1 | 400 × 400 | Dr. Jeton Selimi — team grid (Home, About) |
| `/team/vleran-selimi.webp` | 1:1 | 400 × 400 | Dr. Vleran Selimi — team grid (Home, About) |
| `/team/donjet-selimi.webp` | 1:1 | 400 × 400 | Dr. Donjet Selimi — team grid (Home, About) |

Team portraits: head and shoulders, centred, same background for all three so
the row reads as one set.

Team portraits render in a 4:5 frame (`object-cover`), so keep the face in the
upper-middle of the square.

### Instagram gallery — `public/instagram/`

The gallery on Home and Our Work is driven by `INSTAGRAM_POSTS` in
`src/data/clinic.js` and is hidden while that list is empty. Add **real posts
only**, saved from the clinic's own feed: square, **800 × 800 WebP**, named
after the post code (`/instagram/C9abc123.webp`), with the real caption and
post URL. Anything showing a patient needs that patient's consent — the clinic
already had it to post on Instagram, but confirm before reusing.

## Committed

| Path | Notes |
| --- | --- |
| `/favicon.svg` | Site icon, the source for every PNG icon below. |
| `/apple-touch-icon.png` | 180 × 180, iOS home screen. Full-bleed square — iOS rounds the corners itself. |
| `/icon-192.png`, `/icon-512.png` | Manifest icons (`purpose: any`). |
| `/icon-maskable-512.png` | Manifest icon (`purpose: maskable`); the glyph sits inside the 80% safe zone so Android's circle/squircle crop never clips it. |
| `/og-cover.jpg` | 1200 × 630 link-preview card: name, city, both street addresses. JPEG, not WebP — some scrapers still reject WebP. `vite.config.js` emits it as an **absolute** `og:image` / `twitter:image` URL built from `VITE_SITE_URL`. Swap in a photo-based card once clinic photography exists. |
| `/fonts/inter-var.woff2` | Inter variable 100–900, **latin** subset. Covers all current copy, including both street addresses. Preloaded from `index.html`. |
| `/fonts/inter-var-latin-ext.woff2` | Inter variable, **latin-ext** subset (ë, ç, č, š …). Declared with a `unicode-range`, so browsers only download it if a page actually renders one of those glyphs. |
| `/fonts/fraunces-var.woff2`, `/fonts/fraunces-var-italic.woff2` | Fraunces variable, latin subset — the display serif for headings. Upright is preloaded; italic loads with the first accent word. |
| `/fonts/Inter-OFL.txt`, `/fonts/Fraunces-OFL.txt` | SIL Open Font License for each family — must ship alongside the font files. |

The icons and the share card were rendered from `favicon.svg` and the brand
tokens in `src/index.css` (`--color-brand-600: #1d7791`). If the brand colour
changes, regenerate them along with the three other hard-coded copies of it
listed in README section 3.

If the copy is ever translated to Macedonian, add a Cyrillic face the same way
(another `@font-face` with the Cyrillic `unicode-range`).
