// Genera las páginas estáticas de rutas reales a partir del index.html ya
// construido. GitHub Pages sirve `que-es.html` con 200 tanto en /que-es.html
// como en /que-es (URL limpia), así la vista "¿Qué es Dotrino?" es enlazable
// e indexable de verdad (no un fallback 404). La app, al arrancar, deriva la
// vista inicial de location.pathname (ver src/App.vue) y dotrino-nav
// mantiene la URL sincronizada con routing real.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, '..', 'dist')

const ORIGIN = 'https://dotrino.com'

// Cada ruta: archivo destino + sustituciones de SEO sobre el index construido.
const routes = [
  {
    file: 'que-es.html',
    canonical: `${ORIGIN}/que-es`,
    title: '¿Qué es Dotrino? — Filosofía y arquitectura',
    ogTitle: '¿Qué es Dotrino?',
    description:
      'Qué es Dotrino: un ecosistema de apps autohosteadas que comparten identidad, transporte y almacenamiento. Tu información, en tu servidor, bajo tus reglas.',
  },
  {
    file: 'enterprise.html',
    canonical: `${ORIGIN}/enterprise`,
    title: 'Dotrino Enterprise, Seguridad y Privacidad de tu Empresa',
    ogTitle: 'Dotrino Enterprise',
    description:
      'Dotrino Enterprise: las claves de tu empresa en un solo sitio, cambiarlas toma minutos y todo funciona en tus propios servidores. Nada que no deba salir sale.',
  },
]

const indexHtml = await readFile(resolve(dist, 'index.html'), 'utf8')

// Reemplazo de un atributo content="" para un selector de meta dado (por name o
// property). Mantiene el resto del tag intacto.
function setMeta (html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${attr}=["']${key}["']\\s+content=["'])[^"']*(["'])`,
    'i',
  )
  return html.replace(re, `$1${value}$2`)
}

for (const r of routes) {
  let html = indexHtml

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${r.title}</title>`)
  // description (name=description, og:description, twitter:description)
  html = setMeta(html, 'name', 'description', r.description)
  html = setMeta(html, 'property', 'og:description', r.description)
  html = setMeta(html, 'name', 'twitter:description', r.description)
  // títulos sociales
  html = setMeta(html, 'property', 'og:title', r.ogTitle)
  html = setMeta(html, 'name', 'twitter:title', r.ogTitle)
  // canonical + og:url
  html = html.replace(
    /(<link\s+rel=["']canonical["']\s+href=["'])[^"']*(["'])/i,
    `$1${r.canonical}$2`,
  )
  html = setMeta(html, 'property', 'og:url', r.canonical)
  // JSON-LD url (la primera ocurrencia = WebApplication.url; la segunda es la
  // del publisher Organization y debe seguir apuntando al home).
  html = html.replace(
    /("url":\s*")https:\/\/dotrino\.com\/(")/,
    `$1${r.canonical}$2`,
  )

  await writeFile(resolve(dist, r.file), html, 'utf8')
  console.log(`✓ ${r.file}`)
}
