import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon, { InstagramGlyph } from '../components/Icons.jsx'
import { LocationCards, PageHero } from '../components/Blocks.jsx'
import { CLINIC, DOCTORS, LOCATIONS, locationsForDoctor, telHref } from '../data/clinic.js'

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Come and <em>say hello</em>.
          </>
        }
        lead={`${LOCATIONS.length} clinics in ${CLINIC.city}, and a direct line to every dentist. Call whichever suits you — the number goes straight to the clinic.`}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          {LOCATIONS.map((loc) => (
            <a key={loc.id} href={`#${loc.id}`} className="btn-ghost px-5 py-2.5">
              <Icon name="pin" className="h-4 w-4 text-brand-600" />
              {loc.name}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="container-page pb-4">
        <LocationCards />
      </section>

      <Section
        eyebrow="Direct lines"
        title={
          <>
            Call your <em>dentist</em> directly.
          </>
        }
      >
        <ul className="mt-12 divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line/70 bg-white">
          {DOCTORS.map((doc, i) => (
            <Reveal as="li" key={doc.id} delay={i * 80}>
              <a
                href={telHref(doc.phone)}
                className="group flex flex-col gap-3 px-6 py-6 transition-colors hover:bg-brand-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-8"
              >
                <span>
                  <span className="font-display block text-2xl font-medium">{doc.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {doc.role} · {locationsForDoctor(doc.id).map((l) => l.name).join(' · ')}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-display text-2xl text-brand-700">{doc.phone}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-white transition-transform duration-300 group-hover:rotate-12">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href={CLINIC.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex items-center gap-4 transition-transform hover:-translate-y-0.5"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
              <InstagramGlyph className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm text-muted">Message us on Instagram</span>
              <span className="block font-semibold">{CLINIC.instagramHandle}</span>
            </span>
            <Icon name="arrowUpRight" className="ml-auto h-5 w-5 text-muted transition-colors group-hover:text-ink" />
          </a>
          {CLINIC.email ? (
            <a href={`mailto:${CLINIC.email}`} className="card group flex items-center gap-4 transition-transform hover:-translate-y-0.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name="mail" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm text-muted">Email</span>
                <span className="block font-semibold">{CLINIC.email}</span>
              </span>
            </a>
          ) : (
            <div className="card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name="phone" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm text-muted">Main line</span>
                <a href={telHref(CLINIC.phone)} className="block font-semibold hover:text-brand-700">
                  {CLINIC.phone}
                </a>
              </span>
            </div>
          )}
        </Reveal>
      </Section>
    </>
  )
}
