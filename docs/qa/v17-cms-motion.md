# V17 — édition des contenus et défilement des choix

Contrôle du 21 novembre 2026. La V17 est publiée sur `https://siraysignature.fr`, hébergé par Cloudflare Pages avec GitHub `main`. L’authentification, une sauvegarde de texte et un import photographique ont été vérifiés de bout en bout. Les limites des essais sur téléphone restent précisées ci-dessous.

## Périmètre

La V17 prépare Sveltia CMS 0.270.0 à `/admin/`, avec trois fichiers de contenu : `src/content/catalog.json`, `src/content/photography.json` et `src/content/pages.json`. Les adaptateurs conservent les exports consommés par les pages et les adresses des sept prestations. Les textes, tarifs, saveurs, compositions et modalités métier sont migrés depuis les sources existantes, sans nouvelle donnée commerciale.

Les fichiers importés dans `src/assets/uploads/` sont résolus par Astro et transformés en variantes WebP. Les photographies existantes gardent le registre, les variantes et les livraisons JPEG V10 approuvées. Les cartes « À découvrir aussi » utilisent désormais le champ photo éditable `request` ; ce champ était auparavant exposé sans être raccordé au rendu. Ses valeurs initiales conservent les visuels affichés avant cette correction.

Les choix de volets principaux, de familles de saveurs et de brunch déclenchent un défilement de 440 ms vers leurs commandes. Le groupe visé garde un espace de 16 px sous l’en-tête réel, afin de montrer le choix et le contenu qui le suit. Le mouvement est interruptible ; les onglets ne deviennent pas sticky. Le mode sans JavaScript et la navigation au clavier restent conservés.

## Résultats exécutés

| Contrôle | Résultat observé |
| --- | --- |
| Astro check | 33 fichiers, 0 erreur, 0 avertissement et 0 suggestion |
| Compilation et contrôle HTML statique | 14 pages HTML, dont l’administration ; 0 anomalie et 0 avertissement |
| JavaScript initial du site public hors diaporama | 8 341 octets gzip ; le bundle CMS externe n’est pas inclus dans cette mesure |
| Migration du catalogue | Parité sur les 9 exports métier d’origine : sept prestations et leurs champs, prix, 15 classiques, 9 Signature, 11 saveurs de cupcakes et 10 brunchs |
| Migration des textes de pages | Parité des contenus des trois pages : accueil, maison et votre projet |
| Modifications de données simulées | Un prix décimal de cupcake se répercute dans le résumé ; un prix de brunch modifié recalcule les regroupements ; une nouvelle saveur de cupcake reste visible dans la famille choisie |
| Import d’un vrai JPEG | 3 variantes WebP produites, d’environ 49 à 165 ko ; source JPEG absente de la sortie publique |
| Références photographiques | 63 emplacements contrôlés, aucun fichier absent ni texte alternatif vide ; galerie conservée à 26 photographies client |
| Modèle d’interaction | 24 assertions réussies pour la logique de déplacement des choix |

Le contrôle de parité compare les valeurs exportées avant et après migration. Le seul nouveau champ de prestation, `panelNote`, contient les notes courtes déjà présentes dans les composants. Les routes et les résumés de prix calculés gardent leurs valeurs initiales. Les prix de brunch sont saisis uniquement sur les compositions ; les autres catégories tarifées utilisent leurs tableaux numériques. Les résumés ne nécessitent pas de seconde saisie dans les composants.

Le registre photographique conserve quatre illustrations identifiées séparément : le cupcake d’accueil et les trois visuels d’ingrédients. La galerie ne les attribue pas aux réalisations client. Le premier contrôle d’import démontre le chemin de compilation local ; un second essai, décrit ci-dessous, valide l’import dans le CMS connecté et la publication réelle.

## Observation navigateur mobile

Le rendu local a été contrôlé par automatisation du navigateur à **390 × 844 px**. Sur une fiche, le choix « Saveurs classiques » amène les commandes principales à environ **115,76 px** du haut de la fenêtre, sous un en-tête de **100 px**. Le choix d’une famille applique le même alignement, avec la photographie et les textes correspondant au choix visibles. Aucun débordement horizontal n’a été observé dans ces états.

Ce contrôle porte sur un navigateur de bureau à une dimension mobile. Il ne constitue pas un essai sur iPhone physique, Safari iOS ou dans le navigateur intégré d’Instagram. La préférence système de mouvement réduit n’a pas été simulée dans ce contrôle navigateur ; son chemin immédiat est couvert par le modèle d’interaction. Les 24 assertions de ce modèle restent distinctes d’une validation visuelle de tous les appareils.

## Authentification et publication : état constaté

Le Worker d’authentification fonctionne dans le compte Cloudflare avec l’offre gratuite. La GitHub App a été créée, installée et autorisée après confirmations explicites du client, sur le seul dépôt `sarbhakan/site_siray` : Contents en lecture/écriture et Metadata en lecture. Les trois paramètres du Worker sont présents, dont `GITHUB_CLIENT_SECRET` chiffré. Une requête d’authentification pour un domaine extérieur renvoie `UNSUPPORTED_DOMAIN`.

La configuration publique de l’éditeur ne contient aucun secret. Les identifiants confidentiels restent exclusivement dans les secrets chiffrés du Worker. Le site public reste statique ; le Worker sert à l’authentification de l’éditeur. `/admin/` répond en HTTPS avec `Cache-Control: no-store` et `X-Robots-Tag: noindex, nofollow`.

La version `615a4b33e1c4157e26a4453c6792687b80b56bda` a été publiée avec succès : déploiement Cloudflare `d96b5a26-c165-4cd2-9c54-1ec02235ac47`, durée observée de 38 secondes. Une sauvegarde réelle du CMS a créé le commit `ba14361dcb004f85417245cc75eb74d9d27294b1`. Une seule valeur a changé : l’introduction du premier message devient « Ces renseignements nous permettent de vous répondre plus précisément. » L’ordre de certaines propriétés JSON a aussi été réorganisé automatiquement. La nouvelle phrase a été retrouvée sur la page publique `/contact/` après reconstruction.

Un JPEG de cupcakes déjà utilisé par le site a ensuite été importé dans le CMS : conversion en WebP de 210 272 octets, enregistrée dans `src/assets/uploads/20261121-8577311b95b4.webp`. La sauvegarde a créé le commit `e2a4117fd3ed1c5cf2144e4a2db2683dea6e65a1`. Le seul changement sémantique du fichier photographique est la source de la couverture cupcakes ; description et cadrage sont conservés. Les variantes publiques générées sont d’environ 37, 116 et 183 ko. La page publique cupcakes utilise ces fichiers sous `/_astro/`, y compris dans ses métadonnées de partage.

Le contrôle navigateur public à 390 × 844 px confirme les commandes Saveurs à 115,76 px sous le haut de la fenêtre, avec un en-tête de 100 px, sans débordement horizontal. L’éditeur connecté a aussi été ouvert à cette dimension, avec une navigation mobile dédiée et sans débordement horizontal. Captures conservées dans `releases/v17-cms/` du dossier de travail. Il ne s’agit pas d’un essai sur iPhone physique ni dans Instagram. Le JPEG est testé ; le HEIC reste à tester sur un appareil réel. En cas d’échec d’une reconstruction Pages, la dernière version réussie reste en ligne.

Le guide utilisateur est dans [EDITION-MOBILE.md](../EDITION-MOBILE.md) et la procédure technique dans [infra/cms-auth/README.md](../../infra/cms-auth/README.md). Les rapports V1 à V16 conservent leurs résultats historiques et ne servent pas de preuve pour les nouvelles étapes de cette passe.
