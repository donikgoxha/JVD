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
//   New clinic   -> push to LOCATIONS, then add its id to the `locations` of
//                   whoever works there.
//   New doctor   -> push to DOCTORS with a `locations` list of the clinic ids
//                   they work at.
//
// Copy-paste templates are at the bottom of this file. `validateClinicData()`
// runs automatically in dev and shouts if a `locations` entry does not match a
// real location id — the one mistake that silently drops a doctor from a
// clinic's card.
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
  // Main published number, shown in the hero, the contact page and the footer.
  // Currently Dr. Vleran Selimi's line — swap if the clinic has a dedicated
  // reception number.
  phone: '+389 70 973 773',
}

/**
 * Clinic locations. Order here is the order they appear on the site.
 * `id` is the anchor on /contact (`/contact#gjinoski`) — changing an existing
 * id breaks saved links, so treat ids as permanent.
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
 * Practitioners. `locations` lists the clinic ids where each one works.
 *
 * `shortName` is what buttons say ("Call Dr. Jeton") — set explicitly rather
 * than derived, because not every name carries a title the same way.
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
    locations: ['goce-delchev'],
  },
  {
    id: 'vleran-selimi',
    name: 'Dr. Vleran Selimi',
    shortName: 'Dr. Vleran',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 973 773',
    photo: '/team/vleran-selimi.webp',
    bio: '', // TODO
    locations: ['gjinoski'],
  },
  {
    id: 'donjet-selimi',
    name: 'Dr. Donjet Selimi',
    shortName: 'Dr. Donjet',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 308 555',
    photo: '/team/donjet-selimi.webp',
    bio: '', // TODO
    locations: ['gjinoski'],
  },
]

// TODO confirm this service list with the clinic (ideally against what their
// Instagram actually shows). Published, but nobody at the clinic has signed it off.
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
  { to: '/contact', label: 'Contact' },
]

/**
 * How the practice works. Kept deliberately non-promissory: "Fixed, written
 * pricing" and "Sterility, verified" used to sit here — operational guarantees
 * nobody confirmed. Do not add a claim unless the clinic has said it is true.
 */
export const VALUES = [
  {
    title: 'Explain before we treat',
    text: 'You hear the plan, the alternatives and the cost before anything starts.',
  },
  {
    title: 'Time to ask',
    text: 'Questions are part of the appointment, not an interruption to it.',
  },
  {
    title: 'Gentle by default',
    text: 'We work at your pace, and we stop when you need to stop.',
  },
  {
    title: 'One family, two clinics',
    text: 'The same people, the same standard, whichever address is closer to you.',
  },
]

/**
 * Posts from @jvddentalclinic, shown as a gallery on Home and Our Work.
 *
 * EMPTY ON PURPOSE. Every entry must be a real post: the image downloaded from
 * the clinic's own Instagram into public/instagram/, its real caption, and its
 * real permalink. Never fill this with stock or AI images — a dental gallery
 * reads as "our patients' results". While it is empty the gallery is not
 * rendered and the pages show the Instagram call-to-action on its own.
 *
 *   {
 *     id: 'C9abc123',                         // the code in the post URL
 *     image: '/instagram/C9abc123.webp',      // square, 800 x 800 WebP
 *     alt: 'Upper front teeth after whitening', // describe the photo itself
 *     caption: 'Whitening — one session',     // short; from the real caption
 *     url: 'https://www.instagram.com/p/C9abc123/',
 *   },
 */
export const INSTAGRAM_POSTS = []

/* ------------------------------------------------------------------ */
/* Derived lookups                                                      */
/* ------------------------------------------------------------------ */

/** `tel:` href for a display-formatted number: '+389 70 973 773' -> 'tel:+38970973773'. */
export function telHref(phone) {
  return `tel:${phone.replace(/\s/g, '')}`
}

/** Practitioners who work at a given location, in DOCTORS order. */
export function doctorsAtLocation(locationId) {
  return DOCTORS.filter((doctor) => doctor.locations.includes(locationId))
}

/** Locations where a given practitioner works, in LOCATIONS order. */
export function locationsForDoctor(doctorId) {
  const doctor = DOCTORS.find((d) => d.id === doctorId)
  if (!doctor) return []
  return LOCATIONS.filter((location) => doctor.locations.includes(location.id))
}

/* ------------------------------------------------------------------ */
/* Dev-only integrity check                                             */
/* ------------------------------------------------------------------ */

/**
 * Catches the mistakes that fail silently: a `locations` entry that does not
 * match any location id (the doctor just never appears), duplicate ids, and a
 * doctor with no location at all. Logs, never throws — a data typo should not
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
    for (const key of doctor.locations) {
      if (!locationIds.has(key)) {
        problems.push(
          `${doctor.name}: locations entry "${key}" matches no location id. ` +
            `Valid ids: ${[...locationIds].join(', ')}.`
        )
      }
    }
    if (locationsForDoctor(doctor.id).length === 0) {
      problems.push(`${doctor.name} has no location and will not appear on any clinic card.`)
    }
  }

  for (const location of LOCATIONS) {
    if (doctorsAtLocation(location.id).length === 0) {
      problems.push(`${location.name} has no practitioners.`)
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
 *     locations: ['goce-delchev', 'gjinoski'],
 *   }
 * ------------------------------------------------------------------ */
