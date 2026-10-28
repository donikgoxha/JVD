import { useEffect, useRef } from 'react'

/*
 * One shared, rAF-throttled scroll check for every pending element.
 *
 * Not IntersectionObserver: it only reports threshold *crossings* it samples,
 * so an element skipped over in one jump (a fast flick, an anchor link, the
 * back button restoring scroll) never intersects and stays hidden forever.
 * Comparing positions instead reveals anything at or above the line, however
 * the page got there.
 */
const pending = new Set()
let scheduled = false

function check() {
  scheduled = false
  const line = window.innerHeight * 0.92
  for (const el of pending) {
    if (el.getBoundingClientRect().top < line) {
      el.dataset.reveal = 'shown'
      pending.delete(el)
    }
  }
  if (pending.size === 0) {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  }
}

function schedule() {
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(check)
  }
}

function watch(el) {
  if (pending.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  }
  pending.add(el)
  schedule()
}

/**
 * Fades and lifts its content in the first time it scrolls into view.
 *
 * The element renders visible; the effect marks it `pending` only after mount,
 * and only if it is still below the fold. So content is never stuck hidden
 * without JS or for a crawler, and nothing already on screen at load flickers.
 * Motion itself is clamped by the prefers-reduced-motion rule in index.css.
 */
export default function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const Tag = as
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    el.dataset.reveal = 'pending'
    watch(el)
    return () => {
      pending.delete(el)
      delete el.dataset.reveal
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
