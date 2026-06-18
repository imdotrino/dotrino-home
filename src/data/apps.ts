/* Catálogo de aplicaciones del ecosistema mostrado en el home. Extraído de
   App.vue. Cada entrada se registra también en el tab "Recientes" cuando el
   usuario la abre (ver ../recents.ts). */

import chatLogo from '../assets/apps/chat.svg'
import messengerLogo from '../assets/apps/messenger.svg'
import qrshareLogo from '../assets/apps/qrshare.svg'
import chessLogo from '../assets/apps/chess.svg'
import cuarentaLogo from '../assets/apps/cuarenta.svg'
import ecuavoleyLogo from '../assets/apps/ecuavoley.svg'
import padelLogo from '../assets/apps/padel.svg'
import gridgameLogo from '../assets/apps/gridgame.svg'
import gymbroLogo from '../assets/apps/gymbro.svg'
import diamondsLogo from '../assets/apps/diamonds.svg'
import crittersLogo from '../assets/apps/critters.svg'
import hereLogo from '../assets/apps/here.svg'
import faviconLogo from '../assets/apps/favicon.svg'
import androidLauncherLogo from '../assets/apps/android-launcher.svg'
import triviaLogo from '../assets/apps/trivia.svg'
import truequeLogo from '../assets/apps/trueque.svg'
import ecoLogo from '../assets/apps/eco.svg'
import sudokuLogo from '../assets/apps/sudoku.svg'

// Subcategorías del tab "Juegos": solo / multijugador / configurables.
export type SubKey = 'solo' | 'multi' | 'config'

export type AppEntry = {
  name: string
  repo: string
  url: string
  logo: string
  cat: 'social' | 'apps' | 'deportes' | 'juegos' | 'android'
  sub?: SubKey
  desc: { es: string; en: string }
  wip?: boolean
  apk?: string
}

export const apps: AppEntry[] = [
  {
    name: 'here',
    url: 'https://here.dotrino.com/',
    logo: hereLogo,
    repo: 'imdotrino/dotrino-here',
    cat: 'social',
    desc: {
      es: 'Comparte tu ubicación en vivo con tus círculos de familia y amigos, privada y efímera. Configura OwnTracks (que hace el seguimiento en segundo plano) contra el pilar geo: cada círculo va cifrado de punta a punta, autorizado por capacidades firmadas desde tu identidad (revocables, con vencimiento) y sin historial. El servidor solo ve datos cifrados; nada de broadcast ni descubrimiento por cercanía.',
      en: 'Share your live location with your family and friends circles, private and ephemeral. Configure OwnTracks (which does the background tracking) against the geo pillar: each circle is end-to-end encrypted, authorized by signed capabilities from your identity (revocable, expiring) and with no history. The server only sees encrypted data; no broadcast, no proximity discovery.',
    },
  },
  {
    name: 'Dotrino Chat',
    url: 'https://chat.dotrino.com/',
    logo: chatLogo,
    repo: 'imdotrino/dotrino-chat',
    cat: 'social',
    desc: {
      es: 'Chat en tiempo real con salas públicas y mensajes directos.',
      en: 'Real-time chat with public rooms and direct messages.',
    },
  },
  {
    name: 'Dotrino Messenger',
    url: 'https://messenger.dotrino.com/',
    logo: messengerLogo,
    repo: 'imdotrino/dotrino-messenger',
    cat: 'social',
    desc: {
      es: 'Mensajería privada 1-a-1 con cifrado de extremo a extremo; recibe mensajes aunque estés desconectado. PWA instalable y extensión de Chrome.',
      en: 'Private one-to-one messaging with end-to-end encryption; receive messages even while you are offline. Installable PWA and Chrome extension.',
    },
  },
  {
    name: 'Trueque',
    url: 'https://trueque.dotrino.com/',
    logo: truequeLogo,
    repo: 'imdotrino/dotrino-trueque',
    cat: 'social',
    desc: {
      es: 'Anuncios georreferenciados <strong>efímeros</strong> (vendo / regalo / busco) cerca de ti: descubre por radio con un <strong>radar de proximidad</strong> y cierra el trato por mensaje. Caducan en 24 h y tu ubicación no se guarda.',
      en: 'Georeferenced <strong>ephemeral</strong> listings (sell / give away / looking for) near you: discover by radius with a <strong>proximity radar</strong> and close the deal by message. They expire in 24 h and your location is never stored.',
    },
  },
  {
    name: 'Eco',
    url: 'https://eco.dotrino.com/',
    logo: ecoLogo,
    repo: 'imdotrino/dotrino-eco',
    cat: 'social',
    desc: {
      es: 'Microblogging <strong>efímero y georreferenciado</strong>: publicas un eco (texto, enlaces y tags) y quien lo tenga en su <strong>radio de escucha</strong> lo descubre. A las <strong>24 h muere en la red</strong>. Tu voz, en tu zona, bajo tus reglas.',
      en: 'Ephemeral, <strong>georeferenced microblogging</strong>: post an eco (text, links and tags) and whoever has it in their <strong>listening radius</strong> discovers it. After <strong>24 h it dies on the network</strong>. Your voice, in your radius, under your rules.',
    },
  },
  {
    name: 'QRShare',
    url: 'https://qrshare.dotrino.com/',
    logo: qrshareLogo,
    repo: 'imdotrino/dotrino-qrshare',
    cat: 'apps',
    desc: {
      es: 'Transferencia de archivos directa entre dispositivos, sin pasar por un servidor. Comparte por QR.',
      en: 'Direct device-to-device file transfer, without going through a server. Share by QR.',
    },
  },
  {
    name: 'Dotrino Chess',
    url: 'https://chess.dotrino.com/',
    logo: chessLogo,
    repo: 'imdotrino/dotrino-chess',
    cat: 'juegos',
    sub: 'multi',
    desc: {
      es: 'Ajedrez online multijugador. Crea partidas públicas o privadas y juega con un lobby en tiempo real.',
      en: 'Online multiplayer chess. Create public or private games and play with a real-time lobby.',
    },
  },
  {
    name: 'Cuarenta (40)',
    url: 'https://cuarenta.dotrino.com/',
    logo: cuarentaLogo,
    repo: 'imdotrino/dotrino-cuarenta',
    cat: 'juegos',
    sub: 'multi',
    desc: {
      es: 'El <strong>Cuarenta</strong>, el juego de naipes tradicional del Ecuador, en línea para <strong>2 ó 4 jugadores</strong>.',
      en: 'The <strong>Cuarenta</strong> (40), Ecuador\'s traditional card game, online for <strong>2 or 4 players</strong>.',
    },
  },
  {
    name: 'Contador Ecuavóley',
    url: 'https://ecuavoley.dotrino.com/',
    logo: ecuavoleyLogo,
    repo: 'imdotrino/dotrino-ecuavoley-contador',
    cat: 'deportes',
    desc: {
      es: 'Marcador para partidos de ecuavóley: dos paneles táctiles, indicador de saque, deshacer, cambio y reinicio. Gana el primero en llegar a 15.',
      en: 'Scoreboard for ecuavóley matches: two touch panels, serve indicator, undo, switch and reset. First to reach 15 wins.',
    },
  },
  {
    name: 'Contador Pádel',
    url: 'https://padel.dotrino.com/',
    logo: padelLogo,
    repo: 'imdotrino/dotrino-padel-contador',
    cat: 'deportes',
    desc: {
      es: 'Marcador para partidos de pádel con puntuación de tenis (0/15/30/40, juegos y sets): dos paneles táctiles, indicador de saque, tie-break, punto de oro opcional, deshacer y reinicio.',
      en: 'Scoreboard for padel matches with tennis scoring (0/15/30/40, games and sets): two touch panels, serve indicator, tie-break, optional golden point, undo and reset.',
    },
  },
  {
    name: 'GymBro Timer',
    url: 'https://gymbro.dotrino.com/',
    logo: gymbroLogo,
    repo: 'imdotrino/dotrino-gymbro',
    cat: 'deportes',
    desc: {
      es: 'Timer por intervalos para el gimnasio: define tu tiempo de entrenamiento y de descanso, una cuenta atrás de preparación y el número de rondas. Avisos sonoros, vibración, notificaciones en segundo plano y pantalla siempre encendida. Funciona sin conexión.',
      en: 'Interval timer for the gym: set your work and rest times, a prep countdown and the number of rounds. Sound cues, vibration, background notifications and always-on screen. Works offline.',
    },
  },
  {
    name: 'Diamonds',
    url: 'https://diamonds.dotrino.com/',
    logo: diamondsLogo,
    repo: 'imdotrino/dotrino-diamonds',
    cat: 'juegos',
    sub: 'solo',
    desc: {
      es: 'Juego casual de combinar diamantes (match-3): intercambia gemas adyacentes para alinear 3 o más del mismo color, encadena combos en cascada con multiplicador y supera tu récord. Avisos sonoros, vibración y funcionamiento sin conexión. PWA instalable; la partida y el récord viven solo en tu navegador.',
      en: 'Casual match-3 game: swap adjacent gems to line up 3 or more of the same color, chain cascading combos with a multiplier and beat your high score. Sound cues, vibration and offline support. Installable PWA; your game and high score live only in your browser.',
    },
  },
  {
    name: 'Sudoku',
    url: 'https://sudoku.dotrino.com/',
    logo: sudokuLogo,
    repo: 'imdotrino/dotrino-sudoku',
    cat: 'juegos',
    sub: 'solo',
    desc: {
      es: 'Sudoku con <strong>aventura de niveles</strong>: un mapa con <strong>caminos que se bifurcan</strong> y <strong>jefes</strong> que desbloqueas con <strong>estrellas</strong> (1–3 por nivel según tu rendimiento). Generador propio determinista con <strong>solución única</strong>, cuatro dificultades y <strong>reto diario</strong>. <strong>Comparte un nivel y ganas pistas</strong> consumibles para resolver. Notas a lápiz, detección de errores, deshacer y cronómetro. PWA instalable; tus partidas, tiempos y estrellas viven en tu navegador.',
      en: 'Sudoku with a <strong>level adventure</strong>: a map with <strong>branching paths</strong> and <strong>bosses</strong> you unlock with <strong>stars</strong> (1–3 per level based on your performance). Deterministic generator with a guaranteed <strong>unique solution</strong>, four difficulties and a <strong>daily challenge</strong>. <strong>Share a level to earn</strong> consumable hints to solve. Pencil notes, error detection, undo and a timer. Installable PWA; your games, times and stars live in your browser.',
    },
  },
  {
    name: 'Critters',
    url: 'https://critters.dotrino.com/',
    logo: crittersLogo,
    repo: 'imdotrino/dotrino-critters',
    cat: 'juegos',
    sub: 'solo',
    desc: {
      es: 'Monstruos coleccionables con arena de batalla automática y determinista: arma tus alineaciones, define el rol (atacante/defensa/soporte) y la prioridad de objetivo de cada criatura y deja que peleen solas. Gana la estrategia, no los reflejos: 9 rarezas según el número de partes, elementos que se combinan y acumulan, y fusión para EVOLUCIONAR, REFORZAR o DEVOLUCIONAR (posición, empujes y tipos importan). Campaña infinita por estrellas, invocación y captura. PWA instalable; tu colección vive en tu navegador.',
      en: 'Collectible monsters with a deterministic automatic battle arena: build your lineups, set each critter\'s role (attacker/defense/support) and target priority, and let them fight on their own. Strategy wins, not reflexes: 9 rarities by part count, elements that combine and stack, and fusion to EVOLVE, REINFORCE or DEVOLVE (positioning, knockbacks and types matter). Endless star-based campaign, summoning and capture. Installable PWA; your collection lives in your browser.',
    },
  },
  {
    name: 'Trivia',
    url: 'https://trivia.dotrino.com/',
    logo: triviaLogo,
    repo: 'imdotrino/dotrino-trivia',
    cat: 'juegos',
    sub: 'config',
    desc: {
      es: 'Trivia configurable: pega tu <code>JSON</code> de preguntas (o genéralo con IA desde un prompt listo para copiar), elige un color del que se deriva toda la paleta, modo claro/oscuro, tu logo y fondos para móvil y web. Modos quiz con puntaje, verdadero/falso y flashcards; eliges cuántas preguntas mostrar y publicas un enlace limpio para jugar. PWA instalable; tus trivias viven en tu navegador.',
      en: 'Configurable trivia: paste your <code>JSON</code> of questions (or generate it with AI from a ready-to-copy prompt), pick one color that derives the whole palette, light/dark mode, your logo and backgrounds for mobile and web. Quiz (scored), true/false and flashcard modes; choose how many questions to show and publish a clean link to play. Installable PWA; your trivias live in your browser.',
    },
  },
  {
    name: 'GridGame',
    url: 'https://gridgame.dotrino.com/',
    logo: gridgameLogo,
    repo: 'imdotrino/dotrino-gridgame',
    cat: 'juegos',
    sub: 'multi',
    wip: true,
    desc: {
      es: 'Sandbox multijugador cooperativo en un grid. Mundo subjetivo: cada jugador crea su entorno y se explora un mundo procedural infinito con props, ítems, personajes y enemigos programables.',
      en: 'Cooperative multiplayer sandbox on a grid. Subjective world: each player creates their environment and explores an endless procedural world with programmable props, items, characters and enemies.',
    },
  },
  {
    name: 'Favicon Generator',
    url: 'https://favicon.dotrino.com/',
    logo: faviconLogo,
    repo: 'imdotrino/dotrino-favicon-generator',
    cat: 'apps',
    desc: {
      es: 'Genera favicons e íconos <code>.ico</code> compatibles con Windows a partir de una imagen PNG/JPG, listos para tu sitio o PWA. Todo en el navegador, sin subir nada a un servidor.',
      en: 'Generate favicons and Windows-compatible <code>.ico</code> icons from a PNG/JPG image, ready for your site or PWA. All in the browser, without uploading anything to a server.',
    },
  },
  {
    name: 'Android Launcher',
    url: 'https://github.com/imdotrino/dotrino-android-launcher/releases/latest/download/android-launcher.apk',
    apk: 'https://github.com/imdotrino/dotrino-android-launcher/releases/latest/download/android-launcher.apk',
    logo: androidLauncherLogo,
    repo: 'imdotrino/dotrino-android-launcher',
    cat: 'android',
    desc: {
      es: 'Launcher de Android nativo: carrusel de apps paginado por letra con índice lateral, recientes y dock. Permite <strong>ocultar apps</strong> detrás de tu huella o patrón, con un atajo camuflado. APK firmado, instalable por sideload (Android 8+).',
      en: 'Native Android launcher: app carousel paginated by letter with a side index, recents and dock. Lets you <strong>hide apps</strong> behind your fingerprint or pattern, via a disguised shortcut. Signed APK, sideload-installable (Android 8+).',
    },
  },
]

/* Selección inicial del tab "Recientes" cuando aún no hay historial local
   (ver ../recents.ts). Destaca, en orden: los contadores deportivos
   (Ecuavóley / Pádel) y el resto de los juegos. */
export const defaultRecentApps = (): AppEntry[] => {
  const counters = apps.filter((a) => a.cat === 'deportes' && /contador/i.test(a.name))
  const games = apps.filter((a) => a.cat === 'juegos' && !a.wip)
  const seen = new Set<string>()
  return [...counters, ...games].filter(
    (a) => !seen.has(a.url) && seen.add(a.url),
  )
}
