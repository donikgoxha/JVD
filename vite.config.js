import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
})
