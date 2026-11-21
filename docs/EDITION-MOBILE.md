# Modifier Siray Signature depuis son téléphone

Ouvrez [siraysignature.fr/admin/](https://siraysignature.fr/admin/) dans Safari ou Chrome et connectez-vous avec votre compte GitHub autorisé. Vous pouvez ajouter cette page à l’écran d’accueil du téléphone. Le site public garde son adresse habituelle.

Trois rubriques sont disponibles :

- **Photographies** : diaporama de l’accueil, photos des sept prestations, photos de la maison et galerie. Choisissez une photo existante ou importez-la depuis le téléphone. Dans « Photos actuelles du site », choisissez le grand fichier sans suffixe `-360` ou `-720` ; cette bibliothèque est protégée contre la suppression. Ajoutez une description courte de ce que montre la photo. Le cadrage par défaut `50% 50%` centre l’image ; conservez-le si le résultat vous convient.
- **Catalogue et tarifs** : descriptifs, formats, prix, saveurs, compositions des brunchs et informations utiles aux commandes. Pour les cupcakes, mignardises et plateaux, les prix se changent dans « Formats et tarifs » de leur prestation. Pour un brunch, modifiez le prix dans « Les brunch box » : il est toujours exprimé **par personne**. Les prix affichés ailleurs sont calculés depuis ces données.
- **Textes des pages** : accueil, maison et votre projet. Les liens et la mise en page restent en place. Saisissez uniquement le texte ; aucune balise HTML n’est nécessaire.

Dépliez la section souhaitée, modifiez les champs puis utilisez **Enregistrer**. La modification est enregistrée dans GitHub ; Cloudflare reconstruit ensuite le site. Attendez la fin de ce déploiement avant de vérifier le résultat sur [siraysignature.fr](https://siraysignature.fr). Le changement n’apparaît pas instantanément sur la page publique. Si le déploiement échoue, la dernière version réussie reste en ligne.

Pour changer plusieurs photos, faites-le par petits groupes. Les photos JPEG, PNG, WebP et HEIC sont acceptées jusqu’à 20 Mio ; elles sont optimisées à l’import, puis le site prépare automatiquement les tailles adaptées aux écrans. L’import et la publication d’un JPEG ont été vérifiés ; le HEIC n’a pas encore été testé sur un iPhone physique. Pour un premier essai, privilégiez un JPEG ; si un HEIC pose problème, utilisez une copie JPEG. Une photo trop petite ne peut pas devenir plus nette : privilégiez l’original plutôt qu’une capture d’écran. Conservez vos originaux dans votre photothèque ; le dépôt contient les versions destinées au site. Le traitement d’une grande photo peut prendre quelques secondes : attendez la mise à jour du champ avant d’enregistrer.

Les sept prestations et leurs adresses sont conservées. L’éditeur permet de modifier les contenus ; les nouveaux types de pages, la mise en page et les fonctions du site se travaillent avec nous dans le code. Chaque publication utilise une reconstruction Cloudflare, dans la limite gratuite actuelle de 500 par mois. Regroupez vos petites corrections avant d’enregistrer lorsque c’est possible.

La connexion utilise l’application GitHub Siray Signature CMS, installée et autorisée uniquement sur le dépôt du site. Ne partagez ni mot de passe ni jeton dans un message. Déconnectez-vous après utilisation sur un appareil partagé. Pour annuler une publication, demandez-nous de restaurer la version précédente : l’historique GitHub conserve les modifications.

L’éditeur et l’authentification utilisent des logiciels libres gratuits. Le domaine OVHcloud conserve son renouvellement habituel ; cette interface n’ajoute pas d’abonnement. [Limites Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/) · [Guide Sveltia sur téléphone](https://sveltiacms.app/en/docs/ui#mobile-support)

La connexion, une modification de texte et un import photo ont été enregistrés dans GitHub puis vérifiés sur le site public le 21 novembre 2026. Si la connexion refuse l’accès plus tard, vérifiez le compte GitHub utilisé et l’installation de l’application sur le dépôt. L’éditeur ne donne aucun droit de modification aux visiteurs du site.
