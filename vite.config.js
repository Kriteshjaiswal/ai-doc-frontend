import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-icons')) {
              return 'icons';
            }
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react') || id.includes('axios')) {
              return 'vendor';
            }
          }
        },
      },
    },
  },
})
