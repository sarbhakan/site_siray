# V8 — Revue ciblée des cadrages générés

Revue indépendante du 19 novembre 2026, effectuée sur les **26 WebP principaux** `public/images/siray-*.webp`, sans les variantes `-360` et `-720`. Les sources, dimensions, recadrages et points focaux ont été lus dans `docs/image-credits.json`.

Deux planches temporaires ont été composées dans `[temporary-crop-review]/` avec Sharp local : `cakes-4x5.jpg` et `tables-4x5.jpg`. Chaque tuile applique un cadre **4:5** et le `focalPoint` du manifeste, selon le calcul de découpe `object-fit: cover` / `object-position`. Les 26 tuiles ont été examinées avec `view_image`. Les WebP `bento-vert` et `buffet-desserts` ont également été ouverts séparément ; le bento vert a été comparé à sa source originale `bento cakes/7.jpeg`.

Il s’agit d’une inspection de fichiers et de simulations de cadres, **pas d’une validation dans le navigateur**. Aucun asset du site, source, état Git ou build n’a été modifié par cette revue. Le seul fichier du projet écrit est ce rapport.

## Défaut initial corrigé

**`bento-vert` — nouvelle version `/images/siray-bento-vert-e1768ae9.webp`**

La première version `/images/siray-bento-vert-cf139593.webp` utilisait un recadrage (`left: 0, top: 608, width: 1152, height: 1440`) qui coupait le haut des fleurs roses tout en conservant beaucoup de fond uni dans la moitié basse. Le défaut était présent dans le WebP lui-même et ne pouvait pas être corrigé par le seul `focalPoint`.

Le principal a régénéré la photo avec **`top: 280`**, une fenêtre toujours de 1152 × 1440 px et une nouvelle empreinte **`e1768ae9`**. Le nouveau WebP a été ouvert séparément avec `view_image` : **les fleurs, le bord supérieur, le corps du gâteau et le support sont entiers**, avec une marge de fond autour. Le manifeste indique désormais `50% 50%`. Le défaut est résolu dans le fichier principal inspecté ; cette seconde inspection ne revendique pas une vérification séparée des deux petites variantes.

## Buffet desserts

**`buffet-desserts` — `/images/siray-buffet-desserts-7f108c7a.webp`**

Le WebP généré retire 420 px en haut de l’original et conserve 1152 × 1628 px ; le cadre 4:5 à `50% 60%` retire encore une petite bande verticale. Les deux groupes de desserts et les présentoirs restent lisibles et entiers dans la simulation. Le bouquet est coupé en partie en haut, mais reste un élément de contexte ; la coupe ne supprime aucun dessert principal. **Aucune correction nécessaire pour ce rôle de détail gourmand.** Cette vue n’a pas vocation à montrer le bouquet entier ni l’installation complète, qui sont servis par d’autres photos.

## Autres fichiers

Aucun autre cadrage manifestement raté n’a été relevé dans les 24 autres tuiles 4:5 : les gâteaux et leurs bases principales restent identifiables, les brunch box montrent bien leur contenu après retrait du couvercle vide, et les grands buffets conservent les niveaux et les préparations. Les points focaux des plateaux font passer la composition avant le logo imprimé du couvercle.

Pour `plateau-fruits`, le passage du 3:4 source au 4:5 effleure les extrémités haute et basse des compositions ; les deux plateaux restent compréhensibles. Cette limite déjà prévue dans la revue de sélection n’est pas un échec de carte 4:5. Un cadre 3:4 reste le choix adapté lorsqu’il faut montrer leurs contours entiers.

Les photographies de mains gantées conservent le produit tenu, sans coupe qui rende le sujet ambigu. La présence de cette main appartient à la prise de vue ; ce n’est pas un défaut de cadrage créé par la préparation technique.

## Périmètre des 26 vues

- Layer cakes : `layer-fruits`, `layer-rouge`, `layer-etages`, `layer-roses`, `layer-coquillages`, `layer-fleurs`.
- Bento cakes : `bento-rubans`, `bento-vert`, `bento-coffrets`, `bento-fleurs`.
- Cupcakes : `cupcakes-fleurs`, `cupcake-presentoir`, `cupcakes-coffret`.
- Mignardises : `mignardises-toasts`, `mignardises-assortiment`, `mignardises-burger`.
- Brunch box : `brunch-toasts`, `brunch-douceurs`, `brunch-partage`.
- Buffets : `buffet-ensemble`, `buffet-desserts`, `buffet-sale`.
- Plateaux : `plateau-grazing`, `plateau-fruits`, `plateau-fromages`, `plateau-charcuterie`.

La première passe se limite aux cadres 4:5. Les proportions du hero sont examinées dans le complément ci-dessous. Aucune passe ne porte sur la hiérarchie des pages ou sur les interactions, et aucune nouvelle direction artistique n’est proposée.

## Seconde passe — cinq candidats du hero

Les fichiers `layer-roses`, `bento-fleurs`, `brunch-partage`, `buffet-sale` et `plateau-charcuterie` ont été ouverts séparément, puis simulés dans deux cadres : **1,1:1 sur mobile** et **1,4:1 sur bureau**. La planche temporaire `[temporary-crop-review]/hero-proposed.jpg`, également inspectée avec `view_image`, montre les dix cadrages proposés. Elle utilise `object-fit: cover`, un axe horizontal de 50% et les positions verticales ci-dessous.

| Image et fichier | Y mobile 1,1 | Y bureau 1,4 | Résultat visuel |
|---|---:|---:|---|
| `layer-roses` — `/images/siray-layer-roses-c9c83e71.webp` | **40%** | **40%** | Le bouquet posé sur le gâteau et la base sont entiers ; une marge reste au-dessus des roses. Le `70%` du manifeste de carte ne convient pas au hero bureau, car il couperait les fleurs supérieures. |
| `bento-fleurs` — `/images/siray-bento-fleurs-eb9ef548.webp` | **40%** | **40%** | Les fleurs supérieures, le gâteau et sa base restent entiers. Des pétales posés sur le tissu sont des éléments de contexte ; la limite du cadre peut les couper. |
| `brunch-partage` — `/images/siray-brunch-partage-cd04c047.webp` | **60%** | **60%** | Bon équilibre entre tartines, fruits et charcuterie. Le cadre bureau est un détail de l’assortiment : une partie des boissons arrière et du fruit au bord inférieur sort du cadre, sans ambiguïté sur le sujet. |
| `buffet-sale` — `/images/siray-buffet-sale-f3950b25.webp` | **60%** | **80%** | Le mobile préserve la rangée arrière et les contenants du premier plan ; le bureau privilégie la rangée centrale et les contenants, tous entiers. La rangée très arrière sort presque entièrement du cadre bureau et le haut du luminaire est coupé, ce qui reste acceptable pour ce détail. |
| `plateau-charcuterie` — `/images/siray-plateau-charcuterie-b8691918.webp` | **85%** | **85%** | Le cadre privilégie les formes roulées du premier plan, qui restent entières. L’extrémité arrière du plateau est hors champ ; cette photo fonctionne comme détail de composition, pas comme inventaire exhaustif. |

Avec une propriété `position` unique par photo, les quatre valeurs communes sont directement utilisables sous la forme `50% 40%`, `50% 60%` ou `50% 85%`. Le buffet bénéficie d’une valeur propre au mobile (`50% 60%`) et d’une autre au bureau (`50% 80%`). S’il faut conserver une seule valeur `50% 80%` pour lui, le mobile coupera davantage la rangée arrière : la différence de rôle doit être assumée et vérifiée dans le navigateur.

**Les deux gâteaux peuvent être montrés entiers aux deux proportions testées.** Une box entière, les trois niveaux du buffet et tout le plateau de charcuterie ne peuvent pas tenir intégralement dans un cadre 1,4:1 en `cover` à partir de ces fichiers portrait. Le résultat validé ici est la lisibilité de leurs détails principaux. Aucune valeur d’`object-position` ne peut supprimer cette contrainte géométrique.

Les valeurs du hero sont donc propres à ce rôle et ne doivent pas remplacer automatiquement les points focaux des cartes 4:5. La seconde passe ne modifie ni le code du hero ni les assets ; l’intégration et le contrôle du vrai cadre du site appartiennent au principal.

## Dernière passe — sept captures mobiles réelles du navigateur

Les sept captures `docs/qa/v8-*-mobile.jpg` ci-dessous, **produites dans le navigateur par le principal**, ont été ouvertes individuellement avec `view_image`. Cette passe examine leur rendu réel enregistré, après le passage de l’image principale des fiches au **4:5 sur mobile**. Je n’ai pas piloté de navigateur ni réalisé de contrôle d’interactions ; ce constat ne valide donc pas le clavier, les volets, le défilement complet ou les pages hors du cadre photographié.

| Capture inspectée | Constat sur le cadrage et les chevauchements |
|---|---|
| `v8-layer-cakes-mobile.jpg` | Le gâteau, son décor fruité et son support restent entiers. La photo secondaire se place au coin inférieur droit sans masquer le produit principal ni toucher les boutons. |
| `v8-bento-cakes-mobile.jpg` | Le bento principal, ses fruits, ses rubans et son plateau sont entiers. Le bento vert secondaire conserve son décor après correction. Aucun chevauchement avec les textes ou les onglets. |
| `v8-mignardises-mobile.jpg` | Le premier plan gourmand reste net et immédiatement lisible ; la vue est un détail d’assortiment assumé. L’encart secondaire ne gêne ni l’introduction ni les commandes de volets. |
| `v8-cupcakes-mobile.jpg` | Les six cupcakes du présentoir principal sont visibles et entiers. L’encart avec le cupcake seul occupe son emplacement prévu, sans masquer les cupcakes principaux. |
| `v8-brunch-box-mobile.jpg` | Le contenu de la box domine le cadre ; le couvercle ne prend plus la moitié de l’image. Les deux lignes de prix restent distinctes et lisibles au-dessus. L’encart secondaire ne touche pas les commandes. |
| `v8-buffets-mobile.jpg` | Les différents niveaux, les préparations et le bouquet restent lisibles dans la vue d’ensemble. L’encart dessert assume une vue de détail ; aucun contenu d’interface n’est recouvert. |
| `v8-plateaux-mobile.jpg` | La composition principale et son premier plan restent lisibles, avec le logo du couvercle relégué au contexte. Les deux plateaux de fruits sont reconnaissables dans l’encart. Aucun texte, tarif ou bouton n’est masqué. |

**Aucun défaut concret de cadrage ou de chevauchement empêchant la livraison n’a été relevé dans ces sept captures.** Le débordement des encarts secondaires sur le coin de l’image principale appartient à la composition prévue ; il ne provoque pas de collision avec les introductions, prix ou commandes visibles. Ce résultat concerne ces captures mobiles seulement et complète, sans la remplacer, la vérification interactive du principal.

Chemins absolus locaux remplacés par des références relatives avant publication.
