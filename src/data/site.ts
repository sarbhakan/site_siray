export const instagram = 'https://www.instagram.com/siraysignature/';
export const brand = 'Siray Signature';

export interface Tariff {
  label: string;
  price: number;
  detail?: string;
}

export interface Collection {
  slug: string;
  href: string;
  name: string;
  short: string;
  image: string;
  alt: string;
  intro: string;
  text: string;
  possibilities: string[];
  occasion: string;
  priceSummary: string;
  priceNote: string;
  tariffs: Tariff[];
  orderFields: string[];
}

export const collections: Collection[] = [
  {
    slug: 'layer-cakes',
    href: '/creations/layer-cakes/',
    name: 'Layer cakes',
    short: 'Un gâteau à votre image',
    image: 'layer-cake',
    alt: 'Gâteau blanc à étages décoré de fruits',
    intro:
      'Un gâteau à votre image, du choix des saveurs aux couleurs du décor.',
    text: 'Une photo d’inspiration, une inscription, les couleurs de votre événement : nous imaginons votre layer cake autour de vos envies.',
    possibilities: [
      '10 parts minimum',
      'Couleurs, thème, inscription et décoration personnalisables',
      'Saveurs classiques ou associations Signature',
    ],
    occasion: 'Anniversaires & réceptions',
    priceSummary: 'À partir de 10 parts',
    priceNote:
      'Le tarif est communiqué en message privé selon le nombre de parts, les saveurs et le niveau de personnalisation.',
    tariffs: [],
    orderFields: [
      'Le nombre de parts souhaité, à partir de 10',
      'Le modèle et vos photos d’inspiration',
      'La saveur classique ou l’association Signature',
      'Les couleurs, le thème, l’inscription et le décor',
      'La date de votre événement',
    ],
  },
  {
    slug: 'bento-cakes',
    href: '/creations/bento-cakes/',
    name: 'Bento cakes',
    short: 'Un petit format, un message personnel',
    image: 'bento-cake',
    alt: 'Petit gâteau blanc personnalisé dans sa boîte, tenu en main',
    intro:
      'Un petit gâteau au format standard, avec vos couleurs et votre message.',
    text: 'Choisissez une saveur classique, puis partagez votre idée de décor. Une photo d’inspiration nous aide à préciser votre création.',
    possibilities: [
      'Format standard',
      'Inscription, couleurs, thème et décoration personnalisables',
      'Saveurs classiques au choix',
    ],
    occasion: 'Cadeaux & petites occasions',
    priceSummary: 'Un format standard à personnaliser',
    priceNote:
      'Le tarif est communiqué en message privé selon la personnalisation et les éléments décoratifs souhaités.',
    tariffs: [],
    orderFields: [
      'La saveur classique souhaitée',
      'Le modèle et votre photo d’inspiration',
      'L’inscription, les couleurs, le thème et le décor',
      'La date souhaitée',
    ],
  },
  {
    slug: 'mignardises',
    href: '/creations/mignardises/',
    name: 'Mignardises',
    short: 'Les petites pièces sucrées & salées',
    image: 'macarons-ivoire',
    alt: 'Macarons clairs disposés sur une table',
    intro:
      'Des bouchées sucrées et salées, réunies en plateaux pour vos événements.',
    text: 'Choisissez les variétés et leur répartition. La composition s’ajuste à vos envies et au nombre de convives.',
    possibilities: [
      'Sucré, salé ou les deux',
      'Plateaux prêts à disposer',
      'Variétés et répartition à définir ensemble',
    ],
    occasion: 'Événements & réceptions',
    priceSummary: '35 pièces · 70 €',
    priceNote:
      'Les quantités supplémentaires sont proposées sur devis. Les compositions peuvent être ajustées selon vos besoins et le nombre de convives.',
    tariffs: [
      { label: '35 pièces', price: 70 },
      { label: '70 pièces', price: 135 },
      { label: '105 pièces', price: 200 },
      { label: '140 pièces', price: 260 },
      { label: '175 pièces', price: 320 },
      { label: '210 pièces', price: 380 },
    ],
    orderFields: [
      'Le nombre total de pièces',
      'Les variétés sucrées et/ou salées',
      'La répartition entre les différentes variétés',
      'La date de votre événement',
    ],
  },
  {
    slug: 'cupcakes',
    href: '/creations/cupcakes/',
    name: 'Cupcakes',
    short: 'Des saveurs à réunir, un décor à choisir',
    image: 'cupcakes',
    alt: 'Cupcakes décorés présentés sur une table',
    intro:
      'Onze saveurs au choix, des couleurs et un décor à assortir à votre occasion.',
    text: 'Sélectionnez vos saveurs et le nombre de pièces, puis échangeons sur le décor et les couleurs souhaités.',
    possibilities: [
      'Cinq formats, de 6 à 30 pièces',
      'Onze saveurs au choix',
      'Personnalisation sur demande',
    ],
    occasion: 'Cadeaux & tables sucrées',
    priceSummary: '6 cupcakes · 18 €',
    priceNote:
      'Toute personnalisation spécifique fait l’objet d’un supplément tarifaire.',
    tariffs: [
      { label: '6 pièces', price: 18 },
      { label: '12 pièces', price: 34 },
      { label: '18 pièces', price: 50 },
      { label: '24 pièces', price: 64 },
      { label: '30 pièces', price: 78 },
    ],
    orderFields: [
      'La quantité souhaitée',
      'Les saveurs sélectionnées',
      'Votre personnalisation ou une photo d’inspiration',
      'La date souhaitée',
    ],
  },
  {
    slug: 'brunch-box',
    href: '/creations/brunch-box/',
    name: 'Brunch box',
    short: 'Dix compositions pour vos matins gourmands',
    image: 'brunch',
    alt: 'Table de brunch avec viennoiseries et fruits',
    intro:
      'Dix compositions mêlant sucré, salé et jus de fruits, préparées sur commande.',
    text: 'Des viennoiseries aux recettes turques d’Anatolia, chaque box réunit sa sélection sucrée, salée et un jus de fruits.',
    possibilities: [
      'Dix compositions au choix',
      'Sucré, salé et jus de fruits',
      'Neuf compositions à 30 € par personne ; Anatolia à 35 € par personne',
    ],
    occasion: 'Brunchs & cadeaux',
    priceSummary: '9 compositions à 30 € / personne. Anatolia à 35 € / personne.',
    priceNote:
      'Toutes nos brunch box sont proposées à 30 € par personne, à l’exception d’Anatolia, à 35 € par personne.',
    tariffs: [
      {
        label: 'Brunch box au choix, hors Anatolia',
        price: 30,
        detail: 'par personne',
      },
      { label: 'Anatolia', price: 35, detail: 'par personne' },
    ],
    orderFields: [
      'La composition choisie',
      'Le nombre de personnes',
      'La date souhaitée',
      'L’heure de retrait',
      'Vos demandes particulières éventuelles',
    ],
  },
  {
    slug: 'buffets',
    href: '/buffets/',
    name: 'Buffets',
    short: 'Une réception, une table sur mesure',
    image: 'buffet-gourmand',
    alt: 'Buffet dressé pour une réception',
    intro:
      'Un buffet sucré, salé ou mixte, composé et dressé pour votre réception.',
    text: 'Nous étudions avec vous la composition, les quantités, le dressage et la décoration. Thème, couleurs et inspirations donnent le ton de votre table.',
    possibilities: [
      'Composition sucrée, salée ou mixte',
      'Sélection et quantités adaptées à vos invités',
      'Mise en place et dressage selon votre projet',
    ],
    occasion: 'Réceptions & événements',
    priceSummary: 'Une prestation sur devis',
    priceNote:
      'Chaque buffet fait l’objet d’un devis personnalisé selon les quantités, les produits sélectionnés et les besoins de mise en place.',
    tariffs: [],
    orderFields: [
      'Le nombre d’invités et de mignardises par personne',
      'La composition : sucrée, salée ou mixte',
      'Le lieu, la date et l’horaire de la réception',
      'Les besoins de mise en place et de dressage',
      'Le thème, les couleurs, la décoration et vos inspirations',
      'Toute demande particulière pour la présentation',
    ],
  },
  {
    slug: 'plateaux',
    href: '/plateaux/',
    name: 'Plateaux',
    short: 'Des compositions à partager',
    image: 'plateau-sale',
    alt: 'Plateau de fromages et charcuterie',
    intro:
      'Fruits, fromages, charcuterie ou crudités : une table à partager.',
    text: 'Choisissez vos plateaux et leurs quantités selon votre réception. Nous échangeons sur le nombre de convives et vos éventuelles restrictions alimentaires.',
    possibilities: [
      'Cinq plateaux au choix',
      'À réunir selon votre table et vos convives',
      'Toutes nos viandes sont halal',
    ],
    occasion: 'Tables & moments à partager',
    priceSummary: 'Cinq plateaux, de 45 à 70 €',
    priceNote:
      'Précisez le nombre de convives et la quantité de chaque plateau lors de votre demande.',
    tariffs: [
      { label: 'Plateau de charcuterie', price: 70 },
      { label: 'Plateau de fromages', price: 70 },
      { label: 'Grazing Platter', price: 60 },
      { label: 'Plateau de fruits frais', price: 50 },
      {
        label: 'Plateau de crudités',
        price: 45,
        detail: 'Houmous, tzatziki et sauce aïoli',
      },
    ],
    orderFields: [
      'Les plateaux souhaités',
      'La quantité de chaque plateau',
      'Le nombre de convives',
      'La date souhaitée',
      'Vos éventuelles restrictions alimentaires',
    ],
  },
];

export const classicFlavorGroups = [
  {
    name: 'Fruits',
    flavors: [
      'Framboise',
      'Fraise',
      'Fruit de la passion',
      'Mangue',
      'Myrtille',
      'Poire',
      'Pomme',
    ],
  },
  {
    name: 'Chocolats',
    flavors: ['Chocolat au lait', 'Chocolat noir', 'Chocolat blanc'],
  },
  {
    name: 'Notes gourmandes',
    flavors: [
      'Pistache',
      'Vanille',
      'Spéculoos',
      'Caramel beurre salé',
      'Croustillant au chocolat praliné',
    ],
  },
];

export const signatureFlavors = [
  {
    name: 'Éclat vert',
    composition: 'Curd citron vert et basilic, framboises fraîches.',
  },
  {
    name: 'Tropical',
    composition: 'Framboises fraîches et coulis mangue-passion.',
  },
  { name: 'Noisette royale', composition: 'Praliné noisette et vanille.' },
  {
    name: 'Douceur acidulée',
    composition: 'Curd citron, framboises fraîches et vanille.',
  },
  {
    name: 'Velours pistache',
    composition:
      'Framboises fraîches, crème de pistache et éclats de pistache.',
  },
  {
    name: 'Douceur d’automne',
    composition: 'Caramel beurre salé, pomme et vanille.',
  },
  {
    name: 'Évasion tropicale',
    composition: 'Mangue fraîche, fruit de la passion frais et vanille.',
  },
  {
    name: 'Praliné royal',
    composition: 'Fraise, vanille et praliné pistache.',
  },
  {
    name: 'Rosée verte',
    composition: 'Curd citron-basilic et fraises fraîches.',
  },
];

export const cupcakeFlavors = [
  'Framboise',
  'Fraise',
  'Fruit de la passion',
  'Mangue & fruit de la passion',
  'Crème de pistache',
  'Fruits rouges',
  'Lemon curd',
  'Nutella',
  'Crème de spéculoos',
  'Caramel beurre salé',
  'Crème de noisette',
];

export const brunchBoxes = [
  {
    name: 'Elegancia',
    price: 30,
    sweet: [
      'Mini-viennoiserie',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella',
    ],
    savory: [
      'Avocado & salmon toast : saumon fumé, avocat, émincés d’oignons rouges et fleur de sel',
      'Tartine tomate & mozzarella au pesto',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Prestige',
    price: 30,
    sweet: [
      'Brioche perdue',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Blini saumon fumé & crème citronnée',
      'Tartine tomate & burrata, mâche et sauce mélasse de grenade',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Le Parisien',
    price: 30,
    sweet: ['Viennoiserie', 'Pain de campagne', 'Beurre & confiture'],
    savory: [
      'Œufs brouillés aux fines herbes',
      'Tartine tomates séchées & cœur de burrata',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Faisalia',
    price: 30,
    sweet: ['Baghrir', 'Msemen', 'Miel & confiture'],
    savory: [
      'Batbout poulet',
      'Omelette à la marocaine',
      'Assortiment d’olives',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Signature',
    price: 30,
    sweet: [
      'Crêpe',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Shrimp toast : crevettes, avocat, tomates cerises et fromage frais',
      'Assortiment de charcuterie',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Brunchetta',
    price: 30,
    sweet: [
      'Granola bowl & fruits rouges',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Toast saumon fumé, concombre, crème citronnée et aneth',
      'Assortiment d’olives',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Dolcezza',
    price: 30,
    sweet: [
      'Granola bowl & fruits rouges',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Chicken toast : caviar d’aubergine, ail, poivron, émincé de poulet et parmesan',
      'Assortiment d’olives',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Amarizia',
    price: 30,
    sweet: [
      'Brioche perdue',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Chicken toast : fromage frais, émincés de poulet marinés, avocat et sauce miel-moutarde',
      'Assortiment de fromages',
    ],
  },
  {
    name: 'Seralia',
    price: 30,
    sweet: [
      'Croissant ou chocolatine',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: ['Egg muffin', 'Bagel saumon fumé', 'Assortiment de fromages'],
  },
  {
    name: 'Anatolia',
    price: 35,
    sweet: [
      'Croissant ou chocolatine',
      'Assortiment de fruits de saison',
      'Confiture ou Nutella au choix',
    ],
    savory: [
      'Sigara böreği : roulés au fromage turc',
      'Gözleme : feuilleté turc, épinard, fromage ou pomme de terre',
      'Menemen : œufs brouillés aux tomates, poivrons et oignons',
      'Assortiment de charcuterie turque',
      'Assortiment d’olives',
      'Assortiment de fromages turcs',
      'Tomate & concombre',
    ],
  },
].map((box) => ({ ...box, drink: 'Jus de fruits : orange ou fraise' }));

export const gallery = [
  {
    image: 'layer-cake',
    label: 'Layer cake aux fruits',
    category: 'cakes',
    categoryLabel: 'Cakes',
    alt: 'Layer cake blanc aux fruits',
  },
  {
    image: 'macarons-ivoire',
    label: 'Macarons ivoire',
    category: 'douceurs',
    categoryLabel: 'Douceurs',
    alt: 'Macarons ivoire disposés sur une table',
  },
  {
    image: 'table-reception',
    label: 'Table de réception',
    category: 'tables',
    categoryLabel: 'Tables',
    alt: 'Table de réception fleurie et desserts',
  },
  {
    image: 'gateau-creme',
    label: 'Gâteau à la crème',
    category: 'cakes',
    categoryLabel: 'Cakes',
    alt: 'Gâteau décoré de volutes de crème',
  },
  {
    image: 'plateau-sale',
    label: 'Plateau salé',
    category: 'tables',
    categoryLabel: 'Tables',
    alt: 'Plateau gourmand salé',
  },
  {
    image: 'macarons-rose',
    label: 'Macarons roses',
    category: 'douceurs',
    categoryLabel: 'Douceurs',
    alt: 'Macarons roses et clairs',
  },
  {
    image: 'brunch',
    label: 'Table de brunch',
    category: 'tables',
    categoryLabel: 'Tables',
    alt: 'Brunch avec fruits et viennoiseries',
  },
  {
    image: 'cupcakes',
    label: 'Cupcakes',
    category: 'douceurs',
    categoryLabel: 'Douceurs',
    alt: 'Cupcakes décorés',
  },
];
