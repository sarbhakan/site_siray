/** Generate the public CMS form. No credentials belong in this file or its output. */
import { readFile, writeFile } from 'node:fs/promises';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);
const settings = JSON.parse(await readFile(projectFile('infra/cms-auth/public-settings.json'), 'utf8'));
const authUrl = new URL(process.env.CMS_AUTH_URL || settings.authBaseUrl);
if (authUrl.protocol !== 'https:' || authUrl.username || authUrl.password || authUrl.search || authUrl.hash) {
  throw new Error('CMS_AUTH_URL doit être une URL HTTPS publique sans identifiants ni paramètres.');
}

const families = [
  ['layer-cakes', 'Layer cakes'], ['bento-cakes', 'Bento cakes'], ['mignardises', 'Mignardises'],
  ['cupcakes', 'Cupcakes'], ['brunch-box', 'Brunch box'], ['buffets', 'Buffets'], ['plateaux', 'Plateaux'],
];
const field = (name, label, widget = 'string', options = {}) => ({ name, label, widget, ...options });
const text = (name, label, options = {}) => field(name, label, 'text', options);
const hidden = (name) => field(name, name, 'hidden');
const object = (name, label, fields, options = {}) => field(name, label, 'object', { collapsed: true, fields, ...options });
const list = (name, label, fields, options = {}) => field(name, label, 'list', {
  collapsed: true, fields, ...options,
});
const strings = (name, label, options = {}) => field(name, label, 'list', {
  collapsed: true, field: { name: 'item', label: 'Texte', widget: 'string' }, ...options,
});
const fixed = { allow_add: false, allow_remove: false, allow_duplicate: false, allow_reorder: false };
const price = field('price', 'Prix en euros', 'number', { value_type: 'float', min: 0, step: 0.01 });
const photoFields = [
  field('file', 'Photographie', 'image', {
    hint: 'Importez une photo depuis votre téléphone, ou choisissez dans « Photos actuelles du site ». Dans cette dernière bibliothèque, prenez le grand fichier sans suffixe -360 ou -720. JPEG, PNG, WebP et HEIC sont acceptés.',
  }),
  field('alt', 'Description de la photographie', 'string', {
    hint: 'Décrivez brièvement ce que montre la photo. Ce texte sert aussi aux personnes qui ne voient pas l’image.',
  }),
  field('position', 'Cadrage', 'string', {
    default: '50% 50%', hint: 'Conservez « 50% 50% » pour centrer. Le premier pourcentage déplace le cadrage horizontalement ; le second verticalement.',
  }),
];

const catalogueFields = [
  list('collections', 'Les sept prestations', [
    hidden('slug'),
    field('name', 'Nom'),
    field('short', 'Phrase courte'),
    field('intro', 'Introduction'),
    text('text', 'Présentation'),
    strings('possibilities', 'Formats et personnalisation'),
    field('occasion', 'Pour quelles occasions ?'),
    field('priceSummary', 'Présentation du tarif sur demande', 'string', {
      required: false,
      hint: 'Pour les layer cakes, les bento cakes et les buffets. Les autres résumés de prix sont calculés à partir des tarifs ci-dessous.',
    }),
    text('priceNote', 'Précisions sur les tarifs', { required: false }),
    text('panelNote', 'Précision courte dans le volet', { required: false }),
    list('tariffs', 'Formats et tarifs', [
      field('label', 'Format ou plateau'), price,
      text('description', 'Description', { required: false }),
      field('detail', 'Précision complémentaire', 'string', { required: false }),
    ], {
      required: false, summary: '{{fields.label}} — {{fields.price}} €',
      hint: 'Cupcakes, mignardises et plateaux : modifiez les prix ici. Pour les brunchs, utilisez « Les brunch box » plus bas. Laissez les autres listes vides.',
    }),
    strings('orderFields', 'Informations à demander au client'),
  ], { ...fixed, summary: '{{fields.name}}', min: 7, max: 7 }),
  list('classicFlavorGroups', 'Saveurs classiques des layer cakes et bento cakes', [
    field('name', 'Famille', 'string', { readonly: true }),
    strings('flavors', 'Saveurs'),
  ], { ...fixed, summary: '{{fields.name}}', min: 3, max: 3 }),
  list('signatureFlavors', 'Associations Signature — layer cakes uniquement', [
    field('name', 'Nom de l’association'), text('composition', 'Composition'),
  ], { summary: '{{fields.name}}' }),
  list('cupcakeFlavors', 'Saveurs des cupcakes', [
    field('name', 'Nom de la saveur'),
    field('family', 'Famille', 'select', {
      options: [
        { label: 'Fruits', value: 'fruits' }, { label: 'Chocolats', value: 'chocolats' },
        { label: 'Notes gourmandes', value: 'notes-gourmandes' },
      ],
    }),
  ], { summary: '{{fields.name}}' }),
  list('brunchBoxes', 'Les brunch box — compositions et prix par personne', [
    field('name', 'Nom de la box'), { ...price, label: 'Prix par personne, en euros' },
    strings('sweet', 'Côté sucré'), strings('savory', 'Côté salé'), field('drink', 'Boisson'),
  ], { summary: '{{fields.name}} — {{fields.price}} € / personne' }),
  object('mignardiseMenu', 'Les bouchées et verrines des mignardises', [
    field('savoryTitle', 'Titre de la sélection salée'), text('savoryIntro', 'Introduction salée'),
    list('savory', 'Bouchées salées', [field('name', 'Nom'), text('detail', 'Description', { required: false })], { summary: '{{fields.name}}' }),
    field('savoryFinale', 'Phrase finale salée'), field('sweetTitle', 'Titre de la sélection sucrée'),
    text('sweetText', 'Présentation des verrines sucrées'),
  ]),
  list('buffetServiceSteps', 'Mise en place des buffets', [field('title', 'Étape'), text('text', 'Description')], {
    ...fixed, summary: '{{fields.title}}', min: 4, max: 4,
  }),
];

const photoLabels = {
  maison: 'Accueil — L’art de sublimer vos instants gourmands', cakes: 'Accueil — les gâteaux',
  tables: 'Accueil — les tables à partager', petitesDouceurs: 'Accueil — les petites douceurs',
  maisonCake: 'La maison — photographie de gâteau', maisonTable: 'La maison — photographie de table',
};
const photoContent = JSON.parse(await readFile(projectFile('src/content/photography.json'), 'utf8'));
const photographyFields = [
  list('homeSlides', 'Diaporama de l’accueil', photoFields, {
    summary: '{{fields.alt}}', thumbnail: 'file', min: 1, max: 5,
    hint: 'Une à cinq photographies. L’ordre de cette liste est celui du défilement sur l’accueil.',
  }),
  list('collections', 'Photographies de chaque prestation', [
    hidden('slug'),
    object('cover', 'Photo principale de la page', photoFields),
    object('detail', 'Seconde photographie', photoFields),
    object('request', 'Photo de découverte sur les autres pages', photoFields),
    object('home', 'Carte de l’accueil', photoFields),
  ], { ...fixed, summary: '{{fields.slug}}', min: 7, max: 7 }),
  object('homePhotos', 'Autres photographies de l’accueil et de la maison',
    Object.keys(photoContent.homePhotos).map((key) => object(key, photoLabels[key] || key, photoFields))),
  list('gallery', 'Galerie', [
    ...photoFields,
    field('label', 'Titre affiché'),
    field('category', 'Prestation', 'select', {
      options: families.map(([value, label]) => ({ value, label })),
    }),
  ], { summary: '{{fields.label}}', thumbnail: 'file', min: 1, hint: 'Chaque photo doit être rangée dans sa prestation pour que le filtre de la galerie fonctionne.' }),
];

const pageLabels = {
  pageTitle: 'Titre de l’onglet du navigateur', metaDescription: 'Description pour les moteurs de recherche',
  title: 'Titre principal', summary: 'Sous-titre', description: 'Présentation', discoverLabel: 'Lien vers les prestations',
  celebrateTitle: 'Parcours « Pour célébrer »', celebrateDetail: 'Précision du parcours « Pour célébrer »',
  gatherTitle: 'Parcours « Pour se retrouver »', gatherDetail: 'Précision du parcours « Pour se retrouver »',
  location: 'Zone géographique', locationOrderNote: 'Mention sur commande sous le titre', orderNote: 'Mention sur commande', halalNote: 'Mention halal', allergiesLabel: 'Lien allergies et intolérances',
  maisonTitle: 'Titre de la présentation de la maison', maisonText: 'Présentation de la maison', maisonLink: 'Lien vers la maison',
  galleryTitle: 'Titre de la galerie', galleryLink: 'Lien vers la galerie', cakesLabel: 'Légende des gâteaux',
  sweetsLabel: 'Légende des petites douceurs', tablesLabel: 'Légende des tables',
  intro: 'Introduction', worldTitle: 'Titre de l’univers Siray', worldText: 'L’univers Siray',
  pastryTitle: 'Titre de la pâtisserie', pastryText: 'La pâtisserie', sharingTitle: 'Titre du partage', sharingText: 'Le partage',
  bespokeTitle: 'Titre du sur-mesure', bespokeText: 'Le sur-mesure', exploreBefore: 'Texte avant le lien prestations',
  exploreLink: 'Texte du lien prestations', exploreAfter: 'Texte après le lien prestations',
  orderingText: 'Comment commander', practicalText: 'Informations pratiques',
  lead: 'Présentation', instagramLabel: 'Bouton Instagram', instagramHandle: 'Compte Instagram affiché', channel: 'Canal de commande',
  timingTitle: 'Titre de l’anticipation', timingLead: 'Anticipation — début', timingEmphasis: 'Anticipation — texte en gras',
  timingText: 'Anticipation — suite', processTitle: 'Titre du déroulement', messageTitle: 'Titre du premier message',
  messageIntro: 'Introduction du premier message', exploreLabel: 'Lien pour découvrir les prestations',
  arrangementsTitle: 'Titre des informations pratiques', area: 'Zone d’intervention', pickupTitle: 'Titre du retrait',
  pickupText: 'Informations de retrait', deliveryTitle: 'Titre de la livraison', deliveryLead: 'Livraison — début',
  deliveryEmphasis: 'Livraison — texte en gras', deliveryText: 'Livraison — suite', foodTitle: 'Titre des ingrédients',
  foodText: 'Informations halal', allergiesTitle: 'Titre des allergies', allergiesText: 'Informations allergies et intolérances',
};
const pageKeys = {
  home: ['pageTitle', 'title', 'summary', 'description', 'discoverLabel', 'celebrateTitle', 'celebrateDetail', 'gatherTitle', 'gatherDetail', 'location', 'locationOrderNote', 'orderNote', 'halalNote', 'allergiesLabel', 'maisonTitle', 'maisonText', 'maisonLink', 'galleryTitle', 'galleryLink', 'cakesLabel', 'sweetsLabel', 'tablesLabel'],
  maison: ['pageTitle', 'title', 'intro', 'worldTitle', 'worldText', 'pastryTitle', 'pastryText', 'sharingTitle', 'sharingText', 'bespokeTitle', 'bespokeText', 'exploreBefore', 'exploreLink', 'exploreAfter', 'orderingText', 'practicalText'],
  project: ['pageTitle', 'metaDescription', 'title', 'lead', 'instagramLabel', 'instagramHandle', 'channel', 'timingTitle', 'timingLead', 'timingEmphasis', 'timingText', 'processTitle', 'steps', 'messageTitle', 'messageIntro', 'messageDetails', 'exploreLabel', 'arrangementsTitle', 'area', 'pickupTitle', 'pickupText', 'deliveryTitle', 'deliveryLead', 'deliveryEmphasis', 'deliveryText', 'foodTitle', 'foodText', 'allergiesTitle', 'allergiesText'],
};
const pageField = (key) => {
  if (key === 'steps') return list(key, 'Les étapes de commande', [field('title', 'Titre'), text('text', 'Explication')], { ...fixed, summary: '{{fields.title}}', min: 3, max: 3 });
  if (key === 'messageDetails') return list(key, 'Informations pour le premier message', [field('label', 'Information'), text('text', 'Précision')], { summary: '{{fields.label}}', min: 1 });
  const long = /Text$|Intro$|Description$/.test(key) || ['intro', 'lead', 'description', 'metaDescription'].includes(key);
  return field(key, pageLabels[key] || key, long ? 'text' : 'string');
};
const pageFields = [
  object('home', 'Accueil', pageKeys.home.map(pageField)),
  object('maison', 'La maison', pageKeys.maison.map(pageField)),
  object('project', 'Votre projet', pageKeys.project.map(pageField)),
];

const collection = (name, label, file, fields, description) => ({
  name, label, description, format: 'json', editor: { preview: false },
  files: [{ name, label, file, fields }],
});
const config = {
  $schema: 'https://unpkg.com/@sveltia/cms@0.270.0/schema/sveltia-cms.json',
  app_title: 'Siray Signature — modifier le site',
  site_url: settings.siteUrl,
  display_url: settings.siteUrl,
  backend: {
    name: 'github', repo: 'sarbhakan/site_siray', branch: 'main',
    base_url: authUrl.origin, auth_methods: ['oauth'],
  },
  publish_mode: 'simple',
  media_folder: '/src/assets/uploads',
  public_folder: '/src/assets/uploads',
  media_libraries: {
    all: {
      max_file_size: 20971520, slugify_filename: true,
      filename_template: '{{year}}{{month}}{{day}}-{{uuid_short}}',
      transformations: { raster_image: { format: 'webp', quality: 94, width: 2560, height: 2560 } },
    },
  },
  asset_collections: [{
    name: 'photos-actuelles', label: 'Photos actuelles du site',
    media_folder: '/public/images', public_folder: '/images', readonly: true,
  }],
  collections: [
    collection('photos', 'Photographies', 'src/content/photography.json', photographyFields,
      'Changez les photos, leur cadrage, leur description et leur ordre. Pensez à enregistrer, puis à attendre la publication du site.'),
    collection('catalogue', 'Catalogue et tarifs', 'src/content/catalog.json', catalogueFields,
      'Les sept prestations, les tarifs, les saveurs et les compositions des brunchs. Les prix se modifient à un seul endroit et se mettent à jour partout.'),
    collection('pages', 'Textes des pages', 'src/content/pages.json', pageFields,
      'Les textes de l’accueil, de la maison et de votre projet. La mise en page et les adresses des pages restent conservées.'),
  ],
};

await writeFile(projectFile('public/admin/config.json'), `${JSON.stringify(config, null, 2)}\n`);
console.log(`Configuration CMS générée : ${config.collections.length} rubriques ; authentification ${authUrl.origin}.`);
