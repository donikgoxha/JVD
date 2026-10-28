import { Link } from 'react-router-dom'
import Icon from '../components/Icons.jsx'
import { Glow } from '../components/Blocks.jsx'

export default function NotFound() {
  return (
    <section className="relative isolate -mt-19 grid min-h-[80vh] place-items-center overflow-hidden px-5 pt-19 text-center">
      <Glow />
      <div>
        <p className="font-display text-[8rem] leading-none font-medium text-brand-600/20 sm:text-[12rem]">404</p>
        <h1 className="font-display -mt-4 text-4xl font-medium sm:text-5xl">
          This page has gone <em className="text-brand-600">missing</em>.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-muted">
          That link does not lead anywhere — but both of our clinics are exactly where they should be.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-ghost px-7 py-3.5">
            Back to home
          </Link>
          <Link to="/contact" className="btn-primary px-7 py-3.5">
            Find a clinic
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
