<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { messages, type Locale } from '../i18n'
import { apps, defaultRecentApps, type AppEntry, type SubKey } from '../data/apps'
import { recents, loadRecents } from '../recents'

const props = defineProps<{ locale: Locale }>()
defineEmits<{ info: [app: AppEntry]; about: [] }>()
const t = computed(() => messages[props.locale])

/* "Recientes" reemplaza a "Todas": lista las apps abiertas, más recientes
   primero. El conteo es CROSS-APP y vive en el store compartido (lo escribe
   <dotrino-support> en cada app; ver ../recents.ts), así cuenta incluso el
   acceso directo a cada subdominio. Sin historial todavía, destaca una selección
   inicial (Mundial, contadores, juegos) desde defaultRecentApps(). */
type TabKey = 'recientes' | 'social' | 'apps' | 'deportes' | 'juegos' | 'android' | 'wip'
const TAB_ORDER: TabKey[] = ['recientes', 'social', 'apps', 'deportes', 'juegos', 'android', 'wip']
const activeTab = ref<TabKey>('recientes')

// El store cuenta por id de app = hostname; mapeamos cada app.url a su hostname.
const hostOf = (url: string): string => { try { return new URL(url).hostname } catch { return url } }

onMounted(loadRecents)

const recentApps = computed<AppEntry[]>(() => {
  const map = recents.value
  const opened = apps
    .filter((a) => map[hostOf(a.url)])
    .sort((a, b) => (map[hostOf(b.url)]?.ts ?? 0) - (map[hostOf(a.url)]?.ts ?? 0))
  // Sin historial útil (vacío o solo apps que ya no existen) → selección inicial.
  return opened.length ? opened : defaultRecentApps()
})

const tabApps = (tab: TabKey): AppEntry[] =>
  tab === 'recientes'
    ? recentApps.value
    : tab === 'wip'
      ? apps.filter((a) => a.wip)
      : apps.filter((a) => !a.wip && a.cat === tab)

const visibleTabs = computed(() => TAB_ORDER.filter((tab) => tabApps(tab).length > 0))

// Subcategorías del tab "Juegos": solo / multijugador / configurables.
const SUB_ORDER: SubKey[] = ['solo', 'multi', 'config']
const activeSub = ref<SubKey>('solo')
const subApps = (sub: SubKey) => tabApps('juegos').filter((a) => (a.sub ?? 'solo') === sub)
const visibleSubs = computed(() => SUB_ORDER.filter((sub) => subApps(sub).length > 0))

const visibleApps = computed(() =>
  activeTab.value === 'juegos' ? subApps(activeSub.value) : tabApps(activeTab.value),
)

// Al entrar al tab Juegos, asegurar una subcategoría visible seleccionada.
watch(activeTab, (tab) => {
  if (tab === 'juegos' && !visibleSubs.value.includes(activeSub.value)) {
    activeSub.value = visibleSubs.value[0] ?? 'solo'
  }
})
</script>

<template>
  <section id="aplicaciones" class="section aplicaciones-section apps-only">
    <div class="section-content">
      <h2 class="section-title">{{ t.apps.title }}</h2>
      <p class="section-text">{{ t.apps.text }}</p>
      <button @click="$emit('about')" class="full-home-button">{{ t.apps.fullHome }}</button>
      <div class="apps-tabs" role="tablist">
        <button
          v-for="tab in visibleTabs"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab"
          :class="['apps-tab', { active: activeTab === tab, wip: tab === 'wip' }]"
          @click="activeTab = tab"
        >{{ t.tabs[tab] }}</button>
      </div>

      <div
        v-if="activeTab === 'juegos' && visibleSubs.length > 1"
        class="apps-subtabs"
        role="tablist"
      >
        <button
          v-for="sub in visibleSubs"
          :key="sub"
          type="button"
          role="tab"
          :aria-selected="activeSub === sub"
          :class="['apps-subtab', { active: activeSub === sub }]"
          @click="activeSub = sub"
        >{{ t.subtabs[sub] }}</button>
      </div>

      <div class="apps-grid" :class="{ 'wip-grid': activeTab === 'wip' }">
        <div
          class="app-card"
          :class="{ wip: a.wip }"
          v-for="a in visibleApps"
          :key="a.url"
        >
          <button
            type="button"
            class="app-info-btn"
            :aria-label="t.apps.info + ': ' + a.name"
            @click="$emit('info', a)"
          >i</button>
          <a
            :href="a.url"
            :target="a.apk ? '_blank' : '_self'"
            rel="noopener"
            class="app-logo-link"
            :aria-label="t.apps.open + ': ' + a.name"
          >
            <img class="app-logo" :src="a.logo" :alt="a.name" width="120" height="120" />
          </a>
          <h3>{{ a.name }}</h3>
          <p v-html="a.desc[locale]"></p>
          <a
            :href="'https://github.com/' + a.repo"
            target="_blank"
            rel="noopener"
            class="app-repo"
          >github.com/{{ a.repo }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aplicaciones-section { padding-top: 7rem; }

/* Modo compacto (home /): solo logo + nombre. */
.aplicaciones-section.apps-only .section-title,
.aplicaciones-section.apps-only > .section-content > .section-text,
.aplicaciones-section.apps-only .app-card > p,
.aplicaciones-section.apps-only .app-repo { display: none; }
.aplicaciones-section.apps-only .app-card { padding: 1.6rem 1rem; gap: 0.85rem; }
.aplicaciones-section.apps-only .apps-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.1rem; }

.full-home-button {
  display: block; margin: 0 auto; background: transparent; color: var(--text);
  border: 1px solid var(--line-2); padding: 0.7rem 1.7rem; font-family: var(--font-body);
  font-size: 0.92rem; font-weight: 600; border-radius: 10px; cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
}
.full-home-button:hover { background: var(--surface-2); border-color: var(--accent); color: var(--text); transform: translateY(-2px); }

/* ───────────────────────── Tabs ───────────────────────── */
.apps-tabs {
  display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem;
  margin: 2.2rem auto 0; padding: 0.3rem;
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
}
.apps-tab {
  background: transparent; color: var(--text-dim); border: none; border-radius: 8px;
  padding: 0.5rem 1.15rem; font-family: var(--font-body); font-size: 0.92rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: color 0.2s ease, background 0.2s ease;
}
.apps-tab:hover { color: var(--text); background: var(--surface-2); }
.apps-tab.active { color: var(--accent-ink); background: var(--accent); }
.apps-tab.wip.active { background: var(--mint); color: #06231c; }

.apps-subtabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 1.2rem; }
.apps-subtab {
  background: var(--surface); color: var(--text-dim); border: 1px solid var(--line-2);
  border-radius: 50px; padding: 0.34rem 1rem; font-family: var(--font-mono); font-size: 0.78rem; font-weight: 500;
  letter-spacing: 0.02em; cursor: pointer; white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.apps-subtab:hover { color: var(--text); border-color: var(--line-2); background: var(--surface-2); }
.apps-subtab.active { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }

/* ───────────────────────── Grid de apps ───────────────────────── */
.apps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.4rem; margin-top: 2.4rem; }
.apps-grid.wip-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.app-card {
  position: relative; display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 2rem 1.6rem; gap: 0; background: var(--surface); border: 1px solid var(--line);
  border-radius: 16px; overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.app-card::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.25s ease;
  background: radial-gradient(50% 60% at 50% 0%, rgba(var(--accent-rgb), 0.10), transparent 70%);
}
.app-card:hover {
  transform: translateY(-6px); border-color: var(--line-2); background: var(--surface-2);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}
.app-card:hover::before { opacity: 1; }
.app-card.wip { border-color: rgba(110, 231, 200, 0.4); }
.app-card.wip h3 { color: var(--mint); }
.app-logo-link { display: inline-block; line-height: 0; cursor: pointer; border-radius: 18px; outline: none; -webkit-tap-highlight-color: transparent; }
.app-logo-link:focus, .app-logo-link:active, .app-logo-link:focus-visible { outline: none; }
.app-logo { width: 80px; height: 80px; margin-bottom: 1.2rem; border-radius: 18px; box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.app-card:hover .app-logo { transform: scale(1.05) rotate(-2deg); }
.app-logo-link:hover .app-logo { box-shadow: 0 14px 32px rgba(var(--accent-rgb), 0.28); }
.app-card h3 { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; font-size: 1.32rem; color: var(--text); margin-bottom: 0.75rem; }
.app-card p { line-height: 1.62; color: var(--text-dim); font-size: 0.96rem; margin-bottom: 1.4rem; }
.app-repo { display: block; margin-top: 0.85rem; color: var(--text-faint); font-family: var(--font-mono); font-size: 0.76rem; text-decoration: none; word-break: break-all; transition: color 0.2s ease; }
.app-repo:hover { color: var(--accent); }

.app-info-btn {
  position: absolute; top: 0.6rem; right: 0.6rem; width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center; padding: 0;
  background: rgba(0, 0, 0, 0.35); color: var(--text-dim); border: 1px solid var(--line-2);
  border-radius: 50%; font-family: var(--font-display); font-style: italic; font-weight: 700;
  font-size: 0.92rem; line-height: 1; cursor: pointer; z-index: 3; transition: all 0.2s ease;
}
.app-info-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

/* ───────────────────────── Responsive ───────────────────────── */
@media (max-width: 768px) {
  /* En móvil el top va a 4rem (como antes): la base .section vive ahora en
     style.css con menor especificidad y no reseteaba este padding-top scoped. */
  .aplicaciones-section { padding-top: 4rem; }
  .aplicaciones-section.apps-only .apps-grid { grid-template-columns: repeat(3, 1fr); gap: 0.8rem; }
  .aplicaciones-section.apps-only .app-card { padding: 1rem 0.5rem; }
  .aplicaciones-section.apps-only .app-logo { width: 58px; height: 58px; margin-bottom: 0; }
  .aplicaciones-section.apps-only .app-card h3 { font-size: 0.95rem; margin-bottom: 0; }
}
@media (max-width: 480px) {
  .aplicaciones-section.apps-only .apps-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
