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

/* "Solicita/Recomienda una app" → relay compartido @dotrino/feedback (Cloudflare
   Worker) que reenvía a GitHub issue + Discord + email. URL configurable por env
   (VITE_FEEDBACK_URL); default al subdominio del worker. */
const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL || 'https://feedback.dotrino.com'
const reqText = ref('')
const reqState = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
async function submitRequest() {
  const text = reqText.value.trim()
  if (!text || reqState.value === 'sending' || reqState.value === 'sent') return
  reqState.value = 'sending'
  try {
    const res = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, app: 'home', locale: props.locale }),
    })
    if (!res.ok) throw new Error('bad')
    reqState.value = 'sent'
    reqText.value = ''
  } catch {
    reqState.value = 'error'
  }
}
</script>

<template>
  <section id="aplicaciones" class="section aplicaciones-section apps-only">
    <div class="section-content">
      <h2 class="section-title">{{ t.apps.title }}</h2>
      <p class="section-text">{{ t.apps.text }}</p>

      <button @click="$emit('about')" class="full-home-button">{{ t.apps.fullHome }}</button>

      <form class="app-request" @submit.prevent="submitRequest">
        <label class="app-request-label" for="app-request-input">{{ t.apps.requestTitle }}</label>
        <div class="app-request-row">
          <input
            id="app-request-input"
            v-model="reqText"
            type="text"
            class="app-request-input"
            :placeholder="t.apps.requestPlaceholder"
            maxlength="2000"
            :disabled="reqState === 'sending' || reqState === 'sent'"
          />
          <button
            type="submit"
            class="app-request-send"
            :disabled="!reqText.trim() || reqState === 'sending' || reqState === 'sent'"
            :aria-label="t.apps.requestSend"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p v-if="reqState === 'sent'" class="app-request-msg ok">{{ t.apps.requestThanks }}</p>
        <p v-else-if="reqState === 'error'" class="app-request-msg err">{{ t.apps.requestError }}</p>
      </form>

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
  display: flex; align-items: center; width: fit-content; margin: 0 auto 1.6rem; background: var(--accent-soft); color: var(--accent);
  border: 1px solid transparent; padding: 0.7rem 1.8rem; font-family: var(--font-body);
  font-size: 0.95rem; font-weight: 700; border-radius: var(--radius-pill); cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.full-home-button:hover { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(var(--accent-rgb), 0.22); }

/* ───────────────────────── Tabs ───────────────────────── */
.apps-tabs {
  display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem;
  margin: 2.2rem auto 0; padding: 0.35rem;
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-pill);
  box-shadow: 0 10px 30px rgba(74, 85, 96, 0.05);
}
.apps-tab {
  background: transparent; color: var(--text-dim); border: none; border-radius: var(--radius-pill);
  padding: 0.5rem 1.15rem; font-family: var(--font-body); font-size: 0.92rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: color 0.2s ease, background 0.2s ease;
}
.apps-tab:hover { color: var(--text); background: var(--surface-2); }
.apps-tab.active { color: var(--accent-ink); background: var(--accent); }
.apps-tab.wip.active { background: var(--mint); color: #ffffff; }

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
  border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(74, 85, 96, 0.05);
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.app-card::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.25s ease;
  background: radial-gradient(50% 60% at 50% 0%, rgba(var(--accent-rgb), 0.10), transparent 70%);
}
.app-card:hover {
  transform: translateY(-6px); border-color: var(--line-2); background: var(--surface-2);
  box-shadow: 0 20px 50px rgba(0, 101, 140, 0.14);
}
.app-card:hover::before { opacity: 1; }
.app-card.wip { border-color: rgba(110, 231, 200, 0.4); }
.app-card.wip h3 { color: var(--mint); }
.app-logo-link { display: inline-block; line-height: 0; cursor: pointer; border-radius: 18px; outline: none; -webkit-tap-highlight-color: transparent; }
.app-logo-link:focus, .app-logo-link:active, .app-logo-link:focus-visible { outline: none; }
.app-logo { width: 80px; height: 80px; margin-bottom: 1.2rem; border-radius: 18px; box-shadow: 0 10px 26px rgba(74, 85, 96, 0.16); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.app-card:hover .app-logo { transform: scale(1.05) rotate(-2deg); }
.app-logo-link:hover .app-logo { box-shadow: 0 14px 32px rgba(var(--accent-rgb), 0.28); }
.app-card h3 { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; font-size: 1.32rem; color: var(--text); margin-bottom: 0.75rem; }
.app-card p { line-height: 1.62; color: var(--text-dim); font-size: 0.96rem; margin-bottom: 1.4rem; }
.app-repo { display: block; margin-top: 0.85rem; color: var(--text-faint); font-family: var(--font-mono); font-size: 0.76rem; text-decoration: none; word-break: break-all; transition: color 0.2s ease; }
.app-repo:hover { color: var(--accent); }

.app-info-btn {
  position: absolute; top: 0.6rem; right: 0.6rem; width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center; padding: 0;
  background: var(--surface-2); color: var(--text-dim); border: 1px solid var(--line-2);
  border-radius: 50%; font-family: var(--font-display); font-style: italic; font-weight: 700;
  font-size: 0.92rem; line-height: 1; cursor: pointer; z-index: 3; transition: all 0.2s ease;
}
.app-info-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

/* ───────────────────────── Solicitar / recomendar app ───────────────────────── */
.app-request {
  max-width: 560px; margin: 0 auto 2.4rem; padding: 1.6rem 1.6rem 1.4rem;
  background: var(--surface); border: 1px solid var(--line); border-radius: 24px;
  box-shadow: 0 10px 30px rgba(74, 85, 96, 0.05); text-align: left;
}
.app-request-label { display: block; font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; color: var(--text); margin-bottom: 0.9rem; }
.app-request-row { position: relative; display: flex; align-items: center; }
.app-request-input {
  flex: 1; width: 100%; padding: 0.85rem 3.4rem 0.85rem 1.3rem;
  font-family: var(--font-body); font-size: 0.95rem; color: var(--text);
  background: var(--ink); border: 1px solid var(--line-2); border-radius: var(--radius-pill);
  outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.app-request-input::placeholder { color: var(--text-faint); }
.app-request-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.app-request-send {
  position: absolute; right: 5px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  padding: 0; background: var(--accent); color: var(--accent-ink); border: none; border-radius: 50%; cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
}
.app-request-send svg { width: 18px; height: 18px; }
.app-request-send:hover:not(:disabled) { background: var(--accent-press); transform: scale(0.94); }
.app-request-send:disabled { opacity: 0.5; cursor: default; }
.app-request-msg { margin: 0.8rem 0 0; font-size: 0.9rem; font-weight: 600; }
.app-request-msg.ok { color: var(--mint); }
.app-request-msg.err { color: #c0392b; }

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
