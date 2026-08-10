import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Img from '../components/Img.jsx'
import { CLINIC, DOCTORS, locationsForDoctor } from '../data/clinic.js'

// Kept deliberately non-promissory. "Fixed, written pricing" and "Sterility,
// verified" used to sit here — both are operational guarantees the practice
// would have to honour, and neither was confirmed. Do not add a claim here
// unless the clinic has told you it is true.
const VALUES = [
  {
    title: 'Explain before you treat',
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

export default function About() {
  return (
    <>
      <section className="border-b border-line bg-brand-50/60">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            A family practice, across two clinics in Gostivar.
          </h1>
          {/* TODO: the clinic's own story — founding year, how the second clinic
              came about — is not confirmed, so nothing is claimed here. Ask for
              it and expand this paragraph. */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {CLINIC.name} is a family practice in {CLINIC.city}, run by the Selimi family across two
            clinics, on one rule: never treat a patient who does not understand what is about to
            happen.
          </p>
        </div>
      </section>

      <Section eyebrow="Our mission" title="Care that holds up over decades, not appointments">
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted">
            <p>
              Dentistry is judged in years. A restoration that looks perfect on the day and fails in
              four is a failure. We plan around longevity — conservative preparation, materials chosen
              for durability, and recall schedules that catch problems while they are still small and
              cheap.
            </p>
            <p>
              The second half of the job is trust. Most people who avoid the dentist do so because of
              one bad experience, usually years ago. We build appointments with enough time to slow
              down, explain, and stop when someone needs to stop.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <li key={value.title} className="card">
                <h3 className="text-sm font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section eyebrow="The team" title="Who you will actually meet" lead="Three dentists across two clinics. Each one is reachable directly.">
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((doc) => {
            const worksAt = locationsForDoctor(doc.id)
            return (
              <li key={doc.id} className="card">
                <Img
                  src={doc.photo}
                  alt={doc.name}
                  width="400"
                  height="400"
                  icon="person"
                  label="Portrait"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
                <h3 className="mt-5 text-lg font-semibold">{doc.name}</h3>
                <p className="text-sm font-medium text-brand-600">{doc.role}</p>
                {doc.bio && <p className="mt-3 text-sm leading-relaxed text-muted">{doc.bio}</p>}
                <p className="mt-4 text-xs text-muted">
                  Consults at: {worksAt.map((l) => l.name).join(' · ')}
                </p>
                <a href={`tel:${doc.phone.replace(/\s/g, '')}`} className="mt-1 block text-xs text-brand-700">
                  {doc.phone}
                </a>
                <Link to={`/book?doctor=${doc.id}`} className="btn-ghost mt-5 w-full">
                  Book with {doc.shortName}
                </Link>
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}
