/**
 * Enviar una solicitud a `feedback.dotrino.com` FIRMADA con tu identidad de Dotrino.
 *
 * La firma es obligatoria (dueño, 2026-09-24: «el app request debe enviar la firma de
 * Dotrino»). Antes era opcional y, si firmar fallaba, el error se tragaba y la solicitud
 * salía anónima: así llegaban correos sin firma que nadie podía atribuir a nadie. Ahora, sin
 * firma no se envía, y quien llama recibe `code: 'unsigned'` para decirlo en pantalla.
 *
 * Firma `{ op: 'app-request', text, ts }`, que es lo que verifica el Worker.
 */
export const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL || 'https://feedback.dotrino.com'

export type MyId = {
  pubkey: string
  nickname: string
  signData?: (d: unknown) => Promise<unknown>
  /** Tu tarjeta de perfil (tus aparatos y sus llaves de cifrado): con ella Dotrino te contesta por el messenger. */
  profileCard?: () => Promise<unknown>
}

export async function sendSignedRequest (
  getMyIdentity: (() => Promise<MyId>) | null,
  fields: { text: string; app: string; locale: string; contact?: string },
): Promise<void> {
  const unsigned = (why: string) => Object.assign(new Error(`app-request: ${why}`), { code: 'unsigned' })
  if (!getMyIdentity) throw unsigned('no identity available on this page')
  const me = await getMyIdentity()
  if (!me.pubkey || !me.signData) throw unsigned('the identity has no key to sign with')
  const ts = Date.now()
  const sig = (await me.signData({ op: 'app-request', text: fields.text, ts })) as string | { signature?: string }
  const signature = (typeof sig === 'string' ? sig : sig?.signature) || ''
  if (!signature) throw unsigned('the identity returned no signature')
  // Sin tarjeta la solicitud llega igual: lo único que se pierde es poder contestarte por el
  // messenger (no hay con qué sellarte el mensaje). Se dice en la consola.
  let card: unknown = null
  try { card = (await me.profileCard?.()) || null } catch (e: any) { console.warn('[app-request] no profile card:', e?.message || e) }
  const res = await fetch(FEEDBACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, pubkey: me.pubkey, nickname: me.nickname, ts, signature, card }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw Object.assign(new Error(`app-request: the server answered ${res.status}`), { code: body?.error || 'send-failed' })
  }
}
