# Images provisoires — V6

Les photographies servent à composer et à vérifier la façade en attendant les réalisations autorisées de Siray Signature. Elles ne montrent pas les créations de la maison et ne doivent pas être présentées comme « nos réalisations ». Les parcours ne répètent plus de légende de provenance ; le lien **« Crédits des images »** du footer donne accès aux auteurs et licences. Le registre `docs/image-credits.json` reste la référence pour chaque fichier.

Les sources utilisent deux licences : [Unsplash License](https://unsplash.com/license) et [Pexels License](https://www.pexels.com/license/). Le registre consigne les pages officielles, les auteurs, les conditions retenues et la date de vérification du 18 novembre 2026. Aucun visuel Unsplash+ ni photographie de Grolet, Louis Vuitton ou Hermès n’est inclus.

Les images sont locales et converties en WebP. Chaque série comporte le fichier principal `/images/nom.webp` et les variantes `/images/nom-1024.webp` et `/images/nom-640.webp`. Le côté long est plafonné respectivement à 1 600, 1 024 et 640 px, sans agrandissement de la source. Les portraits ont donc une largeur inférieure à ces valeurs. Utiliser les dimensions réelles du manifeste pour les descripteurs `srcset` ; le nom de variante n’est pas sa largeur garantie.

## Nouveaux visuels V6

Les quatre ajouts distinguent le format bento des cupcakes et associent une image aux familles de saveurs. `bento-cake` est l’image principale du bento ; `bento-detail` est réservé à la préparation de sa demande. Ces photographies restent des substituts, à remplacer par les réalisations Siray.

| Fichier | Usage et cadrage | Point focal | Auteur et source | Licence |
| --- | --- | --- | --- | --- |
| `/images/bento-cake.webp` | Image principale des bento cakes. Recadrage technique sur le gâteau et les mains ; visage exclu. Aucune personne présentée comme cliente. | 50% 50% | [Katia Damyan](https://www.pexels.com/photo/model-in-black-blazer-holding-a-box-with-mini-cake-19908504/) | [Pexels License](https://www.pexels.com/license/) |
| `/images/bento-detail.webp` | Volet « Préparer ma demande » des bento cakes ; conserver le petit gâteau et ses cœurs visibles. | 50% 48% | [Muneer ahmed ok](https://unsplash.com/photos/hands-holding-a-small-cake-decorated-with-hearts-AKI3g3Xsm5A) | [Unsplash License](https://unsplash.com/license) |
| `/images/chocolat.webp` | Famille Chocolats des saveurs ; garder les trois types de chocolat dans le cadre. | 50% 50% | [Tamanna Rumee](https://unsplash.com/photos/assorted-chocolate-pieces-scattered-on-a-dark-cloth-l3fpWq7zExM) | [Unsplash License](https://unsplash.com/license) |
| `/images/notes-gourmandes.webp` | Famille Notes gourmandes des saveurs ; conserver le bol de pistaches comme sujet. | 50% 48% | [David Trinks](https://unsplash.com/photos/a-white-bowl-filled-with-pistachios-on-top-of-a-table-9deyN2wkeM8) | [Unsplash License](https://unsplash.com/license) |

Le fichier `bento-cake.webp` provient de Pexels. Un recadrage technique retire le visage présent dans la source et conserve le gâteau avec les mains ; il ne modifie ni le gâteau ni sa décoration. Les autres ajouts viennent d’Unsplash. Les transformations consignées sont le redimensionnement, la conversion et les cadrages techniques ; aucune retouche créative ou génération d’image n’est revendiquée.

## Autres visuels conservés

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

## Remplacement par les photographies de Siray

Remplacer la photographie principale et toutes ses variantes ensemble. Décrire ce qui est réellement visible dans le texte alternatif, adapter le point focal à la nouvelle composition, puis mettre à jour le manifeste et les crédits publics. Ne pas déduire des images provisoires des saveurs, recettes, tailles, personnes clientes ou tarifs absents du contenu métier.

Pour les bento cakes, conserver un vrai petit gâteau dans l’image principale et une photographie adaptée à la préparation de la demande ; ne pas réutiliser un cupcake. Les visuels Fruits, Chocolats et Notes gourmandes doivent rester cohérents avec la famille consultée, sans transformer l’illustration en promesse de recette.

Le manifeste contient les URL sources, auteurs, licences, catégories, dimensions, poids et variantes. Les téléchargements bruts de recherche ne font pas partie du site. Les résultats de contrôle de la V6 sont décrits dans `docs/qa/` ; ce document décrit les fichiers et leur usage, sans constituer un verdict navigateur.
