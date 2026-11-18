# Siray Signature — vérification ciblée V3

Revue du 18 novembre 2026 sur le serveur Astro de production local http://127.0.0.1:4321/, depuis le navigateur intégré. Les photos et informations commerciales restent celles de la façade V2.

## Hero

Le rail, les trois libellés, la progression et le bouton texte ont disparu du DOM. La photo rejoint directement la section suivante : écart mesuré de 0 px au bas du hero à 390 et 1440 px. Le passage automatique gâteau → macarons a été observé après le délai configuré de 6,5 s. Space sur le bouton photographique produit aria-pressed=true et data-running=false ; une seconde activation reprend la lecture. Le double anneau de focus crème/encre a été vérifié sur une photo claire.

## Footer

La conclusion globale remplace le bloc Invitation et l’ancien footer sombre. Elle contient un seul lien Instagram, la signature, Bordeaux/Gironde, quatre destinations et un lien de crédits. Hauteurs mesurées : 439,5 px à 320 px, 442 px à 390/430 px, 295 px à 1440 px. Aucun débordement horizontal à ces quatre largeurs. Tous les liens du footer mesurent au moins 44 px en hauteur ; le CTA mesure 48 px. Les captures JPEG incluent la fin de la section précédente pour montrer la transition.

## Non-régression ciblée

Le lien du carnet ouvre la bonne page. Le filtre Cakes sélectionne deux photos et le fragment #cakes. La visionneuse ouvre la première photo, Escape la ferme et rend le focus au lien d’origine. Le menu mobile ouvre sa navigation et son lien Accueil revient à la page d’accueil. Aucun avertissement ni erreur dans les journaux consultés. Le viewport temporaire a été réinitialisé et l’onglet local conservé ouvert.

## Validation du code et limites

Astro check : 20 fichiers, zéro erreur, avertissement ou hint. Astro build : 12 pages statiques. Le contrôle scripts/check-site.py avec le serveur HTTP a renvoyé 12 pages, aucune anomalie ni avertissement ; les chemins inconnus renvoient une 404. git diff --check passe.

La préférence de mouvement réduit, l’arrêt hors vue/onglet masqué, l’invalidation après décodage et le nettoyage ont fait l’objet d’une revue du code. Le mouvement réduit n’a pas été émulé dans le navigateur. La validation responsive porte sur des viewports de navigateur, pas sur des téléphones physiques ni sur le navigateur embarqué Instagram. La capture v3-hero-keyboard-focus.jpg saisit le milieu d’un fondu ; elle documente uniquement le focus et n’est pas une image promotionnelle.
