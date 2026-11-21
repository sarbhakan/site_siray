# V13 — chargement du moteur de défilement

Contrôle du 21 novembre 2026, à partir de `main` au commit `1457a01b8ecba4020a9a38c1a1d9b1d80c450606`. Périmètre : `src/scripts/site.ts`. La passe suit la consigne de polish d’Impeccable : corriger la cause au niveau le plus étroit, préserver le comportement et traiter aussi les états réduits ou dégradés.

## Constat et correction

L’import statique de GSAP plaçait le moteur d’animation dans le script commun aux treize pages. Seul le diaporama de l’accueil l’utilise.

GSAP est maintenant un import dynamique local au hero. Il est demandé lorsque le défilement peut démarrer, en parallèle du délai existant : présence du hero, mouvement autorisé, onglet actif, photo dans la vue et absence de pause choisie. Les pages sans hero et l’accueil ouvert avec mouvement réduit ne demandent pas ce module. Les menus et les filtres de la galerie restent dans le script commun léger.

Une seule promesse gère le chargement du moteur pour cette instance. Les opérations périmées sont écartées après les attentes grâce au compteur de génération et à l’état de nettoyage. En cas d’échec réseau du module, la photographie affichée est conservée et la surface devient statique et désactivée, sans rejet de promesse non traité.

Le délai de 6 500 ms, les fondus de 850 ms, le décodage de la photo suivante avant transition, la pause/reprise par activation de la photographie, les suspensions hors vue/onglet masqué et le nettoyage aux transitions Astro sont conservés. Un chargement de module ou d’image plus long que le délai peut toujours repousser un changement : la photo courante reste alors visible. Aucun fichier photo ni réglage de compression n’a été modifié.

## Mesures de compilation

Tailles des fichiers JavaScript de production ; gzip calculé séparément par fichier. La compilation après correction a été exécutée par l’agent principal et génère les treize pages.

| Fichiers | Avant, octets bruts / gzip | Après, octets bruts / gzip |
| --- | ---: | ---: |
| Script commun Layout | 73 804 / 28 413 | 5 834 / 2 383 |
| ClientRouter | 16 641 / 5 643 | 16 641 / 5 643 |
| GSAP séparé, conditionnel | inclus dans Layout | 69 993 / 27 048 |
| Chargement sans GSAP | 90 445 / 34 056 | 22 475 / 8 026 |

Les pages sans hero passent donc de **34 056 à 8 026 octets gzip de JavaScript**, soit **26 030 octets et 76,4 % de moins**. Le total des modules lorsqu’un accueil animé demande aussi GSAP est de 35 074 octets gzip, contre 34 056 auparavant : le découpage ajoute 1 018 octets dans ce cas. Le bénéfice mesuré porte sur les pages et états qui n’ont pas besoin du moteur, ainsi que sa sortie du module commun ; il ne signifie pas une baisse du poids photographique ou du total JavaScript de l’accueil animé.

## Vérifications exécutées

`git diff --check` passe. Un contrôle de comportement du TypeScript transpilé, avec DOM et timers simulés, couvre neuf scénarios :

1. Absence de hero : aucun import GSAP ni timer.
2. Mouvement réduit à l’arrivée : aucun import, surface désactivée, aucun timer.
3. Hero animé : import unique, délai de 6 500 ms et deux fondus de 850 ms.
4. Activation de la photo : pause puis reprise du timer et état accessible cohérent.
5. Onglet masqué ou photo hors vue : suspension, puis reprise au retour.
6. Échec du module : photo statique, surface désactivée et aucun départ d’animation.
7. Nettoyage Astro pendant un import en attente : aucune mutation GSAP ni animation tardive, observer déconnecté et timer annulé.
8. Pause pendant le décodage : aucune transition devenue périmée.
9. Changement de préférence de mouvement : demande du moteur à l’autorisation, désactivation et suspension au retour du mouvement réduit.

Ces contrôles de source ne prouvent ni le rendu ni la fluidité sur un appareil. La revue navigateur est menée séparément dans la passe principale. Aucun résultat de téléphone physique, de navigateur intégré Instagram, de throttling réseau/CPU ou de Core Web Vitals réels n’est revendiqué ici.
