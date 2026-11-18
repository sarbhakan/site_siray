# Siray Signature

Vitrine française multipage de pâtisserie et de buffets à Bordeaux et en Gironde. Les demandes et commandes passent par [@siraysignature sur Instagram](https://www.instagram.com/siraysignature/).

## Démarrer

Node.js 24 LTS recommandé. Aucune clé API, base de données ou variable secrète n'est nécessaire.

```sh
npm ci
npm run dev
```

Ouvrir l'adresse locale affichée. Pour vérifier et générer la version de production :

```sh
npm run build
python3 scripts/check-site.py
npm run preview
```

Astro génère les pages dans `dist/`. GSAP anime uniquement les changements de photographies ; les autres interactions reposent sur le navigateur et du TypeScript. Les polices et images sont locales. Le contenu principal et la navigation restent accessibles sans JavaScript.

Sur macOS, si le projet se trouve dans un dossier Documents synchronisé et que `npm run build` reste bloqué sans message, vérifier que les fichiers sont bien téléchargés. Des dépendances marquées `dataless` peuvent bloquer leur simple lecture. Dans Finder, « Télécharger maintenant » ou « Conserver le téléchargement » permet de les conserver localement ; une autre solution consiste à travailler dans un dossier local non synchronisé et à y réinstaller les dépendances avec `npm ci`. Ne pas modifier les paquets JavaScript pour contourner un blocage de lecture. Voir la [note technique Apple sur les fichiers dataless](https://developer.apple.com/documentation/technotes/tn3150-getting-ready-for-data-less-files).

## Pages et contenu

- Accueil avec diaporama manuel et lecture facultative.
- Index des créations et quatre pages : layer cakes, bento cakes, mignardises/cupcakes, brunch box.
- Buffets et réceptions, avec plateaux sucrés et salés.
- Carnet filtrable et visionneuse accessible.
- La maison, contact et questions fréquentes.
- Crédits/informations et page404.

Les données des collections et du carnet se trouvent dans `src/data/site.ts`. Les textes des autres pages sont dans `src/pages/`. Le layout, les composants communs et les tokens CSS sont regroupés dans `src/layouts/`, `src/components/` et `src/styles/global.css`.

## Remplacer les photos

La V1 emploie des **photographies d'ambiance Unsplash**, jamais présentées comme les réalisations de Siray Signature. Provenance et licence : `docs/image-credits.json`. Aide aux cadrages : `docs/images.md`.

1. Fournir les photographies autorisées de la maison.
2. Les décliner en WebP à plusieurs tailles, puis renseigner les dimensions et points focaux dans le manifeste d'images.
3. Remplacer les noms d'images et textes alternatifs dans les données ou pages concernées.
4. Mettre à jour les mentions d'ambiance seulement pour les photographies réellement remplacées, ainsi que les crédits publics.

Les prix, saveurs précises, quantités, délais, coordonnées et conditions commerciales seront ajoutés après validation. Aucune de ces données n'a été inventée. Les informations légales complètes de l'entreprise et de l'hébergeur restent à renseigner avant le lancement commercial.

## Déployer sur Netlify

Le dépôt peut être relié directement à un site Netlify :

1. Dans Netlify, importer le dépôt GitHub `sarbhakan/site_siray`.
2. Choisir la branche contenant la version à publier.
3. Laisser le dossier de base vide ; `netlify.toml` configure `npm run build`, le dossier `dist` et Node24.
4. Choisir le nom disponible pour l'adresse `nom-choisi.netlify.app`. Les chemins `/creations/.../`, `/galerie/` et `/contact/` sont de vraies pages statiques.

Netlify fournit la variable `URL` utilisée pour les URL canoniques et le partage social. Pour un autre hébergeur, définir `URL` pendant la compilation avec l'adresse finale du site, puis publier `dist/`. Un domaine personnel peut être raccordé plus tard ; son achat n'est pas inclus dans l'hébergement gratuit.

Le projet ne dépend d'aucune fonction Netlify. Le même export peut être déplacé sur un hébergeur de fichiers statiques compatible. La connexion à un compte Netlify reste à effectuer. Une fois le dépôt relié, Netlify pourra publier automatiquement les changements de la branche choisie.

## Qualité et toolkit

Les orientations et faits du projet figurent dans `PRODUCT.md`, `DESIGN.md` et `docs/art-direction.md`. La revue indépendante et les résultats des contrôles sont dans `docs/qa/`.

Les neuf dépôts du Dev Toolkit Orchestrator sont préparés dans le cache local `.dev-toolkit/vendor`, exclu de Git et du déploiement. Hallmark a guidé la composition ; Taste, la hiérarchie, les images et les textes ; Impeccable, les états, l'accessibilité et les contrôles. Les autres modules sont activés selon leur pertinence. Les checkouts seuls ne constituent pas une exécution de leurs outils.

Les polices Gloock et Manrope sont distribuées sous SIL Open Font License; leurs licences sont conservées dans `public/licenses/`.
