# V15 — raccord de l’accueil et filtres horizontaux

Le client a validé la publication de la V14 avec ces deux corrections le 21 novembre 2026. Le raccordement du domaine reste une opération séparée : ce rapport ne prouve pas son activation.

## Changements et contrôles

- Suppression de la marge extérieure de 40 px, puis 64 px sur bureau, après le bandeau pratique de l’accueil. La rubrique Maison garde son padding intérieur et sa photographie approuvée.
- Huit filtres de galerie en flex nowrap, rail horizontal natif à largeur contenue, boutons non rétrécis et libellés sur une ligne. Scrollbar masquée sans désactiver le défilement. Padding de 8 px pour préserver le contour de focus.
- Astro check : 30 fichiers, zéro erreur, avertissement ou hint. Build statique : 13 pages générées. Contrôle statique des pages : zéro issue ni warning.
- Navigateur intégré : rail sur une seule rangée à 320, 390, 768, 960 et 1440 px, sans débordement horizontal de la page et sans bouton de moins de 44 px de haut.
- Défilement horizontal réel du rail observé à 390 px : scrollLeft de 0 à 459,5 px pour un contenu de 810 px dans une fenêtre de 350 px. Le dernier filtre Plateaux est visible et activable.
- Clavier : depuis Tout voir, sept Tab atteignent Plateaux et le révèlent dans le rail ; Espace filtre correctement. Le compteur affiche 4 photographies, les quatre figures visibles correspondent et le hash devient #plateaux.
- Raccord accueil mesuré : distance entre la fin du bandeau et le début de Maison égale à 0 px à 320, 390, 960 et 1440 px. Aucun débordement horizontal observé.
- Revue indépendante du diff : aucun défaut identifié après contrôle du focus, des cibles, de la logique conservée et des deux marges retirées. Aucune photo, ressource publique ou donnée métier modifiée.

La passe réutilise les principes Impeccable polish/adapt et le système existant. Les preuves portent sur le navigateur intégré et des tailles de fenêtre ; pas sur un iPhone physique, Safari iOS, le navigateur Instagram ou un geste tactile synthétisé. La présence d’une règle CSS ne constitue pas une mesure de fluidité sur ces appareils. La publication distante doit être attestée par le commit et le déploiement Cloudflare effectivement observés.
