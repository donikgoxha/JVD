import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Img from '../components/Img.jsx'
import { CLINIC, DOCTORS, LOCATIONS, SERVICES } from '../data/clinic.js'

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-page relative grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">
              {CLINIC.city} · {LOCATIONS.length} locations
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Dental care you can actually look forward to.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A family practice in Gostivar. Choose the clinic that is closer and the dentist you
              want to see — we will take it from there.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/book" className="btn-primary px-8 py-4 text-base">
                Book an Appointment
              </Link>
              <a href={`tel:${CLINIC.phone.replace(/\s/g, '')}`} className="btn-ghost px-8 py-4 text-base">
                Call {CLINIC.phone}
              </a>
            </div>

            <dl className="mt-12 grid max-w-sm grid-cols-2 gap-6 border-t border-line pt-8">
              {/* Only verifiable facts here. Do not add a years-in-practice or a
                  star-rating figure until the clinic confirms the real number —
                  an invented review score is a claim the practice has to defend. */}
              {[
                [String(LOCATIONS.length), `Clinics in ${CLINIC.city}`],
                [String(DOCTORS.length), 'Practitioners'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-brand-700 sm:text-3xl">{stat}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <Img
              src="/hero-clinic.webp"
              alt="Treatment room at JVD Dental Clinic"
              width="960"
              height="1200"
              loading="eager"
              fetchPriority="high"
              icon="tooth"
              label="Clinic photo"
              className="aspect-[4/5] w-full rounded-[var(--radius-card)] object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-line bg-white/95 p-4 shadow-lg backdrop-blur sm:left-8 sm:right-auto sm:w-72">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {LOCATIONS[0].hours ? 'Open today' : 'Call us'}
              </p>
              <p className="mt-1 text-sm text-muted">{LOCATIONS[0].hours ?? CLINIC.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section
        eyebrow="What we do"
        title="Services, briefly"
        lead="The treatments our patients ask for most."
      >
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.id} className="card transition-shadow hover:shadow-md">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ServiceIcon name={service.icon} />
              </span>
              <h3 className="mt-4 text-base font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{service.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* LOCATIONS */}
      <Section
        eyebrow="Find us"
        title={`${LOCATIONS.length === 2 ? 'Two' : LOCATIONS.length} clinics in ${CLINIC.city}`}
        lead="Choose whichever is closer — your file and your doctor follow you between them."
      >
        {/* auto-fit, so a third or fourth clinic drops in without a layout edit */}
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="card flex flex-col">
              <h3 className="text-lg font-semibold">{loc.name}</h3>
              <p className="mt-1 text-sm text-brand-700">{loc.note}</p>
              <address className="mt-4 space-y-1 text-sm not-italic text-muted">
                <p>{loc.address}</p>
                {loc.hours ? <p>{loc.hours}</p> : <p>Call {loc.phone} for opening hours</p>}
              </address>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to={`/book?location=${loc.id}`} className="btn-primary px-5 py-2.5">
                  Book here
                </Link>
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5 py-2.5">
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="container-page">
        <div className="rounded-[var(--radius-card)] bg-brand-700 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Pick your clinic and your dentist, and we will put you straight through to the right
            number.
          </p>
          <Link to="/book" className="btn mt-8 bg-white px-8 py-4 text-base text-brand-800 hover:bg-brand-50">
            Book an Appointment
          </Link>
        </div>
      </section>
    </>
  )
}

function ServiceIcon({ name }) {
  const paths = {
    sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z',
    anchor: 'M12 7v13M8 11H5a7 7 0 0014 0h-3M12 7a2 2 0 100-4 2 2 0 000 4Z',
    align: 'M4 7h16M7 12h10M10 17h4',
    smile: 'M12 21a9 9 0 100-18 9 9 0 000 18ZM8.5 13a4 4 0 007 0',
    shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z',
    heart: 'M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9Z',
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.sparkle} />
    </svg>
  )
}
