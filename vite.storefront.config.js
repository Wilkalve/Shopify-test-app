import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public',
    rollupOptions: {
      input: './storefront/StorefrontUploadPage.jsx',
      output: {
        entryFileNames: 'storefront.js'
      }
    }
  }
});
