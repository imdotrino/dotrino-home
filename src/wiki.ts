/* Enlaces al wiki (wiki.dotrino.com) desde el home.

   CONVENCIONES §9.2: el home NO documenta — presenta y enlaza. Los enlaces van
   REPARTIDOS por la página (cada bloque lleva el suyo, en contexto) y la etiqueta
   es el TÍTULO REAL de la página del wiki, nunca un genérico tipo "más info".
   Los títulos de abajo son los mismos de `content/manifest.json` del wiki: si
   allá se renombra una página, se renombra aquí. */

import type { Locale } from './i18n'

const WIKI = 'https://wiki.dotrino.com'

/** URL de una página del wiki: `wikiUrl('empezar/privacidad', 'en')`. */
export const wikiUrl = (slug: string, locale: Locale): string =>
  `${WIKI}${locale === 'en' ? '/en' : ''}/${slug}/`

export const wikiTitles: Record<Locale, Record<string, string>> = {
  es: {
    'empezar/que-es': 'Qué es Dotrino',
    'empezar/instalar-apps': 'Instalar una app en tu teléfono',
    'empezar/identidad': 'Tu identidad y tus perfiles',
    'empezar/como-viaja': 'Cómo viaja lo que compartes',
    'empezar/privacidad': 'Cómo se protege lo tuyo',
    'empezar/apoyar': 'Apoyar el proyecto',
    'empresa/que-es': 'Qué es Dotrino Enterprise',
    'empresa/como-empezar': 'Cómo empezar en tu empresa',
    'vault/modelo': 'El modelo: perfil, acta y llaves',
    'vault/instalacion': 'Instalación: elige tu vía',
    'vault/emparejar': 'Emparejar un aparato',
    'vault/secretos': 'Secretos de servicios',
    'vault/aprobacion': 'Aprobación desde el teléfono',
    'vault/seguridad': 'Cifrado, store y alcance',
    'desarrollo/contribuir': 'Contribuir',
  },
  en: {
    'empezar/que-es': 'What is Dotrino',
    'empezar/instalar-apps': 'Install an app on your phone',
    'empezar/identidad': 'Your identity and your profiles',
    'empezar/como-viaja': 'How what you share travels',
    'empezar/privacidad': 'How your data is kept private',
    'empezar/apoyar': 'Supporting the project',
    'empresa/que-es': 'What is Dotrino Enterprise',
    'empresa/como-empezar': 'Getting started in your company',
    'vault/modelo': 'The model: profile, record, keys',
    'vault/instalacion': 'Install: pick your path',
    'vault/emparejar': 'Pairing a device',
    'vault/secretos': 'Service secrets',
    'vault/aprobacion': 'Phone approval',
    'vault/seguridad': 'Encryption, store and scope',
    'desarrollo/contribuir': 'Contributing',
  },
}
