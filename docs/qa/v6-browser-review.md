# Siray Signature V6 — vérification navigateur

Contrôles effectués par l’agent principal le 18 novembre 2026 dans le navigateur Chromium intégré, sur le build statique servi à http://127.0.0.1:4321/. Les traces JSON et les captures correspondent à ces manipulations. Les revues indépendantes de contenu et de captures distinguent leur portée.

## Défilement et informations

La barre des volets est dans le flux : `position: static`. Dans la fiche Layer à 1 440 px, à scrollY=422,5, le haut de la photo est maintenu à 28 px tandis que celui des volets est à -84 px. La photo quitte ensuite son emplacement sticky à la fin du conteneur de fiche : elle n’accompagne pas les prestations associées. Les neuf associations Signature sont visibles directement, sans accordéon.

Les 18 volets des sept prestations ont été activés à 320 px : une seule rubrique affichée et aucun débordement dans chacun de ces états. Les neuf choix de familles sur Layer, Bento et Cupcakes ont été activés à 390 px : Fruits, Chocolats et Notes gourmandes affichent chacun leur image et leur liste. Les onze saveurs cupcakes sont réparties en 6/1/4, sans perte de contenu. Le clavier ArrowRight, Home et End a été manipulé, avec focus et sélection synchronisés.

La note finale « Mélange de saveurs : supplément. » est en graisse 600 et tient sur une ligne à 390 px, dans `v6-layer-chocolat-mobile.jpg`. Les notes utilisent toute la largeur ; les retours naturels restent possibles sur écran plus étroit. La mention sur commande/viandes halal est en gras au voisinage de l’action Instagram. Les allergies restent accessibles.

## Brunch et galerie

Les dix boutons brunch sur bureau ont été activés : un seul menu par choix, avec trois groupes intitulés Le sucré, Le salé, La boisson. Neuf compositions affichent 30 € par personne et Anatolia 35 €. Le sélecteur mobile a également été utilisé pour Anatolia, et les dix libellés avec leurs unités ont été inspectés.

Les quatre filtres de galerie ont été activés : Cakes affiche 2 photos, Douceurs 3, Tables 3 et Tout voir 8. Les figures ne contiennent aucun lien ou bouton de zoom ; aucun élément de visionneuse n’est présent. Le menu mobile fonctionne. Le passage par lien Astro de Layer vers Bento, puis le retour arrière, a été vérifié avec les volets principaux et les familles. Une initialisation répétée conserve désormais la sélection déjà faite ; le nettoyage des écouteurs reste en place.

## Rendu mobile et captures

`v6-responsive.json` contient 70 mesures : 14 routes à 320, 390, 430, 768 et 1 440 px. Aucun débordement horizontal du document dans ces états ; plus petit texte visible mesuré : 13 px. Ces mesures portent sur les états initiaux, complétés par les états interactifs ci-dessus.

Captures conservées : `v6-layer-chocolat-mobile.jpg`, `v6-cupcake-notes-mobile.jpg`, `v6-layer-signatures-desktop.jpg`, `v6-bento-desktop.jpg`, `v6-brunch-desktop.jpg`, `v6-brunch-mobile.jpg`, `v6-gallery-mobile.jpg`. Le visuel principal du bento est un petit gâteau blanc personnalisé, son visuel de demande un autre petit gâteau décoré de cœurs ; aucun cupcake ne figure dans ces emplacements.

La capture Chocolats finale remplace celle qui montrait la formulation longue. Les autres captures précèdent seulement la finition des notes en gras et la conservation des choix pendant une réinitialisation. Elles documentent les dispositions inchangées. La revue indépendante finale inspecte directement la capture Chocolats mise à jour.

## Vérifications et limites

Astro check final : 25 fichiers, 0 erreur, 0 avertissement, 0 hint. Build : 14 pages. Contrôle HTML/HTTP : aucune issue ni warning, URL inconnue en 404. Taste copy-lint : aucun FAIL/WARN. Impeccable detect : `[]`, avec couverture Astro limitée. Le contexte Impeccable signale l’ancien schéma PRODUCT et l’absence de hook ; aucune migration ou installation de hook n’a été effectuée. Ces outils ne valent pas validation visuelle.

Aucune entrée warn/error renvoyée par les journaux navigateur lors du contrôle final. Aucun test sur téléphone physique, Safari/iOS, navigateur intégré Instagram ou lecteur d’écran n’est revendiqué. Fallback sans JavaScript, impression et mouvement réduit relus dans le code, sans émulation. Le diaporama d’accueil conserve son fonctionnement antérieur ; son timing n’a pas été revalidé dans cette passe. Les images restent provisoires et créditées, en attendant les réalisations Siray Signature.
