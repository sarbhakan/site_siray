# Cadrage photo plein écran — V23

Le bouton Cadrer en plein écran agrandit l’aperçu sur téléphone. Le cadre conserve les proportions exactes de l’emplacement ; le moteur de déplacement et de pincement V22 est réutilisé, sans bibliothèque supplémentaire. Le zoom reste de1à2 et l’original est conservé.

Le dialogue natif showModal occupe la top layer et rend l’arrière-plan inactif. Les actions Annuler et Valider restent visibles, avec respect des zones de sécurité. Le corps peut défiler sur petit écran ou en paysage. Réglages précis ouvre les deux curseurs de direction sans faire disparaître la photo : sa zone garde au moins180px de hauteur. Sur grand écran, le dialogue se centre avec un fond assombri. Le redimensionnement recalcule la photo et annule les gestes en cours.

Le dialogue édite une copie locale. Valider n’applique que position et zoom, en conservant les métadonnées récentes du parent. Valider sans changement n’ajoute pas de valeurs par défaut. Annuler, Échap ou le clic extérieur sur grand écran abandonnent le réglage. La fermeture restitue le focus au bouton et le défilement antérieur. Un changement de source annule le dialogue ; les captures des pointeurs sont libérées au démontage. Enregistrer dans le CMS reste nécessaire pour publier.

Référence de comportement natif : [HTML dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Aucune permission, authentification ou donnée métier n’est modifiée par cette évolution. Les nouvelles photographies de Selin ont été intégrées depuis main573490a avant publication. L’élément « Layer cake vintage » ajouté sans catégorie empêchait la reconstruction : sa catégorie layer-cakes a été complétée, avec conservation de son fichier, de ses textes et de son cadrage.

Le contrôle global preSave vérifie désormais fichier, description, légende et catégorie des photos de galerie, même repliées : Sveltia démonte ces contrôles et leur isValid ne suffit alors pas. Il refuse les champs manquants avec l’indice de la photo et une instruction en français. Les14 régressions couvrent les champs absents, les catégories inconnues, les sept catégories et les URL blob préservées. Les ressources admin modifiées portent le paramètre v=23 en complément de leur en-tête no-store.

## Vérifications

- 223 contrôles du widget passent, dont20 nouveaux cas transactionnels et74 photos existantes préservées. Revue indépendante sans anomalie bloquante.
-246 autres cas Node passés : rendu photo public, validation des contenus, suivi de publication, rubriques et accès.
- Build Astro et contrôle statique des16pages réussis ; le hint TypeScript préexistant dans publication.test.mjs est conservé.
- Navigateur React réel :390×844,320×568,844×390 et1280×900. Ouverture native, rapport d’image, actions visibles, annulation, confirmation, format, glissement souris, Échap, focus et restauration du scroll vérifiés. Aucun débordement horizontal ni erreur console observés dans le banc.
- Pincements synthétiques dans le dialogue React : zoom continu après rerendu, dézoom, reprise à un doigt, annulation de capture, brouillon parent inchangé avant validation ; position et zoom transférés ensemble après Valider.

Limite de preuve : l’outil navigateur hôte ne propose pas de geste tactile multipoint physique. Les deux pointeurs et leur capture sont simulés seulement dans le banc local, jamais dans l’administration publique. Cette passe ne constitue pas un essai sur iPhone/Android physique. Les vérifications du CMS publié et le témoin Cloudflare exact sont conservés dans releases/v23-cadrage-plein-ecran du workspace utilisateur. Aucun contenu métier de test n’est enregistré.
