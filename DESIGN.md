# Siray Signature — système visuel V4

Ce document décrit la façade présente dans le code. Les faits métier proviennent du texte et des visuels transmis par l’utilisateur ; ils sont structurés dans `src/data/site.ts` et confrontés aux sources dans `docs/qa/v4-content-source.md`. Les comptes rendus de vérification se trouvent dans `docs/qa/`.

## Direction

**Olive et ivoire, autour du logo Siray Signature.** La marque fournie remplace le nom composé en texte dans l’en-tête, le menu mobile et le footer. Les surfaces olive encadrent les photographies et la navigation ; le papier ivoire accueille les prestations, les saveurs et les tarifs. Le détail vient de la calligraphie du logo et des images, avec une interface calme autour du contenu.

Les tokens de `src/styles/global.css` définissent une palette commune : papier `#F5F1E8`, surface `#E9E4D7`, blanc ivoire `#FFFCF6`, encre `#303528`, texte secondaire `#626452` et bordures `#D4D3C4`. L’olive principal est `#4E533D`, sa variante `#424733` et ses bordures `#82866F`. Le texte sur olive reprend le papier `#F5F1E8`, avec un rôle secondaire `#E7E4D5`. Le focus utilise `#717746`, avec un anneau ivoire sur les surfaces olive. Les photographies conservent leurs couleurs naturelles.

Gloock 400 compose les titres principaux et de section ; Manrope 400 et 600 sert aux textes, aux prix et aux commandes. Certains noms de prestations et de brunch emploient également Gloock pour poursuivre la hiérarchie éditoriale. Les polices sont hébergées localement. Les sous-ensembles latin et latin étendu de Manrope couvrent notamment les caractères turcs des compositions. Les titres restent en casse normale, sans retours à la ligne imposés. Les icônes sont réservées aux fonctions qui en ont besoin, comme fermer, parcourir une photographie ou ouvrir une composition.

## Logo fourni

Le logo transmis par l’utilisateur est conservé dans `public/brand/siray-signature.webp` : **1 215 × 1 231 px**, **116 354 octets**, soit environ **114 KiB**. Le composant `BrandMark.astro` affiche ce bitmap dans un SVG inline à fenêtre `viewBox="190 420 760 470"`. Ce cadrage retire les grandes marges de l’image dans l’interface sans redessiner, vectoriser ni remplacer la calligraphie et la texture fournies.

Le composant mesure 136 px de large sur mobile et 152 px à partir de 960 px, en conservant le rapport du cadrage. Il est placé dans un lien nommé « Siray Signature, accueil ». Le SVG est décoratif pour les technologies d’assistance, car le nom accessible appartient au lien. La marque remplit donc aussi la fonction de retour à l’accueil demandée par l’utilisateur.

## Composition mobile

Le CSS part du téléphone, avec des marges de 20 px, réduites à 16 px sous 360 px. Les textes de lecture utilisent 16 px et un interligne de 1,625 ; les métadonnées restent plus compactes. Les tokens partagés fixent les titres principaux à 34 px sur mobile, 32 px sous 360 px et 56 px sur ordinateur. Les titres de section utilisent respectivement 28, 26 et 40 px. Les styles des fiches produit reprennent ces tokens pour éviter des tailles contradictoires entre pages.

Le premier écran réunit un titre court, la nature des prestations, Bordeaux/Gironde, l’action puis la photographie. Le hero reste en deux colonnes sur ordinateur, texte à gauche et images à droite. Le diaporama n’affiche aucun rail, nom de scène, durée ou bouton de lecture. Aucun texte ne couvre les photographies.

L’accueil présente **sept familles distinctes** dans une grille visible : deux colonnes sur téléphone, trois à partir de 600 px, quatre à partir de 960 px et sept à partir de 1 200 px. Sur téléphone, la dernière famille, les plateaux, occupe la largeur complète. Chaque entrée dispose de son image et de son lien. Le catalogue `/creations/` expose les sept prestations dans une grille d’une, deux puis trois colonnes selon la largeur ; il montre la présentation, le repère de prix ou de format et l’accès aux compositions détaillées.

La navigation s’organise autour de « Nos prestations », « Galerie », « La maison » et « Votre projet ». Sur ordinateur, un menu natif de prestations ouvre les sept liens et l’index complet. Le menu mobile affiche les sept familles directement, au lieu de les regrouper dans un lien buffet ou dans une catégorie mignardises/cupcakes.

Le footer commun reprend l’olive et le logo réel. Il rassemble une seule invitation « Votre projet gourmand », une action Instagram, Bordeaux/Gironde et six destinations utiles. La navigation forme deux colonnes sur téléphone, puis trois colonnes aux largeurs supérieures. Les cibles de navigation mesurent au moins 44 px et l’action Instagram 48 px. Les crédits tiennent dans un seul lien explicite « Photographies d’ambiance & crédits ».

## Les sept prestations

Les URL publiques sont distinctes et stables :

| Famille     | URL                       | Image d’ambiance provisoire |
| ----------- | ------------------------- | --------------------------- |
| Layer cakes | `/creations/layer-cakes/` | `layer-cake`                |
| Bento cakes | `/creations/bento-cakes/` | `gateau-creme`              |
| Mignardises | `/creations/mignardises/` | `macarons-ivoire`           |
| Cupcakes    | `/creations/cupcakes/`    | `cupcakes`                  |
| Brunch box  | `/creations/brunch-box/`  | `brunch`                    |
| Buffets     | `/buffets/`               | `buffet-gourmand`           |
| Plateaux    | `/plateaux/`              | `plateau-sale`              |

`ProductDetail.astro` compose les sept fiches à partir des données métier, sans mêler les familles. Les tarifs sont de vrais tableaux HTML à chiffres tabulaires. Les quinze saveurs classiques sont groupées et proposées aux layer cakes et aux bento cakes. Les neuf associations Signature sont réservées aux layer cakes. Les onze saveurs de cupcakes restent dans leur page. Les dix brunch box disposent de compositions sucrées, salées et d’une boisson, présentées dans des détails natifs ; la première composition est ouverte par défaut. Les modalités et informations nécessaires à la demande sont propres à chaque prestation.

Les prix, quantités et compositions viennent des documents fournis : minimum de dix parts pour les layer cakes, cinq formats de cupcakes, six paliers de mignardises, cinq plateaux, brunch à 30 € par personne sauf Anatolia à 35 €, et tarifs personnalisés en message privé pour les cakes ou sur devis pour les buffets. Les écarts typographiques entre texte et visuels sont consignés dans le rapport de source ; le texte collé est retenu comme référence en cas d’écart.

Les informations transverses sont présentes dans les fiches et les pages utiles : créations sur commande, demandes sur Instagram, toutes les viandes halal, allergies et intolérances à signaler avant validation. Aucune certification halal, capacité de plateau, absence d’allergène, livraison, délai ou modalité de paiement non fourni n’est inventé.

## Mouvement et commandes

Le hero passe automatiquement d’une scène à l’autre toutes les **6 500 ms**, avec un fondu GSAP de **850 ms**. La surface photographique est un bouton natif sans chrome : un toucher, un clic ou son activation au clavier suspend les changements ; une nouvelle activation les reprend. Son nom accessible décrit l’action disponible et `aria-pressed` indique la pause choisie. Il n’existe plus de sélection de scène ni de commande distincte sous l’image.

Le survol et le focus ne modifient pas la lecture. Les changements se suspendent lorsque la photo quitte la vue ou que l’onglet devient inactif. La préférence `prefers-reduced-motion` conserve une photo statique sans fondu et désactive le bouton photographique. Les transitions CSS sont également réduites. Le décodage d’une image est vérifié avant le fondu, avec invalidation des opérations obsolètes lors d’un changement d’état.

Les filtres de la galerie mettent à jour les photos visibles et leur décompte. La visionneuse utilise un dialogue natif, conserve la famille filtrée, accepte le clavier et le balayage, puis rend le focus au lien d’origine. Le menu mobile utilise aussi un dialogue natif. Les compositions de brunch restent utilisables sans JavaScript. Les liens, images et contenus principaux sont accessibles dans le HTML ; sans initialisation du diaporama, la première photo reste affichée et sa surface est désactivée.

## Contenus à compléter

Les photos des réalisations réelles restent à fournir. Les WebP actuels sont des photographies d’ambiance locales, avec variantes responsives, dimensions et points focaux dans `docs/image-credits.json`. Les sept familles disposent d’images provisoires distinctes ; la photographie du bento est une illustration de gâteau à la crème, qui devra être remplacée par un véritable bento cake. Les crédits restent accessibles depuis le footer et aucune de ces images n’est présentée comme une réalisation Siray Signature.

Les informations légales complètes de l’entreprise et de l’hébergeur restent à renseigner avant le lancement commercial. Les demandes et la confirmation des commandes passent par [@siraysignature sur Instagram](https://www.instagram.com/siraysignature/).

## Sources de conception et vérification

La reprise s’appuie sur [Unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop), par **Damir Sokolovsky**, sous **CC BY 4.0**, installé localement dans `~/.codex/skills/unslop/`. Ses passes guident le rythme, la palette issue du logo, la réduction des ornements, la copie et le mouvement. Taste complète la hiérarchie des pages et les textes ; Impeccable complète le responsive, les états, l’accessibilité et la critique. Les sources du Dev Toolkit restent dans `.dev-toolkit/vendor` et leur utilisation est consignée dans `docs/toolkit-report.json`.

Ce document décrit l’implémentation ; il ne constitue pas un verdict de contrôle du rendu. Les audits V1 à V3 restent historiques. Les rapports V4 dans `docs/qa/` distinguent la confrontation des données, les contrôles de source et les observations du navigateur.
