# V27 — Audit Modern Web Guidance et branche de revue

Contrôle local du 22 novembre 2026. Branche `codex/siray-v27-modern-web`, créée depuis `main` à `73a957c042bc4b9d41df97bd66c980bb2b81619c`. Le dernier contrôle distant de `main` pendant cette passe retrouve ce même commit. Aucun envoi sur `main`, aucune publication Cloudflare et aucun réglage de compte ou de domaine effectués dans cette passe.

## Installation et périmètre

Le dépôt officiel [GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src) est installé dans `.dev-toolkit/vendor/modern-web-guidance-src`, au commit `920ee542afc8785ddbadd9aee976c2eab9caf25f` (Apache-2.0). Il contient les sources des guides et les outils de rédaction/évaluation. Ces derniers ne sont pas nécessaires au site et leurs dépendances ne sont pas installées.

La CLI publiée `modern-web-guidance@1.0.1` est installée séparément dans `.dev-toolkit/runtime/modern-web`, avec une version exacte et les scripts d’installation désactivés. Ses appels utilisent `DISABLE_TELEMETRY=1`. Aucune dépendance n’est ajoutée au site, aucun hook ou outil global n’est enregistré. Les checkouts locaux sont exclus du dépôt et de l’export public. Leur présence est enregistrée dans `.dev-toolkit/installed.json` et leur usage dans `.dev-toolkit/usage.json`.

Exemples de réutilisation depuis ce worktree :

```sh
DISABLE_TELEMETRY=1 .dev-toolkit/runtime/modern-web/node_modules/.bin/modern-web-guidance search "light dismiss dialog"
DISABLE_TELEMETRY=1 .dev-toolkit/runtime/modern-web/node_modules/.bin/modern-web-guidance retrieve dialog
DISABLE_TELEMETRY=1 .dev-toolkit/runtime/modern-web/node_modules/.bin/modern-web-guidance legacy-scan . --json
```

L’analyse déterministe porte sur 38 guides et 52 règles, soit environ 20 % du catalogue selon l’outil. Elle est complétée par deux audits indépendants du code public et de l’admin, une revue finale distincte et les essais ci-dessous. Ce résultat ne représente pas une certification générale du site.

## Technologies et choix retenus

| Élément présent | Conclusion de cette passe |
|---|---|
| Astro 7.4.13, sortie statique et ClientRouter | Adapté au site multipage et à son export. Conserver le rendu HTML, les URL et les transitions. Corriger la conservation de l’état de navigation plutôt que remplacer le routeur. |
| TypeScript et CSS du projet | Pas de besoin constaté d’ajouter un framework d’interface ou une bibliothèque de composants. |
| GSAP 3.15.1 chargé dynamiquement pour l’accueil | Conserver les timings et la pause déjà approuvés. Le chargement reste absent pour une photo unique ou le mouvement réduit. Un remplacement WAAPI éventuel devra faire l’objet d’une mesure et d’une revue distinctes. |
| Images Astro/WebP et JPEG approuvés | Conserver variantes, dimensions réservées, chargement différé et compression des imports CMS. Ne pas recomprimer les JPEG source approuvés pour l’accueil. |
| Gloock et Manrope auto-hébergées | Conserver l’identité et le chargement local. Un ajustement métrique des fontes de repli nécessite une mesure des sauts de mise en page ; aucune valeur arbitraire introduite. |
| Sveltia CMS 0.270.0 et extensions locales | Conserver les trois rubriques, le cadrage, le zoom tactile, les aperçus et la corbeille. Renforcer le chargement externe et les dialogues. |
| Worker OAuth, GitHub et Cloudflare Pages | Architecture conservée. Aucun droit, identifiant autorisé, secret, domaine ou paramètre de déploiement modifié. Les permissions distantes ne sont pas réauditées dans cette passe. |

Les fichiers `package.json` et `package-lock.json` sont inchangés. `npm audit --omit=dev --json` retourne **0 vulnérabilité connue** pour le périmètre interrogé au moment du contrôle. Cela ne prouve pas l’absence de toute faille ; le script Sveltia externe n’appartient pas au graphe npm de ce site.

## Corrections réalisées

1. **Navigation de la galerie.** Le changement de filtre conserve `history.state`, utilisé par Astro pour l’historique et le défilement, ainsi que les paramètres de l’URL. « Tout voir » retire uniquement le fragment de catégorie. Le retour arrière vers une galerie filtrée fonctionne dans l’essai navigateur.
2. **Accueil avec une photo unique.** Cette configuration autorisée par le CMS n’essaie plus d’animer une photo vers elle-même, ce qui pouvait la masquer après 6,5 secondes. Elle reste statique, sans timer ni import de GSAP. Le comportement habituel à plusieurs photos est conservé.
3. **Description accessible du diaporama.** Le nom du bouton reste son action de pause/reprise ; une description séparée, reliée par `aria-describedby`, suit le sujet de la photo active. Aucun `aria-live` ajouté, pour éviter des annonces automatiques régulières. Le descriptif est hors des images masquées et apparaît dans l’arbre d’accessibilité du navigateur.
4. **Fermeture extérieure des fenêtres photo.** Le même pointeur primaire doit commencer et terminer dehors, sans mouvement significatif ni passage dans la fenêtre. Un glissement, une sélection de texte, une interruption ou un second doigt ne déclenchent pas une fermeture implicite. Annuler, Échap et Valider gardent leur comportement.
5. **Défilement des fenêtres.** Ajout de `overscroll-behavior: contain` aux dialogues et à leur fond, avec `overflow: hidden` sur le fond. Les verrous racine existants restent volontairement conservés : le guide indique des limites sur les conteneurs sans débordement, et nous ne disposons pas d’une validation Safari/iPhone physique qui permettrait de retirer ces replis sans risque. Il s’agit d’une amélioration progressive, pas d’une réécriture complète du modèle Google.
6. **Intégrité du script CMS.** Le script externe reste exactement en version 0.270.0. Son empreinte SHA-384 est calculée à partir du paquet npm de cette version, puis comparée octet par octet au fichier du CDN. `integrity`, `crossorigin="anonymous"` et `referrerpolicy="no-referrer"` sont ajoutés ensemble. Le CDN répond avec `Access-Control-Allow-Origin: *`, et le CMS se charge dans l’essai local. Une future mise à jour Sveltia devra changer la version et recalculer cette empreinte ensemble.

Empreinte du fichier `dist/sveltia-cms.js` de 2 627 861 octets :

```text
sha384-1PWMVQLxD8dGUGyxhuAzW9bW9EK+8qa/c6ntzhkqwb1x/1R58I64fX/zuQy+SgZF
```

## Signalements vérifiés et recommandations différées

Le scan initial signale quatre occurrences. Le signalement SRI est corrigé ; le scan final en conserve trois, documentées et examinées :

- Deux `JSON.parse(JSON.stringify(...))` dans les empreintes de publication sont une **normalisation JSON intentionnelle**, commune au navigateur et au build. Les remplacer par `structuredClone` modifierait les règles de normalisation et pourrait fausser la preuve de publication. Ces signalements correspondent à une exclusion explicite du guide.
- Le délai réseau du suivi de publication utilise un contrôleur et un minuteur explicitement nettoyé. La simplification proposée par `AbortSignal.timeout` est différée : aucun défaut de publication n’est constaté, et conserver le comportement éprouvé et le repli actuel est préférable pour cette passe. Ce signalement n’est pas présenté comme une correction effectuée.

Les CSS de transitions discrètes récentes, `content-visibility`, les métriques de fontes et la suppression de GSAP ne sont pas appliqués automatiquement. Leur bénéfice doit être mesuré et leur compatibilité évaluée, notamment pour Safari et le navigateur intégré à Instagram. Les guides marqués comme brouillons ne deviennent pas des prescriptions de production.

## Vérifications exécutées

- Compilation avant et après les changements avec Node 24 : `astro check && astro build`, **0 erreur, 0 avertissement** ; un indice TypeScript préexistant reste dans un double de test de publication. 25 routes Astro générées.
- Suite complète de cette passe : **297 tests réussis**, 0 échec. Elle couvre autorisation des deux comptes, contenus, médias, publication, corbeille, cadrage, aperçus et nouvelles interactions publiques. La suite des widgets comprend 300 assertions, avec 16 scénarios de fermeture sur chacun des deux dialogues.
- `python3 scripts/check-site.py` : **28 fichiers HTML**, 0 problème, 0 avertissement. Médias et configuration CMS validés dans le prébuild. `git diff --check` propre.
- Contrôle navigateur local à 390 × 844 et 1280 × 900 : accueil, pause du diaporama, menu mobile et navigation vers une fiche, onglets et famille Chocolats, filtre Bento cakes et conservation de la query, navigation Maison puis retour arrière avec filtre restauré, retour à « Tout voir ».
- Fixture admin locale sans authentification ni enregistrement : réglage plein écran à zoom 2 puis Échap conserve zoom 1 et rend le focus ; Valider applique zoom 2 ; clic extérieur sur ordinateur ferme sans changer ce réglage ; verrou de défilement rétabli ; corbeille puis restauration de la même photo ; aperçu complet Accueil mobile puis Galerie ordinateur à jour.
- Le véritable éditeur local atteint son écran de connexion après chargement du script protégé par SRI. Aucune connexion ni écriture sur le dépôt effectuée depuis cet écran.
- Les textes, tarifs, photographies et trois fichiers éditables sont identiques à la base de `main`. Aucune ressource Google d’audit n’est incluse dans `dist`.

Les scripts initiaux des pages publiques mesurées passent de 8 341 à **8 391 octets gzip**, soit **+50 octets**. Le coût de cette passe est donc négligeable en volume JS initial, sans nouvelle bibliothèque. Cette mesure n’inclut ni les images, ni les fontes, ni GSAP chargé ensuite, ni le CMS externe. Aucun gain de Core Web Vitals n’est revendiqué sans mesure de terrain ou test dédié.

Les essais navigateur utilisent un navigateur de bureau à des largeurs représentatives. Ils ne remplacent ni un iPhone physique, ni un lecteur d’écran, ni un audit WCAG complet, ni des mesures de réseau mobile réel.

## Revue locale et étape suivante

Aperçu courant : `http://127.0.0.1:4385/` sur cet ordinateur, tant que le serveur reste lancé. La fixture `__test-v27` est temporaire et absente de l’export du site ; elle n’a aucun bouton de publication.

Les preuves et captures locales sont conservées à côté du worktree, dans `releases/v27-modern-web`. Cette passe reste sur une branche locale de revue. Après validation par Hakan : récupérer à nouveau le dernier `main`, préserver les contenus de Selin éventuellement ajoutés entre-temps, intégrer le code, refaire les contrôles nécessaires, puis seulement publier et vérifier le domaine.

## Sources réellement appliquées

- [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance-src), guides `secure-external-subresources`, `accessibility`, `dialog`, `prevent-page-scroll-under-modal-dialog` : intégrité, distinction nom/description, fermeture par geste complet et contention progressive. Le guide `carousel` est consulté pour le contexte accessible, sans adopter sa structure de défilement et ses commandes supplémentaires, contraires au brief existant.
- Dev Toolkit : installation isolée des sources et traçabilité de l’usage. Impeccable : consignes `harden` et `craft-floor` lues pour les gestes interrompus, états et préservation de l’identité. Son chargement automatique de contexte n’a pas abouti ; les documents du projet ont été lus directement.
