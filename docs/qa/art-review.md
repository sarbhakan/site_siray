# Revue artistique de la façade

18 novembre 2026. Périmètre : capture réelle `home-desktop.jpg`, 1440×900, et comparaison de `src/` avec `DESIGN.md`. Cette revue porte sur la direction artistique du premier écran et la cohérence de la source. Elle ne vaut pas vérification de toutes les pages, de toutes les interactions ou du mouvement.

**Verdict : direction cohérente et façade exploitable pour la revue utilisateur.** Le hero traduit l’intention retenue : image gourmande large, grande phrase de marque, plage ivoire, contraste cacao, appel local et action discrète. Le titre reste la pièce maîtresse. Le logotype est lisible et le menu évite une densité excessive. Le cercle du CTA est assez présent; une surface de bouton remplie n’améliorerait pas cette hiérarchie.

Deux ajustements mineurs sont recommandés :

1. **Rendre le gâteau identifiable dans le cadre large.** Le recadrage actuel montre essentiellement la crème et coupe entièrement le bord supérieur. Tester un point focal vertical de 24–28% sur ordinateur au lieu de 42%, afin de faire apparaître le dessus tout en conservant les volutes. Le cadrage mobile peut garder 42% si le ratio plus haut montre mieux la forme. Le caractère macro est conservé; aucune nouvelle photo ni nouvelle animation n’est nécessaire.
2. **Donner assez de taille à la mention d’ambiance.** Le libellé inférieur est très fin dans le cadre large. Passer cette information de provenance à 12px permettrait de la lire sans attirer davantage l’œil que les contrôles.

La source conserve la direction sur les pages secondaires : vrais index et routes, alternance de compositions photo, champ bordeaux pour le partage, galerie avec filtres et agrandissement. Les coins arrondis ont des fonctions identifiables (contrôles, filtres et action d’événement), plutôt que de transformer tous les contenus en cartes.

Le document `DESIGN.md` a été aligné sur le code : palette hexadécimale réelle, corps général16px, contours arrondis fonctionnels, fondu GSAP600ms manuel avec lecture optionnelle et dialogues natifs. Les comptes Instagram et dépôt GitHub sont désormais des faits confirmés. Les photographies restent des visuels d’ambiance signalés.

Limites de ce verdict : seul le premier écran desktop a été inspecté en image par cet agent. Les vues mobiles, le clavier, les dialogues et les changements d’image sont contrôlés séparément par l’implémentation/QA; aucun résultat les concernant n’est attribué à cette revue. Le plafond de largeur à très grand écran reste un point d’attention du système, consigné dans `DESIGN.md`.

Suivi d'intégration : le point focal desktop28%, les mentions12px et la gouttière plafonnée ont été appliqués. Les captures finales sont régénérées par l'agent principal ; le verdict initial ci-dessus concernait la capture antérieure, avant ces retouches.
