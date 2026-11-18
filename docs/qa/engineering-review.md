# Vérification technique indépendante

18 novembre 2026. Périmètre : première version statique multipage de Siray Signature, usage public avec faible trafic, consultation depuis Instagram et prise de contact sur le compte confirmé `@siraysignature`.

## Résultat des vérifications exécutées

Les 12 fichiers HTML générés passent le contrôle indépendant. Chaque page possède une langue française, un titre unique, une description, un H1 et un repère `main`. Aucun identifiant dupliqué, image sans attribut alternatif ou dimensions, contrôle sans nom accessible détectable statiquement, lien local cassé ou mauvais compte Instagram n’a été trouvé. Les liens de catégories de la galerie sont vérifiés comme des destinations de filtre explicites.

Les 12 routes répondent avec du HTML et un statut HTTP 200 sur la prévisualisation de production locale. Une URL inconnue répond 404. Le script lui-même a été vérifié contre un document volontairement défectueux : lien cassé, bouton sans nom et image sans alternative sont bien détectés.

Les deux scripts initiaux totalisent **34 200 octets gzip par page après le dernier rebuild** (34 185 au premier passage), sous l’objectif de 80 Kio. La plus grande image livrée mesure **322 492 octets** ; toutes les images sont sous 400 Kio. Les sources `srcset` existent, le visuel initial est prioritaire, les autres images sont différées et les dimensions réservent leur espace. Ces mesures ne constituent pas une mesure Lighthouse ou un résultat Core Web Vitals sur appareil réel.

Le code du menu et de la visionneuse utilise des dialogues HTML natifs. Il prévoit Échap et le retour du focus ; les filtres possèdent un état `aria-pressed` et un compteur annoncé. Les événements sont annulés avec `AbortController` avant les transitions Astro, et les minuteries GSAP sont nettoyées. Les contrôles dépendant de JavaScript sont cachés sans script, tandis que la navigation de secours et les informations restent disponibles. L’interaction rendue relève du passage navigateur de l’agent principal.

La configuration Netlify publie `dist`, lance `npm run build` et fixe Node 24. Le site utilise une sortie Astro statique, sans serveur, base de données ou secret requis pour être consulté. Le domaine de production reste fourni par l’environnement Netlify `URL` ; aucun domaine client n’est inventé. Aucun déploiement Netlify n’a été effectué pendant cette vérification.

## Défauts transmis et vérification ciblée après correction

1. **[P2] Mouvement réduit incomplet, corrigé dans le code**, `src/styles/global.css:2302`. Le premier passage montrait que la règle globale `.01ms` laissait les déplacements de survol et les pseudo-éléments de transition de page. Le contrôle ciblé après correction confirme maintenant `transform: none` sur les effets de survol concernés et `animation: none !important` sur `::view-transition-old(root)` / `::view-transition-new(root)`. Le script GSAP prévoit déjà une durée nulle pour les changements manuels et interdit le défilement automatique dans ce mode. La règle globale reste présente, mais les effets identifiés ont désormais leur alternative explicite. Le ressenti rendu est du ressort de la vérification navigateur.
2. **[P2] Petits textes fonctionnels sur téléphone, correction ciblée vérifiée**, `src/styles/global.css:2248` et `:2273`. Les liens du pied de page, la mention de provenance du pied de page, le fil d’Ariane, les filtres, le compteur et les légendes de galerie sont maintenant à 12 px. Des textes secondaires restent plus petits : mentions photographiques de l’ouverture à 11 px sur téléphone, mot « Signature » du logotype à 9 px, quelques numéros décoratifs à 10 px. Il ne faut donc pas annoncer que tous les petits textes ou tous les résultats du détecteur ont disparu. Les textes de lecture courante ont leurs règles de 16 px, les textes d’introduction mobile restant parfois à 14 px.

Le point de contraste transmis pour le haut du diaporama a également été traité dans le code : texte en encre sur fond `--paper` opaque, sans ombre, à `src/styles/global.css:2229`. Sa lisibilité visuelle reste couverte par la revue navigateur. Le recadrage desktop demandé par la revue artistique est présent : `object-position: 50% 28% !important` sur la première diapositive au-delà de 600 px (`src/styles/global.css:2255`).

## Lecture des outils de design

Les scripts tiers ont été lus avant exécution. Ils complètent la revue du code ; leurs résultats ne sont pas des défauts confirmés en nombre équivalent.

- **Impeccable** : moteur 0.1.25 téléchargé dans le cache du projet et vérifié contre le checksum fourni par le dépôt. `context` a été exécuté, puis le détecteur statique sur les sources et sur les 12 pages générées. Le scan des fichiers `.astro` n’a rien signalé ; le scan HTML a produit 169 résultats, surtout des occurrences répétées de textes minuscules dans l’en-tête et le pied de page communs. Les alertes de palette crème sont écartées : l’ivoire est une décision explicite du système visuel. Les alertes de padding nécessitent un rendu : les enfants positionnés et les marges internes ne sont pas correctement distingués par cette analyse statique. Aucune affirmation « 169 erreurs corrigées » n’est justifiée.
- **Hallmark** : scan statique éditorial des sources, sans ouvrir de navigateur. Résultat initial brut : 22 `FAIL`, 182 `REFLEX`, 24 `WARN`. Parmi eux, 181 occurrences concernent une échelle stricte d’espacement et 14 des couleurs hors tokens ; ce sont surtout des conventions de système, sans preuve de blocage utilisateur. Le signal « diapositive cachée sans JavaScript » est un faux positif : la première diapositive possède `is-active` et reste visible. Le verrouillage `overflow:hidden` est limité au dialogue ouvert ; aucune rupture de sticky n’a été démontrée. Les choix de tirets ou de points médians ne sont pas des défauts fonctionnels. Une rationalisation des couleurs et de la cascade CSS peut se faire lors d’un prochain passage, sans ajouter de dépendance.
- **Taste** : `copy-lint` sur les 12 pages, genre `service`, année 2026. Aucun `FAIL`. Un avertissement sur les tirets séparant les auteurs et leurs crédits ; ces crédits sont des données de provenance, pas une répétition marketing.
- **UI/UX Pro Max** : recherches locales `keyboard focus modal` et `static asset optimization` pour Astro ; trois résultats pertinents pour chacune. Elles confortent le focus visible, les composants Astro statiques et les images locales optimisées. Les versions de framework indiquées dans ce catalogue n’ont pas été utilisées pour choisir les dépendances du projet.
- **Ponytail** : revue centrée sur les parcours réellement demandés, sans nouvelle bibliothèque ni couche applicative. Le script QA emploie uniquement la bibliothèque standard Python.

## Commandes exécutées

Depuis la racine du projet :

```sh
IMPECCABLE_HOME="$PWD/.dev-toolkit/runtime/impeccable" IMPECCABLE_LIVE_COPY_AGENT=off DO_NOT_TRACK=1 sh .dev-toolkit/vendor/impeccable/.agents/skills/impeccable/scripts/impeccable context
IMPECCABLE_HOME="$PWD/.dev-toolkit/runtime/impeccable" IMPECCABLE_LIVE_COPY_AGENT=off DO_NOT_TRACK=1 sh .dev-toolkit/vendor/impeccable/.agents/skills/impeccable/scripts/impeccable detect --json src
node .dev-toolkit/vendor/hallmark/skills/hallmark/scripts/sloplint.mjs src --genre editorial --json
python3 scripts/check-site.py
python3 scripts/check-site.py --url http://127.0.0.1:4321
```

Le détecteur Impeccable a également reçu la liste des 12 fichiers `dist/**/*.html`. Taste a reçu la même liste, avec `--kind service --json --year 2026`. Ces listes ont été construites avec Python `Path.rglob`, puis transmises à `subprocess.run` comme arguments séparés, sans interpolation shell.

L’accès réseau restreint a d’abord empêché le téléchargement du moteur et la lecture HTTP locale. Les deux opérations ont ensuite réussi avec l’autorisation d’exécution adaptée. Aucun `HOME` modifié, hook global, mode live, agent autonome externe ou modification de réglage global n’a été utilisé.

## Blocage local macOS observé après les premiers builds

Un lancement ultérieur de `astro check` s’est bloqué pendant le chargement de ses dépendances, avant les diagnostics. La vérification a été limitée aux fichiers et à leur lecture, sans relancer de build côté QA. `ls -lO@` a montré les indicateurs macOS `compressed,dataless` sur `node_modules/@astrojs/language-server/dist/core/index.js`, `node_modules/@emnapi/core/package.json`, `node_modules/@emnapi/runtime/package.json` et `node_modules/@napi-rs/wasm-runtime/package.json`. La simple lecture de ces mêmes fichiers par `sed` ou `cat`, sans Node, restait elle aussi suspendue. Les quatre commandes de lecture lancées par l’agent QA ont été interrompues proprement.

Cette observation établit un blocage d’accès aux fichiers de dépendances ; elle ne démontre pas un problème du code du site, de l’interopérabilité CJS/ESM ou du moteur WASM. Un fichier dataless ne conserve localement que ses métadonnées et doit être matérialisé avant lecture. Apple documente explicitement que cette opération peut provoquer des attentes ou des blocages d’appels au système de fichiers. Le lien précis avec la synchronisation iCloud de ce dossier Documents reste une explication probable, pas une configuration système inspectée. [Source : Apple TN3150](https://developer.apple.com/documentation/technotes/tn3150-getting-ready-for-data-less-files).

L’agent principal prend en charge une réinstallation des dépendances depuis le lockfile dans un dossier local non synchronisé, sans recopier les anciens fichiers dataless. La réussite de cette restauration et du build qui suit doit être consignée par l’agent principal ; elle n’a pas été testée par l’agent QA. Le README explique également comment conserver les fichiers téléchargés ou utiliser un dossier local. Aucun paquet installé, code applicatif, paramètre système ni processus étranger n’a été modifié par l’agent QA pour ce diagnostic.

## Git et limites

Le dépôt `Nutlope/hallmark` est une source d’outillage, pas la destination du site. Le dépôt confirmé `sarbhakan/site_siray` a été vérifié en lecture seule avec le connecteur GitHub : public, branche par défaut `main`, taille déclarée nulle au contrôle, droits de lecture et de push disponibles. Aucun push ni changement de remote par l’agent QA.

La revue ne constitue pas une certification WCAG. L’agent QA n’a contrôlé aucun navigateur en parallèle de l’agent principal. Les contrastes sur photographies, le rendu mobile, le zoom, le focus réel, les interactions tactiles, le mode sans JavaScript et le mouvement réduit relèvent de la preuve navigateur de l’agent principal, conservée séparément dans son rapport. Aucun téléphone physique, lecteur d’écran ou test de connexion mobile réelle n’a été utilisé ici. Les photos client et les informations commerciales restent à intégrer selon le brief.

Verdict technique : les artefacts statiques et les routes sont exploitables. Le dernier contrôle a été limité aux corrections demandées et à leur poids JavaScript ; il confirme les corrections de mouvement, de textes fonctionnels du pied de page et de la galerie, de fond des mentions photographiques et de recadrage. Aucun contrôle complet ni détecteur n’a été relancé après ces corrections, puisque les réserves identifiées étaient ciblées.

## État final après intégration

Le dernier passage a regroupé les couleurs dans les tokens, retiré le petit texte redondant et relevé la sous-marque, la provenance photo et les liens fonctionnels à12px. Le navigateur confirme les12px réels pour la sous-marque et la mention photo sur téléphone. Le scan Hallmark final conserve un seul FAIL brut : le scan de Layout.astro ne résout pas sa feuille globale importée, où `html, body { overflow-x: clip; }` est bien présent et appliqué. Les184REFLEX, surtout une échelle d'espacement imposée par l'outil, et24WARN sont conservés comme limites d'un lint stylistique, sans prétendre à un résultat entièrement vert. Taste final ne produit ni FAIL ni WARN. Le rapport navigateur séparé fournit le périmètre réellement rendu.

Validation finale : les dépendances ont été réinstallées avec `npm ci` depuis le lockfile dans un dossier temporaire local, puis restaurées comme répertoire réel du projet. La vérification ET la compilation avec Node24.22.3 ont réussi :19fichiers,0erreur,0avertissement,0hint,12pages. Le contrôle HTML final passe également. Aucun lien symbolique vers les dépendances temporaires n'est laissé dans le projet.
