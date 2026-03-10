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
        '/my',
        '/en',
        '/my/',
        '/en/',
        '/my/buyCars',
        '/en/buyCars',
        '/my/sellCars',
        '/en/sellCars',
        '/my/resell-market-price',
        '/en/resell-market-price',
        '/my/reviews',
        '/en/reviews',
        '/my/contact',
        '/en/contact',
        '/my/payments',
        '/en/payments',
        '/my/why-kyawkyar/rigorous-quality-inspection',
        '/en/why-kyawkyar/rigorous-quality-inspection',
        '/my/why-kyawkyar/swift-processing',
        '/en/why-kyawkyar/swift-processing',
        '/my/why-kyawkyar/clean-history',
        '/en/why-kyawkyar/clean-history',
        '/my/showroom-installment',
        '/en/showroom-installment',
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

