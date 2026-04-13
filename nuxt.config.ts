export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@tresjs/nuxt', '@nuxt/icon'],
  app: {
    head: {
      title: 'Stijn de Schryver — Creative Technologist',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bridging the gap between concept and code. Building digital experiences where creativity and technology go hand in hand.' },
        { property: 'og:title', content: 'Stijn de Schryver — Creative Technologist' },
        { property: 'og:description', content: 'Bridging the gap between concept and code. Building digital experiences where creativity and technology go hand in hand.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://stijndeschryver.com' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Stijn de Schryver — Creative Technologist' },
        { name: 'twitter:description', content: 'Bridging the gap between concept and code.' },
        { name: 'theme-color', content: '#0a0a0a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://stijndeschryver.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-XSS-Protection': '0',
        'Content-Security-Policy': "default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' https://cdn.stijnds.com; connect-src 'self' https://cdn.stijnds.com https://api.iconify.design; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:;",
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  },
})
