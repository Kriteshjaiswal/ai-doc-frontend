import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_BACKEND_TARGET || 'http://127.0.0.1:9090';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: backendTarget,
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
