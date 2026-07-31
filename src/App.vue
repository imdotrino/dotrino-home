<script setup lang="ts">
import { ref, computed, watch, provide, onMounted } from 'vue'
import { detectLocale, LANG_KEY, type Locale } from './i18n'
import type { AppEntry } from './data/apps'
import SiteNav from './components/SiteNav.vue'
import AboutSections from './components/AboutSections.vue'
import EnterpriseSections from './components/EnterpriseSections.vue'
import AppsCatalog from './components/AppsCatalog.vue'
import SiteFooter from './components/SiteFooter.vue'
import InfoModal from './components/InfoModal.vue'
import ContactModal from './components/ContactModal.vue'
import { useBackLayer } from '@dotrino/nav/vue'
import { Identity } from '@dotrino/identity'
import { createVaultReputation } from '@dotrino/reputation'

/* App.vue es la cáscara: idioma, routing home↔/que-es↔/enterprise, capas de
   "volver" y el perfil del ecosistema. El contenido vive en componentes (SiteNav,
   AboutSections, EnterpriseSections, AppsCatalog, SiteFooter, InfoModal) y los
   datos/i18n en módulos (./i18n, ./data/*, ./recents). */

/* ---------------- Idioma (ES / EN) ---------------- */
const locale = ref<Locale>(detectLocale())
watch(
  locale,
  (l) => {
    localStorage.setItem(LANG_KEY, l)
    document.documentElement.lang = l
  },
  { immediate: true },
)

const menuOpen = ref(false)

/* ---------------- Vistas: home (apps) ↔ "¿Qué es Dotrino?" / Enterprise -------
   home = página simplificada (root oficial '/', solo apps); las dos SUBVISTAS
   ('about' = /que-es y 'enterprise' = /enterprise) son la info completa sin el
   catálogo. Cada subvista tiene URL propia enlazable e indexable: se registra UNA
   capa de dotrino-nav mientras haya subvista abierta, con { url } derivada de la
   subvista activa (ver useBackLayer abajo). */
type SubView = 'about' | 'enterprise'
const VIEW_PATH: Record<SubView, string> = { about: '/que-es', enterprise: '/enterprise' }
const VIEW_TITLE: Record<SubView, string> = {
  about: '¿Qué es Dotrino? — Filosofía y arquitectura',
  enterprise: '¿Qué es Dotrino Enterprise? — La privacidad de tu empresa',
}
const HOME_TITLE = 'Dotrino - Ecosistema de Aplicaciones'

// Vista inicial derivada de la URL (deep-link directo a /que-es o /enterprise,
// p. ej. desde las versiones estáticas que-es.html / enterprise.html que sirve
// GitHub Pages con 200; acepta también la extensión y la barra final).
const viewFromPath = (path: string): SubView | null =>
  /\/que-es(\.html)?\/?$/.test(path) ? 'about'
    : /\/enterprise(\.html)?\/?$/.test(path) ? 'enterprise'
      : null

const subview = ref<SubView | null>(viewFromPath(window.location.pathname))
const compact = computed(() => subview.value === null)

// Mantén el <title> acorde a la vista en navegación cliente (los títulos de la
// carga inicial los ponen index.html / que-es.html / enterprise.html, ya
// correctos para crawlers).
watch(subview, (v) => { document.title = v ? VIEW_TITLE[v] : HOME_TITLE })

/* ---------------- Modal de info de cada app ---------------- */
const infoApp = ref<AppEntry | null>(null)
const openInfo = (a: AppEntry) => { infoApp.value = a }

/* ---------------- Formulario de contacto (modal) ----------------
   Enlazable por #contacto y abierto desde el link del footer. El envío usa el
   MISMO relay/identidad que el input "Solicita una app" (ver ContactModal). */
const contactOpen = ref(window.location.hash === '#contacto')
const openContact = () => { contactOpen.value = true }
window.addEventListener('hashchange', () => { if (window.location.hash === '#contacto') contactOpen.value = true })

/* ---------------- Mi perfil ----------------
   El topbar (<dotrino-topbar>) es DUEÑO del modal "Mi perfil": le pasamos la
   identidad + reputación del vault id.dotrino.com y él abre <dotrino-profile
   mode="self"> solo (deriva el avatar del perfil activo y maneja el back). Así el
   home NO fija la versión de @dotrino/profile: viaja dentro de @dotrino/topbar. */
const identityInst = ref<any>(null)
const reputationInst = ref<any>(null)
const siteNavRef = ref<any>(null)
const profileModalOpen = ref(false)
let _identity: any = null
const ensureIdentity = async () => {
  if (_identity) return _identity
  try { _identity = await Identity.connect() } catch (_) { _identity = null }
  return _identity
}

// Conecta identidad + reputación al montar → se las pasa al topbar (que deriva el
// avatar del perfil activo y abre el modal). Cambiar de perfil se hace en profile.dotrino.com.
onMounted(async () => {
  const id = await ensureIdentity()
  if (!id) return
  identityInst.value = id
  try { reputationInst.value = createVaultReputation(id) } catch (_) { reputationInst.value = null }
})

/* "Exigir apodo": acciones que se firman con la identidad (p. ej. enviar una
   solicitud de app) requieren nickname. Si falta, se abre el modal EDITABLE (el
   topbar lo abre con allow-edit) y la acción pendiente se reanuda al guardar el
   nombre. Mismo patrón que pronóstico y otras apps. Se expone a los hijos vía provide. */
const pendingAction = ref<null | (() => void)>(null)
async function ensureNick (run: () => void) {
  const id = await ensureIdentity()
  if (id && !id.me?.nickname) {
    pendingAction.value = run
    profileModalOpen.value = true
    await siteNavRef.value?.openProfile(true) // editable: poner el apodo aquí mismo
    return
  }
  run()
}
const getMyIdentity = async () => {
  const id = await ensureIdentity()
  return {
    pubkey: id?.me?.publickey || '',
    nickname: id?.me?.nickname || '',
    signData: (data: any) => id?.signData?.(data),
  }
}
provide('ensureNick', ensureNick)
provide('getMyIdentity', getMyIdentity)

// Eventos del modal (lo abre/cierra el topbar). Al guardar el nombre, reanuda la
// acción pendiente (ensureNick). profileModalOpen alimenta el chevron de volver.
const onProfileOpen = () => { profileModalOpen.value = true }
const onProfileName = (e: any) => {
  const n = e?.detail?.name
  if (n && pendingAction.value) {
    const run = pendingAction.value
    pendingAction.value = null
    run()
  }
}
const onProfileClose = () => { profileModalOpen.value = false; pendingAction.value = null }

// Tema del modal de perfil acorde al home (Cool & Cozy: claro + azul, fuentes propias).
const profileTheme = {
  '--ccp-bg': '#ffffff', '--ccp-bg-2': '#f4f7f9', '--ccp-bg-3': '#eaeff3', '--ccp-bg-4': '#e3e9ed',
  '--ccp-border': '#cfd8de', '--ccp-text': '#181c1e', '--ccp-muted': '#4a5560',
  '--ccp-accent': '#00658c', '--ccp-accent-2': '#00506f', '--ccp-accent-text': '#ffffff', '--ccp-gold': '#c98a00', '--ccp-derived': '#b07f00',
  '--ccp-online': '#00897b', '--ccp-affinity': '#2f8fd6', '--ccp-input-bg': '#f1f4f6', '--ccp-radius': '16px',
  '--ccp-font': "'Hanken Grotesk', system-ui, sans-serif",
  '--ccp-font-headline': "'Bricolage Grotesque', system-ui, sans-serif",
  '--ccp-font-mono': "'JetBrains Mono', ui-monospace, monospace",
}

/* ---------------- Volver unificado (@dotrino/nav) ----------------
   El botón físico / chevron cierra el modal de info o el menú móvil, luego la
   subvista abierta ("¿Qué es Dotrino?" / Enterprise → vuelve a la página de
   apps), y solo después abandona el sitio.
   La subvista es UNA sola capa (no una por vista): pasar de una a la otra deja la
   capa abierta y solo cambia su URL (ver navTo), así el volver siempre aterriza en
   el catálogo y no encadena entradas de history. */
useBackLayer(infoApp, { onClose: () => { infoApp.value = null } })
useBackLayer(menuOpen)
useBackLayer(subview, {
  url: () => VIEW_PATH[subview.value as SubView],
  onClose: () => { subview.value = null },
})
// El modal de perfil registra su PROPIA capa de "volver" dentro del topbar (dueño
// del modal); aquí solo reflejamos su estado abierto en hasBack (chevron visible).
useBackLayer(contactOpen, { onClose: () => { contactOpen.value = false } })

// dotrino.com es el root del ecosistema: el chevron solo aparece cuando hay
// algo "atrás" (una subvista /que-es · /enterprise o un modal/menú abierto).
const hasBack = computed(() => !!(subview.value || infoApp.value || menuOpen.value || profileModalOpen.value || contactOpen.value))

/* ---------------- Navegación entre vistas ----------------
   El cambio de vista y la URL los gestiona la capa de back (subview + { url });
   al volver a home con una capa abierta, dotrino-nav restaura la URL solo.
   Dos casos que la capa NO cubre y resuelve el replaceState:
   · subvista → subvista: la capa sigue abierta (no se reabre), así que su URL se
     corrige en el sitio, sin encadenar otra entrada de history.
   · deep-link directo a /que-es · /enterprise → home: no hay capa que cerrar
     (nació abierta), así que la barra vuelve a '/' a mano. */
const navTo = (target: 'home' | SubView, sectionId?: string) => {
  menuOpen.value = false
  const prev = subview.value
  const next = target === 'home' ? null : target
  subview.value = next
  if (next && prev) {
    window.history.replaceState(window.history.state, '', VIEW_PATH[next])
  } else if (!next && prev && window.location.pathname !== '/') {
    window.history.replaceState(window.history.state, '', '/')
  }
  requestAnimationFrame(() => {
    const element = sectionId ? document.getElementById(sectionId) : null
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
const showFullHome = () => navTo('about')
const showEnterprise = () => navTo('enterprise')
const scrollToSection = (sectionId: string) => {
  if (sectionId === 'aplicaciones') navTo('home', 'aplicaciones')
  else navTo('about', sectionId)
}
</script>

<template>
  <div class="app">
    <SiteNav
      ref="siteNavRef"
      v-model:locale="locale"
      v-model:open="menuOpen"
      :has-back="hasBack"
      :identity="identityInst"
      :reputation="reputationInst"
      :profile-theme="profileTheme"
      @navigate="scrollToSection"
      @contact="openContact"
      @profile-open="onProfileOpen"
      @profile-name="onProfileName"
      @profile-close="onProfileClose"
    />

    <AboutSections
      v-if="subview === 'about'"
      :locale="locale"
      @navigate="scrollToSection"
      @enterprise="showEnterprise"
    />

    <EnterpriseSections
      v-else-if="subview === 'enterprise'"
      :locale="locale"
      @contact="openContact"
      @about="showFullHome"
    />

    <div v-if="compact" class="compact-spacer"></div>
    <AppsCatalog
      v-if="compact"
      :locale="locale"
      @info="openInfo"
      @about="showFullHome"
      @enterprise="showEnterprise"
    />

    <SiteFooter :locale="locale" />

    <InfoModal v-if="infoApp" :app="infoApp" :locale="locale" @close="infoApp = null" />

    <ContactModal v-if="contactOpen" :locale="locale" @close="contactOpen = false" />
  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────
   Dotrino — cáscara. Estética "panel soberano": tinta profunda + acento
   lima, atmósfera 100% CSS (grilla tipo blueprint + glows), sin fotos ni
   parallax. Las primitivas compartidas (.section*, code) viven en style.css;
   cada sección trae su propio CSS scoped en su componente.
   ───────────────────────────────────────────────────────────────────────── */
.app {
  position: relative;
  z-index: 0;
  isolation: isolate;
  min-height: 100vh;
  font-family: var(--font-body);
  color: var(--text);
  overflow-x: hidden;
}
/* Atmósfera de fondo: grilla blueprint + dos glows suaves (lima + frío).
   Va en `position: absolute` (no `fixed`): una capa fija a pantalla completa
   crea un layer de compositor anclado al viewport que algunas GPUs móviles
   (Adreno/Mali en Android/MIUI) recomponen mal al hacer scroll → artefactos.
   En `absolute` la capa cubre todo el alto de `.app` y hace scroll con el
   contenido = sin layer fijo, sin corrupción. Misma razón por la que ya se
   quitó el `mask-image` (ver nota abajo). */
.app::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(60rem 40rem at 78% -8%, rgba(var(--accent-rgb), 0.08), transparent 60%),
    radial-gradient(50rem 38rem at 8% 12%, rgba(114, 193, 240, 0.14), transparent 62%),
    linear-gradient(180deg, var(--ink-2), var(--ink) 38%);
}
/* Grilla técnica tenue, con desvanecido radial hacia los bordes.
   El fundido se HORNEA como viñeta de tinta dentro del mismo background en vez
   de usar `mask-image`: enmascarar una capa `position: fixed` a pantalla
   completa corrompe el compositor en algunas GPUs móviles (bandas horizontales
   rotas en Android/MIUI). Sin máscara = sin tile corrupto; y en `absolute`
   (no `fixed`) tampoco hay layer fijo que recomponer. */
.app::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    radial-gradient(120% 90% at 50% 0%, transparent 30%, var(--ink) 82%),
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 100% 100%, 64px 64px, 64px 64px;
  opacity: 0.5;
  pointer-events: none;
}

.compact-spacer { height: 64px; }
</style>
