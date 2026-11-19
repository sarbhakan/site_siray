# Siray Signature V8 — hébergement et archives

Sources officielles consultées le **19 novembre 2026**. Recherche en lecture seule sur le Web ; aucun compte créé, aucune réservation de nom ni publication distante. Les prix et limites reflètent les pages consultées et devront être revérifiés au lancement.

## Choix retenu

Préparer **deux archives**, Netlify et Cloudflare Pages. Une troisième n’apporte pas d’avantage établi pour cette vitrine commerciale. Le contenu statique est portable entre les deux ; la distinction porte sur la procédure de dépôt et le suivi des publications. Le guide opérationnel complet est `docs/deployment.md`.

Netlify demeure la continuité du projet existant : le README, `AGENTS.md` et les anciens rapports le désignent comme première cible. Cloudflare Pages constitue une autre solution et accepte directement les archives précompilées. Les documents locaux examinés ne prouvent aucune création de compte ou connexion d’hébergement existante.

## Offres et réserves vérifiées

| Cible | Résultat de la vérification | Conséquence |
| --- | --- | --- |
| Netlify Free | Usage commercial expressément permis, dans la limite mensuelle du plan. | Adapté à Siray Signature. [FAQ commerciale](https://www.netlify.com/platform/). |
| Netlify Free actuel | 300 crédits/mois ; production : 15 crédits/déploiement ; trafic : 20 crédits/Go et 2 crédits/10 000 requêtes. Limite dure, sans recharge sur Free. | Ne pas reprendre les anciennes promesses « 100 Go gratuits ». Déploiements et trafic partagent l’enveloppe ; le nombre réel de visites dépend du poids servi et du cache. [Crédits officiels](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/). |
| Netlify Free à épuisement | Les sites du compte peuvent être mis en pause jusqu’au cycle suivant. | Gratuit ne signifie pas disponibilité ou trafic illimités. [Tarification](https://www.netlify.com/pricing/). |
| Cloudflare Pages Free | 500 compilations mensuelles, 20 000 fichiers, 25 MiB par fichier. Le dépôt dans l’interface est limité à 1 000 fichiers. | Dimension adaptée au site relevé ; recontrôler les tailles après ajout des photos. [Limites Pages](https://developers.cloudflare.com/pages/platform/limits/), [limites du dépôt manuel](https://developers.cloudflare.com/pages/get-started/direct-upload/). |
| Cloudflare Pages et activité commerciale | Les conditions consultées ne réservent pas le service aux projets personnels ; le contrat s’applique aussi à une entité. Les services gratuits ne doivent pas traiter de données de cartes bancaires. | Compatibilité de cette vitrine sans paiement : conclusion de l’examen de ces conditions, et non citation d’une FAQ commerciale explicite. [Contrat](https://www.cloudflare.com/terms/), [conditions Developer Platform](https://www.cloudflare.com/service-specific-terms-developer-platform/). |
| Cloudflare et trafic | Pages annonce des requêtes et une bande passante non décomptées ; les limites techniques et conditions restent applicables. | Ne pas promettre de gratuité ou de service sans aucune limite. [Présentation Pages](https://www.cloudflare.com/products/pages/). |

Les sous-domaines proposés sont `nom-attribue.netlify.app` et `nom-attribue.pages.dev`, sous réserve de disponibilité du nom. Netlify permet de renommer le projet et donc son adresse. Cloudflare attribue le sous-domaine au projet. Un domaine personnel implique un enregistrement et un renouvellement distincts ; aucun nom n’est réservé ici. [Adresse Netlify](https://docs.netlify.com/manage/projects/how-projects-work/), [nom du projet Pages](https://developers.cloudflare.com/pages/get-started/git-integration/), [raccordement d’un domaine Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Options écartées

**Vercel Hobby** est réservé aux usages personnels ou non commerciaux dans les conditions en vigueur, mises à jour le 19 octobre 2026. La vitrine vise une activité commerciale : aucune archive Hobby n’est retenue. [Conditions Vercel, section 4](https://vercel.com/legal/terms#hobby-plan).

**GitHub Pages** n’est pas proposé comme hébergement gratuit de la boutique. Ses limites excluent l’exploitation d’une activité en ligne et les sites principalement destinés à faciliter des transactions commerciales. Les demandes passant par Instagram ne suffisent pas à établir une exception pour cette vitrine ; le dépôt GitHub reste adapté au stockage des sources. [Limites GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Dépôt manuel et lien avec Git

Netlify Drop attend le **dossier extrait contenant le site compilé**, pas le ZIP brut, et ne lance pas de build. Une connexion Git construit les commits futurs. Les nouveaux projets peuvent être privés par défaut : vérifier « Make public » avant diffusion de l’URL dans Instagram. [Création des déploiements](https://docs.netlify.com/deploy/create-deploys/), [visibilité](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/).

Cloudflare Direct Upload accepte un **ZIP à racine `index.html`** ou un dossier. Un projet Direct Upload ne se convertit pas ensuite en projet Git ; il faut alors un autre projet. Le mode Git peut recevoir des déploiements Wrangler, mais pas de dépôt dans l’interface. Pour le suivi automatique de `main`, sélectionner Git dès la création. [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Git Pages](https://developers.cloudflare.com/pages/get-started/git-integration/).

Les deux intégrations utilisent `npm run build` et `dist`. Netlify fixe déjà Node 24 dans `netlify.toml`. Cloudflare permet `NODE_VERSION=24` ; son tableau documente une version Node personnalisable. Le site reste `output: 'static'` et n’a besoin d’aucun adaptateur serveur. [Configuration Astro Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [image de compilation](https://developers.cloudflare.com/pages/configuration/build-image/).

## Constat local et corrections de livraison

Avant cette passe, `dist/` contient 82 fichiers, 3 342 785 octets non compressés ; le plus gros pèse 322 492 octets. Il ne contient pas de canonical et son `og:image` pointe vers `http://localhost:4321`. Il ne s’agit pas d’un relevé du futur export V8 avec les photos réelles.

Sept ZIP Netlify anciens ont été retrouvés dans le dossier principal (version initiale puis V2 à V7). Leur `index.html` est à la racine, mais ils ne contiennent ni `_headers` ni `netlify.toml`. La configuration d’en-têtes présente dans le dépôt ne suffit donc pas à transporter ces en-têtes dans les dépôts manuels.

La passe coordonnée ajoute `public/_headers`, commun aux deux plateformes : protections identiques à `netlify.toml`, cache de 31 536 000 secondes pour `_astro/*` et de 604 800 secondes pour `images/*`. Les deux fournisseurs interprètent ce fichier dans la sortie statique. [En-têtes Netlify](https://docs.netlify.com/manage/routing/headers/), [en-têtes Pages](https://developers.cloudflare.com/pages/configuration/headers/).

L’origine de compilation suit désormais `SITE_URL || URL || CF_PAGES_URL`, avec validation du format HTTPS et rejet des origines locales connues. Netlify documente `URL` comme adresse principale ; Cloudflare documente `CF_PAGES_URL` comme URL du déploiement courant. Pour un canonical stable, définir `SITE_URL` après attribution de l’adresse de production. Ne pas réserver ou supposer un sous-domaine au seul stade de l’archive. [Variables Netlify](https://docs.netlify.com/build/configure-builds/environment-variables/), [variables Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/).

`Layout.astro` relève de la passe principale : le fallback sans origine finale doit rester portable et ne contenir aucune adresse localhost. Les métadonnées de partage ne sont pleinement finalisées qu’une fois l’origine connue.

## Livrables et commandes

Le script `scripts/package-release.py` ne construit pas le site et n’utilise aucune dépendance tierce. Il empaquette un `dist` déjà produit, contrôle les limites du dépôt manuel, bloque les URL locales dans le HTML et livre deux ZIP, un guide séparé, un manifeste et des SHA-256. Les fichiers du guide et du manifeste restent hors de la racine publiée. Les ZIP peuvent avoir le même hash puisqu’ils portent le même contenu portable.

Après le build et les contrôles de la passe principale, commande de livraison sans nom de production inventé :

```sh
python3 scripts/package-release.py --dist dist --output-dir releases --version v8
```

Après attribution d’une adresse réelle, utiliser cette valeur pour le build puis le contrôle de l’archive :

```sh
SITE_URL='https://<adresse-reellement-attribuee>' npm run build
python3 scripts/check-site.py
python3 scripts/package-release.py --dist dist --output-dir releases --version v8 --site-url 'https://<adresse-reellement-attribuee>'
```

Ces commandes sont des instructions à exécuter par la passe principale ; aucun build n’a été lancé pour cette contribution. Le paramètre `--site-url` vérifie le HTML précompilé, il ne le réécrit pas. Le guide détaille les écrans de dépôt, les mises à jour du même projet et le raccordement Git. Aucun résultat de production, de navigateur ou de mise en ligne n’est déduit de la recherche.

## Vérifications de cette contribution

Un jeu statique synthétique, créé puis supprimé dans un dossier temporaire, a permis de vérifier : deux ZIP identiques avec entrées à la racine, guide hors des ZIP, stabilité des hashes, refus d’une URL localhost, refus d’une origine locale, détection d’un canonical manquant lorsque `--site-url` est demandé, vérification d’une origine explicite et refus de l’absence de `_headers`. La configuration Astro a été évaluée en mémoire avec `defineConfig` remplacé par une fonction identité pour vérifier les priorités des trois variables et les rejets HTTP, localhost et sous-chemin. Ces contrôles ne constituent ni un build Astro ni une création des archives réelles V8.
