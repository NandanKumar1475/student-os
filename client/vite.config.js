import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiBaseUrl = process.env.VITE_API_URL || 'http://localhost:8081/api';
const apiTarget = apiBaseUrl.replace(/\/api\/?$/, '');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})