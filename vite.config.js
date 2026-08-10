import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CLINIC, LOCATIONS, DOCTORS } from './src/data/clinic.js'

/**
 * Injects Dentist/LocalBusiness JSON-LD into index.html at build time.
 *
 * Built from src/data/clinic.js rather than hand-written into the HTML, so the
 * addresses and phone numbers a search engine sees can never drift from the
 * ones the site renders. Static in the output — no dependency on the crawler
 * executing our JavaScript.
 *
 * Only confirmed fields are emitted. `openingHours` is deliberately absent
 * while LOCATIONS[*].hours is null: publishing guessed hours into a knowledge
 * panel sends patients to a closed door.
 */
function structuredData(siteUrl, bookingMode) {
  return {
    name: 'jvd-structured-data',
    transformIndexHtml(html) {
      const graph = LOCATIONS.map((loc) => {
        const staff = DOCTORS.filter((d) => d.calLinks[loc.id]).map((d) => ({
          '@type': 'Person',
          name: d.name,
          jobTitle: d.role,
          telephone: d.phone,
        }))

        return {
          '@type': 'Dentist',
          '@id': `${siteUrl}/#${loc.id}`,
          name: `${CLINIC.name} — ${loc.name}`,
          url: siteUrl,
          telephone: loc.phone,
          ...(CLINIC.email ? { email: CLINIC.email } : {}),
          ...(loc.hours ? { openingHours: loc.hours } : {}),
          address: {
            '@type': 'PostalAddress',
            streetAddress: loc.street,
            addressLocality: CLINIC.city,
            postalCode: '1230',
            addressCountry: 'MK',
          },
          areaServed: { '@type': 'City', name: CLINIC.city },
          hasMap: loc.mapsUrl,
          sameAs: [CLINIC.instagram],
          employee: staff,
        }
      })

      const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })

      // Only worth a handshake if the Cal.com embed is actually going to load.
      const preconnect =
        bookingMode === 'cal'
          ? `  <link rel="preconnect" href="https://app.cal.com" crossorigin />\n` +
            `    <link rel="dns-prefetch" href="https://app.cal.com" />\n  `
          : ''

      return html.replace(
        '</head>',
        preconnect +
          `  <link rel="canonical" href="${siteUrl}/" />\n` +
          `    <meta property="og:url" content="${siteUrl}/" />\n` +
          `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://jvd-dental.vercel.app').replace(/\/$/, '')
  const bookingMode = env.VITE_CAL_DEMO_LINK ? 'cal' : env.VITE_BOOKING_MODE || 'cal'

  return {
    plugins: [react(), tailwindcss(), structuredData(siteUrl, bookingMode)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Pin the framework into one long-lived chunk. A string map keyed on
          // 'react-dom' misses 'react-dom/client', which leaves the bulk of React
          // in the app chunk and busts its cache on every content edit — match on
          // the resolved module path instead.
          manualChunks(id) {
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
