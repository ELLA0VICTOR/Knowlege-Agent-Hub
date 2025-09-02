import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // change target if backend on a different host
      '/api': { target: 'http://localhost:8787', changeOrigin: true },
      '/v1': { target: 'http://localhost:8787', changeOrigin: true }
    }
  }
});
