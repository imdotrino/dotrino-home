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
    nav: { apps: 'Aplicaciones', service: 'Cómo funciona', install: 'Instalar App', profile: 'Mi perfil' },
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
        'Dotrino es un ecosistema de aplicaciones centradas en la privacidad de tus datos: lo tuyo es tuyo, y tú decides qué compartes, con quién y cuándo.',
      manifestoStrong: 'Tu información, en tu servidor, bajo tus reglas.',
      manifestoRest:
        ' Tus fotos, tus mensajes, tus archivos viven donde tú los pones, y puedes llevártelos, copiarlos o borrarlos el día que quieras. Y lo que no compartes no se mueve de ahí.',
      cta: 'Descubre Más',
    },
    apps: {
      title: 'Aplicaciones',
      text: 'Las aplicaciones del ecosistema. Todas hablan el mismo idioma, así que lo tuyo viaja de una a otra.',
      open: 'Abrir aplicación',
      download: 'Descargar APK',
      fullHome: '¿Qué es Dotrino?',
      fullHomeEnterprise: '¿Qué es Dotrino Enterprise?',
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
      title: 'Cómo funciona',
      text: 'Esto es lo que las apps de Dotrino hacen por ti mientras las usas.',
    },
    /* Vista /enterprise ("¿Qué es Dotrino Enterprise?"): el mismo ecosistema
       puesto al servicio de la privacidad de una empresa. Los bloques de la
       página (por qué ahora + qué incluye) viven en ./data/content.ts. */
    enterprise: {
      eyebrow: '// tus claves · tus servidores · tus reglas',
      subtitle:
        'Dotrino Enterprise es el ecosistema puesto al servicio de la privacidad de una empresa: las claves y la información sensible dejan de andar repartidas, cambiar una clave toma minutos y todo funciona en los servidores de la empresa.',
      manifestoStrong: 'Nada que no deba salir sale.',
      manifestoRest:
        ' Las claves de tu empresa viven en un equipo que tú eliges y se abren solo donde autorizaste. Cada permiso lo das tú, queda anotado con su fecha y lo retiras desde un solo lugar. La arquitectura existe para que eso sea literal y no una promesa.',
      cta: 'Habla con nosotros',
      whyNow: {
        title: 'Por qué ahora',
        intro: 'Las herramientas de inteligencia artificial cambiaron dos cosas del entorno en el que trabaja cualquier empresa.',
      },
      sectionTitle: 'Qué incluye',
      sectionText: 'Las piezas del ecosistema, puestas a trabajar para una empresa.',
      response: 'Con Dotrino Enterprise',
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
    nav: { apps: 'Applications', service: 'How it works', install: 'Install App', profile: 'My profile' },
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
        'Dotrino is an ecosystem of apps built around one idea: what’s yours is yours, and you decide what you share, with whom, and when.',
      manifestoStrong: 'Your data, on your server, under your rules.',
      manifestoRest:
        ' Your photos, your messages, your files live where you put them, and you can take them with you, copy them or delete them any day you want. And what you don’t share never leaves.',
      cta: 'Learn More',
    },
    apps: {
      title: 'Applications',
      text: 'The apps of the ecosystem. They all speak the same language, so what’s yours travels from one to the next.',
      open: 'Open app',
      download: 'Download APK',
      fullHome: 'What is Dotrino?',
      fullHomeEnterprise: 'What is Dotrino Enterprise?',
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
      title: 'How it works',
      text: 'This is what Dotrino’s apps do for you while you use them.',
    },
    /* /enterprise view ("What is Dotrino Enterprise?"): the same ecosystem, put
       to work for a company's privacy. The page blocks (why now + what's
       included) live in ./data/content.ts. */
    enterprise: {
      eyebrow: '// your keys · your servers · your rules',
      subtitle:
        'Dotrino Enterprise is the ecosystem put to work for a company’s privacy: keys and sensitive information stop being scattered around, changing a key takes minutes, and everything runs on the company’s own servers.',
      manifestoStrong: 'Nothing that should stay in, gets out.',
      manifestoRest:
        ' Your company’s keys live on a machine you choose and open only where you authorised them. Every permission is granted by you, is recorded with its date, and is withdrawn from a single place. The architecture exists so that this is literal, not a promise.',
      cta: 'Talk to us',
      whyNow: {
        title: 'Why now',
        intro: 'AI tools changed two things about the environment every company works in.',
      },
      sectionTitle: 'What’s included',
      sectionText: 'The pieces of the ecosystem, put to work for a company.',
      response: 'With Dotrino Enterprise',
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
