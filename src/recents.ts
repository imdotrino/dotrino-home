/* Lista de "Recientes" del hub.

   El conteo de aperturas YA NO es local de esta app: lo escribe el Web Component
   compartido <dotrino-support> (montado en CADA app del ecosistema) en el
   store COMPARTIDO store.dotrino.com. Aquí el hub solo LEE ese agregado.

   Por eso el conteo cuenta incluso el ACCESO DIRECTO a cada subdominio (no solo
   lo abierto desde el hub): cada app registra su propia apertura. Sigue siendo
   100% local al navegador (sin servidor ni terceros).

   Ver @dotrino/support (recordAppOpen) y
   @dotrino/store (recordOpen/getOpens). */

import { ref } from 'vue'
import { Store } from '@dotrino/store'

export type RecentEntry = { count: number; ts: number }
export type RecentMap = Record<string, RecentEntry>

// Singleton reactivo; se puebla con loadRecents() al montar el catálogo. Las
// claves son ids de app = hostname (p. ej. "mundial.dotrino.com").
export const recents = ref<RecentMap>({})

/** Carga las aperturas desde el store compartido. Best-effort: si el store no
    está disponible, deja el mapa vacío y el tab muestra la selección por defecto. */
export async function loadRecents(): Promise<void> {
  try {
    const store = await Store.connect()
    const opens = await store.getOpens()
    recents.value = opens && typeof opens === 'object' ? (opens as RecentMap) : {}
  } catch {
    /* store no disponible (offline, bloqueado…): se mantiene la selección por defecto. */
  }
}
