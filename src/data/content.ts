/* Copys de las secciones "Servicio" y "API" del home (vista /que-es), por
   idioma. Extraído de App.vue; los consume AboutSections.vue. */

import type { Locale } from '../i18n'

type Feature = { h: string; p: string }

export const serviceItems: Record<Locale, Feature[]> = {
  en: [
    { h: 'Ephemeral tokens', p: 'On connect, a short token (4 characters) is assigned. It acts as the client\'s logical address and is released on disconnect.' },
    { h: 'Public channels', p: 'Any client can publish itself in a named channel, list it or query its member count. 20 min TTL and up to 100 tokens per channel.' },
    { h: 'ECDSA P-256 signatures', p: 'Channel operations are signed with a public JWK key (P-256 curve). The proxy verifies the signature before accepting publish/unpublish/list.' },
    { h: 'No persistent state', p: 'The proxy stores no messages on disk and has no database. Only live memory: connections, active peers and channel entries.' },
    { h: 'WebRTC with proxy fallback', p: 'The client tries to open an <code>RTCDataChannel</code> with each peer (signaling through the proxy itself, public STUN). If negotiation succeeds messages travel P2P; if it fails, they keep flowing through the proxy transparently.' },
    { h: '24 h offline queue + multi-instance', p: 'After a signed <code>identify</code>, clients can address messages by <code>to_publickey</code>. If several instances are online (web + extension + second tab…) the proxy does a <strong>fan-out</strong> to all of them. If they are all offline, it holds them in memory for up to 24 h (200 msgs / 1 MB per pubkey) and delivers on the first reconnect.' },
    { h: 'Shared vaults', p: 'Two static subdomains keep user state in their own <code>localStorage</code> and are accessed by all apps via iframe + <code>postMessage</code>: <code>id.dotrino.com</code> (keys, contacts, ratings) and <code>store.dotrino.com</code> (DM threads). Same contacts and same messages in any ecosystem app within the same browser.' },
    { h: 'Ephemeral geo discovery', p: 'A fourth pillar, <code>geo.dotrino.com</code>, lets an identity publish a signed georeferenced pin (lat/lng + payload) queryable by radius (PostGIS). Pure discovery: the pin carries the pubkey to contact the identity through the proxy, where the transaction happens. Ephemeral by design — one pin per identity (overwrite, no history), max 24 h TTL matching the offline window. No location trails are stored.' },
  ],
  es: [
    { h: 'Tokens efímeros', p: 'Al conectar se asigna un token corto (4 caracteres). Sirve como dirección lógica del cliente y se libera al desconectar.' },
    { h: 'Canales públicos', p: 'Cualquier cliente puede publicarse en un canal nombrado, listarlo o consultar el número de miembros. TTL de 20 min y hasta 100 tokens por canal.' },
    { h: 'Firma ECDSA P-256', p: 'Las operaciones sobre canales se firman con clave pública JWK (curva P-256). El proxy verifica la firma antes de aceptar publish/unpublish/list.' },
    { h: 'Sin estado persistente', p: 'El proxy no guarda mensajes en disco ni tiene base de datos. Solo memoria viva: conexiones, pares activos y entradas de canal.' },
    { h: 'WebRTC con fallback al proxy', p: 'El cliente intenta abrir un <code>RTCDataChannel</code> con cada peer (señalización por el propio proxy, STUN público). Si la negociación tiene éxito los mensajes viajan P2P; si falla, siguen por el proxy de forma transparente.' },
    { h: 'Cola offline 24 h + multi-instancia', p: 'Tras un <code>identify</code> firmado, los clientes pueden direccionar mensajes por <code>to_publickey</code>. Si hay varias instancias online (web + extensión + segunda pestaña…) el proxy hace <strong>fan-out</strong> a todas. Si todas están offline, retiene en memoria hasta 24 h (200 msgs / 1 MB por pubkey) y entrega al primer reconnect.' },
    { h: 'Vaults compartidos', p: 'Dos subdominios estáticos guardan estado del usuario en su propio <code>localStorage</code> y son accedidos por todas las apps vía iframe + <code>postMessage</code>: <code>id.dotrino.com</code> (claves, contactos, ratings) y <code>store.dotrino.com</code> (hilos de DMs). Mismos contactos y mismos mensajes en cualquier app del ecosistema dentro del mismo navegador.' },
    { h: 'Descubrimiento geo efímero', p: 'Un cuarto pilar, <code>geo.dotrino.com</code>, permite que una identidad publique un pin georreferenciado firmado (lat/lng + payload) consultable por radio (PostGIS). Puro descubrimiento: el pin lleva el pubkey para contactar a la identidad por el proxy, donde ocurre la transacción. Efímero por diseño — un pin por identidad (overwrite, sin historial), TTL máx 24 h igual que la ventana offline. No se guardan rastros de ubicación.' },
  ],
}

export const apiItems: Record<Locale, Feature[]> = {
  en: [
    { h: 'Direct message', p: '<code>{ to: ["TKN1","TKN2"], message: ... }</code> — delivers to one or several tokens. The receiver gets <code>{ type: "message", from, message }</code>.' },
    { h: 'publish / unpublish', p: '<code>{ type: "publish", channel: { data, signature } }</code> makes the client visible in a channel. Notifies join/leave to the other members.' },
    { h: 'list / list_channels / channel_count', p: 'Discovery: tokens in a channel, channels by prefix, count. Useful for building lobbies or public rooms.' },
    { h: 'disconnect', p: '<code>{ type: "disconnect", target }</code> breaks the logical pair with another token and notifies both parties.' },
  ],
  es: [
    { h: 'Mensaje directo', p: '<code>{ to: ["TKN1","TKN2"], message: ... }</code> — entrega a uno o varios tokens. El receptor recibe <code>{ type: "message", from, message }</code>.' },
    { h: 'publish / unpublish', p: '<code>{ type: "publish", channel: { data, signature } }</code> hace visible al cliente en un canal. Notifica join/leave a los demás miembros.' },
    { h: 'list / list_channels / channel_count', p: 'Descubrimiento: tokens en un canal, canales por prefijo, conteo. Útil para construir lobbies o salas públicas.' },
    { h: 'disconnect', p: '<code>{ type: "disconnect", target }</code> rompe el par lógico con otro token y notifica a ambas partes.' },
  ],
}
