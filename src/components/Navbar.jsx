import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, CLINIC } from '../data/clinic.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer on every route change.
  useEffect(() => setOpen(false), [pathname])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = NAV.filter((l) => l.to !== '/book')

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${CLINIC.name} — home`}>
          <Logo />
          <span className="text-[15px] font-bold tracking-tight">
            JVD <span className="font-medium text-muted">Dental</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/book" className="btn-primary hidden px-5 py-2.5 sm:inline-flex">
            Book Now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          >
            <Burger open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
          <ul className="container-page flex flex-col py-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block border-b border-line/70 py-3.5 text-base font-medium ${
                      isActive ? 'text-brand-700' : 'text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="py-4">
              <Link to="/book" className="btn-primary w-full">
                Book an Appointment
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--color-brand-600)" />
      <path
        d="M16 8c-3 0-4.2 1.4-6 1.4S7 11 7 13.5c0 3 1.3 5.6 2.3 7.6.7 1.5 1.3 2.9 2.4 2.9 1.2 0 1.6-1.6 2.2-3.2.4-1 .7-1.8 2.1-1.8s1.7.8 2.1 1.8c.6 1.6 1 3.2 2.2 3.2 1.1 0 1.7-1.4 2.4-2.9 1-2 2.3-4.6 2.3-7.6C25 11 23.8 9.4 22 9.4S19 8 16 8Z"
        fill="#fff"
      />
    </svg>
  )
}

function Burger({ open }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <path d="M5 5l10 10" />
          <path d="M15 5L5 15" />
        </>
      ) : (
        <>
          <path d="M3 6h14" />
          <path d="M3 10h14" />
          <path d="M3 14h14" />
        </>
      )}
    </svg>
  )
}
