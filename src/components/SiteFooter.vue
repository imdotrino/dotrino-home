<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'

const props = defineProps<{ locale: Locale }>()
defineEmits<{ contact: [] }>()
const t = computed(() => messages[props.locale])
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
      <p class="footer-contact">
        <a href="#contacto" class="footer-contact-link" @click.prevent="$emit('contact')">{{ t.contact.link }}</a>
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
.footer-contact { margin-bottom: 1rem; }
.footer-contact-link {
  display: inline-block; padding: 0.5rem 1.5rem; font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
  color: var(--accent); background: var(--accent-soft); border: 1px solid transparent; border-radius: var(--radius-pill);
  text-decoration: none; cursor: pointer; transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.footer-contact-link:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); transform: translateY(-2px); }
.footer-copy { font-size: 0.86rem; color: var(--text-faint); font-family: var(--font-mono); }

@media (max-width: 768px) {
  .footer-pillars { grid-template-columns: 1fr; }
}
</style>
