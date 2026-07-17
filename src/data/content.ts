/* Copys de la sección "Cómo funciona" del home (vista /que-es), por idioma.
   Los consume AboutSections.vue.

   Esta copy es PÚBLICA: va en lenguaje llano (CONVENCIONES §9.1) y se afirma
   en vez de negar (regla de villanos, CLAUDE.md). Se explica qué gana quien
   usa las apps, nunca cómo está hecho por dentro — el detalle técnico vive en
   los READMEs, cuyo público es desarrollador. */

import type { Locale } from '../i18n'

type Feature = { h: string; p: string }

export const serviceItems: Record<Locale, Feature[]> = {
  en: [
    { h: 'Start by opening', p: 'You open the app and that is it: you are using it from the very first moment.' },
    { h: 'From your machine to theirs', p: 'When the connection allows it, what you send travels from one machine to the other by the shortest path.' },
    { h: 'Your message waits', p: 'If the other person is away, your message waits for them for up to a day and arrives the moment they come back.' },
    { h: 'What’s yours comes along', p: 'Your contacts and your messages are the same in every Dotrino app you open in this browser.' },
    { h: 'It carries your signature', p: 'What you send goes out with a signature that is born on your machine, so whoever receives it knows it came from you.' },
    { h: 'Nearby, when you want', p: 'Some apps help you see what is around you. Each time that happens, you decide, and it clears itself within hours.' },
  ],
  es: [
    { h: 'Empiezas al abrir', p: 'Abres la app y ya está: la usas desde el primer momento.' },
    { h: 'De tu equipo al suyo', p: 'Cuando la conexión lo permite, lo que se mandan viaja de un equipo al otro por el camino más corto.' },
    { h: 'Tu mensaje espera', p: 'Si la otra persona está desconectada, tu mensaje la espera hasta un día y le llega en cuanto vuelve.' },
    { h: 'Lo tuyo te acompaña', p: 'Tus contactos y tus mensajes son los mismos en cada app de Dotrino que abras en este navegador.' },
    { h: 'Va con tu firma', p: 'Lo que mandas sale con una firma que nace en tu equipo, así que quien lo recibe sabe que viene de ti.' },
    { h: 'Cerca de ti, cuando tú quieras', p: 'Algunas apps te ayudan a ver lo que tienes cerca. Cada vez que pasa lo decides tú, y se borra en unas horas.' },
  ],
}
