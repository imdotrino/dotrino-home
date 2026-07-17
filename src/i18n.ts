/* i18n del home de Dotrino (ES / EN). Extraído de App.vue: la cáscara y
   los componentes importan `messages` y derivan `t` desde el `locale` activo. */

export type Locale = 'es' | 'en'
export const LANG_KEY = 'dotrino.lang'

export const detectLocale = (): Locale => {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved === 'es' || saved === 'en') return saved
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es'
}

export const messages = {
  es: {
    htmlLang: 'es',
    nav: { apps: 'Aplicaciones', service: 'Servicio', api: 'API', install: 'Instalar App', profile: 'Mi perfil' },
    tabs: { recientes: 'Recientes', social: 'Social', apps: 'Herramientas', deportes: 'Deportes', juegos: 'Juegos', android: 'Android', wip: 'En Desarrollo', developers: 'Developers' },
    subtabs: { solo: 'Un jugador', multi: 'Multijugador', config: 'Configurables' },
    install: {
      ios: 'Para instalar: pulsa el botón Compartir y luego "Añadir a pantalla de inicio".',
      other: 'Tu navegador todavía no permite la instalación automática. Usa el menú del navegador para instalar la app.',
    },
    langToggle: 'EN',
    langLabel: 'Cambiar idioma a inglés',
    hero: {
      subtitle:
        '{n} aplicaciones para el día a día —mensajes, mapas, juegos, herramientas— con una sola cuenta para todas. Ninguna te llena de anuncios ni sigue tus pasos: no porque lo prometamos, sino porque están hechas para que no puedan.',
      manifestoStrong: 'Tu información, en tu servidor, bajo tus reglas.',
      manifestoRest:
        ' Lo que es tuyo, se queda contigo: tú decides qué compartes, cómo lo compartes y cuándo lo compartes. Sin intermediarios, sin nubes ajenas, sin letra pequeña.',
      cta: 'Descubre Más',
    },
    apps: {
      title: 'Aplicaciones',
      text: 'Aplicaciones que usan el proxy de Dotrino.',
      open: 'Abrir aplicación',
      download: 'Descargar APK',
      fullHome: '¿Qué es Dotrino?',
      info: 'Ver descripción',
      close: 'Cerrar',
      requestTitle: 'Solicita o recomienda una aplicación',
      requestPlaceholder: 'Quiero una app que lea QRs',
      requestSend: 'Enviar',
      requestThanks: '¡Gracias! Recibimos tu sugerencia.',
      requestError: 'No se pudo enviar. Inténtalo de nuevo.',
    },
    contact: {
      link: 'Contacto',
      title: 'Contáctanos',
      intro: 'Déjanos tu correo, teléfono y mensaje, y te respondemos.',
      email: 'Correo',
      emailPh: 'tucorreo@ejemplo.com',
      phone: 'Teléfono',
      phonePh: '+593 99 123 4567',
      message: 'Mensaje',
      messagePh: 'Cuéntanos qué necesitas…',
      send: 'Enviar',
      thanks: '¡Gracias! Recibimos tu mensaje.',
      error: 'No se pudo enviar. Inténtalo de nuevo.',
    },
    service: {
      title: 'Servicio',
      text: 'Comunicación por WebSocket ligero que enruta mensajes entre clientes mediante tokens cortos, sin almacenar conversaciones ni requerir cuentas.',
    },
    api: {
      title: 'API',
      text: 'Una sola conexión WebSocket. Mensajes JSON. Sin endpoints HTTP, sin SDK obligatorio.',
    },
    footer: {
      title: 'La filosofía Dotrino',
      what: { h: 'Qué comparto', p: 'Solo la información que decido exponer, nada más.' },
      how: { h: 'Cómo lo comparto', p: 'Con el formato, el acceso y las condiciones que yo defino.' },
      when: { h: 'Cuándo lo comparto', p: 'En el momento que quiero, y lo retiro cuando quiero.' },
      tagline: 'Aplicaciones útiles que no te espían: sin anuncios, sin cookies, sin rastreo, sin vender tu identidad. Sobre infraestructura que tú controlas. Eso es Dotrino.',
      copy: '© 2024 Team Dotrino. Todos los derechos reservados.',
    },
  },
  en: {
    htmlLang: 'en',
    nav: { apps: 'Applications', service: 'Service', api: 'API', install: 'Install App', profile: 'My profile' },
    tabs: { recientes: 'Recent', social: 'Social', apps: 'Tools', deportes: 'Sports', juegos: 'Games', android: 'Android', wip: 'In Development', developers: 'Developers' },
    subtabs: { solo: 'Single player', multi: 'Multiplayer', config: 'Configurable' },
    install: {
      ios: 'To install: tap the Share button and then "Add to Home Screen".',
      other: 'Your browser does not support automatic installation yet. Use the browser menu to install the app.',
    },
    langToggle: 'ES',
    langLabel: 'Switch language to Spanish',
    hero: {
      subtitle:
        '{n} everyday apps — messaging, maps, games, tools — and one account for all of them. None of them show you ads or follow you around: not because we promise, but because they’re built so they can’t.',
      manifestoStrong: 'Your data, on your server, under your rules.',
      manifestoRest:
        ' What is yours stays with you: you decide what you share, how you share it and when you share it. No middlemen, no third-party clouds, no fine print.',
      cta: 'Learn More',
    },
    apps: {
      title: 'Applications',
      text: 'Applications that use the Dotrino proxy.',
      open: 'Open app',
      download: 'Download APK',
      fullHome: 'What is Dotrino?',
      info: 'View description',
      close: 'Close',
      requestTitle: 'Request or recommend an app',
      requestPlaceholder: 'I want an app that reads QR codes',
      requestSend: 'Send',
      requestThanks: 'Thanks! We got your suggestion.',
      requestError: "Couldn't send. Please try again.",
    },
    contact: {
      link: 'Contact',
      title: 'Contact us',
      intro: 'Leave your email, phone and message, and we’ll get back to you.',
      email: 'Email',
      emailPh: 'you@example.com',
      phone: 'Phone',
      phonePh: '+1 555 123 4567',
      message: 'Message',
      messagePh: 'Tell us what you need…',
      send: 'Send',
      thanks: 'Thanks! We got your message.',
      error: "Couldn't send. Please try again.",
    },
    service: {
      title: 'Service',
      text: 'Lightweight WebSocket communication that routes messages between clients via short tokens, without storing conversations or requiring accounts.',
    },
    api: {
      title: 'API',
      text: 'A single WebSocket connection. JSON messages. No HTTP endpoints, no mandatory SDK.',
    },
    footer: {
      title: 'The Dotrino philosophy',
      what: { h: 'What I share', p: 'Only the information I choose to expose, nothing more.' },
      how: { h: 'How I share it', p: 'With the format, access and conditions that I define.' },
      when: { h: 'When I share it', p: 'The moment I want, and I take it back whenever I want.' },
      tagline: 'Useful apps that do not spy on you: no ads, no cookies, no tracking, no selling your identity. On infrastructure you control. That is Dotrino.',
      copy: '© 2024 Team Dotrino. All rights reserved.',
    },
  },
} as const
