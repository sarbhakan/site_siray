# Siray Signature V11 — panneau d’accueil

## Changement ciblé

La teinte prune V10 est remplacée par un olive grisé clair #D7DBC6 issu de la famille chromatique du logo. Le panneau conserve un contraste avec l’en-tête olive et le papier ivoire. Le titre « Vos instants gourmands » et le sous-titre réécrit « Pâtisserie & tables sur mesure. » tiennent chacun sur une ligne. Les brunchs et buffets restent explicites dans le paragraphe suivant ; Bordeaux/Gironde et les créations sur commande figurent en conclusion.

Un court texte explique la personnalisation. Deux parcours plats mènent aux chapitres « Pour célébrer » et « Pour se retrouver ». Sur ordinateur, ils présentent les sept familles correspondantes ; sur mobile, les deux liens restent côte à côte. Le groupe de contenu est centré avec un espacement interne de 40 px sur ordinateur, ce qui retire le grand vide central causé par space-between. Les visuels, fichiers, cadrages et chargements V10 sont conservés.

## Vérifications exécutées le 19 novembre 2026

- Astro check : 30 fichiers, 0 erreur, 0 avertissement, 0 indice. Build statique : 13 pages.
- Contrôle HTML/HTTP des 13 pages : aucune anomalie ni avertissement, destinations et nouvelles ancres existantes.
- Accueil dans le navigateur intégré aux largeurs320,390,430,600,768,960,1280 et1440px :aucun débordement de page, de titre ou de sous-titre. Leurs hauteurs mesurées correspondent à un seul interligne à chaque largeur. Le sous-titre reste à16px ; le titre va de24px à320 à48px à1440. Les mesures complètes figurent dans v11-responsive.json.
- Mobile390px :panneau texte380,85px de haut, première photo ày480,85px avec l’en-tête de100px. La photographie reste donc visible dans le premier écran de844px. Les descriptions longues des parcours sont retirées du rendu mobile pour maintenir cette densité.
- Les ancres ont été activées :« Pour célébrer » se stabilise ày115,95px sous le header100px sur mobile ; « Pour se retrouver » ày127,78px sous le header112px sur ordinateur. L’animation de scroll doit se terminer avant de mesurer ces positions.
- Contrastes calculés lors de la revue indépendante : encre/fond 8,91:1, secondaire/fond 5,64:1, bouton 7,09:1, survol 8,54:1. Focus sombre sur le nouveau fond clair, bouton olive/texte ivoire dans les deux états.
- Impeccable detect --json --changed : exit 0, liste vide. Taste copy lint sur le HTML d’accueil : exit 0, aucun résultat signalé. Contrôles statiques, distincts du rendu visuel.
- Revue indépendante du diff : aucun défaut concret identifié ; documentation de direction mise à jour. Pas de changement dans public/images, photography.ts ni Photo.astro par rapport à main V10.

## Preuves et limites

Captures :v11-home-desktop.jpg (1440×900) et v11-home-mobile.jpg (390×844). Le navigateur a été remis à sa taille initiale, sur l’accueil local, et l’onglet conservé pour consultation. Aucune vérification sur téléphone physique, Safari/iOS ou navigateur Instagram ; pas de mesure de performances réelles ni de déploiement en production. La synchronisation Git et l’intégrité des archives sont consignées dans releases/v11/publication.json une fois terminées.
