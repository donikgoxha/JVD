import { Link } from 'react-router-dom'
import { CLINIC, LOCATIONS, NAV } from '../data/clinic.js'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-brand-900 text-brand-100">
      {/* Brand | locations | nav. The locations column is its own auto-fit grid
          so a third or fourth clinic widens that band instead of pushing the
          nav onto a second row. */}
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_2.2fr_1fr]">
        <div>
          <p className="text-lg font-bold text-white">{CLINIC.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-200">
            Modern, gentle dental care in {CLINIC.city}. {LOCATIONS.length} locations, one standard.
          </p>
          <a
            href={CLINIC.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-200"
          >
            <InstagramGlyph className="h-4 w-4" />
            {CLINIC.instagramHandle}
          </a>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.id}>
              <p className="text-sm font-semibold text-white">{loc.name}</p>
              <address className="mt-3 space-y-1.5 text-sm not-italic text-brand-200">
                <p>{loc.address}</p>
                <p>{loc.hours}</p>
                <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="block hover:text-white">
                  {loc.phone}
                </a>
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="block underline underline-offset-4 hover:text-white">
                  Open in Maps
                </a>
              </address>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            {NAV.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${CLINIC.email}`} className="hover:text-white">
                {CLINIC.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
          </p>
          <p>Emergencies outside opening hours: call {CLINIC.phone}.</p>
        </div>
      </div>
    </footer>
  )
}

export function InstagramGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
