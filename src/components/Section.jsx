export default function Section({ eyebrow, title, lead, children, className = '' }) {
  return (
    <section className={`container-page py-16 sm:py-20 ${className}`}>
      {(eyebrow || title || lead) && (
        <header className="max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
          {lead && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
