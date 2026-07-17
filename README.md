# dotrino — landing site

> **Parte del ecosistema [Dotrino](https://dotrino.com).** Dotrino es un ecosistema de aplicaciones centradas en la privacidad de los datos: tu información es tuya, y las decisiones sobre ella también — qué compartes, con quién, cuándo y por qué. Sin anuncios, sin cookies, sin rastreo de datos, sin vender tu identidad a nadie.

## Filosofía

El eje del ecosistema **[Dotrino](https://dotrino.com)** es el **autohosteo** y el **control sobre la propia información**: qué comparto, cómo lo comparto y cuándo lo comparto.

### Manifiesto

> **Tu información, en tu servidor, bajo tus reglas.**
> Dotrino nace de una idea simple: lo que es tuyo, se queda contigo. Tú decides **qué** compartes, **cómo** lo compartes y **cuándo** lo compartes. Sin intermediarios, sin nubes ajenas, sin letra pequeña.
>
> Cada aplicación del ecosistema Dotrino vive donde tú quieras: tu propio servidor, tu propia infraestructura. Tus datos no viajan a empresas que los monetizan. Tú eres el dueño y el administrador. Compartes solo lo que eliges, con quien eliges, durante el tiempo que eliges.

### Tres pilares

> - **Qué comparto:** solo la información que decido exponer, nada más.
> - **Cómo lo comparto:** con el formato, el acceso y las condiciones que yo defino.
> - **Cuándo lo comparto:** en el momento que quiero, y lo retiro cuando quiero.
>
> Todo sobre infraestructura que tú controlas. Eso es autohosteo. Eso es soberanía digital.

---

## Colabora: suma tu nodo (autohosteo)

El ecosistema se sostiene en una **red de nodos** que cualquiera puede correr. Los
servicios son **livianos** y vienen **dockerizados turnkey**, con imágenes en
**GHCR** (multi-arch, también para Raspberry Pi):

| Servicio | Qué es | Imagen | Repo |
|----------|--------|--------|------|
| **proxy** | transporte (mensajería, canales, WebRTC, federado) | `ghcr.io/imdotrino/dotrino-proxy` | [simple-websocket-proxy](https://github.com/imdotrino/dotrino-proxy) |
| **geo** | descubrimiento georreferenciado (PostGIS, federado) | `ghcr.io/imdotrino/dotrino-geo` | [dotrino-geo](https://github.com/imdotrino/dotrino-geo) |
| **reputation** | registro de reputación (atestaciones firmadas) | `ghcr.io/imdotrino/dotrino-reputation` | [dotrino-reputation](https://github.com/imdotrino/dotrino-reputation) |

### Levantar un nodo (1 comando)

```bash
git clone https://github.com/imdotrino/dotrino-proxy   # o geo / reputation
cd simple-websocket-proxy
cp .env.docker.example .env     # completá tu dominio + secretos
docker compose up -d            # baja la imagen de GHCR y arranca con TLS automático (Caddy)
```

Cada repo tiene su **`SELF-HOSTING.md`** con el detalle. Reglas:

- **Grey-cloud / DNS directo** (sin la nube naranja de Cloudflare): que ningún
  tercero vea el tráfico, y para no cortar los WebSocket de larga vida.
- **Diversificá proveedor y región** entre nodos — eso hace la descentralización real.

### Entrar a la red

1. Levantá el nodo.
2. **Federación** (solo proxy): cruzá `PROXY_PEERS` con otros nodos + el mismo
   `PROXY_FEDERATION_TOKEN`.
3. **Anunciate**: agregá tu nodo a [`public/nodes.json`](./public/nodes.json) (un
   PR a este repo). Los clientes lo descubren, lo eligen por latencia y le hacen
   failover **sin rebuild**.

Diseño completo en
[`FEDERATION.md`](https://github.com/imdotrino/dotrino-proxy/blob/main/FEDERATION.md).

---

Landing page para el ecosistema **Dotrino**: lista de las apps que usan el proxy y descripción del servicio. Es un PWA instalable (sin caching de service worker — siempre red), Vue 3 + Vite + TypeScript.

🌐 Producción: **https://dotrino.github.io/dotrino/**

## Cómo funciona

- **Primera visita**: muestra el home completo (hero + servicio + API + apps).
- **Visitas siguientes**: muestra solo la sección "Aplicaciones" condensada (botones para abrir cada app + link al repo). Un botón "Ver home completo" expande el resto.
- **Instalable**: el manifest declara icons 192/512 y maskable. SW intencionalmente sin precache (`generateSW` con `globPatterns: []`) para evitar problemas de "no se ve la versión nueva".

## Apps listadas

- [Dotrino Chat](https://dotrino.github.io/simple-websocket-chat/)
- [QRShare](https://dotrino.github.io/qrshare/)
- [Dotrino Chess](https://dotrino.github.io/simple-websocket-chess/)
- [Contador Ecuavóley](https://dotrino.github.io/ecuavoley-contador/)
- [Pronóstico Mundialista](https://mundial.dotrino.com/)

## Build

```bash
./build.sh         # genera ../api/src/public/ (instala deps si falta)
# o npm install && npm run build
```

`build.sh`:

1. `npm install` si falta `node_modules`.
2. `node scripts/gen-icons.mjs` (genera `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` con sharp desde `images/logo.png`).
3. `vue-tsc -b && vite build` que escribe en `../api/src/public/`.

## Deploy

GitHub Actions workflow no incluido (build manual y commit del output, o desde un servidor que sirva `api/src/public/`).

## Estructura

```
dotrino/
├── images/             logos + parallax stock
├── public/icons/       icons generados (no commiteados)
├── scripts/gen-icons.mjs   generador de icons
├── src/
│   ├── App.vue         landing (compact + full)
│   ├── main.ts
│   └── style.css
├── vite.config.ts      base ./, outDir ../api/src/public, vite-plugin-pwa sin cache
└── build.sh
```

## Licencia

MIT
