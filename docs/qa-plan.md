# Plan de vérification — Siray Signature

Périmètre : une vitrine Astro statique de plusieurs pages, pensée pour mobile et ordinateur, avec échanges de commande sur Instagram. Les photos d’ambiance doivent rester identifiées comme illustratives jusqu’au remplacement par les photos de Siray Signature.

## Contrôles de livraison

1. **Construction et pages.** Exécuter les contrôles TypeScript/Astro disponibles et une construction de production. Servir `dist` et vérifier un HTTP 200 pour chaque route, les liens internes, les ancres et la page 404. Contrôler titre, description, langue française, un seul H1 et les repères sémantiques de chaque page.
2. **Navigation et animations.** Parcourir toutes les pages, revenir en arrière, puis répéter les transitions. Le menu, les révélations, les filtres et les autres événements doivent rester fonctionnels sans doublons. Le contenu essentiel reste lisible sans JavaScript. Les mouvements utilisent surtout `transform` et `opacity` et ne bloquent pas la lecture.
3. **Galerie.** Vérifier les catégories, les résultats, le retour à toutes les images et les légendes. Si une visionneuse existe : ouverture au clavier, nom accessible, fermeture par Échap, retour du focus au déclencheur et absence de piège au clavier.
4. **Clavier et mobile.** Tester Tab/Maj+Tab, Entrée/Espace, le lien d’évitement et un focus visible. Vérifier le menu mobile ouvert/fermé, son état `aria-expanded`, ses liens, Échap, la restauration du défilement et le comportement après changement de page. Cibles tactiles de préférence 44 × 44 px ; aucun élément indispensable accessible au survol seul.
5. **Affichage.** Vérifier les largeurs 375, 768, 1024 et 1440 px, sans débordement horizontal ni contenu tronqué. Refaire un passage à 200 % de zoom. Contraste du texte courant au moins 4,5:1 ; grands titres au moins 3:1. Les images réservent leur espace et possèdent un texte alternatif pertinent, ou vide lorsqu’elles sont décoratives.
6. **Mouvement réduit.** Avec `prefers-reduced-motion: reduce`, supprimer les déplacements et défilements automatiques non essentiels ; garder les changements d’état compréhensibles. Vérifier l’absence de contenu masqué en attente d’une animation et la disponibilité des contrôles manuels des diaporamas.
7. **Exactitude et liens.** Aucun prix, parfum, délai, avis, chiffre, adresse, téléphone ou identifiant Instagram inventé. Aucun faux bouton ni `href="#"`. Le compte confirmé est `https://www.instagram.com/siraysignature/` ; vérifier que les appels à l’échange pointent vers cette URL. Les visuels d’ambiance sont attribués et ne sont pas présentés comme des créations de Siray Signature.
8. **Poids et résilience.** Mesurer le JavaScript, les polices et les images réellement livrés, pas seulement les fichiers source. Objectifs : JS initial compressé ≤ 80 Ko par page, images usuelles ≤ 250 Ko et visuel d’ouverture ≤ 400 Ko, transfert initial mobile autour de 1,5 Mo maximum. Dimensions et formats responsives ; chargement différé sous la ligne de flottaison ; priorité réservée au visuel d’ouverture. Pas de bibliothèque d’animation lourde pour un effet réalisable simplement.
9. **Netlify.** Vérifier `npm run build`, dossier publié `dist`, version Node documentée et routes statiques accessibles directement. Aucun serveur, secret ni service payant nécessaire à la consultation. Documenter la connexion Git et les variables réellement utiles. Ne pas définir un domaine ou un compte non confirmé.

## Méthode et preuve

Audit indépendant du code et des artefacts générés, complété par une vérification visuelle de l’agent principal. Les scripts tiers sont lus avant exécution. Chaque défaut rapporté comporte une situation reproductible, un fichier et la correction minimale ; les contrôles non effectués sont nommés. Aucun score de conformité complet n’est annoncé à partir d’un seul détecteur automatique.

## Destination Git

Au démarrage : aucun remote configuré dans le workspace. Le lien `Nutlope/hallmark` correspond au dépôt source d’un outil de conception. L’utilisateur a ensuite confirmé `sarbhakan/site_siray` comme destination du site. Vérification en lecture seule par le connecteur GitHub : dépôt public existant, branche par défaut `main`, taille déclarée nulle, droits `pull` et `push` disponibles pour le compte connecté. URL de clone : `https://github.com/sarbhakan/site_siray.git`. La vérification QA ne pousse rien.

## Outils chargés

Références Impeccable (`audit`, `harden`, `craft-floor`), Ponytail et UI/UX Pro Max lues depuis les clones du projet. Recherche UI/UX Pro Max exécutée sur le focus clavier et les composants Astro statiques. Le lancement de `impeccable context` a d’abord échoué dans le réseau restreint, puis réussi après autorisation d’accès réseau : moteur 0.1.25 vérifié par le checksum du dépôt, cache local `IMPECCABLE_HOME`, télémétrie désactivée et mode live interdit. À cet instant, aucun `PRODUCT.md` ni `DESIGN.md` n’existait encore ; le brief explicite de l’utilisateur constituait la seule vérité produit. Le moteur confirme le dossier cible et prescrit un détecteur manuel après implémentation ; aucun hook ni réglage global n’a été installé. Le rapport final distinguera les vérifications exécutées et celles qui ne l’ont pas été.
