# Publier Siray Signature

Le site est une vitrine statique : les pages, styles, scripts, images et polices sont déjà compilés dans les archives. Aucun serveur, base de données ou secret n’est nécessaire à leur consultation. Les commandes restent sur Instagram.

Deux fichiers de livraison sont prévus dans `releases/v12/` : `siray-signature-v12-netlify.zip` et `siray-signature-v12-cloudflare-pages.zip`. Ils contiennent le même site portable, avec `index.html` à la racine. Le présent guide, le manifeste et les sommes SHA-256 sont séparés des ZIP et ne sont pas publiés. Le script de livraison n’ouvre aucun compte et ne déploie rien à distance.

## Choisir une plateforme

**Netlify Free** convient à cette activité commerciale et prolonge la configuration existante. Son offre actuelle est limitée à 300 crédits mensuels : déploiements de production, requêtes et bande passante consomment la même enveloppe. À épuisement, les sites du compte peuvent être suspendus jusqu’au cycle suivant ; Free ne facture pas de dépassement automatique. Ne pas interpréter cette offre comme un trafic illimité. L’usage commercial est explicitement autorisé. [Offre et limites Netlify](https://www.netlify.com/pricing/), [crédits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [usage commercial](https://www.netlify.com/platform/).

**Cloudflare Pages Free** est l’autre cible : le dépôt manuel accepte un ZIP ou un dossier. La documentation consultée ne réserve pas Pages aux usages personnels ; cette vitrine commerciale statique, sans collecte de carte bancaire, est compatible avec le périmètre étudié. L’offre annonce des requêtes et une bande passante non décomptées, tout en conservant des limites techniques et des conditions d’usage. Le dépôt manuel est limité à 1 000 fichiers et à 25 MiB par fichier ; la limite générale Free est de 20 000 fichiers et 500 compilations mensuelles via Git. [Présentation Pages](https://www.cloudflare.com/products/pages/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [limites](https://developers.cloudflare.com/pages/platform/limits/), [conditions](https://www.cloudflare.com/terms/).

Chaque plateforme fournit un sous-domaine HTTPS gratuit : `nom-attribue.netlify.app` ou `nom-attribue.pages.dev`. Le nom se choisit sous réserve de disponibilité ; aucune de ces adresses n’est réservée par la livraison. Un domaine personnel peut être raccordé ensuite, mais son achat et son renouvellement restent distincts de l’hébergement. [Adresses Netlify](https://docs.netlify.com/manage/projects/how-projects-work/), [domaines Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Les informations commerciales et juridiques non encore fournies doivent être complétées avec les renseignements réels de Siray Signature et de la plateforme finalement retenue. Aucune adresse d’entreprise ou d’hébergeur n’est inventée dans le guide.

## Déposer l’archive sur Netlify

1. Se connecter à son compte Netlify Free pour conserver et administrer le site.
2. Extraire `releases/v12/siray-signature-v12-netlify.zip` dans un dossier. Ce dossier doit contenir directement `index.html`, `404.html`, `_headers`, `_astro/` et `images/`.
3. Dans [Netlify Drop](https://app.netlify.com/drop), déposer **ce dossier extrait**. Ne pas déposer le dossier des sources, `node_modules`, ni le ZIP non extrait. Aucun build n’est lancé par un dépôt manuel.
4. Choisir le nom disponible du projet. Vérifier sa visibilité : sur les nouvelles offres, un projet peut rester privé jusqu’à l’action « Make public ». Le rendre public au moment du lancement voulu.
5. Ouvrir l’adresse de production, puis tester directement `/creations/layer-cakes/`, `/buffets/`, `/plateaux/` et `/contact/`. Une adresse inconnue doit afficher la page 404.
6. Pour une mise à jour manuelle, déposer le nouveau dossier compilé dans la zone de déploiement du **même projet**. Cela conserve son adresse de production.

[Procédure Netlify officielle](https://docs.netlify.com/deploy/create-deploys/), [visibilité du projet](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/).

## Déposer l’archive sur Cloudflare Pages

1. Se connecter à Cloudflare et ouvrir « Workers & Pages ».
2. Créer une application Pages et choisir « Drag and drop your files » / « Direct Upload ».
3. Choisir un nom disponible pour le projet, puis déposer directement `releases/v12/siray-signature-v12-cloudflare-pages.zip`. Le ZIP contient `index.html` à sa racine, sans dossier enveloppant.
4. Lancer « Deploy site » ou « Save and Deploy », puis tester les mêmes pages et une adresse inconnue.
5. Pour mettre à jour, ouvrir le même projet, choisir « Create a new deployment » et déposer la nouvelle archive en production.

Le mode de création compte : un projet **Direct Upload ne peut pas être converti en intégration Git**. Si l’on veut les publications automatiques depuis GitHub, choisir l’intégration Git dès la création, ou créer ensuite un projet distinct. Un projet Git peut aussi recevoir des déploiements Wrangler après désactivation des builds automatiques, mais pas un dépôt manuel dans l’interface. [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [intégration Git](https://developers.cloudflare.com/pages/get-started/git-integration/).

## Publier ensuite depuis GitHub

Le dépôt métier est `sarbhakan/site_siray`. Pousser du code sur GitHub conserve les sources ; cela ne publie le site que si une intégration d’hébergement a été activée.

Sur Netlify, importer le dépôt, choisir la branche de production `main` et laisser le dossier de base vide. La configuration `netlify.toml` indique `npm run build`, le dossier publié `dist` et Node 24. Sur Cloudflare Pages, choisir « Connect to Git », sélectionner le dépôt, puis renseigner la même commande et le même dossier ; définir `NODE_VERSION=24` dans les variables de compilation. Aucun adaptateur serveur Cloudflare n’est nécessaire pour la sortie Astro statique de ce projet. [Netlify et Git](https://docs.netlify.com/deploy/create-deploys/), [Astro sur Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [version Node Pages](https://developers.cloudflare.com/pages/configuration/build-image/).

Une fois l’intégration activée, un push sur `main` peut déclencher une publication publique. Les changements destinés à être seulement relus doivent donc rester sur une autre branche jusqu’à leur validation.

## Fixer l’URL et recréer les archives

L’archive peut fonctionner avant de connaître son adresse publique : les liens du site partent de sa racine. Pour les URL canoniques et les aperçus de partage, recompiler après attribution du nom de production. La priorité de configuration est `SITE_URL`, puis `URL` fourni par Netlify, puis `CF_PAGES_URL` fourni par Cloudflare. Une origine renseignée doit être HTTPS, sans chemin, identifiants, paramètres ni fragment. Garder `SITE_URL` vide tant que l’adresse n’est pas connue ; le fichier `.env.example` donne le format.

Exemple de préparation locale, depuis le projet avec Node 24. Remplacer le texte entre chevrons par **l’adresse réellement attribuée** ; les lignes sont des exemples à adapter et ne réservent aucun nom :

```sh
npm ci
SITE_URL='https://<adresse-attribuee>' npm run build
python3 scripts/check-site.py
python3 scripts/package-release.py --dist dist --output-dir releases/v12 --version v12 --site-url 'https://<adresse-attribuee>'
```

Si aucune URL n’est encore attribuée, omettre `SITE_URL` et `--site-url`. Le script bloque les URL `localhost` dans le HTML. Il ne remplace pas les métadonnées et ne lance pas de compilation ; `--site-url` vérifie l’origine déjà inscrite dans le résultat compilé. Son manifeste indique si une origine finale a été vérifiée. L’affichage des images de partage n’est pas garanti tant qu’elles utilisent un chemin relatif.

Pour livrer deux versions avec des origines finales différentes, compiler et empaqueter séparément chaque cible avec son adresse attribuée et un dossier de sortie distinct. Si les deux sont publiées en même temps, choisir une adresse principale pour les liens publics et la bio Instagram. Après raccordement d’un domaine personnel, refaire ce réglage avec ce domaine.

Le fichier public `_headers` accompagne les deux archives : protections d’en-têtes, cache d’un an pour les ressources hachées de `_astro/`, et d’une semaine pour `images/`. Remplacer une image sous le même nom peut donc laisser l’ancienne version en cache pendant une semaine ; un nom de fichier nouveau évite cette ambiguïté. La page `404.html` est conservée et aucun repli généralisé vers `index.html` n’est ajouté. [En-têtes Netlify](https://docs.netlify.com/manage/routing/headers/), [en-têtes Pages](https://developers.cloudflare.com/pages/configuration/headers/).

## Contrôler la livraison

Le script utilise uniquement Python standard. Il vérifie la présence de `index.html`, `404.html` et `_headers`, les limites du dépôt Cloudflare, l’absence d’URL locale dans le HTML et l’intégrité ZIP. Le manifeste liste les fichiers, leurs tailles et leurs SHA-256. Les archives sont reproductibles à contenu identique ; les dates de leurs entrées sont fixes. Les deux ZIP peuvent avoir le même SHA-256 puisqu’ils transportent le même site compatible avec les deux plateformes.

Pour contrôler le téléchargement sur macOS ou Linux, se placer dans le dossier livré `releases/v12/` :

```sh
shasum -a 256 -c siray-signature-v12-SHA256SUMS.txt
```

Ce contrôle ne remplace pas le test final de l’URL publique, des routes, de la visibilité, des en-têtes HTTP et de la consultation sur mobile après publication. Aucun déploiement distant n’est attesté par la simple création des archives.

Documentation officielle consultée le **19 novembre 2026**. Les offres et les limites peuvent évoluer ; les vérifier dans le compte au moment du lancement.
