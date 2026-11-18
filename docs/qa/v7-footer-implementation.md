# Siray Signature V7 — footer compact

Contribution du 19 novembre 2026, limitée à `src/components/Footer.astro`. Cette note décrit l’implémentation ; aucun build ni test navigateur n’est revendiqué par cet agent.

## Décisions

Le titre « Votre projet gourmand » et le bouton ivoire « Écrire sur Instagram » forment la première ligne sur écran large, puis un groupe compact sur téléphone. Les six destinations occupent un flex en ligne sur bureau, avec retours naturels par lien entier sur mobile. Aucun rail horizontal ni grille de six colonnes n’est ajouté.

L’identité et les mentions sont regroupées dans une seule ligne basse : logo réduit à 88 px sur téléphone et 96 px dès 600 px, puis Bordeaux & Gironde, copyright et crédits. La région reste ainsi proche du logo au lieu d’être isolée à l’extrémité droite. Sur téléphone, le bloc de mentions peut se répartir sur plusieurs lignes à côté du petit logo.

Le logo n’est modifié que par un sélecteur scoped du footer ; le composant `BrandMark.astro`, son bitmap et les logos d’en-tête/menu restent intacts. La palette olive/ivoire, les polices, les destinations et le compte Instagram sont conservés.

Les anciennes séparations et grandes marges entre invitation, annuaire et identité sont retirées. Le footer utilise un padding vertical de 24 px en haut et 12 px en bas ; la navigation possède 8 px au-dessus et en dessous, et la ligne basse 8 px après un séparateur fin. La hauteur est déterminée naturellement par le contenu.

Les liens conservent une cible d’au moins 44 px de haut et le CTA 48 px. Les liens de navigation et de crédits sont soulignés sans exiger de survol. Le focus est ivoire sur olive et les transitions sont désactivées en mouvement réduit. L’ordre de lecture et de tabulation suit titre/action, navigation, identité et crédits.

## Références réellement lues

- `AGENTS.md`, `PRODUCT.md`, `DESIGN.md` et `README.md` du projet.
- Impeccable `reference/craft-floor.md` et `reference/polish.md`.
- Taste `references/system.md` et les parties shell/close/espacement de `references/layout-v4.md` (le fichier `layout.md` n’existe pas dans ce pin).

Les contraintes génériques de hauteur pleine page de Taste ne sont pas appliquées : la demande actuelle exige expressément un footer très compact et prévaut sur ce défaut amont. Le système visuel existant est conservé.

## Vérification de la contribution

Diff relu pour vérifier la portée unique du composant ; `git diff --check` passe pour le footer et cette note. La compilation, les dimensions calculées et le rendu aux différentes largeurs restent à vérifier par l’agent principal après intégration.
