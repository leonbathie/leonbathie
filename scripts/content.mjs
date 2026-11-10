/**
 * Contenu de la page de profil : c'est le seul fichier à modifier pour changer
 * un texte, un lien ou la liste des projets. Ensuite : `node scripts/build.mjs`.
 *
 * Les textes reprennent ceux du blog (src/content/ et src/themes/evolution/eras.js).
 * Comme sur le blog, la page des années 1990 est en anglais et le cadre en français.
 */

export const SITE = {
  user: 'leonbathie',
  name: 'Ousmane BA',
  place: 'Rufisque / Dakar, Sénégal',
  blog: 'https://blog.173-249-2-195.sslip.io/',
  /** Forme du blog ouverte par les liens (?forme=…) : celle dont s'inspire cette page */
  form: 'evolution',
  github: 'https://github.com/leonbathie',
  linkedin: 'https://linkedin.com/in/husary',
  email: 'ousmanhabsaba@gmail.com',
  /** Adresse absolue des images (nécessaire pour les variantes mobiles <picture>) */
  raw: 'https://raw.githubusercontent.com/leonbathie/leonbathie/main/',
  /** Dépôts publics affichés par le compteur à diodes (celui-ci compris) */
  publicRepos: 21,
  /** « Last updated » : mois du dernier article du blog */
  updated: 'Oct 2026',
  year: 2026,
}

/** Lien vers une page du blog, dans la forme « Évolution » */
export const blogUrl = (route = '') => `${SITE.blog}?forme=${SITE.form}#/${route}`

/* ---------- Bandeau ---------- */
export const BANNER = {
  title: 'LeonTechLab',
  sub: `${SITE.name} — AI Research & Engineering`,
  tag: 'RESEARCH · BUILD · LEARN · INNOVATE',
  domains: ['AI', 'Engineering', 'African Languages', 'Space & Science', 'Maintenance & GMAO'],
}

/* ---------- Frise : les sept époques (couleur en R V B) ---------- */
export const ERAS = [
  { id: 'web1', years: '1991 – 1999', name: 'Web 1.0', mood: 'Pionnier', icon: 'monitor', color: [51, 255, 51] },
  { id: 'web2', years: '2000 – 2009', name: 'Web 2.0', mood: 'Interactif', icon: 'globe', color: [59, 130, 246] },
  { id: 'mobile', years: '2010 – 2019', name: 'Mobile & Cloud', mood: 'Connecté', icon: 'phone', color: [129, 140, 248] },
  { id: 'genai', years: '2020 – 2029', name: 'IA Générative', mood: 'Créatif', icon: 'brain', color: [34, 211, 238] },
  { id: 'xr', years: '2030 – 2039', name: 'AR/VR & Robotique', mood: 'Immersif', icon: 'headset', color: [249, 115, 22] },
  { id: 'agi', years: '2040 – 2049', name: 'AGI & Spatial', mood: 'Collaboratif', icon: 'network', color: [168, 85, 247] },
  { id: 'future', years: '2050', name: 'AI × Space × Africa', mood: 'Nouvelle ère', icon: 'rocket', color: [251, 191, 36] },
]

/** Icônes de la frise : tracés dans une boîte 24 × 24 (ceux du blog) */
export const ICONS = {
  monitor: 'M3 4h18v12H3z M8 20h8 M12 16v4',
  globe: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M2 12h20 M12 2c3 3 3 17 0 20 M12 2c-3 3-3 17 0 20',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M10 19h4',
  brain:
    'M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5a3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5a3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z',
  headset: 'M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4l-2-3h-4l-2 3H4a2 2 0 0 1-2-2z M7 12h2 M15 12h2',
  network: 'M12 4a2 2 0 1 0 0 4a2 2 0 1 0 0-4 M5 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4 M19 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4 M12 8v4 M12 12l-6 4 M12 12l6 4',
  rocket: 'M12 2c3 3 4 8 4 12l3 3h-4l-3 4l-3-4H5l3-3c0-4 1-9 4-12z M12 10a1 1 0 1 0 0 2a1 1 0 1 0 0-2',
}

/* ---------- La page de 1996, dans Netscape Navigator ---------- */
export const PAGE = {
  windowTitle: 'LeonTechLab - Research & Engineering - Netscape Navigator',
  windowTitleShort: 'LeonTechLab - Netscape Navigator',
  /** Clin d'œil aux pages perso des années 1990 : http://serveur/~utilisateur/ */
  location: `http://www.github.com/~${SITE.user}/index.html`,
  host: 'www.github.com',
  status: 'Document: Done',
  /** Message qui défile dans la barre d'état, comme les scripts « window.status » de 1996 */
  ticker:
    '   ***   Welcome to LeonTechLab   ***   Speech AI for Pulaar & Wolof   ***   Six African keyboards for Android & iOS   ***   Hardware fault injection   ***   Reliability engineering   ***   Thanks for visiting !   ***',
  subtitle: `${SITE.name} – Research & Engineering`,
  headline: 'Welcome to my Research Page !',
  intro: 'I share here my work and experiments in Computer Science, Artificial Intelligence, Maintenance Engineering and African Languages (Pulaar, Fulfulde, etc.).',
  nav: ['Home', 'Research', 'Projects', 'Notes', 'Links', 'About'],
  interests: ['Machine Learning (early models)', 'Industrial Maintenance & GMAO', 'Computing for African Languages', 'Space and Satellite Applications'],
  counterLabel: 'Public repos:',
  bestViewed: 'Best viewed with Netscape Navigator 3.0 · 800×600',
}

/** L'Afrique en caractères pleins de la barre latérale (█ plein, ▄ moitié basse, ▀ moitié haute) */
export const AFRICA = [
  '    ▄▄▄▄▄▄▄▄▄▄',
  '  ▄████████████▄',
  ' ███████████████▄',
  ' ████████████████▄▄',
  '  ▀▀▀█████████████▀',
  '      ██████████▀',
  '      █████████   ▄',
  '       ███████   ██',
  '        █████    ▀',
  '         ███',
  '          ▀',
]

/** Articles du blog, du plus récent au plus ancien (titres anglais) */
export const NOTES = [
  { slug: 'asr-pul-2026', date: 'Oct 2026', topic: 'Speech & NLP', title: 'Scaling Pulaar & Wolof Speech-to-Text: Fine-Tuning Whisper under Real Acoustic Constraints' },
  { slug: 'sec-emfi-2026', date: 'Oct 2026', topic: 'Offensive Sec & Hardware', title: 'Electromagnetic Fault Injection (EMFI) & Voltage Glitching on Industrial Bootloaders' },
  { slug: 'cps-gmao-2026', date: 'Aug 2026', topic: 'Cyber-Physical & Reliability', title: 'From Passive CMMS to Predictive Scheduling: Cutting Stoppages by 25% on a Bottling Line' },
  { slug: 'nlp-claviers-2026', date: 'Aug 2026', topic: 'Speech & NLP', title: 'Phonetic Tokenization & Distributed Voice Collection for Atlantic and Mande Languages' },
  { slug: 'sec-mcp-fault-2026', date: 'Jun 2026', topic: 'Offensive Sec & Hardware', title: 'Hybrid Offensive Security: Autonomous MCP Agents and Hardware Fault Injection (Faulty Cat)' },
  { slug: 'cult-3d-veo-2026', date: 'Mar 2026', topic: 'Speech & NLP', title: 'Algorithmic Preservation of Oral Heritage: From the Fables of Bouki and Leuk to 3D Video Synthesis' },
  { slug: 'ind-weibull-2025', date: 'Dec 2025', topic: 'Cyber-Physical & Reliability', title: 'Stochastic MTBF/MTTR Optimization with the Weibull Law & CMMS Automation' },
]

/** Chiffres clés (ceux de la page « Parcours » du blog) */
export const FIGURES = [
  { label: 'ASR WER (Pulaar)', value: '−34.2%', note: 'LoRA v3' },
  { label: 'Downtime (IBS)', value: '−25.0%', note: 'Weibull CMMS' },
  { label: 'National corpus', value: '3 Languages', note: 'PUL / WOL / JOO' },
  { label: 'Infra & Network', value: 'CCNA', note: '+ Self-Hosted GPU' },
]

/**
 * Logiciels. `repo` : dépôt public (lien) ; `url` : autre lien public ;
 * sans l'un ni l'autre, le projet est listé comme privé.
 */
export const SOFTWARE = [
  {
    group: 'African keyboards',
    items: [
      { name: 'Tappirgal Pulaar', lang: 'Kotlin', url: 'https://play.google.com/store/apps/details?id=com.pulaar.clavier', where: 'Google Play', desc: 'Native Android & iOS keyboard for Pulaar/Fulfulde, with lexical prediction.' },
      { name: 'Wolof · Joola · Sooninke · Mandinka · Seereer', lang: 'Kotlin', desc: 'Five more keyboards built on the same modular engine, for the languages of Senegal.' },
      { name: 'pcfulfulde', repo: 'pcfulfulde', lang: 'Python', desc: 'Fulfulde keyboard driver and utility for PC, for office work and academic editing.' },
    ],
  },
  {
    group: 'AI, Vision & Web',
    items: [
      { name: 'Lingoo', lang: 'JavaScript', desc: 'Distributed platform that collects and validates multilingual voice data for ASR/TTS training.' },
      { name: 'Taro Learning', lang: 'Kotlin', desc: 'Educational mobile app: interactive learning, syllabaries and African tales.' },
      { name: 'DIADJI', lang: 'Python', desc: 'Express checkout, stock management, PDF invoicing and AI Vision scanner.' },
      { name: 'flow-video-merger', repo: 'flow-video-merger', lang: 'JavaScript', desc: 'Chrome extension & web studio that captures, sequences and merges in 4K the videos generated by Google Flow (Veo).' },
      { name: 'blog', repo: 'blog', lang: 'Vue', desc: 'This research blog: one content, seven interchangeable forms. The latest is a Web time machine, from 1991 to 2050.' },
      { name: 'SPARK-2026', repo: 'SPARK-2026', lang: 'Jupyter', desc: 'Scientific research notebooks, data processing and AI modeling (SPARK Academy).' },
    ],
  },
  {
    group: 'Cybersecurity',
    items: [
      { name: 'jjuiceshop', repo: 'jjuiceshop', lang: 'Security', desc: 'Vulnerability analysis scripts, payloads and automated solving of the OWASP challenges.' },
      { name: 'juice-shop', repo: 'juice-shop', lang: 'TypeScript', desc: 'OWASP Juice Shop environment for offensive training, web pentesting and exploit automation.' },
      { name: 'SecureCapture', lang: 'Security', desc: 'Hardened module for forensic capture and protection of sensitive data streams.' },
    ],
  },
]

/* ---------- Vignettes des autres époques ---------- */
/**
 * head / intro : lignes déjà coupées (les vignettes sont petites).
 * font : police du corps · headFont : police des titres · art : vignette en pixel art.
 */
export const CARDS = [
  {
    id: 'web2', sub: 'Ousmane BA', nav: ['Home', 'Blog', 'Projects', 'Research', 'Contact'],
    head: ['Building a Speech', 'Toolkit for Pulaar'], intro: ['Notes on AI, maintenance', 'engineering and African', 'languages — with…'],
    font: 'verdana', headFont: 'trebuchet', art: 'globe',
    bg: [234, 242, 251], fg: [31, 41, 55], muted: [100, 116, 139], accent: [29, 78, 216], line: [191, 219, 254],
  },
  {
    id: 'mobile', sub: 'Ousmane BA', nav: ['Accueil', 'Articles', 'Projets', 'Ressources', 'À propos'],
    head: ['IA, Cloud et', 'Langues', 'Africaines'], intro: ['Recherche, développement', 'et expérimentation.'],
    font: 'inter', headFont: 'inter', art: 'phone',
    bg: [15, 23, 42], fg: [226, 232, 240], muted: [148, 163, 184], accent: [129, 140, 248], line: [51, 65, 85],
  },
  {
    id: 'genai', sub: 'Ousmane BA', nav: ['Accueil', 'Recherche', 'Projets', 'Datasets', 'Blog'],
    head: ['IA Générative', 'pour les Langues', 'Africaines'], intro: ['LLM · Speech · Traduction', '· TTS · RAG'],
    font: 'inter', headFont: 'inter', art: 'network',
    bg: [2, 6, 23], fg: [224, 242, 254], muted: [125, 211, 252], accent: [34, 211, 238], line: [14, 116, 144],
  },
  {
    id: 'xr', sub: 'Ousmane BA', nav: ['Accueil', 'Lab XR/VR', 'Robotique', 'Industrie', 'Éducation'],
    head: ['Jumeaux', 'numériques,', 'Robotique et…'], intro: ['Un atelier où l’on apprend', 'les machines en les', 'touchant.'],
    font: 'share', headFont: 'orb', art: 'gear', small: true,
    bg: [20, 12, 8], fg: [255, 237, 213], muted: [253, 186, 116], accent: [249, 115, 22], line: [154, 52, 18],
  },
  {
    id: 'agi', sub: 'Ousmane BA', nav: ['Accueil', 'AGI', 'Space', 'Recherche', 'Afrique', 'Open Lab'],
    head: ['Vers une IA', 'Générale au', 'service de…'], intro: ['Des agents qui collaborent', 'avec les chercheurs, de', 'Dakar à l’orbite basse.'],
    font: 'inter', headFont: 'orb', art: 'satellite', small: true,
    bg: [11, 4, 25], fg: [237, 233, 254], muted: [196, 181, 253], accent: [168, 85, 247], line: [88, 28, 135],
  },
  {
    id: 'future', sub: 'Ousmane BA – Research Fellow', nav: ['Home', 'AI Lab', 'Space Lab', 'Africa', 'Impact'],
    head: ['LeonTechLab', '2050'], intro: ['A lab where artificial', 'intelligence, space exploration', 'and African futures meet.'],
    font: 'inter', headFont: 'orb', art: 'rocket', small: true,
    bg: [10, 10, 15], fg: [254, 243, 199], muted: [253, 224, 71], accent: [251, 191, 36], line: [120, 90, 20],
  },
]

/* ---------- Pied de page ---------- */
export const FOOTER = {
  line: 'Évolution de LeonTechLab — de la première page Web (1991) à l’horizon 2050',
  techsLabel: 'Technologies clés par décennie :',
  techs: [
    ['Web', 'globe'],
    ['Mobile', 'phone'],
    ['Cloud', 'monitor'],
    ['IA', 'brain'],
    ['AR/VR', 'headset'],
    ['Robotique', 'network'],
    ['Spatial', 'rocket'],
  ],
  erasCaption: 'LES AUTRES ÉPOQUES',
  erasHint: 'la même page, de l’an 2000 à 2050 — sur le blog',
}

/* ---------- Barre des tâches : les liens cliquables ---------- */
export const TASKS = [
  { id: 'notes', label: 'Notes', icon: 'notes', href: blogUrl('recherche'), title: 'Latest notes — the research blog' },
  { id: 'lab', label: 'Lab', icon: 'lab', href: blogUrl('labo/glitch'), title: 'Research lab — interactive simulators' },
  { id: 'projects', label: 'Projects', icon: 'folder', href: blogUrl('projets'), title: 'Projects and systems in production' },
  { id: 'about', label: 'About', icon: 'about', href: blogUrl('parcours'), title: 'About — career and key figures' },
  { id: 'software', label: 'Software', icon: 'floppy', href: `${SITE.github}?tab=repositories`, title: 'Software — the repositories on GitHub' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: SITE.linkedin, title: 'LinkedIn' },
  { id: 'mail', label: 'E-mail', icon: 'mail', href: `mailto:${SITE.email}`, title: 'Send me an e-mail' },
]
