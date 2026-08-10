import { useState } from 'react'

/**
 * An <img> that degrades to a styled placeholder instead of a broken-image icon.
 *
 * None of the clinic's photography is committed yet (see docs/ASSETS.md), so
 * every image on the site would otherwise render as a bare alt-text box. This
 * keeps the layout intact and looks deliberate until the real files land — at
 * which point this component becomes a no-op and can stay or go.
 *
 * `className` carries the sizing (aspect ratio, rounding, object-fit) and is
 * applied to both branches so the placeholder occupies the identical box.
 */
export default function Img({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  icon = 'photo',
  label,
  ...rest
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || label || 'Image placeholder'}
        className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200 ${className}`}
        {...rest}
      >
        {/* faint diagonal hatch so it reads as a deliberate placeholder */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.18]" aria-hidden="true">
          <defs>
            <pattern id="ph-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="var(--color-brand-500)" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ph-hatch)" />
        </svg>

        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          <PlaceholderIcon name={icon} />
          {label && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700/80">
              {label}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}

function PlaceholderIcon({ name }) {
  const paths = {
    photo: 'M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11Zm2 9.5l4-4 3 3 3-3 4 4M8.5 9.5a1 1 0 100-2 1 1 0 000 2Z',
    person: 'M12 12a4 4 0 100-8 4 4 0 000 8Zm-7 8a7 7 0 0114 0',
    tooth: 'M12 4c-2.4 0-3.4 1.1-4.8 1.1S5 6.4 5 8.4c0 2.4 1 4.5 1.8 6.1.6 1.2 1 2.3 1.9 2.3 1 0 1.3-1.3 1.8-2.6.3-.8.6-1.4 1.7-1.4s1.4.6 1.7 1.4c.5 1.3.8 2.6 1.8 2.6.9 0 1.3-1.1 1.9-2.3.8-1.6 1.8-3.7 1.8-6.1 0-2-1-3.3-2.2-3.3S14.4 4 12 4Z',
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9 text-brand-500/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.photo} />
    </svg>
  )
}
