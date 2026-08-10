import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import InstagramCard from '../components/InstagramCard.jsx'
import { CLINIC, SERVICES } from '../data/clinic.js'

/*
 * NOTE ON THE CASE GALLERY
 *
 * This page previously carried four invented before/after case studies, each
 * captioned as a real patient treated at JVD and "published with the patient's
 * written consent". That is a fabricated clinical claim about a real practice,
 * so it was removed rather than shipped to a public, indexable page.
 *
 * To put a real gallery back you need, per case: the photographs, the treatment
 * description, and written patient consent on file. Until then the Instagram
 * feed is the honest showcase — it contains actual clinic work, and it is owned
 * and updated by the clinic itself.
 */

export default function Work() {
  return (
    <>
      <section className="border-b border-line bg-brand-50/60">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Our work</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            See the work before you sit in the chair.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Our day-to-day work is published on Instagram — treatments as they were finished, in
            the clinic, on real patients. It is the most honest look at what we do, and it is
            updated far more often than any website gallery.
          </p>
        </div>
      </section>

      {/* ── CRITICAL FEATURE: Instagram box, first thing on the page ───────── */}
      <div className="container-page pt-14 sm:pt-16">
        <InstagramCard />
      </div>

      <Section
        eyebrow="What we treat"
        title="The work we do most"
        lead="Whatever you have seen on the feed, it started with one of these."
      >
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.id} className="card">
              <h3 className="text-base font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{service.desc}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
          Results depend on your starting condition, oral hygiene and healing. Nothing on this page
          is a guarantee of outcome — book a consultation and we will tell you honestly what is
          achievable in your case.
        </p>
      </Section>

      <section className="container-page pb-4">
        <div className="card flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Want to know what is possible for your teeth?</h2>
            <p className="mt-2 text-sm text-muted">
              A consultation includes an examination and a treatment plan you can take away.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/book" className="btn-primary px-7 py-3.5">
              Book a consultation
            </Link>
            <a href={`tel:${CLINIC.phone.replace(/\s/g, '')}`} className="btn-ghost px-7 py-3.5">
              Call {CLINIC.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
