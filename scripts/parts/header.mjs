/**
 * En-tête : le bandeau photo du blog (salle de contrôle, globe filaire, satellite),
 * le titre en pixel art, puis la frise des sept époques — 1991-1999 sélectionnée.
 *
 * La photo d'origine fait 2000 × 207 : trop étirée pour la colonne d'un profil
 * GitHub (846 px). On en montre deux recadrages accolés — l'ingénieur à gauche,
 * la Terre à droite — et le titre passe dessous, comme sur le blog en petit écran.
 */
import { BANNER, ERAS, ICONS } from '../content.mjs'
import { r, rect, Svg } from '../lib/svg.mjs'

const PHOTO = { w: 2000, h: 207 }
/** Dakar sur le globe filaire, en pixels de la photo */
const DAKAR = { x: 1472, y: 100 }
const INK = '#e2e8f0'
const MUTED = '#94a3b8'
const rgb = (c, a) => (a === undefined ? `rgb(${c.join(',')})` : `rgba(${c.join(',')},${a})`)

export async function buildHeader({ mobile = false, photoUri }) {
  const W = mobile ? 430 : 846

  /* ---------- Géométrie ---------- */
  const stripH = mobile ? 125 : 145
  const k = stripH / PHOTO.h // échelle de la photo
  const leftW = mobile ? 215 : 462
  const rightW = W - leftW
  const leftSrc = { x: 0, w: leftW / k }
  // À droite : la Terre et le satellite (jusqu'à x = 1800 ; au-delà la photo est noire)
  const rightSrc = mobile ? { x: 1381, w: rightW / k } : { x: 1800 - rightW / k, w: rightW / k }
  const beacon = { x: leftW + (DAKAR.x - rightSrc.x) * k, y: DAKAR.y * k }

  const T = mobile
    ? { title: 32, titleY: stripH + 50, sub: 12.5, subY: stripH + 76, tag: 9.5, tagY: stripH + 97, ruleY: stripH + 108, ruleW: 330, dom: 10.5, domY: stripH + 128, domStep: 18, end: stripH + 164 }
    : { title: 40, titleY: stripH + 58, sub: 15, subY: stripH + 88, tag: 11.5, tagY: stripH + 112, ruleY: stripH + 125, ruleW: 470, dom: 12, domY: stripH + 148, domStep: 0, end: stripH + 166 }

  // Frise : une rangée de sept sur grand écran ; quatre puis trois sur téléphone
  const rows = mobile ? [ERAS.slice(0, 4), ERAS.slice(4)] : [ERAS]
  const rowH = mobile ? 110 : 116
  const tlY = T.end
  const tlH = 10 + rows.length * rowH + (rows.length - 1) * 4 + 12
  const H = tlY + tlH

  const svg = new Svg(W, H)
  const cx = W / 2

  /* ---------- Définitions ---------- */
  svg.def(
    `<image id="ph" width="${PHOTO.w}" height="${PHOTO.h}" href="${photoUri}"/>`,
    `<linearGradient id="seam"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`,
    `<linearGradient id="fade" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000"/></linearGradient>`,
    `<linearGradient id="rule"><stop offset="0" stop-color="#e0d8bf" stop-opacity="0"/><stop offset=".12" stop-color="#e0d8bf"/><stop offset=".88" stop-color="#e0d8bf"/><stop offset="1" stop-color="#e0d8bf" stop-opacity="0"/></linearGradient>`,
    `<linearGradient id="tl" x2="0" y2="1"><stop offset="0" stop-color="#0b0d14"/><stop offset="1" stop-color="#05060a"/></linearGradient>`,
    `<filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    `<filter id="halo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`,
  )
  svg.style(
    '.beat{animation:beat 2.2s ease-in-out infinite}',
    '@keyframes beat{0%,100%{opacity:1}50%{opacity:.35}}',
    '.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out infinite}',
    '@keyframes ping{0%{transform:scale(.5);opacity:.9}100%{transform:scale(3.4);opacity:0}}',
    '.halo{animation:halo 3.2s ease-in-out infinite}',
    '@keyframes halo{0%,100%{opacity:.55}50%{opacity:.2}}',
  )

  /* ---------- Bandeau ---------- */
  svg.add(
    rect(0, 0, W, H, '#000'),
    `<svg width="${leftW}" height="${stripH}" viewBox="${r(leftSrc.x)} 0 ${r(leftSrc.w)} ${PHOTO.h}" preserveAspectRatio="none"><use href="#ph"/></svg>`,
    `<svg x="${leftW}" width="${rightW}" height="${stripH}" viewBox="${r(rightSrc.x)} 0 ${r(rightSrc.w)} ${PHOTO.h}" preserveAspectRatio="none"><use href="#ph"/></svg>`,
    rect(leftW - 30, 0, 60, stripH, 'url(#seam)'),
    rect(0, stripH - 30, W, 30, 'url(#fade)'),
    // Balise sur Dakar
    `<circle class="ping" cx="${r(beacon.x)}" cy="${r(beacon.y)}" r="3" fill="none" stroke="#ff5a3c" stroke-width="1"/>`,
    `<circle class="beat" cx="${r(beacon.x)}" cy="${r(beacon.y)}" r="${mobile ? 2 : 2.4}" fill="#ff5a3c" filter="url(#glow)"/>`,
  )

  svg.add(
    svg.t(BANNER.title, cx, T.titleY, { f: 'pixel', s: T.title, fill: '#f3eacd', a: 'middle', ls: 1 }),
    svg.t(BANNER.sub, cx, T.subY, { f: 'plex', s: T.sub, w: 500, fill: '#ece4cf', a: 'middle' }),
    svg.t(BANNER.tag, cx, T.tagY, { f: 'plex', s: T.tag, fill: '#ece4cf', a: 'middle', ls: T.tag * 0.14, ws: T.tag * 0.55 }),
    rect(cx - T.ruleW / 2, T.ruleY, T.ruleW, 1, 'url(#rule)', 'opacity=".9"'),
  )
  // Domaines : « // AI   // Engineering … » sur une ligne, deux sur téléphone
  const domainRows = mobile ? [BANNER.domains.slice(0, 3), BANNER.domains.slice(3)] : [BANNER.domains]
  domainRows.forEach((row, i) => {
    const parts = row.flatMap((d, j) => [
      ['// ', { fill: '#cfc6ad', ...(j ? { dx: T.dom * 1.5 } : {}) }],
      [d, {}],
    ])
    svg.add(svg.rich(cx, T.domY + i * T.domStep, { f: 'plex', s: T.dom, fill: '#ece4cf', a: 'middle' }, parts))
  })

  /* ---------- Frise ---------- */
  svg.add(rect(0, tlY, W, tlH, 'url(#tl)'), rect(0, tlY, W, 1, '#262c3a'))

  const padX = mobile ? 10 : 12
  const gap = 6
  rows.forEach((row, ri) => {
    const colW = (W - 2 * padX - gap * (row.length - 1)) / row.length
    const y0 = tlY + 10 + ri * (rowH + 4)
    const centers = row.map((_, i) => padX + i * (colW + gap) + colW / 2)
    const wireY = y0 + 31

    // Le fil lumineux, d'une époque à l'autre : il prend la couleur de chacune
    const x1 = mobile ? centers[0] : W * 0.04
    const x2 = mobile ? centers.at(-1) : W * 0.96
    const stops = row.map((era, i) => `<stop offset="${r(i / (row.length - 1))}" stop-color="${rgb(era.color)}"/>`).join('')
    svg.def(`<linearGradient id="wire${ri}">${stops}</linearGradient>`)
    svg.add(rect(x1, wireY, x2 - x1, 2, `url(#wire${ri})`, 'opacity=".6"'))
    if (!mobile) {
      // Une étincelle parcourt le fil, de 1991 à 2050
      svg.style(
        '.spark{animation:spark 9s linear infinite}',
        `@keyframes spark{0%{transform:translateX(0);opacity:0}6%{opacity:1}94%{opacity:1}100%{transform:translateX(${r(x2 - x1)}px);opacity:0}}`,
      )
      svg.add(`<circle class="spark" cx="${r(x1)}" cy="${wireY + 1}" r="2.6" fill="#fff" filter="url(#glow)"/>`)
    }

    row.forEach((era, i) => {
      const c = centers[i]
      const x = c - colW / 2
      const on = era.id === 'web1'
      const sizes = mobile ? { years: 12.5, name: 10.5, mood: 9.5 } : { years: 13.5, name: 11.5, mood: 10.5 }
      if (on) {
        svg.add(
          `<rect class="halo" x="${r(x)}" y="${y0}" width="${r(colW)}" height="${rowH - 10}" rx="10" fill="none" stroke="${rgb(era.color)}" stroke-width="3" filter="url(#halo)"/>`,
          `<rect x="${r(x + 0.5)}" y="${y0 + 0.5}" width="${r(colW - 1)}" height="${rowH - 11}" rx="10" fill="${rgb(era.color, 0.1)}" stroke="${rgb(era.color)}"/>`,
        )
      }
      svg.add(
        `<g transform="translate(${r(c - 13)} ${y0 + 5}) scale(${r(26 / 24)})" fill="none" stroke="${rgb(era.color)}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"><path d="${ICONS[era.icon]}"/></g>`,
        `<circle cx="${r(c)}" cy="${y0 + 40.5}" r="4.5" fill="${rgb(era.color)}" filter="url(#glow)"/>`,
        svg.t(era.years, c, y0 + 62, { f: 'inter', s: sizes.years, w: 700, fill: on ? rgb(era.color) : INK, a: 'middle' }),
        svg.t(era.name, c, y0 + 79.5, { f: 'inter', s: sizes.name, fill: INK, a: 'middle', o: 0.9 }),
        svg.t(`(${era.mood})`, c, y0 + 95, { f: 'inter', s: sizes.mood, fill: MUTED, a: 'middle' }),
      )
    })
  })

  svg.add(rect(0, H - 1, W, 1, '#262c3a'))
  return svg.render({ label: `${BANNER.title} — ${BANNER.sub}` })
}
