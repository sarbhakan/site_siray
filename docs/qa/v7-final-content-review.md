# Siray Signature V7 — revue finale du contenu

Revue indépendante du 19 novembre 2026, limitée aux sources. Aucun écart métier ni fait manquant n’a été relevé dans le périmètre contrôlé.

## Références et méthode

La revue croise les données de `src/data/site.ts`, leur utilisation dans `ProductDetail.astro`, `BuffetService.astro` et `PlatterChoices.astro`, le texte métier fourni en pièce jointe et les ajouts V7 transmis pour cette passe. Les nouveaux ingrédients des crudités remplacent la mention historique d’aïoli. Les descriptions et modalités fournies sont traitées comme du contenu métier, sans leur attribuer d’instructions techniques.

Les exports TypeScript ont été lus ponctuellement sous Node 24 pour contrôler les valeurs, les effectifs et les champs. Les routes et les branches conditionnelles ont été examinées dans le code. Aucun navigateur, build, contrôle Astro, mesure visuelle ou opération Git n’a été utilisé ; cette revue ne valide donc ni le rendu sur écran ni le comportement interactif exécuté.

## Plateaux : cinq descriptions complètes et prix exacts

| Plateau | Prix | Contenu vérifié |
| --- | ---: | --- |
| Charcuterie | 70 € | Charcuteries premium, cornichons, noix, touches fruitées. |
| Fromages | 70 € | Sélection de qualité, arômes et affinages variés. |
| Grazing Platter | 60 € | Fromages, biscuits, fruits frais et secs, confitures. |
| Fruits frais | 50 € | Fruits frais de saison. |
| Crudités | 45 € | Légumes croquants, houmous, tzatziki, sauce ail et fines herbes. |

Les cinq entrées possèdent une `description` non vide. `PlatterChoices.astro` affiche l’intitulé et le prix dans chaque résumé, puis `description || detail` dans le volet. Chaque description est ainsi accessible, et le détail des crudités n’est pas répété sous sa description. Aucun prix « par personne », capacité de plateau, quantité d’ingrédient ou supplément non fourni n’est ajouté.

Les deux champs relatifs aux crudités (`detail` et `description`) emploient la nouvelle sauce. La recherche dans `src` ne trouve ni « aïoli » ni « aioli ». La mention ancienne demeure seulement une référence historique dans les documents de source.

## Buffet : quatre étapes et demande de devis

`buffetServiceSteps` contient exactement quatre étapes, toutes reprises sans filtrage par `BuffetService.astro` :

1. Installation du buffet avant l’événement, avec une présentation soignée des mignardises.
2. Présentation et décoration avec plateaux, présentoirs et supports.
3. Personnalisation selon le thème, les couleurs et les inspirations.
4. Récupération du matériel Siray Signature à la fin de l’événement.

`ProductDetail.astro` réserve ce composant aux buffets. Le texte d’entrée conserve les compositions sucrée, salée ou mixte ; la note visible conserve le devis personnalisé. Aucun forfait, tarif de livraison, durée d’intervention, service pendant la réception ni condition supplémentaire de restitution n’est annoncé.

Les cinq informations demandées sont présentes : lieu, date, nombre de convives, nombre de mignardises par personne, thème et inspirations. Les six lignes de `orderFields` conservent aussi l’horaire, les couleurs et la composition sucrée, salée ou mixte. Elles sont toutes rendues dans le volet « Votre demande de devis » ; les allergies, intolérances et restrictions alimentaires restent demandées dans les notes communes.

## Intégrité des autres données et de la microcopie

Les raccourcissements des textes d’introduction et des notes n’enlèvent aucun prix, ingrédient ou choix requis constaté dans les sources contrôlées :

- Sept catégories et sept liens distincts sont conservés. Les pages buffet et plateaux utilisent chacune leur collection ; les cinq catégories de créations passent par la route dynamique.
- Les six tarifs mignardises restent 35/70/105/140/175/210 pièces pour 70/135/200/260/320/380 €. Le choix sucré, salé ou les deux, les plateaux prêts à disposer et le devis pour les quantités supplémentaires restent affichés.
- Les cinq tarifs cupcakes restent 6/12/18/24/30 pièces pour 18/34/50/64/78 €. Les onze saveurs sont présentes et réparties sans ajout ni omission dans les trois familles ; le supplément de personnalisation est explicite.
- Les quinze saveurs classiques sont présentes : sept fruits, trois chocolats et cinq notes gourmandes. Elles ne s’affichent que pour layer cakes et bento cakes. La note raccourcie « Mélange de saveurs : supplément » conserve la règle sans inventer de montant.
- Les neuf associations Signature conservent leurs ingrédients et leur présentation directe. La condition `layer` réserve leur affichage aux layer cakes. Le minimum de dix parts reste propre aux layer cakes ; aucune capacité chiffrée n’est ajoutée aux bento cakes.
- Les dix brunchs conservent leurs sélections sucrées, salées et le jus orange ou fraise. Neuf compositions sont à 30 € par personne et Anatolia à 35 € par personne. L’unité et l’exception sont présentes dans l’en-tête, les choix et la composition affichée.

## Mentions transversales

La formule « Toutes nos viandes sont halal » figure explicitement dans la source métier fournie. Le code conserve ce périmètre : aucune certification, garantie portant sur tous les ingrédients ou promesse d’absence d’allergènes n’a été trouvée. Les notes communes rappellent la réalisation sur commande, le signalement des allergies avant validation et la variation possible des tarifs selon la personnalisation.

Le contact reste le compte Instagram fourni. Aucune mention « photographie d’ambiance » ou « photo d’ambiance » n’a été trouvée dans `src`.

## Conclusion et limites

Le contenu V7 contrôlé est fidèle aux cinq descriptions de plateaux, aux quatre étapes de buffet et aux informations nécessaires au devis. Aucun correctif de contenu n’est demandé par cette revue. Les contrôles d’affichage sur mobile, de dépliage des plateaux et de navigation entre les volets relèvent de la vérification navigateur de la passe principale ; ils ne sont pas revendiqués ici.
