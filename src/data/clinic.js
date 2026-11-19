// Clinic content. Every page, the JSON-LD and the sitemap read from here.
//
// Names, phone numbers and addresses are confirmed by the clinic. Fields marked
// TODO are still owed by the clinic: leave them null rather than guess, and the
// site leaves them out. Templates for a new clinic or dentist are at the bottom.

export const CLINIC = {
  name: 'JVD Dental Clinic',
  city: 'Gostivar',
  country: 'North Macedonia',
  instagram: 'https://www.instagram.com/jvddentalclinic/',
  instagramHandle: '@jvddentalclinic',
  email: null, // TODO set once the clinic confirms a mailbox
  // Dr. Vleran Selimi's line until the clinic has a reception number.
  phone: '+389 70 973 773',
  priceRange: '$$',
}

/**
 * Clinics, in display order. `id` is also the /contact anchor (/contact#gjinoski),
 * so don't rename one that's live.
 *
 * hours: null, or [{ days: ['Monday', ..., 'Friday'], opens: '09:00', closes: '19:00' }, ...]
 *        with consecutive days per entry. Feeds the cards and openingHoursSpecification.
 * geo:   null, or { lat, lng } copied from the clinic's own Google Maps pin.
 */
export const LOCATIONS = [
  {
    id: 'goce-delchev',
    name: 'JVD Goce Delchev',
    street: 'Boulevard Goce Delchev 58',
    address: 'Boulevard Goce Delchev 58, 1230 Gostivar',
    note: 'Dr. Jeton Selimi',
    hours: null, // TODO
    geo: null, // TODO
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
    hours: null, // TODO
    geo: null, // TODO
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Brakja%20Gjinoski%2064%2C%201230%20Gostivar%2C%20North%20Macedonia',
    phone: '+389 70 973 773',
  },
]

// `locations` = clinic ids where each dentist works. `shortName` is set by hand
// because titles don't shorten the same way for everyone.
export const DOCTORS = [
  {
    id: 'jeton-selimi',
    name: 'Dr. Jeton Selimi',
    shortName: 'Dr. Jeton',
    role: 'Dentist', // TODO replace with the confirmed specialty
    phone: '+389 70 228 534',
    photo: '/team/jeton-selimi.webp',
    bio: '', // TODO from the clinic; never write one for them
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

// TODO the clinic hasn't signed this list off yet. Check it against their Instagram.
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

// Nothing here the clinic would have to guarantee (pricing, sterility...)
// unless they've told us it's true.
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
    title: 'Either clinic',
    text: 'Same family, same way of working. Pick whichever address is closer to you.',
  },
]

/**
 * Gallery on Home and Our Work; hidden while empty. Real posts from
 * @jvddentalclinic only (image saved to public/instagram/, real caption and
 * link). No stock photos: people read a dental gallery as patient results.
 *
 *   {
 *     id: 'C9abc123',                         // the code in the post URL
 *     image: '/instagram/C9abc123.webp',      // square, 800 x 800 WebP
 *     alt: 'Upper front teeth after whitening', // describe the photo itself
 *     caption: 'Whitening, one session',     // short; from the real caption
 *     url: 'https://www.instagram.com/p/C9abc123/',
 *   },
 */
export const INSTAGRAM_POSTS = []

/* ------------------------------------------------------------------ */
/* Derived lookups                                                      */
/* ------------------------------------------------------------------ */

/** '+389 70 973 773' -> 'tel:+38970973773' */
export function telHref(phone) {
  return `tel:${phone.replace(/\s/g, '')}`
}

/** Dentists at one clinic, in DOCTORS order. */
export function doctorsAtLocation(locationId) {
  return DOCTORS.filter((doctor) => doctor.locations.includes(locationId))
}

/** Clinics where one dentist works, in LOCATIONS order. */
export function locationsForDoctor(doctorId) {
  const doctor = DOCTORS.find((d) => d.id === doctorId)
  if (!doctor) return []
  return LOCATIONS.filter((location) => doctor.locations.includes(location.id))
}

const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

/** [{ days: ['Monday', ..., 'Friday'], opens, closes }] -> 'Mon–Fri 09:00–19:00', or null. */
export function formatHours(hours) {
  if (!hours?.length) return null
  return hours
    .map(({ days, opens, closes }) => {
      const first = DAY_SHORT[days[0]]
      const range = days.length > 1 ? `${first}–${DAY_SHORT[days.at(-1)]}` : first
      return `${range} ${opens}–${closes}`
    })
    .join(' · ')
}

/* ------------------------------------------------------------------ */
/* Dev-only integrity check                                             */
/* ------------------------------------------------------------------ */

/** Dev-only check for the typos that fail silently. Warns, never throws. */
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

// Optional chaining: vite.config.js imports this file under plain Node.
if (import.meta.env?.DEV) {
  const problems = validateClinicData()
  if (problems.length) {
    console.warn('[clinic.js] data problems:\n - ' + problems.join('\n - '))
  }
}

/* ------------------------------------------------------------------ *
 * Templates.
 *
 * New clinic (all of them are in Gostivar, so name it after the street):
 *
 *   {
 *     id: 'street-name',                  // permanent, used in /contact#id
 *     name: 'JVD Street Name',
 *     street: 'Street Name 1',
 *     address: 'Street Name 1, 1230 Gostivar',
 *     note: 'Dr. Someone',                // shown under the name
 *     hours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' }],
 *     geo: { lat: 41.79, lng: 20.9 },     // from the Google Maps pin
 *     mapsUrl: 'https://www.google.com/maps/search/?api=1&query=<url-encoded address>',
 *     phone: '+389 70 000 000',
 *   }
 *
 * New dentist:
 *
 *   {
 *     id: 'ime-prezime',                  // permanent
 *     name: 'Dr. Ime Prezime',
 *     shortName: 'Dr. Ime',
 *     role: 'Orthodontics',
 *     phone: '+389 70 000 000',
 *     photo: '/team/ime-prezime.webp',    // 400x400 WebP in public/team/
 *     bio: '',
 *     locations: ['goce-delchev', 'gjinoski'],
 *   }
 * ------------------------------------------------------------------ */
