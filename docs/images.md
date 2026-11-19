# Photographies Siray Signature — V10

## État courant V10

La V10 garde les 28 photographies client et les quatre illustrations du registre. Le diaporama ouvre sur le plateau de fruits, puis présente les cupcakes fleuris et le layer cake rouge, dans un cadre portrait 3:4 plafonné à 560 px sur ordinateur. Ces trois fichiers sont les JPEG fournis, **sans réencodage**. Les sept cartes de prestations de l’accueil utilisent aussi leurs sources JPEG, soit neuf fichiers uniques pour l’ensemble de ces emplacements. Le poids cumulé de ces neuf fichiers est de **1 977 271 octets** ; ils ne sont pas tous chargés au démarrage. Le premier visuel pèse 418 911 octets ; les suivants sont différés et les cartes restent en chargement paresseux.

Le script `scripts/prepare-source-photos-v10.mjs --source /chemin/vers/images` vérifie les empreintes des originaux et l’absence de métadonnées EXIF, ICC, XMP, IPTC et d’orientation avant de copier les fichiers choisis dans `public/images/`. Les SHA-256 des livraisons sont identiques aux sources ; le champ `sourceDelivery` et `docs/qa/v10-image-delivery.json` tracent cette égalité. Les fichiers du corpus dans `images/` restent intacts. Les variantes WebP des fiches et de la galerie ne changent pas.

Les cartes de l’accueil sont toutes en portrait 4:5, avec un point focal propre à leur placement : papier journal 65,789 % vertical, fleurs bento/cupcakes et tables à 100 %, mini hot-dog à 50 %. L’option `sourceOriginal` de `Photo.astro` sélectionne les JPEG natifs sans `srcset` de petite taille. Les dimensions sont réservées dans le HTML. Cette livraison conserve le détail disponible, sans pouvoir ajouter du piqué absent des photographies fournies.

Les mignardises passent dans « Pour se retrouver ». La suggestion de bento cake devient le bento à rubans. La photographie de « L’art de sublimer vos instants gourmands », les trois images de « Des idées à garder » et la galerie approuvée de 26 réalisations sont conservées.

Le registre interne conserve les droits et les attributions. La page publique de crédits reste supprimée à la demande du client. Les rapports de contrôle V10 distinguent vérifications exécutées et limites du test.

---

## Archive V9

Le registre `docs/image-credits.json` contient **28 photographies client** parmi les 44 fichiers fournis, auxquelles s’ajoutent les quatre illustrations conservées. La V9 ajoute le layer cake au fond de papier journal (`layer cakes/9.jpeg`, identifiant `layer-journal`) et le mini hot-dog tenu par une main gantée (`miniardises/5.jpeg`, identifiant `mignardises-hotdog`). Les originaux restent intacts et hors du dossier public. **La galerie conserve sa sélection V8 de 26 photographies, son ordre et ses sept filtres de catégories.** Les deux ajouts servent aux emplacements demandés sans modifier cette galerie approuvée.

Les usages sont distingués par emplacement : le gâteau au papier journal présente les layer cakes sur l’accueil, tandis que les deux photos approuvées de leur fiche restent en place ; le bento fleuri présente cette famille sur l’accueil et la photo des coffrets devient la photo principale de sa fiche ; le mini hot-dog ouvre les mignardises. Les petites photos secondaires approuvées sont conservées. Les cadres des suggestions sont repris pour préserver les sujets. Les photographies horizontales des associations Signature et de la préparation des demandes sont retirées au lieu d’étirer des portraits. « La maison » utilise deux photographies client en portrait 4:5, le gâteau fleuri et le Grazing Platter.

Les **cinq photographies du diaporama** sont préparées à nouveau depuis leurs originaux, à leur largeur native de **1 152 px**, en **WebP qualité 94** pour le grand fichier et **88** pour les petites variantes. Le hero utilise le fichier principal, sans sélection d’une petite variante par `srcset`, tout en conservant le chargement différé des scènes suivantes. Les deux nouvelles photographies sont également préparées en qualité 94/88. Les autres fichiers existants gardent leur préparation V8 en qualité 80. Les dimensions réelles, recadrages et poids sont dans le registre ; la qualité d’encodage ne peut pas créer de détail absent d’un original. Aucun agrandissement, retouche créative ou génération d’image n’est effectué.

La page publique `/credits/` et son lien du footer sont supprimés à la demande de l’utilisateur. La provenance, les auteurs et les licences restent conservés dans le registre interne, ainsi que dans les archives documentaires ci-dessous. Les quatre illustrations restent distinctes des réalisations Siray : le cupcake de l’accueil et les trois images d’ingrédients Fruits, Chocolats et Notes gourmandes.

Ce document décrit les fichiers et décisions V9. Il ne vaut ni résultat de compilation ni contrôle navigateur ; ces vérifications doivent être documentées séparément après exécution.

---

## Archive V8 — première intégration des photographies client

Les sections suivantes, jusqu’à l’archive V6, décrivent l’état **V8**. Les formulations au présent, le lien public de crédits et le contrat de préparation qualité 80 appartiennent à cet historique ; l’état V9 ci-dessus prévaut pour les éléments modifiés.

## Corpus fourni et sélection

Les photographies de réalisations intégrées à la V8 proviennent des fichiers fournis par le client dans `images/`, à la racine de l’espace de travail. Elles couvrent les gâteaux, les brunch box, les mignardises, les buffets et les plateaux. Les prises de vue sont sélectionnées pour leur netteté, la lisibilité du sujet sur téléphone et la variété des scènes. La sélection finale comprend **26 photographies client**. La liste exacte, les noms de fichiers livrés et leurs usages sont consignés dans le manifeste V8 `docs/image-credits.json`.

Les revues de sélection sont consignées dans `docs/qa/v8-photo-review-cakes.md` et `docs/qa/v8-photo-review-tables.md`. Le doublon exact `miniardises/6.jpeg`, identique à `miniardises/5.jpeg`, n’ajoute pas une nouvelle photographie à la sélection. Les photos de préparations ne permettent pas de déduire une recette complète, le nom d’une formule, une quantité de convives, une provenance, une allergie ou une certification.

## Provenance et droits

Le manifeste distingue deux provenances :

- Les photographies fournies pour le site portent `sourceType: "client"` et `illustrative: false`. Le champ d’attribution est `author: "Siray Signature — photos fournies"`, avec le compte [@siraysignature](https://www.instagram.com/siraysignature/) comme lien de provenance. `license: "Photo fournie pour le site"` et `licenseUrl: null` consignent cette mise à disposition ; ils ne désignent pas une licence publique standard et n’inventent pas un photographe nominatif.
- Les quatre illustrations conservées portent `sourceType: "stand-in"` et `illustrative: true`. Leurs auteurs, pages sources et licences restent ceux vérifiés dans le registre initial. Elles ne sont pas attribuées aux réalisations Siray Signature.

La page `/credits/` présente les photographies fournies par la maison dans un paragraphe distinct, puis les quatre crédits d’illustrations. Le lien **« Crédits des images »** demeure dans le footer. Il n’y a pas de légendes de provenance répétées dans les fiches ou la galerie.

## Illustrations conservées

Seules les quatre images ci-dessous restent utilisées comme illustrations dans la V8. La photographie de cupcakes est conservée sur l’accueil avec l’accord de l’utilisateur ; les trois autres illustrent les familles de saveurs, sans promettre une recette précise.

| Fichier | Usage V8 | Auteur et source | Licence |
| --- | --- | --- | --- |
| `/images/cupcakes.webp` | Photographie de cupcakes de l’accueil. | [Sara Cervera](https://unsplash.com/photos/cupcakes-with-white-icing-on-top-I8U6XXVmdKo) | [Unsplash License](https://unsplash.com/license) |
| `/images/fruits.webp` | Volet Fruits des saveurs. | [Katja Ano](https://unsplash.com/photos/a-plate-of-fruit-with-oranges-strawberries-and-blueberries-Zp_nqma-4aY) | [Unsplash License](https://unsplash.com/license) |
| `/images/chocolat.webp` | Volet Chocolats des saveurs. | [Tamanna Rumee](https://unsplash.com/photos/assorted-chocolate-pieces-scattered-on-a-dark-cloth-l3fpWq7zExM) | [Unsplash License](https://unsplash.com/license) |
| `/images/notes-gourmandes.webp` | Volet Notes gourmandes des saveurs. | [David Trinks](https://unsplash.com/photos/a-white-bowl-filled-with-pistachios-on-top-of-a-table-9deyN2wkeM8) | [Unsplash License](https://unsplash.com/license) |

Aucun visuel Unsplash+, ni photographie de Grolet, Louis Vuitton ou Hermès, n’est intégré. Les anciennes illustrations retirées restent documentées dans l’archive V6 ci-dessous pour conserver la traçabilité ; cette archive ne décrit pas la sélection courante.

## Préparation technique V8

La chaîne V8 prépare des fichiers **WebP locaux en qualité 80**. Les photographies client reçoivent des variantes responsives de **360, 720 et 1 152 px de largeur**, avec un plafond de **1 200 px** et aucun agrandissement au-delà de la source. Les quatre illustrations conservées sont également réoptimisées en 360, 720 et au maximum 1 200 px, sans agrandissement. La rotation EXIF est appliquée, les couleurs sont converties en sRGB et les métadonnées sont retirées des fichiers livrés. Les originaux fournis restent intacts, hors du dossier public. Les clés des fichiers client comportent une empreinte ; chaque entrée du registre conserve aussi un identifiant sémantique.

Le traitement se limite à la conversion, au redimensionnement et aux cadrages techniques. Les grandes marges hautes vides peuvent être retirées quand elles gênent la lecture du sujet ; le ratio après ce cadrage est conservé dans les variantes. Les dimensions, poids et points focaux réels sont consignés dans le manifeste, et ne doivent pas être déduits du seul nom de fichier. **Aucune retouche créative, génération ou modification des gâteaux, des garnitures ou des scènes n’est effectuée.** Les points focaux adaptent le sujet à son cadre sans ajout de décor ni filtre de couleur. La photographie principale et ses variantes se remplacent ensemble ; les textes alternatifs décrivent ce qui est réellement visible.

Les photographies portrait sont favorisées sur mobile. Les points focaux proposés dans les revues doivent être vérifiés dans les cadres réels : retenir le bas des brunch box, retirer une partie du mur des buffets et préserver les extrémités des plateaux. Un même fichier ne doit pas être répété dans plusieurs volets d’une même fiche pour remplir des emplacements. Les images Fruits, Chocolats et Notes gourmandes restent liées à leur famille ; les bento cakes sont illustrés par de vrais bento cakes fournis, sans remplacement par un cupcake.

Ce document décrit le choix et le contrat de préparation V8 ; il ne prouve pas à lui seul la génération des variantes, une compilation ou une validation navigateur. Les contrôles réalisés et les éventuels écarts sont consignés séparément dans les rapports V8 de `docs/qa/`.

---

Les informations suivantes décrivent la façade **avant l’intégration des photographies client**. Les noms, auteurs, sources, licences et opérations de la V6 sont conservés comme historique. Les affirmations au présent appartiennent à cette archive et ne remplacent pas l’état V9 décrit en tête de ce document.

## Archive — images provisoires V6

Les photographies servent à composer et à vérifier la façade en attendant les réalisations autorisées de Siray Signature. Elles ne montrent pas les créations de la maison et ne doivent pas être présentées comme « nos réalisations ». Les parcours ne répètent plus de légende de provenance ; le lien **« Crédits des images »** du footer donne accès aux auteurs et licences. Le registre `docs/image-credits.json` reste la référence pour chaque fichier.

Les sources utilisent deux licences : [Unsplash License](https://unsplash.com/license) et [Pexels License](https://www.pexels.com/license/). Le registre consigne les pages officielles, les auteurs, les conditions retenues et la date de vérification du 18 novembre 2026. Aucun visuel Unsplash+ ni photographie de Grolet, Louis Vuitton ou Hermès n’est inclus.

Les images sont locales et converties en WebP. Chaque série comporte le fichier principal `/images/nom.webp` et les variantes `/images/nom-1024.webp` et `/images/nom-640.webp`. Le côté long est plafonné respectivement à 1 600, 1 024 et 640 px, sans agrandissement de la source. Les portraits ont donc une largeur inférieure à ces valeurs. Utiliser les dimensions réelles du manifeste pour les descripteurs `srcset` ; le nom de variante n’est pas sa largeur garantie.

### Nouveaux visuels V6

Les quatre ajouts distinguent le format bento des cupcakes et associent une image aux familles de saveurs. `bento-cake` est l’image principale du bento ; `bento-detail` est réservé à la préparation de sa demande. Ces photographies restent des substituts, à remplacer par les réalisations Siray.

| Fichier | Usage et cadrage | Point focal | Auteur et source | Licence |
| --- | --- | --- | --- | --- |
| `/images/bento-cake.webp` | Image principale des bento cakes. Recadrage technique sur le gâteau et les mains ; visage exclu. Aucune personne présentée comme cliente. | 50% 50% | [Katia Damyan](https://www.pexels.com/photo/model-in-black-blazer-holding-a-box-with-mini-cake-19908504/) | [Pexels License](https://www.pexels.com/license/) |
| `/images/bento-detail.webp` | Volet « Préparer ma demande » des bento cakes ; conserver le petit gâteau et ses cœurs visibles. | 50% 48% | [Muneer ahmed ok](https://unsplash.com/photos/hands-holding-a-small-cake-decorated-with-hearts-AKI3g3Xsm5A) | [Unsplash License](https://unsplash.com/license) |
| `/images/chocolat.webp` | Famille Chocolats des saveurs ; garder les trois types de chocolat dans le cadre. | 50% 50% | [Tamanna Rumee](https://unsplash.com/photos/assorted-chocolate-pieces-scattered-on-a-dark-cloth-l3fpWq7zExM) | [Unsplash License](https://unsplash.com/license) |
| `/images/notes-gourmandes.webp` | Famille Notes gourmandes des saveurs ; conserver le bol de pistaches comme sujet. | 50% 48% | [David Trinks](https://unsplash.com/photos/a-white-bowl-filled-with-pistachios-on-top-of-a-table-9deyN2wkeM8) | [Unsplash License](https://unsplash.com/license) |

Le fichier `bento-cake.webp` provient de Pexels. Un recadrage technique retire le visage présent dans la source et conserve le gâteau avec les mains ; il ne modifie ni le gâteau ni sa décoration. Les autres ajouts viennent d’Unsplash. Les transformations consignées sont le redimensionnement, la conversion et les cadrages techniques ; aucune retouche créative ou génération d’image n’est revendiquée.

### Autres visuels conservés à la V6

| Fichier | Usage et cadrage | Point focal | Auteur et source | Licence |
| --- | --- | --- | --- | --- |
| `/images/layer-cake.webp` | Coupe verticale ; garder les fruits et le socle visibles. | 50% 44% | [Filipp Romanovski](https://unsplash.com/photos/a-white-cake-topped-with-berries-and-blueberries-WXpzzYM6k2M) | [Unsplash License](https://unsplash.com/license) |
| `/images/gateau-creme.webp` | Texture de crème pour une photo de détail. Ne pas présenter ce gâteau comme un bento. | 50% 42% | [Jonathan Borba](https://unsplash.com/photos/a-white-frosted-cake-with-swirled-icing-on-a-stand-AAAX_mN2-SE) | [Unsplash License](https://unsplash.com/license) |
| `/images/macarons-ivoire.webp` | Image très calme ; bon cadrage paysage ou carré. | 48% 54% | [Lucas T Photography](https://unsplash.com/photos/stack-of-cream-colored-macarons-on-a-white-plate-TYQsDIJTJow) | [Unsplash License](https://unsplash.com/license) |
| `/images/macarons-rose.webp` | Vue du dessus ; conserver la forme circulaire du plateau. | 52% 48% | [Diana Polekhina](https://unsplash.com/photos/a-plate-of-pink-and-white-macaroons-on-a-white-table-Nx6SyYyfNUc) | [Unsplash License](https://unsplash.com/license) |
| `/images/cupcakes.webp` | Portrait ; garder plusieurs cupcakes pour comprendre la répétition. | 50% 46% | [Sara Cervera](https://unsplash.com/photos/cupcakes-with-white-icing-on-top-I8U6XXVmdKo) | [Unsplash License](https://unsplash.com/license) |
| `/images/buffet-gourmand.webp` | Très large paysage ; idéal pour une respiration horizontale. Éviter une coupe verticale serrée. | 50% 62% | [Keith Tanner](https://unsplash.com/photos/a-beautiful-charcuterie-board-full-of-delicious-treats-e4gkH3ZshF8) | [Unsplash License](https://unsplash.com/license) |
| `/images/plateau-sale.webp` | Portrait très riche ; limiter le voisinage à une typographie sobre. | 50% 50% | [Anto Meneghini](https://unsplash.com/photos/a-delicious-charcuterie-board-with-bread-and-greenery-PlHdlc0Ja48) | [Unsplash License](https://unsplash.com/license) |
| `/images/table-reception.webp` | Paysage ; conserver l’équilibre entre gâteau, petits fours et végétal. | 50% 57% | [Jonathan Borba](https://unsplash.com/photos/elegant-dessert-table-with-a-white-cake-and-various-pastries-HKes9_amYnE) | [Unsplash License](https://unsplash.com/license) |
| `/images/brunch.webp` | Portrait chaleureux ; évoque un moment brunch, pas une box Siray existante. | 49% 54% | [Juan Pablo Lara](https://unsplash.com/photos/croissant-pastry-with-berries-and-coffee-on-a-table-xAslUfIkYCE) | [Unsplash License](https://unsplash.com/license) |
| `/images/fruits.webp` | Famille Fruits des saveurs ; garder la composition de fruits entière. | 51% 51% | [Katja Ano](https://unsplash.com/photos/a-plate-of-fruit-with-oranges-strawberries-and-blueberries-Zp_nqma-4aY) | [Unsplash License](https://unsplash.com/license) |
| `/images/framboises.webp` | Grand espace clair en haut ; image de détail uniquement, sans promesse d’ingrédients. | 50% 74% | [Ben Moore](https://unsplash.com/photos/pJILiyPdrXI) | [Unsplash License](https://unsplash.com/license) |
| `/images/cupcake-detail.webp` | Portrait sombre ; beau contraste de matière, objet isolé. | 50% 48% | [Andrew Valdivia](https://unsplash.com/photos/cupcake-with-white-icing-on-top-uEB9eYRALyc) | [Unsplash License](https://unsplash.com/license) |

### Procédure de remplacement documentée à la V6

Remplacer la photographie principale et toutes ses variantes ensemble. Décrire ce qui est réellement visible dans le texte alternatif, adapter le point focal à la nouvelle composition, puis mettre à jour le manifeste et les crédits publics. Ne pas déduire des images provisoires des saveurs, recettes, tailles, personnes clientes ou tarifs absents du contenu métier.

Pour les bento cakes, conserver un vrai petit gâteau dans l’image principale et une photographie adaptée à la préparation de la demande ; ne pas réutiliser un cupcake. Les visuels Fruits, Chocolats et Notes gourmandes doivent rester cohérents avec la famille consultée, sans transformer l’illustration en promesse de recette.

Le manifeste contient les URL sources, auteurs, licences, catégories, dimensions, poids et variantes. Les téléchargements bruts de recherche ne font pas partie du site. Les résultats de contrôle de la V6 sont décrits dans `docs/qa/` ; ce document décrit les fichiers et leur usage, sans constituer un verdict navigateur.
