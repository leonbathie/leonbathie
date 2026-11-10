/**
 * Aperçu local de la page de profil, telle que GitHub l'affichera.
 *
 *   node scripts/preview.mjs
 *
 * Le README passe par l'API de rendu de GitHub (le même filtrage du HTML que sur
 * le site), puis s'affiche dans une colonne de profil avec la feuille de style
 * de GitHub. Deux fichiers sont écrits dans scripts/.cache/ : thème clair et
 * thème sombre. Pour voir la version téléphone, réduire la fenêtre sous 640 px.
 *
 * Nécessite la commande `gh`, connectée au compte GitHub.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SITE } from './content.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'scripts', '.cache')
mkdirSync(OUT, { recursive: true })

const input = path.join(OUT, 'preview-input.json')
writeFileSync(input, JSON.stringify({ mode: 'gfm', context: `${SITE.user}/${SITE.user}`, text: readFileSync(path.join(ROOT, 'README.md'), 'utf8') }))
const html = execFileSync('gh', ['api', 'markdown', '--input', input], { encoding: 'utf8', maxBuffer: 1 << 26 })
  // Les variantes pour téléphone pointent vers raw.githubusercontent.com : ici, on lit les fichiers du dépôt.
  .replaceAll(SITE.raw, '')

for (const theme of ['light', 'dark']) {
  const dark = theme === 'dark'
  const file = path.join(OUT, `preview-${theme}.html`)
  writeFileSync(
    file,
    `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aperçu du profil (${theme})</title>
<base href="${pathToFileURL(ROOT).href}/">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-${theme}.min.css">
<style>
  html, body { margin: 0; background: ${dark ? '#0d1117' : '#ffffff'}; }
  /* La colonne du README d'un profil : 846 px de contenu sur grand écran */
  .box { box-sizing: border-box; max-width: 896px; margin: 16px auto; padding: 24px; border: 1px solid ${dark ? '#3d444d' : '#d1d9e0'}; border-radius: 6px; }
  @media (max-width: 767px) { .box { margin: 8px; padding: 16px; } }
</style>
<div class="box"><article class="markdown-body">${html}</article></div>
</html>
`,
  )
  console.log(`Aperçu ${theme.padEnd(5)} : ${file}`)
}
