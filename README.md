# JVD Dental Clinic — Website

Static marketing site for **JVD Dental Clinic**, Gostivar, North Macedonia: two clinic
locations (`goce-delchev`, `gjinoski`) and three dentists. There is **no online booking** —
every call to action is a phone number, a map link, or the clinic's Instagram.

Built as a Vite single-page application: React 19, react-router-dom 7, Tailwind CSS v4.

---

## 1. Quick start

Requires **Node.js 20 or newer**.

```bash
npm install
npm run dev           # dev server on http://localhost:5173
npm run build         # production build -> dist/
npm run preview       # serve the built dist/ locally
npm run lint          # eslint . (flat config, ESLint 9)
```

`.env.production` is **committed** and holds the one build-time setting every deployment
depends on, `VITE_SITE_URL`. Copy `.env.example` to `.env.local` for personal overrides. Vite
**inlines** every `VITE_`-prefixed variable into the client bundle — never put a secret in one.

Deploying is `git push` to `main`; see `docs/DEPLOY_VERCEL.md`.

---

## 2. Pages

| Route | Page | Contents |
| --- | --- | --- |
| `/` | `Home.jsx` | hero, services marquee + grid, values, team, Instagram, both clinics, call band |
| `/about` | `About.jsx` | family practice story, mission, values, team |
| `/our-work` | `Work.jsx` | Instagram feature card, Instagram gallery (when filled), services |
| `/contact` | `Contact.jsx` | both clinics with directions, every dentist's direct line, Instagram |
| `/book` | — | **redirects to `/contact`** (301 at the host, `<Navigate>` in the app), so old links on business cards and bios still work |
| `*` | `NotFound.jsx` | 404, self-marks `noindex` |

---

## 3. Design system

### Look

- **Palette** — brand teal (`brand-50…900`, `#1d7791` at 600) on a warm **cream** page
  (`cream`, `sand`), a **deep** teal (`#0c2b36`) for dark bands, and a **peach** accent
  (`peach-200…400`) for highlights and glows. Peach is never used for text on light
  backgrounds — it fails contrast there.
- **Type** — **Fraunces** (display serif) for headings, with an italic teal accent word
  (`<em>` inside a title), and **Inter** for everything else. Both are self-hosted variable
  fonts in `public/fonts/`, OFL-licensed (licence files alongside).
- **Motion** — scroll reveals (`Reveal.jsx`), a slow service marquee, a rotating badge in the
  hero and gently floating cards. All of it stops under `prefers-reduced-motion`.

### Tailwind v4 is CSS-first

There is deliberately **no `tailwind.config.js` and no `postcss.config.js`**. All tokens live
in the `@theme` block of `src/index.css`; adding a token there is what creates the utility
(`--color-peach-300` → `bg-peach-300`, `--animate-marquee` → `animate-marquee`).

Reusable compositions — `container-page`, `btn`, `btn-primary`, `btn-ghost`, `card`,
`eyebrow`, `font-display`, `reveal`, `grain` — are declared with **`@utility`**, not
`@layer components`, so an inline override still wins (`className="btn-primary px-8 py-4"`).
`@apply` only accepts utilities, so the button base is spelled out in each `btn-*` variant:
change it in all three.

Changing the brand teal in `@theme` propagates site-wide, but four places hard-code
`#1d7791` and must be updated by hand: `<meta name="theme-color">` in `index.html`,
`theme_color` in `public/site.webmanifest`, `public/favicon.svg`, and the generated PNG
icons / `og-cover.jpg` (see `docs/ASSETS.md`).

### Components

```text
src/components/
├── Navbar.jsx         floating pill nav; turns solid on scroll; mobile drawer w/ scroll lock; "Call us"
├── Footer.jsx         locations, nav, oversized wordmark, DGDsmart credit
├── Section.jsx        eyebrow + display title + lead wrapper
├── Blocks.jsx         shared blocks: PageHero, Glow, Marquee, ServicesGrid, ValuesBand,
│                      TeamGrid, LocationCards (+ MapArt), CallBand
├── InstagramCard.jsx  InstagramCard (feature card) and InstagramGallery (real posts)
├── Img.jsx            <img> over a branded placeholder; the photo fades in once it decodes
├── Reveal.jsx         scroll reveal — see below
└── Icons.jsx          the whole inline-SVG icon set, the logo and the tooth path
```

Every block derives from `src/data/clinic.js`, so adding a dentist, clinic or service
updates every page that shows it.

**`Reveal` deliberately does not use IntersectionObserver.** IO only reports threshold
crossings it samples, so an element skipped over in one jump (fast flick, anchor link, back
button) never "intersects" and would stay invisible. `Reveal` instead runs one shared,
rAF-throttled scroll check that reveals everything at or above the line. Elements already
on screen at load are never hidden, so nothing flickers and nothing is hidden from crawlers.

---

## 4. Content — `src/data/clinic.js`

Single source of truth: `CLINIC`, `LOCATIONS`, `DOCTORS`, `SERVICES`, `NAV`, `VALUES`,
`INSTAGRAM_POSTS`, plus the helpers `doctorsAtLocation()`, `locationsForDoctor()` and
`telHref()`.

**Confirmed and real:** practitioner names, all phone numbers, both street addresses, the
Instagram account.

### Adding a clinic or a practitioner

1. **New clinic** — append to `LOCATIONS`, then add its `id` to the `locations` list of
   whoever works there.
2. **New practitioner** — append to `DOCTORS` with `locations: ['<clinic id>', …]`, and drop a
   portrait at the `photo` path.

Copy-paste templates are at the bottom of `clinic.js`. `validateClinicData()` runs in dev and
warns about a `locations` entry that matches no clinic, duplicate ids, a dentist with no
clinic, or a clinic with nobody assigned. It never throws.

### The Instagram gallery

`INSTAGRAM_POSTS` is **empty on purpose**. Fill it only with real posts from
`@jvddentalclinic`: the image saved into `public/instagram/` (square, 800 × 800 WebP), the
real caption, the real post URL. The schema is documented above the array. While it is empty
the gallery does not render and the Instagram card stands alone. Never fill it with stock
or AI images — on a dental site a gallery reads as "our patients' results".

### Still to come from the clinic

Each of these is **omitted** from the site rather than guessed:

- [ ] `CLINIC.email` — `null`; email links are hidden
- [ ] `LOCATIONS[*].hours` — `null`; cards say "Call for opening hours", and `openingHours`
      is left out of the structured data
- [ ] `DOCTORS[*].role` — all read `Dentist`, a stand-in for the confirmed specialty
- [ ] `DOCTORS[*].bio` — empty; never invent credentials for a named person
- [ ] `SERVICES` — standard for a general practice but **published and unverified**. Confirm
      it against what the clinic actually does (their Instagram is the best reference).
- [ ] The clinic's own story (founding year etc.) — a `TODO` in `About.jsx`
- [ ] Photography — the hero and three portraits (`docs/ASSETS.md`), and Instagram posts

---

## 5. Performance

Measured on the current build (`npm run build`, gzipped):

| Chunk | Gzip | When it loads |
| --- | ---: | --- |
| `vendor` (React + react-dom + router) | 74.0 kB | first paint, cached across deploys |
| `index` (app shell + Home + shared blocks) | 12.2 kB | first paint |
| `index.css` (whole site) | 10.0 kB | first paint |
| `About` / `Work` / `Contact` / `NotFound` | 0.6–1.2 kB each | on navigation |

Fonts: Inter latin (48 kB) and Fraunces upright (37 kB) are preloaded. Fraunces italic
(46 kB) loads with the first accent word; Inter latin-ext (85 kB) only loads if a page renders
one of its glyphs.

Rules worth keeping:

- **Route-level code splitting.** Only `Home` is in the initial bundle.
- **Vendor split by resolved path.** `vite.config.js` matches `node_modules/(react|react-dom|…)/`
  with a function. A string map keyed on `'react-dom'` misses `react-dom/client` — do not
  "simplify" it.
- **No third-party runtime at all.** No embeds, analytics, icon packs or web fonts from other
  origins. Maps are links, not iframes.
- **Every `<img>` has `width` and `height`** and sits in an aspect-ratio box, so layout never
  shifts. The hero image is `loading="eager"` + `fetchPriority="high"` (it is the LCP
  element); everything else is lazy.
- **Structured data at build time.** `vite.config.js` injects Dentist JSON-LD (generated from
  `clinic.js`), canonical, `og:url` and an absolute `og:image` into `index.html`, so crawlers
  get it without running JavaScript. `usePageMeta.js` sets per-route title/description/canonical.

---

## 6. Accessibility

- Skip link to `#main`; global brand `:focus-visible` ring — never add `outline: none`.
- Mobile drawer: `aria-expanded`, `aria-controls`, state-dependent `aria-label`; body scroll
  lock released in the effect cleanup.
- Icon-only links (dentist call buttons) carry an `aria-label` with the name and number.
  Decorative SVGs, glows, the marquee, the rotating badge and the footer wordmark are
  `aria-hidden`.
- `<address>` for addresses, `<ol>` for the numbered values, `<dl>` for hero stats.
- `prefers-reduced-motion` clamps every animation and transition, **including iteration
  count** — an infinite marquee squeezed to 0.01 ms would otherwise flicker.
- `<html lang="en">` matches the English copy. If the site is translated, change `lang` in
  the same commit (and add a Cyrillic font face for Macedonian).
- `text-muted` (`#5b6b7f`) is ~5.2:1 on cream — AA for body text.

---

## 7. Deployment

`npm run build` produces a static bundle in `dist/`; any static host works. Vercel is set up
and Git-driven — **`docs/DEPLOY_VERCEL.md`**.

**SPA fallback is mandatory.** Routing is client-side, so the host must serve `/index.html`
(status 200) for any path that is not a real file, or every deep link 404s on a hard load.
Both configs are committed: `vercel.json` (Vercel) and `public/_redirects` (Netlify,
Cloudflare Pages). Both also 301 `/book` → `/contact`. For other hosts: GitHub Pages — copy
`index.html` to `404.html`; Apache — `FallbackResource /index.html`; nginx —
`try_files $uri $uri/ /index.html;`.

### Post-deploy checklist

- [ ] Hard-load `/about`, `/our-work` and `/contact` directly — no 404.
- [ ] `/book` redirects to `/contact`.
- [ ] Every `tel:` link dials correctly on a real phone.
- [ ] Link preview shows the `og-cover.jpg` card (test in a preview debugger or WhatsApp).
- [ ] `robots.txt` and `sitemap.xml` carry the live domain.
