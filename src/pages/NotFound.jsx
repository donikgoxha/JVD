import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          That link does not lead anywhere. The booking calendar is still open, though.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-ghost px-7 py-3.5">
            Back to home
          </Link>
          <Link to="/book" className="btn-primary px-7 py-3.5">
            Book an appointment
          </Link>
        </div>
      </div>
    </section>
  )
}
