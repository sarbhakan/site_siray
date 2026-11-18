# Siray Signature V7 — vérifications et périmètre

Contrôles effectués le 19 novembre 2026 dans le navigateur Chromium intégré, sur le build statique servi à http://127.0.0.1:4321/. Les captures JPEG et traces JSON ont été produites pendant ces manipulations. Les revues indépendantes de contenu et de captures précisent leur propre portée.

## Plateaux et buffet

Les cinq lignes de plateaux ont été ouvertes successivement : le nom et le prix restent visibles, la composition apparaît immédiatement dessous et le volet précédemment ouvert se ferme dans ce navigateur. Les prix restent 70/70/60/50/45 €. La fermeture du volet crudités par Entrée a été observée dans l’arbre d’accessibilité. Les trois sauces sont houmous, tzatziki et ail et fines herbes. `v7-interactions.json` contient les cinq états ouverts observés.

Le buffet présente les quatre étapes dans l’ordre : installation avant l’événement, présentation et décoration, personnalisation, retrait du matériel Siray à la fin de l’événement. Le volet « Demander un devis » affiche le lieu, la date et l’horaire, les convives, les mignardises par personne, le thème/couleurs/inspirations et la composition sucrée, salée ou mixte. Le devis personnalisé reste explicite. Les deux volets ont été activés et inspectés sur bureau et dans la passe mobile.

## Alignements, texte et footer

Les mesures de `v7-layout-metrics.json` portent sur le buffet à 320, 390, 430, 768, 960 et 1 440 px. Le centre vertical du groupe de mentions pratiques coïncide avec celui du bouton à 768, 960 et 1 440 px (écart mesuré : 0 px). À 320, 390 et 430 px, le groupe passe sous le bouton et leurs centres horizontaux coïncident à moins de 0,01 px. Les deux mentions ont chacune une ligne dans ces états.

Les introductions et phrases d’aide ont été raccourcies ; les descriptions des fiches et de l’accueil utilisent leur colonne sans plafond artificiel de 48/52 caractères. Les paragraphes conservent leurs retours naturels sur téléphone. Aucun `nowrap` global ni réduction du corps pour forcer une longue phrase sur une ligne.

Le footer mesuré occupe environ 213 px sur bureau et 309 à 329 px aux largeurs mobiles testées. Son logo mesure 88 px sur téléphone, 96 px à partir de 600 px. Bordeaux/Gironde est associé à ce logo. Les six destinations forment une rangée sur bureau et deux lignes dans les états mobiles observés ; leurs cibles mesurent au moins 44 px. Le titre et l’action Instagram dominent la hiérarchie. Captures : `v7-footer-desktop.jpg`, `v7-footer-mobile.jpg`.

## Responsive et régressions

`v7-responsive.json` contient 70 mesures : 14 pages, chacune à 320, 390, 430, 768 et 1 440 px. Aucun débordement horizontal du document dans ces états initiaux ; le corps hérité du document mesure 16 px. Cette mesure ne signifie pas que toutes les légendes et aides ont une taille de 16 px.

Les 18 volets principaux des sept prestations ont été activés à 320 px. Une seule rubrique principale était visible pour chaque choix, sans débordement horizontal (`v7-tabs.json`). Le relevé final distingue les volets principaux des sous-volets de saveurs, qui ont leur sélection propre. La première mesure trop large incluait ces sous-volets même sous un parent masqué ; elle a été corrigée avant de conclure.

Anatolia a été sélectionné sur bureau : 35 € par personne avec son menu sucré/salé/boisson. Les quatre filtres de galerie ont été activés à 320 px : Cakes 2, Douceurs 3, Tables 3, Tout voir 8. Le menu mobile a été ouvert et son lien Accueil a ramené à l’accueil. Les transitions entre catalogue et fiches ont été utilisées pendant les tests. Les familles de saveurs, leur clavier et le défilement sticky ne sont pas revendiqués comme retestés exhaustivement en V7 ; leurs contrôles détaillés V6 restent historiques.

Captures additionnelles : `v7-plateaux-desktop.jpg`, `v7-plateaux-mobile.jpg`, `v7-buffet-desktop.jpg`, `v7-buffet-mobile.jpg`. Elles montrent la version finale ; la capture bureau des plateaux ne dépend pas des trois phrases buffet raccourcies ensuite. Les overrides de viewport ont été retirés et l’accueil est laissé ouvert comme aperçu local.

## Vérifications techniques et limites

Astro check : 27 fichiers, 0 erreur, 0 avertissement, 0 hint. Build statique final : 14 pages. Vérification HTML/HTTP finale : aucune issue ni warning, route inconnue en 404. Taste copy-lint a reçu explicitement les 14 fichiers HTML générés : 0 FAIL, 0 WARN, 2 INFO de rythme ; les répétitions interpages sont consignées par l’outil.

Dev Toolkit a été invoqué : la préparation s’arrête sur son verrou préexistant ; les neuf checkouts et leurs pins existants ont été conservés. Impeccable context a été tenté mais terminé par signal 9, sans contexte disponible pour cette invocation. Le détecteur source final a ensuite abouti (exit 0, `[]`) ; sa couverture Astro est limitée et ne constitue pas un verdict visuel. Les consignes craft-floor/polish/clarify et les références Taste lues ont guidé les modifications. Aucun nouveau runtime Hallmark, hook global, dépendance ou mode live n’a été installé.

Aucune entrée warn/error renvoyée par les journaux navigateur lors du contrôle final. Pas de test sur appareil physique, Safari/iOS, navigateur intégré Instagram ou lecteur d’écran. Le fonctionnement natif des plateaux, le fallback sans JavaScript, l’impression et le mouvement réduit ont été relus dans le code, sans désactivation ou émulation dédiée dans ce navigateur. Les photos restent provisoires, locales et créditées. Aucun déploiement public n’est revendiqué par cette passe.
