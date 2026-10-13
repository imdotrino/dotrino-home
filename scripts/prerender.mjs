// El home es una app de una sola página: sin esto, el HTML que sale del build trae
// `<div id="app"></div>` vacío, y quien lo lee sin ejecutar JavaScript (la primera pasada
// de un buscador, y los que no ejecutan nada) no ve ni un texto ni un enlace al catálogo.
//
// Este script escribe dentro de `#app` lo mismo que la página enseña —el catálogo
// completo con sus enlaces y los textos del pie— sacado de las MISMAS fuentes que usa la
// app (src/data/apps.ts, src/i18n.ts, src/wiki.ts). Vue lo reemplaza al montar.
//
// Y da a la versión en inglés una dirección propia, `/en/`, con su título, su
// descripción y el `hreflang` que la une a la española: antes el inglés solo existía
// tras pulsar un botón, así que no se podía indexar.
//
// Es la cáscara pública de la herramienta: aquí no entra nada del usuario.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')

const SITE = 'https://dotrino.com/'
const url = { es: SITE, en: `${SITE}en/` }

// La copy en español sale del index.html (fuente única); esta es su versión inglesa.
const en = {
  title: 'Dotrino, Security and Privacy for Your Information',
  description:
    'Your passwords, your files, your conversations and your identity: encrypted and on your own computer. More than 30 free apps where you decide what you share, with whom and when.',
  twitter:
    'Your passwords, files, conversations and identity, encrypted and on your own computer. 30+ free apps where you decide what you share and with whom.',
}

/* ---------------- las fuentes de la app ---------------- */
const server = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true },
})
let apps, messages, wikiUrl, wikiTitles
try {
  ;({ apps } = await server.ssrLoadModule('/src/data/apps.ts'))
  ;({ messages } = await server.ssrLoadModule('/src/i18n.ts'))
  ;({ wikiUrl, wikiTitles } = await server.ssrLoadModule('/src/wiki.ts'))
} finally {
  await server.close()
}

/* ---------------- el contenido ---------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// El mismo reparto por pestañas que AppsCatalog.vue. Las retiradas no se listan.
const CATS = ['social', 'apps', 'deportes', 'juegos', 'android', 'developers']
const groups = (t) => {
  const live = apps.filter((a) => !a.deprecated)
  return [
    ...CATS.map((cat) => [t.tabs[cat], live.filter((a) => !a.wip && !a.outdated && a.cat === cat)]),
    [t.tabs.wip, live.filter((a) => a.wip && !a.outdated)],
    [t.tabs.review, live.filter((a) => a.outdated)],
  ].filter(([, list]) => list.length)
}

const body = (locale, description) => {
  const t = messages[locale]
  const titles = wikiTitles[locale]
  const wiki = (slug) => `<a href="${esc(wikiUrl(slug, locale))}">${esc(titles[slug])}</a>`
  const other = locale === 'es' ? 'en' : 'es'
  // Las descripciones del catálogo ya son HTML (la app las pinta con v-html).
  const list = (items) =>
    `<ul>${items.map((a) => `<li><a href="${esc(a.url)}">${esc(a.name)}</a> <span>${a.desc[locale]}</span></li>`).join('')}</ul>`
  return `<main class="prerender">
<h1>Dotrino</h1>
<p>${esc(description)}</p>
<p><a href="${url[other]}" hreflang="${other}" lang="${other}">${other === 'en' ? 'English' : 'Español'}</a></p>
<h2>${esc(t.apps.title)}</h2>
<p>${esc(t.apps.text)}</p>
<p>${['empezar/que-es', 'empresa/que-es', 'empezar/crear-cuenta', 'empezar/otros-dispositivos'].map(wiki).join(' · ')}</p>
${groups(t).map(([name, items]) => `<h3>${esc(name)}</h3>\n${list(items)}`).join('\n')}
<h2>${esc(t.footer.title)}</h2>
<p><strong>${esc(t.footer.what.h)}.</strong> ${esc(t.footer.what.p)} ${wiki('empezar/identidad')}</p>
<p><strong>${esc(t.footer.how.h)}.</strong> ${esc(t.footer.how.p)} ${wiki('empezar/como-viaja')}</p>
<p><strong>${esc(t.footer.when.h)}.</strong> ${esc(t.footer.when.p)} ${wiki('empezar/privacidad')}</p>
<p>${esc(t.footer.tagline)}</p>
<p>${['empezar/apoyar', 'desarrollo/contribuir', 'empezar/politica-de-privacidad'].map(wiki).join(' · ')}</p>
<p>${esc(t.footer.copy)}</p>
</main>`
}

// Se ve un instante, hasta que la app monta: que no sea una lista sin estilo.
const style = `<style>
.prerender{max-width:60rem;margin:0 auto;padding:5rem 1.25rem 3rem;font-family:Quicksand,'Segoe UI',system-ui,sans-serif;color:#181c1e;line-height:1.6}
.prerender h1,.prerender h2,.prerender h3{margin:1.5rem 0 .5rem}
.prerender p{margin:.5rem 0}
.prerender ul{list-style:none;padding:0}
.prerender li{margin:.6rem 0}
.prerender a{color:#00658c;font-weight:600}
</style>`

/* ---------------- el HTML ---------------- */
// Un reemplazo que no encuentra lo que busca es un build roto, no un build distinto.
const swap = (html, from, to, what) => {
  if (!html.includes(from)) throw new Error(`prerender: ${what} not found in dist/index.html`)
  return html.split(from).join(to)
}
const pick = (html, re, what) => {
  const m = html.match(re)
  if (!m) throw new Error(`prerender: ${what} not found in dist/index.html`)
  return m[1]
}

const src = await readFile(resolve(dist, 'index.html'), 'utf8')
const es = {
  title: pick(src, /<title>([^<]*)<\/title>/, 'title'),
  description: pick(src, /<meta name="description" content="([^"]*)"/, 'description'),
  twitter: pick(src, /<meta name="twitter:description" content="([^"]*)"/, 'twitter:description'),
}

const alternates = `<link rel="alternate" hreflang="es" href="${url.es}" />
    <link rel="alternate" hreflang="en" href="${url.en}" />
    <link rel="alternate" hreflang="x-default" href="${url.es}" />`

const page = (locale, html, description) => {
  const other = locale === 'es' ? 'en_US' : 'es_ES'
  html = swap(html, '<link rel="canonical"', `${alternates}\n    <meta property="og:locale:alternate" content="${other}" />\n    <link rel="canonical"`, 'canonical')
  html = swap(html, '</head>', `${style}\n</head>`, '</head>')
  return swap(html, '<div id="app"></div>', `<div id="app">${body(locale, description)}</div>`, '#app')
}

await writeFile(resolve(dist, 'index.html'), page('es', src, es.description), 'utf8')

let enHtml = src
enHtml = swap(enHtml, '<html lang="es">', '<html lang="en">', 'html lang')
enHtml = swap(enHtml, es.title, en.title, 'title')
enHtml = swap(enHtml, es.description, en.description, 'description')
enHtml = swap(enHtml, es.twitter, en.twitter, 'twitter:description')
enHtml = swap(enHtml, 'content="es_ES"', 'content="en_US"', 'og:locale')
enHtml = swap(enHtml, `<link rel="canonical" href="${SITE}"`, `<link rel="canonical" href="${url.en}"`, 'canonical href')
enHtml = swap(enHtml, `<meta property="og:url" content="${SITE}"`, `<meta property="og:url" content="${url.en}"`, 'og:url')
// La página vive un nivel más abajo: lo que el build dejó relativo sube uno.
enHtml = enHtml.replace(/(\s(?:src|href)=")\.\//g, '$1../')
// El service worker se registra relativo a la página, y desde /en/ no existe: solo sirve
// para que el home sea instalable, y eso ya lo hace la raíz.
enHtml = enHtml.replace(/\s*<script[^>]*registerSW\.js[^>]*><\/script>/, '')

await mkdir(resolve(dist, 'en'), { recursive: true })
await writeFile(resolve(dist, 'en', 'index.html'), page('en', enHtml, en.description), 'utf8')

const count = apps.filter((a) => !a.deprecated).length
console.log(`✓ index.html and en/index.html prerendered (${count} apps)`)
