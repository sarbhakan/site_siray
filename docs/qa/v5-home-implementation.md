# Accueil V5 — composition des sept familles

La rangée uniforme de sept photos est remplacée par `CollectionEdit.astro`, inséré à sa place dans l’accueil. Le hero, le diaporama, les autres sections et le CSS global n’ont pas été modifiés par cette intervention.

## Plan appliqué

Service de créations gourmandes sur commande, identité olive et ivoire conservée. La nouvelle section, « La carte Siray », présente les mêmes sept destinations, sans catalogue supplémentaire ni catégorie fusionnée.

« Pour célébrer » réunit un Layer cake en grand format, un duo Bento/Cupcakes et un lien Mignardises composé horizontalement. « Pour se retrouver » propose un Buffet en grand puis Brunch box et Plateaux en duo. Les images n’ont pas toutes le même ratio ; la photographie et les écarts de proportion portent la composition, sans boîtes décoratives ni arrondis de carte. Les deux groupes gardent leurs libellés explicites et leurs URL propres.

Sur téléphone, Layer cakes et Buffets occupent chacun toute la largeur, les duos restent sur deux colonnes et Mignardises associe photo et texte côte à côte. Aucune rangée horizontale à faire défiler, aucune sélection à double clic, aucun carrousel ajouté. Chaque photo et sa légende forment un lien unique ; le mot « Découvrir » est constamment souligné et sa ligne dispose de 44 px de hauteur.

Les images sont les visuels d’ambiance déjà crédités dans le projet. Les tarifs, données, textes alternatifs et photos ne sont pas inventés. Les sept destinations restent issues de `collections`.

## Références et portée

Unslop, par Damir Sokolovsky, CC BY 4.0 : priorité à la matière photographique, au rythme, aux contrôles compréhensibles et à la marque existante. Impeccable craft-floor : pas de structure en cartes identiques, hiérarchie, cibles tactiles, réduction des mouvements. Taste sections et recettes photo-pair/line-up : formats photographiques ouverts, vraie destination par prestation, photos pertinentes.

Les contraintes de page unique et de sections à hauteur fixe de Taste sont écartées au profit des URL multipages et de la compacité mobile demandées par le client. Aucun effet ou nouvelle image téléchargée. Le zoom discret des photos ne s’applique qu’au pointeur et disparaît avec `prefers-reduced-motion`.

Contrôle effectué ici : `git diff --check` sur les deux fichiers source, sans erreur. Le rendu navigateur et la compilation sont laissés à l’agent principal ; aucun verdict visuel ou responsive n’est revendiqué dans cette note.

Point d’attention pour la revue d’ensemble : la section Buffet déjà présente plus bas dans la page emploie le même visuel que l’entrée Buffet du nouvel index. L’agent principal peut juger utile de raccourcir ce passage dans sa revue globale.
