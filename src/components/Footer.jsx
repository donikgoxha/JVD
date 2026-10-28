import { Link } from 'react-router-dom'
import { CLINIC, LOCATIONS, NAV, telHref } from '../data/clinic.js'
import { InstagramGlyph, Logo } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="mt-20 bg-deep text-brand-100">
      {/* Brand | locations | nav. The locations column is its own auto-fit grid
          so a third or fourth clinic widens that band instead of pushing the
          nav onto a second row. */}
      <div className="container-page grid gap-12 pb-12 pt-16 lg:grid-cols-[1.3fr_2.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <p className="font-display text-2xl font-medium text-white">{CLINIC.name}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
            A family dental practice in {CLINIC.city}. {LOCATIONS.length} clinics, one standard of care.
          </p>
          <a
            href={CLINIC.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            <InstagramGlyph className="h-4 w-4" />
            {CLINIC.instagramHandle}
          </a>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">{loc.name}</p>
              <address className="mt-4 space-y-2 text-sm not-italic text-brand-100">
                <p>{loc.address}</p>
                {loc.hours && <p>{loc.hours}</p>}
                <a href={telHref(loc.phone)} className="block font-medium text-white hover:text-peach-200">
                  {loc.phone}
                </a>
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="block underline decoration-white/30 underline-offset-4 hover:text-white">
                  Open in Maps
                </a>
              </address>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            {CLINIC.email && (
              <li>
                <a href={`mailto:${CLINIC.email}`} className="hover:text-white">
                  {CLINIC.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — decorative, the name is already in the brand column. */}
      <div className="container-page overflow-hidden" aria-hidden="true">
        <p className="font-display select-none text-center text-[22vw] leading-[0.8] font-semibold tracking-tighter text-white/[0.06] lg:text-[11rem]">
          JVD Dental
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
          </p>
          <p>
            Main line:{' '}
            <a href={telHref(CLINIC.phone)} className="text-brand-100 hover:text-white">
              {CLINIC.phone}
            </a>
          </p>
        </div>
      </div>

      {/* Build credit — the last line on the page. */}
      <div className="border-t border-white/10">
        <p className="footer__craft container-page py-5 text-center text-xs text-brand-300">
          Crafted by{' '}
          <a
            href="https://dgdsmart.com"
            target="_blank"
            rel="noopener"
            className="font-medium text-brand-100 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            DGDsmart
          </a>
          <span className="tm align-super text-[0.7em]">™</span>
        </p>
      </div>
    </footer>
  )
}
