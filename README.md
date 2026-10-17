# dotrino-home — dotrino.com

> **Parte del ecosistema [Dotrino](https://dotrino.com).** Dotrino es un ecosistema de aplicaciones centradas en la privacidad de los datos: tu información es tuya, y las decisiones sobre ella también — qué compartes, con quién, cuándo y por qué. Sin anuncios, sin cookies, sin rastreo de datos, sin vender tu identidad a nadie.

El hub del ecosistema: el **catálogo de apps** que se sirve en <https://dotrino.com/>
(y `/en/` en inglés). PWA en Vue 3 + Vite + TypeScript, desplegada por GitHub Pages.

El home no documenta (CONVENCIONES §9.2): qué es Dotrino, Enterprise y el uso de cada
pieza viven en el wiki, <https://wiki.dotrino.com/>. Las rutas viejas `/que-es` y
`/enterprise` redirigen allí.

## Qué hay dentro

- **Catálogo** — `src/data/apps.ts` (`apps: AppEntry[]`) es la **fuente única** de las
  apps del ecosistema: nombre, URL, logo (`src/assets/apps/<app>.svg`, inlineado), repo,
  categoría (`cat`), descripción es/en y, si las tiene, sus tiendas (`stores`: App Store,
  Google Play e Identidad Dotrino en Android). Alta de una app: CONVENCIONES §11.4.
- **Copy** — `src/i18n.ts` (es/en). Enlaces al wiki en `src/wiki.ts`.
- **Componentes** — `AppsCatalog.vue` (tabs, búsqueda, recientes), `InfoModal.vue`
  (ficha de una app), `ContactModal.vue` y la solicitud de apps firmada con el perfil
  (`src/lib/signedRequest.ts`), cuya respuesta llega por el messenger (`ReplyNotice.vue`).
- **Pilares** — `@dotrino/topbar` (barra con perfil y tema), `@dotrino/theme`,
  `@dotrino/identity`, `@dotrino/store` (recientes), `@dotrino/proxy-client`,
  `@dotrino/notifications`, `@dotrino/install`, `@dotrino/nav`, `@dotrino/support`.

## Build

```bash
npm install
npm run dev        # desarrollo
npm run build      # a dist/
```

`npm run build` encadena:

1. `scripts/gen-icons.mjs` — iconos PWA desde `images/`.
2. `vue-tsc -b && vite build` — con el plugin `commit-meta`, que escribe
   `<meta name="commit">` con el hash del build.
3. `scripts/prerender.mjs` — escribe el catálogo y el pie dentro de `#app` (el HTML llega
   con contenido) y genera `/en/` con su título, descripción y `hreflang`.
4. `scripts/gen-routes.mjs` — las páginas de redirección al wiki.

## Deploy

Push a `main` → `.github/workflows/deploy.yml` compila y publica `dist/` en Pages
(`dotrino.com`). `dist/` está en `.gitignore`. Para ver qué versión sirve el dominio:

```bash
curl -s https://dotrino.com/ | grep 'name="commit"'
```

## Licencia

MIT
