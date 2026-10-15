/**
 * AVISO DE RESPUESTA: quien pide algo desde dotrino.com puede pedir que se le avise cuando
 * Dotrino conteste.
 *
 * Dotrino contesta por el MESSENGER (es su contacto fijo), así que lo que se apunta es el
 * aviso del navegador para la app `messenger` y esta identidad: el proxio suena cuando le
 * queda algo esperando a esa app, el service worker del home enseña la notificación
 * (`public/dotrino-push-sw.js`) y tocarla abre el messenger.
 *
 * Todo con las piezas del ecosistema: el aviso lo apunta `createVaultPushProvider`
 * (@dotrino/notifications) sobre una conexión del transporte (@dotrino/proxy-client) que se
 * presenta como `messenger` y NO se identifica — si se identificara, el proxio le entregaría
 * la cola del messenger a una página que no la lee, y se perdería.
 *
 * Una suscripción por (llave, app): si el messenger de este navegador ya tenía la suya, la
 * nueva la reemplaza. Las dos acaban abriendo el messenger.
 */
import type { MyId } from './signedRequest'

export type ReplyNoticeState = 'unsupported' | 'ask' | 'denied'

/** Qué puede hacer este navegador ahora mismo, antes de preguntar. */
export function replyNoticeState (): ReplyNoticeState {
  if (typeof window === 'undefined' || !('Notification' in window) ||
      !('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported'
  return Notification.permission === 'denied' ? 'denied' : 'ask'
}

/**
 * Pide el permiso y apunta el aviso. Hay que llamarlo DESDE EL TOQUE del usuario: el
 * navegador solo enseña su ventana de permiso con un gesto reciente, así que lo primero
 * que se hace es pedirlo, antes de cualquier espera.
 * Lanza con `code`: `denied` (no dio permiso) o `push-failed` (no se pudo apuntar).
 */
export async function enableReplyNotice (getMyIdentity: () => Promise<MyId>): Promise<void> {
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') throw Object.assign(new Error('reply notice: permission ' + perm), { code: 'denied' })
  const [{ WebSocketProxyClient }, { createVaultPushProvider }] = await Promise.all([
    import('@dotrino/proxy-client'),
    import('@dotrino/notifications'),
  ])
  const client = new WebSocketProxyClient({ app: 'messenger', autoReconnect: false, enableWebRTC: false })
  try {
    await client.connect()
    const push = createVaultPushProvider({
      proxyClient: client,
      identity: async () => {
        const me = await getMyIdentity()
        return { me: { publickey: me.pubkey }, signData: me.signData }
      },
      storageKey: 'messenger-reply',
    })
    if (!(await push.enable())) {
      throw Object.assign(new Error('reply notice: ' + push.error()), { code: 'push-failed' })
    }
  } finally {
    client.disconnect()
  }
}
