import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Send /api requests to the server, so the admin page and API share one address and its cookie.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})