# Fiches produit V5 — implémentation

Le composant commun conserve les sept URL et les données métier de `src/data/site.ts`. Il remplace la succession de grandes sections par un espace photo/contenu : photo persistante à gauche sur ordinateur, volets explicites à droite ; photo courte puis volets en grille sur téléphone.

## Architecture

`src/components/ProductDetail.astro` produit le contenu complet, les tarifs sémantiques, les trois familles de classiques, les neuf associations Signature des layer cakes seulement, les onze saveurs de cupcakes et les dix brunchs. Des images d’ambiance créditées accompagnent les saveurs, les détails et la préparation de demande. Trois liens photographiques permettent de poursuivre vers d’autres prestations.

`src/scripts/product-explorer.ts` renforce progressivement cette base. Les commandes purement JavaScript sont cachées initialement. Lorsque l’initialisation réussit, elles deviennent un tablist avec des tabs et tabpanels associés, une sélection unique et un tabindex itinérant. Flèches, Home et End activent les volets sans navigation de fragment ni déplacement de focus forcé vers le contenu. Les anciens fragments de destination présents dans les panneaux sont pris en compte au chargement.

Les brunchs disposent d’un sélecteur natif sur mobile/tablette et d’une liste de boutons avec prix individuel sur grand écran. Les deux commandes pilotent le même détail. Tous les menus restent dans le HTML et visibles sans cette initialisation ; aucune sélection ne constitue une commande. Le prix est présenté comme neuf compositions à 30 € par personne et Anatolia à 35 € par personne, sans catégorie « classiques » ni supplément inventé.

Les écouteurs sont supprimés via AbortController avant les changements de page Astro, puis réinitialisés à `astro:page-load`. Le changement de volet n’anime aucune dimension ; un fondu bref est désactivé par `prefers-reduced-motion`. La version imprimée réaffiche les panneaux et compositions.

## Références appliquées

Impeccable craft-floor/adapt : divulgation progressive adaptée au téléphone, commandes explicites, cibles de 44 px minimum, corps 16 px, focus, états sélectionnés et distinction entre contenu et contrôles. Taste system/sections : système visuel partagé, données sourcées, photographies comme matière principale et navigation réelle. Les prescriptions génériques de menu toujours développé ou de hauteurs fixes sont écartées au profit de la demande explicite de volets et de compacité mobile.

## Vérification de cette note

Contrôle de source et `git diff --check` uniquement. Les mesures de viewport, le focus réel, le changement de brunch et la compilation sont à consigner par l’agent principal après son rendu groupé ; aucun résultat navigateur n’est revendiqué ici.
