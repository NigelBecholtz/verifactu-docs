export default {
  title: 'AEAT VERI*FACTU API',
  description: 'Complete technical documentation for AEAT VERI*FACTU SOAP webservice',
  baseUrl: '/verifactu-docs',
  
  // Navigation - matching AML docs style
  nav: [
    { title: 'Getting Started', href: '/' },
    { title: 'API Reference', href: '/api' }
  ],

  // Theme configuration - professional blue theme
  theme: {
    primaryColor: 'blue',
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    }
  },

  // API configuration - matching AML structure
  api: {
    baseUrl: 'https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    auth: {
      type: 'mutual-tls',
      description: 'Mutual TLS authentication with FNMT certificate required'
    }
  },

  // Additional styling to match AML docs
  features: {
    search: true,
    navigation: true,
    darkMode: true
  }
}