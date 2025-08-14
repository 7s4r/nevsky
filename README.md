# nevsky

## Rappels et mode d'emploi rapide

Ce dépôt contient le site statique du projet ainsi qu'une suite de tests (unitaires, e2e, accessibilité, régression visuelle) et un workflow CI qui s'exécute sur chaque pull request.

### Prérequis

- Node.js et npm
- Installer les dépendances :

  ```bash
  npm install
  ```

- Installer les navigateurs Playwright (une seule fois) :

  ```bash
  npx playwright install --with-deps
  ```

### Démarrer un serveur statique (local)

Playwright et les tests visuels s'attendent à ce qu'un serveur serve les fichiers. Depuis la racine du projet :

```bash
npx http-server ./ -p 5500 -c-1 &
```

Si le port 5500 est déjà pris, changez le port ou définissez la variable d'environnement `BASE_URL` pour pointer vers votre serveur.

### Scripts utiles (dans package.json)

- `npm run test:unit` — exécute les tests unitaires (Vitest)
- `npm run test:e2e` — exécute les tests E2E (Playwright, projet mobile)
- `npm run test:visual` — compare les captures visuelles aux baselines (Playwright)
- `npm run visual:record` — enregistre/actualise les baselines visuelles
- `npm run lint` — eslint
- `npm run lint:css` — stylelint

### Enregistrement des baselines visuelles (workflow local)

1. Démarrer le serveur statique (voir ci‑dessus).
2. Lancer l'enregistrement des baselines :

   ```bash
   npm run visual:record
   # ou directement
   PLAYWRIGHT_UPDATE_BASELINE=1 npx playwright test tests/visual --project=desktop --config=tests/e2e/playwright.config.js
   ```

3. Les images de référence générées se trouvent sous `tests/visual/` (ou `tests/visual/baseline` selon la config). Pour les ajouter au dépôt :

   ```bash
   git checkout -b feature/e2e-tests
   git add tests/visual/**/*.png
   git commit -m "test(visual): add baseline screenshots"
   git push origin feature/e2e-tests
   ```

Cela permet à la CI de comparer automatiquement les captures lors des runs suivants.

### Exécuter les tests visuels en comparaison

Assurez-vous que le serveur est en route, puis :

```bash
npm run test:visual
# qui exécute :
# playwright test tests/visual --project=desktop --config=tests/e2e/playwright.config.js
```

### CI

Un workflow GitHub Actions (`.github/workflows/pr-tests.yml`) s'exécute sur chaque pull request pour lancer lint, tests unitaires, e2e, accessibilité et régression visuelle. Chaque job poste un commentaire sur la PR avec les résultats.

### Résolution de problèmes courants

- Erreur "No tests found" pour Playwright : vérifiez que les fichiers de tests sont dans `tests/visual` et que `tests/e2e/playwright.config.js` pointe vers le bon `testDir`.

- Port déjà utilisé (EADDRINUSE) : changez le port du serveur statique ou définissez `BASE_URL` pour que Playwright cible l'URL correcte :

  ```bash
  BASE_URL=http://localhost:8000 npm run test:visual
  ```

- Vitest tente d'exécuter des tests Playwright : utiliser `npm run test:unit` ou s'assurer que `vitest.config.js` inclut uniquement `tests/unit`.

Si vous souhaitez que j'enregistre et commette les captures baselines pour vous, dites-le et j'exécuterai la procédure (nécessite un serveur local disponible sur le port configuré ou un `BASE_URL` fourni).
