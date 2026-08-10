import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import InstagramCard from '../components/InstagramCard.jsx'
import Img from '../components/Img.jsx'

// Replace with real, consented patient photography. Keep both images the same
// aspect ratio so the before/after slider halves line up.
const CASES = [
  {
    id: 'veneers',
    title: 'Ceramic veneers, upper six',
    summary: 'Worn and discoloured anteriors rebuilt with minimal-prep lithium disilicate veneers.',
    duration: '3 visits · 2 weeks',
    before: '/work/veneers-before.webp',
    after: '/work/veneers-after.webp',
  },
  {
    id: 'implant',
    title: 'Single implant, lower molar',
    summary: 'Immediate placement after extraction, restored with a screw-retained zirconia crown.',
    duration: '2 visits · 4 months healing',
    before: '/work/implant-before.webp',
    after: '/work/implant-after.webp',
  },
  {
    id: 'aligners',
    title: 'Clear aligner treatment',
    summary: 'Moderate lower crowding corrected in 14 months without fixed appliances.',
    duration: '14 months',
    before: '/work/aligners-before.webp',
    after: '/work/aligners-after.webp',
  },
  {
    id: 'whitening',
    title: 'In-chair whitening',
    summary: 'Four shades in a single session, with a take-home maintenance kit.',
    duration: '1 visit · 90 minutes',
    before: '/work/whitening-before.webp',
    after: '/work/whitening-after.webp',
  },
]

export default function Work() {
  return (
    <>
      <section className="border-b border-line bg-brand-50/60">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Our work</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Cases from our chairs, not a catalogue.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Every case below was treated at JVD Dental Clinic in Gostivar and published with the
            patient's written consent. Results vary — book a consultation and we will tell you
            honestly what is achievable for your case.
          </p>
        </div>
      </section>

      {/* ── CRITICAL FEATURE: Instagram box, first thing on the page ───────── */}
      <div className="container-page pt-14 sm:pt-16">
        <InstagramCard />
      </div>

      <Section eyebrow="Case gallery" title="Before and after" lead="Photographed under the same lighting and angle, unretouched.">
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {CASES.map((item) => (
            <li key={item.id} className="card overflow-hidden p-0">
              <div className="grid grid-cols-2 gap-px bg-line">
                <figure className="relative bg-white">
                  <Img
                    src={item.before}
                    alt={`${item.title} — before treatment`}
                    width="600"
                    height="450"
                    icon="tooth"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Before
                  </figcaption>
                </figure>
                <figure className="relative bg-white">
                  <Img
                    src={item.after}
                    alt={`${item.title} — after treatment`}
                    width="600"
                    height="450"
                    icon="tooth"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    After
                  </figcaption>
                </figure>
              </div>

              <div className="p-6">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand-600">{item.duration}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          Photographs published with patient consent. Individual results depend on starting condition,
          oral hygiene and healing. Nothing on this page is a guarantee of outcome.
        </p>
      </Section>

      <section className="container-page pb-4">
        <div className="card flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Want to know what is possible for your teeth?</h2>
            <p className="mt-2 text-sm text-muted">
              A consultation includes an exam, photos and a written plan with fixed pricing.
            </p>
          </div>
          <Link to="/book" className="btn-primary shrink-0 px-7 py-3.5">
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  )
}
