# Fabrication de la page de profil

Ce dépôt est le dépôt spécial `leonbathie/leonbathie` : GitHub affiche son
`README.md` en haut du profil <https://github.com/leonbathie>.

La page reprend la forme « Évolution » du blog (bandeau, frise des époques,
page de 1996 dans Netscape Navigator). Or un README GitHub n'accepte ni CSS ni
script : tout le style passe donc par des images SVG, fabriquées par un script.

## Modifier la page

1. Changer le contenu dans [`content.mjs`](content.mjs) : textes, liens,
   articles, logiciels, chiffres clés, compteur de dépôts.
2. Régénérer : `node scripts/build.mjs` (Node 20 ou plus, aucune dépendance).
3. Regarder le résultat : `node scripts/preview.mjs` écrit deux aperçus
   (thème clair, thème sombre) dans `scripts/.cache/`.
4. Valider et pousser sur `main`.

Ne modifier à la main ni `README.md` ni `assets/` : le script les réécrit.

## Mise en ligne

Il n'y a ni serveur ni workflow : GitHub affiche le `README.md` de la branche
`main` tel qu'il est dans le dépôt. Pousser un commit suffit, la page change
dans la minute.

## Ce que fabrique le script

| Fichier | Image | Contenu |
| --- | --- | --- |
| `parts/header.mjs` | `assets/header.svg` | Bandeau photo, titre, frise des sept époques |
| `parts/netscape.mjs` | `assets/netscape.svg` | La page de 1996 dans sa fenêtre Netscape |
| `parts/taskbar.mjs` | `assets/taskbar/*.svg` | Barre des tâches Windows 95 : une image par lien |
| `parts/small.mjs` | `assets/label-*.svg`, `figure-*.svg`, `new.svg` | Intertitres, compteurs à diodes, étiquette « NEW! » |
| `parts/outro.mjs` | `assets/outro.svg` | Vignettes des autres époques, pied de page, boutons 88 × 31 |
| `parts/readme.mjs` | `README.md` | La page elle-même |

Les grandes images existent en deux versions : `nom.svg` pour un écran large
et `nom-mobile.svg` pour un téléphone. Le README choisit avec `<picture>`.

## À savoir

- **Un lien = une image.** Une image de README ne peut pas avoir plusieurs
  zones cliquables. La barre des tâches est donc découpée en tranches posées
  côte à côte ; leurs largeurs sont en pourcentage pour tenir sur une ligne.
- **Adresses absolues.** Les versions téléphone sont appelées par leur adresse
  complète (`SITE.raw` dans `content.mjs`). Si la branche ou le dépôt change de
  nom, corriger cette adresse.
- **Polices.** Une image SVG ne peut rien charger de l'extérieur : les polices
  qui ne sont pas sur tous les appareils (Press Start 2P, IBM Plex Mono, Inter,
  Orbitron, Share Tech Mono, Silkscreen, toutes sous licence SIL OFL) sont
  incorporées dans les fichiers, réduites aux caractères utilisés. Le script
  les demande à Google Fonts et les garde dans `scripts/.cache/`.
- **Compteur de dépôts.** Le nombre affiché dans la barre latérale est
  `SITE.publicRepos`, à tenir à jour à la main.
- **Sources.** `src/banner.webp` vient du blog, `src/avatar.jpg` est l'avatar
  du compte, `lib/pixel.mjs` et `lib/icons.mjs` sont les dessins en pixel art
  du blog (dossier `src/themes/leontechlab/`).
