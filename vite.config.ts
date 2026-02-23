import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: path.resolve(__dirname, 'src/prerender.tsx'),
      additionalPrerenderRoutes: [
        '/',
        '/about',
        '/buyCars',
        '/sellCars',
        '/reviews',
        '/contact',
        '/payments',
        '/why-kyawkyar/rigorous-quality-inspection',
        '/why-kyawkyar/swift-processing',
        '/why-kyawkyar/clean-history',
        '/showroom-installment',
      ],
    }),
  ],
  server: {
    host: true, // This exposes the project on your local network
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

