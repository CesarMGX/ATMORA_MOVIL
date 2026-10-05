import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    port: 8100,
    strictPort: true,
    headers: {
      // ESTAS DOS LÍNEAS SON LAS QUE ARREGLAN EL ERROR DE TU CONSOLA
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  }
})