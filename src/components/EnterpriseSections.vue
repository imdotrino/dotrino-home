<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'
import { enterpriseWhyNow, enterpriseItems } from '../data/content'

/* Vista /enterprise ("¿Qué es Dotrino Enterprise?"): la hermana de
   AboutSections para el ecosistema puesto al servicio de una empresa. Misma
   estética y mismo esqueleto (hero + secciones), con el hue menta que la
   distingue de la línea personal. La copy vive en ../i18n.ts y ../data/content.ts.
   El CTA abre el formulario de contacto (el mismo relay que "solicita una app").*/

const props = defineProps<{ locale: Locale }>()
defineEmits<{ contact: []; about: [] }>()
const t = computed(() => messages[props.locale])
const e = computed(() => messages[props.locale].enterprise)
const shifts = computed(() => enterpriseWhyNow[props.locale])
const items = computed(() => enterpriseItems[props.locale])
</script>

<template>
  <section class="hero ent-hero">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">{{ e.eyebrow }}</p>
      <h1 class="hero-title">Dotrino <span>Enterprise</span></h1>
      <p class="hero-subtitle">{{ e.subtitle }}</p>
      <p class="hero-manifesto">
        <strong>{{ e.manifestoStrong }}</strong>{{ e.manifestoRest }}
      </p>
      <button @click="$emit('contact')" class="cta-button">{{ e.cta }}</button>
    </div>
  </section>

  <section id="por-que-ahora" class="section whynow-section">
    <div class="section-content">
      <h2 class="section-title">{{ e.whyNow.title }}</h2>
      <p class="section-text">{{ e.whyNow.intro }}</p>
      <div class="shift-grid">
        <div class="shift-item" v-for="(s, i) in shifts" :key="i">
          <h3>{{ s.h }}</h3>
          <p>{{ s.p }}</p>
          <p class="shift-response"><span>{{ e.response }}</span>{{ s.response }}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="enterprise" class="section ent-section">
    <div class="section-content">
      <h2 class="section-title">{{ e.sectionTitle }}</h2>
      <p class="section-text">{{ e.sectionText }}</p>
      <div class="ent-features">
        <div class="ent-item" v-for="(item, i) in items" :key="i">
          <h3>{{ item.h }}</h3>
          <p>{{ item.p }}</p>
        </div>
      </div>

      <div class="ent-close">
        <button @click="$emit('contact')" class="cta-button">{{ e.cta }}</button>
        <button @click="$emit('about')" class="ent-link">{{ t.apps.fullHome }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ───────────────────────── Hero (vista /enterprise) ─────────────────────────
   Mismo hero que /que-es (ver AboutSections.vue) con dos diferencias: el
   eyebrow es un elemento real (no ::before) porque su texto es bilingüe, y el
   acento de la vista es la menta. */
.hero {
  position: relative; min-height: 88vh;
  display: flex; align-items: center; justify-content: center;
  padding: 8rem 2rem 4rem; overflow: hidden;
}
.hero-glow {
  position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
  width: min(80rem, 120%); height: 60rem; pointer-events: none; z-index: 0;
  /* Sin filter: blur (crea layer de compositor → artefactos en MIUI). */
  background: radial-gradient(closest-side, rgba(0, 137, 123, 0.14), transparent 78%);
}
.hero-content { position: relative; z-index: 2; text-align: center; max-width: 880px; }
.hero-eyebrow {
  display: inline-block; margin-bottom: 1.6rem;
  font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--mint);
  padding: 0.4rem 0.9rem; border: 1px solid rgba(0, 137, 123, 0.18); border-radius: 50px;
  background: rgba(0, 137, 123, 0.08);
}
.hero-title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(2.6rem, 8vw, 5.4rem); line-height: 0.98; letter-spacing: -0.04em;
  color: var(--text); margin-bottom: 1.4rem;
}
.hero-title span { color: var(--mint); }
.hero-subtitle { font-size: clamp(1.05rem, 2.2vw, 1.4rem); line-height: 1.55; color: var(--text-dim); margin-bottom: 1.6rem; max-width: 720px; margin-inline: auto; }
.hero-manifesto { font-size: 1.02rem; line-height: 1.75; max-width: 620px; margin: 0 auto 2.5rem; color: var(--text-dim); }
.hero-manifesto strong { display: block; color: var(--text); font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; letter-spacing: -0.01em; margin-bottom: 0.5rem; }
.cta-button {
  background: var(--mint); color: #ffffff; border: none;
  padding: 0.95rem 2.2rem; font-family: var(--font-body); font-size: 1.02rem; font-weight: 700;
  border-radius: 10px; cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 30px rgba(0, 137, 123, 0.18);
}
.cta-button:hover { background: #00726a; transform: translateY(-2px); box-shadow: 0 12px 38px rgba(0, 137, 123, 0.28); }

/* ───────────────────────── Por qué ahora ─────────────────────────
   Dos tarjetas: qué cambió (texto normal) + qué hace el ecosistema al
   respecto (línea afirmativa destacada, separada por un filete). */
.whynow-section { background: var(--ink-2); }
.shift-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.2rem; margin-top: 3rem; text-align: left; }
.shift-item {
  background: var(--surface); padding: 1.8rem; border-radius: var(--radius);
  border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(74, 85, 96, 0.05);
}
.shift-item h3 { font-family: var(--font-display); font-weight: 700; color: var(--text); margin-bottom: 0.7rem; font-size: 1.18rem; }
.shift-item > p { line-height: 1.65; color: var(--text-dim); font-size: 0.95rem; }
.shift-response {
  margin-top: 1.1rem; padding-top: 1.1rem; border-top: 1px solid var(--line);
  color: var(--text); font-size: 0.95rem; line-height: 1.6;
}
.shift-response span {
  display: block; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--mint); margin-bottom: 0.35rem;
}

/* ───────────────────────── Qué incluye ───────────────────────── */
/* 6 capacidades en 3×2 (no 4+2 desparejo): el minmax fuerza 3 columnas en el
   ancho máximo de la sección y cae solo a 2 y a 1 al angostarse. */
.ent-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.2rem; margin-top: 3rem; text-align: left; }
.ent-item { background: var(--surface-2); padding: 1.6rem; border-radius: 14px; border: 1px solid var(--line); transition: border-color 0.2s ease, transform 0.2s ease; }
.ent-item:hover { border-color: var(--line-2); transform: translateY(-3px); }
.ent-item h3 { font-family: var(--font-display); font-weight: 700; color: var(--mint); margin-bottom: 0.7rem; font-size: 1.18rem; }
.ent-item p { line-height: 1.6; color: var(--text-dim); font-size: 0.95rem; }

/* Cierre: el CTA de contacto y la puerta a la vista personal (/que-es). */
.ent-close { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; margin-top: 3rem; }
.ent-link {
  background: transparent; color: var(--text-dim); border: 1px solid var(--line-2);
  padding: 0.9rem 1.7rem; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;
  border-radius: 10px; cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.ent-link:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }

/* ───────────────────────── Animación de entrada ───────────────────────── */
@keyframes cc-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
.hero-content > * { animation: cc-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.hero-title { animation-delay: 0.06s; }
.hero-subtitle { animation-delay: 0.12s; }
.hero-manifesto { animation-delay: 0.18s; }
.cta-button { animation-delay: 0.24s; }
@media (prefers-reduced-motion: reduce) {
  .hero-content > * { animation: none; }
}

@media (max-width: 768px) {
  .shift-grid, .ent-features { grid-template-columns: 1fr; }
}
</style>
