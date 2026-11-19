# Siray Signature V12 — Votre projet et footer

## Contenu et périmètre

Source métier : précisions du client dans la demande V12 du 19 novembre 2026. Elles confirment les commandes et leur confirmation sur Instagram, la personnalisation selon la prestation, l’anticipation nécessaire même pour un bento cake, la difficulté des demandes pour le jour même ou le lendemain, le retrait habituel sur le lieu de création et une livraison à domicile envisageable à Bordeaux/Gironde avec supplément à convenir. La mention halal couvre désormais les viandes et les ingrédients utilisés. Aucun délai minimal chiffré, adresse précise, horaire fixe, montant de livraison ou certification n’est déduit. Le retrait des créations reste distinct du retrait du matériel prévu dans la prestation buffet.

/contact/ conserve son URL et devient « Votre projet » dans le titre et le fil d’Ariane. La page présente l’action Instagram et l’anticipation, une procédure ordonnée en trois étapes, les renseignements du premier message, puis retrait/livraison et halal directement visibles. Le complément allergies conserve #allergies dans un details natif ouvert par défaut. Les anciens styles contact/FAQ devenus inutilisés sont supprimés ; les nouveaux styles sont locaux à la page. Aucun script ajouté. Les photos, l’accueil V11, le catalogue et les prix restent inchangés.

Le footer expose les sept prestations depuis collections, puis quatre destinations générales dans une navigation distincte. Deux colonnes sur petit mobile, flex avec retour à la ligne dès 600 px ; logo compact et action principale préservés.

## Vérifications exécutées

- Astro check : 30 fichiers, 0 erreur, 0 avertissement, 0 indice. Compilation finale : 13 pages statiques.
- Contrôle HTML final : 13 pages, aucune anomalie ni avertissement. Contrôle HTTP des routes locales également passé lors de la validation de la page.
- Rendu intégré de Votre projet aux largeurs 320, 390, 600, 768, 960, 1280 et 1440 px : aucun débordement horizontal. Après ajout de min-width 44 px, les onze liens de navigation du footer mesurent tous au moins 44 × 44 px aux sept largeurs.
- Footer partagé vérifié sur l’accueil et la fiche layer cake, à 390 et 960 px : sept destinations exactes, aucun débordement, aucune cible de navigation inférieure à 44 × 44 px.
- Détail allergies fermé avec Entrée puis rouvert avec Espace ; état open correspondant et focus visible de 2 px observé. Navigation directe /contact/#allergies : contenu ouvert et visible sous l’en-tête fixe (cible y=455,24 px à 390 px ; sa proximité de la fin de page limite l’alignement en haut).
- Inspection des captures bureau, page complète et téléphone, incluant le footer complet. Viewport temporaire réinitialisé et onglet conservé sur Votre projet.
- Impeccable detect --json --changed : exit 0, liste vide. Taste copy-lint sur le HTML contact : exit 0, une information de rythme de texte, aucun avertissement ni échec. Ces contrôles sont statiques et ne remplacent pas le rendu.
- Revue indépendante du contenu et du diff : aucun défaut métier ou de parcours identifié. Revue séparée du footer : contrastes statiques des liens principaux 7,09:1, secondaires 6,26:1, action 11,19:1 ; focus ivoire 7,09:1. Les transitions du footer respectent reduced motion.
- git diff --check passé. Aucun changement dans public/images, photography.ts, Photo.astro ni index.astro.

Les mesures sont dans v12-responsive.json ; captures v12-project-desktop.jpg, v12-project-full-desktop.jpg, v12-project-mobile.jpg et v12-footer-mobile.jpg. Les fichiers de contrôle conservent leur périmètre propre.

## Limites et livraison

Pas de test sur téléphone physique, Safari/iOS ou navigateur Instagram, ni d’essai avec lecteur d’écran. Le fallback sans JavaScript repose sur le HTML natif conservé ; il n’a pas fait l’objet d’une session navigateur séparée. Aucun message n’a été envoyé et aucune commande réelle n’a été effectuée. Aucun hébergement de production n’est déployé.

Les archives V12 de Netlify et Cloudflare Pages contiennent le même site statique de 140 fichiers et 13 pages. L’intégrité fichier par fichier et la synchronisation de main seront consignées dans releases/v12/publication.json une fois achevées. L’URL de production reste à attribuer ; les métadonnées de partage devront recevoir cette origine au lancement.
