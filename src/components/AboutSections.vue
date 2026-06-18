<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'
import { serviceItems, apiItems } from '../data/content'

const props = defineProps<{ locale: Locale }>()
defineEmits<{ navigate: [sectionId: string] }>()
const t = computed(() => messages[props.locale])
const service = computed(() => serviceItems[props.locale])
const api = computed(() => apiItems[props.locale])
</script>

<template>
  <section class="hero">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="hero-content">
      <h1 class="hero-title">Dotrino</h1>
      <p class="hero-subtitle">{{ t.hero.subtitle }}</p>
      <p class="hero-manifesto">
        <strong>{{ t.hero.manifestoStrong }}</strong>{{ t.hero.manifestoRest }}
      </p>
      <button @click="$emit('navigate', 'aplicaciones')" class="cta-button">
        {{ t.hero.cta }}
      </button>
    </div>
  </section>

  <section id="servicio" class="section servicio-section">
    <div class="section-content">
      <h2 class="section-title">{{ t.service.title }}</h2>
      <p class="section-text">{{ t.service.text }}</p>
      <div class="service-features">
        <div class="service-item" v-for="(item, i) in service" :key="i">
          <h3>{{ item.h }}</h3>
          <p v-html="item.p"></p>
        </div>
      </div>
    </div>
  </section>

  <section id="api" class="section api-section">
    <div class="section-content">
      <h2 class="section-title">{{ t.api.title }}</h2>
      <p class="section-text">{{ t.api.text }}</p>
      <div class="api-features">
        <div class="api-item" v-for="(item, i) in api" :key="i">
          <h3>{{ item.h }}</h3>
          <p v-html="item.p"></p>
        </div>
      </div>
    </div>
  </section>

  <section id="comunidad" class="section comunidad-section">
    <div class="section-content">
      <h2 class="section-title">{{ t.community.title }}</h2>
      <p class="section-text">{{ t.community.intro }}</p>
      <div class="community-services">
        <a
          v-for="(s, i) in t.community.services"
          :key="i"
          class="community-service"
          :href="`https://github.com/imdotrino/${s.img.split('/').pop()}`"
          target="_blank"
          rel="noopener"
        >
          <h3>{{ s.name }}</h3>
          <p>{{ s.desc }}</p>
          <code>{{ s.img }}</code>
        </a>
      </div>
      <div class="community-quickstart">
        <code>{{ t.community.cmd }}</code>
        <span>{{ t.community.cmdNote }}</span>
      </div>
      <ol class="community-steps">
        <li v-for="(step, i) in t.community.steps" :key="i">{{ step }}</li>
      </ol>
      <p class="community-note">{{ t.community.note }}</p>
      <a
        class="community-cta"
        href="https://github.com/imdotrino/dotrino#colabora-suma-tu-nodo-autohosteo"
        target="_blank"
        rel="noopener"
      >{{ t.community.cta }}</a>
    </div>
  </section>
</template>

<style scoped>
/* ───────────────────────── Hero (vista /que-es) ───────────────────────── */
.hero {
  position: relative; min-height: 92vh;
  display: flex; align-items: center; justify-content: center;
  padding: 8rem 2rem 4rem; overflow: hidden;
}
.hero-glow {
  position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
  width: min(80rem, 120%); height: 60rem; pointer-events: none; z-index: 0;
  /* Sin filter: blur (crea layer de compositor → artefactos en MIUI). El
     gradiente ya es suave; un stop más lejano mantiene el borde difuminado. */
  background: radial-gradient(closest-side, rgba(var(--accent-rgb), 0.16), transparent 78%);
}
.hero-content { position: relative; z-index: 2; text-align: center; max-width: 880px; }
.hero-content::before {
  content: '// tu información · tu servidor · tus reglas';
  display: inline-block; margin-bottom: 1.6rem;
  font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent);
  padding: 0.4rem 0.9rem; border: 1px solid var(--accent-soft); border-radius: 50px; background: var(--accent-soft);
}
.hero-title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(3rem, 9vw, 6.2rem); line-height: 0.95; letter-spacing: -0.04em;
  color: var(--text); margin-bottom: 1.4rem;
}
.hero-subtitle { font-size: clamp(1.1rem, 2.4vw, 1.5rem); line-height: 1.5; color: var(--text-dim); margin-bottom: 1.6rem; max-width: 680px; margin-inline: auto; }
.hero-manifesto { font-size: 1.02rem; line-height: 1.75; max-width: 600px; margin: 0 auto 2.5rem; color: var(--text-dim); }
.hero-manifesto strong { display: block; color: var(--text); font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; letter-spacing: -0.01em; margin-bottom: 0.5rem; }
.hero-manifesto em { font-style: normal; font-weight: 600; color: var(--accent); }
.cta-button {
  background: var(--accent); color: var(--accent-ink); border: none;
  padding: 0.95rem 2.2rem; font-family: var(--font-body); font-size: 1.02rem; font-weight: 700;
  border-radius: 10px; cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 30px rgba(var(--accent-rgb), 0.18);
}
.cta-button:hover { background: var(--accent-press); transform: translateY(-2px); box-shadow: 0 12px 38px rgba(var(--accent-rgb), 0.28); }

/* ───────────────────────── Servicio / API / Comunidad ───────────────────────── */
.service-features, .api-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; margin-top: 3rem; text-align: left; }
.service-item, .api-item { background: var(--surface-2); padding: 1.6rem; border-radius: 14px; border: 1px solid var(--line); transition: border-color 0.2s ease, transform 0.2s ease; }
.service-item:hover, .api-item:hover { border-color: var(--line-2); transform: translateY(-3px); }
.service-item h3, .api-item h3 { font-family: var(--font-display); font-weight: 700; color: var(--text); margin-bottom: 0.7rem; font-size: 1.18rem; }
.service-item h3 { color: var(--mint); }
.api-item h3 { color: var(--accent); }
.service-item p, .api-item p { line-height: 1.6; color: var(--text-dim); font-size: 0.95rem; }

.community-services { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.2rem; margin: 2.5rem 0; text-align: left; }
.community-service { display: block; text-decoration: none; color: var(--text); background: var(--surface); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--line); transition: transform 0.2s ease, border-color 0.2s ease; }
.community-service:hover { transform: translateY(-4px); border-color: var(--accent); }
.community-service h3 { font-family: var(--font-display); font-weight: 700; color: var(--text); font-size: 1.18rem; margin-bottom: 0.4rem; }
.community-service p { color: var(--text-dim); margin-bottom: 0.9rem; font-size: 0.95rem; }
.community-quickstart { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin: 1.5rem 0; }
.community-quickstart code { background: rgba(0, 0, 0, 0.4); padding: 0.6rem 1.2rem; border-radius: 9px; font-family: var(--font-mono); font-size: 0.95rem; color: var(--accent); border: 1px solid var(--line); }
.community-quickstart span { color: var(--text-dim); font-size: 0.92rem; }
.community-steps { max-width: 640px; margin: 1.5rem auto; text-align: left; line-height: 1.7; padding-left: 1.4rem; color: var(--text-dim); }
.community-steps li { margin-bottom: 0.6rem; }
.community-note { color: var(--text-faint); font-style: italic; margin: 1.5rem auto; max-width: 640px; }
.community-cta { display: inline-block; margin-top: 1rem; background: var(--accent); color: var(--accent-ink); text-decoration: none; padding: 0.75rem 1.9rem; border-radius: 10px; font-family: var(--font-body); font-weight: 700; transition: background 0.2s ease, transform 0.15s ease; }
.community-cta:hover { background: var(--accent-press); transform: translateY(-2px); }

/* ───────────────────────── Animación de entrada ───────────────────────── */
@keyframes cc-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
.hero-content > * { animation: cc-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.hero-content::before { animation: cc-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.hero-title { animation-delay: 0.06s; }
.hero-subtitle { animation-delay: 0.12s; }
.hero-manifesto { animation-delay: 0.18s; }
.cta-button { animation-delay: 0.24s; }
@media (prefers-reduced-motion: reduce) {
  .hero-content > *, .hero-content::before { animation: none; }
}

@media (max-width: 768px) {
  .service-features, .api-features, .community-services { grid-template-columns: 1fr; }
}
</style>
