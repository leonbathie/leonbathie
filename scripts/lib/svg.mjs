/**
 * Petite boîte à outils SVG : texte (avec suivi des caractères par police,
 * pour n'incorporer que le nécessaire), reliefs Windows 95, retours à la ligne.
 */
import { embedFonts, FONTS } from './fonts.mjs'

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** Nombre court : deux décimales au plus */
export const r = (v) => Math.round(v * 100) / 100

export class Svg {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.defs = []
    this.css = []
    this.out = []
    this.fonts = new Map()
  }

  add(...parts) {
    this.out.push(...parts.flat())
    return this
  }
  def(...parts) {
    this.defs.push(...parts)
    return this
  }
  style(...rules) {
    this.css.push(...rules)
    return this
  }

  track(font, weight, str) {
    if (!FONTS[font]) throw new Error(`police inconnue : ${font}`)
    const f = this.fonts.get(font) ?? { weights: new Set(), chars: new Set() }
    f.weights.add(Number(weight) || 400)
    for (const ch of String(str)) f.chars.add(ch)
    this.fonts.set(font, f)
  }

  /** Attributs communs d'un <text> ou d'un <tspan> */
  #attrs(o, base = {}) {
    let a = ''
    if (o.f && o.f !== base.f) a += ` class="f-${o.f}${o.cls ? ` ${o.cls}` : ''}"`
    else if (o.cls) a += ` class="${o.cls}"`
    if (o.s && o.s !== base.s) a += ` font-size="${r(o.s)}"`
    if (o.w && o.w !== base.w) a += ` font-weight="${o.w}"`
    if (o.it) a += ' font-style="italic"'
    if (o.fill && o.fill !== base.fill) a += ` fill="${o.fill}"`
    if (o.a) a += ` text-anchor="${o.a}"`
    if (o.ls) a += ` letter-spacing="${r(o.ls)}"`
    if (o.ws) a += ` word-spacing="${r(o.ws)}"`
    if (o.deco) a += ` text-decoration="${o.deco}"`
    // fill-opacity plutôt qu'opacity : seul le premier vaut partout pour un <tspan>
    if (o.o !== undefined) a += ` fill-opacity="${o.o}"`
    if (o.pre) a += ' xml:space="preserve"'
    if (o.attrs) a += ` ${o.attrs}`
    return a
  }

  /**
   * Une ligne de texte.
   * f police · s taille · w graisse · fill · a ancrage · ls / ws espacements ·
   * deco soulignement · o opacité · cls classe · it italique · pre espaces conservés
   */
  t(str, x, y, o = {}) {
    const opt = { f: 'arial', s: 13, fill: '#000', ...o }
    this.track(opt.f, opt.w, str)
    return `<text x="${r(x)}" y="${r(y)}"${this.#attrs(opt)}>${esc(str)}</text>`
  }

  /** Une ligne à styles mêlés : parts = [[texte, { fill, w, deco, dx, f, s }], …] */
  rich(x, y, base, parts) {
    const opt = { f: 'arial', s: 13, fill: '#000', ...base }
    let inner = ''
    for (const [str, po = {}] of parts) {
      this.track(po.f ?? opt.f, po.w ?? opt.w, str)
      const dx = po.dx ? ` dx="${r(po.dx)}"` : ''
      inner += `<tspan${dx}${this.#attrs(po, opt)}>${esc(str)}</tspan>`
    }
    return `<text x="${r(x)}" y="${r(y)}"${this.#attrs(opt)}>${inner}</text>`
  }

  async render({ label = '' } = {}) {
    const fontCss = await embedFonts(this.fonts)
    const classes = [...this.fonts.keys()].map((k) => `.f-${k}{font-family:${FONTS[k].stack}}`).join('')
    const motion = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${r(this.w)}" height="${r(this.h)}" viewBox="0 0 ${r(this.w)} ${r(this.h)}" role="img"${label ? ` aria-label="${esc(label)}"` : ''}>` +
      (label ? `<title>${esc(label)}</title>` : '') +
      `<style>${fontCss}${classes}${this.css.join('')}${motion}</style>` +
      (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') +
      this.out.join('') +
      '</svg>\n'
    )
  }
}

/* ---------- Formes ---------- */
export const rect = (x, y, w, h, fill, extra = '') => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`

/**
 * Relief Windows 95 : bord clair en haut et à gauche, sombre en bas et à droite,
 * coins en onglet (comme des bordures CSS). `t` : épaisseur.
 */
export function raised(x, y, w, h, { fill = '#c0c0c0', hi = '#ffffff', lo = '#404040', t = 2 } = {}) {
  return (
    `<g shape-rendering="crispEdges">` +
    (fill ? rect(x, y, w, h, fill) : '') +
    `<path d="M${r(x)} ${r(y)}h${r(w)}l${-t} ${t}H${r(x + t)}V${r(y + h - t)}L${r(x)} ${r(y + h)}z" fill="${hi}"/>` +
    `<path d="M${r(x + w)} ${r(y)}v${r(h)}H${r(x)}l${t} ${-t}H${r(x + w - t)}V${r(y + t)}z" fill="${lo}"/>` +
    `</g>`
  )
}
/** Champ en creux, fond blanc par défaut */
export const sunken = (x, y, w, h, { fill = '#ffffff', t = 2, hi = '#ffffff', lo = '#404040' } = {}) => raised(x, y, w, h, { fill, hi: lo, lo: hi, t })

/** Filet gravé : un trait sombre doublé d'un trait clair */
export const etched = (x, y, w) => `<g shape-rendering="crispEdges">${rect(x, y, w, 1, '#808080')}${rect(x, y + 1, w, 1, '#ffffff')}</g>`

/* ---------- Texte ---------- */
/** Coupe un texte à chasse fixe en lignes d'au plus `max` caractères */
export function wrapChars(str, max) {
  const lines = []
  let line = ''
  for (const word of String(str).split(/\s+/)) {
    if (!line) line = word
    else if (line.length + 1 + word.length <= max) line += ` ${word}`
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

// Chasses d'Arial (millièmes de cadratin) : suffisant pour dimensionner un bouton.
const ARIAL = {
  ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191, '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015, A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667,
  L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, a: 556, b: 556, c: 500, d: 556, e: 556,
  f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
}
/** Largeur approchée d'un texte en Arial */
export function arialW(str, size, bold = false) {
  let units = 0
  for (const ch of String(str)) units += ARIAL[ch] ?? 556
  return (units * size * (bold ? 1.07 : 1)) / 1000
}
