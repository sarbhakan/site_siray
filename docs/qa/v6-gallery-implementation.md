# Siray Signature V6 — galerie sans zoom

Implémentation effectuée dans la copie de validation locale le 18 novembre 2026. Périmètre : galerie et suppression de sa visionneuse. Cette note décrit le code ; elle ne constitue pas une observation navigateur.

## Décisions appliquées

La galerie conserve son URL `/galerie/`, son ensemble de photographies, les légendes, les catégories et les filtres natifs « Tout voir », « Cakes », « Douceurs » et « Tables ». Le titre et le fil d’Ariane emploient désormais « La galerie » / « Galerie », en cohérence avec la navigation principale.

Les photographies ne sont plus des liens. La commande plus, le dialogue d’agrandissement et ses boutons ont été retirés. Le texte d’introduction devient « Gâteaux, petites pièces et tables à partager. ». Les mentions répétées de photographie d’ambiance sont supprimées dans cette page et ses textes alternatifs ; les crédits et leurs données de provenance restent à la charge de la page dédiée, sans être supprimés du projet.

Le code de la visionneuse a été supprimé de `site.ts` : état d’image sélectionnée, ouverture/fermeture, précédent/suivant, gestion des flèches, balayage et restauration du focus. Les filtres fonctionnent indépendamment de l’existence d’un dialogue. Leur sélection met à jour `aria-pressed`, les figures visibles, le décompte annoncé et le fragment d’URL, comme auparavant. Les événements restent attachés à l’AbortController commun et nettoyés lors des transitions Astro. Le hero, le menu mobile et leurs comportements n’ont pas été modifiés.

Le CSS devenu inutile de la visionneuse et de l’icône plus a été retiré de `global.css`, de même que l’atténuation au survol des photographies qui suggérait une interaction. Le focus et les gouttières du menu mobile sont conservés. La grille garde deux colonnes sur téléphone, trois au palier intermédiaire et quatre sur grand écran. Un espace de 48 px termine la grille après retrait du paragraphe qui fournissait auparavant sa marge basse. Les tailles déclarées aux images correspondent à ces proportions.

## Références réellement lues

- Documents du projet : `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `README.md`.
- Impeccable au pin déjà consigné : `reference/craft-floor.md` et `reference/adapt.md`.
- Sources de galerie : `src/pages/galerie.astro`, `src/scripts/site.ts`, sélecteurs concernés de `src/styles/global.css`, composant `Photo.astro`.

La demande actuelle du client prévaut sur les anciennes descriptions de visionneuse ou de mentions d’ambiance dans les documents V5. L’interface conserve ses couleurs et sa typographie ; aucune attribution des photographies à des réalisations Siray n’a été ajoutée.

## Vérification de cette contribution

Lecture du diff pour confirmer que les blocs hero/menu restent intacts et que la logique de filtre est conservée. `git diff --check` passe pour les fichiers modifiés. La vérification Astro, la compilation et les manipulations navigateur sont laissées à l’agent principal après intégration, et ne sont pas revendiquées ici.

Fichiers changés : `src/pages/galerie.astro`, `src/scripts/site.ts`, `src/styles/global.css`, cette note. Le composant `Icon.astro` n’a pas été modifié.
