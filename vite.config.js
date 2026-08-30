import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default target: API Gateway (8080) which load-balances to user-service (8088) & document-service (9090)
  const gatewayTarget = env.VITE_GATEWAY_TARGET || env.VITE_BACKEND_TARGET || 'http://127.0.0.1:8080';
  const userServiceTarget = env.VITE_USER_SERVICE_TARGET || 'http://127.0.0.1:8088';
  const documentServiceTarget = env.VITE_DOC_SERVICE_TARGET || 'http://127.0.0.1:9090';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      proxy: {
        // Direct route proxies or through API Gateway
        '/api/auth': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/users': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/sessions': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/documents': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/chat': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api/flashcards': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: gatewayTarget,
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
