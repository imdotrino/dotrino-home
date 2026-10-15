<script setup lang="ts">
import { ref, shallowRef, computed, watch, provide, onMounted } from 'vue'
import { detectLocale, localePath, LANG_KEY, type Locale } from './i18n'
import type { AppEntry } from './data/apps'
import SiteNav from './components/SiteNav.vue'
import AppsCatalog from './components/AppsCatalog.vue'
import SiteFooter from './components/SiteFooter.vue'
import InfoModal from './components/InfoModal.vue'
import ContactModal from './components/ContactModal.vue'
import { useBackLayer } from '@dotrino/nav/vue'
import { Identity } from '@dotrino/identity'
import { createVaultReputation } from '@dotrino/reputation'

/* App.vue es la cáscara: idioma, capas de "volver" y el perfil del ecosistema.
   El home es UNA sola vista (el catálogo): lo que antes eran las subvistas
   /que-es y /enterprise ahora vive en el wiki (CONVENCIONES §9.2), y el catálogo
   enlaza a esas páginas. El contenido vive en componentes (SiteNav, AppsCatalog,
   SiteFooter, InfoModal) y los datos/i18n en módulos (./i18n, ./data/*, ./recents). */

/* ---------------- Idioma (ES / EN) ---------------- */
const locale = ref<Locale>(detectLocale())
watch(
  locale,
  (l) => {
    localStorage.setItem(LANG_KEY, l)
    document.documentElement.lang = l
    // La dirección sigue al idioma (`/` ↔ `/en/`), sin recargar ni perder el #fragment.
    const path = localePath(l)
    if (window.location.pathname !== path) {
      window.history.replaceState(window.history.state, '', path + window.location.search + window.location.hash)
    }
  },
  { immediate: true },
)

const menuOpen = ref(false)

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
   El botón de perfil es del <dotrino-topbar>: le pasamos la identidad + reputación del
   vault id.dotrino.com y él enseña el menú de perfiles (cambiar, abrir, crear, adoptar,
   iniciar sesión). El perfil se edita en profile.dotrino.com (§6.1). */
// shallowRef: el Proxy reactivo de Vue rompe el postMessage de la identidad.
const identityInst = shallowRef<any>(null)
const reputationInst = shallowRef<any>(null)
let _identity: any = null
const ensureIdentity = async () => {
  if (_identity) return _identity
  try { _identity = await Identity.connect() } catch (_) { _identity = null }
  return _identity
}

// Conecta identidad + reputación al montar → se las pasa al topbar (que deriva el
// avatar del perfil activo y lista los perfiles en su menú).
onMounted(async () => {
  const id = await ensureIdentity()
  if (!id) return
  identityInst.value = id
  try { reputationInst.value = createVaultReputation(id) } catch (_) { reputationInst.value = null }
})

const getMyIdentity = async () => {
  const id = await ensureIdentity()
  return {
    pubkey: id?.me?.publickey || '',
    nickname: id?.me?.nickname || '',
    signData: (data: any) => id?.signData?.(data),
    profileCard: () => id?.profileCard?.(),
  }
}
provide('getMyIdentity', getMyIdentity)

/* ---------------- Volver unificado (@dotrino/nav) ----------------
   El botón físico / chevron cierra el modal de info, el menú móvil o el de
   contacto, y solo después abandona el sitio. */
useBackLayer(infoApp, { onClose: () => { infoApp.value = null } })
useBackLayer(menuOpen)
useBackLayer(contactOpen, { onClose: () => { contactOpen.value = false } })

// dotrino.com es el root del ecosistema: el chevron solo aparece cuando hay
// algo "atrás" (un modal o el menú abierto).
const hasBack = computed(() => !!(infoApp.value || menuOpen.value || contactOpen.value))

/* ---------------- Navegación dentro del home ----------------
   Una sola vista: los enlaces del navbar solo hacen scroll a su sección. */
const scrollToSection = (sectionId: string) => {
  menuOpen.value = false
  requestAnimationFrame(() => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>

<template>
  <div class="app">
    <SiteNav
      v-model:locale="locale"
      v-model:open="menuOpen"
      :has-back="hasBack"
      :identity="identityInst"
      :reputation="reputationInst"
      @navigate="scrollToSection"
      @contact="openContact"
    />

    <div class="compact-spacer"></div>
    <AppsCatalog :locale="locale" @info="openInfo" />

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
