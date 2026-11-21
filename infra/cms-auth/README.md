# Authentification de l’éditeur Siray Signature

Le Worker ne sert qu’à la connexion GitHub de l’interface `/admin/`. Le site public reste sur Cloudflare Pages. Aucun abonnement payant n’est nécessaire pour cet usage.

Le fichier `src/index.js` est dérivé de [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), commit `26b168a4cf5fad6a66a38f3b0977d722017296ce`, récupéré le 21 novembre 2026. Licence MIT conservée. Une restriction locale vérifie les deux identités autorisées avant la délivrance ou le renouvellement des jetons. Le déploiement et les mises à jour sont manuels : cette copie n’importe pas automatiquement les changements de l’amont.

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

## Deux comptes autorisés

La liste serveur est fixée dans `src/index.js` aux identifiants permanents GitHub **88969314** (`sarbhakan`) et **359602650** (`selinberrin12`). Un autre compte reprenant un pseudonyme ne récupère pas cet identifiant. Ces IDs publics ne sont pas des secrets. Aucun identifiant fourni par le navigateur ne décide de l’accès.

Après chaque échange de code OAuth et chaque renouvellement, le Worker appelle `GET https://api.github.com/user` avec le nouveau jeton. Seuls ces deux IDs sont acceptés. Un compte inconnu, une erreur GitHub, une réponse invalide ou un délai dépassé empêche le retour des jetons à l’éditeur. Cette vérification utilise les permissions existantes de l’application, sans permission de profil supplémentaire. Elle ne révoque pas un ancien jeton déjà délivré ; retirer aussi l’accès au dépôt si un compte ne doit plus publier.

L’appel d’identité utilise `redirect: 'manual'` et refuse toute réponse 3xx : aucun jeton n’est envoyé à une destination de redirection. Le mode `error` n’est pas pris en charge par le runtime Workers ; les tests reproduisent cette différence avec Node. Voir la [documentation Cloudflare Request](https://developers.cloudflare.com/workers/runtime-apis/request/#options).

Pour permettre l’autorisation depuis un second compte personnel, l’enregistrement de la GitHub App doit être public. Le mode privé produit actuellement une erreur 404 GitHub pour la collaboratrice. Le changement de visibilité doit être confirmé par le propriétaire. Une App publique est visible et installable sur d’autres comptes GitHub : cela ne leur donne ni accès à l’éditeur, ni droit d’écriture sur ce site. L’installation du propriétaire reste **Only select repositories → site_siray**, avec Contents en lecture/écriture et Metadata en lecture seule. Les droits GitHub du dépôt constituent également une protection : seul le propriétaire et la collaboratrice doivent conserver l’écriture.

Ne pas remplacer cette GitHub App par une OAuth App classique demandant l’accès global aux dépôts. Ne pas désactiver la vérification d’identité pour contourner une erreur GitHub.

## Tests de la restriction

Depuis la racine du projet, avec Node 24 :

```sh
node --test infra/cms-auth/test/access.test.mjs
```

Les tests remplacent les réponses GitHub par des données fictives : aucun secret et aucune connexion réelle ne sont nécessaires. La connexion puis la publication avec les vrais comptes restent un contrôle distinct après le déploiement.

## Vérification après installation

Tester une connexion, une modification réversible de texte et une photographie depuis un téléphone. Vérifier le commit GitHub, la réussite du build Pages et l’affichage sur le domaine final, puis retirer la modification d’essai. Une simple page de connexion visible ne prouve pas que la sauvegarde fonctionne.

La première installation est terminée et vérifiée le 21 novembre 2026 : connexion, sauvegarde de texte et import JPEG ont été publiés par GitHub → Cloudflare Pages sur le domaine final. L’application personnelle est `siray-signature-cms`, installée uniquement sur `site_siray`. Les essais ont été réalisés dans un navigateur de bureau, dont un rendu à dimension mobile ; un essai physique iPhone/HEIC reste distinct.
