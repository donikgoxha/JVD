import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Img from '../components/Img.jsx'
import { CLINIC, DOCTORS, locationsForDoctor } from '../data/clinic.js'

// TODO: placeholder history — replace every entry with the clinic's real
// milestones and dates. Nothing here has been confirmed.
const TIMELINE = [
  { year: '2012', title: 'One chair, one room', text: 'JVD opens as a single-surgery practice in central Gostivar.' },
  { year: '2016', title: 'Digital imaging', text: 'Intraoral scanning and digital radiography replace impressions and film.' },
  { year: '2020', title: 'Specialist team', text: 'Orthodontics and implantology join the general practice.' },
  { year: '2024', title: 'Second location', text: 'The Ciglana clinic opens to shorten waiting times across the city.' },
]

// TODO: these are promises the practice has to keep — written estimates,
// sterilisation logging, longer appointments. Confirm each one is true before
// launch, or cut it.
const VALUES = [
  { title: 'Explain before you treat', text: 'Nothing starts until you understand the plan, the alternatives and the cost.' },
  { title: 'Fixed, written pricing', text: 'You get a written estimate before treatment. No surprises at the desk.' },
  { title: 'Gentle by default', text: 'Longer appointments and modern anaesthesia — built for anxious patients.' },
  { title: 'Sterility, verified', text: 'Every instrument cycle is logged and traceable to your appointment.' },
]

export default function About() {
  return (
    <>
      <section className="border-b border-line bg-brand-50/60">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            A family practice that grew up, without losing the family part.
          </h1>
          {/* TODO: placeholder story. The founding year and the growth arc are
              not confirmed — replace with the clinic's own account before launch. */}
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

      <Section eyebrow="History" title="How we got here" className="bg-brand-50/40">
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((item) => (
            <li key={item.year} className="border-t-2 border-brand-300 pt-5">
              <p className="text-sm font-bold text-brand-700">{item.year}</p>
              <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="The team" title="Who you will actually meet" lead="Every doctor below takes bookings directly through the online calendar.">
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
