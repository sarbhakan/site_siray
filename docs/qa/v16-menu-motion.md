# V16 — mouvement du menu mobile

Correction du 21 novembre 2026 : le client signale une ouverture trop rapide et une impression de bug sur téléphone. Le contenu, les couleurs et les photographies sont conservés.

## Changement

La courbe précédente terminait presque tout le déplacement dans les premières 150 ms malgré une durée annoncée de 340 ms. Le panneau entre maintenant depuis la gauche en 560 ms, avec la courbe `cubic-bezier(0.32, 0, 0.2, 1)`. La fermeture volontaire dure 320 ms et repart de la position courante si elle interrompt l’ouverture. Un lien ou un passage au bureau ferme immédiatement le dialogue. Aucun délai artificiel de navigation ni nouvelle dépendance n’est ajouté.

Le dialogue natif reste modal pendant la fermeture. Les animations annulées sont nettoyées et leur promesse rejetée est traitée. Une fermeture native suivie d’une réouverture rapide ne doit ni annuler la nouvelle entrée, ni laisser le bouton Fermer inopérant. La réduction des mouvements et l’absence de Web Animations utilisent un affichage immédiat.

## Contrôles exécutés

- Astro check : 30 fichiers, zéro erreur, avertissement ou hint. Build statique : 13 pages. Contrôle statique des pages : zéro issue ni warning.
- Détecteur Impeccable sur les changements : résultat JSON `[]`. Son contexte existant a été chargé ; les avertissements de configuration préexistants n’ont pas été réparés dans cette passe.
- Navigateur intégré à 390 × 844 : panneau observé en cours d’entrée à x = −114,49 px pour une largeur de 390 px, puis stabilisé à x = 0. Deux captures distinctes attestent ces états, sans constituer une mesure de fréquence d’images.
- État ouvert : focus initial sur Fermer, `aria-expanded=true`, défilement du fond bloqué et largeur de document de 390 px. Tab atteint Accueil dans le dialogue.
- Fermeture par Fermer : mouvement observé, puis dialogue fermé, `aria-expanded=false`, focus rendu à Menu et défilement de page rétabli.
- Échap pendant l’ouverture, puis double Échap : fermeture et retour au bouton Menu observés. Les interactions rapides ne laissent pas de panneau ou de verrouillage résiduel dans ces essais.
- À 320 × 568 : document de 320 px sans débordement horizontal ; dialogue de 568 px de haut avec un contenu de 700 px. Un défilement réel atteint `scrollTop=132` dans le menu, tandis que la page reste à y = 0.
- Lien Galerie du menu : navigation correcte, dialogue fermé sur la destination et menu à nouveau ouvrable après la transition Astro.
- Passage à 1280 px avec le menu ouvert : fermeture immédiate, `aria-expanded=false`, défilement de page rétabli.
- Relecture indépendante du diff et des captures : deux cas de réouverture corrigés, puis aucun défaut supplémentaire identifié.

## Portée

La vérification interactive porte sur le navigateur intégré, aux dimensions indiquées. Aucun test sur iPhone physique, Safari iOS, navigateur Instagram ou lecteur d’écran n’a été effectué. La réduction des mouvements a été auditée dans le code ; la préférence système n’a pas été simulée dans ce navigateur. Aucun score de fluidité ou engagement de 60 fps n’est déduit de ces contrôles.

La publication est vérifiée séparément sur le déploiement Cloudflare correspondant au commit diffusé. Le raccordement du domaine personnalisé reste hors de cette correction.
