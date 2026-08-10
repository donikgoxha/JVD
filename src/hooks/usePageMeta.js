import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')

/**
 * Per-route <title>, meta description and canonical URL.
 *
 * index.html can only carry one set of tags, and a four-page SPA that reports
 * the same title and canonical on every route gets those routes collapsed or
 * ignored in search results. This rewrites them on navigation.
 *
 * Search engines do execute JavaScript, so this is picked up — but it lands
 * after first paint. The structured data that matters most (addresses, phones,
 * practitioners) is injected statically at build time by vite.config.js instead.
 */
const META = {
  '/': {
    title: 'JVD Dental Clinic — Dentist in Gostivar',
    description:
      'A family dental practice with two clinics in Gostivar. Three dentists, one standard of care. Call to book an appointment.',
  },
  '/about': {
    title: 'About Us — JVD Dental Clinic, Gostivar',
    description:
      'Meet the dentists behind JVD Dental Clinic and the way we work: explain before we treat, and never rush an appointment.',
  },
  '/our-work': {
    title: 'Our Work — JVD Dental Clinic, Gostivar',
    description:
      'See real treatments from our clinics on Instagram, and the dental work we do most in Gostivar.',
  },
  '/book': {
    title: 'Book an Appointment — JVD Dental Clinic, Gostivar',
    description:
      'Choose your clinic and your dentist in Gostivar, and get the direct number to book your appointment.',
  },
}

const FALLBACK = {
  title: 'Page not found — JVD Dental Clinic',
  description: 'That page does not exist. Find our clinics and dentists in Gostivar.',
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = META[pathname] ?? FALLBACK
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('link[rel="canonical"]', 'href', canonical)

    // A 404 must not invite indexing. React cannot send a status code, so the
    // meta robots tag is the only signal available on a static host.
    const existing = document.head.querySelector('meta[name="robots"]')
    if (META[pathname]) {
      existing?.remove()
    } else if (!existing) {
      const tag = document.createElement('meta')
      tag.name = 'robots'
      tag.content = 'noindex'
      document.head.appendChild(tag)
    }
  }, [pathname])
}
