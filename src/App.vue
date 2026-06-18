<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { detectLocale, LANG_KEY, type Locale } from './i18n'
import type { AppEntry } from './data/apps'
import SiteNav from './components/SiteNav.vue'
import AboutSections from './components/AboutSections.vue'
import AppsCatalog from './components/AppsCatalog.vue'
import SiteFooter from './components/SiteFooter.vue'
import InfoModal from './components/InfoModal.vue'
import { useBackLayer } from '@dotrino/nav/vue'
import { Identity } from '@dotrino/identity'
import { createVaultProfileProvider } from '@dotrino/profile'
import '@dotrino/profile'
import { createVaultReputation } from '@dotrino/reputation'

/* App.vue es la cáscara: idioma, routing home↔/que-es, capas de "volver" y el
   perfil del ecosistema. El contenido vive en componentes (SiteNav,
   AboutSections, AppsCatalog, SiteFooter, InfoModal) y los datos/i18n en
   módulos (./i18n, ./data/*, ./recents). */

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

/* ---------------- Vistas: home (apps) ↔ "¿Qué es Dotrino?" ----------------
   home = página simplificada (root oficial '/', solo apps); about = '/que-es',
   toda la info del home sin la sección de apps. La vista about tiene URL propia
   enlazable e indexable; `aboutOpen` se registra como capa de dotrino-nav
   con { url } para reflejar la ruta (ver useBackLayer abajo). */
const ABOUT_PATH = '/que-es'
// Vista inicial derivada de la URL (deep-link directo a /que-es, p. ej. desde la
// versión estática que-es.html que sirve GitHub Pages con 200; acepta también
// /que-es.html y barra final).
const aboutOpen = ref(/\/que-es(\.html)?\/?$/.test(window.location.pathname))
const compact = computed(() => !aboutOpen.value)

// Mantén el <title> acorde a la vista en navegación cliente (los títulos de la
// carga inicial los ponen index.html / que-es.html, ya correctos para crawlers).
watch(aboutOpen, (open) => {
  document.title = open
    ? '¿Qué es Dotrino? — Filosofía y arquitectura'
    : 'Dotrino - Ecosistema de Aplicaciones'
})

/* ---------------- Modal de info de cada app ---------------- */
const infoApp = ref<AppEntry | null>(null)
const openInfo = (a: AppEntry) => { infoApp.value = a }

/* ---------------- Mi perfil (Web Component compartido) ----------------
   Abre <dotrino-profile> en modo edición con mi identidad del vault
   id.dotrino.com. Es el MISMO perfil que en el resto del ecosistema. */
const profilePk = ref<string | null>(null)
const myName = ref<string | null>(null)
let _identity: any = null
let _profileProvider: any = null
const ensureIdentity = async () => {
  if (_identity) return _identity
  try { _identity = await Identity.connect() } catch (_) { _identity = null }
  return _identity
}
const ensureProvider = async () => {
  if (_profileProvider) return _profileProvider
  const id = await ensureIdentity()
  if (!id) return null
  let reputation: any = null
  try { reputation = createVaultReputation(id) } catch (_) { /* sin reputación: el perfil igual abre */ }
  try { _profileProvider = createVaultProfileProvider({ identity: id, reputation }) } catch (_) { _profileProvider = null }
  return _profileProvider
}
const openMyProfile = async () => {
  const id = await ensureIdentity()
  const pk = id?.me?.publickey
  if (!pk) return
  myName.value = id?.me?.nickname || null
  profilePk.value = pk
}
const bindProfile = (el: any) => { if (!el) return; ensureProvider().then((p: any) => { if (p) el.provider = p }) }

/* "Exigir apodo": acciones que se firman con la identidad (p. ej. enviar una
   solicitud de app) requieren nickname. Si falta, se abre el perfil (mode="self")
   para ponerlo y la acción pendiente se reanuda al guardarlo. Mismo patrón que
   pronóstico y otras apps. Se expone a los hijos vía provide. */
const pendingAction = ref<null | (() => void)>(null)
async function ensureNick (run: () => void) {
  const id = await ensureIdentity()
  if (id && !id.me?.nickname) {
    pendingAction.value = run
    await openMyProfile()
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

const onProfileName = (e: any) => {
  const n = e?.detail?.name
  if (n) myName.value = n
  if (n && pendingAction.value) {
    const run = pendingAction.value
    pendingAction.value = null
    profilePk.value = null
    run()
  }
}
const onProfileClose = () => { profilePk.value = null; pendingAction.value = null }

// Tema del Web Component de perfil acorde al home (Cool & Cozy: claro + azul, fuentes propias).
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
   vista "¿Qué es Dotrino?" (vuelve a la página de apps), y solo después
   abandona el sitio. */
useBackLayer(infoApp, { onClose: () => { infoApp.value = null } })
useBackLayer(menuOpen)
useBackLayer(aboutOpen, { url: ABOUT_PATH })
useBackLayer(profilePk, { onClose: () => { profilePk.value = null } })

// dotrino.com es el root del ecosistema: el chevron solo aparece cuando hay
// algo "atrás" (vista /que-es o un modal/menú abierto).
const hasBack = computed(() => !!(aboutOpen.value || infoApp.value || menuOpen.value || profilePk.value))

/* ---------------- Navegación entre vistas ----------------
   El cambio de vista y la URL los gestiona la capa de back (aboutOpen + { url });
   al volver a home con una capa abierta, dotrino-nav restaura la URL solo.
   El replaceState es la red de seguridad del deep-link directo a /que-es (donde
   no hay capa que cerrar) para que la barra vuelva a '/'. */
const navTo = (target: 'home' | 'about', sectionId?: string) => {
  menuOpen.value = false
  const wasAbout = aboutOpen.value
  aboutOpen.value = target === 'about'
  if (target === 'home' && wasAbout && window.location.pathname !== '/') {
    window.history.replaceState(window.history.state, '', '/')
  }
  requestAnimationFrame(() => {
    const element = sectionId ? document.getElementById(sectionId) : null
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
const showFullHome = () => navTo('about')
const scrollToSection = (sectionId: string) => {
  if (sectionId === 'aplicaciones') navTo('home', 'aplicaciones')
  else navTo('about', sectionId)
}
</script>

<template>
  <div class="app">
    <SiteNav
      v-model:locale="locale"
      v-model:open="menuOpen"
      :has-back="hasBack"
      @navigate="scrollToSection"
      @profile="openMyProfile"
    />

    <AboutSections v-if="!compact" :locale="locale" @navigate="scrollToSection" />

    <div v-if="compact" class="compact-spacer"></div>
    <AppsCatalog v-if="compact" :locale="locale" @info="openInfo" @about="showFullHome" />

    <SiteFooter :locale="locale" />

    <InfoModal v-if="infoApp" :app="infoApp" :locale="locale" @close="infoApp = null" />

    <!-- Mi perfil del ecosistema (Web Component compartido, vault id.dotrino.com). -->
    <dotrino-profile
      v-if="profilePk"
      :ref="bindProfile"
      modal
      mode="self"
      :pubkey="profilePk"
      :name="myName"
      :lang="locale"
      :style="profileTheme"
      @cc-profile-name="onProfileName"
      @cc-profile-close="onProfileClose"
    ></dotrino-profile>
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
