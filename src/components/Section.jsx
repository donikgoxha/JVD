import Reveal from './Reveal.jsx'

/**
 * Section wrapper: eyebrow + display-serif title + lead, then children.
 * `title` may contain an <em>, which renders as the italic accent.
 */
export default function Section({ id, eyebrow, title, lead, children, className = '', center = false }) {
  return (
    <section id={id} className={`container-page py-20 sm:py-28 ${className}`}>
      {(eyebrow || title || lead) && (
        <Reveal as="header" className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && (
            <h2 className="font-display mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl [&_em]:text-brand-600">
              {title}
            </h2>
          )}
          {lead && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
        </Reveal>
      )}
      {children}
    </section>
  )
}
