<script setup lang="ts">
/* Tras enviar una solicitud: dónde va a contestar Dotrino (el messenger) y, ahí mismo, si
   quiere que se le avise cuando conteste. El aviso necesita el permiso del navegador, y el
   navegador solo lo pregunta con un toque: por eso es un botón y no algo automático. Si ya
   lo había dado antes, no se pregunta nada y queda apuntado solo. */
import { computed, inject, onMounted, ref } from 'vue'
import { messages, type Locale } from '../i18n'
import type { MyId } from '../lib/signedRequest'
import { enableReplyNotice, replyNoticeState } from '../lib/replyNotice'

const props = defineProps<{ locale: Locale }>()
const t = computed(() => messages[props.locale].reply)
const getMyIdentity = inject<(() => Promise<MyId>) | null>('getMyIdentity', null)

type State = 'ask' | 'working' | 'on' | 'denied' | 'unsupported' | 'failed' | 'dismissed'
const state = ref<State>(replyNoticeState())

const enable = async () => {
  if (!getMyIdentity) { state.value = 'failed'; return }
  state.value = 'working'
  try {
    await enableReplyNotice(getMyIdentity)
    state.value = 'on'
  } catch (e: any) {
    console.error('[reply-notice]', e?.code || '', e?.message || e)
    state.value = e?.code === 'denied' ? 'denied' : 'failed'
  }
}

// Permiso ya dado (otra solicitud, otra visita): no hay nada que preguntar.
onMounted(() => {
  if (state.value === 'ask' && Notification.permission === 'granted') enable()
})
</script>

<template>
  <div class="reply" data-testid="reply-notice">
    <p class="reply-where">{{ t.where }}</p>
    <template v-if="state === 'ask' || state === 'failed'">
      <p class="reply-text">{{ t.ask }}</p>
      <p v-if="state === 'failed'" class="reply-text err">{{ t.failed }}</p>
      <div class="reply-actions">
        <button type="button" class="reply-btn" data-testid="reply-notice-yes" @click="enable">{{ t.yes }}</button>
        <button type="button" class="reply-btn ghost" data-testid="reply-notice-no" @click="state = 'dismissed'">{{ t.no }}</button>
      </div>
    </template>
    <p v-else-if="state === 'working'" class="reply-text">{{ t.working }}</p>
    <p v-else-if="state === 'on'" class="reply-text ok" data-testid="reply-notice-on">{{ t.on }}</p>
    <p v-else-if="state === 'denied'" class="reply-text">{{ t.denied }}</p>
    <p v-else-if="state === 'unsupported'" class="reply-text">{{ t.unsupported }}</p>
    <a class="reply-open" href="https://messenger.dotrino.com/" target="_blank" rel="noopener">{{ t.open }} →</a>
  </div>
</template>

<style scoped>
.reply { text-align: left; margin-top: 1rem; }
.reply-where { font-weight: 700; color: var(--text); margin: 0 0 0.4rem; }
.reply-text { color: var(--text-dim); font-size: 0.93rem; line-height: 1.55; margin: 0 0 0.8rem; }
.reply-text.ok { color: var(--mint); font-weight: 600; }
.reply-text.err { color: #c0392b; }
.reply-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
.reply-btn {
  background: var(--accent); color: var(--accent-ink); border: none; border-radius: var(--radius-pill);
  padding: 0.65rem 1.4rem; font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; cursor: pointer;
}
.reply-btn:hover { background: var(--accent-press); }
.reply-btn.ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--line-2); }
.reply-btn.ghost:hover { background: var(--surface-2); color: var(--text); }
.reply-open { color: var(--accent); font-weight: 700; font-size: 0.92rem; text-decoration: none; }
.reply-open:hover { text-decoration: underline; }
</style>
