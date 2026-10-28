import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import { CallBand, PageHero, TeamGrid, ValuesBand } from '../components/Blocks.jsx'
import { CLINIC, DOCTORS, LOCATIONS } from '../data/clinic.js'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            A family practice, <em>two clinics</em>, one standard.
          </>
        }
        // TODO: the clinic's own story — founding year, how the second clinic
        // came about — is not confirmed, so nothing is claimed here. Ask for it
        // and expand this paragraph.
        lead={`${CLINIC.name} is a family practice in ${CLINIC.city}, run by the Selimi family across ${LOCATIONS.length} clinics, on one rule: never treat a patient who does not understand what is about to happen.`}
      />

      <section className="container-page py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Our mission</p>
            <blockquote className="font-display mt-6 text-4xl leading-[1.1] font-medium sm:text-5xl">
              “Dentistry is judged in <em className="text-brand-600">years</em>, not appointments.”
            </blockquote>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              A restoration that looks perfect on the day and fails in four is a failure. We plan
              around longevity — conservative preparation, materials chosen for durability, and
              recall schedules that catch problems while they are still small and cheap.
            </p>
            <p>
              The second half of the job is trust. Most people who avoid the dentist do so because
              of one bad experience, usually years ago. We build appointments with enough time to
              slow down, explain, and stop when someone needs to stop.
            </p>
          </Reveal>
        </div>
      </section>

      <ValuesBand eyebrow="What we stand for" lead="The same four principles at both clinics, whichever dentist you see." />

      <Section
        eyebrow="The team"
        title={
          <>
            Who you will <em>actually meet</em>.
          </>
        }
        lead={`${DOCTORS.length} dentists across ${LOCATIONS.length} clinics. Each one is reachable directly.`}
      >
        <TeamGrid />
      </Section>

      <CallBand />
    </>
  )
}
