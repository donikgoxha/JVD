import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')

// Per-route title, description, canonical and robots. index.html only has one set.
const META = {
  '/': {
    title: 'JVD Dental Clinic | Dentist in Gostivar',
    description:
      'Family dental practice in Gostivar with clinics on Boulevard Goce Delchev and Brakja Gjinoski. Call either clinic or your dentist directly.',
  },
  '/about': {
    title: 'About Us | JVD Dental Clinic, Gostivar',
    description:
      'Meet the dentists behind JVD Dental Clinic and the way we work: explain before we treat, and never rush an appointment.',
  },
  '/our-work': {
    title: 'Our Work | JVD Dental Clinic, Gostivar',
    description:
      'See real treatments from our clinics on Instagram, and the dental work we do most in Gostivar.',
  },
  '/contact': {
    title: 'Contact | JVD Dental Clinic, Gostivar',
    description:
      'Addresses, directions and direct phone numbers for both JVD Dental clinics and all three dentists in Gostivar.',
  },
}

const FALLBACK = {
  title: 'Page not found | JVD Dental Clinic',
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

    // A static host can't send a 404 status, so noindex is the only signal we have.
    setMeta('meta[name="robots"]', 'content', META[pathname] ? 'index, follow' : 'noindex')
  }, [pathname])
}
