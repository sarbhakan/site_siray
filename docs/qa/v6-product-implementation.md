# Siray Signature V6 — présentation des prestations

Implémentation du 18 novembre 2026 dans `ProductDetail.astro` et `product-explorer.ts`. Les observations ci-dessous décrivent le code ; la vérification navigateur et les captures sont réalisées séparément par l’agent principal.

## Repères de lecture et défilement

La composition photographique conserve son `position: sticky` sur ordinateur, à partir de 960 px. Les commandes de rubriques suivent désormais le défilement normal : elles ne restent plus collées au bord supérieur. La photo latérale est la seule surface sticky de la fiche.

Les sept familles gardent leurs volets, leurs tarifs et leurs modalités. Les premières possibilités sont mises en gras pour faire ressortir le format, le type de composition ou le choix proposé. Les notes sous les quantités utilisent toute la largeur du panneau, sans mesure de texte réduite. Le texte sur les quantités supplémentaires des mignardises a été raccourci en préservant le devis et l’ajustement aux besoins/convives. Les informations près d’Instagram portent « Sur commande · Viandes halal » en gras ; la phrase complète sur toutes les viandes demeure dans le volet de demande.

La note de mélange des saveurs est « Mélanger plusieurs saveurs entraîne un supplément. », en gras. Aucun `white-space: nowrap` n’est imposé à ces phrases : une largeur étroite peut produire un retour naturel pour éviter un débordement ou une réduction excessive de la police.

## Familles de saveurs

Les layer cakes et les bento cakes disposent de trois sous-onglets Fruits, Chocolats et Notes gourmandes. Chaque sous-onglet affiche sa propre photographie thématique puis sa liste, directement dessous. Les quinze saveurs classiques sont conservées sans ajout ni retrait.

Les onze saveurs de cupcakes suivent la même présentation : six saveurs fruitées, Nutella dans Chocolat, quatre Notes gourmandes. Il s’agit d’un regroupement de lecture, sans nouvelle saveur ni affirmation de recette. La photo étroite placée à côté de l’ancienne liste a été supprimée.

Les commandes utilisent la même fonction d’amélioration progressive que les volets principaux : rôles tablist/tab/tabpanel, relations ARIA, sélection unique, tabindex itinérant, flèches/Home/End. Les identifiants sont propres à chaque famille. Sans JavaScript, les trois familles de saveurs restent développées avec leurs titres et leurs images. À l’impression, les listes sont toutes restituées. Les écouteurs restent nettoyés avant les transitions Astro.

## Signature, images et brunch

Les neuf associations Signature sont directement lisibles dans le volet, sous forme de noms et compositions. Elles ne demandent plus neuf ouvertures d’accordéon. La liste adopte deux colonnes sur grand écran et une sur mobile ; toutes les compositions restent celles des sources V4.

La préparation de demande utilise une image de la famille choisie plutôt que la photo des framboises de Signature. Le bento reçoit l’asset `bento-detail` dans cette rubrique et un détail de crème dans la composition principale ; sa nouvelle image principale est gérée par l’agent principal dans les données. Aucun cupcake n’illustre le bento. Les images chocolat et notes gourmandes sont également intégrées par l’agent principal, avec variantes et crédits. La mention visible « Photographies d’ambiance » sous les photos est retirée de ce composant.

Les dix choix brunch et leurs prix restent inchangés. Sucré, salé et boisson ont une hiérarchie plus visible, une surface légèrement différenciée et des lignes d’aliments distinctes. La note devient « Précisez le nombre de personnes et l’heure de retrait. », sur toute la largeur.

## Contrôles exécutés par cet agent

- `astro check` : 25 fichiers, zéro erreur, zéro avertissement, zéro hint après les changements fonctionnels ; les derniers ajustements consécutifs portaient uniquement sur les noms et alternatives des images.
- `git diff --check` : aucune erreur d’espace.
- Relecture des groupes : 15 classiques, 11 cupcakes et 9 associations Signature, sans transfert de saveurs entre les offres.

Aucun build final ni test interactif navigateur n’est revendiqué dans cette note. Les sources de conception lues sont Impeccable craft-floor/adapt/clarify et Taste sections/copy, en complément des documents du projet. L’identité olive/ivoire et les polices existantes sont conservées.
