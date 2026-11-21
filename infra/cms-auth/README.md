# Authentification de l’éditeur Siray Signature

Le Worker ne sert qu’à la connexion GitHub de l’interface `/admin/`. Le site public reste sur Cloudflare Pages. Aucun abonnement payant n’est nécessaire pour cet usage.

Le fichier `src/index.js` et sa licence sont copiés sans modification depuis [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), commit `26b168a4cf5fad6a66a38f3b0977d722017296ce`, récupéré le 21 novembre 2026. Licence MIT. Le déploiement et les mises à jour sont manuels : cette copie n’importe pas automatiquement les changements de l’amont.

## Réglages publics

Worker : `https://siray-cms-auth.mr-hakan336.workers.dev`. Domaine autorisé : `siraysignature.fr`. Le fichier `public-settings.json` contient uniquement ces adresses publiques ; il sert à générer `public/admin/config.json` avec `node scripts/build-cms-config.mjs` depuis la racine du projet.

## Première installation

1. Déployer ce Worker dans le compte Cloudflare existant, avec l’offre Workers gratuite.
2. Créer une GitHub App personnelle, avec le callback `https://siray-cms-auth.mr-hakan336.workers.dev/callback`. Autoriser **Contents: Read and write**, **Metadata: Read-only** ; laisser **Workflows: No access**. Le mode de publication directe utilisé ici ne nécessite pas la permission Pull requests.
3. Conserver l’expiration des jetons activée. Désactiver le webhook, Device Flow et l’autorisation OAuth pendant l’installation.
4. Installer l’application sur **Only select repositories → sarbhakan/site_siray**.
5. Dans les variables Cloudflare du Worker, saisir `GITHUB_CLIENT_ID` et créer `GITHUB_CLIENT_SECRET` comme **secret chiffré**. Le secret ne doit pas apparaître dans un fichier du dépôt, dans le navigateur du site public ou dans une capture partagée.
6. Ouvrir `/admin/` sur le site et autoriser cette application GitHub. L’utilisateur connecté doit avoir le droit d’écriture sur le dépôt.

Les consignes complètes, notamment le renouvellement des jetons, sont dans le [README officiel](https://github.com/sveltia/sveltia-cms-auth#how-to-use-it). Le secret GitHub reste exclusivement chez Cloudflare ; le CMS reçoit un jeton utilisateur après connexion. `ALLOWED_DOMAINS` limite la délivrance de ce jeton au site autorisé.

## Vérification après installation

Tester une connexion, une modification réversible de texte et une photographie depuis un téléphone. Vérifier le commit GitHub, la réussite du build Pages et l’affichage sur le domaine final, puis retirer la modification d’essai. Une simple page de connexion visible ne prouve pas que la sauvegarde fonctionne.

La première installation est terminée et vérifiée le 21 novembre 2026 : connexion, sauvegarde de texte et import JPEG ont été publiés par GitHub → Cloudflare Pages sur le domaine final. L’application personnelle est `siray-signature-cms`, installée uniquement sur `site_siray`. Les essais ont été réalisés dans un navigateur de bureau, dont un rendu à dimension mobile ; un essai physique iPhone/HEIC reste distinct.
