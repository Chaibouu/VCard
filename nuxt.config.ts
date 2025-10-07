// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // CSS
  css: [
    '~/assets/css/tailwind.css'
  ],

  // App configuration
  app: {
    head: {
      title: 'EnBizCard - An Open-Source Digital Business Card Generator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description',
          name: 'description',
          content: 'EnBizCard helps you create beautiful, responsive HTML-based digital business cards that can be hosted on your website.'
        },
        {
          hid: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
          property: 'msapplication-TileColor',
          content: '#111827',
        },
        {
          hid: 'msapplication-TileImage',
          name: 'msapplication-TileImage',
          property: 'msapplication-TileImage',
          content: '/mstile-150x150.png',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=2',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'mask-icon',
          color: '#111827',
          href: '/safari-pinned-tab.svg',
        },
      ],
      script: [
        { src: '/qrcode.min.js' }
      ],
    }
  },

  // PWA configuration
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: process.env.NODE_ENV === 'development',
    },
    manifest: {
      name: 'EnBizCard - An Open-Source Digital Business Card Generator',
      short_name: 'EnBizCard',
      start_url: '/',
      display: 'standalone',
      theme_color: '#111827',
      background_color: '#111827',
      icons: [
        {
          src: '/icon_64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/maskable_64.png',
          sizes: '64x64',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: '/maskable_120.png',
          sizes: '120x120',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/maskable_144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: '/maskable_152.png',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/maskable_192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/maskable_384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon_512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/maskable_512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },

  // Build configuration
  build: {
    transpile: ['vue3-colorpicker']
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;'
        }
      }
    }
  },

  // Nitro configuration
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      baseURL: process.env.NODE_ENV === 'production' ? 'https://enbizcard.vishnuraghav.com' : 'http://localhost:3000'
    }
  }
})
