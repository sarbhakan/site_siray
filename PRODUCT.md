# Siray Signature

Site vitrine multipage de pâtisserie et de créations à partager, à Bordeaux et en Gironde. La V9 conserve le catalogue, les saveurs et les prix fournis le 18 novembre 2026, avec les descriptions des plateaux et les modalités du buffet communiquées pour la passe du 19 novembre 2026. Elle précise le contenu salé et sucré des mignardises selon la dernière demande. Le registre réunit désormais 28 photographies client parmi les 44 fournies ; la galerie approuvée conserve ses 26 réalisations et son classement.

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

L’accueil et l’index présentent les sept familles, chacune avec son lien, son visuel et sa page propre. Les cinq premières familles ont leurs pages dans `/creations/` ; les buffets et les plateaux disposent respectivement de `/buffets/` et `/plateaux/`. La galerie, la maison et le contact complètent le parcours. La page publique de crédits et son lien dans le footer sont retirés à la demande de l’utilisateur ; les sources des images restent documentées en interne. Chaque destination a un contenu propre, un H1, un titre et une description. Les URL des prestations sont conservées.

Le site ne gère ni paiement, ni panier, ni disponibilité, ni transmission de commande. Une aide à la rédaction d’un message peut copier un texte sur l’appareil. Elle annonce honnêtement ce résultat. Le contact Instagram est un lien direct vers le compte confirmé.

## Intégrité du contenu

Le texte « NOS PRESTATIONS » et les visuels fournis confirment désormais les faits suivants : layer cakes à partir de 10 parts ; quinze saveurs classiques pour les layer et bento cakes ; neuf associations Signature réservées aux layer cakes ; onze saveurs de cupcakes ; cinq paliers de cupcakes ; six paliers de mignardises ; cinq plateaux tarifés ; dix brunch box avec leur composition, à 30 € par personne sauf Anatolia à 35 € ; buffets sur devis. Les tarifs des layer et bento cakes restent communiqués en message privé. Les personnalisations et mélanges de saveurs peuvent entraîner les suppléments indiqués dans les sources.

Le référentiel initial est dans [docs/qa/v4-content-source.md](docs/qa/v4-content-source.md). Le texte collé reste retenu pour les orthographes Faisalia, Dolcezza, Tropical et Praliné royal ; les écarts avec les visuels y sont consignés. Les descriptions et modalités plus récentes sont documentées dans [docs/qa/v7-content-source.md](docs/qa/v7-content-source.md). Elles précisent les cinq plateaux en conservant leurs prix : charcuterie 70 €, fromages 70 €, Grazing Platter 60 €, fruits frais 50 € et crudités 45 €. La sauce ail et fines herbes des crudités remplace la mention antérieure d’aïoli. Aucune capacité ni quantité d’aliment par plateau n’est déduite de ces descriptions.

La prestation buffet comporte quatre étapes fournies : installation avant l’événement, présentation et décoration avec les plateaux et supports, personnalisation selon le thème et les inspirations, puis retrait du matériel Siray Signature à la fin de l’événement. Elle reste sur devis personnalisé. Le retrait concerne le matériel ; il n’établit aucune condition de restitution supplémentaire, durée d’intervention, livraison, service pendant la réception ou frais de déplacement.

Le contenu V9 des mignardises distingue les bouchées salées (mini-burgers viande, poulet ou poisson ; bagels, wraps, navettes et club sandwiches ; mini-pizzas et hot-dogs ; nems et autres bouchées chaudes ; verrines de salades, crudités et fruits de mer ; toasts ; coupelles et compositions grazing ; bouchées autour du gravlax de truite, des crevettes, de la mozzarella et des tomates) des verrines sucrées en différentes saveurs et textures. Ces exemples ne définissent ni un assortiment fixe ni un supplément tarifaire absent des sources.

Les créations sont réalisées sur commande. **Toutes les viandes sont halal**, selon la mention fournie ; aucune certification n’a été communiquée. Toute allergie ou intolérance doit être signalée avant validation. Ces informations ne constituent aucune garantie d’absence d’allergène ou de contamination croisée.

Aucun délai minimal, acompte, condition d’annulation, adresse de retrait, livraison, frais de déplacement, capacité par plateau, label, témoignage, note ou historique n’a été confirmé. L’heure de retrait est une information demandée pour les brunch box ; elle n’établit ni lieu ni créneau de retrait. Ne pas inventer les éléments manquants.

Les 28 photographies client du registre illustrent les prestations ; la galerie conserve la sélection V8 de 26 réalisations. La V9 ajoute le layer cake au fond de papier journal et le mini hot-dog tenu par une main gantée. Les photos principales et secondaires approuvées sont conservées, sauf les remplacements demandés pour le bento cake principal (coffrets) et les mignardises principales (mini hot-dog). Les originaux restent intacts et hors du dossier public ; seules les variantes WebP optimisées sont livrées. Le registre `docs/image-credits.json` distingue les photographies client des illustrations stock et conserve la provenance, les dimensions et les variantes. Aucun photographe nominatif ni licence publique n’est inventé pour les photographies fournies.

Quatre illustrations stock sont conservées : trois visuels d’ingrédients pour Fruits, Chocolats et Notes gourmandes, et un visuel de cupcakes sur l’accueil, à titre d’exception. Elles restent créditées et ne sont pas attribuées aux réalisations Siray. Le registre interne conserve cette provenance et les licences ; aucun lien de crédits n’est désormais présenté dans le parcours public. Les photographies réelles de cette passe sont reçues et intégrées ; elles ne restent plus un contenu à fournir.

## Critères de livraison

Site statique exportable, compatible avec un hébergement gratuit adapté, sans service serveur obligatoire. Navigation et informations lisibles sans JavaScript ; animations progressives ; mobile soigné ; clavier et mouvement réduit pris en charge ; images locales optimisées ; liens réels ; compilation vérifiée ; revue visuelle documentée. L’en-tête reste sticky pendant le défilement sur toutes les pages. Les fiches gardent seulement la photo latérale sticky à partir de 960 px, sous l’en-tête grâce au décalage partagé `--header-offset`. Les volets défilent normalement, les saveurs associent leur image et leur liste, et les neuf Signature sont lisibles directement. Les cinq plateaux présentent leurs prix et leurs descriptions dans des lignes ouvrantes natives utilisables sans JavaScript ; le buffet expose ses quatre étapes et un volet distinct pour préparer le devis. Le volet « Les bouchées » des mignardises distingue « Le coin gourmand » salé et « La touche sucrée » de verrines. Les photos horizontales inadaptées sont retirées des associations Signature et de la préparation des demandes. La mention allergies n’est plus répétée dans chacun de ces volets : elle reste accessible près de l’action Instagram. Les phrases d’aide sont courtes, les colonnes utilisent leur largeur disponible et le corps de lecture demeure à 16 px, avec des retours naturels sur mobile. Le bouton Instagram et les mentions pratiques des fiches partagent un alignement centré. Le footer réunit l’action, une navigation mobile qui se répartit sur plusieurs lignes et une identité compacte avec Bordeaux/Gironde ; à partir de 960 px, ses six liens forment une rangée horizontale. La galerie conserve les filtres et retire le zoom.

La préparation de livraison comprend deux archives statiques, pour Netlify et Cloudflare Pages, avec guide séparé, manifeste et SHA-256. Elles ne constituent pas une publication : aucun déploiement distant n’est attesté à ce stade. Le projet conserve une sortie statique portable. `docs/deployment.md` décrit les dépôts manuels, la connexion Git et les limites des offres gratuites ; un domaine personnel reste distinct de l’hébergement. L’origine finale ne doit être renseignée qu’après attribution de l’adresse réelle.

Avant publication commerciale : compléter les coordonnées, conditions commerciales non communiquées et mentions légales pertinentes de l’entreprise et de l’hébergeur retenu. Les photographies fournies pour la V8 et leur traçabilité ne sont plus en attente. Les contrôles finaux de l’intégration et de la livraison doivent être exécutés puis documentés, sans les déduire de la préparation des fichiers.

Dépôt confirmé : [sarbhakan/site_siray](https://github.com/sarbhakan/site_siray.git).

La V9 poursuit la priorité donnée aux visites mobiles depuis Instagram. Le système visuel actuel est décrit dans [DESIGN.md](DESIGN.md). Le [brief artistique initial](docs/art-direction.md) et le [plan de vérification](docs/qa-plan.md) restent des documents de contexte. Les documents V8 de `docs/qa/` conservent l’historique de la première intégration des 26 photographies client et des contrôles alors exécutés. Les changements V9 décrits ici ne constituent pas une validation navigateur : les résultats de cette nouvelle passe doivent être consignés après exécution. Les rapports V1 à V8 décrivent les versions précédentes. Les descriptions d’implémentation ne constituent pas à elles seules une validation de compilation ou de rendu navigateur.
