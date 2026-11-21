# V24 — aperçu des pages et galerie conservée

## Résultat

Un bouton placé en tête des trois rubriques du CMS ouvre les véritables pages complètes, en largeurs de 390 px et de 1 280 px. Le brouillon de la rubrique ouverte remplace son contenu publié dans une vue dédiée ; les autres rubriques utilisent leur version publiée. Navigation interne, volets, filtres, photos et cadrages, prix recalculés, nouvelles listes et rubriques supplémentaires sont disponibles avant enregistrement.

Le choix d’un nouveau fichier impose un nom, une catégorie parmi les sept prestations et une description. Les choix précédents sont conservés dans une archive temporaire du champ, puis ajoutés à la galerie lors du preSave, après résolution des références blob par Sveltia 0.270. Le hook retourne une nouvelle entrée Immutable. Une réutilisation ne duplique pas le fichier et ne remplace pas le cadrage de la galerie.

Migration : les 37 emplacements et les 37 anciennes entrées de galerie sont conservés. Neuf fichiers déjà utilisés sur les pages ont été ajoutés, soit 46 réalisations dans la galerie. Aucun fichier extérieur ajouté, aucun tarif ni texte métier modifié.

## Vérifications

- Les 263 cas Node passent, dont le fichier widget avec 248 contrôles et le contrat galerie avec 24 contrôles. Les tests couvrent le véritable format du message parent, les origines, sources et nonces incorrects, les URL non sûres, l’exclusion des identifiants, les archives successives, l’annulation, la réutilisation et le retour du preSave.
- Construction Astro : aucune erreur ni avertissement ; un hint TypeScript préexistant dans publication.test.mjs.
- Navigateur React réel en 390 × 844 : texte d’accueil modifié dans le brouillon, tarif de 19,5 € pour six cupcakes, nouvelle rubrique interactive avec HTML affiché littéralement, nouvelle photo blob chargée sur l’accueil et dans la galerie. L’ancienne photo reste présente. Le retour au formulaire conserve les modifications. Aucune donnée métier de test enregistrée.
- Vue ordinateur de 1 280 px réduite sur téléphone ; largeur, hauteur et absence de débordement du dialogue contrôlées.
- Revue indépendante : format postMessage aligné avec parseur testé, modèles pour les listes initialement vides complétés, fragments de navigation transmis. API publique Sveltia et calculs partagés du catalogue vérifiés.
- CMS publié sur le domaine : le brouillon d’une description de photo est visible dans l’aperçu complet, sans publication. Essai annulé, sortie puis retour dans la fiche avec Enregistrer désactivé. En-têtes SAMEORIGIN sur les aperçus et DENY sur la page publique confirmés. L’accroche d’accueil ne force plus une ligne unique : les textes longs saisis dans le CMS restent lisibles sur mobile.

## Sécurité et portée

Les brouillons ne sont envoyés à aucun service et aucun stockage supplémentaire n’est ajouté. Ils passent en mémoire de la page CMS vers sa vue d’aperçu de même origine. Source, origine et nonce sont vérifiés aux deux extrémités. Les textes utilisent textContent, les attributs modifiables sont limités et les URL sont filtrées.

L’exception X-Frame-Options SAMEORIGIN concerne uniquement /admin/apercu/* ; DENY reste appliqué aux autres pages. Ces routes sont noindex et no-store. Elles ne contiennent que les contenus déjà publics jusqu’à ce qu’un éditeur leur transmette son propre brouillon. Aucun secret, droit d’accès ou backend ajouté.

L’aperçu concerne la rubrique ouverte ; les changements non enregistrés d’une autre rubrique ne sont pas combinés. La confirmation de mise en ligne reste celle du suivi Cloudflare après Enregistrer. Cette passe n’est pas un essai sur téléphone physique. Les témoins de publication et les captures finales sont conservés dans le dossier releases/v24-apercu-pages-galerie du workspace utilisateur.
