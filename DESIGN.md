# Siray Signature — système visuel

Version implémentée au 18 novembre 2026. Ce fichier décrit les choix réels de la façade; les intentions initiales et les références sont conservées dans [docs/art-direction.md](docs/art-direction.md). Hallmark conduit la composition custom, Taste le rythme et la voix, Impeccable la qualité des états et du mouvement. Les vérifications sont consignées séparément.

## Direction

**La table se compose.** Le site passe d’une pièce haute à une douceur, un plateau et une table. La mise en page alterne photographie large, index de créations, duo photo/texte sur bordeaux, récit de maison et carnet. Les surfaces ouvertes et les variations d’échelle portent l’identité.

Les tokens effectivement utilisés dans `src/styles/global.css` sont `--paper: #f6f2ea`, `--ink: #38251f`, `--muted: #75655c`, `--wine: #5c1e2c`, `--line: #cfc3b5`, `--white: #fffcf7`. Ce sont des valeurs hexadécimales CSS, pas une implémentation OKLCH. Des couleurs de support restent locales pour les voiles de photo, fonds de dialogue et filets sur bordeaux; leur centralisation éventuelle relève de la revue technique.

Gloock 400 pour les titres et la marque; Manrope 400/600 pour le texte et les contrôles. Les fichiers latins sont intégrés localement avec Fontsource. Deux familles, trois graisses au total et `font-synthesis: none`. Titres en casse normale, une couleur et un style par titre. La petite ligne « Signature » du logotype possède un espacement propre à la marque; les liens de navigation n’ont pas de capitales espacées.

Le corps général est à **16px/1,65**. Les paragraphes principaux ont une règle finale commune de 16px; l’introduction du hero et certains textes courts passent à 14px sur téléphone. Les légendes, aides et métadonnées sont plus petites. Le H1 du hero emploie `clamp(48px, 6.2vw, 96px)` sur ordinateur, puis des valeurs adaptées jusqu’à `clamp(37px, 8.4vw, 52px)` sur téléphone. Les H2 se situent entre 38 et 72px avant adaptations locales. Les paragraphes généraux plafonnent à 58ch.

Le gutter utilise `clamp(22px, 4.5vw, 88px)`. Les grands espacements séparent nettement les chapitres, tandis que les textes et leurs actions forment des groupes serrés. Les photos gardent des cadres rectangulaires. Les **contours arrondis ont un rôle fonctionnel** : lien d’événement dans l’en-tête, flèches rondes, filtres et contrôles de galerie. Le bord supérieur arrondi de la plage du hero relie l’image et le texte. Ces détails ne deviennent pas le conteneur de toutes les sections.

## Premier écran et parcours

L’en-tête ivoire réunit marque, quatre destinations et lien « Votre événement ». Le hero possède une grande photographie en largeur et une plage ivoire au pied, avec « L’art de sublimer vos instants gourmands », une phrase locale et « Découvrir les créations ». La hauteur photo finale est `clamp(300px, 45svh, 540px)` sur ordinateur puis 325px sous 600px. Cette dernière règle fait foi sur les anciennes déclarations plus hautes du fichier. Le titre et l’action doivent être vérifiés ensemble à 1280×800 et 390×844.

Les douze pages compilées comprennent l’accueil, l’index des créations, quatre pages de familles (layer cakes, bento cakes, mignardises & cupcakes, brunch box), Buffets & réceptions, Le carnet, La maison, Votre événement, Photos & informations et la page 404. Le lien Instagram **https://www.instagram.com/siraysignature/** et le dépôt **https://github.com/sarbhakan/site_siray.git** ont été confirmés par l’utilisateur.

L’index des familles met à jour son aperçu au survol et au focus. Sur téléphone, les intitulés sont des liens directs vers leurs vraies pages. Le carnet filtre les images par famille et ouvre leur version agrandie dans un dialogue avec fermeture, flèches et navigation au clavier. Les photos restent accessibles par leur fichier lorsque JavaScript est absent.

## Mouvement et états

Le hero démarre sur une photographie stable. Ses flèches changent manuellement la composition par un **fondu GSAP de 600ms**, avec annulation de la séquence précédente. La lecture automatique est une option explicite : bouton de lecture, intervalle de 5,5s, bouton pause et arrêt lors d’une interaction manuelle ou d’une entrée du focus. Elle n’est pas lancée au chargement. Le décompte et le libellé suivent l’image active.

En mouvement réduit, les changements de photographie sont immédiats et la lecture automatique n’est pas proposée. Les transitions CSS sont réduites. Le menu et la visionneuse utilisent des dialogues natifs; le retour de focus de la visionneuse est explicite. Astro ClientRouter assure une continuité de navigation avec des fondus courts. Aucun effet ne bloque la consultation du contenu.

Les photos liées peuvent s’agrandir légèrement dans leur cadre, les flèches se déplacer ou tourner à l’intérieur de leur cible et les liens de navigation souligner leur état. Les dimensions des cibles restent stables. Les états actifs des filtres, le focus, les boutons de lecture/pause, la fermeture et les FAQ sont fonctionnels. Le site ne simule ni envoi de message ni confirmation de commande.

## Photos, vérité et vérification

Les images locales WebP, leurs variantes responsives, dimensions et points de recadrage sont consignés dans `docs/image-credits.json`. Le hero est prioritaire; les autres photos sont différées selon leur place. Les photographies sont des **visuels d’ambiance**, annoncés au hero, au carnet, au pied de page et dans les informations. Elles n’illustrent pas des réalisations attribuées à Siray Signature. Les photos utilisateur pourront remplacer ces sujets.

Aucun tarif, délai, témoignage ou saveur précise n’est inventé. L’Instagram est confirmé; les détails commerciaux et les coordonnées légales restent à fournir avant une publication définitive.

La revue doit contrôler les couples de couleurs réels (différents de la première palette proposée), le premier écran, les recadrages, les textes longs et les espaces à 1440×900, 1280×800, 390×844 et sur écran très large. La base de texte est 16px mais les légendes et aides plus petites doivent être inspectées à la taille réelle. Le plafond de largeur des compositions est un point de revue : le fichier actuel plafonne les gutters, pas encore tous les groupes de contenu.

Les critères conservés : focus visible immédiat, clavier, fermeture Échap, noms accessibles, état actif perceptible, contenu visible sans JavaScript, mouvement réduit et navigation réelle. Les résultats automatisés ou visuels ne sont déclarés réussis qu’après contrôle. Le présent fichier n’attribue aucun verdict à un rendu non inspecté.

État final : les couleurs et transparences partagent le bloc de tokens. Les marges sont plafonnées autour d’un contenu de1440px, le cadrage desktop du gâteau est28%, les légendes fonctionnelles et la sous-marque sont12px. La provenance supérieure est sur fond ivoire opaque.
