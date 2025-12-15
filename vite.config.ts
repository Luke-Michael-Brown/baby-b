import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon.png',
        'assets/*',
      ],

      manifest: {
        name: 'Baby B',
        short_name: 'Baby B',
        description: 'Baby tracking app',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true,
  },
});
