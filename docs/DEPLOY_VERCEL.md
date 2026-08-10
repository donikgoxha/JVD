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
- `.env.production` — build-time `VITE_` flags (`VITE_BOOKING_MODE`, `VITE_SITE_URL`)
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

## Live status

The site is public and indexable. `public/robots.txt` allows all crawlers and points at
`sitemap.xml`.

**Booking is by phone.** `.env.production` sets `VITE_BOOKING_MODE=phone`, so `/book` resolves
the patient's clinic + dentist choice to the right direct number instead of showing a
calendar. This is correct while no Cal.com account exists — a live medical site must never
display availability it cannot honour. Switching to the real embed is one commit: create the
three event types (`docs/BOOKING_SETUP.md`), then set `VITE_BOOKING_MODE=cal`.

Never deploy `VITE_BOOKING_MODE=demo` publicly. Patients cannot tell a demo calendar from a
real one, and a booking that reaches nobody is a missed appointment.

### What is real on the live site

Confirmed: practitioner names, all phone numbers, both street addresses, the Instagram link.

Not yet supplied, and therefore **not published** rather than guessed:

- **Opening hours** — `LOCATIONS[*].hours` is `null`. Every surface omits the line and shows a
  phone number instead, and `openingHours` is left out of the structured data.
- **Email** — `CLINIC.email` is `null`; the footer link disappears. A published address that
  bounces is worse than none.
- **Practitioner specialties and bios** — all three read `Dentist` with empty bios.
- **The case gallery** — four invented before/after studies, each captioned as a real patient
  with written consent, were deleted. Restoring one needs photographs, a treatment
  description, and consent on file.
- **Clinic history** — the invented timeline was deleted.

Still unverified but published, and the first thing to confirm: the six-item `SERVICES` list
in `src/data/clinic.js`. Standard for a general practice, but nobody has confirmed JVD offers
implants or orthodontics.

### Images

No photography is committed. `src/components/Img.jsx` draws a hatched brand placeholder and
fades a real photo in over it once one exists, so nothing renders broken. Paths and
dimensions: `docs/ASSETS.md`.

---

## Custom domain

Once the client approves and supplies a domain: Vercel dashboard → Project → Settings →
Domains → Add. Vercel prints the DNS records to set at the registrar and issues the TLS
certificate automatically.

Pointing a real domain at the site means changing the origin in **three files, one commit**:

- `VITE_SITE_URL` in `.env.production` — drives the canonical tag, `og:url` and the JSON-LD
- the `Sitemap:` line in `public/robots.txt`
- every `<loc>` in `public/sitemap.xml`

A canonical tag pointing at the old origin is the classic way to make a new domain invisible
to search.
