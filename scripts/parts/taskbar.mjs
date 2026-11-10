/**
 * Barre des tâches Windows 95, découpée en tranches : chaque tranche est une
 * image à part, donc un lien à part (un README GitHub n'autorise ni CSS ni zone
 * cliquable dans une image). Posées côte à côte sans espace, les tranches
 * reforment la barre.
 *
 * Les largeurs sont en pourcentage de la colonne : la barre garde une seule
 * ligne à toutes les tailles. Sur téléphone, où elle serait illisible, chaque
 * tranche a une variante carrée, réduite à son pictogramme.
 */
import { TASKS } from '../content.mjs'
import { arialW, r, raised, rect, Svg } from '../lib/svg.mjs'

const GRAY = '#c0c0c0'
/** Largeur de la colonne d'un profil GitHub, base du dessin */
const COLUMN = 846
/** Largeurs en % : leur somme reste sous 100 pour ne jamais passer à la ligne */
export const PCT = { start: 8.51, task: 11.58, tray: 9.92 }

/* ---------- Pictogrammes 16 × 16 ---------- */
const ICONS = {
  // Drapeau du Sénégal
  flag: () =>
    `<g shape-rendering="crispEdges"><rect x="1" y="3" width="5" height="10" fill="#00853f"/><rect x="6" y="3" width="5" height="10" fill="#fdef42"/><rect x="11" y="3" width="4" height="10" fill="#e31b23"/><path d="M8 6h1v1h1v1H9v1H8V8H7V7h1z" fill="#00853f"/><rect x=".5" y="2.5" width="15" height="11" fill="none" stroke="#000"/></g>`,
  notes: () => `<path d="M3.5 1.5h6l3 3v10h-9z" fill="#fff" stroke="#000"/><path d="M9.5 1.5v3h3" fill="none" stroke="#000"/><path d="M5 7.5h6M5 9.5h6M5 11.5h4" stroke="#000080"/>`,
  lab: () => `<rect x="1.5" y="2.5" width="13" height="10" fill="#02110a" stroke="#000"/><path d="M3 8h2l1-3 2 6 1.5-4.5 1 1.5h2.5" fill="none" stroke="#33ff33"/><rect x="5" y="13.5" width="6" height="1.5" fill="#606060"/>`,
  folder: () => `<path d="M1.5 4.5h4l1.5 1.5h7.5v7.5h-13z" fill="#ffd75e" stroke="#000"/><path d="M2 7.5h12" stroke="#fff" opacity=".7"/>`,
  about: () =>
    `<rect x="1.5" y="2.5" width="13" height="11" fill="#fff" stroke="#000"/><circle cx="5.5" cy="6.6" r="1.7" fill="#000080"/><path d="M2.9 12c0-2 1.1-2.9 2.6-2.9S8.1 10 8.1 12z" fill="#000080"/><path d="M9.5 6.5H13M9.5 8.5H13M9.5 10.5h2.5" stroke="#606060"/>`,
  floppy: () =>
    `<path d="M1.5 1.5h11l2 2v11h-13z" fill="#1c3f94" stroke="#000"/><rect x="4" y="1.5" width="7" height="4.5" fill="#d8d8d8" stroke="#000" stroke-width=".8"/><rect x="8.3" y="2.3" width="1.6" height="2.8" fill="#1c3f94"/><rect x="3.5" y="8.5" width="9" height="6" fill="#fff" stroke="#000" stroke-width=".8"/><path d="M5 10.5h6M5 12.5h6" stroke="#808080" stroke-width=".8"/>`,
  linkedin: (svg) => `<rect x="1" y="1" width="14" height="14" rx="2" fill="#0a66c2"/>${svg.t('in', 8, 12, { s: 10, w: 700, fill: '#fff', a: 'middle' })}`,
  mail: () => `<rect x="1.5" y="3.5" width="13" height="9" fill="#fff" stroke="#000"/><path d="M1.5 3.5 8 8.8l6.5-5.3" fill="none" stroke="#000"/>`,
  // Indicateur de clavier, comme « En » sous Windows : ici « Ff », le fulfulde
  keyboard: (svg) => `<rect x="1" y="1" width="14" height="14" fill="#000080"/>${svg.t('Ff', 8, 12, { s: 9.5, w: 700, fill: '#fff', a: 'middle' })}`,
}

function bar(svg, w, h) {
  return rect(0, 0, w, h, GRAY) + rect(0, 1, w, 1, '#ffffff')
}

/** Tranche large : 34 px de haut dans une colonne de 846 px */
async function wide(kind, task) {
  const w = PCT[kind] * (COLUMN / 100)
  const h = 34
  const svg = new Svg(w, h)
  svg.add(bar(svg, w, h))
  if (kind === 'start') {
    svg.add(raised(3, 5, w - 5, 24), `<g transform="translate(9 9)">${ICONS.flag(svg)}</g>`, svg.t('Start', 30, 21.5, { s: 12.5, w: 700 }))
  } else if (kind === 'tray') {
    svg.style('.col{animation:blink 2s steps(1) infinite}@keyframes blink{0%{opacity:1}50%{opacity:0}}')
    // L'horloge jamais réglée des années 1990 : 12:00, deux-points clignotant.
    // Trois textes séparés (une animation sur un <tspan> n'est pas fiable partout) ;
    // les chiffres d'Arial ont tous la même chasse, d'où la position du deux-points.
    const xe = w - 9
    const colon = xe - arialW('00', 12)
    svg.add(
      raised(3, 5, w - 6, 24, { fill: null, hi: '#808080', lo: '#ffffff', t: 1 }),
      `<g transform="translate(9 9)">${ICONS.keyboard(svg)}</g>`,
      svg.t('00', xe, 21.5, { s: 12, a: 'end' }),
      svg.t(':', colon, 21.5, { s: 12, a: 'end', cls: 'col' }),
      svg.t('12', colon - arialW(':', 12), 21.5, { s: 12, a: 'end' }),
    )
  } else {
    svg.add(raised(1.5, 5, w - 3, 24), `<g transform="translate(7.5 9)">${ICONS[task.icon](svg)}</g>`, svg.t(task.label, 28.5, 21.5, { s: 12 }))
  }
  return svg.render({ label: task?.label ?? (kind === 'start' ? 'Start' : '12:00') })
}

/** Tranche de téléphone : un carré de 40, pictogramme seul */
async function square(kind, task) {
  const w = (40 * PCT[kind]) / PCT.task
  const h = 40
  const svg = new Svg(w, h)
  svg.add(bar(svg, w, h))
  const icon = (name, size) => `<g transform="translate(${r((w - size) / 2)} ${r((h + 2 - size) / 2)}) scale(${r(size / 16)})">${ICONS[name](svg)}</g>`
  if (kind === 'start') svg.add(raised(2, 4, w - 3, 33), icon('flag', 21))
  else if (kind === 'tray') svg.add(raised(2, 4, w - 4, 33, { fill: null, hi: '#808080', lo: '#ffffff', t: 1 }), icon('keyboard', 20))
  else svg.add(raised(1.5, 4, w - 3, 33), icon(task.icon, 24))
  return svg.render({ label: task?.label ?? (kind === 'start' ? 'Start' : 'Ff') })
}

/**
 * Toutes les tranches, de gauche à droite :
 * [{ id, pct, label, href?, title?, wide, square }]
 */
export async function buildTaskbar({ start, tray }) {
  const slices = [
    { id: 'start', kind: 'start', label: 'Start', ...start },
    ...TASKS.map((task) => ({ id: task.id, kind: 'task', task, label: task.label, href: task.href, title: task.title })),
    { id: 'tray', kind: 'tray', label: 'Ff', ...tray },
  ]
  for (const s of slices) {
    s.pct = PCT[s.kind]
    s.wide = await wide(s.kind, s.task)
    s.square = await square(s.kind, s.task)
  }
  return slices
}
