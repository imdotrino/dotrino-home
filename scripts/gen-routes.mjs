// Las viejas rutas del home (/que-es y /enterprise) se mudaron al wiki
// (CONVENCIONES §9.2: el home no documenta). Este script escribe en su lugar dos
// páginas de REDIRECCIÓN a wiki.dotrino.com, para no romper los enlaces ya
// publicados (redes, buscadores, decks). GitHub Pages sirve `que-es.html` con 200
// tanto en /que-es.html como en /que-es, así que la URL limpia sigue viva.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, '..', 'dist')

const routes = [
  {
    file: 'que-es.html',
    target: 'https://wiki.dotrino.com/empezar/que-es/',
    title: '¿Qué es Dotrino?',
    lang: 'es',
  },
  {
    file: 'enterprise.html',
    target: 'https://wiki.dotrino.com/empresa/que-es/',
    title: 'Dotrino Enterprise',
    lang: 'es',
  },
]

const page = (r) => `<!DOCTYPE html>
<html lang="${r.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${r.title}</title>
<link rel="canonical" href="${r.target}">
<meta http-equiv="refresh" content="0; url=${r.target}">
<script>location.replace(${JSON.stringify(r.target)})</script>
</head>
<body>
<p>Esta página se mudó al wiki: <a href="${r.target}">${r.title}</a>.</p>
</body>
</html>
`

for (const r of routes) {
  await writeFile(resolve(dist, r.file), page(r), 'utf8')
  console.log(`✓ ${r.file} → ${r.target}`)
}
