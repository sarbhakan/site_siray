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

- Accueil avec défilement photographique automatique, sans rail ni commandes affichées.
- Index des sept familles et cinq pages de créations : layer cakes, bento cakes, mignardises, cupcakes et brunch box.
- Buffets et plateaux sur deux pages distinctes, avec leurs compositions et modalités propres.
- Galerie de 26 photographies fournies, filtrable par famille, avec images non cliquables et décompte des photographies visibles.
- La maison, contact et questions fréquentes.
- Crédits des images, informations et page 404.

La V8 conserve le logo fourni par le client et sa palette olive et ivoire, et intègre les photographies de ses réalisations. L’encre claire du logo est isolée à l’affichage pour retirer le rectangle de fond. Les sept familles disposent chacune d’un lien, d’une page et d’un visuel distincts. L’accueil alterne grandes photos, duos et compositions ouvertes. À partir de 960 px, seule la composition photographique latérale des fiches reste fixée pendant le défilement ; les onglets et leurs contenus suivent normalement la page.

Les saveurs des layer cakes, bento cakes et cupcakes se parcourent par familles Fruits, Chocolats et Notes gourmandes : chaque choix affiche son image thématique et sa liste. Les commandes sont utilisables au clavier et leurs états sont reliés aux panneaux par ARIA. Les neuf associations Signature, réservées aux layer cakes, sont lisibles directement. Les brunchs disposent d’un sélecteur affichant le nom et le prix par personne, puis d’une composition structurée en sucré, salé et boisson. Tous les contenus restent accessibles sans JavaScript. La mise en page et la hiérarchie typographique sont pensées pour les visites mobiles depuis Instagram ; le système visuel courant est décrit dans `DESIGN.md`.

Le catalogue comprend les tarifs des cupcakes, mignardises, plateaux et brunch box, quinze saveurs classiques de cakes, neuf associations Signature pour les layer cakes, onze saveurs de cupcakes et les dix compositions de brunch fournies. Sur la page Plateaux, `PlatterChoices.astro` présente cinq lignes ouvrantes natives : chaque nom et son prix restent visibles, puis la description fournie se découvre à l’ouverture, sans dépendre de JavaScript. Sur la page Buffets, `BuffetService.astro` expose quatre étapes : installation avant l’événement, présentation et décoration, personnalisation, puis retrait du matériel. Le devis personnalisé et les informations utiles à sa préparation disposent d’un volet propre. Les détails de personnalisation et de demande des autres familles sont conservés.

Les sources initiales et leurs écarts figurent dans `docs/qa/v4-content-source.md`. La mise à jour V7 des plateaux et du service buffet est consignée dans `docs/qa/v7-content-source.md` : la sauce ail et fines herbes des crudités remplace la mention antérieure d’aïoli.

Le diaporama démarre automatiquement : une scène toutes les 6,5 secondes, avec un fondu de 850 ms. Il ne présente ni rail, ni nom de scène, ni durée, ni bouton visible. La photo elle-même est un bouton natif sans chrome : un toucher, un clic ou une activation au clavier suspend les changements automatiques ; une nouvelle activation les reprend. Le nom accessible du bouton indique cette action. Le survol et le focus, y compris sur l'action voisine, ne suspendent pas la lecture. Celle-ci se suspend lorsque la photo sort de la vue ou que l'onglet devient inactif. Avec la préférence système de mouvement réduit, la photo reste statique et sa surface est désactivée. Sans JavaScript, la première photo reste visible.

Les phrases d’aide courtes utilisent la largeur de leur colonne, avec des retours naturels sur téléphone et sans réduire le corps de lecture de 16 px. L’action Instagram des fiches et le groupe « Sur commande · Viandes halal » / « Allergies & intolérances » partagent un alignement centré sur leur axe commun.

Le footer olive est compact : une invitation et son action Instagram, six liens, puis une ligne d’identité réunissant le petit logo, Bordeaux/Gironde et les crédits. Le logo mesure 88 px sur téléphone et 96 px à partir de 600 px. Les liens se répartissent naturellement sur plusieurs lignes sur mobile et forment une rangée horizontale à partir de 960 px ; leurs cibles mesurent au moins 44 px, et l’action Instagram 48 px. Le bloc d’invitation séparé qui précédait le footer reste retiré : chaque page dispose d’une seule conclusion commune.

Les données des collections et de la galerie se trouvent dans `src/data/site.ts`. Les textes des autres pages sont dans `src/pages/`. Le layout, les composants communs et les tokens CSS sont regroupés dans `src/layouts/`, `src/components/` et `src/styles/global.css`.

## Photographies V8

**26 photographies ont été sélectionnées parmi les 44 fournies pour Siray Signature**, sur les sept catégories. Elles illustrent les prestations et composent la galerie de 26 réalisations. Les images attendues pour cette passe ont donc été reçues ; les photographies réelles ne constituent plus un contenu en attente.

Quatre illustrations stock restent utilisées : les trois photographies d’ingrédients des familles Fruits, Chocolats et Notes gourmandes, et une photographie de cupcakes conservée sur l’accueil à titre d’exception. Elles ne sont pas attribuées aux réalisations Siray. Les fiches et la galerie emploient les photographies fournies correspondant à leurs catégories, notamment de vrais bento cakes.

Seules les variantes WebP optimisées sont destinées au dossier public et aux archives de déploiement. Les originaux fournis restent intacts, hors de `public/`. Le registre `docs/image-credits.json` distingue les photographies client des illustrations licenciées et conserve la provenance, les dimensions et les variantes ; `docs/images.md` décrit la sélection et les cadrages. Le lien « Crédits des images » donne accès à la provenance, sans légende répétée dans les parcours. Le logo fourni demeure une ressource de marque distincte.

Pour une mise à jour photographique, conserver la correspondance entre famille et image, préparer les variantes optimisées, puis mettre à jour les données, textes alternatifs et crédits. Les fichiers retirés ne doivent pas rester dans les archives publiques.

Les prix, quantités, saveurs et compositions fournis sont intégrés. Les tarifs des layer et bento cakes sont communiqués en message privé ; les buffets sont sur devis. Les créations sont réalisées sur commande et toutes les viandes sont halal, selon la mention du client, sans certification fournie. Les allergies et intolérances doivent être signalées avant validation. Les délais, coordonnées, conditions commerciales non communiquées et informations légales complètes de l'entreprise et de l'hébergeur restent à renseigner avant le lancement commercial.

## Préparer le déploiement

Deux archives sont préparées pour **Netlify** et **Cloudflare Pages** ; aucun site public n’est encore publié dans le cadre de cette livraison. Le [guide de déploiement](docs/deployment.md) détaille les étapes, les offres gratuites et leurs limites vérifiées le 19 novembre 2026. Netlify attend le dossier extrait du ZIP ; Cloudflare Direct Upload accepte directement le ZIP. Les deux contiennent `index.html` à la racine et les en-têtes de `public/_headers`. Le guide, le manifeste et les sommes SHA-256 restent séparés des fichiers publiés.

Après compilation et contrôle de `dist/`, recréer la livraison avec :

```sh
python3 scripts/package-release.py --dist dist --output-dir releases --version v8
```

Le script n’exécute pas de build et ne déploie rien. Il vérifie la structure, les limites du dépôt manuel Cloudflare et l’absence d’URL localhost dans le HTML. Une fois l’adresse publique attribuée, définir `SITE_URL` à la compilation puis passer la même origine à `--site-url` pour la vérifier. La priorité est `SITE_URL`, puis `URL` fourni par Netlify, puis `CF_PAGES_URL` fourni par Cloudflare. Aucun domaine n’est supposé disponible. Un domaine personnel peut être raccordé plus tard ; son achat et son renouvellement ne sont pas inclus dans l’hébergement gratuit.

Pour les futures publications automatiques, relier `sarbhakan/site_siray` au compte choisi, avec la branche de production `main`, `npm run build`, `dist` et Node 24. `netlify.toml` fournit ces réglages Netlify ; Cloudflare demande notamment `NODE_VERSION=24`. Choisir le mode Git dès la création d’un projet Pages si c’est le fonctionnement souhaité : un projet Direct Upload ne se convertit pas ensuite en intégration Git. Le projet n’utilise aucune fonction propre à un hébergeur et son export reste portable. Un push sur GitHub ne publie rien tant qu’aucune intégration n’est activée.

## Qualité et toolkit

Les faits du projet figurent dans `PRODUCT.md` et le système visuel actuel dans `DESIGN.md`. Les pistes de reprise sont dans `docs/v2-directions.md`. Les documents V8 de `docs/qa/` consignent la sélection photographique, sa préparation et la recherche d’hébergement. Les contrôles finaux de cette intégration doivent être consignés séparément lorsqu’ils sont exécutés ; cette documentation ne les anticipe pas. Les rapports V1 à V7 décrivent les versions précédentes. Une note d’implémentation, une archive préparée ou la présence d’une règle dans le code ne constitue pas un verdict de test ni une preuve de publication.

Les neuf dépôts du Dev Toolkit Orchestrator sont préparés dans le cache local `.dev-toolkit/vendor`, exclu de Git et du déploiement. La reprise visuelle suit Unslop, complété par Taste pour la hiérarchie et la copie, et Impeccable pour les états, le responsive et la critique. Hallmark reste disponible dans le toolkit. Le bilan des sources et de leur utilisation est dans `docs/toolkit-report.json`.

[Unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop), créé par **Damir Sokolovsky**, est distribué sous **CC BY 4.0**. Le skill est installé localement dans `~/.codex/skills/unslop/`. Ses consignes ont guidé la réduction du bruit visuel, la palette cohérente, les titres compacts et le mouvement lié aux photographies.

Les polices Gloock et Manrope sont distribuées sous SIL Open Font License ; leurs licences sont conservées dans `public/licenses/`.
