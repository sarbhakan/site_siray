# Siray Signature — système visuel V3

Ce document décrit la façade présente dans le code. Les faits métier sont dans `PRODUCT.md` ; les comptes rendus de vérification se trouvent dans `docs/qa/`.

## Direction

**Cerise noire et crème.** Un cadre sombre accueille des photographies sans superposition ; les pages de contenu retrouvent une surface claire. Les créations portent la couleur et le détail. La navigation, les liens et les contrôles restent sobres.

Les tokens de `src/styles/global.css` définissent la palette : fond crème `#f4ede6`, surface `#eae0d7`, blanc `#fff9f2`, encre et cerise noire `#2b101b`, texte secondaire `#715e64`. Sur fond sombre, le texte principal reprend le crème et le texte secondaire utilise `#cdb8be`. Les bordures suivent ces deux familles de surfaces. Les photographies conservent leurs couleurs naturelles.

Manrope sert aux titres, au texte et à l’interface, en graisses 400 et 600. Gloock 400 est réservé au nom de la marque. Les deux familles sont hébergées localement. Les titres restent en casse normale, sans retours à la ligne imposés. Les icônes sont réservées aux fonctions qui en ont besoin, notamment fermer et parcourir la visionneuse.

## Composition mobile

Le CSS part du téléphone : en-tête de 68 px, marges latérales de 20 px et paragraphes de 16 px avec un interligne de 1,6. Le titre du hero utilise 34 px ; les titres de page utilisent 36 px et les titres de section 28 px. Les espacements regroupent titres, textes et actions, puis séparent les sections de 40 à 48 px. Les valeurs se réduisent sous 360 px et augmentent aux seuils de 600 et 960 px.

Le premier écran présente un titre court, la nature des créations et Bordeaux/Gironde, puis l’action et la photographie. Le diaporama n’affiche aucun rail, nom de scène, indicateur de durée ou bouton de lecture. Aucun titre, crédit ou contrôle ne couvre l’image.

Les cinq familles de l’accueil forment une rangée horizontale à défilement natif, avec points d’arrêt et un aperçu de la carte suivante. Chaque carte ouvre une vraie page. À partir de 960 px, elles occupent une grille de cinq colonnes. Le hero devient une composition en deux colonnes, texte à gauche et photos à droite. Les alignements de contenu suivent une largeur de référence de 1 360 px.

Le bento cake utilise un panneau typographique cerise noire dans l’accueil, l’index et sa page dédiée. Ce choix évite d’attribuer à ce format une photographie de gâteau qui ne le représente pas. Une photographie réelle pourra remplacer le panneau.

Le composant global `Footer.astro` forme une seule clôture sur fond crème clair `#fff9f2`. Il réunit « Votre projet gourmand », une action Instagram, une signature mesurée, Bordeaux/Gironde et quatre destinations utiles. Sur téléphone, les liens forment une grille de deux colonnes ; sur ordinateur, le contact et la navigation se déploient horizontalement. Les cibles atteignent au moins 44 px, et l’action Instagram 48 px. Les crédits tiennent dans un seul lien explicite « Photographies d’ambiance & crédits ». Le bloc `Invitation` qui précédait le footer a été supprimé pour éviter deux appels identiques à la suite.

## Mouvement et commandes

Le hero passe automatiquement d’une scène à l’autre toutes les **6 500 ms**, avec un fondu GSAP de **850 ms**. La surface photographique est un bouton natif sans chrome : un toucher, un clic ou son activation au clavier suspend les changements automatiques ; une nouvelle activation les reprend. Son nom accessible décrit l’action disponible et `aria-pressed` indique la pause choisie. Il n’existe plus de sélection manuelle d’une scène ni de commande distincte sous l’image.

Le survol et le focus ne modifient pas la lecture, que le pointeur ou le clavier parcourent la photo ou l’action voisine. Le défilement automatique se suspend lorsque la photo quitte la vue ou que l’onglet devient inactif ; il reprend lorsque ces conditions le permettent, sauf si l’utilisateur l’a suspendu. La préférence `prefers-reduced-motion` conserve une photo statique, sans fondu, et désactive le bouton photographique. Les transitions CSS sont également réduites.

Les filtres du carnet mettent à jour les photos visibles et leur décompte. La visionneuse utilise un dialogue natif, conserve la famille filtrée, accepte le clavier et le balayage, puis rend le focus au lien d’origine. Le menu mobile utilise aussi un dialogue natif. Les liens et images restent accessibles dans le HTML sans JavaScript ; sans initialisation du diaporama, la première photo reste affichée et sa surface est désactivée.

## Pages et contenu

Les URL existantes sont conservées : accueil, index des créations, quatre pages de collection, buffets, galerie, maison, contact, crédits et page 404. Les textes secondaires nomment les formats et les possibilités sans prix, délai, saveur précise ou témoignage inventé. Le lien de contact reste [@siraysignature sur Instagram](https://www.instagram.com/siraysignature/).

Les images WebP sont locales, avec variantes responsives, dimensions et points focaux dans `docs/image-credits.json`. Ce sont des photographies d’ambiance licenciées ; leur provenance est indiquée au pied de page et dans les crédits. Elles ne sont pas présentées comme des réalisations de Siray Signature. Les photos de la maison, les détails commerciaux et les informations légales restent à fournir avant le lancement commercial.

## Sources de conception

La reprise s’appuie sur [Unslop](https://github.com/heydamir/unslop/tree/main/skills/unslop), par **Damir Sokolovsky**, sous **CC BY 4.0**, installé localement dans `~/.codex/skills/unslop/`. Ses passes ont guidé le rythme, la palette, la suppression des ornements, la copie et le mouvement. Taste complète la hiérarchie et les textes ; Impeccable complète le responsive, les états et la critique. Les sources du Dev Toolkit restent dans `.dev-toolkit/vendor` et leur utilisation est consignée dans `docs/toolkit-report.json`.
