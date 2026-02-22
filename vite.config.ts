import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ESM မှာ require ကို သုံးလို့ရအောင် ဖန်တီးခြင်း
const require = createRequire(import.meta.url);
const VitePrerender = require('vite-plugin-prerender');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/', 
        '/buyCars', 
        '/sellCars', 
        '/about', 
        '/payments', 
        '/reviews', 
        '/contact',
        '/showroom-installment'
      ],
      renderer: new VitePrerender.PuppeteerRenderer({
        renderAfterDocumentEvent: 'vite-prerender-ready',
        headless: false,
        renderAfterTime: 60000,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
    }),
  ],
  server: {
    host: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('@tanstack/react-query')) return 'vendor-query';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('react-quill') || id.includes('quill')) return 'vendor-quill';
            if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n';
            if (id.includes('axios')) return 'vendor-axios';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
