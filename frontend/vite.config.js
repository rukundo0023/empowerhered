import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EmpowerHerEd',
        short_name: 'EmpowerHerEd',
        description: 'EmpowerHerEd - Empowering Education Platform',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
        ],
        categories: ['education', 'productivity'],
        lang: 'en',
        dir: 'ltr',
        orientation: 'portrait-primary',
        prefer_related_applications: false,
        related_applications: [],
        shortcuts: [
          {
            name: 'Courses',
            short_name: 'Courses',
            description: 'Browse available courses',
            url: '/courses',
            icons: [{ src: '/icon-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Mentorship',
            short_name: 'Mentorship',
            description: 'Book mentorship sessions',
            url: '/programs/mentorship',
            icons: [{ src: '/icon-192x192.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          // API calls - Network first with cache fallback
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200, 201, 204]
              }
            },
          },
          // Images - Cache first with network fallback
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          // Static assets - Cache first
          {
            urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              }
            },
          },
          // HTML pages - Network first
          {
            urlPattern: /\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 5
            },
          },
          // External resources - Stale while revalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              }
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              }
            },
          }
        ],
        // Skip waiting for immediate activation
        skipWaiting: true,
        clientsClaim: true,
        // Clean up old caches
        cleanupOutdatedCaches: true,
        // Maximum file size for precaching
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      includeAssets: [
        '**/*.png', 
        '**/*.svg', 
        '**/*.jpg', 
        '**/*.jpeg', 
        '**/*.gif',
        '**/*.webp',
        '**/*.ico',
        '**/*.woff',
        '**/*.woff2',
        '**/*.ttf',
        '**/*.eot'
      ],
      // Dev options
      devOptions: {
        enabled: true,
        type: 'module',
      },
      // Inject manifest
      injectRegister: 'auto',
      // Use default strategies instead of custom service worker
      strategies: 'generateSW'
    }),
  ],
  // Build options for better PWA support
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@heroicons/react', 'framer-motion'],
          utils: ['axios', 'localforage']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Server options
  server: {
    port: 3000,
    host: true
  }
}); 