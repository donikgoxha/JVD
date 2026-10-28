import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, CLINIC, telHref } from '../data/clinic.js'
import Icon, { Logo } from './Icons.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // The bar floats transparent over the hero and gains a surface once the
  // page scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const raised = scrolled || open

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div
        className={`mx-auto max-w-6xl rounded-[1.75rem] border transition-all duration-300 ${
          raised
            ? 'border-line/80 bg-white/85 shadow-[0_10px_40px_-18px_rgb(15_23_42/0.35)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav className="flex h-16 items-center justify-between pl-3 pr-2 sm:pl-4" aria-label="Main">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${CLINIC.name} — home`}>
            <Logo />
            <span className="leading-none">
              <span className="font-display block text-lg font-semibold">JVD Dental</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                {CLINIC.city}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-600/10 text-brand-700' : 'text-muted hover:text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={telHref(CLINIC.phone)} className="btn-primary hidden px-5 py-2.5 sm:inline-flex">
              <Icon name="phone" className="h-4 w-4" />
              Call us
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white/70 md:hidden"
            >
              <Burger open={open} />
            </button>
          </div>
        </nav>

        {open && (
          <div id="mobile-menu" className="px-3 pb-3 md:hidden">
            <ul className="flex flex-col border-t border-line pt-2">
              {NAV.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `font-display flex items-center justify-between rounded-2xl px-3 py-3 text-2xl ${
                        isActive ? 'text-brand-700' : 'text-ink'
                      }`
                    }
                  >
                    {link.label}
                    <Icon name="arrow" className="h-5 w-5 text-muted" />
                  </NavLink>
                </li>
              ))}
              <li className="pt-3">
                <a href={telHref(CLINIC.phone)} className="btn-primary w-full py-3.5">
                  <Icon name="phone" className="h-4 w-4" />
                  Call {CLINIC.phone}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
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
          <path d="M3 7h14" />
          <path d="M3 13h14" />
        </>
      )}
    </svg>
  )
}
