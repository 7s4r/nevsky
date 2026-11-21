# nevsky

Site de l’église orthodoxe russe Saint-Alexandre-Nevsky de Pau — https://nevsky.fr
(site statique publié par GitHub Pages).

## Mettre à jour les horaires des offices

Modifier **`js/offices.js`** (offices réguliers, offices ponctuels, annulations).
Le mode d’emploi est en tête du fichier. Les offices apparaissent automatiquement
dans le calendrier de l’accueil, la liste « Prochains offices » et le fichier agenda.
Aucune autre étape n’est nécessaire.

Le calendrier liturgique (Pâques, fêtes, jeûnes, samedis des défunts) est calculé
automatiquement par `js/calendar.js`.

## Modifier la page d’accueil

- Le texte français est dans `index.html`, les traductions dans `js/locales.js`.
- Les pages d’accueil russe et anglaise (`ru.html`, `en.html`) sont **générées** :
  après toute modification de `index.html`, de `js/locales.js` ou de `data/lectures.mjs`, lancer

  ```bash
  npm run build:home
  ```

  puis committer `ru.html` et `en.html`.

## Ajouter une lecture spirituelle à l’accueil

La liste des lectures est dans **`data/lectures.mjs`** (date de publication,
image, titre, description et lien en français, russe et anglais). L’accueil
affiche automatiquement les 6 plus récentes (`HOME_COUNT`). Après une
modification, lancer `npm run build:home` puis committer `index.html`,
`ru.html` et `en.html`.

Images des cartes : format paysage 16:10 (idéalement 1200×750), en `.webp`,
dans `images/`.

## Fichiers minifiés

Après une modification du CSS ou du JavaScript :

```bash
npm run minify:css
npm run minify:js
npx terser js/locales.js -o js/locales.min.js --compress --mangle
npx terser js/calendar.js -o js/calendar.min.js --compress --mangle
```
