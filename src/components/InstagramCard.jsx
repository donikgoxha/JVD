import { CLINIC, INSTAGRAM_POSTS } from '../data/clinic.js'
import Icon, { InstagramGlyph } from './Icons.jsx'
import Img from './Img.jsx'
import Reveal from './Reveal.jsx'

/**
 * One large, unmissable card that sends people to the clinic's real Instagram
 * feed. It is a single <a> so the whole surface is one tap target on mobile,
 * and it opens in a new tab so the patient does not lose the site.
 */
export default function InstagramCard() {
  return (
    <Reveal>
      <a
        href={CLINIC.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the ${CLINIC.name} Instagram profile in a new tab`}
        className="grain group relative isolate block overflow-hidden rounded-[2rem] bg-deep px-6 py-12 text-white shadow-[0_30px_60px_-30px_rgb(12_43_54/0.6)] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 sm:px-14 sm:py-16"
      >
        {/* Instagram-warm glows, decorative only */}
        <span className="pointer-events-none absolute -right-20 -top-28 -z-10 h-96 w-96 rounded-full bg-[#d6249f]/30 blur-3xl transition-opacity duration-500 group-hover:opacity-80" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-36 right-1/3 -z-10 h-96 w-96 rounded-full bg-peach-400/35 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-brand-500/35 blur-3xl" aria-hidden="true" />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-peach-300" aria-hidden="true" />
              Live from the clinic
            </span>

            <h2 className="font-display mt-6 text-4xl leading-[1.05] font-medium sm:text-5xl">
              See the real results <em className="text-peach-300">on Instagram</em>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/90 sm:text-lg">
              Our feed is not a stock-photo gallery. It is{' '}
              <strong className="font-semibold text-white">
                real models, actual clients of this clinic, and our products shown in real hands
              </strong>{' '}
              — before and after shots, treatment days, and the work exactly as it left the chair.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {['Before & after', 'Real patients', 'Products in hand', 'Behind the scenes'].map((tag) => (
                <li key={tag} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-brand-50 ring-1 ring-inset ring-white/15">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <span className="grid h-24 w-24 place-items-center rounded-[1.75rem] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
              <InstagramGlyph className="h-12 w-12 text-white" />
            </span>
            <span className="btn bg-white px-7 py-4 text-base text-deep shadow-lg group-hover:bg-peach-200">
              Follow {CLINIC.instagramHandle}
              <Icon name="arrowUpRight" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <span className="text-xs text-brand-200">Opens Instagram in a new tab</span>
          </div>
        </div>
      </a>
    </Reveal>
  )
}

/**
 * Grid of real posts from INSTAGRAM_POSTS in clinic.js. Renders nothing while
 * that list is empty — the card above stands on its own, and an empty grid of
 * placeholders would read as "no work to show".
 */
export function InstagramGallery({ limit }) {
  const posts = limit ? INSTAGRAM_POSTS.slice(0, limit) : INSTAGRAM_POSTS
  if (posts.length === 0) return null

  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {posts.map((post, i) => (
        <Reveal as="li" key={post.id} delay={(i % 3) * 80}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-[1.25rem]"
          >
            <Img
              src={post.image}
              alt={post.alt}
              width="800"
              height="800"
              icon="tooth"
              className="aspect-square w-full transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-deep/80 via-deep/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <InstagramGlyph className="h-4 w-4 shrink-0" />
                {post.caption}
              </span>
            </span>
          </a>
        </Reveal>
      ))}
    </ul>
  )
}
