<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { messages, type Locale } from '../i18n'
import '@dotrino/topbar' // barra superior estándar del ecosistema (marca + volver + idioma + perfil + support + modal de perfil)
import '@dotrino/install' // botón "Instalar app" (va en el slot end del topbar)

// El topbar es DUEÑO del modal "Mi perfil": le pasamos identity+reputation (props
// JS) y él abre <dotrino-profile> solo, deriva el avatar y maneja el back. Así el
// home NO fija la versión de @dotrino/profile (viaja dentro de @dotrino/topbar).
const props = defineProps<{ hasBack: boolean; identity?: any; reputation?: any; profileTheme?: Record<string, string> | null }>()
const locale = defineModel<Locale>('locale', { required: true })
const menuOpen = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{
  navigate: [sectionId: string]; contact: []
  'profile-open': []; 'profile-name': [e: CustomEvent]; 'profile-close': []
}>()

const t = computed(() => messages[locale.value])

// Ref al elemento del topbar → le seteamos identity/reputation/tema (propiedades
// JS) y desde App.vue se llama openProfile(editable) para el onboarding del apodo.
const topbarRef = ref<any>(null)
watchEffect(() => {
  const tb = topbarRef.value
  if (!tb) return
  tb.identity = props.identity ?? null
  tb.reputation = props.reputation ?? null
  tb.profileTheme = props.profileTheme ?? null
})
defineExpose({ openProfile: (editable = false) => topbarRef.value?.openMyProfile({ editable }) })

// El idioma lo gobierna el toggle del <dotrino-topbar>; sincronizamos su evento
// con nuestro modelo (que persiste en LANG_KEY vía el watcher de App.vue).
const onLang = (e: Event) => {
  const l = (e as CustomEvent).detail?.lang
  if (l === 'es' || l === 'en') locale.value = l
}

// El navbar gestiona su propio estado de scroll (sombra/borde al desplazar).
const isScrolled = ref(false)
const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="site-header">
    <dotrino-topbar
      ref="topbarRef"
      class="site-topbar"
      :class="{ scrolled: isScrolled, 'has-back': hasBack }"
      brand="Dotrino"
      icon="/images/imagoWBG.png"
      brand-href="/"
      :lang="locale"
      profile
      support-href="https://ko-fi.com/dotrino"
      support-repo="imdotrino/dotrino-home"
      support-discord="https://discord.gg/D648uq7cth"
      support-contact
      @dotrino-lang="onLang"
      @dotrino-profile="emit('profile-open')"
      @dotrino-profile-name="(e: Event) => emit('profile-name', e as CustomEvent)"
      @dotrino-profile-close="emit('profile-close')"
      @cc-support-contact="emit('contact')"
    >
      <!-- Enlaces de sección (slot central) -->
      <div class="nav-links desktop-links">
        <a @click="emit('navigate', 'aplicaciones')" class="nav-link">{{ t.nav.apps }}</a>
        <a @click="emit('navigate', 'servicio')" class="nav-link">{{ t.nav.service }}</a>
        <a @click="emit('contact')" class="nav-link">{{ t.contact.link }}</a>
      </div>

      <!-- Cluster derecho extra (slot end, antes de idioma/perfil/moneda) -->
      <dotrino-install slot="end" class="cc-install" :lang="locale"></dotrino-install>
      <button
        slot="end"
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </dotrino-topbar>

    <!-- Menú desplegable en móvil -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a @click="emit('navigate', 'aplicaciones')" class="nav-link">{{ t.nav.apps }}</a>
      <a @click="emit('navigate', 'servicio')" class="nav-link">{{ t.nav.service }}</a>
      <a @click="menuOpen = false; emit('contact')" class="nav-link">{{ t.contact.link }}</a>
    </div>
  </div>
</template>

<style scoped>
/* ───────────────────────── Barra superior ─────────────────────────
   Header estándar del ecosistema (<dotrino-topbar>) tematizado al look
   claro "Cool & Cozy" del home. Reemplaza el navbar hecho a mano. */
.site-header { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; }

.site-topbar {
  /* Tema del topbar (el paquete lee estas vars con fallback al oscuro). */
  --dotrino-topbar-bg: rgba(244, 247, 249, 0.88);
  --dotrino-topbar-border: transparent;
  --dotrino-topbar-text: var(--text);
  --dotrino-topbar-muted: var(--text-dim);
  --dotrino-topbar-accent: var(--accent);
  --dotrino-topbar-accent-text: var(--accent-ink);
  --dotrino-topbar-pad: 0.85rem clamp(1rem, 4vw, 2rem);
  --dotrino-topbar-gap: 1rem;
  --dotrino-topbar-font: var(--font-body);
  /* Moneda de support (vive en el shadow del topbar): las --ds-* HEREDAN hacia
     adentro y la tematizan clara (igual que cuando estaba en el light DOM). */
  --ds-accent: #00658c;
  --ds-accent-press: #00506f;
  --ds-modal-bg: #ffffff;
  --ds-modal-text: #181c1e;
  --ds-modal-muted: #4a5560;
  --ds-modal-border: #e3e9ed;
  --ds-modal-hover: rgba(0, 0, 0, 0.06);
  display: block;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.site-topbar.scrolled {
  --dotrino-topbar-bg: rgba(244, 247, 249, 0.95);
  --dotrino-topbar-border: var(--line);
  box-shadow: 0 8px 30px rgba(74, 85, 96, 0.06);
}

/* Marca: logo 34px + "dotrino" en Comfortaa minúsculas (como el header viejo). */
.site-topbar::part(brand-icon) { width: 34px; height: 34px; border-radius: 8px; }
.site-topbar::part(brand-name) {
  font-family: 'Comfortaa', var(--font-display);
  font-size: 1.35rem; font-weight: 700; letter-spacing: -0.01em; text-transform: lowercase;
}
/* Chevron de "volver": dotrino.com es el root, así que solo aparece cuando hay
   algo atrás (una vista /que-es o un modal/menú abierto). */
.site-topbar:not(.has-back)::part(back) { display: none; }
.site-topbar::part(back) { color: var(--text); }

/* Toggle de idioma: mismo look que el .lang-selector viejo (pill, mono, 0.72rem). */
.site-topbar::part(lang) { border-color: var(--line-2); background: var(--surface); }
.site-topbar::part(lang-btn) { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.04em; }

/* Botón "mi perfil": ghost circular, como el viejo .nav-profile. */
.site-topbar::part(profile) {
  width: 38px; height: 38px;
  background: var(--surface); border-color: var(--line-2); color: var(--text);
}

/* ───────── Enlaces de sección (slotted → light DOM, estilo directo) ───────── */
.nav-links { display: flex; gap: 1.8rem; }
.nav-link {
  color: var(--text-dim); text-decoration: none; cursor: pointer;
  font-size: 0.92rem; font-weight: 500; letter-spacing: 0.01em;
  position: relative; transition: color 0.2s ease;
}
.nav-link:hover { color: var(--text); }
.nav-link::after {
  content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px;
  background: var(--accent); transition: width 0.25s ease;
}
.nav-link:hover::after { width: 100%; }

/* Botón "Instalar App" = <dotrino-install>. Conserva el look del viejo botón. */
.cc-install {
  --cc-install-bg: var(--accent);
  --cc-install-color: var(--accent-ink);
  --cc-install-bg-hover: var(--accent-press);
  --cc-install-radius: 999px;
  --cc-install-pad: 0.5rem 1.05rem;
  --cc-install-font-size: 0.86rem;
}
.cc-install::part(button) {
  font-family: var(--font-body); font-weight: 700; white-space: nowrap;
  border: none; cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.cc-install::part(button):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(var(--accent-rgb), 0.22);
}

/* Hamburguesa (solo móvil). */
.hamburger {
  display: none; flex-direction: column; justify-content: space-between;
  width: 26px; height: 18px; background: transparent; border: none; cursor: pointer; padding: 0;
}
.hamburger span { display: block; height: 2px; width: 100%; background: var(--text); border-radius: 2px; transition: transform 0.3s, opacity 0.3s; }
.hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

/* Menú desplegable en móvil (debajo de la barra). */
.mobile-menu {
  display: none; flex-direction: column;
  background: rgba(244, 247, 249, 0.98); border-top: 1px solid var(--line);
  max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 320px; }
.mobile-menu .nav-link { padding: 1rem 2rem; border-bottom: 1px solid var(--line); color: var(--text); }
.mobile-menu .nav-link::after { display: none; }

@media (max-width: 820px) {
  .desktop-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
}
</style>
