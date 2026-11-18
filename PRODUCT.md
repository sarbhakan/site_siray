# Siray Signature

Site vitrine multipage de pâtisserie et de créations à partager, à Bordeaux et en Gironde. La V4 intègre le catalogue, les saveurs, les compositions et les modalités fournis le 18 novembre 2026. Les photographies de réalisations Siray Signature seront intégrées ensuite.

## Faits fournis

- Marque : **Siray Signature**.
- Phrase de marque : **« L’art de sublimer vos instants gourmands »**.
- Offre : **sept familles distinctes** — layer cakes, bento cakes, mignardises, cupcakes, brunch box, buffets et plateaux.
- Identité : logo fourni par le client, utilisé comme lien d’accueil ; sa dominante olive et ses tons ivoire orientent la palette du site.
- Zone : Bordeaux et Gironde.
- Échanges et commandes : Instagram : https://www.instagram.com/siraysignature/.
- Usage : découvrir les créations, comprendre les possibilités, puis préparer un échange.

Les utilisateurs viennent notamment depuis Instagram, souvent sur téléphone. Le site doit leur permettre de reconnaître les familles en quelques secondes, de parcourir de vraies pages et de partager une URL précise.

## Parcours et périmètre

L’accueil et l’index présentent les sept familles, chacune avec son lien, son visuel et sa page propre. Les cinq premières familles ont leurs pages dans `/creations/` ; les buffets et les plateaux disposent respectivement de `/buffets/` et `/plateaux/`. Le carnet, la maison, le contact et les informations complètent le parcours. Chaque destination a un contenu propre, un H1, un titre et une description. Les URL existantes sont conservées.

Le site ne gère ni paiement, ni panier, ni disponibilité, ni transmission de commande. Une aide à la rédaction d’un message peut copier un texte sur l’appareil. Elle annonce honnêtement ce résultat. Le contact Instagram est un lien direct vers le compte confirmé.

## Intégrité du contenu

Le texte « NOS PRESTATIONS » et les visuels fournis confirment désormais les faits suivants : layer cakes à partir de 10 parts ; quinze saveurs classiques pour les layer et bento cakes ; neuf associations Signature réservées aux layer cakes ; onze saveurs de cupcakes ; cinq paliers de cupcakes ; six paliers de mignardises ; cinq plateaux tarifés ; dix brunch box avec leur composition, à 30 € par personne sauf Anatolia à 35 € ; buffets sur devis. Les tarifs des layer et bento cakes restent communiqués en message privé. Les personnalisations et mélanges de saveurs peuvent entraîner les suppléments indiqués dans les sources.

Le référentiel détaillé est dans [docs/qa/v4-content-source.md](docs/qa/v4-content-source.md). Le texte collé est retenu pour les orthographes Faisalia, Dolcezza, Tropical et Praliné royal, ainsi que pour la sauce aïoli des crudités ; les écarts avec les visuels sont consignés dans ce référentiel.

Les créations sont réalisées sur commande. **Toutes les viandes sont halal**, selon la mention fournie ; aucune certification n’a été communiquée. Toute allergie ou intolérance doit être signalée avant validation. Ces informations ne constituent aucune garantie d’absence d’allergène ou de contamination croisée.

Aucun délai minimal, acompte, condition d’annulation, adresse de retrait, livraison, frais de déplacement, capacité par plateau, label, témoignage, note ou historique n’a été confirmé. L’heure de retrait est une information demandée pour les brunch box ; elle n’établit ni lieu ni créneau de retrait. Ne pas inventer les éléments manquants.

Les photographies temporaires sont des visuels d’ambiance licenciés, explicitement signalés et traçables. Elles ne sont jamais attribuées aux réalisations de Siray Signature. Un registre fournit source, auteur, licence et remplacement attendu.

## Critères de livraison

Site statique exportable, compatible avec un hébergement gratuit adapté, sans service serveur obligatoire. Navigation et informations lisibles sans JavaScript; animations progressives; mobile soigné; clavier et mouvement réduit pris en charge; images locales optimisées; liens réels; compilation vérifiée; revue visuelle documentée.

Avant publication commerciale : renseigner les vraies photographies et leurs droits, les coordonnées et mentions légales pertinentes. Ces éléments manquants n’empêchent pas la revue de la façade.

Dépôt confirmé : [sarbhakan/site_siray](https://github.com/sarbhakan/site_siray.git).

La V4 est conçue en priorité pour les visites mobiles depuis Instagram. Le système visuel actuel est décrit dans [DESIGN.md](DESIGN.md). Le [brief artistique initial](docs/art-direction.md) et le [plan de vérification](docs/qa-plan.md) restent des documents de contexte ; les résultats effectifs et leur périmètre figurent dans `docs/qa/`.
