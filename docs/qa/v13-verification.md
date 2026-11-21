# Siray Signature — contrôle V13

Vérification du 21 novembre 2026, sur la base main `1457a01b8ecba4020a9a38c1a1d9b1d80c450606`. La passe conserve l’identité olive/ivoire, les contenus métier et la qualité photographique approuvée.

## Corrections livrées

GSAP était inclus dans le script commun à toutes les pages. L’import devient conditionnel au diaporama animé de l’accueil. Les pages sans hero et le mouvement réduit évitent le moteur ; un échec d’import laisse la photo visible et statique. Le délai de 6,5 secondes, le fondu de 850 ms, le décodage préalable, la pause/reprise et le nettoyage Astro restent en place.

Le lien Allergies & intolérances conserve une hauteur tactile de 44 px à toutes les largeurs. La réduction à 24 px sur tablette et bureau a été retirée, avec contrôle de l’alignement autour de l’action Instagram.

## Vérifications exécutées

- Astro check : 30 fichiers, zéro erreur, avertissement ou suggestion ; compilation statique : 13 pages.
- Vérification HTML, routes et ressources sur le serveur local : 13 pages, aucune erreur ni alerte (`v13-static.json`).
- Mise en page navigateur : 65 cas, soit 13 routes sur 320, 390, 768, 960 et 1 440 px ; aucun débordement horizontal, un H1 par page, aucun alt manquant ou image chargée en erreur. Les ressources paresseuses restent vérifiées dans le contrôle statique.
- Les liens des sept prestations du footer mesurés dans ces cas atteignent 44 × 44 px. Le header reste à y=0 en bas d’accueil à 390 px ; le hero suspend alors le défilement.
- Menu mobile : ouverture, fermeture par Échap, retour du focus au bouton Menu, lien Layer cakes ouvrant la bonne fiche avec menu fermé.
- Les 19 volets des sept prestations sont activés ; un panneau attendu reste visible, sans débordement. Flèche droite, Home et End testés au clavier sur Layer cakes avec focus et sélection cohérents.
- Neuf activations des familles Fruits, Chocolats et Notes gourmandes sur Layer cakes, Bento cakes et Cupcakes : image thématique et liste correspondantes ; boutons de même largeur à l’arrondi sous-pixel près.
- Les dix brunchs changent correctement depuis le select mobile ; neuf affichent 30 €/personne et Anatolia 35 €/personne, chacun avec sucré, salé et boisson.
- Les cinq descriptions de plateaux s’ouvrent au clavier (groupe natif exclusif) ; résumés mesurés à 72 px sur téléphone.
- Huit filtres de galerie : total26, layer6, bento4, mignardises3, cupcakes3, brunch3, buffets3, plateaux4 ; URL et annonce concordantes.
- Diaporama : changement réel de fruits à layer cake observé, pause au clic, reprise par Espace, suspension hors vue. Aucune entrée warn/error observée dans la console capturée pendant ces parcours.
- Neuf scénarios simulés couvrent l’import absent, l’import unique, l’échec réseau du module, le nettoyage pendant import, la pause pendant décodage et les états de visibilité/mouvement ; voir `v13-performance-source.md`.
- Neuf JPEG de livraison d’origine comparés aux SHA-256 enregistrés : tous identiques ; aucune photo, variante ni compression modifiée.
- Détecteur Impeccable : exit0, liste vide. Taste copy-lint : 13 HTML, trois observations INFO de rythme, aucun WARN ou FAIL.
- Revue indépendante des sources et du diff : pas de défaut bloquant ni de régression tangible identifié. Contrastes des tokens vérifiés dans `v13-accessibility-source.md`.

## Mesures utiles et limites

Le JavaScript des pages sans hero passe de 34 056 à 8 026 octets gzip, soit −76,4 %. Gzip est calculé séparément par fichier, pas mesuré sur un CDN. L’accueil animé charge aussi 27 048 octets gzip de GSAP ; son total atteint 35 074 octets gzip, soit 1 018 de plus qu’avant le découpage. Le gain concerne les pages qui n’ont pas besoin du moteur, sans dégrader les images.

Les essais utilisent les tailles de fenêtre du navigateur intégré sur cet ordinateur. Ils ne constituent pas des tests sur téléphone physique, Safari iOS, navigateur Instagram, lecteur d’écran ou gestes tactiles synthétisés. Le mouvement réduit, l’absence de JavaScript, l’onglet masqué et les échecs réseau sont vérifiés par les sources/simulations, sans prétendre à une émulation navigateur complète. Aucun score Lighthouse, mesure 4G/CPU, 60 fps garanti ou résultat de Core Web Vitals terrain n’est revendiqué.

## Livrables et publication

Les archives V13 sont préparées séparément dans `releases/v13/`, avec guide officiel actualisé, manifeste, SHA-256 et contrôle d’intégrité ZIP. Le dépôt GitHub sera synchronisé après ces validations ; l’attestation locale de publication identifiera le commit final. Cette passe ne crée pas de compte et ne déploie pas le site sur un hébergeur. L’URL finale n’étant pas attribuée, les métadonnées de partage devront être régénérées avec SITE_URL après son choix. Le site reste fonctionnel depuis les archives portables.
