# Siray Signature V5 — vérification navigateur

Vérification du 18 novembre 2026 sur la version compilée servie à `http://127.0.0.1:4321/`, dans le navigateur Chromium intégré à Codex. Les manipulations et mesures décrites ici ont été effectuées par l’agent principal. Ce compte rendu confronte ses traces JSON, les captures conservées et les résultats de contrôle ; son rédacteur n’a pas exécuté ces manipulations.

## Couverture des pages

`v5-responsive.json` contient les 70 échantillons finaux : 14 routes, chacune contrôlée à 320, 390, 430, 768 et 1 440 px. Aucun débordement horizontal du document n’est relevé dans ces états. Le plus petit texte visible mesuré est de 13 px. Chaque fiche présente un seul panneau de contenu actif après initialisation, avec respectivement quatre volets pour les layer cakes, trois pour les bento cakes et cupcakes, et deux pour les mignardises, brunch box, buffets et plateaux.

Les dimensions sont celles de viewports simulés. Elles ne constituent pas un test sur des appareils physiques.

## Volets et navigation

Les 18 volets des sept fiches ont été activés à 320 px. Pour chaque activation, `v5-interactions.json` relève le bon libellé sélectionné, le focus sur la commande activée, un seul panneau visible et l’absence de débordement horizontal.

Sur la fiche Layer cake à 390 px, les commandes clavier suivantes ont été observées : ArrowRight passe à « Saveurs classiques », End à « Préparer ma demande », puis Home à « Format & décor ». Le focus et l’état sélectionné correspondent à chaque destination. Les groupes natifs Fruits et Chocolats se referment mutuellement ; seul le groupe Chocolats reste ouvert dans la trace.

La microcopie « Voir / Réduire » a été affinée après cette trace : l’agent principal a inspecté le rendu final et le build de 22 h 37. « Réduire » accompagne désormais le groupe ouvert et « Voir » les groupes fermés ; la chaîne « ChocolatsVoir » conservée dans le JSON correspond à l’état antérieur de cette finition.

Le parcours via un lien Astro de Layer cake vers Bento, puis le retour arrière, a été vérifié : trois onglets Bento, ouverture des saveurs, puis quatre onglets Layer réinitialisés et volet Signature fonctionnel. Le menu mobile mène également à la fiche Layer avec ses quatre onglets actifs. Ces observations couvrent la réinitialisation des écouteurs après navigation.

## Brunch box

Le sélecteur mobile expose les dix noms avec leur prix par personne. Anatolia sélectionnée affiche 35 € par personne. Les neuf autres compositions sont à 30 € par personne. Le choix d’Anatolia est conservé lors du redimensionnement vers le bureau.

Les dix commandes de la présentation bureau ont ensuite été activées. Chaque choix montre exactement une composition, avec le bon nom et le bon tarif : neuf à 30 € par personne, Anatolia à 35 €. Le résumé au début de la page présente ces deux prix séparément, sans laisser entendre que 35 € serait un supplément ajouté à 30 €.

Les détails sucrés, salés et la boisson des dix compositions restent présents dans le HTML ; leur fidélité aux sources est couverte par `v5-content-review.md`. Le sélecteur est une aide à la découverte, sans transmission ni validation de commande.

## Régressions et rendu visuel

Le filtre Cakes de la galerie affiche deux photographies. Une photographie ouvre le dialogue de visionneuse, puis Échap le ferme. Les journaux navigateur consultés à la fin du contrôle ne remontent aucune entrée warn/error (`console: []`).

Le logo a été inspecté dans l’en-tête, le menu mobile et le footer. Les captures `v5-layer-desktop.jpg`, `v5-menu-mobile.jpg` et `v5-footer-mobile.jpg` montrent la calligraphie claire sur l’olive commun, sans rectangle de fond d’une autre teinte. Le traitement conserve les formes de la marque fournie.

La composition d’accueil, les fiches et leurs états sont documentés par les captures suivantes :

- `v5-home-composition-desktop.jpg` : proportions photographiques variées pour les prestations.
- `v5-layer-desktop.jpg` : photos et volet Format & décor côte à côte.
- `v5-layer-flavors-mobile.jpg` : commandes sur deux colonnes et saveurs sur téléphone.
- `v5-brunch-header-mobile.jpg` : distinction des prix avant les photographies.
- `v5-brunch-mobile.jpg` et `v5-brunch-desktop.jpg` : choix de composition et détail tarifé.
- `v5-menu-mobile.jpg` et `v5-footer-mobile.jpg` : intégration du logo dans les surfaces olive.

La revue indépendante `v5-visual-review.md` ne relève pas de défaut visuel bloquant dans les cadrages effectivement examinés. Elle distingue ses observations sur captures des manipulations navigateur de l’agent principal.

## Compilation et contrôles complémentaires

L’agent principal confirme le contrôle Astro final : 25 fichiers, 0 erreur, 0 avertissement et 0 hint. La compilation produit 14 pages statiques. Le rapport HTML/HTTP final (`v5-static.json`) contient 14 pages, `issues: []` et `warnings: []` ; la route inconnue retourne 404.

Taste copy-lint ne relève aucun FAIL ni WARN dans `v5-copy-lint.json` : trois informations de rythme seulement, ainsi que des éléments de structure partagés entre les fiches. Impeccable `detect` retourne `[]` dans `v5-impeccable-detect.json`. Ce dernier résultat est un contrôle mécanique à couverture Astro limitée, et ne vaut pas validation du rendu.

## Portée et limites

Aucun test sur téléphone physique, Safari/iOS, navigateur intégré Instagram ou lecteur d’écran n’est revendiqué. Le rendu sans JavaScript et la préférence de mouvement réduit n’ont pas été émulés : leurs dispositions ont été revues dans les sources seulement. Aucun résultat Lighthouse, Core Web Vitals réels ou déploiement de production n’est déduit de ces contrôles.

Les photos de produits restent des images d’ambiance créditées. Les réalisations autorisées de Siray Signature, notamment un véritable bento cake, devront les remplacer pour finaliser la représentation des prestations.
