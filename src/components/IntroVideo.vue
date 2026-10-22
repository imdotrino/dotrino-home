<script setup lang="ts">
import { computed } from 'vue'
import { messages, type Locale } from '../i18n'

/* El video de "qué es Dotrino", servido desde el propio dominio: nada de
   reproductor de YouTube embebido (cargaría JS de terceros y su rastreo).
   Arranca PAUSADO y no descarga nada hasta que se pulsa play (preload="none");
   la portada solo dice "¿Qué es Dotrino?", en el idioma activo. */
const props = defineProps<{ locale: Locale }>()
const t = computed(() => messages[props.locale].intro)

const VIDEOS: Record<Locale, string> = {
  es: '/video/dotrino-es.mp4',
  en: '/video/dotrino-en.mp4',
}
const video = computed(() => VIDEOS[props.locale])
const poster = computed(() => `/video/poster-${props.locale}.jpg`)
</script>

<template>
  <section class="intro-video" :aria-label="t.label">
    <!-- :key fuerza a recargar la fuente al cambiar de idioma -->
    <video
      :key="video"
      class="player"
      controls
      preload="none"
      playsinline
      :poster="poster"
      :src="video"
      data-testid="intro-video"
    ></video>
  </section>
</template>

<style scoped>
/* En escritorio, pequeño: acompaña al catálogo sin taparlo. En móvil, todo el ancho. */
.intro-video {
  max-width: 560px;
  margin: 40px auto 0;
  padding: 0 16px;
}
.player {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  background: #fff;
  box-shadow: 0 18px 40px rgba(var(--accent-rgb), 0.12);
  display: block;
}
@media (max-width: 640px) {
  /* en móvil el topbar va en dos filas (~113 px) y el espaciador solo cubre 64 */
  .intro-video { max-width: none; margin-top: 76px; }
}
</style>
