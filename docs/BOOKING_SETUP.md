# Booking Setup — Wiring the Real Scheduling Backend

Operator guide for connecting the JVD Dental Clinic site to a live scheduling system.

The site ships with placeholder booking links. Until the steps below are completed, the `/book`
page points at Cal.com URLs that do not exist. This document is written to be followed by
whoever administers the clinic's calendars — it does not assume you will edit code, except for
one file at the end (`src/data/clinic.js`).

The site code is ready: `src/pages/Booking.jsx` already renders the three-step
location → doctor → calendar flow and mounts the embed. The only thing missing is the Cal.com
side — the event types the site links to do not exist yet. Sections 1–2 create them; section
2.4 is the one code change required, and it is a data edit, not a logic change.

---

## 1. Why Cal.com

Cal.com is the recommended provider for this clinic specifically:

1. **Self-hostable.** Cal.com is AGPL-licensed and can be run on the clinic's own
   infrastructure. For a healthcare practice this matters: it converts patient appointment data
   from a transfer to a third-party processor into data that never leaves systems the clinic
   controls. You can start on the hosted plan and move later without changing the embed code —
   only the `origin` and script URL change.

2. **The free tier covers what this site needs.** Individual accounts get unlimited event
   types, so the three doctor-location combinations cost nothing. Note the constraint below:
   **Teams are a paid feature.** See section 2.0 for the two ways to handle that.

3. **A genuinely small embed.** The official vanilla loader at
   `https://app.cal.com/embed/embed.js` is roughly 15 kB gzipped and is fetched only when a
   visitor opens `/book`. Nothing third-party loads on the homepage. Compare this with
   scheduling widgets that inject a full framework runtime on every page.

4. **Teams with per-member event types.** A Cal.com Team gives each dentist their own
   availability and their own event types under one shared organisation URL — which is exactly
   the shape of `jvd-dental/<doctor>-<location>` that the site's data model already assumes.

5. **Location is a first-class field.** Cal.com models "Location" as a property of the event
   type, and **In Person** takes a real street address. That address is then printed on the
   confirmation email and written into the calendar invite (`.ics` `LOCATION` field), so the
   patient's phone shows the right clinic — and their maps app can route to it. For a practice
   with two addresses in one city, this single feature removes the most common and most costly
   booking error: the patient arriving at the wrong building.

---

## 2. Cal.com setup, step by step

### 2.0 Decide: Team plan or individual accounts

The site's URLs are shaped `jvd-dental/jeton-selimi-goce-delchev` — an organisation handle
followed by an event slug. There are two ways to produce them:

- **Cal.com Teams (paid, per seat).** Gives you the `cal.com/jvd-dental/...` namespace, shared
  admin, and central visibility of all doctors' calendars. This is the intended setup and what
  the rest of this guide assumes.
- **One free individual account per doctor.** Then the URLs become
  `cal.com/jvd-jeton-selimi/goce-delchev`, `cal.com/jvd-vleran-selimi/gjinoski`, and so on.
  This works and costs nothing, but the clinic has no central admin view and each dentist
  controls their own account. If you choose this, the `calLinks` values in
  `src/data/clinic.js` must be rewritten to match — the code does not care about the shape of
  the string, it just passes it through.

Decide this first, because it determines every slug that follows.

### 2.1 Create the organisation

1. Sign up at [cal.com](https://cal.com) with a clinic-owned email address — not a personal
   one. Use a shared mailbox such as the address in `CLINIC.email` so access survives staff
   changes.
2. Create a Team with the URL handle **`jvd-dental`**. This handle is the first segment of
   every booking URL and must match the `calLinks` prefix in `src/data/clinic.js`.
3. Set the team's timezone to **Europe/Skopje**. Verify it — a wrong team timezone silently
   shifts every published slot.
4. Enable two-factor authentication on the owner account. It holds the clinic's full
   appointment book.

### 2.2 Add each dentist as a team member

1. Team → Members → Invite. Invite all three practitioners by email.
2. Each dentist accepts and sets their **own availability schedule**. Do not fill these in
   centrally on their behalf; the schedule is what prevents double-booking, and it needs to be
   maintained by the person who knows their own shifts.
3. Each dentist connects their real working calendar (Google Calendar, Outlook/Office 365, or
   CalDAV) under **Calendars**. This is what gives Cal.com conflict detection: an existing
   personal appointment blocks the slot automatically.
4. Confirm each member's personal timezone is Europe/Skopje.

### 2.3 Create one event type per doctor per location

This is the core of the setup. Create **three** event types — one for each doctor-location pair
that exists in `src/data/clinic.js`. Each practitioner consults at exactly one location, so
there are three, not six.

| Event type slug | Doctor | Location | Full booking URL |
| --- | --- | --- | --- |
| `jeton-selimi-goce-delchev` | Dr. Jeton Selimi | JVD Goce Delchev | `cal.com/jvd-dental/jeton-selimi-goce-delchev` |
| `vleran-selimi-gjinoski` | Dr. Vleran Selimi | JVD Brakja Gjinoski | `cal.com/jvd-dental/vleran-selimi-gjinoski` |
| `donjet-selimi-gjinoski` | Dr. Donjet Selimi | JVD Brakja Gjinoski | `cal.com/jvd-dental/donjet-selimi-gjinoski` |

**The slug must match the `calLinks` map in `src/data/clinic.js` exactly** — lowercase, hyphen
separated, no trailing characters. A single mismatch produces a "not found" panel inside the
embed on the live site, with no other error.

For **each** of the three event types:

1. **Create it** as a team event type, assigned to that one dentist (assignment type:
   individual host, not round-robin — the patient is choosing a specific person).
2. **Title**: something the patient will recognise on their confirmation email, e.g.
   `Consultation — Dr. Vleran Selimi, JVD Brakja Gjinoski`. Include the location in the title;
   patients read the title far more often than the location field.
3. **Set Location = "In Person"** and enter that clinic's full street address — the one that
   belongs to this event type, matching `LOCATIONS[*].address` in `src/data/clinic.js`:
   - JVD Goce Delchev: `Boulevard Goce Delchev 58, 1230 Gostivar`
   - JVD Brakja Gjinoski: `Brakja Gjinoski 64, 1230 Gostivar`

   Type the complete address including city and postal code. Cal.com copies this string
   verbatim into the confirmation email and the calendar invite's `LOCATION` field, which is
   what puts the right clinic on the patient's phone. Do not write "Goce Delchev" or "our main
   clinic" — write the address a maps app can resolve.

4. **Duration.** Set per event type, not globally. Suggested starting points, to be adjusted by
   the clinic: general consultation 30 min, orthodontic consultation 45 min, implant/surgical
   consultation 60 min.

5. **Buffers.** Under Limits, set a buffer *after* the event for room turnaround and
   sterilisation — 10–15 minutes is typical. Add a *before* buffer only if the dentist needs
   preparation time. Buffers are the difference between a calendar that looks full and a clinic
   that runs on time.

6. **Minimum notice.** Set at least 12–24 hours. Without it, a patient can book a slot starting
   in five minutes and nobody sees it. Also set a maximum booking horizon (e.g. 60 days) so the
   calendar does not accept bookings a year out.

7. **Availability — the double-booking safeguard.** This is the step that makes the two-clinic
   model work. For each event type, select the availability schedule that covers **only the
   hours that practitioner works at that location**.

   As the rota stands, each of the three works at a single address, so one named schedule per
   person is enough — `vleran-selimi-gjinoski` uses Dr. Vleran's own schedule, and there is no
   second event type of his to keep disjoint from it. Create the schedules under each
   practitioner's Availability tab and assign the right one to their event type.

   > **Critical, the moment that changes.** If one practitioner starts consulting at both
   > clinics, they need two named schedules (e.g. "Vleran — Goce Delchev", "Vleran —
   > Gjinoski") and **the two must not overlap in time.** If they do, Cal.com will happily
   > offer the same Tuesday 10:00 slot on both event types and the dentist will be booked at
   > two addresses simultaneously. Cal.com's conflict detection works through
   > the connected calendar, so once a booking exists it blocks the other event type — but
   > non-overlapping schedules are the guarantee that does not depend on calendar sync latency.
   > Review these schedules whenever a dentist's rota changes.

8. **Booking questions.** Name and email are collected by default. Add:
   - "Reason for visit" — long text, optional
   - "Is this your first visit to JVD?" — yes/no radio
   - Phone number — required, so the clinic can reach the patient about a change

   Do **not** add fields for medical history, medication, or any health condition. That is
   special-category data under GDPR; collect it in the surgery, on paper or in the practice
   management system, not through a public web form.

9. **Confirmation and reminders.** Under Workflows, enable an email reminder 24 hours before
   the appointment and, if the plan allows, an SMS reminder 2 hours before. No-show rate is the
   single metric this setup improves most.

10. **Test it.** Open the public URL in a private browser window and book a real slot. Confirm:
    the slot disappears from availability, the invite lands in the dentist's connected calendar,
    and **the confirmation email shows the correct street address for that clinic.**

### 2.4 Reconcile the code

Once all three event types exist and are tested, open `src/data/clinic.js` and make each
`calLinks` value match the real URL path:

```js
export const DOCTORS = [
  {
    id: 'jeton-selimi',
    // ...
    calLinks: {
      'goce-delchev': 'jvd-dental/jeton-selimi-goce-delchev',
      gjinoski: null,                       // null = not offered; the UI hides this option
    },
  },
  // ...
]
```

Rules the site's code relies on:

- The value is the **path after `cal.com/`** — no protocol, no domain, no leading slash.
- `null` means "this doctor does not consult at this location". `About.jsx` filters on it
  (`LOCATIONS.filter((l) => doc.calLinks[l.id])`) to render the "Consults at:" line, and the
  Booking page must use the same check to hide unavailable combinations. Do not use an empty
  string — use `null`.
- The keys must be the location `id` values from `LOCATIONS`: `goce-delchev` and `gjinoski`.
  If you add a third clinic, add it to `LOCATIONS` **and** add the key to every doctor's
  `calLinks`, with `null` for those who do not work there.

---

## 3. Why one event type per doctor-location, not Routing Forms

Cal.com offers **Routing Forms**: the patient answers questions ("which doctor?", "which
clinic?") and the form routes them to the right calendar. That is not what this site does, and
the difference is deliberate.

**Reasons for the flat one-event-type-per-combination model:**

1. **Deterministic URL per combination.** Every doctor-location pair has its own stable,
   permanent address. The site resolves the patient's choice to a slug locally and mounts that
   calendar directly.

2. **Deep-linkable.** `Home.jsx` links to `/book?location=goce-delchev` and `About.jsx` links to
   `/book?doctor=jeton-selimi`. Those parameters preselect the calendar. The same property lets
   the clinic put a direct booking link for one specific dentist at one specific clinic into an
   Instagram bio, a Google Business Profile, an SMS, or a printed QR code.

3. **No extra round trip.** A routing form is an additional page the patient loads and submits
   *before* the calendar appears. Here the selection UI is the site's own React — instant, no
   network — and only the final calendar is fetched. Each removed step measurably reduces
   abandonment on a booking flow.

4. **The location is baked in.** Because the address lives on the event type, it is impossible
   for a patient to reach a calendar and end up with the wrong address on the invite. With
   routing, the address is a consequence of the routing logic being correct.

5. **Independent configuration.** Duration, buffers and availability differ per location and
   per dentist. Separate event types express that directly.

**When to switch to Routing Forms:** the flat model is at most n_doctors × n_locations event
types, and here it is only **three** — each practitioner works at exactly one address, so the
matrix is not even full. At three combinations the case for Routing Forms is weaker still than
the paragraphs above already make it: the form would cost a page load and a submission to reach
one of three fixed calendars a patient can otherwise pick in two clicks with no network at all.
If JVD grows to, say, six dentists across three clinics, that is
eighteen event types to keep in sync, and Routing Forms — or Cal.com's Attribute-based routing
on a Teams/Organizations plan — becomes the better tool: one form, routed by answers to
attributes, with the doctor-location matrix maintained in one place instead of eighteen. The
tradeoff is losing the deep-linkable per-combination URLs, so keep direct links for the
highest-traffic combinations even after switching.

---

## 4. How the embed works in this codebase

### 4.1 Vanilla loader, not the npm package

The site uses the official **vanilla** loader script, injected at runtime by
`src/hooks/useCalEmbed.js`:

```js
const EMBED_SCRIPT = 'https://app.cal.com/embed/embed.js'
```

It does **not** use the `@calcom/embed-react` npm package. The reason: `embed-react` is a React
wrapper around the identical `embed.js` script — it still loads the same third-party file at
runtime, but adds its own package to the bundle first. The behaviour is the same; the bytes are
not. Since the hook needed to exist anyway (to manage mount/unmount, container clearing on
selection change, and the loading/error state), wrapping the vanilla loader directly gives the
same result for less shipped JavaScript.

The consequence for the build: **nothing Cal.com-related exists in the bundle at all.** The
script is fetched from `app.cal.com` only when the effect in `useCalEmbed` runs, which only
happens on `/book`, which is itself a lazy chunk.

### 4.2 What the hook does

`useCalEmbed({ calLink, namespace, config, enabled })` returns `{ containerRef, status }`.

- **`loadCalOnce()`** is the official Cal.com loader snippet transcribed into a module. It
  defines `window.Cal` as a queueing stub and appends the `<script>` tag exactly once. Any
  `Cal(...)` call made before the script finishes downloading is queued and replayed after —
  so the hook can issue its `init`/`inline`/`ui` calls immediately without waiting.
- **`namespace`** must be unique per calendar instance. Cal.com keeps per-namespace state in
  `Cal.ns[namespace]`; reusing a namespace across two mounted calendars makes them fight.
- **Container clearing.** Cal renders an iframe *into* the container and does not replace a
  previous one. The hook sets `el.innerHTML = ''` before mounting and again on cleanup, so
  switching doctor or location swaps the calendar instead of stacking iframes.
- **Status.** `idle → loading → ready | error`. `ready` is driven by Cal's `linkReady` event,
  `error` by `linkFailed`, plus a **12-second timeout** as a safety net so a blocked or slow
  third-party script degrades to a visible fallback rather than an infinite spinner.

  `Booking.jsx` uses this to degrade gracefully: on `error` it replaces the calendar with a
  direct `https://cal.com/{calLink}` link and the clinic's phone number. Ad blockers and strict
  corporate networks do block scheduling iframes, and a patient who cannot book on the site must
  still be given a working route to an appointment. Keep that fallback.

- **Cleanup.** The effect removes both event listeners and clears the container on unmount.

### 4.3 Plain HTML/JS equivalent, for reference

If you ever need the calendar outside this React app — on a landing page, in a WordPress block,
in an email-linked microsite — this is the same embed without React:

```html
<!-- The container the calendar renders into -->
<div id="my-cal-inline" style="width:100%;height:100%;overflow:scroll"></div>

<script type="text/javascript">
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar) };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true }
      if (ar[0] === L) {
        const api = function () { p(api, arguments) };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]) }
        else p(cal, ar);
        return
      }
      p(cal, ar)
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", "vleran-selimi-gjinoski", { origin: "https://app.cal.com" });

  Cal.ns["vleran-selimi-gjinoski"]("inline", {
    elementOrSelector: "#my-cal-inline",
    calLink: "jvd-dental/vleran-selimi-gjinoski",
    layout: "month_view",
    config: { layout: "month_view" }
  });

  Cal.ns["vleran-selimi-gjinoski"]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: {
      light: { "cal-brand": "#1d7791" }
    }
  });
</script>
```

If you self-host Cal.com, change **both** the script URL and the `origin` value to your own
domain (e.g. `https://cal.jvddental.mk`).

---

## 5. Prefill and configuration parameters

Anything passed as `config` to `useCalEmbed` is forwarded to Cal.com and prefills the booking
form. Use this to reduce the number of fields a patient has to type.

**What the site sends today.** `CalendarPanel` in `src/pages/Booking.jsx` passes only layout
and attribution — no personal data, because the site never collects any before handing off:

```js
const { containerRef, status } = useCalEmbed({
  calLink,
  namespace: `${doctor.id}-${location.id}`,
  config: {
    layout: 'month_view',
    metadata: { locationId: location.id, locationName: location.name, doctorId: doctor.id },
  },
})
```

That `metadata` is the useful part for the front desk: it lands on the booking record and in
the webhook payload, so an integration can tell which physical clinic a booking belongs to
without parsing the event type slug.

**The full set of available parameters**, should you later prefill from a form:

```js
config: {
  name: 'Ardit Krasniqi',
  email: 'patient@example.com',
  notes: 'Returning patient — upper left molar sensitivity',
  guests: ['parent@example.com'],
  metadata: { source: 'website', locationId: 'gjinoski', doctorId: 'vleran-selimi' },
}
```

| Parameter | Type | Effect |
| --- | --- | --- |
| `name` | string | Prefills the attendee name field |
| `email` | string | Prefills the attendee email field |
| `notes` | string | Prefills "Additional notes" — good place for the reason for visit |
| `guests` | string[] | Adds CC'd attendees; useful for a parent booking for a child |
| `metadata` | object | Arbitrary key-value data stored on the booking and delivered in webhooks. **Not shown to the patient.** Use it for attribution: which page the booking came from, which location card was clicked. |
| `theme` | `'light' \| 'dark' \| 'auto'` | Forces the embed colour scheme |
| `layout` | `'month_view' \| 'week_view' \| 'column_view'` | Calendar layout; this site uses `month_view` |

Any custom booking question you added in section 2.3 step 8 can also be prefilled by using its
identifier as a key.

**Two rules for prefill on this site:**

1. **`metadata` is for attribution, never for clinical or personal detail.** It is stored on the
   Cal.com booking and forwarded to any configured webhook. Keep it to non-personal strings
   like `source`, `location`, `doctor`.
2. **Never read prefill values out of the URL and pass them straight through.** `Booking.jsx`
   reads `?doctor=` and `?location=` — those are safe because they are matched against the
   known `DOCTORS` and `LOCATIONS` ids and used only to select a calendar. Do not extend this
   to accept `?email=` or `?name=` from the query string; that turns the booking page into a
   vector for prefilling someone else's details, and puts personal data in URLs and server
   logs. Prefill only from data the user typed into the page in the current session.

### Branding

Colour and theme are set through the `ui` call, in `useCalEmbed.js`:

```js
Cal.ns[namespace]('ui', {
  hideEventTypeDetails: false,
  layout: 'month_view',
  cssVarsPerTheme: {
    light: {
      'cal-brand': '#1d7791',        // must match --color-brand-600 in src/index.css
      'cal-bg': '#ffffff',
      'cal-border-booker': '#e2e8f0', // matches --color-line
    },
  },
})
```

`cssVarsPerTheme` takes `light` and/or `dark` keys. Only `light` is set here, because the site
has no dark mode. **If you change the brand colour in `src/index.css`, change `cal-brand`
too** — they are not linked, and a mismatch is immediately visible as a differently coloured
button inside the calendar.

`hideEventTypeDetails: false` keeps the duration and location panel visible inside the embed.
Leave it false: that panel is where the patient sees the clinic address before confirming, and
it is the last chance to catch a wrong-location booking.

---

## 6. GDPR and privacy

The Cal.com embed is a **third-party iframe that sets cookies** and transmits the patient's
name, email, and whatever they type into the notes field to Cal.com's servers. That makes
Cal.com a data processor for the clinic. North Macedonia's Law on Personal Data Protection is
harmonised with the GDPR, and the clinic will in practice have EU-resident patients, so treat
the GDPR standard as the baseline.

What the clinic must do:

1. **Name Cal.com in the privacy policy.** The policy must state that booking is handled by
   Cal.com, what data is transmitted (name, email, phone, notes, appointment time), that the
   embed sets cookies, and where the data is processed. Link to Cal.com's own privacy policy.
   The site currently has **no privacy policy page at all** — this is a launch blocker, not a
   nice-to-have.

2. **Sign a Data Processing Agreement (DPA)** with Cal.com. This is offered on their business
   plans; obtain it before launch.

3. **Handle consent correctly.** Because the embed only loads when the user actively navigates
   to `/book` — and never on any other page — the site does not set third-party cookies on
   passive visitors. That is a genuinely better position than sites that load a scheduler
   globally, and it is worth preserving. Keep the embed confined to the `/book` route. If a
   cookie banner is added later, the booking iframe should sit behind the "functional" category
   at minimum.

4. **Keep health data out of the booking flow.** Reason-for-visit free text is a grey area
   patients will inevitably fill with symptoms. Do not add structured medical fields, and do not
   forward notes content into analytics, `metadata`, or any webhook that lands in a
   non-healthcare system.

5. **Self-hosting removes the third-party transfer entirely.** If Cal.com runs on
   clinic-controlled infrastructure inside the EU/EEA, patient booking data never goes to a
   third-party processor, there is no cross-border transfer to assess, and the DPA question
   disappears. For a healthcare practice this is the strongest argument for self-hosting, and
   it is the main reason Cal.com is recommended over closed SaaS alternatives. Migration is
   cheap: change `EMBED_SCRIPT` and `origin` in `src/hooks/useCalEmbed.js` to the self-hosted
   domain, and update the `preconnect` hint in `index.html`.

---

## Appendix A — Using Calendly instead

If the clinic already has Calendly, the same architecture applies: **one Calendly event type
per doctor-location pair**, with a distinct URL each.

1. Create a Calendly organisation and add each dentist as a user (per-user event types require
   a paid plan on Calendly; the free tier allows one event type per user).
2. For each doctor-location pair, create an event type with a slug that encodes both, e.g.
   `jeton-selimi-goce-delchev`. The resulting URL is
   `https://calendly.com/jvd-dental/jeton-selimi-goce-delchev`.
3. Set **Location → In-person meeting** and enter that clinic's street address —
   `Boulevard Goce Delchev 58, 1230 Gostivar` or `Brakja Gjinoski 64, 1230 Gostivar` — so it
   appears on the confirmation and the calendar invite, the same principle as Cal.com.
4. Give each event type an availability schedule limited to that practitioner's hours at that
   location; if anyone ever works at both clinics, their two schedules must not overlap.

Embed with Calendly's inline widget:

```html
<div
  class="calendly-inline-widget"
  data-url="https://calendly.com/jvd-dental/jeton-selimi-goce-delchev?hide_gdpr_banner=1&primary_color=1d7791"
  style="min-width:320px;height:700px"
></div>
<script
  type="text/javascript"
  src="https://assets.calendly.com/assets/external/widget.js"
  async
></script>
```

To integrate with this codebase, write a `useCalendlyEmbed` hook mirroring `useCalEmbed`:
inject `https://assets.calendly.com/assets/external/widget.js` once, then either render the
`calendly-inline-widget` div with the right `data-url` or call
`Calendly.initInlineWidget({ url, parentElement, prefill })`.

Prefill is done with query parameters on the `data-url`:

| Calendly param | Cal.com equivalent | Meaning |
| --- | --- | --- |
| `name` | `name` | Attendee name |
| `email` | `email` | Attendee email |
| `a1` | `notes` | Answer to the first custom question — Calendly numbers custom questions `a1`, `a2`, `a3`… in the order they appear on the event type |
| `guests` | `guests` | Comma-separated additional invitees |
| `utm_source`, `utm_campaign`, … | `metadata` | Attribution; surfaced in Calendly's reporting and webhooks |

Example: `...?name=Ardit&email=patient%40example.com&a1=Upper%20left%20molar`. Values must be
URL-encoded.

Differences worth knowing before switching: Calendly is closed SaaS with **no self-hosting
option**, so the GDPR third-party-transfer discussion in section 6 has no mitigation available
beyond a DPA. Its widget script is also heavier than Cal.com's, and per-user event types need a
paid seat for each dentist. Where Calendly wins is polish and the number of staff who have
already used it.

## Appendix B — Using Acuity Scheduling

Acuity (now Squarespace Scheduling) models the problem slightly differently, and the mapping is
worth stating because it is not one-to-one. Acuity separates **appointment types** (what the
visit is: "Consultation", "Implant assessment", "Hygiene") from **calendars** (who or where the
appointment happens). The natural fit for a two-clinic practice is one calendar per
practitioner-location pair — "Jeton — Goce Delchev", "Vleran — Gjinoski", "Donjet — Gjinoski" —
each with its own availability hours and its own location address, and then appointment types
assigned to the calendars that offer them.
Acuity supports intake forms per appointment type, per-calendar time-zone handling,
and packages/deposits, which makes it attractive if the clinic wants to take payment for
consultations at booking time. It embeds as a plain iframe
(`https://app.acuityscheduling.com/schedule.php?owner=OWNER_ID&calendarID=…&appointmentType=…`)
with an optional resizing script, and prefill uses `firstName`, `lastName`, `email` and
`field:XXXXX` query parameters. The main drawback for this site is that the embed is a
full-page iframe with less styling control than Cal.com's CSS variables, so it will look like
Acuity rather than like JVD — and, as with Calendly, self-hosting is not an option.
