import { useMemo, useState } from 'react'

/**
 * A self-contained stand-in for the Cal.com embed, used only when
 * VITE_BOOKING_MODE=demo. It exists so the /book flow can be reviewed end to
 * end before any real scheduling account exists.
 *
 * INTERNAL REVIEW ONLY — never ship this to a public deployment. A patient
 * cannot tell a demo calendar from a real one, and a "booking" that reaches
 * nobody is a missed appointment. The public site uses VITE_BOOKING_MODE=phone.
 *
 * Deliberately NOT wired to a third party. Pointing the demo at a stranger's
 * public Cal.com page would route real bookings into someone else's inbox, and
 * the two well-known public links are a joke calendar and Cal.com's own sales
 * calendar — neither is appropriate in front of a client.
 *
 * Nothing here books anything. Every slot is generated from the current date,
 * and confirming one only swaps the panel to a "this is a demo" message. The
 * banner says so on screen so nobody mistakes it for live availability.
 */

const SLOT_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '15:30', '16:00', '17:00']
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Deterministic pseudo-random so the same day always shows the same slots. */
function seededPick(seed, list, count) {
  const out = []
  let n = seed
  const pool = [...list]
  while (out.length < count && pool.length) {
    n = (n * 1103515245 + 12345) % 2147483648
    out.push(pool.splice(n % pool.length, 1)[0])
  }
  return out.sort()
}

function buildMonth(year, month) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first offset
  const lead = (first.getDay() + 6) % 7
  const cells = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
  return cells
}

export default function DemoCalendar({ doctor, location }) {
  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(null)
  const [confirmed, setConfirmed] = useState(null)

  const cells = useMemo(() => buildMonth(cursor.getFullYear(), cursor.getMonth()), [cursor])

  // Sundays closed; past days closed. Everything else has demo availability.
  const isBookable = (date) => date && date >= today && date.getDay() !== 0

  const slots = useMemo(() => {
    if (!selectedDay) return []
    const seed = selectedDay.getDate() + selectedDay.getMonth() * 31 + doctor.id.length
    return seededPick(seed, SLOT_TIMES, 5)
  }, [selectedDay, doctor.id])

  const monthLabel = cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const atCurrentMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()

  function shiftMonth(delta) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
    setSelectedDay(null)
  }

  if (confirmed) {
    return (
      <div className="grid min-h-[560px] place-items-center p-8 text-center">
        <div className="max-w-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <p className="mt-5 text-lg font-semibold">This is a demonstration</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nothing was booked. In the live site this step hands off to Cal.com, which confirms
            the appointment by email and adds it to {doctor.name}'s calendar at {location.name}.
          </p>
          <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
            {confirmed.day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' at '}
            {confirmed.time}
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null)
              setSelectedDay(null)
            }}
            className="btn-ghost mt-6 px-6 py-3"
          >
            Back to the calendar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="flex items-center gap-2 border-b border-line bg-amber-50 px-5 py-3 text-xs font-medium text-amber-900">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 8v5M12 16.5v.5M10.3 3.9L2.6 17.4A1.6 1.6 0 004 19.8h16a1.6 1.6 0 001.4-2.4L13.7 3.9a1.6 1.6 0 00-2.8 0Z" />
        </svg>
        Demo mode — sample availability. No appointment is created.
      </p>

      <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_190px]">
        {/* Month grid */}
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={atCurrentMonth}
              aria-label="Previous month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line disabled:opacity-30"
            >
              <Chevron dir="left" />
            </button>
            <p className="text-sm font-semibold">{monthLabel}</p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="grid h-8 w-8 place-items-center rounded-full border border-line"
            >
              <Chevron dir="right" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d} className="py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {d}
              </span>
            ))}

            {cells.map((date, i) => {
              if (!date) return <span key={`pad-${i}`} />
              const bookable = isBookable(date)
              const active = selectedDay?.getTime() === date.getTime()
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={!bookable}
                  aria-pressed={active}
                  onClick={() => setSelectedDay(date)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-600 text-white'
                      : bookable
                        ? 'bg-brand-50 text-brand-800 hover:bg-brand-100'
                        : 'text-slate-300'
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="sm:border-l sm:border-line sm:pl-5">
          {selectedDay ? (
            <>
              <p className="text-sm font-semibold">
                {selectedDay.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
              <ul className="mt-3 grid gap-2">
                {slots.map((time) => (
                  <li key={time}>
                    <button
                      type="button"
                      onClick={() => setConfirmed({ day: selectedDay, time })}
                      className="w-full rounded-xl border border-brand-200 bg-white py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white"
                    >
                      {time}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">Pick a day to see available times.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M12 4L7 10l5 6' : 'M8 4l5 6-5 6'} />
    </svg>
  )
}
