<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { messages, type Locale } from '../i18n'
import { avatarDataUri } from '@dotrino/identity/capabilities'

const props = defineProps<{ hasBack: boolean; profilePk?: string | null }>()
const avatarUrl = computed(() => props.profilePk ? avatarDataUri(props.profilePk, { size: 64 }) : null)
const locale = defineModel<Locale>('locale', { required: true })
const menuOpen = defineModel<boolean>('open', { required: true })
defineEmits<{ navigate: [sectionId: string]; profile: []; contact: [] }>()

const t = computed(() => messages[locale.value])

// El navbar gestiona su propio estado de scroll (sombra/borde al desplazar).
const isScrolled = ref(false)
const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav :class="['navbar', { scrolled: isScrolled }]">
    <div class="nav-container">
      <div class="logo">
        <!-- dotrino.com es el root del ecosistema: en el home no hay a dónde
             volver, así que el chevron solo aparece cuando hay algo atrás
             (vista /que-es o un modal/menú abierto). -->
        <dotrino-back v-if="hasBack" class="cc-back"></dotrino-back>
        <img src="/images/imagoWBG.png" alt="Dotrino Logo" class="logo-img" />
        <span class="logo-text">Dotrino</span>
      </div>

      <div class="nav-actions">
        <div class="lang-selector" role="group" :aria-label="t.langLabel">
          <button
            :class="{ on: locale === 'es' }"
            @click="locale = 'es'"
            aria-label="Español"
          >ES</button>
          <button
            :class="{ on: locale === 'en' }"
            @click="locale = 'en'"
            aria-label="English"
          >EN</button>
        </div>

        <dotrino-install class="cc-install" :lang="locale"></dotrino-install>
      </div>

      <div class="nav-links desktop-links">
        <a @click="$emit('navigate', 'aplicaciones')" class="nav-link">{{ t.nav.apps }}</a>
        <a @click="$emit('navigate', 'servicio')" class="nav-link">{{ t.nav.service }}</a>
        <a @click="$emit('contact')" class="nav-link">{{ t.contact.link }}</a>
      </div>

      <button
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button
        class="nav-profile"
        @click="$emit('profile')"
        :aria-label="t.nav.profile"
        :title="t.nav.profile"
      >
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="nav-avatar" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      </button>

      <dotrino-support
        class="nav-support"
        href="https://ko-fi.com/dotrino"
        repo="imdotrino/dotrino-home"
        discord="https://discord.gg/D648uq7cth"
        :lang="locale"
      ></dotrino-support>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a @click="$emit('navigate', 'aplicaciones')" class="nav-link">{{ t.nav.apps }}</a>
      <a @click="$emit('navigate', 'servicio')" class="nav-link">{{ t.nav.service }}</a>
      <a @click="menuOpen = false; $emit('contact')" class="nav-link">{{ t.contact.link }}</a>
    </div>
  </nav>
</template>

<style scoped>
/* ───────────────────────── Navbar ───────────────────────── */
.navbar {
  position: fixed; top: 0; width: 100%;
  /* Sin backdrop-filter: el blur sobre un elemento fijo es el disparador #1 de
     artefactos en Adreno/Mali (MIUI). Tinta casi opaca en su lugar. */
  background: rgba(244, 247, 249, 0.88);
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.navbar.scrolled {
  background: rgba(244, 247, 249, 0.95);
  border-bottom-color: var(--line);
  box-shadow: 0 8px 30px rgba(74, 85, 96, 0.06);
}
.nav-container { max-width: 1240px; margin: 0 auto; padding: 0.85rem 2rem; display: flex; align-items: center; gap: 1rem; }
.logo { display: flex; align-items: center; gap: 0.6rem; }
.cc-back { color: var(--text); --cc-back-size: 34px; margin-left: -6px; }
.logo-img { height: 34px; width: auto; border-radius: 8px; }
.logo-text {
  font-family: 'Comfortaa', var(--font-display);
  font-size: 1.35rem; font-weight: 700; letter-spacing: -0.01em; color: var(--text);
  text-transform: lowercase;
}
.nav-actions { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; }

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

.lang-selector {
  display: inline-flex; border: 1px solid var(--line-2); border-radius: 999px;
  overflow: hidden; background: var(--surface);
}
.lang-selector button {
  background: transparent; color: var(--text-dim); border: none;
  padding: 0.38rem 0.7rem; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.04em; cursor: pointer; transition: color 0.2s ease, background 0.2s ease;
}
.lang-selector button:hover { color: var(--text); }
.lang-selector button.on { background: var(--accent); color: var(--accent-ink); }

/* Botón "Instalar App" = Web Component compartido <dotrino-install>.
   Conserva el look del viejo .install-btn vía custom properties + ::part. */
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

/* Botón "mi perfil": circular, ghost, a la izquierda de la moneda de soporte. */
.nav-profile {
  display: inline-flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; padding: 0; flex-shrink: 0;
  background: var(--surface); color: var(--text);
  border: 1px solid var(--line-2); border-radius: 50%; cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
}
.nav-profile svg { width: 20px; height: 20px; display: block; }
.nav-profile { overflow: hidden; }
.nav-avatar { width: 100%; height: 100%; border-radius: 8px; object-fit: cover; display: block; }
.nav-profile:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); transform: translateY(-1px); }

.hamburger {
  display: none; flex-direction: column; justify-content: space-between;
  width: 26px; height: 18px; background: transparent; border: none; cursor: pointer; padding: 0;
}
.hamburger span { display: block; height: 2px; width: 100%; background: var(--text); border-radius: 2px; transition: transform 0.3s, opacity 0.3s; }
.hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

.mobile-menu {
  display: none; flex-direction: column;
  background: rgba(244, 247, 249, 0.98); border-top: 1px solid var(--line);
  max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 320px; }
.mobile-menu .nav-link { padding: 1rem 2rem; border-bottom: 1px solid var(--line); color: var(--text); }
.mobile-menu .nav-link::after { display: none; }

@media (max-width: 820px) {
  .nav-container { padding: 0.7rem 1rem; flex-wrap: wrap; row-gap: 0.55rem; }
  .desktop-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
  .logo-text { font-size: 1.15rem; }
  .logo { order: 1; }
  .nav-profile { order: 2; margin-left: auto; }
  .nav-support { order: 3; }
  .hamburger { order: 4; margin-left: 0.8rem; }
  .nav-actions { order: 5; flex-basis: 100%; justify-content: flex-start; margin-left: 0; }
}
</style>
