# V19 — atelier mobile et publication

## Diagnostic et intégrité

Les sauvegardes de Selin ed4869f (photo/description d’accessibilité) et 74949b6 (dont Fezalia) avaient déjà été déployées avec succès par Cloudflare. La légende visible « Décor de roses » n’avait pas été modifiée, d’où la distinction renforcée entre légende et texte alternatif. Les nouvelles sauvegardes ac1d9df et 8de96e9 ont été récupérées pendant cette passe et conservées. Aucun JSON métier ni fichier d’authentification n’est modifié par V19.

## Implémentation

Atelier `/admin/`, éditeur `/admin/editeur/`, guide `/admin/guide/`. Version Sveltia épinglée 0.270.0 ; API publique, montage `#nc-root`, initialisation manuelle. Le widget objet `siray-photo` préserve la forme des données et utilise le sélecteur officiel `pickFile()` ; curseurs de cadrage, vue entière et cadres correspondant aux usages CSS, miniature, libellés d’accessibilité distincts des légendes. Trois aperçus lisent les données en cours. Les nouveaux imports conservent WebP94/max2560 et les dérivés Astro adaptatifs ; aucune recompression des JPEG V10 approuvés.

`extraSections` facultatif ajoute jusqu’à 12 volets par fiche : titre 120, texte 4000, liste 12×300, bouton libellé 80/lien 2048. Prévalidation CMS et validation serveur cohérentes, HTML échappé, destinations internes ou HTTPS sans identifiants ni contrôles. Le catalogue ne reçoit pas de rubrique d’exemple.

Publication confirmée par empreintes SHA-256 canoniques des trois fichiers éditables, comparées au témoin `/publication.json` servi sans cache. Métadonnées de suivi sans contenu ni secret, reprise entre routes, vérification toutes les 15 s pendant 10 min, arrêt en arrière-plan et reprise au retour, bouton de relance. Les checks publics GitHub distinguent un échec de publication ; leurs requêtes sont espacées avec gestion du quota. Pas de notification OS, e-mail ou SMS. Une sauvegarde n’est jamais assimilée au déploiement.

## Vérifications exécutées avant publication

- `npm run build` avec Node 24 : 0 erreur, 0 avertissement ; 1 hint TypeScript dans un test de simulation de réseau (await). 13 pages Astro générées, 16 HTML avec l’administration et le guide.
- `python3 scripts/check-site.py` : 16 HTML, aucune erreur et aucun avertissement. Les trois routes de fichiers Sveltia sont reconnues explicitement comme navigation par fragment ; les autres ancres restent contrôlées.
- Authentification 94 tests ; rubriques 45 ; prévalidation 57 ; publication 16 ; widgets 93 assertions dans un test portable. Tous réussis.
- Revue indépendante : aucun élargissement d’autorité, aucun jeton lu par l’interface, aucun secret candidat trouvé dans les nouveaux fichiers. Filtre serveur deux IDs inchangé.
- Navigateur : atelier sur ordinateur puis largeur 390, guide et montage CMS réel chargés. Banc d’essai React local sur les scripts livrés : photo sélectionnée depuis un fichier réel, curseur au clavier et style de cadrage synchronisés, galerie/titre/catégorie et aperçu des tarifs observés. Le banc simule l’API ; il ne prouve pas un enregistrement CMS authentifié.
- GitHub UI : dépôt public ; un seul collaborateur selinberrin12, propriétaire sarbhakan ; aucune deploy key ; GitHub App CMS avec code lecture/écriture et métadonnées lecture, installation uniquement `site_siray`. Les connecteurs techniques déjà installés restent en place. La visibilité publique du code ne donne pas le droit de pousser.

## Limites et suites

Le guide et l’écran de connexion sont consultables ; les contenus éditables et l’enregistrement demandent une session autorisée. Deux humains ont le droit d’écriture, y compris sur le code ; ce n’est pas un rôle « contenus seulement ». Le fonctionnement gratuit, le domaine et les services sont conservés. Les sessions existantes restent soumises à leur cycle de vie ; toute révocation future doit aussi retirer les droits GitHub et l’ID autorisé.

Les aperçus sont représentatifs, pas un rendu exact de chaque navigateur. Les contrôles de largeur ne remplacent pas un essai sur iPhone physique ou dans Instagram. L’enregistrement authentifié réel et la publication V19 doivent être constatés sur le domaine après livraison ; leur résultat n’est pas déduit des tests locaux.
