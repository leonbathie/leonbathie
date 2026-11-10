/**
 * Polices des images.
 *
 * Une image SVG affichée par <img> (c'est le cas sur GitHub) ne peut charger
 * aucune ressource extérieure : les polices qui ne sont pas des polices système
 * sont donc incorporées dans le fichier, en base64.
 *
 * Pour rester léger, on ne demande à Google Fonts que les caractères réellement
 * utilisés (paramètre `text=`). Les fichiers reçus sont gardés dans
 * scripts/.cache/fonts/ : une seconde génération ne retélécharge rien.
 * Hors ligne et sans cache, l'image retombe sur les polices de secours.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CACHE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.cache', 'fonts')
// Google Fonts ne sert du WOFF2 qu'à un navigateur récent.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

/**
 * `google` : famille Google Fonts à incorporer sous le nom `alias`.
 * `stack`  : pile CSS complète (l'alias d'abord, puis les polices de secours).
 * Les polices système (Arial, Times New Roman, Courier New…) ne sont pas incorporées.
 */
export const FONTS = {
  pixel: { google: 'Press Start 2P', alias: 'ltl-pixel', stack: "'ltl-pixel','Press Start 2P','Courier New',monospace" },
  plex: { google: 'IBM Plex Mono', alias: 'ltl-plex', stack: "'ltl-plex','IBM Plex Mono','Courier New',monospace" },
  inter: { google: 'Inter', alias: 'ltl-inter', stack: "'ltl-inter',Inter,'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif" },
  orb: { google: 'Orbitron', alias: 'ltl-orb', stack: "'ltl-orb',Orbitron,'Arial Black',Arial,sans-serif" },
  share: { google: 'Share Tech Mono', alias: 'ltl-share', stack: "'ltl-share','Share Tech Mono',Consolas,'Courier New',monospace" },
  silk: { google: 'Silkscreen', alias: 'ltl-silk', stack: "'ltl-silk',Silkscreen,'Courier New',monospace" },
  arial: { stack: "Arial,'Liberation Sans',Helvetica,sans-serif" },
  times: { stack: "'Times New Roman','Liberation Serif',Times,serif" },
  courier: { stack: "'Courier New','Liberation Mono',Courier,monospace" },
  verdana: { stack: "Verdana,'DejaVu Sans',Geneva,sans-serif" },
  trebuchet: { stack: "'Trebuchet MS','Fira Sans',Verdana,sans-serif" },
}

/** Familles qui n'existent qu'en un seul poids : pas d'axe `wght` dans la requête */
const SINGLE_WEIGHT = new Set(['Press Start 2P', 'Share Tech Mono'])

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}
async function fetchBase64(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return Buffer.from(await res.arrayBuffer()).toString('base64')
}

/** Sous-ensemble d'une famille : [{ weight, style, format, b64 }] */
async function subset(family, weights, text) {
  const key = createHash('sha1').update(`${family}|${weights.join(',')}|${text}`).digest('hex')
  const file = path.join(CACHE, `${key}.json`)
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    /* pas encore en cache */
  }

  const axis = SINGLE_WEIGHT.has(family) ? '' : `:wght@${weights.join(';')}`
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}${axis}&text=${encodeURIComponent(text)}`
  const css = await fetchText(url)

  // Une police variable revient avec la même adresse pour chaque poids : on la regroupe.
  const byUrl = new Map()
  for (const [, block] of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
    const src = /url\(([^)]+)\)\s*format\('([^']+)'\)/.exec(block)
    if (!src) continue
    const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1] ?? 400)
    const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? 'normal'
    const id = `${src[1]}|${style}`
    const face = byUrl.get(id) ?? { url: src[1], format: src[2], style, weights: [] }
    face.weights.push(weight)
    byUrl.set(id, face)
  }
  if (!byUrl.size) throw new Error(`réponse inattendue de Google Fonts pour ${family}`)

  const faces = []
  for (const face of byUrl.values()) {
    const min = Math.min(...face.weights)
    const max = Math.max(...face.weights)
    faces.push({ weight: min === max ? String(min) : `${min} ${max}`, style: face.style, format: face.format, b64: await fetchBase64(face.url) })
  }
  await mkdir(CACHE, { recursive: true })
  await writeFile(file, JSON.stringify(faces))
  return faces
}

/**
 * CSS @font-face des polices incorporées d'une image.
 * `used` : Map(nom → { weights: Set, chars: Set }) tenue par lib/svg.mjs.
 */
export async function embedFonts(used) {
  let css = ''
  for (const [name, { weights, chars }] of used) {
    const font = FONTS[name]
    if (!font?.google) continue
    const text = [...chars].sort().join('')
    if (!text.trim()) continue
    try {
      const faces = await subset(font.google, [...weights].sort((a, b) => a - b), text)
      for (const f of faces) {
        css += `@font-face{font-family:'${font.alias}';font-style:${f.style};font-weight:${f.weight};src:url(data:font/${f.format};base64,${f.b64}) format('${f.format}')}`
      }
    } catch (err) {
      console.warn(`  ! police « ${font.google} » non incorporée (${err.message}) : police de secours utilisée`)
    }
  }
  return css
}
