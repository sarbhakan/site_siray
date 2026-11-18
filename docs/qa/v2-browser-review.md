# Siray Signature — vérification V2

18 novembre 2026. Rendu dans le navigateur intégré Codex, moteur Chromium, à 360×800, 390×844, 430×932 et 1440×900. Il s’agit de viewports émulés, pas de téléphones physiques.

## Résultat rendu

La matrice v2-responsive.json couvre six routes (accueil, créations, mignardises, buffets, galerie, contact) sur les trois largeurs mobiles : zéro débordement horizontal de document ou de H1. Les titres occupent une ou deux lignes, de 40 à 81 px de hauteur. Le hero mobile est à 34 px, sans césure imposée. À 390 px, les premières cartes commencent vers 808 px au lieu 892 px avant le resserrement. Le début des photos de galerie est à 367 px dans les mesures DOM, contre environ 570 px en V1.

Les captures complètes ont été refaites après défilement pour déclencher les images différées. Les photos de maison et du carnet sont chargées ; les grandes plages vides du premier jeu de captures venaient d’images hors écran non encore téléchargées. Les captures v2-home-mobile-screen.jpg et v2-home-desktop-screen.jpg montrent le premier écran ; les versions sans -screen montrent toute la page.

## Interactions observées

- Le hero passe automatiquement de Cakes à Mignardises après environ6,5 secondes, sans appuyer sur un bouton de lecture.
- Pause fait passer data-running à false et propose Reprendre. Le choix Tables affiche la scène correspondante et conserve la pause. Aucun texte ne couvre les photos.
- Le menu modal ouvre, met aria-expanded à true, se ferme par Échap et rend le focus au bouton Menu.
- Le filtre Cakes actualise #cakes, le compte 2 photographies et la liste visible. La visionneuse se limite à ces 2 images, la flèche clavier droite passe à2/2 ; Échap ferme et rend le focus à l’image d’origine.
- Le défilement horizontal natif des collections atteint les dernières catégories (scrollLeft 935 px) et charge l’image du plateau. Le scroll vertical demeure libre.
- Aucune erreur ou alerte JavaScript relevée dans les logs de la session finale.

## Vérifications de source et limites

Un changement automatique recontrôle l’état de pause après image.decode(), afin de ne pas afficher une image retardée après un arrêt. Les timers et observers sont nettoyés lors des changements de page. Le mode reduced-motion bloque l’autoplay et rend les changements immédiats ; contrôlé dans la source, sans émulation de ce réglage par le navigateur disponible. Sans JavaScript, le HTML et les liens restent présents, le menu/filtres inactifs sont masqués et les liens photo ouvrent leur fichier ; contrôle statique, pas de session navigateur sans JavaScript revendiquée.

Les safe areas et pan-y pinch-zoom sont présents dans le code. Le swipe tactile, le pincement, VoiceOver, le zoom 200 % et les navigateurs Safari/Firefox n’ont pas été testés sur matériel réel. Aucun score Lighthouse, Core Web Vitals ou taux d’accessibilité exhaustif n’est revendiqué.

## Construction et contrôles

Node 24.22.3, Astro 7.4.13. astro check :20 fichiers, zéro erreur/avertissement/hint. Production :12 pages statiques. scripts/check-site.py avec HTTP : zéro problème ni avertissement. Taste copy-lint sur les 12 HTML : zéro finding ; les répétitions interpages correspondent aux composants communs. Impeccable detect --json --changed : liste vide sur les sources prises en charge, portée statique limitée pour Astro. La revue artistique et la revue mobile indépendantes sont archivées à côté de ce rapport.

Des fichiers locaux Documents se sont trouvés marqués dataless par macOS, retardant les lectures et les builds. La validation finale a été effectuée dans un checkout temporaire local avec les mêmes sources (comparaison SHA256 sans différence), les mêmes package/lockfile et Node 24. Aucun changement de bibliothèque destiné à contourner le système de fichiers n’a été introduit.
