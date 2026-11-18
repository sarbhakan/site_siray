# Siray Signature V7 — audit de longueur et de mesure des textes

Revue de sources du 19 novembre 2026, suivie d’une application ciblée de microcopie. Périmètre de lecture : vitrine V6, documents AGENTS/PRODUCT/DESIGN/README et principes Impeccable clarify/adapt/craft-floor et Taste copy lus pendant la reprise. Les seules sources modifiées par cet agent pour V7 sont `src/pages/contact.astro`, `src/pages/index.astro`, `src/pages/creations/index.astro` et `src/components/CollectionEdit.astro`. Aucun build ni rendu navigateur n’a été lancé par cet agent pour V7 ; aucun nombre de lignes effectif, contraste ou alignement mesuré n’est revendiqué ici.

## Modifications effectivement appliquées

- **Contact** : introduction et aide sous la checklist raccourcies ; lien « prestations » conservé ; précision sur le lieu et l’horaire condensée. Le résumé de FAQ devient « Allergies & intolérances » ; la réponse conserve explicitement les restrictions alimentaires ainsi que la vérification des ingrédients et possibilités d’adaptation avant confirmation.
- **Accueil** : lien pratique harmonisé en « Allergies & intolérances » et paragraphe de la maison raccourci. Les titres et photographies restent inchangés.
- **Catalogue** : introduction réduite à « Retrouvez nos sept familles, leurs saveurs et leurs possibilités. » et lien pratique harmonisé.
- **Carte de l’accueil** : introduction réduite à « Gâteaux personnalisés, douceurs et tables à composer. » ; seul le plafond de 48ch de `.collection-edit-heading > p` devient `max-width:none`. Le corps reste à 16px ; aucune règle `nowrap` n’est ajoutée.

Les autres propositions ci-dessous restent des recommandations pour l’agent principal. Aucune donnée de `src/data/site.ts`, aucun tarif, titre, jeton graphique ou choix photographique n’a été modifié par cet agent dans cette passe.

## Conclusion de lecture

Les restrictions relevées dans l’audit initial étaient surtout locales : les paragraphes des fiches à 52ch, l’introduction de la carte à 48ch et la zone Bordeaux/Gironde du footer à 11ch avec équilibrage. Le plafond de l’introduction de la carte a été retiré dans le périmètre appliqué ci-dessus. La plupart n’apportent rien aux phrases courtes dans des colonnes déjà dimensionnées par la mise en page. Les supprimer sur ces sélecteurs précis permettra d’utiliser la largeur disponible. Cela ne garantit pas une seule ligne sur téléphone : la phrase doit aussi être raccourcie, et un retour naturel reste préférable au débordement ou à une police minuscule.

La règle globale `p { max-width:64ch }` reste utile pour les paragraphes de lecture longs. Les mesures des titres et de la phrase de marque ont un rôle de composition distinct. Elles ne doivent pas être supprimées dans une réinitialisation globale.

## Corrections prioritaires dans les fiches

Les numéros ci-dessous correspondent aux sources lues avant les modifications V7 de l’agent principal.

1. **`src/components/ProductDetail.astro:188` et `:209`** — `.v5-product-intro` et `.v5-panel-heading p` portent `max-width:52ch`. Pour ces courtes descriptions, utiliser `max-width:none` ; conserver le corps à 16px. La colonne de la fiche apporte déjà la contrainte de largeur. Ne pas changer le `white-space` des paragraphes.

2. **`ProductDetail.astro:95`** — la phrase des brunchs rappelle le prix par personne, déjà indiqué dans le résumé, les choix et le menu. Proposition : « Du sucré, du salé et un jus de fruits dans chaque composition. » Les montants et leur unité doivent rester inchangés près des choix.

3. **`ProductDetail.astro:160`** — « Gardez ces éléments sous la main pour préparer votre message. Nous précisons ensuite votre projet avec vous sur Instagram. » est une aide longue pour une liste évidente. Proposition : « Ces détails nous aideront à préciser votre projet sur Instagram. » La liste propre à chaque prestation ne change pas.

4. **`ProductDetail.astro:129`** — la note mignardises peut être ramenée à « Quantités supplémentaires sur devis, selon vos besoins et vos convives. » Cela conserve le devis, l’ajustement et le nombre de convives. La note est déjà en pleine largeur et en gras ; aucun nouveau plafond de mesure n’est nécessaire.

5. **`ProductDetail.astro:162`** — conserver l’aide sur les allergies et la phrase complète « Toutes nos viandes sont halal ». La note générale sur les variations de prix peut devenir « Les personnalisations et demandes spécifiques peuvent modifier le tarif. Un devis est établi si nécessaire. » Ne pas créer de montant ou de supplément uniforme pour toutes les offres.

6. **`ProductDetail.astro:147`** — « Mélange de saveurs : supplément. » est déjà bref, explicite et mis en évidence. Conserver cette forme plutôt que réintroduire une phrase longue avec une contrainte de ligne.

## Descriptions des sept familles

Les descriptions de `src/data/site.ts` sont réutilisées dans les fiches et le catalogue. Des variantes plus brèves peuvent réduire les répétitions sans toucher aux listes détaillées, formats et modalités :

- Layer cakes : « Des saveurs et un décor à votre image. »
- Bento cakes : « Un petit gâteau, vos couleurs et votre message. » Le format standard reste dans les repères et possibilités.
- Mignardises : « Des bouchées sucrées et salées pour vos événements. »
- Cupcakes : « Onze saveurs, couleurs et décor au choix. »
- Brunch box : « Dix compositions sucrées et salées, avec jus de fruits. »
- Buffets : « Un buffet sucré, salé ou mixte, dressé sur mesure. »
- Plateaux : « Fruits, fromages, charcuterie ou crudités à partager. »

Ces propositions sont éditoriales, pas de nouveaux faits. Les tarifs, noms, quinze classiques, onze saveurs cupcakes, neuf Signature, dix brunchs et informations nécessaires à la demande restent strictement identiques.

## Accueil et catalogue

**`src/components/CollectionEdit.astro:14` et `:95`** — raccourcir l’introduction en « Gâteaux personnalisés, douceurs et tables à composer. » et retirer le `max-width:48ch` de `.collection-edit-heading > p`. Les colonnes des cartes ne sont pas concernées.

Les descriptions `item.short` des duos mobiles sont plus susceptibles de produire trois lignes que les textes pleine largeur. Variantes possibles : Bento « Un petit format, un message », Cupcakes « Saveurs et décor au choix », Brunch « Dix brunchs au choix », Mignardises « Bouchées sucrées & salées ». Conserver le nom de la famille juste au-dessus.

**`src/pages/creations/index.astro:21`** — l’introduction cumule trois exemples et une instruction. Proposition : « Retrouvez nos sept familles, leurs saveurs et leurs possibilités. » `src/styles/global.css:503` applique `max-width:56ch` à `.intro-bottom p` ; une courte introduction peut employer toute la largeur de son conteneur. Les cartes du catalogue possèdent déjà leur propre colonne : leur paragraphe n’a pas besoin d’une règle supplémentaire pour tenir sur une seule ligne.

**`src/pages/index.astro:25`** — la phrase du hero est déjà courte et factuelle. Elle peut rester sur deux lignes naturelles sur téléphone ; ne pas forcer une ligne. Le `max-width:38ch` à `global.css:340` peut être levé si le rendu bureau montre encore une marge inutilisée, sans toucher à la mesure du titre.

**`src/pages/index.astro:68`** — proposition plus directe : « Vos couleurs, votre décor et votre format donnent le ton de vos cakes et tables sur mesure. » La phrase de marque du titre reste intacte.

**Liens pratiques** — `index.astro:62` et `creations/index.astro:58` peuvent tous deux employer « Allergies & intolérances ». L’intitulé commun est plus court, préserve la destination et correspond au lien des fiches.

## Contact, galerie, maison et footer

**`src/pages/contact.astro:17`** — la liste de prestations est déjà présentée sur le reste du site. Proposition : « Pour votre événement à Bordeaux ou en Gironde, écrivez-nous sur Instagram. »

**`contact.astro:42`** — proposition : « Consultez les compositions et tarifs de nos prestations. Personnalisation, disponibilité et modalités sont confirmées sur Instagram. » Garder le lien sur « prestations ».

La checklist et les réponses de FAQ portent des conditions utiles. Le retour à la ligne d’une question ou d’une réponse ne constitue pas à lui seul une erreur. Exemples de raccourcissement possibles : « Le lieu et l’horaire ou l’heure de retrait » à la ligne 39 ; « Allergies & intolérances » comme résumé à la ligne 92, en conservant dans le texte les restrictions alimentaires et la vérification avant commande. Ne pas réduire les précautions allergiques pour obtenir une seule ligne.

**`src/pages/galerie.astro:19`** — « Gâteaux, petites pièces et tables à partager. » est déjà compact ; aucune réécriture nécessaire.

**`src/pages/la-maison.astro`** — conserver la structure actuelle, que le client prévoit d’enrichir. Les paragraphes de lecture ne doivent pas devenir de longues lignes sur toute la largeur de l’écran. Une réduction mineure de l’introduction serait « Cakes, mignardises et buffets sur mesure, à Bordeaux et en Gironde. » Le détail de composition peut rester en plusieurs lignes.

**`src/components/Footer.astro:128`** — `max-width:11ch` et `text-wrap:balance` imposent à Bordeaux/Gironde un découpage même quand la place suffit. Retirer ces contraintes pour cette zone, avec un retour naturel quand la largeur réelle l’exige. Vérifier 320px avec le logo : ne pas imposer `nowrap`, et garder un `min-width:0` sur le conteneur si nécessaire.

## Alignement de la zone Instagram

Le code lu comporte `.v5-studio-contact` en grille avec `align-items:start` à partir de 600px (`ProductDetail.astro:301`), puis 12px de `padding-top` uniquement sur son paragraphe (`:303`). Le texte sur commande/halal et le lien allergies d’au moins 44px constituent donc un groupe plus haut que le bouton. La compensation de 12px ne résout pas l’alignement du groupe et peut varier avec la largeur.

Recommandation : supprimer cette compensation, choisir un alignement explicite commun des éléments et tester la zone comme un ensemble avec ses dimensions réellement calculées. Si une rangée manque de place, laisser les éléments se répartir en deux rangées cohérentes avec `gap`, plutôt que de réduire le texte ou de forcer une ligne. Conserver les cibles tactiles de 44px du lien allergies et 48px de l’action Instagram. Le libellé « Sur commande · Viandes halal » reste en gras ; sa formulation complète est conservée dans les détails.

## Vérification à effectuer après implémentation

Contrôler les fiches Layer/Bento/Cupcake/Mignardises/Brunch/Plateaux, le contact, l’accueil, le catalogue et le footer à 320, 390, 430, 768 et 1440px. Vérifier les bords des paragraphes par rapport à leur conteneur, le nombre de lignes des notes brèves, les hauteurs et centres de la zone Instagram, les débordements et le zoom à 200%. Les paragraphes longs et les compositions d’aliments peuvent légitimement occuper plusieurs lignes. Cette revue de sources n’anticipe pas ces résultats de rendu.
