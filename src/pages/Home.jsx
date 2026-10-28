import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import InstagramCard, { InstagramGallery } from '../components/InstagramCard.jsx'
import Icon, { InstagramGlyph, TOOTH_PATH } from '../components/Icons.jsx'
import {
  CallBand,
  Glow,
  LocationCards,
  Marquee,
  ServicesGrid,
  TeamGrid,
  ValuesBand,
} from '../components/Blocks.jsx'
import { CLINIC, DOCTORS, LOCATIONS, telHref } from '../data/clinic.js'

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <Section
        eyebrow="What we do"
        title={
          <>
            Care for <em>every smile</em> in the family.
          </>
        }
        lead="The treatments our patients ask for most, from a first check-up onwards."
      >
        <ServicesGrid />
      </Section>

      <ValuesBand />

      <Section
        eyebrow="The team"
        title={
          <>
            {COUNT_WORDS[DOCTORS.length] ?? DOCTORS.length} dentists, <em>one family</em>.
          </>
        }
        lead="The people you will actually meet. Each one is reachable on their own direct line."
      >
        <TeamGrid />
      </Section>

      <section className="container-page">
        <InstagramCard />
        <InstagramGallery limit={6} />
      </section>

      <Section
        eyebrow="Find us"
        title={
          <>
            {COUNT_WORDS[LOCATIONS.length] ?? LOCATIONS.length} clinics in <em>{CLINIC.city}</em>.
          </>
        }
        lead="Choose whichever is closer — the same standard of care at both addresses."
      >
        <LocationCards />
      </Section>

      <CallBand />
    </>
  )
}

function Hero() {
  return (
    <section className="grain relative isolate -mt-19 overflow-hidden pt-19">
      <Glow />
      <div className="container-page grid items-center gap-14 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 py-1.5 pl-2 pr-4 text-xs font-semibold text-ink backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white">
              <Icon name="sparkle" className="h-3 w-3" strokeWidth={2.2} />
            </span>
            Family dental practice · {CLINIC.city}
          </p>

          <h1 className="font-display mt-7 text-[3.25rem] leading-[0.98] font-medium sm:text-7xl lg:text-[5.5rem]">
            Healthy smiles, <em className="text-brand-600">cared for</em> close to home.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {CLINIC.name} is a family practice with {LOCATIONS.length} clinics in {CLINIC.city} —{' '}
            {DOCTORS.length} dentists, one standard of care, and all the time you need to ask
            questions.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={telHref(CLINIC.phone)} className="btn-primary px-8 py-4 text-base">
              <Icon name="phone" className="h-5 w-5" />
              Call {CLINIC.phone}
            </a>
            <Link to="/contact" className="btn-ghost px-8 py-4 text-base">
              Find a clinic
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-ink/10 pt-8">
            {/* Only verifiable facts here. Do not add a years-in-practice or a
                star-rating figure until the clinic confirms the real number. */}
            {[
              [String(LOCATIONS.length), `Clinics in ${CLINIC.city}`],
              [String(DOCTORS.length), 'Dentists'],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl font-medium text-brand-700">{stat}</dt>
                <dd className="mt-1 text-sm text-muted">{label}</dd>
              </div>
            ))}
            <div>
              <dt className="font-display text-4xl font-medium text-brand-700">
                <InstagramGlyph className="h-9 w-9" />
              </dt>
              <dd className="mt-1 text-sm">
                <a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" className="text-muted underline decoration-ink/20 underline-offset-4 hover:text-brand-700">
                  {CLINIC.instagramHandle}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-brand-200 to-peach-200 p-2.5 shadow-[0_40px_80px_-40px_rgb(29_119_145/0.6)]">
            <Img
              src="/hero-clinic.webp"
              alt="Treatment room at JVD Dental Clinic"
              width="960"
              height="1200"
              loading="eager"
              fetchPriority="high"
              icon="tooth"
              label="Clinic photo"
              className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2rem]"
            />
          </div>

          <RotatingBadge />

          <div className="absolute -bottom-6 -left-2 animate-float rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur sm:-left-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Your dentists</p>
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true">
                {DOCTORS.map((d) => (
                  <span key={d.id} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-brand-600 text-[11px] font-bold text-white">
                    {d.name.replace(/^Dr\.?\s+/, '')[0]}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium leading-tight text-ink">
                {DOCTORS.map((d) => d.shortName).join(', ')}
              </p>
            </div>
          </div>

          <a
            href={telHref(CLINIC.phone)}
            className="absolute -right-2 bottom-24 hidden items-center gap-3 rounded-2xl bg-deep p-3 pr-5 text-white shadow-xl transition-transform hover:-translate-y-0.5 sm:flex lg:-right-8"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-peach-300 text-deep">
              <Icon name="phone" className="h-5 w-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block text-brand-200">Questions?</span>
              <span className="font-semibold">Call us</span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/** Circular "JVD DENTAL · GOSTIVAR" text that turns slowly around the tooth mark. */
function RotatingBadge() {
  const text = `${CLINIC.name} · ${CLINIC.city} · `.toUpperCase()
  return (
    <div className="absolute -right-3 -top-3 h-32 w-32 sm:-right-6 sm:h-36 sm:w-36" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-cream shadow-lg" />
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
        </defs>
        <text className="fill-brand-700 text-[10.5px] font-semibold tracking-[0.18em]">
          {/* textLength = the circle's circumference (2πr, r=44), so the
              phrase closes the loop exactly whatever its length. */}
          <textPath href="#badge-circle" textLength="276" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 32 32" className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2">
        <circle cx="16" cy="16" r="16" fill="var(--color-brand-600)" />
        <path d={TOOTH_PATH} fill="#fff" transform="translate(4.4 4.6) scale(0.72)" />
      </svg>
    </div>
  )
}
