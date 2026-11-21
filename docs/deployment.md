# Publier Siray Signature

Le site est une vitrine statique : les pages, styles, scripts, images et polices sont déjà compilés dans les archives. Aucun serveur, base de données ou secret n’est nécessaire à leur consultation. Les commandes restent sur Instagram.

Deux fichiers de livraison sont fournis dans `releases/v13/` : `siray-signature-v13-netlify.zip` et `siray-signature-v13-cloudflare-pages.zip`. Ils contiennent le même site portable, avec `index.html` à la racine. Le présent guide, le manifeste et les sommes SHA-256 sont séparés des ZIP et ne sont pas publiés. Le script de livraison n’ouvre aucun compte et ne déploie rien à distance.

## Choisir une plateforme

**Le choix recommandé pour la suite est Cloudflare Pages relié à GitHub.** Le réglage initial demande une connexion des comptes ; ensuite, les modifications validées et poussées sur `main` sont compilées et publiées automatiquement. Pour lancer le site uniquement à partir des fichiers livrés, Cloudflare accepte directement le ZIP. Netlify Drop est une alternative simple si l’on préfère déposer un dossier. Cette recommandation tient à la nature statique du site et au souhait de limiter les manipulations futures. [Intégration Git Cloudflare](https://developers.cloudflare.com/pages/get-started/git-integration/), [Netlify Drop](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/).

| Solution | Départ | Mises à jour | URL gratuite possible |
| --- | --- | --- | --- |
| Cloudflare Pages avec GitHub | Relier le dépôt et renseigner les réglages ci-dessous | Automatiques après un push sur `main` | `siray-signature.pages.dev` |
| Cloudflare Pages Direct Upload | Déposer le ZIP livré | Déposer la nouvelle archive dans le même projet | `siray-signature.pages.dev` |
| Netlify Drop | Extraire le ZIP puis déposer le dossier obtenu | Redéposer le dossier actualisé dans le même projet | `siray-signature.netlify.app` |

Ces adresses sont des **exemples souhaités, non réservés**. Chaque plateforme attribue un sous-domaine HTTPS dont le nom dépend de la disponibilité. Un domaine personnel, par exemple `siraysignature.fr`, peut être raccordé ensuite ; son achat et son renouvellement sont distincts de l’hébergement gratuit. [Adresses Netlify](https://docs.netlify.com/manage/projects/how-projects-work/), [domaines Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/).

**Cloudflare Pages Free** annonce des requêtes et une bande passante sans quota de consommation pour Pages. Les limites techniques restent applicables : 500 compilations par mois, 20 000 fichiers par site, 25 MiB par fichier. Le dépôt manuel dans l’interface a sa propre limite de 1 000 fichiers. Le manifeste livré donne le nombre exact de fichiers de cette version. Les documents Pages et conditions consultés n’imposent pas de restriction générale aux seuls usages personnels ; la recommandation pour cette vitrine commerciale repose sur cette lecture. [Offre Pages](https://www.cloudflare.com/products/pages/), [limites Pages](https://developers.cloudflare.com/pages/platform/limits/), [conditions](https://www.cloudflare.com/terms/).

**Netlify Free** autorise explicitement l’usage commercial et inclut 300 crédits mensuels, avec une limite ferme sans recharge automatique. Un déploiement de production réussi utilise 15 crédits ; la bande passante, 20 crédits par Go ; les requêtes, 2 crédits par 10 000. Les aperçus n’utilisent pas les crédits de déploiement de production, mais leurs visites consomment aussi des ressources. Lorsque l’enveloppe est épuisée, tous les projets de l’équipe sont mis en pause. Cela justifie la préférence pour Cloudflare lorsque plusieurs mises à jour sont prévues. [Usage commercial Netlify](https://www.netlify.com/platform/), [offre Free](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [calcul des crédits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).

## Lancer depuis GitHub et automatiser les mises à jour

Le dépôt est [sarbhakan/site_siray](https://github.com/sarbhakan/site_siray). Sa publication sur GitHub conserve les sources. La connexion à un hébergeur déclenche ensuite les publications du site.

Sur **Cloudflare Pages** :

1. Se connecter à [Cloudflare](https://dash.cloudflare.com/) avec une offre gratuite, puis ouvrir **Workers & Pages → Create application → Pages → Connect to Git**. Selon l’écran, l’action peut s’intituler **Import an existing Git repository**.
2. Choisir GitHub, autoriser l’accès au dépôt `sarbhakan/site_siray` et le sélectionner.
3. Choisir un nom de projet disponible et la branche de production `main`.
4. Renseigner la commande `npm run build`, le dossier de sortie `dist` et laisser le dossier racine vide. Ajouter `NODE_VERSION=24` aux variables de compilation ; le site utilise une sortie Astro statique, sans adaptateur serveur à ajouter.
5. Lancer **Save and Deploy**. Une fois l’adresse de production attribuée, définir `SITE_URL` avec cette adresse HTTPS exacte dans les variables du projet, pour les compilations de production et d’aperçu. Relancer le déploiement une fois pour fixer les métadonnées.

Après ce réglage, un push sur `main` publie automatiquement. Les propositions à relire passent par une autre branche et leur aperçu ; une fois validées, leur intégration dans `main` met le site à jour. Aucune nouvelle archive à déposer. [Procédure Git Cloudflare](https://developers.cloudflare.com/pages/get-started/git-integration/), [réglages Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [version Node](https://developers.cloudflare.com/pages/configuration/build-image/).

Sur **Netlify**, utiliser **Add new project → Import an existing project → GitHub**, sélectionner le même dépôt et `main`. Laisser le dossier de base vide. Le fichier `netlify.toml` du dépôt prévoit déjà `npm run build`, `dist` et Node 24. Après attribution ou renommage du projet, définir également `SITE_URL` avec l’adresse de production, relancer une compilation et vérifier sa visibilité publique. Les prochaines mises à jour de `main` seront automatiques. [Import Git Netlify](https://docs.netlify.com/manage/projects/add-new-project/#import-from-an-existing-repository).

## Lancer uniquement avec le ZIP Cloudflare

1. Se connecter à [Cloudflare](https://dash.cloudflare.com/) et ouvrir **Workers & Pages**.
2. Choisir **Create application → Get started → Drag and drop your files** dans le parcours Pages.
3. Choisir le nom du projet et déposer directement `siray-signature-v13-cloudflare-pages.zip`, depuis `releases/v13/`.
4. Lancer **Deploy site**, puis **Save and Deploy** si demandé. Copier l’adresse de production `nom-du-projet.pages.dev`.
5. Pour les prochaines versions, ouvrir ce même projet, choisir **Create a new deployment**, sélectionner **Production** et déposer la nouvelle archive.

Le ZIP contient le site compilé, sans dossier enveloppant. La limite du dépôt par l’interface est de 1 000 fichiers, 25 MiB chacun. **Choisir Git dès le départ si l’on veut les mises à jour automatiques** : un projet créé en Direct Upload ne peut pas être converti vers l’intégration Git. Il faudra alors un nouveau projet, ou une automatisation technique avec Wrangler. [Direct Upload Cloudflare](https://developers.cloudflare.com/pages/get-started/direct-upload/).

Après la première publication, transmettre l’adresse attribuée pour recréer l’archive avec les métadonnées définitives, puis la redéposer dans le même projet. Le site reste consultable dès le premier dépôt ; ce second passage fixe les URL de partage et de référencement.

## Lancer avec Netlify Drop

1. Se connecter à son compte Netlify Free pour conserver et administrer le site.
2. Extraire `releases/v13/siray-signature-v13-netlify.zip` dans un dossier. Ce dossier doit contenir directement `index.html`, `404.html`, `_headers`, `_astro/` et `images/`.
3. Dans [Netlify Drop](https://app.netlify.com/drop), déposer **ce dossier extrait** : il contient exactement le site déjà compilé et contrôlé. Ce parcours par dossier compilé est celui retenu ici ; la documentation actuelle mentionne aussi les ZIP et, après connexion, la compilation de sources. Le dossier de travail contenant toutes les sources et dépendances n’est pas nécessaire pour cette méthode.
4. Si le projet est privé, choisir **Make public** après le déploiement réussi. Sa visibilité dépend des réglages de l’équipe. Tester l’adresse dans une fenêtre privée pour vérifier l’accès sans connexion.
5. Pour choisir l’adresse, ouvrir **Project Overview → Customize → Manage project name and cover image**, puis saisir un nom disponible. Ce nom détermine le sous-domaine `netlify.app` ; le renommer change donc l’adresse à partager.
6. Pour une mise à jour manuelle, déposer le nouveau dossier compilé dans la zone de déploiement du **même projet**. Cela conserve son adresse de production.

[Procédure Netlify Drop](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/), [extraction d’un ZIP](https://docs.netlify.com/deploy/create-deploys/), [visibilité publique](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/), [nom du projet](https://docs.netlify.com/manage/projects/customize-project-name-and-cover-image/).

Après choix de l’adresse, recréer les métadonnées et redéposer la nouvelle version comme pour Cloudflare. Un premier lancement depuis le dossier ne demande aucune installation locale de Node, Python ou d’un autre outil.

## Fixer l’URL et recréer les archives

Cette partie concerne la préparation des prochaines livraisons, pas le premier dépôt manuel. L’archive fonctionne avant de connaître son adresse publique : ses liens partent de la racine du site. Pour les URL canoniques et les aperçus de partage, recompiler après attribution du nom définitif. La priorité de configuration est `SITE_URL`, puis `URL` fourni par Netlify, puis `CF_PAGES_URL` fourni par Cloudflare. **Renseigner explicitement `SITE_URL` avec l’adresse fixe de production**, y compris pour les builds d’aperçu. Une adresse Cloudflare comportant un hash de déploiement ou un nom de branche n’est pas l’origine de production à retenir. Garder `SITE_URL` vide avant attribution ; le fichier `.env.example` donne le format.

Exemple de préparation locale, depuis le projet avec Node 24. Remplacer le texte entre chevrons par **l’adresse réellement attribuée** ; les lignes sont des exemples à adapter et ne réservent aucun nom :

```sh
npm ci
SITE_URL='https://<adresse-attribuee>' npm run build
python3 scripts/check-site.py
python3 scripts/package-release.py --dist dist --output-dir releases/v13 --version v13 --site-url 'https://<adresse-attribuee>'
```

Si aucune URL n’est encore attribuée, omettre `SITE_URL` et `--site-url`. Le script bloque les URL `localhost` dans le HTML. Il ne remplace pas les métadonnées et ne lance pas de compilation ; `--site-url` vérifie l’origine déjà inscrite dans le résultat compilé. Son manifeste indique si une origine finale a été vérifiée. L’affichage des images de partage n’est pas garanti tant qu’elles utilisent un chemin relatif.

L’origine renseignée doit être HTTPS, sans chemin, identifiants, paramètres ni fragment. Pour livrer deux versions avec des origines finales différentes, compiler et empaqueter séparément chaque cible avec son adresse attribuée et un dossier de sortie distinct. Si les deux sont publiées en même temps, choisir une adresse principale pour les liens publics et la bio Instagram. Après raccordement d’un domaine personnel, refaire ce réglage avec ce domaine.

Le fichier public `_headers` accompagne les deux archives : protections d’en-têtes, cache d’un an pour les ressources hachées de `_astro/`, et d’une semaine pour `images/`. Remplacer une image sous le même nom peut donc laisser l’ancienne version en cache pendant une semaine ; un nom de fichier nouveau évite cette ambiguïté. La page `404.html` est conservée et aucun repli généralisé vers `index.html` n’est ajouté. [En-têtes Netlify](https://docs.netlify.com/manage/routing/headers/), [en-têtes Pages](https://developers.cloudflare.com/pages/configuration/headers/).

## Contrôler la livraison

Le script utilise uniquement Python standard. Il vérifie la présence de `index.html`, `404.html` et `_headers`, les limites du dépôt Cloudflare, l’absence d’URL locale dans le HTML et l’intégrité ZIP. Le manifeste liste les fichiers, leurs tailles et leurs SHA-256. Les archives sont reproductibles à contenu identique ; les dates de leurs entrées sont fixes. Les deux ZIP peuvent avoir le même SHA-256 puisqu’ils transportent le même site compatible avec les deux plateformes.

Pour contrôler le téléchargement sur macOS ou Linux, se placer dans le dossier livré `releases/v13/` :

```sh
shasum -a 256 -c siray-signature-v13-SHA256SUMS.txt
```

Avant de mettre l’adresse dans la bio Instagram, ouvrir l’URL de production sur un téléphone et en navigation privée. Tester le menu, les sept prestations, les choix de saveurs, la galerie, les liens Instagram et le retour à l’accueil par le logo. Ouvrir directement une page intérieure, puis une adresse inventée : la première doit fonctionner sans passer par l’accueil, la seconde afficher la page 404. Un contrôle de livraison local ne remplace pas cette vérification du site réellement hébergé. Aucun déploiement distant n’est attesté par la création des archives.

Documentation officielle consultée le **21 novembre 2026**. Les offres et les libellés d’interface peuvent évoluer ; les limites indiquées concernent les offres consultées à cette date.
