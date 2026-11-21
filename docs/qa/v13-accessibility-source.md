# V13 — Revue source de l’accessibilité et du mobile

Date : 21 novembre 2026. Périmètre : lecture des sources dans le clone de revue V13, sans lancement de compilation ni utilisation du navigateur. Ce document ne constitue pas un audit WCAG exhaustif, un essai VoiceOver ou une validation sur téléphone physique.

## Conclusion

Aucun défaut bloquant établi dans les sources examinées. Les mécanismes essentiels existent pour les sept fiches, la galerie, le menu et le parcours Instagram. Aucune modification de la direction artistique ou des photographies n’est nécessaire à l’issue de cette lecture. La scrollbar visuellement masquée et les JPEG haute qualité de l’accueil sont des choix explicitement demandés par le client et ne sont pas signalés comme anomalies.

## Constats vérifiés dans le code

- `src/layouts/Layout.astro:39` déclare la langue française. Le viewport à la ligne 44 autorise le zoom ; aucune limite de zoom n’est ajoutée.
- `src/layouts/Layout.astro:65` propose un lien d’évitement vers `main#contenu`, rendu focalisable à la ligne 168. Sa visibilité au focus est définie dans `src/styles/global.css:160`.
- Le menu mobile est un `<dialog>` nommé (`Layout.astro:114`), avec bouton de fermeture nommé (`:119`). Le script utilise `showModal()`, `close()` et synchronise `aria-expanded`. Le navigateur fournit le comportement modal natif ; le retour réel du focus doit être apprécié dans le rendu, pas déduit du seul code.
- Sans JavaScript, le menu à bouton est masqué (`global.css:1296`) et une navigation complète est fournie par `<noscript>` (`Layout.astro:156`). Les liens des sept familles sont présents. Les filtres de galerie sont masqués et toutes les photographies restent disponibles.
- Les onglets des fiches et des saveurs sont initialement masqués, puis améliorés progressivement (`ProductDetail.astro:85`, `:139`). Le contenu de tous les volets est livré dans le HTML. Le script applique les relations `tablist` / `tab` / `tabpanel`, `aria-controls`, `aria-labelledby`, `aria-selected`, ainsi qu’un seul onglet dans l’ordre Tab (`product-explorer.ts:22`). Les flèches et Home/End activent et focalisent les onglets (`:42`). Un panneau actif reste atteignable au clavier via son `tabIndex=0` (`:29`).
- Le sélecteur des dix brunchs a un label associé et annonce le nom ainsi que le tarif par personne (`ProductDetail.astro:97`). Les variantes de boutons utilisent `aria-pressed`, sont groupées, puis annoncent le changement dans un statut (`product-explorer.ts:82`, `ProductDetail.astro:104`). Le sélecteur natif est conservé jusqu’à 1199 px ; les boutons prennent le relais à partir de 1200 px.
- Les cinq descriptions de plateaux utilisent des `<details>` / `<summary>` natifs et des cibles de 72 px de haut (`PlatterChoices.astro:13`, `:27`). Le nom et le prix restent visibles. Les informations allergies de `/contact/` sont ouvertes par défaut (`contact.astro:91`).
- Les filtres de galerie sont des boutons nommés, regroupés et munis de `aria-pressed` (`galerie.astro:30`). Le décompte utilise `aria-live="polite"` (`:41`). Le masquage des figures exclut les autres catégories de l’affichage ; aucune visionneuse ou action de zoom superflue n’est présente.
- `Photo.astro:43` restitue le texte alternatif reçu. Les dimensions intrinsèques sont fournies lorsque l’image est enregistrée (`:47`), et les images non prioritaires utilisent le chargement différé natif. Dans le diaporama, les scènes inactives sont également masquées aux technologies d’assistance (`index.astro:49`). Le nom accessible du bouton du diaporama exprime l’action de figer ou reprendre la rotation.
- Les cibles principales sont prévues à 44 px ou plus : menu 44 px, fermeture 44 px, filtres 44 px, onglets 48–56 px, sélecteur brunch 52 px, CTA Instagram 48 px. Le footer expose les sept prestations et ses liens ont une hauteur minimale de 44 px (`Footer.astro:102`).
- Le contenu des fiches repose sur un corps de 16 px et des retours naturels. Le sticky est limité à l’image latérale au-dessus de 960 px (`ProductDetail.astro:318`) ; les onglets et boutons de saveur restent dans le flux.
- Le mouvement réduit annule le défilement doux, raccourcit les transitions globales (`global.css:1222`) et supprime les transformations/animations des fiches (`ProductDetail.astro:356`). Le script surveille le changement de préférence système et suspend la rotation du diaporama.

## Contrastes calculés sur les aplats

Calcul sRGB à partir des couleurs déclarées dans `src/styles/global.css:1`. Les résultats sont des rapports numériques des tokens, sans analyse des photographies.

| Usage | Couleurs | Rapport |
| --- | --- | --- |
| Texte principal / papier | `#303528` / `#F5F1E8` | 11,19:1 |
| Texte secondaire / papier | `#626452` / `#F5F1E8` | 5,38:1 |
| Texte secondaire / surface | `#626452` / `#E9E4D7` | 4,78:1 |
| Ivoire / olive | `#F5F1E8` / `#4E533D` | 7,09:1 |
| Ivoire secondaire / olive | `#E7E4D5` / `#4E533D` | 6,26:1 |
| Texte olive / fond du hero | `#4E533D` / `#D7DBC6` | 5,64:1 |
| Contour de focus / papier | `#717746` / `#F5F1E8` | 4,21:1 |
| Contour de focus / surface | `#717746` / `#E9E4D7` | 3,73:1 |

Les combinaisons de texte calculées dépassent 4,5:1 ; les contours calculés dépassent 3:1. Le focus du header/menu/footer utilise un ivoire adapté au fond olive ; le bouton photographique dispose d’un double contour clair/sombre.

## Point mineur de confort tactile

`src/components/ProductDetail.astro:314` réduit la hauteur minimale du lien « Allergies & intolérances » de 44 à 24 px dès 600 px. Cette cible atteint le seuil de 24 px du niveau AA WCAG 2.2, mais reste moins confortable sur une tablette tactile que sur un téléphone. Correctif minimal possible si le rendu le permet : conserver 44 px à ce breakpoint. Ce point n’est pas un blocage et ne justifie pas une refonte du groupe CTA.

## Limites de cette revue

La présence du code ne prouve pas l’absence de débordement ou l’alignement rendu. Cette passe n’a mesuré aucun rectangle de cible, ni testé la navigation au clavier, le menu, les mises à jour des volets, le zoom à 200 %, un lecteur d’écran ou le navigateur intégré d’Instagram. Les textes alternatifs sont présents et issus du registre, mais leur fidélité photographique n’a pas fait l’objet d’une nouvelle inspection visuelle. Les résultats navigateur V13 sont à consulter séparément lorsqu’ils ont été exécutés par l’intégration.

## Intégration après cette revue

L’agent principal a supprimé l’override à 24 px. Le contrôle navigateur V13 mesure désormais 44 px sur la fiche Layer cakes à 768 px, avec action Instagram et mentions centrées ; voir `v13-tablet-cta.jpg`. La contre-revue indépendante du diff GSAP et de cette suppression ne relève aucune régression tangible.
