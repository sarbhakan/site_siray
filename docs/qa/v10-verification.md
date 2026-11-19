# Vérification finale — Siray Signature V10

## Résultats exécutés le 19 novembre 2026

- Astro check : 30 fichiers, 0 erreur, 0 avertissement, 0 indice. Build statique : 13 pages.
- Contrôle HTML et HTTP local : 13 pages, aucune anomalie ni avertissement, chemins et destinations locaux résolus. Page inconnue : 404.
- Navigateur intégré : 13 routes aux largeurs 320, 390, 430, 768 et 1 440 px, soit 65 combinaisons. Aucun débordement horizontal du document, un H1 par page, en-tête sticky, aucune image visible cassée et scrollbar masquée. Ces mesures sont dans `v10-responsive.json`. Le contrôle automatisé des libellés de suggestions y utilisait un sélecteur absent ; leur preuve dédiée est dans `v10-flavours.json` et le rendu à 320 px a été inspecté séparément.
- Saveurs : Fruits, Chocolats et Notes gourmandes activés sur layer cakes, bento cakes et cupcakes, à 320 px. Trois boutons de 90,664 px, même hauteur ; une seule famille et son image visibles à chaque activation. Les titres des trois suggestions tiennent dans leur colonne de 88 px. Bento à rubans confirmé dans les suggestions.
- Accueil inspecté à 390, 600 et 1 440 px. Le panneau prune se distingue du header olive. Le cadre du diaporama mesure 3:4, plafonné à 560 px sur ordinateur. Ouverture sur les fruits ; passage automatique aux cupcakes observé et les trois JPEG décodés à leur largeur native (1 536 / 1 152 / 1 324 px). Le fonctionnement n’est pas assimilé à une mesure de fluidité ou de Core Web Vitals.
- Cartes mobiles : bento et cupcakes côte à côte ; buffets et mignardises côte à côte sous « Pour se retrouver ». Cadres identiques de 167 × 208,75 px à 390 px ; actions de la rangée exactement alignées. Le scroll reste fonctionnel avec un header à y=0 et aucune largeur prise par la scrollbar.
- Menu mobile ouvert, lien Bento cakes activé : arrivée sur la bonne fiche et fermeture du menu confirmées.
- Maison : phrase DOM « Explorez nos prestations pour découvrir les sept familles… », texte et lien à 16 px ; aucune localisation isolée dans le contenu principal.
- Neuf JPEG vérifiés par SHA-256 : identiques aux sources fournies, sans recompression. Métadonnées EXIF/ICC/XMP/IPTC et orientation absentes. Les 96 variantes WebP préexistantes restent conservées.
- Contrastes calculés : titre et bouton sur prune 6,964:1 ; texte secondaire 6,119:1.
- Impeccable detect --changed : sortie vide, code 0. Taste copy lint sur 13 HTML : code 0, deux observations INFO et aucun WARN/FAIL. Ces outils sont des contrôles statiques, pas une preuve visuelle.
- Revue indépendante du diff : aucun défaut concret identifié, données métier et URL conservées. Deux autres agents ont revu la composition et les sources photographiques.

## Captures

`v10-home-mobile.jpg` (390 px), `v10-home-desktop.jpg`, `v10-cards-mobile.jpg` et `v10-gatherings-mobile.jpg`. Les captures documentent le navigateur intégré ; elles ne représentent pas un téléphone physique.

## Livraison

Deux ZIP V10 créés depuis le dist testé : 139 fichiers, 13 HTML, 8 767 121 octets par ZIP, même SHA-256 `be2364f1d3a131b0a1701065f3d6bd5cf070940c18d3eac1c6cd3d21a24bd52d`. Les archives excluent sources, documentation, caches et dépendances. Le manifeste et le guide accompagnent les archives dans releases/v10. La publication Git est consignée séparément dans le fichier de livraison publication.json après synchronisation effective.

## Limites

Aucun téléphone physique, Safari/iOS, navigateur Instagram, lecteur d’écran ou mesure Lighthouse/CWV réelle testé. Les nouveaux effets de survol et leurs gardes reduced-motion ont été revus dans le code ; la préférence n’a pas été émulée dans ce navigateur. Aucun site de production n’a été déployé pendant cette passe. L’URL de production reste à attribuer puis à renseigner pour les métadonnées de partage absolues.
