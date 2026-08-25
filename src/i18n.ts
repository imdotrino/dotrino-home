/* i18n del home de Dotrino (ES / EN). Extraído de App.vue: la cáscara y
   los componentes importan `messages` y derivan `t` desde el `locale` activo.

   El home es SOLO el catálogo: la copy de "¿Qué es Dotrino?" y de Enterprise se
   mudó al wiki (CONVENCIONES §9.2) y aquí quedaron los enlaces. */

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
    nav: { apps: 'Aplicaciones', wiki: 'Wiki', install: 'Instalar App', profile: 'Mi perfil' },
    tabs: { recientes: 'Recientes', social: 'Social', apps: 'Herramientas', deportes: 'Deportes', juegos: 'Juegos', android: 'Android', wip: 'En Desarrollo', developers: 'Developers' },
    lines: { label: 'Personal o empresa', personal: 'Personal', enterprise: 'Empresa' },
    subtabs: { solo: 'Un jugador', multi: 'Multijugador', config: 'Configurables' },
    install: {
      ios: 'Para instalar: pulsa el botón Compartir y luego "Añadir a pantalla de inicio".',
      other: 'Tu navegador todavía no permite la instalación automática. Usa el menú del navegador para instalar la app.',
    },
    langToggle: 'EN',
    langLabel: 'Cambiar idioma a inglés',
    apps: {
      title: 'Aplicaciones',
      text: 'Las aplicaciones del ecosistema. Todas hablan el mismo idioma, así que lo tuyo viaja de una a otra.',
      open: 'Abrir aplicación',
      download: 'Descargar APK',
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
    footer: {
      title: 'La filosofía Dotrino',
      what: { h: 'Qué comparto', p: 'Solo la información que decido exponer, nada más.' },
      how: { h: 'Cómo lo comparto', p: 'Con el formato, el acceso y las condiciones que yo defino.' },
      when: { h: 'Cuándo lo comparto', p: 'En el momento que quiero, y lo retiro cuando quiero.' },
      tagline: 'Aplicaciones útiles, sin anuncios y sin cookies, que no llevan cuenta de lo que haces. Funcionan en el equipo que tú eliges y lo tuyo se queda contigo. Eso es Dotrino.',
      copy: '© 2026 Team Dotrino. Todos los derechos reservados.',
    },
  },
  en: {
    htmlLang: 'en',
    nav: { apps: 'Applications', wiki: 'Wiki', install: 'Install App', profile: 'My profile' },
    tabs: { recientes: 'Recent', social: 'Social', apps: 'Tools', deportes: 'Sports', juegos: 'Games', android: 'Android', wip: 'In Development', developers: 'Developers' },
    lines: { label: 'Personal or business', personal: 'Personal', enterprise: 'Business' },
    subtabs: { solo: 'Single player', multi: 'Multiplayer', config: 'Configurable' },
    install: {
      ios: 'To install: tap the Share button and then "Add to Home Screen".',
      other: 'Your browser does not support automatic installation yet. Use the browser menu to install the app.',
    },
    langToggle: 'ES',
    langLabel: 'Switch language to Spanish',
    apps: {
      title: 'Applications',
      text: 'The apps of the ecosystem. They all speak the same language, so what’s yours travels from one to the next.',
      open: 'Open app',
      download: 'Download APK',
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
    footer: {
      title: 'The Dotrino philosophy',
      what: { h: 'What I share', p: 'Only the information I choose to expose, nothing more.' },
      how: { h: 'How I share it', p: 'With the format, access and conditions that I define.' },
      when: { h: 'When I share it', p: 'The moment I want, and I take it back whenever I want.' },
      tagline: 'Useful apps, with no ads and no cookies, that keep no record of what you do. They run on the machine you choose, and what’s yours stays with you. That is Dotrino.',
      copy: '© 2026 Team Dotrino. All rights reserved.',
    },
  },
} as const
