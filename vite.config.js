import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CLINIC, LOCATIONS, DOCTORS, NAV } from './src/data/clinic.js'

// Schema.org graph built from clinic.js: one MedicalOrganization, one Dentist per clinic.
// hours and geo are only emitted once they're filled in.
function jsonLd(siteUrl) {
  const image = `${siteUrl}/og-cover.jpg`
  const orgId = `${siteUrl}/#organization`

  const organization = {
    '@type': 'MedicalOrganization',
    '@id': orgId,
    name: CLINIC.name,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icon-512.png`,
    image,
    telephone: CLINIC.phone,
    ...(CLINIC.email && { email: CLINIC.email }),
    medicalSpecialty: 'Dentistry',
    sameAs: [CLINIC.instagram],
  }

  const clinics = LOCATIONS.map((loc) => ({
    '@type': 'Dentist',
    '@id': `${siteUrl}/#${loc.id}`,
    name: `${CLINIC.name} ${loc.name.replace(/^JVD /, '')}`,
    url: `${siteUrl}/contact#${loc.id}`,
    image,
    telephone: loc.phone,
    ...(CLINIC.email && { email: CLINIC.email }),
    priceRange: CLINIC.priceRange,
    medicalSpecialty: 'Dentistry',
    parentOrganization: { '@id': orgId },
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: CLINIC.city,
      postalCode: '1230',
      addressCountry: 'MK',
    },
    ...(loc.geo && {
      geo: { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng },
    }),
    ...(loc.hours && {
      openingHoursSpecification: loc.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    areaServed: { '@type': 'City', name: CLINIC.city },
    hasMap: loc.mapsUrl,
    sameAs: [CLINIC.instagram],
    employee: DOCTORS.filter((d) => d.locations.includes(loc.id)).map((d) => ({
      '@type': 'Person',
      name: d.name,
      jobTitle: d.role,
      telephone: d.phone,
    })),
  }))

  return { '@context': 'https://schema.org', '@graph': [organization, ...clinics] }
}

const robotsTxt = (siteUrl) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

const sitemapXml = (siteUrl) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  NAV.map(({ to }) => `  <url><loc>${siteUrl}${to}</loc></url>\n`).join('') +
  `</urlset>\n`

// Head tags, robots.txt and sitemap.xml all come from VITE_SITE_URL, so a domain change is one line.
function seo(siteUrl) {
  return {
    name: 'jvd-seo',
    transformIndexHtml(html) {
      const ld = JSON.stringify(jsonLd(siteUrl)).replace(/</g, '\\u003c')
      // Replacer function, not a string: '$$' in priceRange would collapse to '$'.
      return html.replace(
        '</head>',
        () =>
          `  <link rel="canonical" href="${siteUrl}/" />\n` +
          `    <meta property="og:url" content="${siteUrl}/" />\n` +
          `    <meta property="og:image" content="${siteUrl}/og-cover.jpg" />\n` +
          `    <meta name="twitter:image" content="${siteUrl}/og-cover.jpg" />\n` +
          `    <script type="application/ld+json">${ld}</script>\n  </head>`
      )
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') return res.setHeader('Content-Type', 'text/plain').end(robotsTxt(siteUrl))
        if (req.url === '/sitemap.xml') return res.setHeader('Content-Type', 'application/xml').end(sitemapXml(siteUrl))
        next()
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://jvd-dental.vercel.app').replace(/\/$/, '')

  return {
    plugins: [react(), tailwindcss(), seo(siteUrl)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Match on the resolved path: a 'react-dom' string key misses react-dom/client.
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
