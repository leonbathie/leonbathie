/**
 * La page de 1996 : une fenêtre Netscape Navigator sous Windows 95, et dedans
 * la page personnelle d'époque — barre noire à gauche, encadré jaune, filets
 * gravés, liens bleus soulignés et compteur à diodes.
 *
 * Deux mises en page, comme sur le blog : large (barre latérale à gauche) et
 * téléphone (barre latérale en haut, barre d'outils réduite).
 */
import { AFRICA, NOTES, PAGE, SITE } from '../content.mjs'
import { arialW, etched, r, raised, rect, sunken, Svg, wrapChars } from '../lib/svg.mjs'

const GRAY = '#c0c0c0'
const NAVY = '#000080'
const LINK = '#0000ee'
const DIM = '#505050'
const GREEN = '#33ff33'
const MONO = 0.6 // chasse de Courier New, en cadratins

/* ---------- Pictogrammes de la barre d'outils, dans une boîte 12 × 12 ---------- */
const GLYPHS = {
  back: (c) => `<path d="M9.5 1v10L2 6z" fill="${c}"/>`,
  forward: (c) => `<path d="M2.5 1v10L10 6z" fill="${c}"/>`,
  home: (c) => `<path d="M1 6.4 6 1.4l5 5M2.6 5.6V11h6.8V5.6" fill="none" stroke="${c}" stroke-width="1.3"/>`,
  reload: (c) => `<path d="M9.9 3.6A4.5 4.5 0 1 0 10.5 7.6" fill="none" stroke="${c}" stroke-width="1.4"/><path d="M11.4.6v4.3H7.1z" fill="${c}"/>`,
  stop: () => `<rect x="2" y="2" width="8" height="8" fill="#c00000"/>`,
}

export async function buildNetscape({ mobile = false, avatarUri, satelliteUri }) {
  const W = mobile ? 430 : 846
  const svg = new Svg(W, 0)
  const X0 = 4 // zone intérieure : cadre de 2 px + marge de 2 px
  const IW = W - 8
  const o = [] // tout ce qui se dessine par-dessus le fond de la fenêtre
  let y = 4

  svg.def(
    `<linearGradient id="tb"><stop offset="0" stop-color="#000080"/><stop offset="1" stop-color="#1084d0"/></linearGradient>`,
    `<linearGradient id="night" x2="0" y2="1"><stop offset="0" stop-color="#000033"/><stop offset="1" stop-color="#1a1a66"/></linearGradient>`,
    `<filter id="bw"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.25" intercept="-.125"/><feFuncG type="linear" slope="1.25" intercept="-.125"/><feFuncB type="linear" slope="1.25" intercept="-.125"/></feComponentTransfer></filter>`,
  )
  svg.style(
    '.cur{animation:blink 1.1s steps(1) infinite}',
    '.new{animation:blink 1s steps(1) infinite}',
    '@keyframes blink{0%{opacity:1}50%{opacity:0}}',
    '.m1{animation:met 1.7s linear infinite}.m2{animation:met 1.7s linear .85s infinite}',
    '@keyframes met{0%{transform:translate(-6px,-3px);opacity:0}8%{opacity:1}80%{opacity:1}100%{transform:translate(46px,26px);opacity:0}}',
    '.tw{animation:tw 2.4s ease-in-out infinite}.tw2{animation:tw 2.4s ease-in-out 1.2s infinite}',
    '@keyframes tw{0%,100%{opacity:1}50%{opacity:.25}}',
  )

  /* ---------- Barre de titre ---------- */
  {
    o.push(rect(X0, y, IW, 22, 'url(#tb)'))
    o.push(`<rect x="${X0 + 3.5}" y="${y + 3.5}" width="15" height="15" fill="${NAVY}" stroke="#fff"/>`)
    o.push(svg.t('N', X0 + 11, y + 15, { f: 'times', s: 11.5, w: 700, fill: '#fff', a: 'middle' }))
    o.push(svg.t(mobile ? PAGE.windowTitleShort : PAGE.windowTitle, X0 + 25, y + 15.5, { s: 13.5, w: 700, fill: '#fff' }))
    const by = y + 4
    const bx = X0 + IW - 3 - 16
    for (const [i, kind] of ['close', 'max', 'min'].entries()) {
      const x = bx - i * 18
      o.push(raised(x, by, 16, 14))
      if (kind === 'min') o.push(rect(x + 4, by + 9, 6, 2, '#000', 'shape-rendering="crispEdges"'))
      if (kind === 'max') o.push(`<g shape-rendering="crispEdges">${rect(x + 3, by + 3, 9, 2, '#000')}<rect x="${x + 3.5}" y="${by + 3.5}" width="8" height="7" fill="none" stroke="#000"/></g>`)
      if (kind === 'close') o.push(`<path d="M${x + 4.5} ${by + 3.5}l6 6m0-6l-6 6" stroke="#000" stroke-width="1.6" fill="none"/>`)
    }
    y += 22
  }

  /* ---------- Menus : première lettre soulignée ---------- */
  {
    const items = mobile ? ['File', 'Edit', 'View', 'Bookmarks', 'Options', 'Help'] : ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options', 'Directory', 'Help']
    const parts = items.flatMap((m, i) => [
      [m[0], { deco: 'underline', ...(i ? { dx: 12 } : {}) }],
      [m.slice(1), {}],
    ])
    o.push(svg.rich(X0 + 7, y + 15.5, { s: 13.5 }, parts))
    y += 22
    o.push(etched(X0, y, IW))
    y += 2
  }

  /* ---------- Barre d'outils ---------- */
  {
    const pad = mobile ? 5 : 8
    const buttons = [
      { label: 'Back', glyph: 'back', off: true },
      { label: 'Forward', glyph: 'forward', off: true },
      { label: 'Home', glyph: 'home' },
      { label: 'Reload', glyph: 'reload' },
      ...(mobile ? [] : [{ label: 'Find' }]),
      { label: 'Stop', glyph: 'stop', off: true },
    ]
    const by = y + 4
    let x = X0 + 4
    for (const b of buttons) {
      const lw = arialW(b.label, 13.5)
      const cw = (b.glyph ? 17 : 0) + lw
      const w = Math.ceil(4 + 2 * pad + cw)
      o.push(raised(x, by, w, 27))
      const cx = x + (w - cw) / 2
      if (b.glyph) {
        const ink = b.off ? '#808080' : '#000'
        if (b.off && b.glyph !== 'stop') o.push(`<g transform="translate(${r(cx + 1)} ${by + 8.5})">${GLYPHS[b.glyph]('#fff')}</g>`)
        o.push(`<g transform="translate(${r(cx)} ${by + 7.5})">${GLYPHS[b.glyph](ink)}</g>`)
      }
      const tx = cx + (b.glyph ? 17 : 0)
      if (b.off) o.push(svg.t(b.label, tx + 1, by + 19, { s: 13.5, fill: '#fff' }))
      o.push(svg.t(b.label, tx, by + 18, { s: 13.5, fill: b.off ? '#808080' : '#000' }))
      x += w + 4
    }
    // Le « N » de Netscape, sous une pluie de météores
    const tw = 42
    const th = 31
    const tx = X0 + IW - 4 - tw
    const ty = y + 2
    svg.def(`<clipPath id="thc"><rect x="${tx + 2}" y="${ty + 2}" width="${tw - 4}" height="${th - 4}"/></clipPath>`)
    o.push(sunken(tx, ty, tw, th, { fill: 'url(#night)' }))
    o.push(
      `<g clip-path="url(#thc)">` +
        `<g fill="#fff"><rect class="tw" x="${tx + 8}" y="${ty + 7}" width="1" height="1"/><rect class="tw2" x="${tx + 33}" y="${ty + 9}" width="1" height="1"/><rect class="tw" x="${tx + 30}" y="${ty + 22}" width="1" height="1"/><rect class="tw2" x="${tx + 11}" y="${ty + 23}" width="1" height="1"/></g>` +
        svg.t('N', tx + tw / 2, ty + 24, { f: 'times', s: 24, w: 700, fill: '#fff', a: 'middle' }) +
        `<circle class="m1" cx="${tx + 2}" cy="${ty + 5}" r="1.3" fill="#fff"/><circle class="m2" cx="${tx + 12}" cy="${ty + 1}" r="1.1" fill="#9cf"/>` +
        `</g>`,
    )
    y += 35
    o.push(etched(X0, y, IW))
    y += 2
  }

  /* ---------- Adresse ---------- */
  {
    o.push(svg.t('Location:', X0 + 6, y + 19.5, { s: 13.5, w: 700 }))
    const fx = X0 + 74
    const fw = IW - 74 - 5
    o.push(sunken(fx, y + 4, fw, 22))
    const max = Math.floor((fw - 12) / (12.8 * MONO))
    const url = PAGE.location.length > max ? `${PAGE.location.slice(0, max - 1)}…` : PAGE.location
    o.push(svg.t(url, fx + 6, y + 19.5, { f: 'courier', s: 12.8 }))
    y += 30
    o.push(etched(X0, y, IW))
    y += 2
  }

  /* ---------- Boutons d'annuaire (grand écran) ---------- */
  if (!mobile) {
    let x = X0 + 4
    for (const label of ["What's New?", "What's Cool?", 'Handbook', 'Net Directory', 'Software']) {
      const w = Math.ceil(20 + arialW(label, 13.5))
      o.push(raised(x, y + 4, w, 25))
      o.push(svg.t(label, x + w / 2, y + 21, { s: 13.5, a: 'middle' }))
      x += w + 4
    }
    y += 33
  }

  /* ---------- La page ---------- */
  y += 2
  const pageY = y + 2 // sous la bordure en creux
  const pageX = X0 + 2
  const pageW = IW - 4
  const sideW = mobile ? pageW : 150
  const page = []

  // Barre latérale : titre vert, navigation, l'Afrique, compteur
  function side(sx, sy) {
    const s = []
    s.push(svg.t('LeonTechLab', sx + 12, sy + 27, { f: 'courier', s: 14.4, w: 700, fill: GREEN }))
    const item = (label, x, base, on) => {
      s.push(`<path d="M${r(x)} ${r(base - 10.5)}v10l8-5z" fill="${GREEN}"/>`)
      s.push(svg.t(label, x + 17, base, { f: 'courier', s: 14.4, fill: on ? '#ffff66' : '#fff', deco: 'underline' }))
    }
    const led = (x, top) => {
      const digits = String(SITE.publicRepos).padStart(6, '0')
      const w = Math.ceil(digits.length * 14.4 * (MONO + 0.2) + 14)
      s.push(raised(x, top, w, 28, { fill: '#000', hi: '#404040', lo: '#a0a0a0' }))
      s.push(svg.t(digits, x + 9, top + 19, { f: 'courier', s: 14.4, w: 700, fill: GREEN, ls: 14.4 * 0.2 }))
      return w
    }

    if (mobile) {
      // Navigation sur plusieurs lignes, compteur sur la même ligne que son libellé
      let x = sx + 12
      let base = sy + 52
      PAGE.nav.forEach((label, i) => {
        const w = 17 + label.length * 14.4 * MONO
        if (x + w > sx + sideW - 12) {
          x = sx + 12
          base += 27
        }
        item(label, x, base, i === 0)
        x += w + 16
      })
      const top = base + 14
      s.push(svg.t(PAGE.counterLabel, sx + 12, top + 19, { f: 'courier', s: 12.5, fill: '#fff' }))
      led(sx + 12 + PAGE.counterLabel.length * 12.5 * MONO + 10, top)
      return { s, h: top + 28 + 12 - sy }
    }

    let base = sy + 61
    PAGE.nav.forEach((label, i) => {
      item(label, sx + 12, base, i === 0)
      base += 27.6
    })
    // L'Afrique : chaque caractère plein devient un pavé de 5 × 10
    const ay = base - 27.6 + 26
    let cells = ''
    AFRICA.forEach((line, row) => {
      ;[...line].forEach((ch, col) => {
        if (ch === ' ') return
        const half = ch === '█' ? 0 : 5
        cells += `<rect x="${sx + 12 + col * 5}" y="${r(ay + row * 10 + (ch === '▄' ? 5 : 0))}" width="5" height="${10 - half}"/>`
      })
    })
    s.push(`<g fill="${GREEN}" shape-rendering="crispEdges">${cells}</g>`)
    const top = ay + AFRICA.length * 10 + 14
    s.push(svg.t(PAGE.counterLabel, sx + 12, top + 10, { f: 'courier', s: 12.5, fill: '#fff' }))
    led(sx + 12, top + 17)
    return { s, h: top + 17 + 28 + 14 - sy }
  }

  // Colonne principale
  function main(mx, my, mw) {
    const m = []
    const fs = mobile ? 14 : 15.2
    const cw = fs * MONO
    const lh = mobile ? 19.5 : 21
    const cols = Math.floor(mw / cw)
    let cy = my

    // Portrait, titre, vignette satellite
    m.push(`<image href="${avatarUri}" x="${mx}" y="${cy}" width="64" height="64" preserveAspectRatio="xMidYMid slice" filter="url(#bw)"/>`)
    m.push(`<rect x="${mx + 0.5}" y="${cy + 0.5}" width="63" height="63" fill="none" stroke="#000"/>`)
    m.push(svg.t('LeonTechLab', mx + 80, cy + 34, { f: 'times', s: 30, w: 700, fill: NAVY }))
    m.push(svg.t(PAGE.subtitle, mx + 80, cy + 56, { f: 'courier', s: mobile ? 12.6 : 15.2, w: 700 }))
    if (!mobile) {
      m.push(`<image href="${satelliteUri}" x="${mx + mw - 64}" y="${cy + 8}" width="64" height="48" style="image-rendering:pixelated"/>`)
    }
    cy += 64 + 12
    m.push(etched(mx, cy, mw))
    cy += 2 + 12

    // Encadré jaune, avec un curseur qui clignote
    const head = `> ${PAGE.headline}`
    const hs = mobile ? 15 : 16
    const hw = head.length * hs * MONO
    m.push(rect(mx, cy, hw + 12.8 + hs * MONO + 4, 26, '#ffff66'))
    m.push(svg.t(head, mx + 6.4, cy + 18.5, { f: 'courier', s: hs, w: 700 }))
    m.push(`<rect class="cur" x="${r(mx + 6.4 + hw + 4)}" y="${cy + 5}" width="${r(hs * MONO)}" height="16" fill="#000"/>`)
    cy += 26 + 8

    for (const [i, line] of wrapChars(PAGE.intro, cols).entries()) m.push(svg.t(line, mx, cy + 15.5 + i * lh, { f: 'courier', s: fs }))
    cy += wrapChars(PAGE.intro, cols).length * lh

    const bracket = (label) => {
      cy += 16
      const text = `[ ${label} ]`
      m.push(rect(mx, cy, text.length * 16 * MONO + 16, 26, NAVY))
      m.push(svg.t(text, mx + 8, cy + 18.5, { f: 'courier', s: 16, w: 700, fill: '#fff' }))
      cy += 26 + 8
    }
    const bullet = () => m.push(`<circle cx="${mx + 11}" cy="${r(cy + 10.5)}" r="2.6"/>`)
    const listCols = Math.floor((mw - 24) / cw)

    // Derniers articles : liens bleus soulignés, année en gris, « NEW! » sur le plus récent
    bracket('Latest Notes')
    NOTES.slice(0, 3).forEach((note, n) => {
      const year = ` (${note.date.split(' ').at(-1)})`
      const lines = wrapChars(note.title, listCols)
      const fits = lines.at(-1).length + year.length <= listCols
      bullet()
      lines.forEach((line, i) => {
        const last = i === lines.length - 1
        const parts = [[line, { fill: LINK, deco: 'underline' }]]
        if (last && fits) parts.push([year, { fill: DIM }])
        m.push(svg.rich(mx + 24, cy + 15.5, { f: 'courier', s: fs }, parts))
        if (last && n === 0) {
          const nx = mx + 24 + (line.length + (fits ? year.length : 0)) * cw + 8
          if (nx + 36 <= mx + mw) {
            m.push(`<g class="new">${rect(nx, cy + 4, 36, 14, '#ff0000')}${svg.t('NEW!', nx + 18, cy + 14.5, { s: 10, w: 700, fill: '#ffff00', a: 'middle' })}</g>`)
          }
        }
        cy += lh
      })
      if (!fits) {
        m.push(svg.t(year.trim(), mx + 24, cy + 15.5, { f: 'courier', s: fs, fill: DIM }))
        cy += lh
      }
      cy += 5
    })
    cy -= 5

    bracket('Research Interests')
    PAGE.interests.forEach((label) => {
      bullet()
      for (const line of wrapChars(label, listCols)) {
        m.push(svg.t(line, mx + 24, cy + 15.5, { f: 'courier', s: fs }))
        cy += lh
      }
      cy += 2
    })

    cy += 12
    m.push(etched(mx, cy, mw))
    cy += 2 + 10
    const foot = `Last updated: ${SITE.updated} · ${PAGE.bestViewed}`
    for (const line of wrapChars(foot, Math.floor(mw / (12.8 * MONO)))) {
      m.push(svg.t(line, mx, cy + 13, { f: 'courier', s: 12.8, fill: DIM }))
      cy += 18
    }
    return { m, h: cy - my }
  }

  let pageH
  if (mobile) {
    const sd = side(pageX, pageY)
    const mn = main(pageX + 16, pageY + sd.h + 12, pageW - 32)
    pageH = sd.h + 12 + mn.h + 12
    page.push(rect(pageX, pageY, pageW, sd.h, '#000'), ...sd.s, ...mn.m)
  } else {
    const sd = side(pageX, pageY)
    const mn = main(pageX + sideW + 16, pageY + 12, pageW - sideW - 32)
    pageH = Math.max(sd.h, mn.h + 24)
    page.push(rect(pageX, pageY, sideW, pageH, '#000'), ...sd.s, ...mn.m)
  }
  o.push(sunken(X0, y, IW, pageH + 4, { fill: GRAY }), ...page)
  y += pageH + 4 + 3

  /* ---------- Barre d'état ---------- */
  {
    const hostW = mobile ? 0 : Math.ceil(arialW(PAGE.host, 12.5) + 14)
    const fieldW = IW - (hostW ? hostW + 3 : 0)
    o.push(sunken(X0, y, fieldW, 20))
    // Le message défile : il reste lisible quatre secondes, sort par la gauche, revient par la droite.
    const message = PAGE.status + PAGE.ticker
    const out = arialW(message, 12.5) + 12
    const speed = 55 // px par seconde
    const hold = 4
    const total = hold + (out + fieldW) / speed
    const p1 = (hold / total) * 100
    const p2 = ((hold + out / speed) / total) * 100
    svg.def(`<clipPath id="stc"><rect x="${X0 + 3}" y="${y + 2}" width="${fieldW - 6}" height="16"/></clipPath>`)
    svg.style(
      `.mq{animation:mq ${r(total)}s linear infinite}`,
      `@keyframes mq{0%,${r(p1)}%{transform:translateX(0)}${r(p2)}%{transform:translateX(${r(-out)}px)}${r(p2 + 0.01)}%{transform:translateX(${fieldW}px)}100%{transform:translateX(0)}}`,
    )
    o.push(`<g clip-path="url(#stc)">${svg.t(message, X0 + 6, y + 14.5, { s: 12.5, cls: 'mq', pre: true })}</g>`)
    if (hostW) {
      o.push(sunken(X0 + IW - hostW, y, hostW, 20))
      o.push(svg.t(PAGE.host, X0 + IW - hostW + 7, y + 14.5, { s: 12.5 }))
    }
    y += 20
  }

  const H = y + 4
  svg.h = H
  svg.add(
    // Cadre de fenêtre Windows 95 : quatre tons
    raised(0, 0, W, H, { fill: GRAY, hi: '#dfdfdf', lo: '#000000', t: 1 }),
    raised(1, 1, W - 2, H - 2, { fill: null, hi: '#ffffff', lo: '#808080', t: 1 }),
    ...o,
  )
  return svg.render({ label: `${PAGE.windowTitle} — ${PAGE.headline}` })
}
