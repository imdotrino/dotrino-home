import { createApp } from 'vue'
import '@dotrino/theme/theme.css'
import './style.css'
import '@dotrino/support'
import '@dotrino/install'
import { createBackNav } from '@dotrino/nav'
import App from './App.vue'

// Navegación "volver" unificada del ecosistema (cierra modal de info / menú; el
// hub es dotrino.com, así que sin nada abierto el volver va a la página previa).
createBackNav()

createApp(App).mount('#app')
