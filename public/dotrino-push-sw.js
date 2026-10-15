/* dotrino-push-sw.js — aviso de respuesta de Dotrino (lo importa el service worker del home).
 *
 * Quien pide algo desde dotrino.com puede pedir que se le avise cuando Dotrino conteste. Lo
 * que contesta Dotrino va al MESSENGER, así que el home apunta el aviso del navegador para
 * la app `messenger` (ver src/lib/replyNotice.ts). El proxio manda un timbre SIN contenido
 * ({ type:'ring' }) cuando algo queda esperando a esa app; aquí se enseña la notificación,
 * y al tocarla se abre el messenger, que es donde está el mensaje.
 *
 * El home no lee la cola: no hay nada que avisar a sus ventanas, así que la notificación
 * sale siempre, también con dotrino.com abierto.
 */

const MESSENGER_URL = 'https://messenger.dotrino.com/'
const es = /^es\b/i.test((self.navigator && self.navigator.language) || 'es')
const TITLE = 'Dotrino'
const BODY = es
  ? 'Tienes un mensaje nuevo en el messenger. Tócalo para leerlo.'
  : 'You have a new message in the messenger. Tap to read it.'

self.addEventListener('push', (event) => {
  event.waitUntil(self.registration.showNotification(TITLE, {
    body: BODY,
    icon: '/icons/icon-192.png',
    tag: 'dotrino-messenger-ring',
    renotify: false,
    data: { url: MESSENGER_URL }
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || MESSENGER_URL
  event.waitUntil(self.clients.openWindow ? self.clients.openWindow(url) : Promise.resolve())
})
