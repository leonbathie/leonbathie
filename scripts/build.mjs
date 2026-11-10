/**
 * Génère les images de la page de profil (assets/) et le README.md.
 *
 *   node scripts/build.mjs            tout régénérer
 *   node scripts/build.mjs netscape   seulement les fichiers dont le nom contient « netscape »
 *
 * Aucune dépendance : Node 20 ou plus suffit. Le contenu se modifie dans
 * scripts/content.mjs ; ce script ne fait que le mettre en forme.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { blogUrl, FIGURES, SOFTWARE } from './content.mjs'
import { iconDataUri } from './lib/png.mjs'
import { buildHeader } from './parts/header.mjs'
import { buildNetscape } from './parts/netscape.mjs'
import { buildOutro } from './parts/outro.mjs'
import { buildReadme } from './parts/readme.mjs'
import { buildFigure, buildLabel, buildNew } from './parts/small.mjs'
import { buildTaskbar } from './parts/taskbar.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const only = process.argv[2]

const dataUri = async (file, mime) => `data:${mime};base64,${(await readFile(path.join(ROOT, 'scripts', 'src', file))).toString('base64')}`

let total = 0
async function emit(rel, content) {
  if (only && !rel.includes(only)) return
  const file = path.join(ROOT, rel)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, content)
  total += Buffer.byteLength(content)
  console.log(`  ${rel.padEnd(36)} ${(Buffer.byteLength(content) / 1024).toFixed(1).padStart(7)} Ko`)
}

const photoUri = await dataUri('banner.webp', 'image/webp')
const avatarUri = await dataUri('avatar.jpg', 'image/jpeg')
const satelliteUri = iconDataUri('satellite', 2)

console.log('Images :')
for (const mobile of [false, true]) {
  const suffix = mobile ? '-mobile' : ''
  await emit(`assets/header${suffix}.svg`, await buildHeader({ photoUri, mobile }))
  await emit(`assets/netscape${suffix}.svg`, await buildNetscape({ avatarUri, satelliteUri, mobile }))
  await emit(`assets/outro${suffix}.svg`, await buildOutro({ mobile }))
}

// Barre des tâches : une image par lien
const keyboard = SOFTWARE[0].items[0] // Tappirgal Pulaar, derrière l'indicateur de clavier « Ff »
const slices = await buildTaskbar({
  start: { href: blogUrl(), title: 'Start — open LeonTechLab' },
  tray: { href: keyboard.url, title: `Ff — the ${keyboard.name} keyboard on ${keyboard.where}` },
})
for (const s of slices) {
  await emit(`assets/taskbar/${s.id}.svg`, s.wide)
  await emit(`assets/taskbar/${s.id}-mobile.svg`, s.square)
}

// Intertitres et étiquette « NEW! »
const labels = {
  notes: await buildLabel('Latest Notes'),
  figures: await buildLabel('Key Figures'),
  software: await buildLabel('Software'),
  links: await buildLabel('Links'),
}
for (const [id, label] of Object.entries(labels)) await emit(`assets/label-${id}.svg`, label.svg)
const badge = await buildNew()
await emit('assets/new.svg', badge.svg)

// Chiffres clés : un compteur à diodes par chiffre
const figures = []
for (const [i, figure] of FIGURES.entries()) {
  const built = await buildFigure(figure)
  figures.push({ ...built, file: `assets/figure-${i + 1}.svg` })
  await emit(`assets/figure-${i + 1}.svg`, built.svg)
}

console.log('Page :')
await emit('README.md', buildReadme({ slices, labels, badge, figures }))
console.log(`Total : ${(total / 1024).toFixed(0)} Ko`)
