# Siray Signature

Répondre en français. Lire `PRODUCT.md`, `DESIGN.md` et `README.md` avant de modifier la vitrine.

Le site est une vitrine Astro statique avec GSAP, destinée à Netlify et portable vers un autre hébergeur statique. Les demandes passent par https://www.instagram.com/siraysignature/. Le dépôt métier est `sarbhakan/site_siray`; `Nutlope/hallmark` est une source d'outillage.

Conserver les pages et leurs URL, l'index éditorial, les images locales optimisées, l'accessibilité et la navigation progressive. Les mouvements restent facultatifs et respectent `prefers-reduced-motion`.

Les photographies actuelles sont des images d'ambiance licenciées, avec crédits dans `docs/image-credits.json`. Ne pas les attribuer à Siray Signature. Les photographies réelles, tarifs, saveurs détaillées, délais, coordonnées et informations légales seront fournis par le client ; ne pas les inventer.

Le Dev Toolkit Orchestrator a préparé neuf dépôts dans `.dev-toolkit/vendor`, non suivis dans Git. Le bilan portable des modules appliqués et pins est dans `docs/toolkit-report.json`. Si le plugin est disponible, suivre son skill `development-orchestrator` pour restaurer ces sources localement. Ne pas installer de hook global, serveur de reverse engineering ou mode autonome externe pour cette vitrine.

Vérifications usuelles : `npm run build` et `python3 scripts/check-site.py`. Pour les changements d'interactions ou de mise en page, compléter par un rendu navigateur bureau/mobile. Les contrôles statiques ne prouvent pas le focus ou le contraste photographique. Les derniers résultats figurent dans `docs/qa/`.
