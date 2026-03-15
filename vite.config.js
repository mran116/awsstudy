import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Injected at Vite build time → true in Vercel/local builds
    // In Claude artifacts (no bundler) this global is never defined → Claude mode
    __VERCEL_MODE__: 'true',
  }
})
