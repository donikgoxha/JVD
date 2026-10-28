import { Link } from 'react-router-dom'
import Img from './Img.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icons.jsx'
import {
  DOCTORS,
  LOCATIONS,
  SERVICES,
  VALUES,
  doctorsAtLocation,
  locationsForDoctor,
  telHref,
} from '../data/clinic.js'

/*
 * Content blocks shared between pages. Each one derives from clinic.js, so a
 * new doctor, clinic or service shows up everywhere without a page edit.
 */

/** Soft colour fields behind a hero. Decorative only. */
export function Glow({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-200/60 blur-3xl" />
      <div className="absolute -left-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-peach-200/60 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-brand-100/70 blur-3xl" />
    </div>
  )
}

/** Hero for the inner pages. `title` may contain an <em> accent. */
export function PageHero({ eyebrow, title, lead, children }) {
  return (
    <section className="grain relative isolate -mt-19 overflow-hidden pt-19">
      <Glow />
      <div className="container-page py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl [&_em]:text-brand-600">
          {title}
        </h1>
        {lead && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

/** Endless strip of service names. Purely decorative — the grid lists them. */
export function Marquee() {
  const items = [...SERVICES, ...SERVICES]
  return (
    <div className="relative overflow-hidden bg-deep py-5 text-brand-100" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {items.map((s, i) => (
          <span key={i} className="font-display flex items-center gap-8 pr-8 text-2xl italic sm:text-3xl">
            {s.title}
            <span className="text-base not-italic text-peach-300">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function ServicesGrid() {
  return (
    <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service, i) => (
        <Reveal
          as="li"
          key={service.id}
          delay={(i % 3) * 90}
          className="group card relative overflow-hidden p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgb(29_119_145/0.45)]"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={service.icon} />
            </span>
            <span className="font-display text-sm text-muted/70">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="font-display mt-8 text-2xl font-medium">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{service.desc}</p>
          <span
            className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-peach-200/0 blur-2xl transition-colors duration-500 group-hover:bg-peach-200/70"
            aria-hidden="true"
          />
        </Reveal>
      ))}
    </ul>
  )
}

/** Numbered principles on a sand band. */
const VALUES_LEAD =
  'Most people who avoid the dentist do so because of one bad experience. Every appointment here is built with enough time to slow down, explain, and stop when you need to stop.'

export function ValuesBand({ eyebrow = 'How we work', title, lead = VALUES_LEAD }) {
  return (
    <section className="bg-sand">
      <div className="container-page py-20 sm:py-28">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl [&_em]:text-brand-600">
              {title ?? (
                <>
                  Unhurried, honest, <em>gentle</em>.
                </>
              )}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:justify-self-end">{lead}</p>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal as="li" key={value.title} delay={i * 90} className="border-t border-ink/15 pt-6">
              <span className="font-display text-5xl font-light text-brand-600/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function TeamGrid() {
  return (
    <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {DOCTORS.map((doc, i) => {
        const worksAt = locationsForDoctor(doc.id)
        return (
          <Reveal as="li" key={doc.id} delay={i * 110} className="group flex flex-col">
            <div className="relative overflow-hidden rounded-[1.75rem]">
              <Img
                src={doc.photo}
                alt={doc.name}
                width="400"
                height="400"
                icon="person"
                label="Portrait"
                className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
                {worksAt.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur"
                  >
                    <Icon name="pin" className="h-3.5 w-3.5 text-brand-600" />
                    {loc.name.replace(/^JVD /, '')}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-1 items-end justify-between gap-4 px-1 pt-5">
              <div>
                <h3 className="font-display text-2xl font-medium">{doc.name}</h3>
                <p className="mt-1 text-sm text-brand-700">{doc.role}</p>
                {doc.bio && <p className="mt-3 text-sm leading-relaxed text-muted">{doc.bio}</p>}
              </div>
              <a
                href={telHref(doc.phone)}
                aria-label={`Call ${doc.name} on ${doc.phone}`}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white"
              >
                <Icon name="phone" className="h-5 w-5" />
              </a>
            </div>
          </Reveal>
        )
      })}
    </ul>
  )
}

/** A stylised street grid with a pin — reads as "map" without a third-party embed. */
function MapArt({ index }) {
  return (
    <div className="relative h-44 overflow-hidden bg-brand-50" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full text-brand-200" preserveAspectRatio="none" viewBox="0 0 400 180">
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M-10 60 Q120 40 210 90 T420 70" strokeWidth="14" className="text-white" />
          <path d="M-10 60 Q120 40 210 90 T420 70" strokeWidth="2" strokeDasharray="6 8" />
          <path d={index % 2 ? 'M90 -10 L150 200' : 'M300 -10 L250 200'} strokeWidth="10" className="text-white" />
          <path d="M-10 140 L420 120" strokeWidth="6" className="text-white" />
          <path d={index % 2 ? 'M320 -10 L340 200' : 'M70 -10 L40 200'} strokeWidth="5" className="text-white" />
        </g>
        <g className="text-brand-100" fill="currentColor">
          <rect x="20" y="78" width="60" height="40" rx="6" />
          <rect x="170" y="112" width="70" height="30" rx="6" />
          <rect x="300" y="10" width="80" height="40" rx="6" />
          <rect x="230" y="150" width="50" height="30" rx="6" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%]">
        <span className="absolute left-1/2 top-full h-3 w-8 -translate-x-1/2 rounded-full bg-brand-900/20 blur-[2px]" />
        <span className="grid h-14 w-14 animate-float place-items-center rounded-full rounded-br-none bg-brand-600 text-white shadow-lg rotate-45">
          <span className="-rotate-45">
            <Icon name="pin" className="h-6 w-6" strokeWidth={2} />
          </span>
        </span>
      </div>
      <span className="font-display absolute left-5 top-4 text-sm italic text-brand-700">
        Clinic {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

export function LocationCards() {
  return (
    <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
      {LOCATIONS.map((loc, i) => {
        const team = doctorsAtLocation(loc.id)
        return (
          <Reveal
            key={loc.id}
            id={loc.id}
            delay={i * 120}
            className="card flex scroll-mt-28 flex-col overflow-hidden p-0"
          >
            <MapArt index={i} />
            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-display text-3xl font-medium">{loc.name}</h3>
              <address className="mt-4 space-y-2 text-sm not-italic text-muted">
                <p className="flex gap-2">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {loc.address}
                </p>
                <p className="flex gap-2">
                  <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <a href={telHref(loc.phone)} className="font-medium text-ink hover:text-brand-700">
                    {loc.phone}
                  </a>
                </p>
                <p className="pl-6">{loc.hours ?? 'Call for opening hours'}</p>
              </address>

              {team.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {team.map((d) => (
                      <span
                        key={d.id}
                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-brand-100 text-[11px] font-bold text-brand-700"
                        aria-hidden="true"
                      >
                        {initials(d.name)}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-ink">{team.map((d) => d.name).join(' · ')}</p>
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-2 pt-7">
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5">
                  Get directions
                  <Icon name="arrowUpRight" className="h-4 w-4" />
                </a>
                <a href={telHref(loc.phone)} className="btn-ghost px-5 py-2.5">
                  <Icon name="phone" className="h-4 w-4" />
                  Call
                </a>
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

/** The closing band on every page: the clinic's numbers, big. */
export function CallBand() {
  return (
    <section className="container-page pb-6 pt-8">
      <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] bg-deep px-6 py-16 text-white sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-500/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-10 -z-10 h-80 w-80 rounded-full bg-peach-400/25 blur-3xl" aria-hidden="true" />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">Questions?</p>
            <h2 className="font-display mt-4 text-5xl leading-[1.02] font-medium sm:text-6xl">
              Just give us <em className="text-peach-300">a call.</em>
            </h2>
            <p className="mt-6 max-w-md text-brand-100/90">
              Call the clinic that is closer to you, or the dentist you want to see directly. We are
              happy to answer questions before you ever sit in the chair.
            </p>
          </div>

          <ul className="space-y-3">
            {LOCATIONS.map((loc) => (
              <li key={loc.id}>
                <a
                  href={telHref(loc.phone)}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-[0.14em] text-brand-300">{loc.name}</span>
                    <span className="font-display mt-1 block text-2xl sm:text-3xl">{loc.phone}</span>
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-deep transition-transform duration-300 group-hover:rotate-12">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                </a>
              </li>
            ))}
            <li>
              <Link to="/contact" className="inline-flex items-center gap-2 px-1 pt-2 text-sm font-medium text-brand-200 hover:text-white">
                All direct lines and directions
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
