// Single source of truth for clinic content.
//
// Names, phone numbers and street addresses below are REAL and confirmed.
// Anything still marked TODO is a placeholder the clinic must supply — in
// particular the specialties, biographies and opening hours. Do not invent
// credentials for a named practitioner.
//
// ─────────────────────────────────────────────────────────────────────────────
// ADDING A CLINIC OR A PRACTITIONER
//
// JVD operates in Gostivar only — every location is a Gostivar address. The
// site copy says "N clinics in {CLINIC.city}", so a location in another city
// would make that line wrong; revisit the copy first if that ever changes.
//
// Both lists are open-ended. Every page derives its layout from their length,
// so adding an entry needs NO changes anywhere else in the codebase:
//
//   New clinic   -> push to LOCATIONS, then add its id to the `calLinks` of
//                   whoever works there. Doctors who do not work there simply
//                   omit the key (or set it to null).
//   New doctor   -> push to DOCTORS with a `calLinks` map. One key per location
//                   they consult at.
//
// Copy-paste templates are at the bottom of this file. `validateClinicData()`
// runs automatically in dev and shouts if a `calLinks` key does not match a
// real location id — the one mistake that silently hides a doctor from the
// booking page.
// ─────────────────────────────────────────────────────────────────────────────

export const CLINIC = {
  name: 'JVD Dental Clinic',
  city: 'Gostivar',
  country: 'North Macedonia',
  instagram: 'https://www.instagram.com/jvddentalclinic/',
  instagramHandle: '@jvddentalclinic',
  // null until the clinic confirms a real mailbox. A published address that
  // bounces is worse than no address — the UI omits it when null.
  email: null, // TODO set once confirmed
  // Main published number, shown in the hero, the booking page and the footer's
  // out-of-hours line. Currently Dr. Vleran Selimi's line — swap if the clinic
  // has a dedicated reception number.
  phone: '+389 70 973 773',
  // Cal.com team slug. Every calLink below is `${calTeam}/${eventSlug}`.
  calTeam: 'jvd-dental',
}

/**
 * Clinic locations. Order here is the order they appear on the site.
 * `id` is used in Cal.com event slugs and in the ?location= URL parameter —
 * changing an existing id breaks saved links, so treat ids as permanent.
 */
export const LOCATIONS = [
  {
    id: 'goce-delchev',
    name: 'JVD Goce Delchev',
    street: 'Boulevard Goce Delchev 58',
    address: 'Boulevard Goce Delchev 58, 1230 Gostivar',
    note: 'Dr. Jeton Selimi',
    // null until confirmed. Publishing guessed hours sends patients to a
    // closed door; every surface omits the line when null and shows the
    // phone number instead.
    hours: null, // TODO set once confirmed
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Boulevard%20Goce%20Delchev%2058%2C%201230%20Gostivar%2C%20North%20Macedonia',
    phone: '+389 70 228 534',
  },
  {
    id: 'gjinoski',
    name: 'JVD Brakja Gjinoski',
    street: 'Brakja Gjinoski 64',
    address: 'Brakja Gjinoski 64, 1230 Gostivar',
    note: 'Dr. Vleran Selimi · Dr. Donjet Selimi',
    hours: null, // TODO set once confirmed
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Brakja%20Gjinoski%2064%2C%201230%20Gostivar%2C%20North%20Macedonia',
    phone: '+389 70 973 773',
  },
]

/**
 * Practitioners. `calLinks` maps a location id to that person's Cal.com event
 * type at that address. A missing key or a null value means "does not consult
 * here", and that combination never renders in the booking UI.
 *
 * `shortName` is what buttons say ("Book with Dr. Jeton") — set explicitly
 * rather than derived, because not every name carries a title the same way.
 */
export const DOCTORS = [
  {
    id: 'jeton-selimi',
    name: 'Dr. Jeton Selimi',
    shortName: 'Dr. Jeton',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 228 534',
    photo: '/team/jeton-selimi.webp',
    bio: '', // TODO supply — leave empty rather than invent a biography
    calLinks: {
      'goce-delchev': 'jvd-dental/jeton-selimi-goce-delchev',
    },
  },
  {
    id: 'vleran-selimi',
    name: 'Dr. Vleran Selimi',
    shortName: 'Dr. Vleran',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 973 773',
    photo: '/team/vleran-selimi.webp',
    bio: '', // TODO
    calLinks: {
      gjinoski: 'jvd-dental/vleran-selimi-gjinoski',
    },
  },
  {
    id: 'donjet-selimi',
    name: 'Dr. Donjet Selimi',
    shortName: 'Dr. Donjet',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 308 555',
    photo: '/team/donjet-selimi.webp',
    bio: '', // TODO
    calLinks: {
      gjinoski: 'jvd-dental/donjet-selimi-gjinoski',
    },
  },
]

// TODO confirm this service list with the clinic before launch.
export const SERVICES = [
  { id: 'checkup', title: 'Check-up & Hygiene', desc: 'Exam, scaling, polishing and a written care plan.', icon: 'sparkle' },
  { id: 'implants', title: 'Dental Implants', desc: 'Single implants to full-arch, planned on 3D imaging.', icon: 'anchor' },
  { id: 'ortho', title: 'Orthodontics', desc: 'Fixed braces and clear aligners for teens and adults.', icon: 'align' },
  { id: 'aesthetic', title: 'Aesthetic Dentistry', desc: 'Veneers, bonding and whitening, shade-matched.', icon: 'smile' },
  { id: 'endo', title: 'Root Canal Therapy', desc: 'Rotary endodontics under magnification.', icon: 'shield' },
  { id: 'kids', title: 'Pediatric Care', desc: 'Gentle first visits, sealants and prevention.', icon: 'heart' },
]

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/our-work', label: 'Our Work' },
  { to: '/book', label: 'Book Now' },
]

/* ------------------------------------------------------------------ */
/* Derived lookups — use these instead of reaching into calLinks        */
/* ------------------------------------------------------------------ */

/** Practitioners who consult at a given location, in DOCTORS order. */
export function doctorsAtLocation(locationId) {
  if (!locationId) return DOCTORS
  return DOCTORS.filter((doctor) => Boolean(doctor.calLinks[locationId]))
}

/** Locations where a given practitioner consults, in LOCATIONS order. */
export function locationsForDoctor(doctorId) {
  const doctor = DOCTORS.find((d) => d.id === doctorId)
  if (!doctor) return LOCATIONS
  return LOCATIONS.filter((location) => Boolean(doctor.calLinks[location.id]))
}

/** The Cal.com event link for one doctor at one location, or null. */
export function calLinkFor(doctorId, locationId) {
  const doctor = DOCTORS.find((d) => d.id === doctorId)
  return doctor?.calLinks[locationId] ?? null
}

/* ------------------------------------------------------------------ */
/* Dev-only integrity check                                             */
/* ------------------------------------------------------------------ */

/**
 * Catches the mistakes that fail silently: a calLinks key that does not match
 * any location id (the doctor just never appears), duplicate ids, and a doctor
 * with no bookable location at all. Logs, never throws — a data typo should not
 * white-screen the site in production.
 */
export function validateClinicData() {
  const problems = []
  const locationIds = new Set(LOCATIONS.map((l) => l.id))

  if (locationIds.size !== LOCATIONS.length) {
    problems.push('LOCATIONS contains duplicate ids.')
  }
  if (new Set(DOCTORS.map((d) => d.id)).size !== DOCTORS.length) {
    problems.push('DOCTORS contains duplicate ids.')
  }

  for (const doctor of DOCTORS) {
    for (const key of Object.keys(doctor.calLinks)) {
      if (!locationIds.has(key)) {
        problems.push(
          `${doctor.name}: calLinks key "${key}" matches no location id. ` +
            `Valid ids: ${[...locationIds].join(', ')}.`
        )
      }
    }
    if (locationsForDoctor(doctor.id).length === 0) {
      problems.push(`${doctor.name} has no bookable location and will not appear on /book.`)
    }
  }

  for (const location of LOCATIONS) {
    if (doctorsAtLocation(location.id).length === 0) {
      problems.push(`${location.name} has no practitioners and cannot be booked.`)
    }
  }

  return problems
}

// Optional-chained so this module can also be imported by a plain Node script
// (a codegen or a data test), where `import.meta.env` does not exist.
if (import.meta.env?.DEV) {
  const problems = validateClinicData()
  if (problems.length) {
    console.warn('[clinic.js] data problems:\n - ' + problems.join('\n - '))
  }
}

/* ------------------------------------------------------------------ *
 * TEMPLATES — copy, paste, fill in.
 *
 * New location — JVD operates in Gostivar only, so name it after its street:
 *
 *   {
 *     id: 'street-name',                  // permanent, used in URLs + slugs
 *     name: 'JVD Street Name',
 *     street: 'Street Name 1',
 *     address: 'Street Name 1, 1230 Gostivar',
 *     note: 'Dr. Someone',                // shown under the name
 *     hours: 'Mon–Fri 09:00–19:00',
 *     mapsUrl: 'https://www.google.com/maps/search/?api=1&query=<url-encoded address>',
 *     phone: '+389 70 000 000',
 *   }
 *
 * New practitioner:
 *
 *   {
 *     id: 'ime-prezime',                  // permanent, used in ?doctor=
 *     name: 'Dr. Ime Prezime',
 *     shortName: 'Dr. Ime',
 *     role: 'Orthodontics',
 *     phone: '+389 70 000 000',
 *     photo: '/team/ime-prezime.webp',    // 400x400 WebP in public/team/
 *     bio: '',
 *     calLinks: {
 *       'goce-delchev': 'jvd-dental/ime-prezime-goce-delchev',
 *       gjinoski: 'jvd-dental/ime-prezime-gjinoski',
 *     },
 *   }
 *
 * Then create the matching Cal.com event types — see docs/BOOKING_SETUP.md.
 * ------------------------------------------------------------------ */
