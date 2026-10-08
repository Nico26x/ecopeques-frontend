import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En desarrollo, Vite reenvía /api al backend de Spring Boot (evita errores de CORS)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})