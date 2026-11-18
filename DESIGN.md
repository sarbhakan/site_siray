# Siray Signature — système visuel V6

Ce document décrit la façade présente dans le code. Les faits métier proviennent du texte et des visuels transmis par l’utilisateur ; ils sont structurés dans `src/data/site.ts` et confrontés aux sources dans `docs/qa/v4-content-source.md`. Les comptes rendus de vérification se trouvent dans `docs/qa/`.

## Direction

**Olive et ivoire, autour du logo Siray Signature.** La marque fournie remplace le nom composé en texte dans l’en-tête, le menu mobile et le footer. Les surfaces olive encadrent les photographies et la navigation ; le papier ivoire accueille les prestations, les saveurs et les tarifs. Le détail vient de la calligraphie du logo et des images, avec une interface calme autour du contenu.

Les tokens de `src/styles/global.css` définissent une palette commune : papier `#F5F1E8`, surface `#E9E4D7`, blanc ivoire `#FFFCF6`, encre `#303528`, texte secondaire `#626452` et bordures `#D4D3C4`. L’olive principal est `#4E533D`, sa variante `#424733` et ses bordures `#82866F`. Le texte sur olive reprend le papier `#F5F1E8`, avec un rôle secondaire `#E7E4D5`. Le focus utilise `#717746`, avec un anneau ivoire sur les surfaces olive. Les photographies conservent leurs couleurs naturelles.

Gloock 400 compose les titres principaux et de section ; Manrope 400 et 600 sert aux textes, aux prix et aux commandes. Certains noms de prestations et de brunch emploient également Gloock pour poursuivre la hiérarchie éditoriale. Les polices sont hébergées localement. Les sous-ensembles latin et latin étendu de Manrope couvrent notamment les caractères turcs des compositions. Les titres restent en casse normale, sans retours à la ligne imposés. Les icônes sont réservées aux fonctions qui en ont besoin, comme ouvrir ou fermer le menu mobile. La galerie n’affiche plus de commande de zoom.

## Logo fourni

Le logo transmis par l’utilisateur est conservé dans `public/brand/siray-signature.webp` : **1 215 × 1 231 px**, **116 354 octets**, soit environ **114 KiB**. Le composant `BrandMark.astro` affiche ce bitmap dans un SVG inline à fenêtre `viewBox="190 420 760 470"`. Ce cadrage retire les grandes marges de l’image. Un filtre SVG d’affichage dérive l’alpha de sa luminance pour isoler l’encre claire et laisser le fond du site visible : aucun rectangle de texture olive n’entoure la marque. Le bitmap original est conservé, sans calligraphie redessinée ni vectorisation inventée. Chaque emplacement possède un identifiant de filtre distinct.

Le composant mesure 152 px de large sur mobile et 166 px à partir de 960 px, en conservant le rapport du cadrage. Il est placé dans un lien nommé « Siray Signature, accueil ». Le SVG est décoratif pour les technologies d’assistance, car le nom accessible appartient au lien. La marque remplit donc aussi la fonction de retour à l’accueil demandée par l’utilisateur.

## Composition mobile

Le CSS part du téléphone, avec des marges de 20 px, réduites à 16 px sous 360 px. Les textes de lecture utilisent 16 px et un interligne de 1,625 ; les métadonnées restent plus compactes. Les tokens partagés fixent les titres principaux à 34 px sur mobile, 32 px sous 360 px et 56 px sur ordinateur. Les titres de section utilisent respectivement 28, 26 et 40 px. Les styles des fiches produit reprennent ces tokens pour éviter des tailles contradictoires entre pages.

Le premier écran réunit un titre court, la nature des prestations, Bordeaux/Gironde, l’action puis la photographie. Le hero reste en deux colonnes sur ordinateur, texte à gauche et images à droite. Le diaporama n’affiche aucun rail, nom de scène, durée ou bouton de lecture. Aucun texte ne couvre les photographies.

L’accueil présente **sept familles distinctes** dans une composition photographique ouverte, sous « La carte Siray ». « Pour célébrer » associe un grand layer cake, un duo bento/cupcakes et les mignardises dans un format horizontal ; « Pour se retrouver » associe un buffet en grand au brunch et aux plateaux. Chaque image et sa légende forment un lien unique, avec l’action « Découvrir » toujours soulignée. Les proportions et le placement varient sans cartes encadrées. Sur téléphone, les grandes images prennent la largeur et les duos restent sur deux colonnes. L’ancienne section Buffet répétée après la carte a été retirée. Le catalogue `/creations/` expose les sept prestations dans une grille d’une, deux puis trois colonnes selon la largeur ; il montre la présentation, le repère de prix ou de format et l’accès aux compositions détaillées.

La navigation s’organise autour de « Nos prestations », « Galerie », « La maison » et « Votre projet ». Sur ordinateur, un menu natif de prestations ouvre les sept liens et l’index complet. Le menu mobile affiche les sept familles directement, au lieu de les regrouper dans un lien buffet ou dans une catégorie mignardises/cupcakes.

Le footer commun reprend l’olive et le logo réel. Il rassemble une seule invitation « Votre projet gourmand », une action Instagram, Bordeaux/Gironde et six destinations utiles. La navigation forme deux colonnes sur téléphone, puis trois colonnes aux largeurs supérieures. Les cibles de navigation mesurent au moins 44 px et l’action Instagram 48 px. Les crédits tiennent dans un seul lien explicite « Crédits des images ».

## Les sept prestations

Les URL publiques sont distinctes et stables :

| Famille     | URL                       | Image provisoire |
| ----------- | ------------------------- | --------------------------- |
| Layer cakes | `/creations/layer-cakes/` | `layer-cake`                |
| Bento cakes | `/creations/bento-cakes/` | `bento-cake`                |
| Mignardises | `/creations/mignardises/` | `macarons-ivoire`           |
| Cupcakes    | `/creations/cupcakes/`    | `cupcakes`                  |
| Brunch box  | `/creations/brunch-box/`  | `brunch`                    |
| Buffets     | `/buffets/`               | `buffet-gourmand`           |
| Plateaux    | `/plateaux/`              | `plateau-sale`              |

`ProductDetail.astro` compose les sept fiches comme un espace de découverte : photographies à gauche sur ordinateur, panneau à volets à droite. À partir de 960 px, seule la composition photographique latérale est sticky, à 28 px du haut ; les onglets principaux et les familles de saveurs défilent avec la page. Sur téléphone, la composition photo est compacte et les boutons principaux bordés forment deux colonnes. Un seul volet est affiché après initialisation JavaScript. Les rubriques sont adaptées à chaque famille : formats et décor, tarifs, saveurs, Signature ou préparation de la demande. Le volet actif utilise l’olive plein, les autres conservent une bordure visible. Les tarifs restent de vrais tableaux HTML à chiffres tabulaires.

Les quinze saveurs classiques des layer et bento cakes se parcourent dans trois familles : Fruits, Chocolats et Notes gourmandes. Chaque famille associe une photographie thématique à la liste correspondante. Les onze saveurs propres aux cupcakes suivent la même composition visuelle, sans reprendre la liste des cakes : six dans Fruits, une dans Chocolats et quatre dans Notes gourmandes. Les boutons et panneaux sont reliés par les rôles et attributs ARIA ; les flèches, Home et End déplacent le choix au clavier. Les neuf associations Signature restent strictement réservées aux layer cakes et apparaissent directement dans une liste descriptive `<dl>`, sans accordéons.

Les dix brunch box disposent de compositions sucrées, salées et d’une boisson. Un sélecteur natif sur mobile ou dix boutons tarifés sur grand écran affichent une composition à la fois. Le menu distingue les trois catégories avec des titres et des espaces propres. Le nom, le prix et l’unité par personne figurent dans chaque choix et dans le menu affiché. Le résumé distingue neuf compositions à 30 € par personne et Anatolia à 35 € par personne. Les dix menus demeurent dans le HTML initial. Les modalités et informations nécessaires à la demande sont propres à chaque prestation.

Les notes pratiques utilisent toute la largeur disponible et un texte court. Le mélange de saveurs et les quantités supplémentaires sur devis sont mis en évidence. « Sur commande · Viandes halal » accompagne le bouton Instagram ; la mention complète et les précautions sur les allergies restent dans les informations de demande. Les retours à la ligne naturels restent possibles sur les écrans étroits.

Les prix, quantités et compositions viennent des documents fournis : minimum de dix parts pour les layer cakes, cinq formats de cupcakes, six paliers de mignardises, cinq plateaux, brunch à 30 € par personne sauf Anatolia à 35 €, et tarifs personnalisés en message privé pour les cakes ou sur devis pour les buffets. Les écarts typographiques entre texte et visuels sont consignés dans le rapport de source ; le texte collé est retenu comme référence en cas d’écart.

Les informations transverses sont présentes dans les fiches et les pages utiles : créations sur commande, demandes sur Instagram, toutes les viandes halal, allergies et intolérances à signaler avant validation. Aucune certification halal, capacité de plateau, absence d’allergène, livraison, délai ou modalité de paiement non fourni n’est inventé.

## Mouvement et commandes

Le hero passe automatiquement d’une scène à l’autre toutes les **6 500 ms**, avec un fondu GSAP de **850 ms**. La surface photographique est un bouton natif sans chrome : un toucher, un clic ou son activation au clavier suspend les changements ; une nouvelle activation les reprend. Son nom accessible décrit l’action disponible et `aria-pressed` indique la pause choisie. Il n’existe plus de sélection de scène ni de commande distincte sous l’image.

Le survol et le focus ne modifient pas la lecture. Les changements se suspendent lorsque la photo quitte la vue ou que l’onglet devient inactif. La préférence `prefers-reduced-motion` conserve une photo statique sans fondu et désactive le bouton photographique. Les transitions CSS sont également réduites. Le décodage d’une image est vérifié avant le fondu, avec invalidation des opérations obsolètes lors d’un changement d’état.

Les filtres de la galerie mettent à jour les photos visibles, leur décompte et l’état sélectionné. Les images ne sont plus cliquables : ni zoom, ni bouton plus, ni visionneuse. Le menu mobile utilise un dialogue natif. Le module `product-explorer.ts` renforce progressivement les volets principaux et les familles de saveurs : rôles tablist/tab/tabpanel, sélection unique, tabindex itinérant, flèches/Home/End et sélecteur brunch synchronisé. Les écouteurs sont nettoyés avant les transitions Astro puis réinitialisés sur la nouvelle page. Sans JavaScript, les commandes de volets et de sélection restent cachées, et tous les contenus sont déroulés. À l’impression, les contenus masqués sont réaffichés. Le fondu des volets est désactivé en mouvement réduit. Les liens, images et contenus principaux sont accessibles dans le HTML ; sans initialisation du diaporama, la première photo reste affichée et sa surface est désactivée.

## Contenus à compléter

Les photos des réalisations réelles restent à fournir. Les WebP provisoires sont locaux, sous licences Unsplash et Pexels, avec variantes responsives, dimensions et points focaux dans `docs/image-credits.json`. Les bento cakes ont désormais une image principale `bento-cake` et une image de demande `bento-detail` ; les panneaux de saveurs utilisent aussi les nouveaux visuels `chocolat` et `notes-gourmandes`. Le premier bento est recadré techniquement sur le gâteau et les mains, sans visage. Ces images restent des substituts à remplacer par les photographies autorisées de Siray. Les crédits sont accessibles depuis le footer, sans légende de provenance répétée dans les fiches ou la galerie. Aucune de ces images n’est présentée comme une réalisation Siray Signature.

Les informations légales complètes de l’entreprise et de l’hébergeur restent à renseigner avant le lancement commercial. Les demandes et la confirmation des commandes passent par [@siraysignature sur Instagram](https://www.instagram.com/siraysignature/).

## Sources de conception et vérification

La reprise s’appuie sur [Unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop), par **Damir Sokolovsky**, sous **CC BY 4.0**, installé localement dans `~/.codex/skills/unslop/`. Ses passes guident le rythme, la palette issue du logo, la réduction des ornements, la copie et le mouvement. Taste complète la hiérarchie des pages et les textes ; Impeccable complète le responsive, les états, l’accessibilité et la critique. Les sources du Dev Toolkit restent dans `.dev-toolkit/vendor` et leur utilisation est consignée dans `docs/toolkit-report.json`.

Ce document décrit l’implémentation ; il ne constitue pas un verdict de contrôle du rendu. Les audits V1 à V3 restent historiques. Les rapports V4 et V5 restent historiques. Les rapports V6 de `docs/qa/` distinguent la confrontation des données, les contrôles de source et les observations du navigateur ; ce document n’anticipe pas leurs résultats.
