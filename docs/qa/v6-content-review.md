# Siray Signature V6 — revue de fidélité et de clarté

Revue indépendante du 18 novembre 2026, commencée pendant l’implémentation puis complétée sur les sources V6 intégrées. Périmètre : référentiel métier V4, données du catalogue V5/V6, composants, wrappers de pages, registre des images et demande V6. Le contrôle final porte sur les sources et leur répartition ; aucune inspection du rendu V6 ni aucun test navigateur n’est revendiqué.

Sources lues : `docs/qa/v4-content-source.md`, `src/data/site.ts`, `docs/image-credits.json`, Taste `references/copy.md` et `references/copy-voice.md`, Impeccable `reference/clarify.md`. Les sources métier sont prioritaires. La voix retenue est française, directe et accueillante ; les tarifs, compositions et conséquences des choix restent explicites.

**Verdict final : aucun écart métier bloquant ni omission relevé dans les données et leur répartition contrôlées. Les légendes contenant « ambiance » ont disparu de `src`. Les droits et sources restent consignés séparément.**

## Faits à conserver

Les sept familles gardent leur page et leurs modalités propres : layer cakes, bento cakes, mignardises, cupcakes, brunch box, buffets et plateaux. Le minimum de **10 parts** appartient uniquement aux layer cakes. Le bento garde son **format standard**, sans capacité ni prix inventés. Les cakes ont un tarif communiqué en message privé selon leur personnalisation ; les buffets restent sur devis.

Les paliers à préserver sont les suivants :

- **Cupcakes** : 6 pièces / 18 € ; 12 / 34 € ; 18 / 50 € ; 24 / 64 € ; 30 / 78 €. La personnalisation spécifique entraîne un supplément.
- **Mignardises** : 35 pièces / 70 € ; 70 / 135 € ; 105 / 200 € ; 140 / 260 € ; 175 / 320 € ; 210 / 380 €. Les quantités supplémentaires sont sur devis ; le choix sucré, salé ou mixte et la répartition restent ajustables.
- **Plateaux** : charcuterie 70 € ; fromages 70 € ; Grazing Platter 60 € ; fruits frais 50 € ; crudités 45 €, avec houmous, tzatziki et sauce aïoli. Aucune capacité par plateau n’est fournie.
- **Brunch box** : dix compositions, neuf à **30 € par personne**, **Anatolia à 35 € par personne**. Chaque composition conserve sa sélection sucrée, salée et son jus de fruits orange ou fraise. Le choix, le menu affiché et le prix doivent toujours désigner la même composition.

Les données lues contiennent **15 saveurs classiques**, pour les layer et bento cakes ; **9 associations Signature**, exclusivement pour les layer cakes ; **11 saveurs propres aux cupcakes**. Les regrouper visuellement ne doit pas modifier ces listes ou transposer la liste classique aux cupcakes. Les noms canoniques restent Tropical, Praliné royal, Faisalia et Dolcezza selon le texte métier retenu en V4.

Les dix brunchs sont Elegancia, Prestige, Le Parisien, Faisalia, Signature, Brunchetta, Dolcezza, Amarizia, Seralia et Anatolia. Les ingrédients doivent rester ceux de leur composition, sans déduction de quantité à partir des images. Les demandes de brunch conservent le nombre de personnes, la date et l’heure de retrait.

## Microcopie et hiérarchie recommandées

La note **« Mélanger plusieurs saveurs entraîne un supplément. »** conserve le sens établi et réduit la longueur. Elle doit être mise en évidence et utiliser la largeur disponible. Aucun montant de supplément ni nombre de saveurs incluses n’est connu.

Près du bouton Instagram, **« Sur commande · Viandes halal »** est une synthèse fidèle. La phrase complète **« Toutes nos viandes sont halal »** doit rester accessible dans les informations de commande. La mention ne vaut ni certification ni garantie sur tous les ingrédients. **Allergies & intolérances** demeure un lien explicite ; ces restrictions doivent être signalées avant validation. Aucune garantie d’absence d’allergène n’est ajoutée.

Pour le brunch, **« Précisez le nombre de personnes et l’heure de retrait. »** est assez court pour guider la demande. Les titres Sucré, Salé et Boisson doivent structurer la composition choisie ; le nom du plat et ses éventuels détails peuvent avoir deux niveaux typographiques, sans réécrire les ingrédients. Les unités **par personne** ne doivent jamais être supprimées pour gagner de la place.

Le gras doit souligner les décisions utiles : **sucré, salé ou les deux**, **format standard**, **10 parts minimum**, **supplément**, **sur devis**. Mettre toute une longue section en gras annulerait cette hiérarchie. Les neuf associations Signature peuvent être lues directement dans une grille ou une liste compacte, sans imposer neuf ouvertures successives.

La demande d’une seule ligne se traduit d’abord par un texte plus court et la suppression des limites artificielles de largeur. Sur téléphone étroit ou avec agrandissement du texte, une coupure naturelle reste préférable à un `white-space: nowrap`, un débordement ou une police illisible. La revue de contenu ne peut pas garantir un nombre de lignes sans mesure du rendu.

## Familles de saveurs et images

Les trois groupes classiques sont déjà éditoriaux : Fruits (7), Chocolats (3) et Notes gourmandes (5). Le choix peut commander une photographie thématique et la liste correspondante. Le nom du groupe choisi, son image et ses saveurs doivent rester synchronisés ; tous les textes restent consultables sans JavaScript.

Pour les cupcakes, un regroupement fidèle possible est Fruits (Framboise, Fraise, Fruit de la passion, Mangue & fruit de la passion, Fruits rouges, Lemon curd) et Notes gourmandes (Crème de pistache, Nutella, Crème de spéculoos, Caramel beurre salé, Crème de noisette). Ces groupes constituent un agencement éditorial, pas de nouvelles recettes.

Le registre existant ne contient **aucun bento cake authentifié**, ni image isolée de chocolats ou de notes gourmandes adaptée à ces familles. `gateau-creme` est explicitement décrit comme un gâteau à la crème qui n’est pas un bento authentifié ; `cupcake-detail` représente un cupcake et ne convient pas à la fiche bento. Un renommage de ces images ne corrigerait pas l’incohérence signalée. Les nouveaux visuels doivent être identifiés et leurs droits documentés avant utilisation.

La demande de retirer les légendes « photographie d’ambiance » des parcours peut être appliquée sans supprimer le registre, les auteurs, les licences et les liens sources. Les photos provisoires ne doivent pas devenir des réalisations attribuées à Siray Signature. Les nouveaux cadrages ne doivent pas promettre une composition ou un décor absent du contenu métier.

## Résultats de l’audit final des sources

Un contrôle ponctuel exécuté sous Node 24 a chargé les données TypeScript et comparé leur contenu à la version V5 publiée (`99864154ebfdd9fb0fcafc2646fafbbc4fd2579e`). La projection métier exclut uniquement les champs d’image et de texte alternatif, destinés à changer pendant cette reprise. Résultats :

- **Sept catégories, sept URL uniques** ; aucun regroupement de famille.
- **Données métier des sept collections identiques à V5** : noms, présentations, possibilités, repères de prix, notes, grilles tarifaires et informations demandées.
- **15 classiques, 9 Signature et 11 saveurs cupcakes**, listes et compositions identiques à V5.
- **Dix brunchs identiques à V5**, y compris toutes les listes sucrées/salées, la boisson et les prix : neuf à 30 €, Anatolia à 35 €. Les paliers cupcakes et mignardises ont aussi été comparés explicitement aux montants du référentiel ; les cinq tarifs plateaux et leurs précisions sont conservés.

La lecture de `ProductDetail.astro` et des wrappers de pages confirme leur répartition : les classiques sont conditionnés à layer/bento, les Signature strictement à `layer-cakes`, et la liste propre aux cupcakes est utilisée uniquement pour `cupcakes`. Les neuf associations Signature sont maintenant un `<dl>` lisible directement ; leurs textes proviennent toujours des données canoniques.

Le regroupement effectif des cupcakes a été évalué depuis la définition du composant : **Fruits 6, Chocolats 1, Notes gourmandes 4**, soit **11 valeurs distinctes, aucune omission, aucun ajout**. Nutella figure dans Chocolats ; ce classement est éditorial et ne change pas la saveur fournie. Les trois groupes classiques restent ceux des données : 7, 3 et 5.

Les tableaux sont toujours alimentés par les tarifs de leur propre famille. Les brunchs conservent « par personne » dans le résumé, les options, les boutons et le menu. Les notes raccourcies des cakes, des cupcakes, des buffets, des plateaux et des quantités supplémentaires ne modifient pas les modalités. « Mélanger plusieurs saveurs entraîne un supplément » conserve la conséquence métier, sans montant ajouté. Les éléments utiles des mignardises, dont « Sucré, salé ou les deux », sont toujours présents.

La préparation de demande utilise encore les champs de chaque famille. Le texte complet sur les allergies avant validation et « Toutes nos viandes sont halal » reste dans le volet, avec le résumé près du lien Instagram. Aucun délai, acompte, capacité de plateau, minimum bento/brunch, certification ou garantie d’absence d’allergène n’a été ajouté. La page contact confirme les modalités pendant l’échange ; elle ne fixe pas de délai inventé.

Une recherche textuelle dans tout **`src` ne retourne aucune occurrence d’« ambiance »**. Les anciennes légendes ont disparu des fiches, de la galerie et du footer. Le lien de bas de page s’intitule « Crédits des images ». La page de crédits indique toujours que les visuels ne représentent pas les réalisations Siray, et le registre conserve auteur, source et licence. Les nouveaux assets bento, détail bento, chocolats et pistaches sont bien enregistrés ; cette revue constate les métadonnées, sans revendiquer une seconde vérification web de leurs licences.

La galerie utilise désormais des images non cliquables dans les figures ; les boutons de filtre, leur état et le décompte demeurent dans les sources. Le module conserve le filtrage et ses annonces. L’absence de zoom et le fonctionnement effectif des filtres restent à confirmer par la passe navigateur de l’agent principal.

Les contrôles de contenu sont distincts des essais de largeur, des interactions, des états de focus et des captures du navigateur. Aucun résultat de compilation, téléphone physique, navigateur Instagram ou lecteur d’écran n’est revendiqué par cette revue.
