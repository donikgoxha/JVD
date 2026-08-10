import { CLINIC } from '../data/clinic.js'
import { InstagramGlyph } from './Footer.jsx'

/**
 * The headline element of the "Our Work" page: one large, unmissable card that
 * sends people to the clinic's real Instagram feed. It is a single <a> so the
 * whole surface is one tap target on mobile, and it opens in a new tab so the
 * patient does not lose the site.
 */
export default function InstagramCard() {
  return (
    <a
      href={CLINIC.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the ${CLINIC.name} Instagram profile in a new tab`}
      className="group relative block overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-px shadow-xl transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      {/* Soft glow, decorative only */}
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
        aria-hidden="true"
      />

      <div className="relative rounded-[calc(var(--radius-card)-1px)] px-6 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/25">
              <InstagramGlyph className="h-3.5 w-3.5" />
              Live from the clinic
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              See the real results on Instagram
            </h2>

            <p className="mt-4 text-base leading-relaxed text-brand-100 sm:text-lg">
              Our feed is not a stock-photo gallery. It is <strong className="font-semibold text-white">real
              models, actual clients of this clinic, and our products shown in real hands</strong> — before
              and after shots, treatment days, and the work exactly as it left the chair.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {['Before & after', 'Real patients', 'Products in hand', 'Behind the scenes'].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-50 ring-1 ring-inset ring-white/20"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            <span className="btn w-full bg-white px-7 py-4 text-base text-brand-800 shadow-lg transition-colors group-hover:bg-brand-50 lg:w-auto">
              <InstagramGlyph className="h-5 w-5" />
              Visit {CLINIC.instagramHandle}
              <ArrowUpRight />
            </span>
            <p className="mt-3 text-center text-xs text-brand-200 lg:text-right">Opens Instagram in a new tab</p>
          </div>
        </div>
      </div>
    </a>
  )
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 14L14 6M7 6h7v7" />
    </svg>
  )
}
