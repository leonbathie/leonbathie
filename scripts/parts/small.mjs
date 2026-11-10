/**
 * Petites images du corps de la page : les intertitres « [ … ] » sur fond
 * bleu marine de la page de 1996, et l'étiquette « NEW! » qui clignote.
 */
import { raised, rect, Svg } from '../lib/svg.mjs'

const MONO = 0.6

/** Intertitre : `[ Latest Notes ]` en Courier gras blanc sur bleu marine */
export async function buildLabel(text) {
  const label = `[ ${text} ]`
  const w = Math.ceil(label.length * 16 * MONO + 16)
  const svg = new Svg(w, 26)
  svg.add(rect(0, 0, w, 26, '#000080'), svg.t(label, 8, 18.5, { f: 'courier', s: 16, w: 700, fill: '#fff' }))
  return { svg: await svg.render({ label }), w, h: 26, alt: label }
}

/**
 * Chiffre clé, façon compteur de visites : boîtier noir, chiffres verts.
 * Les quatre compteurs tiennent sur une ligne dans la colonne d'un profil ;
 * sur téléphone ils passent d'eux-mêmes à la ligne.
 */
export async function buildFigure({ label, value, note }) {
  const w = 200
  const h = 66
  const svg = new Svg(w, h)
  svg.def(`<filter id="g" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`)
  const led = (extra) => svg.t(value, w / 2, 43, { f: 'courier', s: 22, w: 700, fill: '#33ff33', a: 'middle', ls: 1.5, ...extra })
  svg.add(
    raised(0, 0, w, h, { fill: '#c0c0c0' }),
    raised(4, 4, w - 8, h - 8, { fill: '#000000', hi: '#404040', lo: '#ffffff' }),
    svg.t(label, w / 2, 21, { f: 'courier', s: 11.5, fill: '#ffffff', a: 'middle' }),
    led({ attrs: 'filter="url(#g)"', o: 0.7 }), // halo des diodes
    led(),
    svg.t(note, w / 2, 56, { f: 'courier', s: 10.5, fill: '#8fd68f', a: 'middle' }),
  )
  return { svg: await svg.render({ label: `${label}: ${value} (${note})` }), w, h, alt: `${label}: ${value} (${note})` }
}

/** « NEW! » : rouge et jaune, les couleurs s'inversent chaque seconde */
export async function buildNew() {
  const svg = new Svg(36, 14)
  svg.style('.a{animation:f 2s steps(1) infinite}@keyframes f{0%{opacity:1}50%{opacity:0}}')
  const frame = (cls, bg, fg) => `<g${cls ? ` class="${cls}"` : ''}>${rect(0, 0, 36, 14, bg)}${svg.t('NEW!', 18, 10.6, { s: 10, w: 700, fill: fg, a: 'middle' })}</g>`
  // Le cadre jaune reste dessous ; le rouge, par-dessus, disparaît une seconde sur deux.
  svg.add(frame('', '#ffff00', '#ff0000'), frame('a', '#ff0000', '#ffff00'))
  return { svg: await svg.render({ label: 'NEW!' }), w: 36, h: 14, alt: 'NEW!' }
}
