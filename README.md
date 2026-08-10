# JVD Dental Clinic — Marketing Site

Static marketing site for **JVD Dental Clinic**, Gostivar, North Macedonia. Two clinic
locations (`goce-delchev`, `gjinoski`), three practitioners, and online appointment booking
through an embedded Cal.com calendar.

Built as a Vite single-page application: React 19, react-router-dom 7, Tailwind CSS v4.

---

## 1. Quick start

Requires **Node.js 20 or newer** (Vite 6 drops support for Node 16 and 18).

```bash
node --version        # must be >= 20
npm install
npm run dev           # dev server on http://localhost:5173
```

All scripts:

```bash
npm run dev           # dev server with HMR
npm run build         # production build -> dist/
npm run preview       # serve the built dist/ locally to sanity-check it
npm run lint          # eslint . (flat config, ESLint 9)
```

Environment variables: `.env.production` is **committed** and holds the build-time flags that
every deployment depends on (`VITE_BOOKING_MODE`, `VITE_SITE_URL`). Copy `.env.example` to
`.env.local` for personal overrides — `.env.local` is gitignored and never reaches a build. Note that Vite **inlines** every
`VITE_`-prefixed variable into the client bundle — never put a secret in one.

---

## 2. Tech stack & why

| Layer | Choice | Notes |
| --- | --- | --- |
| Build tool | **Vite 6** | `vite.config.js`, target `es2020`, `cssCodeSplit: true` |
| UI | **React 19** | `react` + `react-dom` 19.1 |
| Routing | **react-router-dom 7** | `BrowserRouter` in `src/main.jsx` |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | CSS-first config, **no `tailwind.config.js`** |
| Components | none | no shadcn/ui, no MUI, no Radix — components are local JSX |
| Icons | none | every icon is an inline `<svg>` in the component that uses it |
| Fonts | self-hosted | `Inter var` from `/fonts/inter-var.woff2`, no Google Fonts request |
| Scheduling | Cal.com vanilla embed | loaded on demand by `src/hooks/useCalEmbed.js` |
| Linting | **ESLint 9** flat config | `eslint.config.js`: hooks correctness + Fast Refresh safety |

### Tailwind v4 is CSS-first

There is deliberately **no `tailwind.config.js` and no `postcss.config.js`**. Tailwind v4 is
wired in as a Vite plugin and configured entirely from CSS. All design tokens live in the
`@theme` block at the top of `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --color-brand-600: #1d7791;   /* becomes bg-brand-600, text-brand-600, ... */
  --color-ink:       #0f172a;
  --color-muted:     #64748b;
  --color-line:      #e2e8f0;
  --font-sans:       'Inter var', ui-sans-serif, system-ui, ...;
  --radius-card:     1.25rem;
}
```

Adding a token to `@theme` is what creates the corresponding utility class.

Reusable compositions — `container-page`, `btn`, `btn-primary`, `btn-ghost`, `card`,
`eyebrow` — are declared with Tailwind v4's **`@utility`** directive, not the v3-era
`@layer components`. This is deliberate: registered as real utilities they participate in
Tailwind's ordering, so an inline override still wins
(`className="btn-primary px-8 py-4"` correctly overrides the variant's own padding). A
consequence worth knowing before editing: `@apply` only accepts utilities, so the shared
button base is spelled out in full inside each `btn-*` variant rather than `@apply`-ing `btn`.
Change the base and you must change it in all three.

Change a brand colour in `@theme` and it propagates site-wide — including the SVG logo in
`Navbar.jsx`, which reads `fill="var(--color-brand-600)"` directly. Three places do **not**
track it automatically and must be updated by hand:

- `cssVarsPerTheme.light['cal-brand']` in `src/hooks/useCalEmbed.js`
- `<meta name="theme-color">` in `index.html`
- `theme_color` in `public/site.webmanifest`

All three currently hard-code `#1d7791`.

### The lightweight argument, concretely

The site is a brochure. It has no logged-in state, no database, and no server-rendered data.
Every byte of JavaScript shipped on first load is therefore a cost with no functional return,
so the build is structured to keep that number small:

1. **Route-level code splitting.** `src/App.jsx` statically imports only `Home`. `About`,
   `Work`, `Booking` and `NotFound` are `React.lazy()` chunks fetched on navigation. A visitor
   who lands on the homepage and calls the clinic instead of booking never downloads the other
   three pages.

2. **The Cal.com script loads only on `/book`.** `useCalEmbed.js` injects
   `https://app.cal.com/embed/embed.js` from inside a `useEffect`, and the hook is only
   imported by `Booking.jsx`, which is itself a lazy chunk. Nothing third-party is requested on
   the homepage. `index.html` only issues a `preconnect`/`dns-prefetch` hint to `app.cal.com` —
   a DNS+TLS warm-up that costs no JavaScript but makes the widget appear faster when the user
   does reach `/book`.

3. **Vendor split.** `vite.config.js` pins the framework into one long-lived `vendor` chunk.
   Note the implementation detail — it matches on the **resolved module path** with a function,
   not the more common string-array map:

   ```js
   manualChunks(id) {
     if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
       return 'vendor'
     }
   }
   ```

   A string map keyed on `'react-dom'` does not match `react-dom/client`, which is what
   `main.jsx` actually imports. That leaves the bulk of React in the app chunk, where its hash
   changes on every content edit and the cache is busted for returning visitors. `scheduler` is
   included because React depends on it. Do not "simplify" this back to a string map.

4. **No component or icon library.** A UI kit would add runtime and CSS for a handful of
   buttons and cards that are five Tailwind classes each. Icons are inline SVG paths — a
   6-icon set as inline paths costs a few hundred bytes, versus tens of kilobytes for an icon
   package plus its tree-shaking caveats.

5. **Self-hosted variable font.** One `woff2` from the same origin, `font-display: swap`. No
   `fonts.googleapis.com` round trip, no third-party cookie surface.

**Measured on the current build** (`npm run build`, gzipped):

| Chunk | Raw | Gzip | When it loads |
| --- | ---: | ---: | --- |
| `vendor` (React 19 + react-dom + router) | 231.7 kB | **74.0 kB** | first paint, cached across deploys |
| `index` (app shell + Home) | 16.5 kB | **6.0 kB** | first paint |
| `index.css` (whole site) | 37.5 kB | **6.8 kB** | first paint |
| `About` | 4.3 kB | 1.9 kB | on navigation |
| `Work` | 6.8 kB | 2.5 kB | on navigation |
| `Booking` | 8.9 kB | 3.3 kB | on navigation |
| `NotFound` | 0.8 kB | 0.4 kB | on navigation |

**First paint of `/` is ~87 kB gzipped total, of which 80 kB is JavaScript.** React 19
itself is 74 kB of that — the entire application, all four pages, is under 15 kB. The
Cal.com embed (~15 kB, third party) is not counted because it is fetched only when a
patient reaches `/book` and picks a doctor.

Budget rule: the app chunks are the ones to watch. Investigate any dependency that pushes
`index` past ~15 kB gzipped, and re-run the build before merging anything that adds a
runtime import.

### Why not Next.js

Next.js was considered and rejected. The reasoning:

- The site is **fully static**. There is no server-rendered data — every string on every page
  is a literal in `src/data/clinic.js` or in the page component.
- There is **no auth** and **no API routes**. Scheduling is delegated wholesale to Cal.com,
  which runs its own backend; the site never handles patient data itself.
- Given the above, Next.js's App Router, server components runtime and hydration machinery are
  overhead with nothing to do here. A Vite SPA ships less runtime for an identical user-facing
  result.

**The tradeoff:** no SSR and no per-route `<title>`/meta out of the box. `index.html` carries a
single set of title, description and Open Graph tags for the whole app. Crawlers that execute
JavaScript index the routes fine, but link previews for `/about` and `/our-work` show the
homepage copy.

**Mitigation, when it matters:** for a local dental clinic, the ranking signals that count are
Google Business Profile, reviews, and NAP consistency — not per-route Open Graph tags. If
per-route SEO does become critical, add a prerender step (`vite-plugin-prerender` or
`vite-plugin-ssg`) to emit real static HTML per route, which also removes the SPA-fallback
requirement in section 5. If the site grows into a content/blog surface, migrating to Astro is
the cleaner move — same static output, first-class per-page meta, and the React components
here port over largely unchanged as islands.

---

## 3. Project structure

Committed contents of the repository. `dist/` and `node_modules/` are build/install artifacts,
gitignored, and not listed.

```text
jvd-dental/
├── index.html                     # SPA shell: meta, OG tags, theme-color, favicon, manifest, cal.com preconnect
├── package.json                   # deps + dev/build/preview/lint scripts; type: module
├── package-lock.json              # locked dependency tree — commit changes to this
├── vite.config.js                 # react + tailwind plugins; es2020 target; vendor manualChunks split
├── eslint.config.js               # ESLint 9 flat config: react-hooks + react-refresh rules
├── vercel.json                    # Vercel: framework/build/output, SPA rewrite, asset cache + security headers
├── .env.example                   # documents every VITE_ variable; copy to .env.local for local overrides
├── .env.production                # COMMITTED build-time flags: VITE_BOOKING_MODE, VITE_SITE_URL
├── .gitignore                     # node_modules, dist, .env.local, editor and OS noise
├── README.md                      # this file
├── docs/
│   ├── BOOKING_SETUP.md           # operator guide for wiring Cal.com (or Calendly/Acuity)
│   ├── DEPLOY_VERCEL.md           # Git-driven deploy workflow, rollback, live-status caveats
│   └── ASSETS.md                  # spec for the images and font that are still missing
├── public/                        # copied verbatim into dist/ at build time
│   ├── _redirects                 # Netlify/Cloudflare SPA fallback: /* -> /index.html 200
│   ├── favicon.svg                # site icon, referenced from index.html
│   ├── site.webmanifest           # PWA manifest — linked from index.html via <link rel="manifest">
│   ├── robots.txt                 # allow-all + sitemap pointer (placeholder domain)
│   └── sitemap.xml                # the four real routes (placeholder domain)
└── src/
    ├── main.jsx                   # entry: createRoot + StrictMode + BrowserRouter, imports index.css
    ├── index.css                  # Tailwind v4 entry: @theme tokens, @font-face, base layer, @utility set
    ├── App.jsx                    # layout shell, ScrollToTop, Suspense boundary, all five routes
    ├── components/
    │   ├── Navbar.jsx             # sticky header, skip link, mobile drawer w/ scroll lock, inline logo SVG
    │   ├── Footer.jsx             # clinic/location/nav columns; exports the shared InstagramGlyph SVG
    │   ├── Section.jsx            # presentational wrapper: eyebrow + title + lead + children
    │   └── InstagramCard.jsx      # full-width Instagram CTA, lead element of the Our Work page
    ├── data/
    │   └── clinic.js              # single source of truth: CLINIC, LOCATIONS, DOCTORS, SERVICES, NAV
    ├── hooks/
    │   └── useCalEmbed.js         # loads cal.com embed.js once, mounts an inline calendar, tracks status
    └── pages/
        ├── Home.jsx               # "/" — hero, services grid, locations, CTA (only page in initial bundle)
        ├── About.jsx              # "/about" — mission, values, timeline, doctor cards (lazy)
        ├── Work.jsx               # "/our-work" — Instagram card + before/after case gallery (lazy)
        ├── Booking.jsx            # "/book" — 3-step location -> doctor -> calendar flow (lazy)
        └── NotFound.jsx           # "*" — 404 page (lazy)
```

Files intentionally absent, for the avoidance of doubt:

- `tailwind.config.js` — Tailwind v4 is configured from `@theme` in `src/index.css`.
- `postcss.config.js` — `@tailwindcss/vite` handles the pipeline.

### How the booking flow is wired

`src/pages/Booking.jsx` holds both selections in the URL via `useSearchParams`, so every
doctor-location combination is deep-linkable and shareable:

```text
/book?location=gjinoski&doctor=vleran-selimi
```

The resolution chain is `location + doctor -> DOCTORS[n].calLinks[locationId] -> "jvd-dental/vleran-selimi-gjinoski"`,
and that slug is handed to `useCalEmbed`. Consequences to preserve when editing:

- `Home.jsx` links to `/book?location=<id>` and `About.jsx` links to `/book?doctor=<id>`; both
  land on a partially-completed flow. Do not change the parameter names without updating both.
- The two selector lists filter each other. Picking a doctor narrows the location list to the
  ones where `calLinks[locationId]` is truthy, and vice versa. Choosing a location that an
  already-selected doctor does not cover clears the doctor rather than producing a dead end.
- `CalendarPanel` derives a Cal.com `namespace` of `${doctor.id}-${location.id}` and also uses
  it as the React `key`, so switching selection tears the old iframe down instead of stacking a
  second one.
- The container reserves `min-h-[640px]` before the iframe paints, which is what keeps the
  third-party embed from shifting the page.
- When `status === 'error'` the panel degrades to a direct `https://cal.com/{calLink}` link
  plus the clinic's phone number. Keep that fallback: ad blockers do block scheduling iframes.

### Adding a clinic or a practitioner

`LOCATIONS` and `DOCTORS` in `src/data/clinic.js` are open-ended. Every page derives its
layout and its copy from their length, so **adding an entry requires no changes anywhere
else** — no page edits, no grid classes, no hardcoded counts.

1. **New clinic** — append to `LOCATIONS`, then add its `id` to the `calLinks` of whoever
   works there. Practitioners who do not work there simply omit the key.
2. **New practitioner** — append to `DOCTORS` with a `calLinks` map, one key per location
   they consult at.
3. Create the matching Cal.com event types (`docs/BOOKING_SETUP.md`) and drop a 400 × 400
   WebP portrait at the `photo` path.

Copy-paste templates for both shapes are at the bottom of `clinic.js`.

Read the relationship through the three exported helpers rather than touching `calLinks`
directly — pages already do, so behaviour stays consistent as the lists grow:

```js
doctorsAtLocation(locationId)  // practitioners bookable at one clinic
locationsForDoctor(doctorId)   // clinics where one practitioner consults
calLinkFor(doctorId, locationId) // the Cal.com slug, or null
```

`validateClinicData()` runs automatically in dev and `console.warn`s on the failures that
are otherwise silent: a `calLinks` key that matches no location id (the person just never
appears in the picker), duplicate ids, a practitioner with nowhere bookable, and a clinic
with nobody assigned. It logs and never throws — a data typo must not white-screen
production.

Things that stay hardcoded on purpose and are worth a look when the counts change: the
`SERVICES` list, the About-page timeline, and the `Work.jsx` case gallery. None of them
derive from `clinic.js`.

---

## 4. Content you must replace before launch

Practitioner names, phone numbers and the two street addresses are **real and confirmed** and
already in the code. Everything else below is placeholder or missing.

### 4.1 Text and contact details — `src/data/clinic.js`

Names (`Dr. Jeton Selimi`, `Dr. Vleran Selimi`, `Dr. Donjet Selimi`), the per-practitioner and
per-location phone numbers, and both addresses (`Boulevard Goce Delchev 58, 1230 Gostivar` and
`Brakja Gjinoski 64, 1230 Gostivar`) are confirmed — leave them as they are. The eleven lines
still carrying a `TODO` in that file are what is outstanding:

- [ ] `CLINIC.email` — currently `info@jvddental.mk`, unconfirmed
- [ ] `LOCATIONS[*].hours` — both clinics carry the same guessed
      `Mon–Fri 09:00–19:00 · Sat 09:00–14:00`
- [ ] `DOCTORS[*].role` — all three read `Dentist`, a stand-in for each practitioner's
      confirmed specialty
- [ ] `DOCTORS[*].bio` — all three are empty strings. The pages render nothing rather than
      invent credentials for a named person; keep it that way until the clinic supplies copy.
- [ ] `SERVICES` — the six-item list is a plausible guess, not the clinic's own menu
- [ ] `DOCTORS[*].calLinks` — the Cal.com slugs, once the real event types exist (section 4.4)

Also verify, even though they are not marked TODO: `CLINIC.phone` (currently Dr. Vleran
Selimi's line rather than a dedicated reception number), `LOCATIONS[*].note`, and
`CLINIC.instagram` / `instagramHandle`.

Unverified claims that live outside `clinic.js`:

- [ ] `src/pages/About.jsx` — the `TIMELINE` array (2012 / 2016 / 2020 / 2024 milestones).
- [ ] `src/pages/Work.jsx` — the `CASES` array: four invented case studies with clinical
      descriptions and durations.

### 4.2 Images and fonts — none are committed

`docs/ASSETS.md` is the authoritative spec, with export rules and a full path table.
Summary of what is referenced by code and currently 404s:

| File to add at `public/…` | Referenced by | Dimensions |
| --- | --- | --- |
| `hero-clinic.webp` | `src/pages/Home.jsx` | 960 × 1200 (4:5) |
| `team/jeton-selimi.webp`, `team/vleran-selimi.webp`, `team/donjet-selimi.webp` | `src/data/clinic.js` → `About.jsx`, `Booking.jsx` | 400 × 400 (1:1) |
| `work/{veneers,implant,aligners,whitening}-before.webp` and `-after.webp` | `src/pages/Work.jsx` | 600 × 450 (4:3), 8 files |
| `og-cover.jpg` | `index.html` (`og:image`) | 1200 × 630, JPEG not WebP |
| `fonts/inter-var.woff2` | `src/index.css` `@font-face` | — |

Notes:

- The `width`/`height` attributes in the JSX must match the real intrinsic image size, or the
  browser reserves the wrong space and you reintroduce layout shift.
- Keep each before/after pair at identical dimensions; the grid places them side by side and
  mismatched ratios read as distortion rather than result.
- **Patient photography requires documented written consent.** `Work.jsx` already states on the
  page that consent was given — make that true before publishing, and keep the forms on file.
- `inter-var.woff2` must be subset to **latin + latin-ext**. All site copy, including both
  street addresses, is Latin script; add a Cyrillic subset only if the copy is translated to
  Macedonian.
- The font `<link rel="preload">` in `index.html` is currently **commented out** on purpose, so
  the missing file does not cost a failed request on every page load. Uncomment it when the
  woff2 lands — a preload materially improves the swap, and `@font-face` alone will not
  discover the font until the CSS is parsed.

### 4.3 Site metadata and SEO placeholders

- [ ] **`public/robots.txt`** — the `Sitemap:` line points at `https://jvddental.mk`, an
      unconfirmed domain. A sitemap declared on the wrong origin is ignored.
- [ ] **`public/sitemap.xml`** — all four `<loc>` entries use the same placeholder host.
- [ ] **`.env.example`** — `VITE_SITE_URL` carries the same unconfirmed domain.
- [ ] **`index.html` `og:image`** — currently the root-relative `/og-cover.jpg`. Most social
      scrapers require an absolute URL; change it to `https://<real-domain>/og-cover.jpg`.

Two items previously listed here are resolved: `index.html` now carries
`<link rel="manifest" href="/site.webmanifest" />`, so the manifest is actually read, and
`<html lang="en">` now matches the English interface copy (see the accessibility notes in
section 6).

### 4.4 Booking slugs

Every `calLinks` value in `src/data/clinic.js` is a guess at a URL that does not exist yet:
`jvd-dental/jeton-selimi-goce-delchev`, `jvd-dental/vleran-selimi-gjinoski`,
`jvd-dental/donjet-selimi-gjinoski`. Each practitioner works at exactly one location, so there
are three slugs, not six — every other combination is `null`. Create the matching Cal.com event
types first, then reconcile the strings. Full procedure in **`docs/BOOKING_SETUP.md`**.

### 4.5 Legal pages

There are none. A site that embeds a third-party scheduler and collects patient names, emails
and appointment reasons needs a privacy policy that names Cal.com as a processor. See the GDPR
section of `docs/BOOKING_SETUP.md`. North Macedonia's Law on Personal Data Protection is
harmonised with GDPR, and the clinic will have EU-resident patients regardless.

---

## 5. Deployment

`npm run build` produces a static bundle in `dist/`. There is no server component — any static
host works.

### 5.1 SPA fallback is mandatory

Routing is client-side (`BrowserRouter`). The build emits exactly one HTML file,
`dist/index.html`. A request straight to `https://yourdomain.mk/our-work` asks the host for a
file at that path, which does not exist.

**Without a rewrite rule, every deep link 404s** — including `/about`, `/our-work` and `/book`,
which are exactly the URLs you will put on business cards, in Instagram bios and in Google
Business Profile. Internal navigation works, so this failure is invisible in local testing and
easy to ship. Verify it by hard-loading a deep link on the deployed URL before announcing the
site.

The rule: **serve `/index.html` for any path that does not match a real file, with status 200**
(not 302, and not 404). React Router then reads the URL and renders the right page.

Both config files are already committed. Which one applies depends on the host.

### 5.2 Netlify

`public/_redirects` is committed and Vite copies `public/` verbatim into `dist/`, so this
already works:

```text
/*    /index.html   200
```

Set build command `npm run build` and publish directory `dist`. If you prefer config in the
repo root, the `netlify.toml` equivalent is:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 5.3 Vercel

`vercel.json` is committed at the repo root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

It uses `rewrites`, not `redirects` — a redirect would change the address bar and cost a round
trip. Vercel auto-detects Vite (build `npm run build`, output `dist`), so nothing else is
needed.

### 5.4 Cloudflare Pages

Framework preset **Vite**, build command `npm run build`, build output directory `dist`.

Cloudflare Pages honours the same `public/_redirects` file that Netlify uses, so the committed
one covers this host too. Cloudflare also applies an SPA fallback by default when no file
matches, but the explicit rule means the behaviour does not depend on a platform default.

If you add a `public/_headers` file, long-cache the fingerprinted assets and never cache the
shell:

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

### 5.5 Other hosts

- **GitHub Pages** has no rewrite engine. The standard workaround is to copy `index.html` to
  `404.html` in the publish step.
- **Apache**: `FallbackResource /index.html`.
- **nginx**: `location / { try_files $uri $uri/ /index.html; }`.

### 5.6 Post-deploy checklist

- [ ] Hard-load `/about`, `/our-work` and `/book` directly — no 404, no flash of the 404 page.
- [ ] `/book` renders the Cal.com calendar for a doctor-location pair, and a real test booking
      arrives in the right calendar with the correct clinic address on the invite.
- [ ] The `og:image` URL is absolute and previews correctly in a link-preview debugger.
- [ ] `robots.txt` and `sitemap.xml` carry the real domain; submit the sitemap to Search Console.
- [ ] HTTPS is enforced and `www` / apex resolve to one canonical host.
- [ ] `tel:` links dial correctly on a real phone.

---

## 6. Accessibility and performance notes

These behaviours are already implemented. Preserve them when editing.

### Accessibility

- **Skip link.** `Navbar.jsx` renders a visually hidden "Skip to content" link that becomes
  visible on focus (`sr-only focus:not-sr-only`) and targets `#main` on the `<main>` element in
  `App.jsx`. Keep the `id="main"` if you restructure the layout.
- **Focus-visible ring.** `src/index.css` sets a global `:focus-visible` outline in brand
  colour with an offset, so keyboard users get a consistent indicator without a persistent ring
  on mouse clicks. Do not add `outline: none` anywhere.
- **Mobile drawer.** The toggle carries `aria-expanded`, `aria-controls="mobile-menu"` and a
  state-dependent `aria-label`. Opening it locks `document.body` scroll; the effect cleanup
  restores it, so the lock cannot leak on unmount.
- **Booking selectors.** The location and doctor cards are real `<button>` elements with
  `aria-pressed` reflecting selection, and they are `disabled` until a location is chosen —
  so the step order is enforced for keyboard and screen-reader users, not just visually.
  The calendar container carries `aria-busy` while loading and `aria-live="polite"` so the
  arrival of availability is announced.
- **Landmarks and labels.** `<nav aria-label="Main">`, `<address>` for postal addresses, `<dl>`
  for the hero stats, `<ol>` for the chronological timeline and for the booking steps.
  Decorative SVGs and blur blobs are `aria-hidden="true"`; meaningful links get an explicit
  `aria-label` (the logo, the Instagram card). Doctor thumbnails inside the booking selector
  use `alt=""` because the adjacent text already names the doctor.
- **Route loading state.** The Suspense fallback spinner in `App.jsx` has `role="status"` and
  `aria-label="Loading"`, so screen readers announce navigation between lazy routes.
- **Language.** `<html lang="en">` in `index.html`, which matches the English interface copy —
  including both street addresses, which are written in Latin script. A mismatch would make
  screen readers pronounce the whole site with the wrong phonetics, so if the copy is ever
  translated to Macedonian, change `lang` in the same commit and keep the two in agreement.
- **Colour contrast.** `text-muted` (`#64748b`) on white is about 4.8:1 — it passes AA for body
  text but not AAA, and it fails at small sizes on tinted backgrounds. Re-check contrast if you
  darken any surface behind muted text.

### Performance

- **`prefers-reduced-motion`.** `src/index.css` clamps all animation and transition durations
  to `0.01ms` and disables smooth scrolling under that media query. Any new animation inherits
  this automatically because the rule uses a universal selector — do not add motion via inline
  styles or JS timelines that bypass CSS.
- **Explicit `width` and `height` on every `<img>`.** Present on the hero (960×1200), doctor
  portraits (400×400), booking thumbnails (88×88) and all case images (600×450). Combined with
  the `aspect-[…]` utility, the browser reserves the correct box before the image arrives,
  which keeps Cumulative Layout Shift at zero. **Never add an `<img>` without both attributes.**
- **Loading priority.** The hero image is `loading="eager"` with `fetchPriority="high"` — it is
  the Largest Contentful Paint element and must not be deferred. Everything below the fold
  (doctor portraits, booking thumbnails, all eight case photos) is `loading="lazy"`. All images
  use `decoding="async"`.
- **Reserved space for the third-party iframe.** The Cal.com container is `min-h-[640px]`, so
  the embed cannot shift content when it paints. This is the single largest CLS risk on the
  site — do not remove the minimum height.
- **Placeholder background.** Every image carries `bg-brand-100`, so a slow or missing image
  shows a brand-tinted block rather than a white hole.
- **Font loading.** `font-display: swap` means text is readable in the fallback face
  immediately and swaps without blocking render. Re-enable the commented-out
  `<link rel="preload">` in `index.html` once the woff2 exists, and keep it pointing at the same
  URL as the `@font-face` `src`, or the font is fetched twice.
- **Third-party isolation.** The only third-party runtime is the Cal.com embed, and it is
  confined to the `/book` chunk. Do not import `useCalEmbed` from a component the homepage
  reaches — that would pull `embed.js` onto every page load and undo the split.
- **`scroll-behavior: smooth`** is global, with `ScrollToTop` in `App.jsx` resetting scroll
  position on every route change so lazy pages do not open mid-page.
