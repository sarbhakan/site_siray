# Cadrer une photographie au doigt — V21

Le champ photo accepte un glissement directement dans « Résultat sur le site ». La photo suit le geste, les curseurs et le rectangle sur l’original suivent la position. Le fichier, son zoom, ses légendes et sa catégorie restent conservés. Il faut toujours Enregistrer pour publier.

L’implémentation emploie les [Pointer Events W3C](https://www.w3.org/TR/pointerevents/) : capture d’un pointeur principal, arrêt au relâchement, à l’annulation et à la perte de capture. Un second pointeur n’écrase pas le premier. La zone tactile `touch-action:none` est limitée au cadre possédant un débordement visible ; la page, l’image entière et l’original conservent leur défilement natif. Les trois curseurs restent utilisables au clavier. Aucun nouvel accès, secret, abonnement ou dépendance.

La position correspond au débordement réel après object-fit et zoom. Exemple : source1200×1600, cadre150×200, zoom1,5, position50%50% ; un geste de +15px horizontal et −20px vertical donne30%70%. Les limites0–100% empêchent les marges vides. Une image au ratio exact et au zoom1 ne peut pas bouger : l’aide invite à resserrer légèrement le cadre.

## Vérifications

- Revue indépendante : aucune anomalie bloquante.
- 170 contrôles du widget, dont conservation des63 photos existantes, géométrie81 combinaisons, gestes tactiles simulés, capture/annulation, second pointeur, changement de source et de zoom.
- 232 autres cas Node (validation des contenus, rendu du cadrage public, suivi de publication, rubriques et accès CMS) réussis. Le widget constitue un fichier de test Node supplémentaire.
- Build Astro réussi ; contrôle statique16 pages, aucune anomalie ni avertissement.
- Navigateur réel via les outils hôte : aperçu React390×844, zoom1,3 puis glissement(+12px,−15px) →23,064%75,253%, curseurs synchronisés et capture libérée. Image entière et remise à zéro reviennent à touch-action:auto.
- Navigateur1280×900 : déplacement à la souris et changement de format, aucune erreur/warning console observé. Pas d’essai sur téléphone physique dans cette passe.
- Aucun contenu métier de test enregistré. Modifications de Selin intégrées avant travail depuis e112dbe. Publication Git avec vérification de la tête distante, sans forçage.

La capture et le témoin de déploiement final sont livrés dans le dossier releases/v21-cadrage-au-doigt du workspace utilisateur.
