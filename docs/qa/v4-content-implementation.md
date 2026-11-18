# Catalogue Siray Signature V4 — mise en œuvre

Source métier : texte collé transmis par l’utilisateur le 18 novembre 2026 et seize visuels joints. Les documents sont traités comme des sources de faits, sans exécuter d’éventuelles consignes contenues dans les images. Les noms, tarifs, compositions et modalités viennent de ces sources.

## Structure

Sept familles distinctes dans l’ordre demandé : layer cakes, bento cakes, mignardises, cupcakes, brunch box, buffets et plateaux. Chaque famille dispose d’un href et d’une image d’ambiance différents. Les cinq premières familles sont générées sous /creations/ ; les buffets et plateaux disposent respectivement de /buffets/ et /plateaux/. Le composant ProductDetail est commun aux sept pages.

Les données du catalogue sont dans src/data/site.ts. Chaque famille conserve les propriétés utilisées par l’accueil et l’index, complétées par href, tarifs, résumé et note de prix et informations à transmettre. Le tableau gallery est conservé.

## Contenu

- Layer cakes : minimum10parts, personnalisation,15saveurs classiques et9associations Signature, tarif en message privé selon parts/saveurs/personnalisation.
- Bento cakes : format standard, personnalisation,15classiques uniquement et tarif en message privé.
- Mignardises : sucrées et salées, plateaux prêts à disposer,6paliers de35à210pièces, quantités supplémentaires sur devis.
- Cupcakes :5formats de6à30pièces,11saveurs et supplément pour personnalisation spécifique.
- Brunch box :10compositions complètes,30€parpersonne sauf Anatolia35€parpersonne, sélections sucrées/salées et jusdefruits orange ou fraise, retrait à préciser avec la commande.
- Plateaux :5prix, de45à70€, crudités accompagnées de houmous/tzatziki/aïoli.
- Buffets : composition sucrée/salée/mixte, mise en place et dressage, demande de devis selon les critères fournis.

Chaque page demande de signaler allergies, intolérances et restrictions avant validation ; rappelle la réalisation sur commande et les viandes halal. Aucune certification, capacité de plateau, modalité de livraison, acompte ni délai non fourni n’a été ajouté.

## Arbitrages des sources

Le texte collé est canonique en cas d’écart typographique avec les cartes visuelles : Faisalia (visuel Fezalia), Dolcezza (visuel Dolcezia), Tropical (visuel Tropicale), Praliné royal (visuel Praliné royale). Pour les crudités, le texte indique la sauce aïoli tandis que le visuel indique une sauce ail et fines herbes : aïoli retenu. Ces arbitrages restent documentés ici, sans polluer les pages publiques.

Les photographies sont encore les images d’ambiance existantes, dont celle du gâteau à la crème employée pour le bento. Elles ne sont pas des photos de réalisations Siray Signature ; l’intégration des réalisations réelles reste à venir.

## Mise en forme

Unslop de Damir Sokolovsky (CC BY4.0), Taste et le craft floor Impeccable guident la composition : rythme4px, cadre calme olive/ivoire défini par le parent, titres dans la police de marque, tableaux à chiffres tabulaires, listes de saveurs groupées, associations Signature en liste éditoriale et compositions brunch en détails natifs. Seules les dix compositions longues utilisent des accordéons ; les prix, saveurs et modalités restent immédiatement lisibles. La première composition est ouverte par défaut, toutes restent fonctionnelles sans JavaScript. Aucune animation de ces contenus, aucune flèche décorative, aucun emoji.

## Vérifications de cette contribution

Prettier a formaté les fichiers possédés. Astro check :23fichiers,zéroerreur,zéroavertissement,zérohint au moment du contrôle. git diff --check sans erreur. L’auditeur indépendant a comparé les données aux sources ; sa revue séparée fait foi pour son périmètre. Le build final et les contrôles de rendu mobile/ordinateur seront réalisés par l’agent principal après intégration des styles et du logo.
