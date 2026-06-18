<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'
import type { AppEntry } from '../data/apps'

const props = defineProps<{ app: AppEntry; locale: Locale }>()
defineEmits<{ close: [] }>()
const t = computed(() => messages[props.locale])
</script>

<template>
  <div class="info-modal-overlay" @click.self="$emit('close')">
    <div class="info-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        class="info-modal-x"
        :aria-label="t.apps.close"
        @click="$emit('close')"
      >×</button>
      <img class="info-modal-logo" :src="app.logo" :alt="app.name" width="72" height="72" />
      <h3 class="info-modal-title">{{ app.name }}</h3>
      <p class="info-modal-desc" v-html="app.desc[locale]"></p>
      <div class="info-modal-actions">
        <a
          :href="app.url"
          :target="app.apk ? '_blank' : '_self'"
          rel="noopener"
          class="app-button"
        >{{ app.apk ? t.apps.download : t.apps.open }}</a>
        <button type="button" class="info-modal-close" @click="$emit('close')">{{ t.apps.close }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-modal-overlay { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: rgba(5, 7, 10, 0.88); }
.info-modal { position: relative; width: 100%; max-width: 440px; max-height: 85vh; overflow-y: auto; background: var(--ink-2); border: 1px solid var(--line-2); border-radius: 18px; padding: 2.2rem 1.8rem 1.8rem; text-align: center; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); }
.info-modal-x { position: absolute; top: 0.7rem; right: 0.7rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-dim); border: none; border-radius: 50%; font-size: 1.5rem; line-height: 1; cursor: pointer; transition: all 0.2s ease; }
.info-modal-x:hover { background: var(--surface-2); color: var(--text); }
.info-modal-logo { width: 72px; height: 72px; border-radius: 18px; box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4); margin-bottom: 1rem; }
.info-modal-title { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; font-size: 1.5rem; color: var(--text); margin-bottom: 1rem; }
.info-modal-desc { line-height: 1.65; margin-bottom: 1.75rem; color: var(--text-dim); text-align: left; }
.info-modal-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
.info-modal-close { background: transparent; color: var(--text); border: 1px solid var(--line-2); padding: 0.65rem 1.6rem; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; border-radius: 9px; cursor: pointer; transition: all 0.2s ease; }
.info-modal-close:hover { background: var(--surface-2); border-color: var(--line-2); }

.app-button {
  margin-top: auto; background: var(--accent); color: var(--accent-ink); border: none;
  padding: 0.65rem 1.7rem; font-family: var(--font-body); font-size: 0.92rem; font-weight: 700;
  border-radius: 9px; cursor: pointer; text-decoration: none; display: inline-block;
  transition: background 0.2s ease, transform 0.15s ease;
}
.app-button:hover { background: var(--accent-press); transform: translateY(-2px); }
.info-modal-actions .app-button { margin-top: 0; }
</style>
