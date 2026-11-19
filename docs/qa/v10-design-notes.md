# Direction et intégration V10 — 19 novembre 2026

Cette passe répond aux retours sur la lisibilité de l’accueil, le cadrage et la qualité des photos, les boutons de saveurs, les cartes mobiles et le texte de la maison. L’identité de Siray reste fondée sur le logo olive et ivoire. Le travail porte sur l’agencement et les interactions, sans nouvelle prestation, recette, tarification ou information commerciale.

## Demandes et décisions

- **Distinguer l’accueil de l’en-tête.** Le panneau « Vos instants gourmands » reçoit une teinte prune distincte de l’olive de l’en-tête et du fond ivoire des autres sections. Le contraste des textes et des actions reste à contrôler sur le rendu final.
- **Conserver le détail des photos.** Le choix de livraison retenu pour les grands visuels est le JPEG original fourni, sans nouvelle recompression. Les neuf sources concernées sont servies par l’option `sourceOriginal` du composant `Photo`. La résolution native constitue la limite du détail disponible : aucun agrandissement artificiel n’est présenté comme une amélioration.
- **Revoir le diaporama.** La sélection est resserrée à trois photos : plateau de fruits, cupcakes fleuris et layer cake rouge. Le cadre est en portrait 3:4, avec une largeur maximale de 560 px sur ordinateur. Les chargements successifs et les fondus doivent préserver la fluidité ; la perception du piqué et le cycle complet nécessitent une observation dans le navigateur.
- **Corriger les cartes d’accueil.** Les mignardises rejoignent « Pour se retrouver », avec buffets, brunch box et plateaux. « Pour célébrer » réunit layer cakes, bento cakes et cupcakes. Les sept cadres sont en portrait 4:5, centrés, sans ancien bandeau horizontal de mignardises ni décalage vertical décoratif. Le layer cake sur fond de journaux utilise sa source portrait 1 152 × 2 048 px avec un ajustement vertical à 65,789 %.
- **Aligner la composition mobile.** Sous 600 px, le layer cake occupe la première rangée puis vient le duo bento/cupcake ; les quatre cartes de partage forment deux rangées de deux. Dès 600 px, les trois cartes de célébration sont alignées en trois colonnes. Les cartes de partage passent à quatre colonnes dès 960 px. Les actions « Découvrir » s’alignent en bas de chaque rangée même lorsque les descriptions occupent des hauteurs différentes.
- **Uniformiser les boutons de saveurs.** Les onglets Fruits, Chocolat et Notes gourmandes utilisent trois colonnes de largeur égale. Les états sélectionnés, le focus et la taille minimale de la zone cliquable restent présents.
- **Varier les cartes liées.** La photo des bento cakes dans « À découvrir aussi » devient le bento à rubans. Les trois suggestions restent groupées sur mobile avec une typographie adaptée à la place disponible, et des cadres portrait 4:5.
- **Clarifier la maison.** Des espaces explicites encadrent le lien « nos prestations » dans sa phrase. La ligne isolée « Bordeaux & Gironde » est supprimée ; la localisation reste dans le paragraphe d’introduction existant.
- **Ajouter un mouvement mesuré.** Les interactions à la souris peuvent décaler les éléments cliquables de 2 px ou agrandir très légèrement leur photo à 1,015. Les animations sont réservées aux appareils disposant du survol ; la préférence de réduction des animations les neutralise.
- **Masquer la barre latérale.** La barre de défilement visuelle est retirée sans bloquer le défilement du document ni modifier la navigation au clavier.
- **Conserver les éléments approuvés.** La photo de l’encart « L’art de sublimer vos instants gourmands » et les images de « Des idées à garder » ne font pas partie des remplacements de cette passe.

## Références de travail

Le Dev Toolkit, les consignes Impeccable de finition et de cohérence visuelle, Taste et Unslop orientent les choix : alignements réels, échelle typographique stable, cadrages compatibles avec les sujets et retours d’interaction sobres. Ces références n’attestent ni la réussite d’un contrôle automatique ni une validation visuelle.

## État des contrôles à la rédaction

Le contrôle Astro exécuté après la modification des cartes d’accueil a retourné 29 fichiers examinés, 0 erreur, 0 avertissement et 0 indice. Ce résultat est intermédiaire : il précède la fin de l’intégration des photos et des styles V10. Il ne remplace pas un contrôle complet après intégration.

Aucun test navigateur V10 n’est attesté dans cette note à ce stade. Restent à observer : accueil à 320, 390, 430, 768 et 1 440 px ; piqué et cadrage des trois scènes du diaporama ; absence de débordement horizontal ; défilement et en-tête fixe ; largeur et activation des saveurs ; alignement des cartes ; liens de la maison ; survol, focus clavier et réduction des animations. Les captures et résultats finaux doivent être consignés séparément lorsqu’ils sont réalisés.

La livraison cible `releases/v10/` avec deux archives statiques, un manifeste, le guide de déploiement et les sommes SHA-256. Leur existence et leur intégrité doivent être confirmées par le script de packaging. Aucune URL de production, réservation de nom ou publication distante n’est attestée par cette note.
