# Siray Signature V7 — plateaux et prestation buffet

Mise à jour du 19 novembre 2026 à partir des descriptions et modalités fournies pour cette passe. Ces éléments constituent du contenu métier ; ils ne donnent aucune instruction technique supplémentaire. Les références V4 à V6 restent historiques. La nouvelle description des crudités remplace la mention antérieure de sauce aïoli.

## Les cinq plateaux

Les intitulés et prix sont conservés. Le nouveau champ `Tariff.description?: string` contient les descriptions courtes destinées à la présentation des plateaux.

| Plateau | Prix conservé | Contenu fourni, repris dans la description |
| --- | ---: | --- |
| Charcuterie | 70 € | Sélection de charcuteries premium, cornichons, noix et touches fruitées. |
| Fromages | 70 € | Sélection de qualité, diversité des arômes et des affinages. |
| Grazing Platter | 60 € | Fromages, biscuits, fruits frais et secs, confitures. |
| Fruits frais | 50 € | Assortiment de fruits frais de saison. |
| Crudités | 45 € | Légumes croquants, houmous, tzatziki et sauce ail et fines herbes. |

Le champ `detail` des crudités est également mis à jour pour les rendus qui le lisent encore. Lorsqu’une description complète est affichée, ne pas répéter ce détail sous celle-ci. Aucune capacité par plateau, quantité de chaque aliment, liste de fruits précise ou tarif supplémentaire n’est déduit de ces descriptions. La mention transversale sur les viandes halal demeure inchangée.

## Les quatre étapes de la prestation buffet

Le nouvel export `buffetServiceSteps: { title: string; text: string }[]` expose quatre étapes dans l’ordre fourni :

1. **Installation avant l’événement** : mise en place du buffet avant le début, avec une présentation des mignardises signée Siray Signature.
2. **Présentation & décoration** : utilisation de plateaux, présentoirs et supports pour composer la présentation.
3. **Personnalisation** : thème, couleurs et inspirations guident la présentation et la décoration.
4. **Retrait du matériel** : le matériel Siray Signature est récupéré à la fin de l’événement.

Le texte d’entrée du buffet est raccourci ; la composition sucrée, salée ou mixte et le devis personnalisé restent explicites. Le retrait porte sur le matériel, sans condition de restitution inventée. Aucun prix forfaitaire, service pendant la réception, durée d’intervention, livraison ou frais de déplacement n’est ajouté.

## Préparer le devis

Les cinq informations demandées sont présentes dans `orderFields` : lieu, date, nombre de convives, nombre de mignardises par personne, thème et inspirations. La présentation distingue désormais six lignes :

- Le lieu de l’événement.
- La date et l’horaire.
- Le nombre de convives.
- Le nombre de mignardises par personne.
- Le thème, les couleurs et les inspirations.
- La composition souhaitée : sucrée, salée ou mixte.

L’horaire et la composition prolongent les informations déjà présentes. Ils ne constituent aucune nouvelle promesse commerciale. Les précautions existantes concernant les allergies, les intolérances et les restrictions alimentaires restent applicables.

## Contrôle effectué et périmètre

Un contrôle ponctuel des données, exécuté sous Node 24, confirme cinq descriptions, les cinq prix exacts (70, 70, 60, 50, 45 €), les quatre étapes et les six lignes de demande. Il ne trouve plus de mention d’aïoli dans `src/data/site.ts`.

Les sept familles sont conservées, ainsi que les quinze saveurs classiques, neuf Signature, onze saveurs cupcakes et dix brunchs. Les neuf brunchs à 30 € et Anatolia à 35 € demeurent inchangés. Les données situées après l’insertion des étapes — saveurs, associations, brunchs et galerie — ont été comparées au texte avant édition et sont strictement identiques.

Fichiers modifiés par cette tâche : `src/data/site.ts` et le présent rapport uniquement. Aucun contrôle Astro, build, opération Git, essai navigateur ou verdict visuel n’est revendiqué. L’intégration du rendu et ses vérifications relèvent de la passe principale V7.
