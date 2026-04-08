import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Split vendor chunks so React/GSAP are cached separately from app code
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap:   ['gsap'],
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
