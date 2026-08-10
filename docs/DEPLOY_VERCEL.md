# Deploying to Vercel

**Deployments come from Git. Do not deploy from the CLI.**

The Vercel project `jvd-dental` is connected to `github.com/donikgoxha/JVD`. Pushing is the
only step — Vercel builds the commit and publishes it. Nothing about a deployment should
exist outside the repository.

---

## The workflow

```bash
git add -A
git commit -m "fix: whatever changed"
git push
```

That is the whole thing.

| Branch | Result |
| --- | --- |
| `main` | production — `https://jvd-dental.vercel.app` |
| any other branch | its own preview URL, `noindex` by default |
| pull request | preview URL commented on the PR |

Check the build at <https://vercel.com/donikgoxha/jvd-dental>. A failed build leaves the
previous deployment serving, so a broken push never takes the site down.

Catch errors before pushing:

```bash
npm run lint && npm run build
```

### Project settings (already correct — listed so a change is deliberate)

| Setting | Value | Why |
| --- | --- | --- |
| Root Directory | `.` | the repo root **is** the Vite app; there is no subfolder |
| Framework Preset | Vite | auto-detected |
| Build Command | `npm run build` | also pinned in `vercel.json` |
| Output Directory | `dist` | also pinned in `vercel.json` |
| Production Branch | `main` | |

### Configuration lives in the repo, not the dashboard

Anything that changes how the site builds is a committed file, so a deployment is fully
reproducible from its commit:

- `vercel.json` — framework, build command, output dir, SPA rewrite, cache and security headers
- `.env.production` — build-time `VITE_` flags (currently `VITE_DEMO_BOOKING=1`)
- `public/robots.txt` — indexing policy

Adding a `VITE_` variable in the Vercel dashboard instead would make the dashboard and the
repo disagree, and the next person reading the code would have no way to know. Keep them in
`.env.production`. Real secrets are the exception — those go in the dashboard as **non-**`VITE_`
variables, because anything `VITE_`-prefixed is inlined into the public bundle.

---

## Rolling back

Do not hand-edit and re-push under pressure. Either:

- **Vercel dashboard → Deployments → an older one → Promote to Production.** Instant, and it
  does not touch Git.
- Or `git revert <sha> && git push`, which keeps Git and the live site in agreement. Prefer
  this once the fire is out.

---

## About the CLI

`npx vercel --prod` still works and will happily publish whatever is in your working
directory — uncommitted edits included. That is exactly the failure mode this setup avoids:
a live site that no commit can reproduce. Vercel has no switch to disable it, so the rule is
a convention. Do not use it.

The CLI is still useful read-only:

```bash
npx vercel project inspect jvd-dental   # confirm settings
npx vercel list jvd-dental              # recent deployments and their source
npx vercel logs <deployment-url>        # build/runtime logs
```

---

## Before you send the link to a client

The site builds and runs, but three things will be visibly unfinished on a live demo. None
block deployment — decide which ones you want to fix first.

### 1. Images — handled

No photography is committed, but nothing renders broken. `src/components/Img.jsx` catches the
404 and swaps in a hatched, brand-tinted placeholder with a tooth or portrait glyph, sized to
the exact same box. The layout reads as deliberate rather than broken.

Drop the real files in and the component becomes a no-op — no code change needed. Paths and
dimensions are in `docs/ASSETS.md`.

### 2. Booking calendar — handled by demo mode

The Cal.com event types in `src/data/clinic.js` do not exist yet, so an unmodified build shows
"The calendar could not load." on step 3.

`.env.production` currently carries `VITE_DEMO_BOOKING=1`, so step 3 renders
`src/components/DemoCalendar.jsx` instead: a working month grid, sample time slots, and a
confirmation step — under an amber **"Demo mode — sample availability. No appointment is
created."** banner.

It is deliberately not pointed at a third party. The two well-known public Cal.com links are
a joke calendar and Cal.com's own sales calendar; either would route real bookings into a
stranger's inbox.

Once you have a real Cal.com account, one throwaway event type demos the genuine embed for
every doctor/location pair. Edit `.env.production`:

```dotenv
VITE_CAL_DEMO_LINK=yourname/consultation
```

`VITE_CAL_DEMO_LINK` outranks `VITE_DEMO_BOOKING`. With **neither** line present the site
uses the real per-combination slugs from `src/data/clinic.js` — that is the production
configuration, and deleting both lines is the commit that ships it.

### 3. Some copy is invented

Written as placeholder, still reading as fact:

- `Work.jsx` — the four case studies, including the line about patient consent
- `About.jsx` — the history timeline and the four values cards (written estimates,
  sterilisation logging)
- `SERVICES` and both clinics' opening hours in `clinic.js`

Fine for a layout demo. Not fine to leave on a public production domain. Everything is marked
`TODO` in the source; `README.md` section 4 is the full checklist.

---

## Custom domain

Once the client approves and supplies a domain: Vercel dashboard → Project → Settings →
Domains → Add. Vercel prints the DNS records to set at the registrar and issues the TLS
certificate automatically.

If you point a real domain at the site, update the placeholder origin `https://jvddental.mk`
in `public/sitemap.xml`, `public/robots.txt` and `.env.example`.
