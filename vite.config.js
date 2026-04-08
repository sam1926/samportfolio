import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Split vendor chunks so React/GSAP are cached separately from app code
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor'
        },
      },
    },
  },

  server: {
    // Long-lived cache for static assets in dev
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
})
