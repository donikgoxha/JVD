import { useEffect, useRef } from 'react'

// One rAF-throttled scroll check shared by every pending element. Not
// IntersectionObserver: it misses elements a fast scroll or anchor jump skips over.
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

// Fade-up on first scroll into view. Only hides things that start below the fold,
// so nothing flickers on load and nothing stays hidden without JS.
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
