# Vérification du rendu et des interactions

18 novembre 2026. Contrôles de l'agent principal dans le navigateur intégré, sur l'export de production servi localement.

## Résultats observés

- Premier écran à 1440×900 et 1280×800 : titre, contexte Bordeaux/Gironde et action visibles. À 1280×800, le bas de l'action est à 728px. Le cadrage final du gâteau laisse voir son dessus ; les mentions supérieures reposent sur un fond ivoire opaque.
- À 390×844, les onze routes de contenu ont un H1 visible, aucune image chargée cassée et aucune largeur de document supérieure au viewport. Mesures enregistrées dans `responsive-routes.json`.
- Vérifications supplémentaires de l'index des créations à 320px, 768px et 1920px : aucune largeur de document excessive. Les marges de contenu sont plafonnées par un calcul de gouttière sur grand écran.
- Menu mobile : ouverture modale, fermeture par Échap et retour du focus sur Menu confirmés. Le dialogue fermé ne conserve pas le verrouillage du défilement.
- Diaporama : passage effectif de01/03 à02/03 avec changement de photographie et de libellé. Le défilement automatique est facultatif et le premier état est fixe.
- Galerie : filtre Douceurs annoncé à3photographies, URL `#douceurs`, images correspondantes visibles. La visionneuse affiche l'image, avance dans la sélection active et se ferme par Échap. Le focus revient à la photographie d'origine.
- Les liens de navigation provoquent une vraie navigation Astro entre pages. Les événements restent fonctionnels après ces navigations.
- Aucun avertissement ni erreur console capturé pendant ces parcours.
- Tailles finales contrôlées dans le navigateur : mention d'ambiance et sous-marque Signature à12px sur téléphone. Les principales descriptions sont à16px.

## Limites

La largeur mobile est une émulation de viewport, pas un test sur téléphone physique. Le clavier a été utilisé pour Échap et la restauration du focus ; aucun lecteur d'écran n'a été testé. Le swipe est implémenté mais n'a pas été simulé par ce contrôle. La lecture automatique n'a pas fait l'objet d'un essai chronométré de longue durée.

Le mode sans JavaScript a été contrôlé dans les fichiers générés : contenu, navigation de secours, première photographie et liens directs vers les images restent présents. La désactivation de JavaScript et l'émulation de `prefers-reduced-motion` ne sont pas exposées par ce navigateur ; leur comportement n'est donc pas présenté comme un test rendu. Les règles CSS et la branche JS correspondantes ont été revues indépendamment.

Ce passage ne constitue ni une certification d'accessibilité ni une mesure Lighthouse/Core Web Vitals. Les photographies restent des ambiances temporaires et les informations légales complètes doivent être ajoutées avant le lancement commercial.

Complément petit écran : à320px, le titre Contact débordait dans son propre bloc. Après correction à44px, le contenu et le bloc mesurent tous deux261px. Le rendu final est recompilé avec Node24.22.3.
