# Deploying the demo to Vercel

Two routes. Pick one.

- **Route A — CLI.** Fastest. One command, a preview URL in about a minute. No Git required.
- **Route B — Git integration.** Slower to set up, but every push redeploys and each branch
  gets its own preview URL. Use this once the client starts asking for changes.

Everything below assumes the project root is `jvd-dental/`, **not** the parent folder. The
`vercel.json` that configures the build lives inside `jvd-dental/`.

---

## Route A — Vercel CLI

### 1. Log in

The CLI opens a browser and authenticates against your own Vercel account. Run it yourself:

```bash
npx vercel login
```

Pick "Continue with GitHub" (or email). Nothing else in this guide works until this
succeeds — `npx vercel whoami` should print your username afterwards.

### 2. Deploy a preview

From inside `jvd-dental/`:

```bash
npx vercel
```

First run asks a short series of questions. The answers that matter:

| Prompt | Answer |
| --- | --- |
| Set up and deploy? | `y` |
| Which scope? | your personal account |
| Link to existing project? | `n` |
| Project name | `jvd-dental` |
| In which directory is your code located? | `./` |
| Want to modify settings? | `n` — `vercel.json` already sets framework, build command and output dir |

It prints a URL like `https://jvd-dental-abc123.vercel.app`. That is your demo link. It is
public to anyone with the URL, and it is not indexed by search engines unless you promote it
to production.

### 3. Promote to a stable URL

Preview URLs change on every deploy. For a link you can send once and keep sending:

```bash
npx vercel --prod
```

That publishes to `https://jvd-dental.vercel.app` (or whatever project name you chose), and
the URL stays put across redeploys.

### 4. Redeploy after changes

```bash
npm run build     # optional, catches errors locally first
npx vercel --prod
```

---

## Route B — Git integration

1. Create a Git repository. The parent folder is not a repo yet, so from `JVD_Claude/`:

   ```bash
   git init -b main
   git add .
   git commit -m "feat: JVD Dental Clinic marketing site"
   ```

2. Create an empty repo on GitHub and push to it.

3. In the Vercel dashboard: **Add New → Project → Import** the repo.

4. **Critical setting.** The Vite app is in a subfolder, so set:

   - **Root Directory** → `jvd-dental`
   - Framework Preset → Vite (auto-detected once the root directory is right)
   - Build Command → `npm run build` (default)
   - Output Directory → `dist` (default)

   Getting Root Directory wrong is the single most common failure here — the build errors with
   "No package.json found" or deploys an empty site.

5. Deploy. Every push to `main` redeploys production; every other branch gets a preview URL.

---

## Before you send the link to a client

The site builds and runs, but three things will be visibly unfinished on a live demo. None
block deployment — decide which ones you want to fix first.

### 1. Every image 404s

No photography is committed. Hero, team portraits and the whole before/after gallery render
as flat blue rectangles with the alt text showing. See `docs/ASSETS.md` for the exact
paths and dimensions. This is the most obvious gap on a first look.

### 2. The booking calendar shows its error state

The Cal.com event types in `src/data/clinic.js` do not exist yet, so `/book` reaches step 3,
fails to load the iframe, and falls back to "The calendar could not load." The selection flow
itself (location, then doctor) demos correctly.

To make the calendar live for the demo, create a free Cal.com account and three event types as
described in `docs/BOOKING_SETUP.md`, then update `calLinks`. A single throwaway event type
pointed at all three entries is enough to show the flow working end to end.

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
