export const SITE = {
  website: "https://music-repo-nu.vercel.app/",
  author: "Francisco Lino",
  profile: "https://flino.dev",
  desc: "Un espacio dedicado a la recopilación de notas musicales.",
  title: "Music~Repo",
  ogImage: "devosfera-og.webp", // located in the public folder
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 12,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showGalleries: false,
  showGalleriesInIndex: false, // Show galleries in the general paginated list (only if showGalleries is true)
  showBackButton: true, // show back button in post detail
  heroTerminalPrompt: {
    prefix: "~", // highlighted part on the left
    path: "/praise-him-at-all-time", // central prompt text
    suffix: "$", // terminal symbol on the right
  },
  backdropEffects: {
    cursorGlow: false, // cursor tracking with soft halo
    grain: false, // background visual noise layer
  },
  editPost: {
    enabled: true,
    text: "Edit this post",
    url: "https://github.com/0xdres/astro-devosfera/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "es", // html lang code. Set this empty and default will be "en"
  timezone: "America/Guatemala", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  introAudio: {
    enabled: true, // show/hide intro player in home and compact player while navigating
    // src: path to file (relative to /public or absolute URL). Example: "/intro.mp3" or "https://example.com/stream"
    src: "/audio/alabale.mp3",
    isStream: false, // true for radio/live stream URLs (example: https://fluxfm.streamabc.net/flx-chillhop-mp3-128-8581707)
    label: "Alabale", // display label in player
    duration: 180, // duration in seconds (used for local files, ignored on streams)
  },
} as const;
