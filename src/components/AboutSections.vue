<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'
import { serviceItems } from '../data/content'

const props = defineProps<{ locale: Locale }>()
defineEmits<{ navigate: [sectionId: string] }>()
const t = computed(() => messages[props.locale])
const service = computed(() => serviceItems[props.locale])
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

/* ───────────────────────── Cómo funciona ───────────────────────── */
.service-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; margin-top: 3rem; text-align: left; }
.service-item { background: var(--surface-2); padding: 1.6rem; border-radius: 14px; border: 1px solid var(--line); transition: border-color 0.2s ease, transform 0.2s ease; }
.service-item:hover { border-color: var(--line-2); transform: translateY(-3px); }
.service-item h3 { font-family: var(--font-display); font-weight: 700; color: var(--mint); margin-bottom: 0.7rem; font-size: 1.18rem; }
.service-item p { line-height: 1.6; color: var(--text-dim); font-size: 0.95rem; }

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
  .service-features { grid-template-columns: 1fr; }
}
</style>
