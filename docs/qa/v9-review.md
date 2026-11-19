# Vérification V9 — 19 novembre 2026

Cette passe conserve l’identité olive/ivoire et les photos approuvées. Les sources ont été revues par trois agents aux périmètres distincts, puis l’intégration a été examinée dans le navigateur local.

## Modifications

- Les cinq photos du diaporama sont préparées depuis les JPEG fournis à leur largeur native de 1 152 px, WebP 94. Le diaporama utilise leur fichier principal plutôt qu’une petite variante. Chargement progressif conservé : première scène immédiate, suivantes avant leur fondu. Les originaux reçus fixent la limite de détail ; aucun agrandissement de fichier ni génération de détail n’est appliqué.
- Carte d’accueil : layer cake sur journaux, bento fleuri et perlé, mini hot-dog ; les deux petits cadres et les mignardises passent en portrait 4:5. La photo de l’encart maison retrouve aussi un cadre 4:5. Les images de « Des idées à garder » sont conservées.
- Fiches : bento principal en coffrets et mini hot-dog tenu par une main gantée ; les photos approuvées sont préservées. Les cartes liées sont en portrait centré 4:5. Les photos des volets Signature/demande sont retirées, sans remplacement de remplissage.
- En-tête sticky, décalage partagé pour la photo latérale. Les boutons de volets restent dans le défilement normal.
- Mignardises : nouveau volet Les bouchées, Le coin gourmand et La touche sucrée à partir du texte fourni, sans prix ni recette ajouté.
- Allergies/intolérances : doublon retiré des demandes, lien conservé près du CTA avec les mentions sur commande et toutes les viandes halal.
- Maison : deux portraits et des explications sur pâtisserie, partage et préparation du projet ; lien inline de16 px et interligne26 px, identiques au paragraphe.
- Page crédits et son lien du footer supprimés ; registre de provenance conservé dans les sources.

## Contrôles exécutés

Astro check :29 fichiers,0 erreur,0 avertissement,0 indice. Build statique :13 pages. Audit HTTP/liens/ressources :0 anomalie,0 avertissement. Diff sans erreur d’espacement.

Navigateur IAB :65 cas =13 routes ×320,390,430,768,1440 px. Aucun débordement horizontal, un H1 par page, aucune image visible achevée mais cassée, position sticky présente sur chaque route. Les 19 volets des 7 prestations ont été activés sur ordinateur : un seul volet sélectionné/affiché, aucune photo ni doublon allergies dans la demande. Le nouveau volet des mignardises a également été activé et examiné à 390 px. Menu mobile ouvert et refermé,7 liens de prestations. Diaporama observé en fonctionnement : cinq scènes décodées à1 152 px. Galerie inchangée :26 photos,8 filtres ; filtre Bento activé,4 photos visibles.

L’en-tête reste au bord supérieur après défilement sur accueil mobile et ordinateur. Les captures montrent les cadrages ; une seconde revue indépendante ne relève aucun défaut actionnable sur ces éléments.

Audit indépendant des fichiers :143 assertions réussies,32 images/96 WebP, aucun orphelin, dimensions/poids/métadonnées/empreintes vérifiés. Détails dans v9-asset-audit.json. La copie Taste et le détecteur Impeccable sont des contrôles statiques, distincts de l’examen visuel.

## Limites

Pas de test sur téléphone physique, Safari/iOS ou navigateur Instagram ; pas d’audit lecteur d’écran, mesure Lighthouse ou performance réseau de production. Aucun hébergeur n’est publié par cette vérification. Les quatre illustrations stock conservées et leurs sources sont répertoriées dans docs/image-credits.json.
