# Siray Signature V4 — direction et revue visuelle indépendante

## Périmètre et sources

La V4 doit harmoniser les pages et organiser sept familles distinctes. Le logo fourni est la référence de marque : une calligraphie ivoire sur un fond olive texturé. Les documents commerciaux fournissent le contenu ; ils ne sont pas des instructions techniques. L’agent de direction ne modifie aucun fichier de l’application et n’utilise pas le navigateur pendant le travail de l’agent principal.

Références lues : Unslop (Damir Sokolovsky, CC BY 4.0), ses passes de cohérence, la section Type et les principes de système/couleur de Taste (`references/system.md`), les principes de composition et de responsive de Taste (`references/layout-v4.md`), et le `craft-floor.md` d’Impeccable. Les règles génériques de pages à hauteur de viewport ne conviennent pas à ce catalogue mobile dense : la demande utilisateur de lisibilité et de contenu complet prime.

## Audit avant modification

- La palette cerise noire/crème V3 appartient à une proposition antérieure et doit désormais suivre le logo olive.
- La marque écrite en deux polices dans le header doit devenir le vrai logo fourni, avec un lien d’accueil accessible.
- Les familles fusionnées mignardises/cupcakes et buffets/plateaux empêchent de trouver rapidement la prestation demandée.
- Le panneau typographique bento ne satisfait plus la demande explicite d’une photographie distincte par famille ; une photographie illustrative distincte doit rester identifiée honnêtement jusqu’aux vraies réalisations.
- Les tailles et espacements hérités ne doivent pas être copiés dans les nouveaux blocs de tarifs et de saveurs. Un même rôle doit garder une même présentation d’une page à l’autre.

## Direction en cinq lignes

- Produit : une carte de pâtisserie, de brunch et de réceptions sur commande à Bordeaux et en Gironde, dont la demande se poursuit sur Instagram.
- Caractère : délicat, posé, accueillant.
- Monde : papier ivoire d’une carte, olive du logo, plats et détails des créations.
- Moments : la calligraphie réelle de la marque et les photographies de chaque famille ; les tarifs et compositions restent calmes et faciles à lire.
- Signature : le vrai sceau calligraphique olive/ivoire, utilisé dans l’en-tête et en clôture sans ajouter de motifs ou de pseudo monogramme.

## Palette et hiérarchie proposées

Les couleurs ci-dessous sont une proposition dérivée visuellement du logo, pas une prétention de pipettage exact du fichier.

| Rôle | Couleur |
|---|---|
| Olive de marque et action principale | #4E533D |
| Encre | #303528 |
| Papier | #F5F1E8 |
| Surface secondaire | #E9E4D7 |
| Ivoire clair | #FFFCF6 |
| Texte secondaire | #626452 |
| Filet | #D4D3C4 |
| Texte secondaire sur olive | #E7E4D5 |

Calculs WCAG en sRGB : encre/papier 11,19:1 ; ivoire/olive 7,80:1 ; texte secondaire clair/olive 6,26:1. Le gris #686958, initialement envisagé, n’atteint que 4,41:1 sur la surface secondaire et n’est donc pas recommandé. Les valeurs finales devront être contrôlées sur le code livré.

Gloock 400 pour h1/h2, Manrope 400/600 pour le texte, les contrôles et les tableaux. Sur mobile : h1 34 px / 1,14 ; h2 28 px / 1,2 ; h3 22 px / 1,3 ; texte courant 16 px / 1,625 ; métadonnées 14 px. Les prix utilisent les chiffres tabulaires, alignés dans une colonne plutôt que transformés en affiche. Les titres de collection restent lisibles en deux lignes maximum quand la longueur le permet ; ne pas imposer de retours artificiels ni réduire la police pour masquer un débordement.

## Logo exact dans la navigation

Le fichier transmis contient à la fois le fond et les lettres, sans transparence. Il faut conserver ce dessin exact et ses couleurs. L’intégration proposée est un SVG inline dont le `viewBox="190 420 760 470"` recadre l’image originale 1215 × 1231 ; un élément `image` porte le PNG original. Cette intégration est une fenêtre de présentation, sans redessin ni altération des pixels. Un SVG externe affiché par `img` ne doit pas dépendre d’une image externe, car cette sous-ressource peut être bloquée par le navigateur.

Le recadrage doit préserver intégralement les boucles du S et du y, le mot SIGNATURE et le petit détail du y. Une taille de 132 × 82 px dans un header olive est préférable à un logo minuscule ; la texture originale se lit alors comme la matière de la marque. Le lien possède `aria-label="Siray Signature, accueil"` ; l’image interne est décorative pour éviter un doublon de nom accessible. Le footer peut utiliser une version 148 × 92 px. La lisibilité visuelle du petit mot SIGNATURE sera un point de contrôle lors des captures.

## Rythme mobile et composants

Marges latérales 20 px, réduites à 16 px sous 360 px. Système de 4 px : 8–12 px à l’intérieur d’un groupe, 16–24 px entre groupes, 40–48 px entre sections mobiles. Les pages n’ont pas de hauteur minimum artificielle. Les longues compositions de brunch sont des listes nettes ou des détails natifs, avec titre et tarif accessibles avant ouverture ; elles ne doivent pas prendre la forme de dizaines de cartes imbriquées. Les tarifs en deux colonnes doivent garder quantité et montant visibles sans défilement horizontal à 320 px.

Une action principale par zone, des liens utiles, aucun badge halal décoratif ou pseudo label de certification. L’information « Toutes nos viandes sont halal » est un fait transversal en texte, avec la demande de signaler allergies et intolérances. Aucun bouton Pause, nom de scène ni durée ne revient sur le hero. Le fondu photographique déjà demandé constitue le mouvement principal ; pas d’animation cosmétique sur chaque bloc.

## Revue après intégration

Revue finale du 18 novembre 2026, après intégration. Aucun défaut visuel bloquant relevé dans les dix captures examinées et la source concernée.

### Captures examinées indépendamment

- `v4-home-mobile.jpg` et `v4-home-desktop.jpg` : identité, navigation et composition du premier écran.
- `v4-menu-mobile.jpg` : hiérarchie des liens et accès distinct aux sept familles.
- `v4-catalog-mobile.jpg` : page complète des prestations, photographies distinctes, titres, introductions, résumés de tarifs et liens.
- `v4-layer-mobile.jpg` et `v4-flavors-mobile.jpg` : page produit et liste complète des saveurs classiques.
- `v4-cupcakes-mobile.jpg` : les cinq formats et tarifs, avec la transition vers les saveurs.
- `v4-brunch-mobile.jpg` : une composition ouverte, son prix et la séparation sucré/salé/boisson.
- `v4-plateaux-320.jpg` : cinq tarifs à la plus petite largeur documentée.
- `v4-footer-mobile.jpg` : clôture de page, logo, action Instagram et navigation.

Ces fichiers sont des captures produites par l’agent principal puis ouvertes et examinées par l’agent de revue. Les dimensions des fichiers JPEG sont celles de l’export de l’outil ; elles ne valent pas preuve d’un test sur téléphone physique.

### Résultat visuel

La palette olive/ivoire est cohérente entre l’en-tête, le hero, les contenus, les tableaux, les compositions et le footer. La photographie porte le détail ; l’interface reste calme. Gloock sur les titres apporte un caractère éditorial accordé à la calligraphie du logo, tandis que Manrope garde les longues compositions et les tarifs faciles à parcourir.

Le vrai dessin de la marque est visible dans le header, le menu et le footer. Le recadrage inline de `BrandMark.astro` conserve les boucles du S et du y et le mot SIGNATURE. La texture du fichier est assumée dans une fenêtre rectangulaire sur le fond olive. Aucun nom de marque recomposé ne remplace l’image. Le lien d’accueil porte son nom accessible dans le HTML.

Sur mobile, les titres restent compacts, les marges alignées et les retours à la ligne naturels. Les longues saveurs comme « Croustillant au chocolat praliné » restent dans leur colonne. Les tarifs cupcakes et plateaux gardent la quantité ou l’intitulé à gauche et le montant à droite ; aucun montant ne collisionne avec la description sur les vues examinées. Le catalogue complet distingue les sept offres et répète un traitement stable pour les photographies, titres, textes, prix et liens.

La navigation mobile montre directement les sept liens, sans fusion mignardises/cupcakes ou buffets/plateaux. La clôture utilise la même identité, avec une seule invitation à écrire et une navigation en deux colonnes. Le hero n’a retrouvé ni rail de catégories, ni durée, ni bouton Pause visible. Les espaces visibles correspondent aux groupes de contenu ; aucun vide résiduel accidentel n’a été relevé dans ces captures.

### Corrections issues de la revue

Les tailles initiales du composant ProductDetail ont été alignées sur les tokens globaux : h1/h2 n’imposent plus leur propre grille concurrente. Les textes de lecture utilisent 16 px ; les métadonnées ne descendent plus à 11 px. Le focus du footer est désormais crème sur olive, au lieu du vert global de contraste insuffisant sur cette surface. Les numéros décoratifs de la liste « Les détails utiles » de la page contact ont été retirés dans la source ; cette dernière modification n’est pas documentée par une capture distincte dans cette revue.

### Contrastes des tokens finaux

Les couleurs du CSS livré correspondent à la direction proposée. Calculs WCAG en sRGB réalisés indépendamment à partir des valeurs du code :

| Paire | Rapport |
|---|---:|
| Encre #303528 / papier #F5F1E8 | 11,19:1 |
| Secondaire #626452 / papier #F5F1E8 | 5,38:1 |
| Secondaire #626452 / surface #E9E4D7 | 4,78:1 |
| Papier #F5F1E8 / olive #4E533D | 7,09:1 |
| Secondaire clair #E7E4D5 / olive #4E533D | 6,26:1 |
| Focus #717746 / papier #F5F1E8 | 4,21:1 |
| Focus #717746 / ivoire #FFFCF6 | 4,63:1 |

Le focus est une bordure d’interface ; le seuil de 3:1 lui est applicable. Le texte secondaire passe le seuil de 4,5:1 sur les surfaces claires. Le dropdown clair possède son focus olive propre et le footer son focus crème, ce qui évite d’appliquer une couleur d’anneau identique sur deux fonds opposés.

### Mesures rapportées et limites

Le fichier `v4-responsive.json` produit par l’agent principal contient 70 échantillons : 14 routes à 320, 390, 430, 768 et 1440 px. Il rapporte zéro débordement horizontal, le même couple Manrope/Gloock et les mêmes fonds, et un texte visible minimal de 13 px. Ces mesures du navigateur de l’agent principal complètent la revue visuelle ; elles n’ont pas été réexécutées indépendamment par l’agent de direction.

La revue ne constitue pas un test de Safari, d’un téléphone physique, du navigateur embarqué Instagram ni d’un lecteur d’écran. Les images de prestations restent des photographies d’ambiance en attendant les réalisations de Siray Signature. Les contrôles de fidélité commerciale relèvent du rapport `v4-content-source.md`. Aucun autre ajustement visuel n’est demandé dans le périmètre examiné.
