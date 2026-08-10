import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'

// Only Home ships in the initial bundle. Everything else is a separate chunk
// fetched on navigation — the Booking page in particular stays out of the
// critical path because it pulls in the third-party embed script.
const About = lazy(() => import('./pages/About.jsx'))
const Work = lazy(() => import('./pages/Work.jsx'))
const Booking = lazy(() => import('./pages/Booking.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RouteFallback() {
  return (
    <div className="container-page grid min-h-[50vh] place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" role="status" aria-label="Loading" />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-work" element={<Work />} />
            <Route path="/book" element={<Booking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
