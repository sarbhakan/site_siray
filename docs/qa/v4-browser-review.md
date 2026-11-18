# Siray Signature V4 — vérification finale

Vérification du 18 novembre 2026, sur la version compilée servie à `http://127.0.0.1:4321/`. Navigateur Chromium intégré à Codex ; dimensions de viewport simulées, sans téléphone physique.

## Pages et présentation

Les 14 routes ont été mesurées à 320, 390, 430, 768 et 1440 px, soit 70 échantillons conservés dans `v4-responsive.json`. Aucun débordement horizontal du document n’a été observé dans ces états stabilisés. Les titres utilisent Gloock, le corps Manrope ; le fond ivoire et les en-têtes/footers olive sont cohérents sur toutes les pages. Aucun texte visible mesuré n’est inférieur à 13 px ; le texte de lecture est fixé à 16 px. Les titres principaux sont à 32 px sous 360 px, 34 px sur mobile courant et 56 px sur grand écran ; l’accueil possède une taille d’affichage propre.

Les captures ont été examinées à taille mobile : accueil, menu, catalogue complet, layer cake, saveurs, tarifs cupcakes, composition brunch, plateaux à 320 px, contact, galerie et footer. Les sept familles sont également visibles ensemble dans `v4-seven-desktop.jpg`. Les photographies restent des images d’ambiance temporaires, créditées, et ne sont pas attribuées à Siray Signature.

## Interactions observées

- Menu mobile : sept liens distincts ; Mignardises ouvre la bonne page et ses six tarifs. Échap ferme le dialogue et restitue le focus au bouton Menu.
- Menu bureau : huit liens (index et sept familles). Le lien Plateaux ouvre la bonne page ; Échap referme le menu et remet le focus sur son résumé.
- Le logo de l’en-tête retourne à l’accueil.
- Brunch : dix compositions, première ouverte ; la composition Anatolia affiche ses éléments et 35 € par personne. Activation par clic puis fermeture par Espace. Résumés mesurés à au moins 76 px de hauteur dans l’échantillon mobile.
- Plateaux à 320 px : cinq lignes tarifaires et accompagnements des crudités lisibles, sans débordement du tableau.
- Galerie : filtre Cakes (deux résultats), mise à jour du fragment d’URL, ouverture de la visionneuse, navigation au clavier ; focus crème visible sur le bouton précédent. Échap ferme la visionneuse et rend le focus à la photo d’origine.
- Journal navigateur consulté en fin de contrôle : aucun avertissement ni erreur parmi les entrées remontées.

Trois groupes de corrections ont été rendus puis inspectés : identité/catalogue ; harmonisation typographique et focus du footer ; simplification de la liste contact et contraste du focus de la visionneuse. Les prises transitoires pendant les navigations Astro et le défilement doux n’ont pas servi de captures finales.

## Contrôles complémentaires

Astro check : 23 fichiers, 0 erreur, 0 avertissement, 0 hint. Astro build : 14 pages statiques. Contrôleur HTML/HTTP : 14 pages, 0 problème, 0 avertissement et réponse 404 sur une route inconnue (`v4-static.json`). Aucun changement de dépendance.

Taste copy-lint : aucun FAIL ni WARN dans le rapport final (`v4-copy-lint.json`), quelques informations de rythme ou titres partagés uniquement. Impeccable `detect --json --changed` : `[]` (`v4-impeccable-detect.json`), avec couverture Astro limitée ; ce résultat mécanique ne remplace pas la revue du rendu.

Deux regards indépendants complètent ces contrôles : fidélité aux documents métier dans `v4-content-source.md` et revue visuelle des captures avec contrastes dans `v4-art-direction.md`. Les suggestions de typographie, de focus et de numérotation contact ont été appliquées.

## Portée et limites

Le diaporama automatique sans rail ni bouton visible conserve le code V3, dont le changement automatique avait été observé à cette version. Aucun nouveau chronométrage V4 n’est revendiqué. La réduction des mouvements, le comportement sans JavaScript et le nettoyage des écouteurs ont été revus dans le code ; ils n’ont pas été émulés à nouveau. Aucun test sur Safari/iOS, téléphone physique, navigateur intégré Instagram ou lecteur d’écran n’est revendiqué. Aucune mesure Lighthouse, Core Web Vitals réels ou validation Netlify en production n’a été effectuée.

La prévisualisation locale reste active, l’onglet d’accueil est conservé pour l’utilisateur et l’override temporaire de viewport a été réinitialisé.
