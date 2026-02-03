import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    // vite.config.ts
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Removes '/api' before sending to backend
      },
      '/socket.io': { // Change from /ws to /socket.io
        target: 'ws://backend:9999',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  
})
