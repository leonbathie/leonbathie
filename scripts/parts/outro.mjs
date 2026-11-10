/**
 * Bas de page, en une seule image :
 *   1. les six autres époques en vignettes — bandeau, couleurs et polices de
 *      leur temps, illustration en pixel art (celles du blog) ;
 *   2. le pied de page du blog (technologies clés par décennie) ;
 *   3. une rangée de boutons 88 × 31, comme au bas des pages des années 1990.
 */
import { CARDS, ERAS, FOOTER, ICONS, SITE } from '../content.mjs'
import { iconDataUri } from '../lib/png.mjs'
import { arialW, r, rect, Svg } from '../lib/svg.mjs'

const BG = '#05060a'
const LINE = '#262c3a'
const INK = '#e2e8f0'
const MUTED = '#94a3b8'
const PANEL = [12, 14, 20]
const rgb = (c) => `rgb(${c.join(',')})`
/** Couleur `a` posée à l'opacité `t` sur le fond `b` */
const over = (a, b, t) => a.map((v, i) => Math.round(v * t + b[i] * (1 - t)))

/* ---------- 1. Vignettes des époques ---------- */
const CARD = { w: 267.33, label: 24, body: 150 } // corps en 16/9, comme sur le blog

function card(svg, c) {
  const era = ERAS.find((e) => e.id === c.id)
  const { w } = CARD
  const h = CARD.label + CARD.body
  const o = []
  svg.def(`<clipPath id="c-${c.id}"><rect width="${w}" height="${h}" rx="8"/></clipPath>`)

  o.push(`<g clip-path="url(#c-${c.id})">`)
  // Bandeau : années en gras, nom de l'époque
  o.push(rect(0, 0, w, CARD.label, rgb(over(era.color, PANEL, 0.85))))
  o.push(
    svg.rich(10, 16.5, { f: c.font, s: 12.3, fill: '#000' }, [
      [era.years, { w: 700 }],
      [`| ${era.name}`, { dx: 7, o: 0.85 }],
    ]),
  )
  // Mini-page
  const y0 = CARD.label
  o.push(rect(0, y0, w, CARD.body, rgb(c.bg)))
  o.push(
    svg.rich(10, y0 + 18.5, { f: c.headFont, s: 11.5, w: 700, fill: rgb(c.fg) }, [
      ['LeonTechLab', {}],
      [c.sub, { f: c.font, s: 9.9, w: 400, fill: rgb(c.muted), dx: 8 }],
    ]),
  )
  o.push(svg.rich(10, y0 + 33, { f: c.font, s: 9.9, fill: rgb(c.muted) }, c.nav.map((label, i) => [label, i ? { dx: 7 } : {}])))

  const hs = c.small ? 12.8 : 15.2
  let y = y0 + 40 + hs
  for (const line of c.head) {
    o.push(svg.t(line, 10, y, { f: c.headFont, s: hs, w: 700, fill: rgb(c.accent) }))
    y += hs * 1.15
  }
  y += 12.4 - hs * 0.15
  for (const line of c.intro) {
    o.push(svg.t(line, 10, y, { f: c.font, s: 9.9, fill: rgb(c.muted) }))
    y += 12.4
  }

  // Illustration en pixel art, en bas à droite
  const aw = w * 0.34
  const ah = (aw * 3) / 4
  const ax = w - 10 - aw
  const ay = h - 8 - ah
  o.push(rect(ax, ay, aw, ah, '#000'))
  o.push(`<image href="${iconDataUri(c.art, 2)}" x="${r(ax)}" y="${r(ay)}" width="${r(aw)}" height="${r(ah)}" style="image-rendering:pixelated"/>`)
  o.push(`<rect x="${r(ax + 0.5)}" y="${r(ay + 0.5)}" width="${r(aw - 1)}" height="${r(ah - 1)}" fill="none" stroke="${rgb(c.line)}"/>`)
  o.push('</g>')
  o.push(`<rect x=".5" y=".5" width="${r(w - 1)}" height="${h - 1}" rx="8" fill="none" stroke="${rgb(over(era.color, PANEL, 0.45))}"/>`)
  return o.join('')
}

function eras(svg, W, mobile, y0) {
  const cols = mobile ? 2 : 3
  const pad = 12
  const gap = 10
  const scale = (W - 2 * pad - gap * (cols - 1)) / cols / CARD.w
  const cardH = (CARD.label + CARD.body) * scale
  const rows = Math.ceil(CARDS.length / cols)
  const top = y0 + pad + 22

  svg.add(svg.t(FOOTER.erasCaption, pad, y0 + pad + 11, { f: 'inter', s: 10.5, w: 600, fill: MUTED, ls: 1.6 }))
  if (!mobile) svg.add(svg.t(`${FOOTER.erasHint}  ›`, W - pad, y0 + pad + 11, { f: 'inter', s: 11, fill: MUTED, a: 'end' }))
  CARDS.forEach((c, i) => {
    const x = pad + (i % cols) * (CARD.w * scale + gap)
    const y = top + Math.floor(i / cols) * (cardH + gap)
    const zoom = Math.abs(scale - 1) < 0.001 ? '' : ` scale(${Math.round(scale * 10000) / 10000})`
    svg.add(`<g transform="translate(${r(x)} ${r(y)})${zoom}">${card(svg, c)}</g>`)
  })
  return top + rows * cardH + (rows - 1) * gap + pad - y0
}

/* ---------- 3. Boutons 88 × 31 ---------- */
const star = (cx, cy, R, k = 0.4) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 ? R * k : R
    return `${r(cx + Math.cos(a) * rad)},${r(cy + Math.sin(a) * rad)}`
  }).join(' ')

/** tile : dessin de la pastille 27 × 27 à gauche ; l1 / l2 : [texte, couleur] */
const BADGES = [
  {
    bg: '#000000',
    tile: (s) => rect(2, 2, 27, 27, 'url(#b-teal)') + s.t('N', 15.5, 24, { f: 'times', s: 25, w: 700, fill: '#fff', a: 'middle' }),
    l1: ['LEONTECH', '#ffffff'],
    l2: ['NOW! 3.0', '#ffe600'],
  },
  {
    bg: '#c0c0c0',
    tile: () => `<g shape-rendering="crispEdges">${rect(4, 5, 23, 17, '#404040')}${rect(6, 7, 19, 13, '#000080')}${rect(8, 10, 10, 1, '#fff')}${rect(8, 13, 14, 1, '#9cf')}${rect(8, 16, 7, 1, '#9cf')}${rect(12, 22, 7, 2, '#404040')}${rect(8, 24, 15, 2, '#808080')}</g>`,
    l1: ['BEST VIEW', '#000000'],
    l2: ['800X600', '#000080'],
  },
  {
    bg: '#ffffff',
    tile: () => `<g shape-rendering="crispEdges">${rect(2, 2, 9, 27, '#00853f')}${rect(11, 2, 9, 27, '#fdef42')}${rect(20, 2, 9, 27, '#e31b23')}</g><polygon points="${star(15.5, 15.5, 4.4)}" fill="#00853f"/>`,
    l1: ['MADE IN', '#000000'],
    l2: ['SENEGAL', '#00853f'],
  },
  {
    bg: '#0b3b17',
    tile: (s) => rect(2, 2, 27, 27, '#02110a') + s.t('ɓɗ', 15.5, 21, { f: 'inter', s: 15, w: 700, fill: '#33ff33', a: 'middle' }),
    l1: ['PULAAR', '#b4ffb4'],
    l2: ['KEYBOARDS', '#ffffff'],
  },
  {
    bg: '#1b1035',
    tile: (s) => rect(2, 2, 27, 27, 'url(#b-kotlin)') + s.t('K', 15.5, 22, { f: 'inter', s: 18, w: 700, fill: '#fff', a: 'middle' }),
    l1: ['POWERED', '#ffffff'],
    l2: ['BY KOTLIN', '#c792ff'],
  },
  {
    bg: '#1e2b3c',
    tile: (s) => rect(2, 2, 27, 14, '#3776ab') + rect(2, 16, 27, 13, '#ffd43b') + s.t('Py', 15.5, 21, { f: 'inter', s: 14, w: 700, fill: '#fff', a: 'middle', attrs: 'stroke="#1e2b3c" stroke-width="2.4" paint-order="stroke"' }),
    l1: ['POWERED', '#ffffff'],
    l2: ['BY PYTHON', '#ffd43b'],
  },
  {
    bg: '#000000',
    // Égaliseur : la voix, matière première de l'ASR
    tile: () =>
      rect(2, 2, 27, 27, '#02110a') +
      [6, 13, 21, 15, 9, 17, 11].map((h, i) => `<rect class="eq eq${i % 3}" x="${4.5 + i * 3.4}" y="${15.5 - h / 2}" width="2" height="${h}" fill="#33ff33"/>`).join(''),
    l1: ['WHISPER', '#33ff33'],
    l2: ['ASR + TTS', '#ffffff'],
  },
]

function badge(svg, b) {
  const text = (pair, y) => svg.t(pair[0], 58.5, y, { f: 'silk', s: 8, fill: pair[1], a: 'middle' })
  return rect(0, 0, 88, 31, b.bg) + b.tile(svg) + text(b.l1, 13) + text(b.l2, 24) + bevel()
}
/** Le dernier bouton : « en construction », rubans de chantier qui défilent */
function construction(svg) {
  svg.def(
    `<pattern id="b-hz" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="skewX(-45)"><rect width="4" height="8"/></pattern>`,
    `<clipPath id="b-hzc"><rect x="1" y="1" width="86" height="29"/></clipPath>`,
  )
  svg.style('.hz{animation:hz 1.2s linear infinite}@keyframes hz{to{transform:translateX(8px)}}')
  return (
    rect(0, 0, 88, 31, '#ffd400') +
    `<g clip-path="url(#b-hzc)"><rect class="hz" x="-16" y="1" width="120" height="6" fill="url(#b-hz)"/><rect class="hz" x="-16" y="24" width="120" height="6" fill="url(#b-hz)"/></g>` +
    svg.t('UNDER', 44, 14.5, { f: 'silk', s: 8, fill: '#000', a: 'middle' }) +
    svg.t('CONSTRUCTION', 44, 22.5, { f: 'silk', s: 8, fill: '#000', a: 'middle' }) +
    bevel()
  )
}
/** Relief d'un bouton : liseré clair en haut à gauche, sombre en bas à droite */
const bevel = () => `<path d="M.5 30.5V.5h87" fill="none" stroke="#fff" opacity=".6"/><path d="M87.5.5v30H.5" fill="none" stroke="#000" opacity=".6"/>`

function badges(svg, W, mobile, y0) {
  svg.def(
    `<linearGradient id="b-teal" x2="0" y2="1"><stop offset="0" stop-color="#00a99d"/><stop offset="1" stop-color="#004d47"/></linearGradient>`,
    `<linearGradient id="b-kotlin" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7f52ff"/><stop offset=".5" stop-color="#c711e1"/><stop offset="1" stop-color="#e44857"/></linearGradient>`,
  )
  svg.style(
    '.eq{transform-box:fill-box;transform-origin:center;animation:eq 1.1s ease-in-out infinite}.eq1{animation-delay:.25s}.eq2{animation-delay:.5s}',
    '@keyframes eq{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}',
  )
  const all = [...BADGES.map((b) => badge(svg, b)), construction(svg)]
  const perRow = mobile ? 4 : all.length
  const gap = 8
  const x0 = (W - (perRow * 88 + (perRow - 1) * gap)) / 2
  all.forEach((b, i) => {
    svg.add(`<g transform="translate(${r(x0 + (i % perRow) * (88 + gap))} ${r(y0 + Math.floor(i / perRow) * (31 + gap))})">${b}</g>`)
  })
  const rows = Math.ceil(all.length / perRow)
  return rows * 31 + (rows - 1) * gap
}

/* ---------- 2. Pied de page ---------- */
function footer(svg, W, mobile, y0) {
  let y = y0
  svg.add(rect(0, y, W, 1, LINE))
  const lines = mobile ? ['Évolution de LeonTechLab — de la première', 'page Web (1991) à l’horizon 2050'] : [FOOTER.line]
  y += 10
  for (const line of lines) {
    y += mobile ? 18 : 19
    svg.add(svg.t(line, 16, y, { f: 'inter', s: mobile ? 13 : 14.5, w: 600, fill: INK }))
  }
  // Technologies clés par décennie : pictogramme et libellé
  y += 25
  svg.add(svg.t(FOOTER.techsLabel, 16, y, { f: 'inter', s: 12, fill: MUTED }))
  // Les libellés se suivent ; sur téléphone ils passent à la ligne.
  let x = mobile ? 16 : 16 + arialW(FOOTER.techsLabel, 12) * 1.06 + 22
  if (mobile) y += 24
  for (const [label, icon] of FOOTER.techs) {
    const w = 21 + arialW(label, 12) * 1.06
    if (x + w > W - 16) {
      x = 16
      y += 24
    }
    svg.add(
      `<g transform="translate(${r(x)} ${r(y - 12.5)}) scale(.6667)" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[icon]}"/></g>`,
      svg.t(label, x + 21, y, { f: 'inter', s: 12, fill: MUTED }),
    )
    x += w + 20
  }
  y += 20
  y += badges(svg, W, mobile, y)
  y += 26
  const credit = [`© ${SITE.year} Ousmane Ba`, SITE.place, `github.com/${SITE.user}`]
  // Une ligne sur grand écran ; sur téléphone, l'adresse passe dessous.
  const credits = mobile ? [credit.slice(0, 2).join(' · '), credit[2]] : [credit.join(' · ')]
  for (const [i, line] of credits.entries()) {
    if (i) y += 17
    svg.add(svg.t(line, W / 2, y, { f: 'inter', s: 12, fill: MUTED, a: 'middle' }))
  }
  return y + 16 - y0
}

export async function buildOutro({ mobile = false } = {}) {
  const W = mobile ? 430 : 846
  const svg = new Svg(W, 0)
  const bg = svg.out.length
  let y = 0
  y += eras(svg, W, mobile, y)
  y += footer(svg, W, mobile, y)
  svg.h = y
  svg.out.splice(bg, 0, rect(0, 0, W, y, BG), rect(0, 0, W, 1, LINE))
  return svg.render({ label: FOOTER.line })
}
