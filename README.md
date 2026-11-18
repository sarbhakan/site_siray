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
- Galerie filtrable, avec images non cliquables et décompte des photographies visibles.
- La maison, contact et questions fréquentes.
- Crédits des images, informations et page 404.

La V6 conserve le logo fourni par le client et sa palette olive et ivoire. Son encre claire est isolée à l’affichage pour retirer le rectangle de fond. Les sept familles disposent chacune d’un lien, d’une page et d’un visuel distincts. L’accueil alterne grandes photos, duos et compositions ouvertes. À partir de 960 px, seule la composition photographique latérale des fiches reste fixée pendant le défilement ; les onglets et leurs contenus suivent normalement la page.

Les saveurs des layer cakes, bento cakes et cupcakes se parcourent par familles Fruits, Chocolats et Notes gourmandes : chaque choix affiche son image thématique et sa liste. Les commandes sont utilisables au clavier et leurs états sont reliés aux panneaux par ARIA. Les neuf associations Signature, réservées aux layer cakes, sont lisibles directement. Les brunchs disposent d’un sélecteur affichant le nom et le prix par personne, puis d’une composition structurée en sucré, salé et boisson. Tous les contenus restent accessibles sans JavaScript. La mise en page et la hiérarchie typographique sont pensées pour les visites mobiles depuis Instagram ; le système visuel courant est décrit dans `DESIGN.md`.

Le catalogue comprend les tarifs des cupcakes, mignardises, plateaux et brunch box, quinze saveurs classiques de cakes, neuf associations Signature pour les layer cakes, onze saveurs de cupcakes et les dix compositions de brunch fournies. Les détails de personnalisation et les informations à transmettre sur Instagram figurent dans les pages concernées. Le référentiel des sources et des écarts entre texte et visuels est dans `docs/qa/v4-content-source.md`.

Le diaporama démarre automatiquement : une scène toutes les 6,5 secondes, avec un fondu de 850 ms. Il ne présente ni rail, ni nom de scène, ni durée, ni bouton visible. La photo elle-même est un bouton natif sans chrome : un toucher, un clic ou une activation au clavier suspend les changements automatiques ; une nouvelle activation les reprend. Le nom accessible du bouton indique cette action. Le survol et le focus, y compris sur l'action voisine, ne suspendent pas la lecture. Celle-ci se suspend lorsque la photo sort de la vue ou que l'onglet devient inactif. Avec la préférence système de mouvement réduit, la photo reste statique et sa surface est désactivée. Sans JavaScript, la première photo reste visible.

Un footer global olive rassemble le logo fourni, un seul appel Instagram, Bordeaux/Gironde, six liens de navigation et les crédits photo. Les cibles interactives mesurent au moins 44 px. Le bloc d'invitation séparé qui précédait le footer a été retiré : chaque page dispose d'une seule conclusion commune.

Les données des collections et de la galerie se trouvent dans `src/data/site.ts`. Les textes des autres pages sont dans `src/pages/`. Le layout, les composants communs et les tokens CSS sont regroupés dans `src/layouts/`, `src/components/` et `src/styles/global.css`.

## Remplacer les photos

La façade emploie des **photographies provisoires sous licences Unsplash et Pexels**. Elles ne sont pas attribuées aux réalisations de Siray Signature. Le lien « Crédits des images » donne accès à leur provenance ; aucune légende de provenance n’est imposée dans les parcours. Le registre `docs/image-credits.json` conserve les sources, auteurs et licences, et `docs/images.md` décrit les cadrages. Les bento cakes utilisent désormais `bento-cake` pour leur image principale et `bento-detail` pour préparer la demande. Ces visuels, comme ceux des autres familles et des saveurs, restent à remplacer par les photographies autorisées de Siray. Le logo fourni appartient à l’identité de Siray Signature et est distinct de ces photographies.

1. Fournir les photographies autorisées de la maison.
2. Les décliner en WebP à plusieurs tailles, puis renseigner les dimensions et points focaux dans le manifeste d'images.
3. Remplacer les noms d'images et textes alternatifs dans les données ou pages concernées.
4. Mettre à jour le registre et les crédits publics pour refléter les photographies réellement utilisées, leurs auteurs et leurs droits.

Les prix, quantités, saveurs et compositions fournis sont intégrés. Les tarifs des layer et bento cakes sont communiqués en message privé ; les buffets sont sur devis. Les créations sont réalisées sur commande et toutes les viandes sont halal, selon la mention du client, sans certification fournie. Les allergies et intolérances doivent être signalées avant validation. Les photographies réelles, délais, coordonnées, conditions commerciales non communiquées et informations légales complètes de l'entreprise et de l'hébergeur restent à renseigner avant le lancement commercial.

## Déployer sur Netlify

Le dépôt peut être relié directement à un site Netlify :

1. Dans Netlify, importer le dépôt GitHub `sarbhakan/site_siray`.
2. Choisir la branche contenant la version à publier.
3. Laisser le dossier de base vide ; `netlify.toml` configure `npm run build`, le dossier `dist` et Node 24.
4. Choisir le nom disponible pour l'adresse `nom-choisi.netlify.app`. Les chemins `/creations/.../`, `/galerie/` et `/contact/` sont de vraies pages statiques.

Netlify fournit la variable `URL` utilisée pour les URL canoniques et le partage social. Pour un autre hébergeur, définir `URL` pendant la compilation avec l'adresse finale du site, puis publier `dist/`. Un domaine personnel peut être raccordé plus tard ; son achat n'est pas inclus dans l'hébergement gratuit.

Le projet ne dépend d'aucune fonction Netlify. Le même export peut être déplacé sur un hébergeur de fichiers statiques compatible. La connexion à un compte Netlify reste à effectuer. Une fois le dépôt relié, Netlify pourra publier automatiquement les changements de la branche choisie.

## Qualité et toolkit

Les faits du projet figurent dans `PRODUCT.md` et le système visuel actuel dans `DESIGN.md`. Les pistes de reprise sont dans `docs/v2-directions.md`. Les rapports V6 de `docs/qa/` consignent les résultats de contrôle avec leur périmètre. Les rapports des versions antérieures restent historiques ; la présence d’un outil ou d’une règle dans le code ne constitue pas un verdict de test.

Les neuf dépôts du Dev Toolkit Orchestrator sont préparés dans le cache local `.dev-toolkit/vendor`, exclu de Git et du déploiement. La reprise visuelle suit Unslop, complété par Taste pour la hiérarchie et la copie, et Impeccable pour les états, le responsive et la critique. Hallmark reste disponible dans le toolkit. Le bilan des sources et de leur utilisation est dans `docs/toolkit-report.json`.

[Unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop), créé par **Damir Sokolovsky**, est distribué sous **CC BY 4.0**. Le skill est installé localement dans `~/.codex/skills/unslop/`. Ses consignes ont guidé la réduction du bruit visuel, la palette cohérente, les titres compacts et le mouvement lié aux photographies.

Les polices Gloock et Manrope sont distribuées sous SIL Open Font License ; leurs licences sont conservées dans `public/licenses/`.
