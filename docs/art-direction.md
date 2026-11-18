# Siray Signature — direction artistique de la première version

Statut : contrat de conception pour la façade multipage, avant les photographies définitives. Les choix réels de la façade sont désormais consignés dans [DESIGN.md](../DESIGN.md), qui prévaut sur les valeurs de proposition initiale ci-dessous. Le brief utilisateur fait foi. Hallmark conduit le parcours custom, Taste précise le rythme et la voix, Impeccable contrôle le métier visuel, les états et le mouvement. Aucune de ces sources ne doit inventer des informations sur Siray Signature.

## L’idée retenue : la table se compose

Siray Signature ne se présente pas comme un catalogue de produits isolés. Le site construit progressivement une table : une pièce haute, une petite douceur, un plateau, puis un ensemble à partager. La mise en page emprunte les variations d’échelle de cette table. Les photographies occupent de grands rectangles nets; le texte reste assez simple pour laisser voir la pâtisserie.

Le souvenir recherché après la première visite : une grande image gourmande, le nom Siray Signature, puis un mouvement de composition entre cakes et buffets. La présence de Bordeaux et de la Gironde donne immédiatement le périmètre réel du projet.

Trois pistes ont été confrontées avant de choisir :

- **La table se compose**, photographie à grande échelle, typographie pleine, compositions qui varient comme les pièces d’un buffet. Retenue pour réunir pâtisserie, brunch et salé dans une seule identité.
- **Le détail pâtissier**, cadrages macro et montage très serré. Conservée comme manière de photographier les créations; trop étroite pour exprimer les buffets entiers.
- **L’invitation manuscrite**, lettres et blancs très étendus. Écartée comme langage principal : elle ferait perdre la matière des réalisations et demanderait une histoire de marque qui n’a pas été fournie.

## Ce qui est vrai

La marque est **Siray Signature**. Sa phrase de marque est **« L’art de sublimer vos instants gourmands »**. Elle propose des layer cakes, bento cakes, cupcakes, mignardises, brunch box, buffets sucrés et salés, ainsi que des plateaux de fruits, de fromage et de charcuterie, sur mesure à Bordeaux et en Gironde. Les échanges et commandes passent par Instagram.

Les tarifs, saveurs, compositions précises, capacités, disponibilités, délais, modalités de livraison ou de retrait, coordonnées et mentions légales restent à fournir. L’identifiant Instagram a été confirmé après le brief initial : [@siraysignature](https://www.instagram.com/siraysignature/). Le site ne présente aucun témoignage, note, volume de commandes, ancienneté ou label. Les textes de cette version décrivent les familles de créations et invitent à préparer un échange.

## Monde visuel

L’ivoire vient du linge de table et des crèmes claires, le cacao des ombres des photographies et le bordeaux d’une ponctuation fruitée. Le caractère vient de la taille et du cadrage, sans dorure artificielle, effet marbre, grain numérique ou bordure de luxe. Les champs bordeaux sont des surfaces choisies, pas un saupoudrage d’accents.

| Rôle CSS | Valeur de référence | Déclaration CSS |
| --- | --- | --- |
| `--color-paper` | `#F7F3EB` | `oklch(96.50% 0.0114 84.58)` |
| `--color-paper-2` | `#EDE4D8` | `oklch(92.27% 0.0188 75.32)` |
| `--color-ink` | `#2D211D` | `oklch(26.07% 0.0201 39.24)` |
| `--color-muted` | `#75655E` | `oklch(51.99% 0.0233 45.06)` |
| `--color-rule` | `#D0C4B7` | `oklch(82.66% 0.0224 69.73)` |
| `--color-field` | `#5B1F2F` | `oklch(33.57% 0.0892 6.80)` |
| `--color-field-ink` | `#FFF7EB` | `oklch(97.91% 0.0180 78.24)` |
| `--color-accent` | `#7E293C` | `oklch(41.39% 0.1179 10.45)` |
| `--color-focus` | `#A83852` | `oklch(50.88% 0.1473 10.11)` |

Contrastes calculés sur ces couleurs pleines : cacao/ivoire 14,09:1, texte secondaire/ivoire 5,02:1, ivoire clair/champ bordeaux 11,75:1, ivoire clair/bouton bordeaux 8,70:1. Ne pas réduire l’opacité des textes secondaires. Sur bordeaux, utiliser les tons dérivés du champ ou son encre claire, jamais le gris du fond clair.

Deux familles : **Gloock 400** pour les titres et la marque, **Manrope 400 et 600** pour les paragraphes, liens et contrôles. Les deux ont été vérifiées avec le vérificateur de familles du catalogue Hallmark; aucune n’est la famille d’affichage d’un thème du catalogue. Héberger les fichiers localement, garder leurs licences, charger uniquement ces graisses, `font-display: swap`, et interdire les faux gras/italiques. La marque est du texte, pas un faux logo illustré.

Échelle cible : texte 17px/1,6 sur ordinateur et 16px/1,6 sur téléphone; navigation 16px; légendes 14px minimum. H1 de 76 à 96px à 1440px, selon sa longueur; 48 à 58px à 390px. H2 de 42 à 64px sur ordinateur, 34 à 40px sur téléphone. Titres en casse normale, une couleur et une graisse par titre; césures uniquement au sens de la phrase. La phrase de marque fournie peut dépasser le budget de titre d’un guide et reste intacte.

Pas d’interlettrage de capitales dans les menus, pas d’eyebrow au-dessus de chaque titre, pas de numéros de section décoratifs. Le visiteur voit de vrais mots : « Créations », « Buffets & brunch », « La maison », « Votre projet ».

Le rythme repose sur 8, 16, 24, 40, 64, 96 et 144px. Le canevas plafonne autour de 1440px; les textes courants se limitent à 45–68 caractères. Marges de page 64px sur grand écran, 24px sur téléphone. Des compositions photo différentes se succèdent : pleine largeur, paire décalée, index ouvert, puis vue d’ensemble. Aucun alignement de trois cartes identiques ne structure la page.

## Premier écran

Composition de référence à 1440×900 : en-tête ivoire de 80px, marque à gauche, navigation au centre/droite, lien de contact discret. La photographie du hero occupe ensuite la largeur disponible et environ 460px de hauteur. Le sujet est assez grand pour lire la crème, le fruit ou la disposition du buffet. Une plage ivoire vient au pied de l’image, avec le titre sur deux ou trois lignes à gauche et l’introduction/action à droite. Le titre ne traverse pas un détail important de la photo. À 1280×800, la phrase de marque, la proposition explicite et l’action principale doivent toutes être visibles sans défilement.

H1 : **L’art de sublimer vos instants gourmands**. Texte de soutien : **Cakes, mignardises et buffets sur mesure à Bordeaux et en Gironde.** Action principale : **Explorer les créations**. L’accès au projet reste un lien de navigation plus calme. Ne pas ajouter une seconde promesse grandiloquente.

Le premier écran montre le passage d’une pièce à une table via un sélecteur manuel de photographies. Trois boutons textuels, « Cakes », « Mignardises », « À partager », changent le visuel par fondu court. Le nom actif accompagne réellement l’image. Des flèches dessinées en SVG peuvent compléter les contrôles; elles ne remplacent jamais les libellés accessibles. Aucun défilement automatique n’est nécessaire. Si les actifs temporaires ne représentent pas honnêtement les trois familles, garder un seul visuel et installer le sélecteur dans la section des créations.

## Architecture et contenu

Le site possède de vraies URL, avec un titre, un H1 et une description propres à chaque page. Les pages doivent conserver assez de matière pour qu’un lien partagé sur Instagram fonctionne seul. La répartition exacte des catégories peut être ajustée pendant l’implémentation sans diluer les familles fournies.

| Page | Ce qu’elle permet de comprendre | Composition proposée |
| --- | --- | --- |
| Accueil | L’univers, l’offre et le périmètre Bordeaux/Gironde | Hero, index des familles, duo de détails pâtissiers, grande table sucrée/salée, invitation au projet |
| Créations | Layer cakes, bento cakes, cupcakes et mignardises | Grande pièce d’entrée, index textuel avec photos, une section par famille, lien vers un projet |
| Buffets & brunch | Brunch box, buffets sur mesure et plateaux fruits/fromage/charcuterie | Photo de table en largeur, succession de formats variés, champ bordeaux avec les familles salées/sucrées, invitation à préciser l’occasion |
| Galerie | La matière visuelle, sans catalogue transactionnel | Galerie éditoriale avec filtres simples, ratios d’images variés mais grille stable, légendes sobres |
| La maison | Le nom, la démarche sur mesure et l’ancrage local | Typographie généreuse, photos de détail ou de préparation si disponibles, texte factuel court, aucune biographie inventée |
| Votre projet | Comment préparer un échange sur Instagram | Résumé des informations utiles, message à copier si implémenté, renvoi vers le compte Instagram confirmé |

L’accueil n’accumule pas tous les contenus secondaires. Il doit donner assez de détails pour qu’on sache immédiatement où poursuivre. Les pages de création utilisent leurs noms exacts. Une catégorie n’annonce jamais une saveur ou une composition non validée. Les mots « mariage », « anniversaire », « réception » peuvent suggérer des occasions de discussion sans promettre une prestation précise absente du brief.

La page projet guide avec quatre informations en prose ou dans une liste légère : l’occasion, la date souhaitée, le nombre de personnes envisagé et les créations qui intéressent le visiteur. Cette liste prépare une conversation, elle ne transmet pas une commande. Si un bouton copie un message, son retour dit « Message copié » et ne simule jamais un envoi. L’identifiant étant maintenant confirmé, le lien de contact ouvre Instagram. Le lien confirmé est https://www.instagram.com/siraysignature/.

## Photographies et transparence

Les photographies de Siray Signature, lorsqu’elles arrivent, remplacent tous les visuels d’ambiance. Les actifs temporaires doivent être licenciés, consignés dans un registre avec URL, auteur, licence et transformations. Ils ne deviennent jamais des réalisations attribuées à Siray Signature. Une mention globale lisible explique : **« Photographies d’ambiance. Les créations Siray Signature seront présentées avec les photographies de la maison. »** Elle peut figurer au pied de la galerie et dans les crédits, sans répéter un avertissement sous chaque image.

Les slots ont une taille et un sujet explicitement documentés :

- `hero-table`, 16:7 sur ordinateur et 4:3 sur téléphone : table ou composition gourmande, vue d’ensemble avec un sujet latéral permettant un recadrage;
- `cake-detail`, 4:5 : cake entier avec une texture lisible;
- `mignardise-detail`, 1:1 : plusieurs petites pièces vues de près;
- `buffet-wide`, 16:9 : vraie disposition de buffet, variété identifiable;
- `brunch-plateau`, 4:3 : plateau ou box cohérent avec le contenu de la section;
- `atelier-detail`, 4:5 : mains ou geste de préparation authentique, quand cette photographie existe.

Ne pas multiplier les mêmes trois images pour faire croire à un catalogue. Si un sujet manque, la composition garde une bonne place au texte et à une image pertinente. Pas de photo de viennoiserie pour remplir un slot de bento cake. Pas de faux cut-out CSS. Les images de contenu portent des descriptions du sujet visible, sans nom de création inventé.

La photo hero est une image responsive locale optimisée, dimensions explicites, priorité haute et sans chargement différé. Les autres chargent à la demande. Viser un hero AVIF/WebP de moins de 350–500ko et aucune vidéo obligatoire pour la première visite. Une future vidéo de préparation sera muette par défaut, avec affiche statique, contrôle pause visible et alternative motion réduite.

## Chorégraphie : composer, puis laisser regarder

Le geste distinctif est **le changement de composition**. Le sélecteur montre une pièce, puis une collection, puis une table; le visiteur décide du rythme. Le cadre ne bouge pas, les sujets changent par fondu de 350 à 450ms. C’est la seule interaction visuelle d’auteur de la page d’accueil. L’animation doit avoir un sens même si le visiteur ne fait aucun défilement.

L’entrée du hero est un seul établissement de 600ms maximum, contenu visible par défaut. Pas d’enchaînement de fade, scale, flou et balayage sur le même élément. Les photographies liées peuvent s’agrandir de 1,02 dans leur cadre sur pointeur précis; le cadre et la cible restent immobiles. Les liens changent de soulignement ou de couleur en 120–180ms. Le menu mobile s’ouvre en 220–300ms, se ferme plus vite et rend le focus à son déclencheur.

Les pages peuvent employer une seule séquence de révélation courte sur une composition particulière, sans répéter la même arrivée à chaque section. Aucune parallax, aucun curseur spécial, aucun texte défilant en boucle, aucun bloc qui immobilise le scroll. Une transition de navigation légère peut préserver une image partagée, mais le navigateur doit conserver les liens, l’historique et le scroll attendus.

Avec `prefers-reduced-motion`, aucun déplacement spatial, zoom ou changement automatique. Les changements manuels restent immédiats ou utilisent un fondu très court, afin que l’état reste compréhensible. Tout contenu existe et reste visible sans JavaScript. Ne charger aucune bibliothèque d’animation pour un fondu que CSS ou Web Animations API suffit à produire.

## Téléphone et accessibilité

À 390px, conserver les couleurs et la même histoire mais changer la composition : titre et action avant le grand cadre photo ou photo raccourcie avant eux, selon le recadrage réel. Le premier écran ne doit pas être mangé par une image de 100vh. Ne pas imposer de retours de ligne de bureau; tester notamment « gourmands » et « Signature ». Les photos gardent un sujet complet, avec une source/coupe dédiée quand nécessaire.

Les index à survol deviennent des choix explicites au toucher. Les filtres de galerie fonctionnent sans glissement horizontal obligatoire. Cibles de 44px minimum, 48px si possible; tous les contrôles au clavier; focus visible instantané; état actif transmis autrement que par couleur; menu avec fermeture Échap; images et SVG correctement nommés. Les textes ne descendent jamais sous 16px, sauf les vraies légendes. Le formulaire éventuel n’est pas un décor : aucun faux succès et aucune donnée collectée sans destination réelle.

## Barrière anti-slop et vérification

Avant la revue visuelle : remplacer mentalement Siray Signature par une autre marque. Les noms de produits, Bordeaux/Gironde, les formats de table et la progression pièce/ensemble doivent rendre ce remplacement gênant. La qualité vient des images, des coupes, des relations de tailles et de la fidélité des mots.

À retirer si présents : cartes répétées avec icône et paragraphe; bandeau de chiffres inventés; fausse citation; serif fin et capitales espacées sur toutes les lignes; mot isolé en italique; formes rondes décoratives; boutons pillules partout; halo, gradient ou texture; faux tampon artisanal; vitrine appelée boutique sans fonction d’achat; liens `#` sans cible; grandes zones volontairement vides qui servent seulement à rallonger la page.

La première revue porte sur les vues 1440×900, 1280×800 et 390×844; la deuxième sur le parcours réel clavier/toucher et les pages secondaires; la troisième sur la stabilité des images, le mode réduit et le fonctionnement sans JavaScript. Les captures de mouvement normale/réduite doivent couvrir le même sélecteur et le même menu. Un score automatisé ne remplace pas cette inspection. Les limites ou éléments non vérifiés sont consignés, jamais transformés en verdict de réussite.

## Références observées

Consultation des sites officiels le 18 novembre 2026. Ces références inspirent la hiérarchie et le soin, pas les actifs, la marque ou une reproduction de mise en page.

- [Cédric Grolet](https://cedric-grolet.com/) : le produit et les images portent l’entrée; les destinations restent simples et immédiatement nommées. À retenir pour Siray : limiter le discours avant de voir la matière.
- [Hermès](https://www.hermes.com/fr/fr/) : ouverture narrative et médias de collection, avec contrôles vidéo de lecture et de son visibles. À retenir : les contrôles font partie du raffinement.
- [Louis Vuitton](https://fr.louisvuitton.com/fra-fr/homepage) : la navigation passe d’une campagne forte à des familles puis à d’autres chapitres visuels. À retenir : varier le rythme des chapitres et conserver une taxonomie explicite.

Sources de méthode : les trois guides d’intégration du plugin Dev Toolkit Orchestrator 0.2.0; Hallmark `SKILL.md`, `flow.md`, `direction.md`, `anatomy.md`, `imagery.md`, `craft.md`, `patterns.md`, `gates.md` et `fonts.md`; Taste `SKILL.md`, `copy.md`, `copy-voice.md`, `system.md`, `layout-v4.md`, `sections.md`, `motion.md`; Impeccable `SKILL.md`, `craft-floor.md`, `new-work.md` et `animate.md`. Les conflits de goût sont résolus en faveur du brief Siray et du choix custom Hallmark; aucune exigence d’un dépôt ne crée une étape d’approbation qui annule l’autonomie demandée par l’utilisateur.

## Direction contract

**THESIS.** Une table se compose à l’écran : pâtisserie individuelle, petites pièces et ensembles à partager deviennent les échelles de la page.

**OWN-WORLD.** Ivoire chaud, cacao dense et un champ bordeaux choisi; Gloock plein, Manrope lisible, photos rectangulaires nettes, index ouverts.

**STORY.** Reconnaître les créations, comprendre le sur-mesure en Gironde, puis préparer une conversation Instagram.

**FIRST VIEWPORT.** Grande photo gourmande, phrase de marque au pied de l’image sur ivoire, proposition locale et action « Explorer les créations » visibles; changement manuel de composition.

**FORM.** Site éditorial multipage; `seed: none (pinned)`. La demande fixe « beau, luxueux », une vraie façade complète, plusieurs pages, des photos et des animations. Les détails de composition sont une décision d’exécution.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
