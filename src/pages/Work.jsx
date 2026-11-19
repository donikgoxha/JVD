import Section from '../components/Section.jsx'
import InstagramCard, { InstagramGallery } from '../components/InstagramCard.jsx'
import { CallBand, PageHero, ServicesGrid } from '../components/Blocks.jsx'

// The invented before/after cases that used to live here were removed. The
// gallery is now INSTAGRAM_POSTS (clinic.js): only posts the clinic itself published.

export default function Work() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={
          <>
            See the work <em>before</em> you sit in the chair.
          </>
        }
        lead="We post our day-to-day work on Instagram: treatments as they were finished, in the clinic, on real patients. It's the most honest look at what we do, and it gets updated far more often than a website gallery would."
      />

      <section className="container-page">
        <InstagramCard />
        <InstagramGallery />
      </section>

      <Section
        eyebrow="What we treat"
        title={
          <>
            The work we do <em>most</em>.
          </>
        }
        lead="Whatever you have seen on the feed, it started with one of these."
      >
        <ServicesGrid />
        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">
          Results depend on your starting condition, oral hygiene and healing. Nothing on this page
          is a guarantee of outcome. Come in for a consultation and we'll tell you honestly what's
          achievable in your case.
        </p>
      </Section>

      <CallBand />
    </>
  )
}
