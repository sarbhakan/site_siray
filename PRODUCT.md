# Siray Signature

Site vitrine multipage de pâtisserie et de créations à partager, à Bordeaux et en Gironde. La V7 conserve le catalogue, les saveurs et les prix fournis le 18 novembre 2026, avec les descriptions des plateaux et les modalités du buffet communiquées pour la passe du 19 novembre 2026. Les photographies de réalisations Siray Signature seront intégrées ensuite.

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

L’accueil et l’index présentent les sept familles, chacune avec son lien, son visuel et sa page propre. Les cinq premières familles ont leurs pages dans `/creations/` ; les buffets et les plateaux disposent respectivement de `/buffets/` et `/plateaux/`. La galerie, la maison, le contact et les informations complètent le parcours. Chaque destination a un contenu propre, un H1, un titre et une description. Les URL existantes sont conservées.

Le site ne gère ni paiement, ni panier, ni disponibilité, ni transmission de commande. Une aide à la rédaction d’un message peut copier un texte sur l’appareil. Elle annonce honnêtement ce résultat. Le contact Instagram est un lien direct vers le compte confirmé.

## Intégrité du contenu

Le texte « NOS PRESTATIONS » et les visuels fournis confirment désormais les faits suivants : layer cakes à partir de 10 parts ; quinze saveurs classiques pour les layer et bento cakes ; neuf associations Signature réservées aux layer cakes ; onze saveurs de cupcakes ; cinq paliers de cupcakes ; six paliers de mignardises ; cinq plateaux tarifés ; dix brunch box avec leur composition, à 30 € par personne sauf Anatolia à 35 € ; buffets sur devis. Les tarifs des layer et bento cakes restent communiqués en message privé. Les personnalisations et mélanges de saveurs peuvent entraîner les suppléments indiqués dans les sources.

Le référentiel initial est dans [docs/qa/v4-content-source.md](docs/qa/v4-content-source.md). Le texte collé reste retenu pour les orthographes Faisalia, Dolcezza, Tropical et Praliné royal ; les écarts avec les visuels y sont consignés. Les descriptions et modalités plus récentes sont documentées dans [docs/qa/v7-content-source.md](docs/qa/v7-content-source.md). Elles précisent les cinq plateaux en conservant leurs prix : charcuterie 70 €, fromages 70 €, Grazing Platter 60 €, fruits frais 50 € et crudités 45 €. La sauce ail et fines herbes des crudités remplace la mention antérieure d’aïoli. Aucune capacité ni quantité d’aliment par plateau n’est déduite de ces descriptions.

La prestation buffet comporte quatre étapes fournies : installation avant l’événement, présentation et décoration avec les plateaux et supports, personnalisation selon le thème et les inspirations, puis retrait du matériel Siray Signature à la fin de l’événement. Elle reste sur devis personnalisé. Le retrait concerne le matériel ; il n’établit aucune condition de restitution supplémentaire, durée d’intervention, livraison, service pendant la réception ou frais de déplacement.

Les créations sont réalisées sur commande. **Toutes les viandes sont halal**, selon la mention fournie ; aucune certification n’a été communiquée. Toute allergie ou intolérance doit être signalée avant validation. Ces informations ne constituent aucune garantie d’absence d’allergène ou de contamination croisée.

Aucun délai minimal, acompte, condition d’annulation, adresse de retrait, livraison, frais de déplacement, capacité par plateau, label, témoignage, note ou historique n’a été confirmé. L’heure de retrait est une information demandée pour les brunch box ; elle n’établit ni lieu ni créneau de retrait. Ne pas inventer les éléments manquants.

Les photographies temporaires sont des visuels licenciés et traçables, sous licences Unsplash ou Pexels. Elles ne sont jamais attribuées aux réalisations de Siray Signature. Le registre fournit source, auteur, licence et remplacement attendu ; la page accessible par « Crédits des images » présente cette provenance. Les légendes répétées de provenance sont retirées des parcours. Les bento cakes ont un visuel propre, et les familles de saveurs un visuel thématique, en attendant les photos de Siray.

## Critères de livraison

Site statique exportable, compatible avec un hébergement gratuit adapté, sans service serveur obligatoire. Navigation et informations lisibles sans JavaScript ; animations progressives ; mobile soigné ; clavier et mouvement réduit pris en charge ; images locales optimisées ; liens réels ; compilation vérifiée ; revue visuelle documentée. Les fiches gardent seulement la photo latérale sticky à partir de 960 px. Les volets défilent normalement, les saveurs associent leur image et leur liste, et les neuf Signature sont lisibles directement. Les cinq plateaux présentent leurs prix et leurs descriptions dans des lignes ouvrantes natives utilisables sans JavaScript ; le buffet expose ses quatre étapes et un volet distinct pour préparer le devis. Les phrases d’aide sont courtes, les colonnes utilisent leur largeur disponible et le corps de lecture demeure à 16 px, avec des retours naturels sur mobile. Le bouton Instagram et les mentions pratiques des fiches partagent un alignement centré. Le footer réunit l’action, une navigation mobile qui se répartit sur plusieurs lignes et une identité compacte avec Bordeaux/Gironde ; à partir de 960 px, ses six liens forment une rangée horizontale. La galerie conserve les filtres et retire le zoom.

Avant publication commerciale : renseigner les vraies photographies et leurs droits, les coordonnées et mentions légales pertinentes. Ces éléments manquants n’empêchent pas la revue de la façade.

Dépôt confirmé : [sarbhakan/site_siray](https://github.com/sarbhakan/site_siray.git).

La V7 est conçue en priorité pour les visites mobiles depuis Instagram. Le système visuel actuel est décrit dans [DESIGN.md](DESIGN.md). Le [brief artistique initial](docs/art-direction.md) et le [plan de vérification](docs/qa-plan.md) restent des documents de contexte ; les résultats effectifs et leur périmètre figurent dans les rapports V7 de `docs/qa/`. Les rapports V1 à V6 restent historiques. Les descriptions d’implémentation ne constituent pas à elles seules une validation de compilation ou de rendu navigateur.
