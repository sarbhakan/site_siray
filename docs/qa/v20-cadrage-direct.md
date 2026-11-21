# V20 — cadrage en direct avant enregistrement

## Cause et comportement

Contrôle réel du premier slide : source1200×1600, cadre237,5×316,664 soit3:4. La photo remplit exactement le cadre ; object-position seul ne change donc pas sa zone visible. Les portraits9:16 dansun4:5 ne débordent que verticalement. Aucun défaut de sauvegarde n’a été déduit de cette absence de mouvement.

Le widget conserve désormais un état local immédiat et écoute input pendant le déplacement des curseurs ; onChange reste disponible avec déduplication. Un zoom facultatif de1à2 est réellement stockable et rendu par toutes les photos éditables, sans migration des anciennes données. Le défaut1 conserve leur cadrage. Le résultat du format choisi et le rectangle de la zone conservée sur l’original se mettent à jour ensemble. Une explication indique les axes sans effet au zoom1. Réinitialiser remet50%50% etzoom1. Aucun enregistrement automatique ni modification destructrice du fichier original.

Les formats reflètent le CSS actuel : diaporama3:4 ; fiche4:5 et index4:3 ; cartes etgalerie4:5 ; détailmobile96:100 etbureau1:1 ; tablesdu carnet16:9mobile et4:5 dès600px. Ces vues représentent des formats, pas une capture exacte de chaque écran public. Autresemplacements inchangés si on règle une photo. Le guide explique désormais les trois curseurs et ces limites.

## Intégration et sécurité

Zoom validé strictement en pré-enregistrement et au build : nombre fini1à2 ; ancienchampabsent=>1. Position normalisée avant style. Rendu scale CSS indépendant ettransform-origin identique àobject-position ; garde les transformations de survol. Wrapper de découpe sans boîte àzoom1, masquage du débordement quandzoom>1. Carnet corrigé pour exclure le wrapper des légendes et respecter ses propres proportions.

Aucun secret, dépendance, droit ou fichier d’authentification modifié. Aucun contenu métier ou photo de test publié. Main récupéréjusqu’àc0ef255 avec les sauvegardesSelin33a60a7,707728a,c0ef255 conservées.

## Vérifications réalisées

- Tests Node :233 cas réussis (authentification94, sections45, prévalidation57, publication16, zoom20, widget1comportant159contrôles). Géométrie vérifiée sur trois proportions source, cinq cadres, trois zooms et troispositions, sans sortir du fichieroriginal. Mêmesbornes dezoom côtéCMS etserveur. Deuxinputs consécutifs sansnouvelleprop conservent chaqueaxe.
- BancReact local avec les scripts livrés, sans authentification ni sauvegarde : zoom1,5 etposition0%100% observés dansstylescalculés etrectangle ; vraieimageprévisualisée. Correction d’un point React18 : scale doit être une chaîne pour ne pas recevoir une unitépx invalide.
- Vue mobile390×844 : résultat, original etcurseurs visibles côte àcôte ; aucun débordementhorizontal. Le cas3:4auzoom1 affiche la raison de l’absence dedéplacement ; le zoom active les deuxdirections.
- RouteAstrolocaletemporaire utilisant le vrai composantPhoto etCSSpublic, suppriméeavantbuild : deuxfocales0%0%et100%100% aveczoom1,5, découpagehero etgalerie ; carnetmobile4:5(169×211,25) et16:9(350×196,875), légendes horscadre. Aucun nouveau fichier dephoto envoyéenproduction.
- Revueindépendante de la géométrie, desvaleursconservées et desbornes : aucunpointbloquant.

La construction finale, le contrôle statique et la publication sont consignés au moment de leur résultat ; un essai sur navigateur àlargeurtéléphone ne remplace pas un iPhone physique ou Instagram.

Résultat final local : Astro check 46 fichiers, 0 erreur, 0 avertissement, 1 hint dans un test existant ; build 13 pages. Contrôle statique : 16 HTML, aucune erreur ni avertissement.
