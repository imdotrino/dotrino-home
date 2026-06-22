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
    nav: { apps: 'Aplicaciones', service: 'Servicio', api: 'API', community: 'Suma un nodo', install: 'Instalar App', profile: 'Mi perfil' },
    tabs: { recientes: 'Recientes', social: 'Social', apps: 'Herramientas', deportes: 'Deportes', juegos: 'Juegos', android: 'Android', wip: 'En Desarrollo' },
    subtabs: { solo: 'Un jugador', multi: 'Multijugador', config: 'Configurables' },
    install: {
      ios: 'Para instalar: pulsa el botón Compartir y luego "Añadir a pantalla de inicio".',
      other: 'Tu navegador todavía no permite la instalación automática. Usa el menú del navegador para instalar la app.',
    },
    langToggle: 'EN',
    langLabel: 'Cambiar idioma a inglés',
    hero: {
      subtitle:
        'Aplicaciones que resuelven problemas comunes, respetando tu privacidad: sin anuncios, sin cookies, sin rastreo de datos, sin vender tu identidad a nadie',
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
    service: {
      title: 'Servicio',
      text: 'Comunicación por WebSocket ligero que enruta mensajes entre clientes mediante tokens cortos, sin almacenar conversaciones ni requerir cuentas.',
    },
    api: {
      title: 'API',
      text: 'Una sola conexión WebSocket. Mensajes JSON. Sin endpoints HTTP, sin SDK obligatorio.',
    },
    community: {
      title: 'Suma tu nodo',
      intro: 'El ecosistema lo sostiene una red de nodos que cualquiera puede correr. Los servicios son livianos y vienen dockerizados, con imágenes en GHCR (multi-arch, también para Raspberry Pi).',
      services: [
        { name: 'proxy', desc: 'transporte federado', img: 'ghcr.io/imdotrino/dotrino-proxy' },
        { name: 'geo', desc: 'descubrimiento georreferenciado', img: 'ghcr.io/imdotrino/dotrino-geo' },
        { name: 'reputation', desc: 'reputación firmada', img: 'ghcr.io/imdotrino/dotrino-reputation' },
      ],
      cmd: 'docker compose up -d',
      cmdNote: 'Baja la imagen y arranca con TLS automático (Caddy).',
      steps: [
        'Levanta el nodo con un comando.',
        'Federa: cruza PROXY_PEERS con otros nodos (solo el proxy).',
        'Anúnciate: agrega tu nodo a nodes.json (un PR) y los clientes lo descubren solos.',
      ],
      note: 'DNS directo (sin nube naranja) y diversifica proveedor/región — eso hace la descentralización real.',
      cta: 'Cómo colaborar',
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
    nav: { apps: 'Applications', service: 'Service', api: 'API', community: 'Run a node', install: 'Install App', profile: 'My profile' },
    tabs: { recientes: 'Recent', social: 'Social', apps: 'Tools', deportes: 'Sports', juegos: 'Games', android: 'Android', wip: 'In Development' },
    subtabs: { solo: 'Single player', multi: 'Multiplayer', config: 'Configurable' },
    install: {
      ios: 'To install: tap the Share button and then "Add to Home Screen".',
      other: 'Your browser does not support automatic installation yet. Use the browser menu to install the app.',
    },
    langToggle: 'ES',
    langLabel: 'Switch language to Spanish',
    hero: {
      subtitle:
        'Apps that solve everyday problems while respecting your privacy: no ads, no cookies, no data tracking, no selling your identity to anyone',
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
    service: {
      title: 'Service',
      text: 'Lightweight WebSocket communication that routes messages between clients via short tokens, without storing conversations or requiring accounts.',
    },
    api: {
      title: 'API',
      text: 'A single WebSocket connection. JSON messages. No HTTP endpoints, no mandatory SDK.',
    },
    community: {
      title: 'Run a node',
      intro: 'The ecosystem runs on a network of nodes anyone can host. The services are lightweight and shipped as Docker images on GHCR (multi-arch, Raspberry Pi included).',
      services: [
        { name: 'proxy', desc: 'federated transport', img: 'ghcr.io/imdotrino/dotrino-proxy' },
        { name: 'geo', desc: 'georeferenced discovery', img: 'ghcr.io/imdotrino/dotrino-geo' },
        { name: 'reputation', desc: 'signed reputation', img: 'ghcr.io/imdotrino/dotrino-reputation' },
      ],
      cmd: 'docker compose up -d',
      cmdNote: 'Pulls the image and starts with automatic TLS (Caddy).',
      steps: [
        'Bring up the node with one command.',
        'Federate: cross PROXY_PEERS with other nodes (proxy only).',
        'Announce it: add your node to nodes.json (a PR) and clients discover it on their own.',
      ],
      note: 'Direct DNS (no orange cloud) and diversify provider/region — that makes decentralization real.',
      cta: 'How to contribute',
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
