import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Доступность для всех IP
    port: 3000,
    strictPort: true,
    allowedHosts: ['95.174.93.104'], // Публичный IP
    https: {
      key: fs.readFileSync('../ssl_keys/key.pem'),
      cert: fs.readFileSync('../ssl_keys/cert.pem'),
    },
  },
  preview: {
    allowedHosts: ['95.174.93.104'],
  },
  build: {
    outDir: 'dist',
  },
})
