import { defineConfig } from 'zudoku'

export default defineConfig({
  title: 'AEAT VERI*FACTU API',
  description: 'Complete technical documentation for AEAT VERI*FACTU SOAP webservice',
  baseUrl: 'https://verifactu-docs.netlify.app',
  
  // Navigation
  nav: [
    { title: 'Home', href: '/' },
    { title: 'API Reference', href: '/api' },
    { title: 'Getting Started', href: '/getting-started' },
    { title: 'Examples', href: '/examples' }
  ],

  // Theme configuration
  theme: {
    primaryColor: 'blue',
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    }
  },

  // API configuration
  api: {
    baseUrl: 'https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    auth: {
      type: 'mutual-tls',
      description: 'Mutual TLS authentication with FNMT certificate required'
    }
  }
})