import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCalEmbed } from '../hooks/useCalEmbed.js'
import DemoCalendar from '../components/DemoCalendar.jsx'
import Img from '../components/Img.jsx'
import {
  CLINIC,
  DOCTORS,
  LOCATIONS,
  calLinkFor,
  doctorsAtLocation,
  locationsForDoctor,
} from '../data/clinic.js'

/**
 * Booking page.
 *
 * There is no booking backend here. Availability, reschedules, reminders and
 * confirmation emails are all owned by Cal.com. This page's only job is to
 * resolve the patient's two choices — LOCATION and DOCTOR — into a single
 * deterministic Cal.com event-type link, then mount that calendar inline.
 *
 *   location + doctor  ->  DOCTORS[n].calLinks[locationId]
 *                      ->  "jvd-dental/jeton-selimi-goce-delchev"
 *
 * One event type per doctor-per-location is deliberate: the address lives on
 * the Cal.com event type itself, so the confirmation email and the calendar
 * invite carry the correct Gostivar address with no extra code on our side.
 *
 * Both choices are mirrored into the URL (?location=…&doctor=…), which makes
 * every combination deep-linkable and shareable — the "Book here" buttons on
 * the Home and About pages link straight into a pre-selected state.
 */
export default function Booking() {
  const [params, setParams] = useSearchParams()

  const locationId = params.get('location')
  const doctorId = params.get('doctor')

  const location = LOCATIONS.find((l) => l.id === locationId) ?? null
  const doctor = DOCTORS.find((d) => d.id === doctorId) ?? null

  // A doctor is only offered at a location where they actually hold a clinic.
  const doctorsHere = useMemo(() => doctorsAtLocation(location?.id), [location])

  // If a doctor arrived from a deep link, only offer the locations they cover.
  const locationsHere = useMemo(() => locationsForDoctor(doctor?.id), [doctor])

  const calLink = location && doctor ? calLinkFor(doctor.id, location.id) : null
  const ready = Boolean(calLink)

  function select(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)

    // Clearing the location invalidates a doctor who does not work elsewhere.
    if (key === 'location' && doctor && value && !calLinkFor(doctor.id, value)) {
      next.delete('doctor')
    }
    setParams(next, { replace: true })
  }

  return (
    <>
      <section className="border-b border-line bg-brand-50/60">
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow">Book now</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {BOOKING_MODE === 'phone'
              ? 'Pick a location and a doctor.'
              : 'Pick a location, a doctor, and a time.'}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {BOOKING_MODE === 'phone' ? (
              <>
                Choose the clinic and the dentist you want, and we will show you the direct number
                to call. Prefer to call straight away?{' '}
              </>
            ) : (
              <>
                Availability below is live. You will get an email confirmation with the exact clinic
                address and a link to reschedule. Prefer to talk?{' '}
              </>
            )}
            <a href={`tel:${CLINIC.phone.replace(/\s/g, '')}`} className="font-medium text-brand-700 underline underline-offset-4">
              Call {CLINIC.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        <ol className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-10">
          {/* ── STEP 1 + 2: the selectors ─────────────────────────────────── */}
          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {/* STEP 1 — LOCATION */}
            <li className="list-none">
              <StepHeading n={1} title="Choose a location" done={Boolean(location)} />
              <p className="mt-2 text-sm text-muted">
                {locationsHere.length === LOCATIONS.length
                  ? `Our ${LOCATIONS.length} clinics in ${CLINIC.city}.`
                  : `Clinics where ${doctor.shortName} consults.`}{' '}
                All run the same standard of care.
              </p>

              <div className="mt-4 grid gap-3">
                {locationsHere.map((loc) => {
                  const active = location?.id === loc.id
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => select('location', active ? null : loc.id)}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        active
                          ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                          : 'border-line bg-white hover:border-brand-300 hover:bg-brand-50/50'
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-sm font-semibold">{loc.name}</span>
                          <span className="mt-1 block text-sm text-muted">{loc.address}</span>
                          {loc.hours && <span className="mt-1.5 block text-xs text-muted">{loc.hours}</span>}
                        </span>
                        <Check active={active} />
                      </span>
                      <span className="mt-3 block text-xs font-medium text-brand-700">{loc.note}</span>
                    </button>
                  )
                })}
              </div>

              {doctor && locationsHere.length < LOCATIONS.length && (
                <p className="mt-3 text-xs text-muted">
                  Only locations where {doctor.name} holds a clinic are shown.{' '}
                  <button type="button" onClick={() => select('doctor', null)} className="underline underline-offset-2">
                    Show all locations
                  </button>
                </p>
              )}
            </li>

            {/* STEP 2 — DOCTOR */}
            <li className="list-none">
              <StepHeading n={2} title="Choose a doctor" done={Boolean(doctor)} muted={!location} />
              <p className="mt-2 text-sm text-muted">
                {location ? `Available at ${location.name}.` : 'Select a location first.'}
              </p>

              <div className={`mt-4 grid gap-3 ${location ? '' : 'pointer-events-none opacity-50'}`}>
                {doctorsHere.map((doc) => {
                  const active = doctor?.id === doc.id
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      aria-pressed={active}
                      disabled={!location}
                      onClick={() => select('doctor', active ? null : doc.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                          : 'border-line bg-white hover:border-brand-300 hover:bg-brand-50/50'
                      }`}
                    >
                      <Img
                        src={doc.photo}
                        alt=""
                        width="88"
                        height="88"
                        icon="person"
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{doc.name}</span>
                        <span className="block truncate text-xs text-muted">{doc.role}</span>
                      </span>
                      <Check active={active} />
                    </button>
                  )
                })}
              </div>
            </li>
          </div>

          {/* ── STEP 3: the third-party calendar ───────────────────────────── */}
          <li className="list-none">
            <StepHeading
              n={3}
              title={BOOKING_MODE === 'phone' ? 'Call to book' : 'Choose a date and time'}
              muted={!ready}
            />

            <div className="mt-4">
              {ready ? (
                <CalendarPanel calLink={calLink} doctor={doctor} location={location} />
              ) : (
                <EmptyCalendar hasLocation={Boolean(location)} />
              )}
            </div>
          </li>
        </ol>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* The embed itself                                                     */
/* ------------------------------------------------------------------ */

/**
 * How step 3 books, chosen at build time by VITE_BOOKING_MODE:
 *
 *   'cal'    the Cal.com embed, using the per-combination slug from clinic.js.
 *            The real production mode — requires the event types to exist.
 *   'phone'  no calendar. Shows the clinic's direct number for that doctor and
 *            location. Correct while no scheduling account exists: a live site
 *            must not show a patient availability it cannot honour.
 *   'demo'   the local DemoCalendar — sample availability behind an explicit
 *            banner. For internal review only, never for a public deployment.
 *
 * VITE_CAL_DEMO_LINK overrides the slug with one real Cal.com link for every
 * pair, which is how you exercise the genuine embed with a single event type.
 */
const CAL_DEMO_LINK = import.meta.env.VITE_CAL_DEMO_LINK?.trim() || null
const BOOKING_MODE = CAL_DEMO_LINK ? 'cal' : import.meta.env.VITE_BOOKING_MODE?.trim() || 'cal'

function CalendarPanel({ calLink, doctor, location }) {
  // A namespace per combination keeps Cal's internal instances from colliding
  // when the patient switches doctor or location without leaving the page.
  const namespace = `${doctor.id}-${location.id}`
  const effectiveLink = CAL_DEMO_LINK ?? calLink
  const useLocalDemo = BOOKING_MODE === 'demo'
  const usePhone = BOOKING_MODE === 'phone'

  const { containerRef, status } = useCalEmbed({
    calLink: effectiveLink,
    namespace,
    enabled: !useLocalDemo && !usePhone,
    // Anything here is forwarded to Cal.com. `metadata` lands on the booking
    // record and in the webhook payload, which is how the front desk knows
    // which physical clinic a booking belongs to.
    config: {
      layout: 'month_view',
      metadata: { locationId: location.id, locationName: location.name, doctorId: doctor.id },
    },
  })

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-50/60 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">{doctor.name}</p>
          <p className="text-xs text-muted">
            {location.name} · {location.address}
          </p>
        </div>
        <a
          href={`tel:${location.phone.replace(/\s/g, '')}`}
          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
        >
          {location.hours ?? location.phone}
        </a>
      </div>

      {usePhone ? (
        <PhoneBooking key={namespace} doctor={doctor} location={location} />
      ) : useLocalDemo ? (
        <DemoCalendar key={namespace} doctor={doctor} location={location} />
      ) : (
        /* Cal.com renders its iframe into this element. min-height reserves the
           space up front so the page does not shift when the iframe paints. */
        <div
          key={namespace}
          ref={containerRef}
          className="min-h-[640px] w-full"
          style={{ overflow: 'scroll' }}
          aria-busy={status === 'loading'}
          aria-live="polite"
        />
      )}

      {status === 'loading' && (
        <p className="border-t border-line px-5 py-4 text-sm text-muted">Loading live availability…</p>
      )}

      {status === 'error' && (
        <div className="border-t border-line bg-brand-50/60 px-5 py-5 text-sm">
          <p className="font-medium">The calendar could not load.</p>
          <p className="mt-1 text-muted">
            An ad or tracker blocker will sometimes block it. Open the booking page directly, or call
            us.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`https://cal.com/${effectiveLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-5 py-2.5"
            >
              Open calendar in a new tab
            </a>
            <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="btn-ghost px-5 py-2.5">
              Call {location.name}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Step 3 when there is no scheduling account yet. The two selections already
 * made are not wasted: they resolve to the one phone number that reaches the
 * right clinic, and the address the patient is being sent to.
 */
function PhoneBooking({ doctor, location }) {
  const tel = (n) => `tel:${n.replace(/\s/g, '')}`

  return (
    <div className="grid min-h-[420px] place-items-center p-6 sm:p-10">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.6 3h2.8l1.4 3.5-1.8 1.4a12 12 0 005.1 5.1l1.4-1.8L19 12.6v2.8a2 2 0 01-2.2 2A15.5 15.5 0 014.6 5.2 2 2 0 016.6 3Z" />
          </svg>
        </span>

        <h3 className="mt-5 text-lg font-semibold">Call to book with {doctor.shortName}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Appointments at {location.name} are booked by phone. Mention {doctor.name} and the
          reason for your visit, and the clinic will find you a time.
        </p>

        <a href={tel(doctor.phone)} className="btn-primary mt-6 w-full px-6 py-4 text-base">
          {doctor.phone}
        </a>

        {location.phone !== doctor.phone && (
          <a href={tel(location.phone)} className="btn-ghost mt-3 w-full px-6 py-3.5">
            Clinic line · {location.phone}
          </a>
        )}

        <p className="mt-6 text-xs leading-relaxed text-muted">
          {location.address}
          {location.hours ? ` · ${location.hours}` : ''}
        </p>

        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-brand-700 underline underline-offset-4"
        >
          Open in Maps
        </a>
      </div>
    </div>
  )
}

function EmptyCalendar({ hasLocation }) {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[var(--radius-card)] border border-dashed border-line bg-brand-50/30 p-8 text-center">
      <div className="max-w-sm">
        <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-brand-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <p className="mt-4 text-sm font-medium">
          {hasLocation ? 'Now choose a doctor' : 'Start by choosing a location'}
        </p>
        <p className="mt-2 text-sm text-muted">
          {BOOKING_MODE === 'phone'
            ? 'The number for that clinic appears here as soon as both are selected.'
            : 'Live availability appears here as soon as both are selected.'}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Small presentational bits                                            */
/* ------------------------------------------------------------------ */

function StepHeading({ n, title, done = false, muted = false }) {
  return (
    <h2 className={`flex items-center gap-3 ${muted ? 'opacity-60' : ''}`}>
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
          done ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'
        }`}
      >
        {done ? '✓' : n}
      </span>
      <span className="text-lg font-semibold tracking-tight">{title}</span>
    </h2>
  )
}

function Check({ active }) {
  return (
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
        active ? 'border-brand-600 bg-brand-600 text-white' : 'border-line'
      }`}
      aria-hidden="true"
    >
      {active && (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />
        </svg>
      )}
    </span>
  )
}
