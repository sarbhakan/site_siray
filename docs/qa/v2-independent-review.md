# Siray Signature V2 — revue indépendante mobile

État : revue source corrigée et revue visuelle du 18 novembre 2026. Accueil mobile final, galerie mobile et contact mobile inspectés. Accueil bureau inspecté au premier cycle ; sa preuve finale doit être rafraîchie après chargement des photos du carnet. Les interactions navigateur restent vérifiées par l’agent principal, séparément. L’agent de revue n’a pas modifié l’application.

## Lecture source

Les principaux défauts V1 sont traités dans la nouvelle composition : header de 68 px, titre d’accueil de 34 px, corps de 16 px, photo sans badges ni lecteur circulaire, catégories accessibles par de vraies images/liens sur un rail natif. La couleur du hero et celle de l’en-tête sont liées à la même variable. Les styles mobiles précèdent les adaptations bureau ; le fichier n’accumule plus les corrections finales de la V1.

Les cibles principales ont une hauteur suffisante : menu 44 px, scènes du hero 48 px, Pause 44 px, filtres 44 px et boutons de lightbox 44 px. Le petit « + » de galerie ne porte pas seul l’interaction : toute la photo est un lien, ce qui donne une grande cible. Le lien de breadcrumb à 36 px reste une cible secondaire plus petite que l’objectif de 44 px.

Le défilement des catégories est natif (`overflow-x: auto`, scroll snap), sans interception du scroll de la page. Le hero autorise le pan vertical. La lightbox et le menu utilisent des dialogues natifs ; le body bloque son scroll quand ils sont ouverts. Les contrôles visibles et les liens restent utilisables sans dépendre d’un état de survol.

Le hero démarre automatiquement sur un délai de 6,5 s ; il décode la photo cible avant le fondu, suspend le timer dans un onglet masqué et hors intersection, et coupe le mouvement sous `prefers-reduced-motion`. Les scènes et le texte Pause/Reprendre sont des boutons nommés ; le toucher et le changement manuel mettent en pause. Les timers, animations et observateurs sont nettoyés aux changements de page Astro. Il n’y a pas d’annonce live automatique répétitive.

## Corrections transmises puis appliquées

1. **Course entre décodage et pause** : le parent a distingué `change(next, automatic)` et ajouté `(automatic && !canRun())` après `img.decode()`. Une pause, un masquage d’onglet ou une préférence de mouvement réduit survenant pendant cet await empêche désormais l’ancienne demande automatique de changer la photo. Un changement manuel reste possible lorsqu’on est en pause. Vérifié dans le source.
2. **Safe areas** : le parent a protégé les côtés de l’en-tête, des sections et du rail ainsi que le haut et les côtés des dialogues par `env(safe-area-inset-*)`. Le bas des dialogues était déjà protégé. Vérifié dans le source ; matériel à encoche non testé par cet agent.
3. **Pincement sur le hero** : le parent a remplacé `touch-action: pan-y` par `pan-y pinch-zoom`. Le seuil directionnel du swipe reste présent. Vérifié dans le source ; geste sur téléphone physique non testé par cet agent.

La progression ne reste pas figée à son état partiel : quand la lecture est suspendue, l’animation CSS est retirée et le segment actif devient plein ; à la reprise, le timer et l’animation repartent sur un cycle complet. Cela reste cohérent si cette convention est assumée. La durée de décodage peut prolonger l’état plein avant un changement sur réseau lent ; la photographie en cours reste affichée pendant l’attente.

## À vérifier sur les captures et dans le navigateur

- Rendu de 360 × 800, 390 × 844, 430 × 932 et 1440 × 900 ; aucune mesure inférée du seul code ne vaut validation de ces vues.
- Le titre, le texte et le CTA précèdent la photographie : contrôler leur hauteur totale, la place de la photo, la première amorce de catégorie et le temps nécessaire pour comprendre les prestations.
- Texte réel du rail « Cakes / Mignardises / Tables / Pause » sans conflit ni saut de ligne et sans déplacement à la reprise (« Reprendre » est plus long).
- Galerie : première image avant y = 440 px à 360 px et avant y = 420 px à 390 px ; lignes du titre et de la description, filtres et statut sans débordement.
- Photos : cadrage du gâteau au premier affichage et des deux autres photos ; pas d’éclair de fond au fondu ; indice actif correspondant à la bonne photo.
- Au moins deux changements en 15 s ; toucher/Pause puis observation prolongée sans changement ; Reprendre ; changer de scène ; revenir d’une autre page sans double timer.
- Mouvement réduit, focus clavier, menu, sortie de lightbox avec retour du focus, paysage et zoom texte 200 %.
- L’information « photographies d’ambiance » demeure disponible sans être superposée aux produits ni répétée à chaque écran.

## Revue visuelle V2

Premier cycle examiné : `v2-home-mobile.jpg` (375 × 3893 pixels) et `v2-home-desktop.jpg` (1425 × 4335 pixels), captures pleine page.

Le haut mobile est nettement plus cohérent que la V1 : titre sur deux lignes, introduction sur deux lignes, bouton nommé, puis photo libre et rail simple. L’en-tête, le hero et son rail sont un même chapitre bordeaux ; la rupture vers le catalogue est claire. La photo du gâteau retrouve sa place de contenu principal. Les titres courants sont plus compacts et leurs axes sont alignés avec les paragraphes et les photos.

La première photographie de catégorie commence vers y = 892 px dans cette capture. Le parent prévoit de la remonter d’environ 90 px en resserrant le hero et en supprimant la phrase redondante sous le titre de catalogue ; cela améliore l’amorce de contenu au premier défilement. Une nouvelle capture doit confirmer le résultat à 360/390/430 px.

La page entière ne peut pas être validée avec ces premières captures : sur mobile la photo « maison » et les trois photos du carnet sont absentes ; sur bureau les trois photos du carnet sont absentes. Leur espace existe. Les images concernées sont chargées en différé ; le signal évoque une capture pleine page avant qu’elles soient entrées dans la fenêtre, et ne prouve pas à lui seul un défaut d’affichage utilisateur. Demande transmise au parent : faire défiler les blocs, attendre le chargement et le décodage, puis capturer de nouveau. Le bouton « Aller au contenu » est visible dans la capture bureau : vérifier/corriger l’état de focus de la capture et son placement avant livraison.

La composition devient exploitable et plus lisible. Sa singularité dépend encore fortement de la photographie et de la mise en scène réelle de Siray Signature ; les photos d’ambiance ne suffisent pas à valider la personnalité finale de la marque. Il faut garder la retenue actuelle plutôt qu’ajouter des effets décoratifs pour compenser ces images provisoires.

La capture mobile d’accueil a été mise à jour à 20:47. Les photos de la maison et du carnet sont toutes présentes ; les grandes zones vides du premier cycle ont disparu. Le titre de la maison utilise désormais la même voix que les autres contenus. Le premier bord d’image de catégorie apparaît vers y = 808 px, soit un gain d’environ 84 px. Le panneau typographique du bento annonce un petit format sans lui substituer la photographie d’un gâteau sur pied. Son amorce coupée à droite appartient au rail de défilement et annonce la carte suivante ; il ne s’agit pas d’un débordement de la page. La page entière est cohérente du haut au pied, sans défaut visuel mobile bloquant dans cette capture.

`v2-gallery-mobile.jpg` (375 × 812 pixels) : titre sur une ligne, introduction sur deux lignes, filtres lisibles, première photographie vers y = 353 px. L’objectif de première image avant 420 px est atteint dans cette vue. Les deux colonnes ont des espacements réguliers et des légendes alignées. La mention d’ambiance est disponible dans l’introduction.

`v2-contact-mobile.jpg` (415 × 899 pixels) : titre sur une ligne, introduction sur trois lignes, destination Instagram nette et liste d’informations bien alignée. La quatrième information prend deux lignes sans décaler la colonne de numéros. Le texte précise que tarifs et modalités seront définis dans l’échange, sans information commerciale inventée.

`v2-responsive.json`, produit par l’agent principal puis relu indépendamment, contient 18 mesures sur six routes (`/`, `/creations/`, `/creations/mignardises/`, `/buffets/`, `/galerie/`, `/contact/`) à trois largeurs de fenêtre 360/390/430 px. Dans chaque entrée, `scroll === client`, `h1Overflow === false` et la hauteur du H1 reste entre 40 et 81 px. Ces mesures établissent l’absence de débordement horizontal dans ce périmètre ; elles ne constituent pas une certification de toutes les routes, du zoom 200 %, des safe areas réelles ou des gestes sur un téléphone physique.

`v2-home-mobile-screen.jpg` montre le bas de la page dans l’état relu : ne pas le présenter comme une capture du premier écran. La full-page mobile mise à jour est la preuve pertinente du rendu complet. Aucun nouveau défaut bloquant relevé ; validation des interactions et dernière capture bureau à conserver dans le rapport du parent.
