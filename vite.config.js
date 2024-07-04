import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api': {
            target: 'http://103.26.10.88', // Your API server
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        },
    },
}
})
