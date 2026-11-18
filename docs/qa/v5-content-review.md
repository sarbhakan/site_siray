# Siray Signature V5 — clarté du parcours et fidélité métier

Revue indépendante du 18 novembre 2026. Périmètre : lecture des documents métier et du code V4, recommandations de microcopie pour la reprise V5. Aucun fichier source modifié par cette revue. Aucun contrôle navigateur, mobile physique ou interaction exécutée n’est revendiqué.

## Sources et méthode

Documents lus : `AGENTS.md`, `PRODUCT.md`, `README.md`, `docs/qa/v4-content-source.md`, `src/data/site.ts` et `src/components/ProductDetail.astro`. Références appliquées : Taste `references/copy.md` et `references/copy-voice.md`, Impeccable `reference/clarify.md`, aux pins déjà consignés dans le projet.

La règle retenue est de nommer l’information consultable et le résultat d’une action. Les faits et intitulés métier restent prioritaires sur les conventions stylistiques des skills. La voix reste française, directe et accueillante ; les prix, les conditions et les contrôles emploient des termes concrets, sans promesse ajoutée.

## Constats sur la version relue

Le catalogue contient bien sept familles indépendantes et les données correspondent au référentiel V4. Le problème remonté par le client tient principalement à l’organisation et à la visibilité des actions. Les liens « Personnalisation », « Les saveurs » et « Votre demande » servent actuellement de sauts dans une longue page. Leur apparence et leurs noms n’expliquent pas assez qu’ils permettent de consulter une autre information. La succession de sections répète la même structure même quand les familles ont des besoins différents.

Le résumé « 30 € par personne · Anatolia 35 € » est exact mais trop condensé : le second montant n’explicite pas son unité, et Anatolia apparaît avant que le lecteur sache qu’il s’agit d’une composition. L’exception tarifaire mérite un traitement lisible à côté du nom et de la composition choisie.

## Texte conseillé pour les brunchs

Texte d’entrée : **« Dix brunchs au choix »**. Phrase d’appui : **« Chaque composition réunit du sucré, du salé et un jus de fruits. »**

Les deux repères de prix doivent être séparés et toujours comporter leur unité :

- **« 9 compositions — 30 € par personne »**
- **« Anatolia — 35 € par personne »**

Une formulation alternative en une phrase reste exacte : **« Toutes les compositions sont à 30 € par personne, sauf Anatolia à 35 € par personne. »** Ne pas afficher les trois formulations ensemble ; choisir un traitement, puis garder le prix propre à chaque composition consultée.

Pour le volet de choix : **« Voir les compositions »** ou **« Choisir une composition »** si une sélection est réellement gérée. L’aide courte peut dire **« Sélectionnez un nom pour voir le menu complet. »** Le nom, le tarif et « par personne » restent associés dans le sélecteur ou dans l’en-tête du menu affiché. Pour une composition ouverte : **« Le sucré »**, **« Le salé »**, **« Le jus de fruits »**. Les listes d’aliments viennent directement des données.

Ne pas appeler les neuf autres brunchs « classiques » : cette catégorie n’est pas fournie et ce mot désigne déjà les saveurs des cakes. Éviter « supplément Anatolia », qui ne représente pas le prix total fourni, ainsi qu’un « À partir de 30 € » isolé qui masque l’exception. Aucune quantité de boisson, nombre de pièces par aliment ou quantité minimale de commande ne doit être déduite.

## Libellés des volets et actions

Des volets peuvent raccourcir le parcours si leur état actif et leur fonction sont visibles. Les groupes doivent suivre le besoin de la famille, sans imposer le même ensemble à toutes les pages.

| Famille | Volets ou contrôles conseillés | Aide brève utile |
| --- | --- | --- |
| Layer cakes | « Format & décor », « Saveurs », « Votre demande » | « À partir de 10 parts. Choisissez une saveur classique ou une association Signature. » |
| Bento cakes | « Décor », « Saveurs », « Votre demande » | « Un format standard, une saveur classique et un décor à personnaliser. » |
| Cupcakes | « Formats & tarifs », « Saveurs », « Votre demande » | « Choisissez la quantité, les saveurs et le décor souhaité. » |
| Mignardises | « Quantités & tarifs », « Composition », « Votre demande » | « Sucré, salé ou les deux : précisez les variétés et leur répartition. » |
| Brunch box | « Compositions », « Votre demande » | « Consultez le menu et le prix par personne de chaque brunch. » |
| Buffets | « Composer votre buffet », « Votre demande » | « Sucré, salé ou mixte, avec mise en place et dressage selon votre projet. » |
| Plateaux | « Plateaux & tarifs », « Votre demande » | « Choisissez les plateaux et la quantité de chaque référence. » |

Pour un bouton qui ouvre ou révèle un volet, une formulation avec verbe est plus explicite : **« Voir les formats et tarifs »**, **« Voir les saveurs »**, **« Personnaliser le décor »**, **« Préparer mon message »**. Un onglet déjà identifié visuellement peut garder un nom court comme « Saveurs ». Le mot « Autres demandes » reste trop large ; préférer « Votre demande » si le contenu énumère les informations à transmettre.

L’action externe garde le libellé **« Écrire sur Instagram »**. Un accès à une composition ou à un volet ne doit pas être présenté comme une commande confirmée. Si une fonctionnalité de copie est ajoutée, elle porte **« Copier le récapitulatif »** et confirme **« Récapitulatif copié. Collez-le dans votre message Instagram. »** seulement après une copie réussie. Aucune transmission n’a lieu par le simple changement de volet ou de composition.

## Texte de personnalisation et de prix

Les informations peuvent être regroupées autour du choix, puis développées au besoin :

- Layer cake : **« Couleurs, thème, inscription et décor se définissent avec vous. Le tarif dépend du nombre de parts, des saveurs et de la personnalisation. »**
- Bento cake : **« Partagez votre inscription, vos couleurs et une inspiration de décor. Le tarif est précisé en message privé. »** Aucun nombre de parts n’est fourni pour ce format.
- Saveurs classiques layer/bento : **« Un mélange de plusieurs saveurs entraîne un supplément. »** Aucun montant ni nombre de saveurs incluses n’est fourni.
- Cupcakes : **« Le décor peut être personnalisé. Une personnalisation spécifique entraîne un supplément. »**
- Mignardises : **« Les variétés et leur répartition se définissent ensemble. Pour une autre quantité, demandez un devis. »**
- Buffets : **« Le devis tient compte des quantités, des produits et de la mise en place souhaitée. »**
- Plateaux : **« Indiquez la quantité de chaque plateau et le nombre de convives. »** Ne pas convertir les prix en prix par personne ou annoncer une contenance.

Pour la préparation du message : **« Pour préciser votre projet, indiquez : »**, puis les champs propres à la famille. Les détails utiles restent associés à cette aide ; ils ne deviennent pas un long formulaire de commande sans mécanisme de traitement. La date et les allergies ne doivent pas disparaître lors de la réduction du texte.

## Faits à préserver lors de la restructuration

| Domaine | Valeurs ou contraintes de référence |
| --- | --- |
| Layer cakes | Minimum 10 parts ; 15 saveurs classiques ; 9 associations Signature ; tarif en message privé selon parts/saveurs/personnalisation. |
| Bento cakes | Format standard ; 15 classiques uniquement ; pas de nombre de parts fourni ; tarif personnalisé en message privé. |
| Cupcakes | 6/18 €, 12/34 €, 18/50 €, 24/64 €, 30/78 € ; 11 saveurs propres aux cupcakes ; supplément de personnalisation. |
| Mignardises | 35/70 €, 70/135 €, 105/200 €, 140/260 €, 175/320 €, 210/380 € ; sucré/salé, répartition ajustable ; quantités supplémentaires sur devis. |
| Brunch box | Elegancia, Prestige, Le Parisien, Faisalia, Signature, Brunchetta, Dolcezza, Amarizia, Seralia : 30 € par personne. Anatolia : 35 € par personne. Dix compositions complètes avec jus orange ou fraise. |
| Plateaux | Charcuterie 70 €, fromages 70 €, Grazing Platter 60 €, fruits frais 50 €, crudités 45 €. Crudités avec houmous, tzatziki et aïoli. Aucune contenance ou nombre de convives confirmé. |
| Buffets | Sucrés/salés/mixtes ; mise en place et dressage étudiés ; devis personnalisé, aucun prix forfaitaire confirmé. |

Les associations Signature restent exclusivement liées aux layer cakes. Les onze saveurs de cupcakes ne doivent pas être remplacées par la liste classique des cakes. Les compositions brunch ne sont pas des propositions de saveurs pour les autres familles. Conserver Faisalia, Dolcezza, Tropical et Praliné royal selon la règle canonique du texte collé.

Les informations de demande propres à chaque famille restent présentes dans les données. Pour les brunchs, l’heure de retrait doit être demandée sans inventer un lieu ou un créneau disponible. Pour les buffets, préserver lieu, date, horaire, nombre d’invités, mignardises par personne, type de composition, mise en place/dressage, thème et inspirations.

Informations transverses conseillées en phrases courtes : **« Créations sur commande. »**, **« Toutes nos viandes sont halal. »**, **« Signalez vos allergies, intolérances et restrictions avant validation. »** Ne pas convertir la mention des viandes en certification portant sur l’ensemble des ingrédients, ni garantir l’absence d’allergène.

## Risques de régression et contrôles à effectuer

Le changement d’agencement ne doit pas supprimer des informations en les déplaçant dans un volet inaccessible, imposer JavaScript pour lire le contenu essentiel ou mélanger des prix et unités. Les contrôles d’onglets doivent conserver un nom accessible, un état sélectionné lisible et un comportement clavier cohérent ; ces points devront être testés par l’agent responsable du navigateur.

Plus de photos enrichit la présentation, mais une photographie d’ambiance générique ne doit pas devenir la preuve visuelle d’un décor, d’une composition Signature ou d’une réalisation réelle. Tant que les photos du client ne sont pas fournies, conserver une provenance explicite et des textes alternatifs exacts. Ne pas présenter une seule photo de brunch comme l’image de chacune des dix compositions.

Les prix ne doivent pas être recalculés ou affichés comme un devis ferme à partir d’options non chiffrées. Aucun acompte, délai minimal, livraison, frais, disponibilité ou condition d’annulation n’a été fourni.

Le verdict de cette passe concerne la fidélité des données V4 et la pertinence des formulations proposées. La version V5 finale devra encore être relue après intégration, avec vérification des dix menus, des cinq tarifs cupcakes, des six tarifs mignardises et des cinq tarifs plateaux. Aucun nouveau rendu ni résultat fonctionnel n’est revendiqué ici.

## Relecture de la V5 intégrée

Relecture complémentaire du composant `src/components/ProductDetail.astro`, de `src/scripts/product-explorer.ts`, du diff `src/data/site.ts` et des sept fichiers HTML compilés, à la demande du root après sa compilation. La dernière passe de copie reformule les sept introductions et clarifie deux chaînes de résumé brunch. Les introductions sont raccourcies pour éviter les répétitions ; les faits restent dans les formats, prix et contenus des volets. Aucun prix, aliment, nom de composition, saveur, quantité ni champ de demande n’a été modifié.

Un contrôle ponctuel sous Python a lu le texte et les attributs des sept fichiers HTML puis les a confrontés aux exports des données. Résultat : aucune information attendue manquante dans ce périmètre et aucun identifiant dupliqué dans les pages relues.

| Page | Contenu retrouvé dans le HTML compilé |
| --- | --- |
| Layer cakes | Quatre volets ; 15 saveurs classiques ; 9 noms et compositions Signature ; 5 champs de demande ; minimum de 10 parts et prix personnalisé présents. |
| Bento cakes | Trois volets ; 15 saveurs classiques ; 4 champs de demande ; format standard et prix personnalisé, sans transfert du minimum layer ou des associations Signature. |
| Mignardises | Deux volets ; 6 paliers tarifaires ; 4 champs de demande ; sucré/salé, composition et répartition définies ensemble. |
| Cupcakes | Trois volets ; 5 paliers tarifaires ; 11 saveurs propres aux cupcakes ; 4 champs de demande et supplément de personnalisation. |
| Brunch box | Deux volets ; 10 éléments de composition complets, avec noms, sucré, salé et jus ; 5 champs de demande, dont l’heure de retrait ; 9 compositions à 30 € par personne et Anatolia à 35 € par personne. |
| Buffets | Deux volets ; 6 champs de demande ; devis, quantités, composition, lieu/date/horaire et mise en place/dressage préservés. |
| Plateaux | Deux volets ; 5 plateaux tarifés ; 5 champs de demande ; houmous, tzatziki et sauce aïoli pour les crudités, sans capacité inventée. |

Les sept pages comportent aussi la mention des viandes halal, la réalisation sur commande, la demande de signaler les allergies avant validation et la variation possible des tarifs selon les demandes spécifiques. L’action externe reste « Écrire sur Instagram ». Les nouvelles photographies sont décrites comme des photographies d’ambiance, sans attribution aux réalisations de la marque.

Le résumé brunch sépare désormais **« 9 compositions à 30 € / personne »** et **« Anatolia à 35 € / personne »**. Le sélecteur et les boutons reprennent le nom et le prix avec l’unité ; chaque menu affiche également son prix. La lecture de `showBox` confirme que les contrôles et menus utilisent le même index issu des données et qu’aucun calcul de prix ou envoi de demande n’est introduit. Cela reste un constat de source, pas une exécution JavaScript.

La source garde tous les panneaux et les dix menus dans le HTML. Ils sont visibles sans initialisation ; les contrôles interactifs ne sont révélés qu’après validation de la structure et les autres panneaux sont alors masqués. Les rôles, états sélectionnés et raccourcis clavier sont définis dans le script ; leur fonctionnement réel relève de la vérification navigateur du root.

Deux améliorations de clarté ont été signalées puis appliquées par le root et relues dans la source : la répétition des prix en bas du volet brunch est remplacée par « Indiquez le nombre de personnes et l’heure de retrait souhaitée dans votre message. », conforme aux informations de demande fournies ; l’instruction « Ouvrez un volet » est supprimée, ce qui évite une consigne inadaptée au repli sans JavaScript. Les commandes visibles suffisent à nommer les volets.

La dernière passe ajoute près du lien Instagram, hors des panneaux masqués, « Sur commande. Toutes nos viandes sont halal. » et un accès « Allergies & intolérances » vers `/contact/#allergies`. La formulation reste dans le périmètre de la source et ne prétend pas à une certification ni à une absence d’allergène. Ces informations sont ainsi présentes dans la structure commune quelle que soit la sélection du volet ; leur position réelle reste à vérifier au navigateur par le root. Cette dernière relecture porte uniquement sur les modifications de source décrites, sans nouvelle exécution JavaScript ni répétition du contrôle global des données.

**Verdict de cette relecture : aucun écart métier bloquant ni perte d’information détecté dans la V5 relue.** Les vérifications de contenu annoncées ici sont des comparaisons de données, source et HTML. Elles n’établissent aucun verdict de rendu visuel, de défilement, de clavier, de lecteur d’écran ou de navigateur mobile.
