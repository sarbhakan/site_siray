# Modifier Siray Signature depuis un téléphone

Le guide destiné à Selin est disponible sur **https://siraysignature.fr/admin/guide/**. Son fichier source est `public/admin/guide/index.html`. Il est lisible sans connexion, imprimable et adapté au téléphone. L’atelier est à **https://siraysignature.fr/admin/** ; l’éditeur authentifié est dans `/admin/editeur/`. Les anciennes adresses `/admin/#/…` sont redirigées vers l’éditeur en conservant leur destination.

Le guide couvre les trois rubriques, les emplacements indépendants des photos, la différence entre description d’accessibilité et légende visible, les aperçus et curseurs de cadrage, les formats et prix, les compositions, les nouvelles rubriques de fiches, les boutons de lien, l’enregistrement et le suivi de publication, les erreurs et les limites.

## Publication

L’aperçu se met à jour pendant l’édition. Enregistrer crée le changement GitHub ; Pages reconstruit ensuite le site. Le panneau confirme seulement lorsque les empreintes des fichiers édités correspondent à `/publication.json` réellement publié. Les empreintes en attente sont conservées temporairement sur l’appareil pour reprendre le suivi ; aucun contenu ou jeton n’est stocké par ce module. Le suivi dure dix minutes, peut être relancé et reprend au retour de la connexion. Il ne fournit pas de notification système en arrière-plan.

## Photos

Le widget `siray-photo` conserve les objets `file`, `alt`, `position`, plus `label` et `category` pour la galerie. Les nouveaux imports passent par l’API officielle `pickFile()` de Sveltia, avec WebP qualité94 et dimensions maximales2560×2560, puis les variantes Astro adaptatives. Le fichier ne doit pas dépasser20MiB. Les photos enregistrées sont protégées contre la suppression, le renommage et le remplacement du fichier dans la bibliothèque CMS ; le dossier de la collection Photographies conserve l’import de nouvelles photos depuis les champs. Le dossier global pointe vers les fichiers de l’éditeur, protégés nativement par Sveltia, et ne sert pas aux imports. Changer la photo d’un emplacement ou mettre une photo de galerie à la corbeille reste possible, sans supprimer son fichier. Le nettoyage définitif demande une vérification technique des usages. Les cadrages sont calculés par emplacement, et les photos actuelles approuvées conservent leurs règles de livraison. Les aperçus sont une aide représentative ; le site public reste le contrôle final selon l’écran.

## Corbeille de la galerie

Dans Photographies → Galerie et corbeille, les vues Photos visibles et Corbeille affichent les miniatures, la recherche et les catégories. Mettre à la corbeille masque la photo dans la galerie publique et son aperçu, sans supprimer le fichier ni ses réglages. Restaurer retrouve nom, catégorie, cadrage et place. Les deux actions doivent être enregistrées puis publiées ; aucun bouton de corbeille ne publie tout seul.

Les usages de la même photo sur l’accueil, les fiches ou la maison sont indiqués et restent visibles. Il faut remplacer ces emplacements séparément. Le booléen facultatif `trashed: true` appartient uniquement à la ligne de galerie ; la préparation des photos ne réactive pas une ligne retirée. Même une galerie entièrement à la corbeille est valide. Il n’existe ni vidage définitif ni suppression automatique. Les fichiers ne doivent pas être supprimés manuellement sur GitHub sans contrôler leurs usages.

## Structure

Les sept familles et leurs URL restent fixes. `extraSections` permet jusqu’à douze rubriques dans une fiche, avec titre, texte, liste et bouton facultatif. Les liens sont limités aux chemins internes et aux adresses HTTPS sûres. Les contrôles avant enregistrement et au build refusent les contenus incohérents. Le HTML reste du texte échappé ; il n’est pas interprété. Une nouvelle page, un nouveau type de bloc ou un paiement demandent du développement.

## Accès

Les deux comptes humains autorisés sont `sarbhakan` et `selinberrin12`. Le Worker vérifie leurs IDs GitHub immuables88969314 et359602650 à la connexion et au renouvellement. L’application CMS conserve son installation limitée à `site_siray`, avec code lecture/écriture et métadonnées lecture. Le dépôt public n’autorise pas les autres visiteurs à le modifier. Les applications techniques GitHub/Cloudflare restent distinctes des comptes humains. Les droits en écriture portent aussi sur le code, pas seulement sur les textes. Aucun secret ne doit être ajouté aux contenus, aux photos ou au dépôt.

Les vérifications V19 sont consignées dans `docs/qa/v19-atelier-mobile.md`. Les rapports V17 et V18 restent historiques.
