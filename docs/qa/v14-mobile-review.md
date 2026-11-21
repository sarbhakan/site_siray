# V14 — proposition de navigation mobile

Branche de revue : `codex/siray-v14-mobile-navigation`, issue de `main` au commit `b63bb53a2be01f428c7d1bf024f0f6ac642af0e5`. Aucun changement de domaine ni fusion de production dans cette passe.

## Changements

Menu natif conservé : ouverture depuis la gauche par transform, 340 ms, sans dépendance ajoutée ; mode réduit instantané. Bandeau olive, navigation ivoire, fermeture explicitement nommée, focus initial sur Fermer. Menu et Fermer perdent leur cadre et conservent un indicateur de focus inférieur. Les protections pour les encoches latérales sont conservées. Passage au bureau : fermeture automatique.

Accueil : les deux parcours prennent une forme de commande bordée de même largeur ; la localisation est centrée. Les mentions pratiques occupent une ligne centrée plus le lien allergies sur téléphone. Footer : titre et CTA centrés, sept prestations en lignes flexibles et quatre liens généraux sur une ligne aux tailles vérifiées. Les sources photographiques, leurs réglages et le script du diaporama ne changent pas.

## Vérifications exécutées

- Astro check : 30 fichiers, aucune erreur, aucun avertissement ni hint. Build statique : 13 pages produites.
- `scripts/check-site.py` sur le build et le serveur de prévisualisation local : 13 pages, aucune issue ni warning ; liens, ressources et réponses HTTP contrôlés.
- Accueil dans le navigateur intégré aux largeurs 320, 390, 768, 960 et 1440 px : aucun débordement horizontal. Liens du footer et parcours de l’accueil : aucune cible sous 44 × 44 px.
- Footer : deux rangées de prestations à 320 et 390 px ; une rangée dès 768 px. Quatre liens généraux sur une seule rangée aux cinq largeurs. Hauteur mesurée environ 345/347 px sur petit mobile. La première ligne pratique tient à 320 et 390 px, en 13 px.
- Les neuf autres pages de contenu, ainsi que Bento cakes par navigation, ont été ouvertes à 390 px : sept liens de prestations, quatre liens généraux, aucun débordement horizontal observé. L’index des prestations et la 404 ont aussi été ouverts à 320 px sans débordement horizontal. Les deux libellés de parcours de l’accueil tiennent sur une ligne à 320 px. Aucune entrée warn/error observée dans la console capturée.
- Menu : focus initial Fermer, navigation clavier dans le dialogue, Échap et retour du focus sur Menu, trois cycles ouvrir/fermer, passage au bureau, navigation vers Bento cakes et état fermé après navigation vérifiés. Le navigateur peut donner le focus à sa propre barre d’adresse en limite de cycle ; aucun lien de la page inerte n’a été activé.
- Taste copy-lint sur l’accueil compilé : aucun finding. Revue indépendante du diff : protections safe-area et ordre visuel/clavier du footer corrigés après signalement.
- Aucun fichier modifié dans `public/` ni dans les données photographiques : qualité et compression préservées.

## Sources et limites

Dev Toolkit : Impeccable 4.9.2 pilote polish/adapt, Taste 2.5.1 fournit les références de système et mouvement, Hallmark 2.0.0 fournit les garde-fous compatibles ; aucun redesign Hallmark lancé. Unslop, de Damir Sokolovsky, CC BY 4.0, guide la densité et la sobriété. Les pins installés sont conservés. La préparation a rencontré l’ancien verrou vide du toolkit ; les sources déjà présentes ont été réutilisées sans supprimer le verrou ni réinstaller. Le chargement de contexte Impeccable a fonctionné ; son détecteur s’est terminé avec le code 137 sans rapport, donc aucun résultat automatique de ce détecteur n’est revendiqué.

Le mouvement et le dialogue suivent [la technique WAI sur dialog](https://www.w3.org/WAI/WCAG22/Techniques/html/H102) et [les recommandations web.dev sur le mouvement réduit](https://web.dev/articles/prefers-reduced-motion). L’ouverture utilise transform et les effets secondaires restent courts ; aucun calcul de layout n’est animé.

La validation porte sur le navigateur intégré et des dimensions de fenêtre. Pas de test sur iPhone physique, Safari iOS, navigateur Instagram ou lecteur d’écran. Le mode mouvement réduit a été contrôlé dans les règles CSS et le code ; aucun basculement réel de préférence système ni mesure de cadence d’animation n’a été effectué. Les captures de revue sont livrées à part, hors des fichiers publics du site.
