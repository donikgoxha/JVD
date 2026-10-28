import Section from '../components/Section.jsx'
import InstagramCard, { InstagramGallery } from '../components/InstagramCard.jsx'
import { CallBand, PageHero, ServicesGrid } from '../components/Blocks.jsx'

/*
 * NOTE ON THE GALLERY
 *
 * This page once carried four invented before/after case studies, captioned as
 * real patients "published with written consent" — a fabricated clinical claim
 * about a real practice, so they were removed.
 *
 * The gallery now comes from INSTAGRAM_POSTS in src/data/clinic.js: real posts
 * from the clinic's own feed, which the clinic has already chosen to publish.
 * Until that list is filled, the Instagram card stands on its own.
 */

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
        lead="Our day-to-day work is published on Instagram — treatments as they were finished, in the clinic, on real patients. It is the most honest look at what we do, and it is updated far more often than any website gallery."
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
          is a guarantee of outcome — come in for a consultation and we will tell you honestly what
          is achievable in your case.
        </p>
      </Section>

      <CallBand />
    </>
  )
}
