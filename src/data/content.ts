/* Copys de la sección "Cómo funciona" del home (vista /que-es) y de la vista
   /enterprise, por idioma. Los consumen AboutSections.vue y
   EnterpriseSections.vue.

   Esta copy es PÚBLICA: va en lenguaje llano (CONVENCIONES §9.1) y se afirma
   en vez de negar (regla de villanos, CLAUDE.md). Se explica qué gana quien
   usa las apps, nunca cómo está hecho por dentro — el detalle técnico vive en
   los READMEs, cuyo público es desarrollador. */

import type { Locale } from '../i18n'

type Feature = { h: string; p: string }
/* Bloque "Por qué ahora" de /enterprise: qué cambió en el entorno (`p`) y qué
   hace Dotrino Enterprise al respecto (`response`, la línea afirmativa). */
type Shift = { h: string; p: string; response: string }

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

/* Página del wiki que amplía cada punto de "Cómo funciona" (mismo índice que
   serviceItems, en los dos idiomas). El home no documenta: enlaza — la etiqueta
   del enlace es el título real de la página (ver ../wiki.ts, CONVENCIONES §9.2). */
export const serviceWiki: string[] = [
  'empezar/instalar-apps',
  'empezar/como-viaja',
  'empezar/como-viaja',
  'empezar/identidad',
  'empezar/identidad',
  'empezar/privacidad',
]

/* ── Vista /enterprise ─────────────────────────────────────────────────────
   "Por qué ahora": el cambio del entorno que motiva Dotrino Enterprise. Se
   describe el FENÓMENO y su velocidad, nunca a un actor (regla de villanos,
   CLAUDE.md): cada punto cierra con lo que el ecosistema hace al respecto. */
export const enterpriseWhyNow: Record<Locale, Shift[]> = {
  es: [
    {
      h: 'La velocidad cambió',
      p: 'Aprovechar un descuido técnico toma hoy horas, no semanas. Una clave que lleva años sin cambiar, o copiada en un archivo de cada servidor, dejó de ser un detalle menor.',
      response: 'Las claves viven en un solo sitio y cambiarlas es cuestión de minutos, no un operativo.',
    },
    {
      h: 'La voz y la cara se imitan',
      p: 'Imitar la voz, la cara y la forma de escribir de una persona está al alcance de cualquiera. «Me lo pidió el gerente por chat» ya no prueba nada por sí solo.',
      response: 'Cada petición viaja firmada por el equipo desde el que se hace y la firma se comprueba sola: un mensaje convincente no concede ningún permiso.',
    },
  ],
  en: [
    {
      h: 'The speed changed',
      p: 'Taking advantage of a technical oversight now takes hours, not weeks. A key that has gone years without changing, or copied into a file on every server, stopped being a minor detail.',
      response: 'Keys live in a single place, and changing one is a matter of minutes rather than an operation.',
    },
    {
      h: 'Voices and faces are imitated',
      p: 'Imitating someone’s voice, face and writing style is within anyone’s reach. “The manager asked me over chat” no longer proves anything on its own.',
      response: 'Every request travels signed by the machine it was made from, and the signature checks itself: a convincing message grants no permission.',
    },
  ],
}

/* "Qué incluye": las piezas del ecosistema puestas a trabajar para una empresa.
   Cada punto corresponde a algo IMPLEMENTADO y auditado (bóveda + certificados
   con alcance y caducidad de 30 días + reparto de claves a los servicios sin
   .env + revocación inmediata + bitácora + MIT).

   OJO, límites verificados que esta copy respeta a propósito:
   · Las claves NO se guardan cifradas en disco (solo la llave maestra lo está,
     atada a su equipo): lo que se afirma es que dejan de estar copiadas en cada
     servidor, que viajan cifradas y que en el servicio solo viven en memoria.
   · NO hay permisos por persona, ni roles, ni panel de organización: el aislamiento
     real es POR SERVICIO (cada uno abre solo su cajón). No lo generalices a
     "cada empleado ve solo lo suyo": sería falso.
   · Nada de cumplimiento normativo, certificaciones, auditorías de terceros,
     SSO ni soporte 24/7: no existen. */
export const enterpriseItems: Record<Locale, Feature[]> = {
  es: [
    { h: 'Las claves, en un solo sitio', p: 'Las contraseñas y los accesos de tus servidores dejan de estar copiados en un archivo de configuración en cada máquina. Viajan cifrados hasta el servicio que los pide y ahí solo existen en memoria, nunca escritos en disco.' },
    { h: 'Cambiar una clave, en minutos', p: 'Escribes el valor nuevo en un solo lugar y los servicios que la usaban vuelven solos con la nueva. Sin editar servidor por servidor, sin volver a desplegar y sin repartirla por chat. Y si quedó una copia vieja dando vueltas, el sistema la señala.' },
    { h: 'En los servidores de tu empresa', p: 'Todo se instala en tus propias máquinas (on premise) y la información se queda en tu red. El equipo que custodia las claves no necesita quedar abierto a internet: es él quien llama hacia afuera, no al revés.' },
    { h: 'Cada servicio, solo su cajón', p: 'Cada aplicación recibe únicamente las claves de su propio cajón, y no abre el de otra aunque compartan máquina. En un mismo equipo caben cuentas separadas que no se cruzan.' },
    { h: 'Quien entra y quien sale', p: 'Autorizar un equipo nuevo toma un minuto y exige que una persona teclee un código en ese mismo equipo: un código reenviado por correo no alcanza. Retirarle el permiso corta su acceso en el acto, y el permiso caduca por sí solo a los 30 días si nadie lo renueva.' },
    { h: 'El código está a la vista', p: 'Todo es código abierto con licencia MIT: tu gente puede leerlo, compilarlo y correr las pruebas. Cada firma, cada permiso y cada intento rechazado quedan anotados con su fecha en tu propia máquina.' },
    { h: 'Lo que le preguntas a la IA', p: 'Cada pregunta que tu gente le hace a una inteligencia artificial pasa antes por una máquina tuya, que tacha lo que tus reglas marcan como sensible, pregunta cuando hay dudas y anota qué salió y cuándo. La clave del servicio queda en un solo lugar, no repartida por los computadores del equipo.' },
  ],
  en: [
    { h: 'Keys in a single place', p: 'Your servers’ passwords and credentials stop being copied into a config file on every machine. They travel encrypted to the service that asks for them and live only in memory there, never written to disk.' },
    { h: 'Change a key in minutes', p: 'You write the new value in one place and the services that used it come back with the new one on their own. No editing server by server, no redeploy, no passing it around over chat. And if an old copy is still lying around, the system points it out.' },
    { h: 'On your company’s servers', p: 'Everything installs on your own machines (on premise) and the information stays inside your network. The machine holding the keys does not need to be open to the internet: it is the one that calls out, not the other way round.' },
    { h: 'Each service, only its drawer', p: 'Each application receives only the keys in its own drawer, and cannot open another’s even when they share a machine. A single machine can hold separate accounts that never mix.' },
    { h: 'Who comes in and who leaves', p: 'Authorising a new machine takes a minute and requires a person to type a code on that very machine: a code forwarded by email is not enough. Withdrawing its permission cuts access on the spot, and the permission expires on its own after 30 days if nobody renews it.' },
    { h: 'The code is in plain sight', p: 'Everything is open source under the MIT licence: your people can read it, build it and run the tests. Every signature, every permission and every rejected attempt is recorded with its date on your own machine.' },
    { h: 'What you ask the AI', p: 'Every question your people ask an artificial intelligence goes first through a machine of yours, which blanks out whatever your rules mark as sensitive, asks when in doubt, and records what left and when. The key to the service stays in one place, not spread across the team’s computers.' },
  ],
}

/* Páginas del wiki para /enterprise: una por bloque de "Por qué ahora" y una por
   punto de "Qué incluye" (mismo índice). Cadena vacía = ese punto todavía no
   tiene página en el wiki, y entonces no se pinta enlace. */
export const enterpriseWhyNowWiki: string[] = [
  'empresa/que-es',
  'vault/aprobacion',
]

export const enterpriseWiki: string[] = [
  'vault/secretos',
  'vault/secretos',
  'vault/instalacion',
  'vault/seguridad',
  'vault/emparejar',
  'desarrollo/contribuir',
  '',
]
