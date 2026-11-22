# V26 — Corbeille réversible des photographies

22 novembre 2026. Base initiale `42d900539141316b71db87f89e084a7f159870d1` ; changements de Selin récupérés sans conflit jusqu’à `f7cc81c84bd66dc42d7e7f9ca284a010d859be10` avant publication. Aucun contenu JSON métier ni fichier photographique modifié par cette évolution.

## Comportement

Photographies → Galerie et corbeille présente Photos visibles et Corbeille, avec compteurs, recherche, catégories et miniatures. Le retrait ajoute le booléen facultatif `trashed: true` à la ligne de galerie ; la restauration retire le booléen. Les actions restent en brouillon jusqu’à Enregistrer. Aucun fichier n’est supprimé et aucun vidage définitif n’est proposé.

Les usages de la même photo sur l’accueil, les fiches et la maison restent intacts et sont indiqués dans la corbeille. Les archives de remplacement et les doublons ne réactivent pas une photo retirée. Le remplacement du fichier est interdit dans la corbeille, y compris en cas de retour obsolète du sélecteur ; restaurer d’abord. Le contrôle des fichiers vérifie toujours les photos actives, mais une référence manquante seulement dans la corbeille ne bloque pas le site. La restauration réactive ce contrôle.

## Vérifications

- 292 tests réussis. Tests des modèles de galerie, interactions React, cadrage, aperçu complet, validation, statut de publication, médias et accès. Revue indépendante : cas remplacement dans corbeille trouvé puis protégé à deux niveaux, sans problème concret restant.
- Compilation Node 24 réussie ; Astro check sans erreur ni avertissement, avec le hint TypeScript préexistant dans le test de publication. Vérification statique des 28 HTML sans problème ni avertissement.
- Copie isolée construite avec les 49 photos à la corbeille : compilation complète réussie, aucun contenu JSON partagé modifié. Galerie publique sans carte ; prototype caché uniquement dans l’aperçu, avec une photo active de l’accueil.
- Navigateur IAB, largeur 390 px : retrait Engagement cake, compteur 49→48, usages ailleurs affichés ; aperçu galerie à 48 sans cette photo, aperçu accueil conservé ; restauration 48→49. Cas galerie vide : état vide visible, restauration d’une photo, aperçu à une photographie avec image et légende correctes.
- Les tests navigateur locaux utilisent des brouillons en mémoire, sans publication de contenu fictif. Ils représentent un écran mobile, pas un test matériel iOS/Android.

Les traces de livraison et captures de la version déployée sont conservées hors dépôt dans `releases/v26-corbeille/` du dossier de travail de Hakan. Le guide utilisateur a été actualisé sur `/admin/guide/`.
