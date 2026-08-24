import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_BASE_URL || 'http://localhost:9090/api';
  const target = apiUrl.replace(/\/api\/?$/, '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
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
  };
});
