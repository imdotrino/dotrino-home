<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'
import { wikiUrl, wikiTitles } from '../wiki'

const props = defineProps<{ locale: Locale }>()
const t = computed(() => messages[props.locale])
const titles = computed(() => wikiTitles[props.locale])
const wiki = (slug: string) => wikiUrl(slug, props.locale)
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <h3 class="footer-philosophy-title">{{ t.footer.title }}</h3>
      <div class="footer-pillars">
        <div class="footer-pillar">
          <h4>{{ t.footer.what.h }}</h4>
          <p>{{ t.footer.what.p }}</p>
        </div>
        <div class="footer-pillar">
          <h4>{{ t.footer.how.h }}</h4>
          <p>{{ t.footer.how.p }}</p>
        </div>
        <div class="footer-pillar">
          <h4>{{ t.footer.when.h }}</h4>
          <p>{{ t.footer.when.p }}</p>
        </div>
      </div>
      <p class="footer-tagline">{{ t.footer.tagline }}</p>
      <!-- El home no documenta: enlaza a las páginas del wiki, con su título real (§9.2). -->
      <p class="footer-wiki">
        <a :href="wiki('empezar/privacidad')" rel="noopener">{{ titles['empezar/privacidad'] }} →</a>
        <a :href="wiki('empezar/apoyar')" rel="noopener">{{ titles['empezar/apoyar'] }} →</a>
        <a :href="wiki('desarrollo/contribuir')" rel="noopener">{{ titles['desarrollo/contribuir'] }} →</a>
      </p>
      <p class="footer-copy">{{ t.footer.copy }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { text-align: center; padding: 4rem 2rem 2.5rem; border-top: 1px solid var(--line); }
.footer-content { max-width: 1000px; margin: 0 auto; }
.footer-philosophy-title { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; font-size: 1.6rem; color: var(--text); margin-bottom: 2rem; }
.footer-pillars { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.2rem; margin-bottom: 2rem; text-align: left; }
.footer-pillar { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 1.5rem; }
.footer-pillar h4 { font-family: var(--font-display); font-weight: 700; color: var(--accent); font-size: 1.08rem; margin-bottom: 0.6rem; }
.footer-pillar p { line-height: 1.6; color: var(--text-dim); font-size: 0.94rem; }
.footer-tagline { font-size: 1.02rem; line-height: 1.7; max-width: 640px; margin: 0 auto 2rem; color: var(--text-dim); }
.footer-wiki { display: flex; gap: 1.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.6rem; font-size: 0.88rem; }
.footer-wiki a { color: var(--accent); text-decoration: none; font-weight: 600; }
.footer-wiki a:hover { text-decoration: underline; }
.footer-copy { font-size: 0.86rem; color: var(--text-faint); font-family: var(--font-mono); }

@media (max-width: 768px) {
  .footer-pillars { grid-template-columns: 1fr; }
}
</style>
