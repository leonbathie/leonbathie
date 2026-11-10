/**
 * Le README.md du profil.
 *
 * GitHub n'accepte dans un README ni CSS ni script : la mise en forme passe
 * donc par des images (assets/), et le reste par le peu de HTML autorisé —
 * tableaux, <kbd>, <samp>, alignements. Chaque grande image existe en deux
 * versions ; <picture> sert la version « téléphone » sous 640 px de large.
 */
import { BANNER, blogUrl, ERAS, NOTES, PAGE, SITE, SOFTWARE } from '../content.mjs'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const MOBILE = '(max-width: 640px)'

/** Grande image, avec sa variante pour téléphone */
const picture = (name, alt) =>
  `<picture><source media="${MOBILE}" srcset="${SITE.raw}assets/${name}-mobile.svg"><img src="assets/${name}.svg" width="100%" alt="${esc(alt)}"></picture>`

const link = (href, title, inner) => `<a href="${esc(href)}" title="${esc(title)}">${inner}</a>`

export function buildReadme({ slices, labels, badge, figures }) {
  const home = blogUrl()
  const label = (id, href, title) => {
    const l = labels[id]
    return `${link(href, title, `<img src="assets/label-${id}.svg" width="${l.w}" height="${l.h}" alt="${esc(l.alt)}">`)}`
  }

  /* ---------- Textes de remplacement des images ---------- */
  const headerAlt =
    `${BANNER.title} — ${BANNER.sub}. ${BANNER.tag}. ` +
    `The Web, era by era: ${ERAS.map((e) => `${e.years.replace(/\s/g, '')} ${e.name}`).join(', ')}.`
  const windowAlt =
    `A Netscape Navigator window on Windows 95, showing the LeonTechLab home page. ${PAGE.headline} ${PAGE.intro} ` +
    `Research interests: ${PAGE.interests.join('; ')}. ${PAGE.bestViewed}.`
  const outroAlt =
    'The same page in six other eras — Web 2.0, Mobile & Cloud, Generative AI, AR/VR & Robotics, AGI & Space, 2050 — ' +
    'followed by the footer: the evolution of LeonTechLab, from the first Web page (1991) to the 2050 horizon.'

  /* ---------- Barre des tâches : tranches accolées, sans aucun espace entre elles ---------- */
  const taskbar = slices
    .map((s) => {
      const img =
        `<picture><source media="${MOBILE}" srcset="${SITE.raw}assets/taskbar/${s.id}-mobile.svg">` +
        `<img src="assets/taskbar/${s.id}.svg" width="${s.pct}%" alt="${esc(s.label)}"></picture>`
      return link(s.href, s.title, img)
    })
    .join('')

  /* ---------- Corps de la page ---------- */
  const notes = NOTES.map((n, i) => {
    const url = blogUrl(`recherche/${n.slug}`)
    const isNew = i === 0 ? ` <a href="${esc(url)}"><img src="assets/new.svg" width="${badge.w}" height="${badge.h}" alt="NEW!"></a>` : ''
    return `<li><a href="${esc(url)}">${esc(n.title)}</a> (${n.date})${isNew}</li>`
  }).join('\n')

  // Chiffres clés : des compteurs à diodes, côte à côte (ils passent à la ligne sur téléphone)
  const about = blogUrl('parcours')
  const counters = figures.map((f) => link(about, f.alt, `<img src="${f.file}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}">`)).join('\n')

  // Logiciels : deux colonnes seulement, pour rester lisible sur téléphone
  const software = SOFTWARE.map((group) => {
    const rows = group.items
      .map((p) => {
        const href = p.repo ? `${SITE.github}/${p.repo}` : p.url
        const name = href ? `<a href="${esc(href)}"><b>${esc(p.name)}</b></a>` : `<b>${esc(p.name)}</b>`
        const access = p.repo ? 'public' : p.url ? `<a href="${esc(p.url)}">${esc(p.where)}</a>` : 'private'
        return `<tr><td>${name}<br><sub>${esc(p.lang)} · ${access}</sub></td><td>${esc(p.desc)}</td></tr>`
      })
      .join('\n')
    return `<tr><th colspan="2" align="left">${esc(group.group)}</th></tr>\n${rows}`
  }).join('\n')

  const buttons = [
    ['Blog', home],
    ['Notes', blogUrl('recherche')],
    ['Lab', blogUrl('labo/glitch')],
    ['Projects', blogUrl('projets')],
    ['About', blogUrl('parcours')],
    ['Software', `${SITE.github}?tab=repositories`],
    ['LinkedIn', SITE.linkedin],
    ['E-mail', `mailto:${SITE.email}`],
  ]
    .map(([text, href]) => `<a href="${esc(href)}"><kbd>&nbsp;${text}&nbsp;</kbd></a>`)
    .join('\n')

  return `<!--
  Page générée par scripts/build.mjs — ne pas la modifier à la main :
  changer scripts/content.mjs, puis lancer « node scripts/build.mjs ».
-->

<p align="center">
${link(home, 'LeonTechLab — the research blog of Ousmane BA', picture('header', headerAlt))}
</p>

<p align="center">
${link(home, 'Open the page in the time machine: 1991 → 2050', picture('netscape', windowAlt))}<br>
${taskbar}
</p>

${label('notes', blogUrl('recherche'), 'All the notes')}

<samp>
<ul>
${notes}
</ul>
</samp>

${label('figures', blogUrl('parcours'), 'About — career and key figures')}

<p align="center">
${counters}
</p>

${label('software', `${SITE.github}?tab=repositories`, 'All the repositories')}

<samp>
<table>
${software}
</table>
</samp>

${label('links', home, 'LeonTechLab')}

<p>
${buttons}
</p>

<p align="center">
${link(home, 'The same page, from 1991 to 2050', picture('outro', outroAlt))}
</p>
`
}
