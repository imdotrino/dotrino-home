<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { messages, type Locale } from '../i18n'

/* Formulario de CONTACTO. El envío funciona EXACTAMENTE igual que el input
   "Solicita/Recomienda una app" de AppsCatalog: mismo relay @dotrino/feedback
   (Cloudflare Worker → email), misma identidad opcional del vault (firma el
   contenido) y mismo flujo idle/sending/sent/error. La única diferencia son los
   campos: correo, teléfono y mensaje.

   El correo viaja en `contact` (el worker lo usa como reply-to y lo muestra); el
   teléfono se incluye en el `text` (el worker solo envía por email `text` +
   contacto), así nada se pierde sin tener que tocar el worker. La firma se hace
   sobre el MISMO `text` que se envía ({ op:'app-request', text, ts }), tal como
   lo verifica el worker. */

const props = defineProps<{ locale: Locale }>()
defineEmits<{ close: [] }>()
const t = computed(() => messages[props.locale])

const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL || 'https://feedback.dotrino.com'

const email = ref('')
const phone = ref('')
const message = ref('')
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

// Provistos por App.vue (igual que AppsCatalog): exigir apodo + leer identidad.
const ensureNick = inject<((run: () => void) => void) | null>('ensureNick', null)
type MyId = { pubkey: string; nickname: string; signData?: (d: unknown) => Promise<unknown> }
const getMyIdentity = inject<(() => Promise<MyId>) | null>('getMyIdentity', null)

const emailOk = computed(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()))
const canSend = computed(() =>
  emailOk.value && phone.value.trim() && message.value.trim() &&
  state.value !== 'sending' && state.value !== 'sent',
)

// Texto final enviado/firmado: mensaje + teléfono (el correo va en `contact`).
function buildText(): string {
  const msg = message.value.trim()
  const tel = phone.value.trim()
  return tel ? `${msg}\n\n${props.locale === 'en' ? 'Phone' : 'Teléfono'}: ${tel}` : msg
}

async function doSend() {
  const text = buildText()
  if (!text) return
  state.value = 'sending'
  let pubkey = '', nickname = '', signature = ''
  const ts = Date.now()
  try {
    if (getMyIdentity) {
      const me = await getMyIdentity()
      pubkey = me.pubkey; nickname = me.nickname
      if (me.signData && pubkey) {
        try {
          const sig = (await me.signData({ op: 'app-request', text, ts })) as string | { signature?: string }
          signature = (typeof sig === 'string' ? sig : sig?.signature) || ''
        } catch { /* firma opcional */ }
      }
    }
  } catch { /* sin identidad: envío anónimo */ }
  try {
    const res = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text, app: 'contact', locale: props.locale,
        contact: email.value.trim(), pubkey, nickname, ts, signature,
      }),
    })
    if (!res.ok) throw new Error('bad')
    state.value = 'sent'
  } catch {
    state.value = 'error'
  }
}

function submit() {
  if (!canSend.value) return
  if (ensureNick) ensureNick(() => { doSend() })
  else doSend()
}
</script>

<template>
  <div class="contact-overlay" @click.self="$emit('close')">
    <div class="contact-modal" role="dialog" aria-modal="true">
      <button type="button" class="contact-x" :aria-label="t.apps.close" @click="$emit('close')">×</button>
      <h3 class="contact-title">{{ t.contact.title }}</h3>
      <p class="contact-intro">{{ t.contact.intro }}</p>

      <form class="contact-form" @submit.prevent="submit">
        <label class="contact-label" for="contact-email">{{ t.contact.email }}</label>
        <input
          id="contact-email" v-model="email" type="email" inputmode="email" autocomplete="email"
          class="contact-input" :placeholder="t.contact.emailPh" maxlength="120"
          :disabled="state === 'sending' || state === 'sent'"
        />

        <label class="contact-label" for="contact-phone">{{ t.contact.phone }}</label>
        <input
          id="contact-phone" v-model="phone" type="tel" inputmode="tel" autocomplete="tel"
          class="contact-input" :placeholder="t.contact.phonePh" maxlength="40"
          :disabled="state === 'sending' || state === 'sent'"
        />

        <label class="contact-label" for="contact-message">{{ t.contact.message }}</label>
        <textarea
          id="contact-message" v-model="message"
          class="contact-input contact-textarea" :placeholder="t.contact.messagePh" maxlength="2000" rows="4"
          :disabled="state === 'sending' || state === 'sent'"
        ></textarea>

        <button type="submit" class="contact-send" :disabled="!canSend">{{ t.contact.send }}</button>

        <p v-if="state === 'sent'" class="contact-msg ok">{{ t.contact.thanks }}</p>
        <p v-else-if="state === 'error'" class="contact-msg err">{{ t.contact.error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact-overlay { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: rgba(24, 28, 30, 0.42); }
.contact-modal { position: relative; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; background: var(--surface); border: 1px solid var(--line-2); border-radius: 18px; padding: 2.2rem 1.8rem 1.8rem; box-shadow: 0 30px 80px rgba(0, 101, 140, 0.18); }
.contact-x { position: absolute; top: 0.7rem; right: 0.7rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-dim); border: none; border-radius: 50%; font-size: 1.5rem; line-height: 1; cursor: pointer; transition: all 0.2s ease; }
.contact-x:hover { background: var(--surface-2); color: var(--text); }
.contact-title { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; font-size: 1.5rem; color: var(--text); margin-bottom: 0.5rem; }
.contact-intro { line-height: 1.6; color: var(--text-dim); font-size: 0.96rem; margin-bottom: 1.5rem; }

.contact-form { display: flex; flex-direction: column; text-align: left; }
.contact-label { font-family: var(--font-display); font-weight: 700; font-size: 0.92rem; color: var(--text); margin-bottom: 0.4rem; }
.contact-input {
  width: 100%; padding: 0.8rem 1.1rem; margin-bottom: 1rem;
  font-family: var(--font-body); font-size: 0.95rem; color: var(--text);
  background: var(--ink); border: 1px solid var(--line-2); border-radius: 12px;
  outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.contact-input::placeholder { color: var(--text-faint); }
.contact-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.contact-textarea { resize: vertical; min-height: 96px; }
.contact-send {
  margin-top: 0.3rem; align-self: flex-start; background: var(--accent); color: var(--accent-ink); border: none;
  padding: 0.75rem 1.9rem; font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
  border-radius: var(--radius-pill); cursor: pointer; transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}
.contact-send:hover:not(:disabled) { background: var(--accent-press); transform: translateY(-2px); }
.contact-send:disabled { opacity: 0.5; cursor: default; }
.contact-msg { margin: 0.9rem 0 0; font-size: 0.9rem; font-weight: 600; }
.contact-msg.ok { color: var(--mint); }
.contact-msg.err { color: #c0392b; }
</style>
