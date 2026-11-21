# Zoom à deux doigts dans le CMS — V22

Dans Résultat sur le site, écarter deux doigts zoome la photo et les rapprocher dézoome. Le point situé entre les doigts reste sous leur milieu, dans les limites du cadre. Le mouvement met à jour le zoom, la position, les curseurs et le rectangle de zone visible ensemble, avant tout enregistrement.

Le zoom existant reste borné1–2 et enregistré comme nombre (quatre décimales maximum pour les gestes). Aucun fichier image n’est modifié, aucune donnée métier migrée. Le zoom public existant rend les mêmes valeurs. Les curseurs restent une alternative au glissement ; Enregistrer reste obligatoire. Aucune dépendance, permission ou authentification changée.

Le cadre résultat chargé intercepte les gestes, y compris au zoom1, pour reconnaître le second doigt. Pour défiler, on glisse à côté. Image entière et original restent non interactifs, avec défilement natif. Les [Pointer Events W3C](https://www.w3.org/TR/pointerevents/) capturent au plus deux pointeurs tactiles. Le retrait d’un doigt reprend le déplacement simple depuis le cadrage courant ; annulation, perte de capture, changement de source/format/curseur et flou/redimensionnement nettoient les gestes. Le calcul est repris après chaque mouvement pour inverser immédiatement le zoom après une limite.

## Validation

- Revue indépendante sans anomalie bloquante.
-182 contrôles du widget, dont63 photos existantes préservées : ancrage focal sur27 combinaisons, translation, limites, géométrie invalide,1→2→1 doigts, retrait du doigt principal, troisième pointeur, isolation souris/stylet, échecs de capture, annulation et changements externes.
-232 autres cas Node réussis (rendu photo public, validation, publication, rubriques et accès).
- Build Astro réussi ; contrôle statique16 pages sans anomalie ni avertissement. Le hint TypeScript préexistant dans publication.test.mjs est inchangé.
- Banc React réel dans navigateur320×740 et390×844 : pincements synthétiques successifs séparés par des rendus React, zoom/dézoom, limite×2 et retour immédiat, reprise à un doigt, annulation, métadonnées et échelle CSS synchronisées. Image entière conserve touch-action:auto ; aucun débordement horizontal.

Limite de preuve : l’outil navigateur hôte ne fournit pas de geste tactile multipoint. Les événements de deux doigts et leur capture sont simulés dans un banc local uniquement, jamais injectés dans le CMS public. Cette passe ne constitue pas un essai sur iPhone/Android physique. Les captures et le témoin Cloudflare exact sont conservés dans releases/v22-zoom-deux-doigts du workspace utilisateur. Aucun contenu métier de test n’est enregistré.
