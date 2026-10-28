/*
 * The site's whole icon set, as inline SVG paths. A handful of icons as paths
 * costs a few hundred bytes; an icon package would cost tens of kilobytes.
 * Every icon is decorative (aria-hidden) — the adjacent text carries meaning.
 */
const PATHS = {
  phone:
    'M5 4h3.2l1.6 4-2 1.3a11 11 0 005 5l1.3-2 4 1.6V17a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2Z',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21Zm0-8.5a3 3 0 100-6 3 3 0 000 6Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7M8 7h9v9',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z',
  anchor: 'M12 7v13M8 11H5a7 7 0 0014 0h-3M12 7a2 2 0 100-4 2 2 0 000 4Z',
  align: 'M4 7h16M7 12h10M10 17h4',
  smile: 'M12 21a9 9 0 100-18 9 9 0 000 18ZM8.5 13a4 4 0 007 0',
  shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z',
  heart: 'M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9Z',
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.sparkle} />
    </svg>
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

/** The JVD tooth mark, as used in the favicon. */
export const TOOTH_PATH =
  'M16 8c-3 0-4.2 1.4-6 1.4S7 11 7 13.5c0 3 1.3 5.6 2.3 7.6.7 1.5 1.3 2.9 2.4 2.9 1.2 0 1.6-1.6 2.2-3.2.4-1 .7-1.8 2.1-1.8s1.7.8 2.1 1.8c.6 1.6 1 3.2 2.2 3.2 1.1 0 1.7-1.4 2.4-2.9 1-2 2.3-4.6 2.3-7.6C25 11 23.8 9.4 22 9.4S19 8 16 8Z'

export function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="var(--color-brand-600)" />
      <path d={TOOTH_PATH} fill="#fff" />
    </svg>
  )
}
