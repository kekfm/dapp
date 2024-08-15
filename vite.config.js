import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development';

  const httpsConfig = isDev ? {
    key: fs.readFileSync(path.resolve('/Users/carltonbags/Desktop/kek/localhost.key')),
    cert: fs.readFileSync(path.resolve('/Users/carltonbags/Desktop/kek/localhost.crt')),
  } : false;

  return {
    plugins: [react()],
    server: {
      https: httpsConfig,
      proxy: {
        '/api': {
          target: 'http://103.26.10.88', // Your API server
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      port: 5173, // Port for your dev server
    },
    build: {
      outDir: 'dist', // Ensure this is correct
    },
  };
});
