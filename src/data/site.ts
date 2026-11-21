import catalog from '../content/catalog.json';
import { collectionPhotography, galleryPhotos } from './photography';

export const instagram = 'https://www.instagram.com/siraysignature/';
export const brand = 'Siray Signature';

export interface Tariff {
  label: string;
  price: number;
  detail?: string;
  description?: string;
}

export interface ExtraSection {
  title: string;
  text: string;
  items?: string[];
  button?: { label: string; href: string };
}

export interface Collection {
  slug: string;
  href: string;
  name: string;
  short: string;
  image: string;
  alt: string;
  position?: string;
  zoom?: number;
  intro: string;
  text: string;
  possibilities: string[];
  occasion: string;
  priceSummary: string;
  priceNote: string;
  panelNote: string;
  tariffs: Tariff[];
  orderFields: string[];
  extraSections?: ExtraSection[];
}

/** Plain text only: Astro escapes these values when rendering a custom section. */
export function validateExtraSections(value: unknown, collectionName = 'prestation'): ExtraSection[] {
  const invalid = (field: string): never => {
    throw new Error(`Rubrique personnalisée invalide (${collectionName}) : ${field}.`);
  };
  const object = (entry: unknown): entry is Record<string, unknown> =>
    entry !== null && typeof entry === 'object' && !Array.isArray(entry);
  const text = (entry: unknown, field: string, maximum: number): string => {
    if (typeof entry !== 'string' || !entry.trim() || entry.length > maximum) invalid(field);
    return (entry as string).trim();
  };
  const safeHref = (entry: unknown): string => {
    if (typeof entry === 'string' && /[\u0000-\u001f\u007f-\u009f]/u.test(entry)) invalid('lien du bouton');
    const href = text(entry, 'lien du bouton', 2048);
    // Reject controls before URL parsing, which would silently strip some of them.
    if (/[\u0000-\u0020\u007f-\u009f\\]/u.test(href)) invalid('lien du bouton');
    let decoded: string;
    try { decoded = decodeURIComponent(href); } catch { return invalid('lien du bouton'); }
    if (/[\u0000-\u001f\u007f-\u009f\\]/u.test(decoded)) invalid('lien du bouton');
    const internal = href.startsWith('/') && !href.startsWith('//');
    if (!internal && !/^https:\/\//iu.test(href)) invalid('lien du bouton');
    let url: URL;
    try { url = new URL(href, 'https://siraysignature.fr'); } catch { return invalid('lien du bouton'); }
    if (url.protocol !== 'https:' || url.username || url.password) invalid('lien du bouton');
    if (internal && url.origin !== 'https://siraysignature.fr') invalid('lien du bouton');
    return internal ? href : url.href;
  };
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 12) invalid('12 rubriques au maximum');
  return (value as unknown[]).map((entry, index) => {
    if (!object(entry)) return invalid(`rubrique ${index + 1}`);
    const section: ExtraSection = {
      title: text(entry.title, `titre de la rubrique ${index + 1}`, 120),
      text: text(entry.text, `texte de la rubrique ${index + 1}`, 4000),
    };
    if (entry.items !== undefined && entry.items !== null) {
      if (!Array.isArray(entry.items) || entry.items.length > 12) invalid(`liste de la rubrique ${index + 1}`);
      section.items = (entry.items as unknown[]).map((item) => text(item, `élément de la rubrique ${index + 1}`, 300));
    }
    if (entry.button !== undefined && entry.button !== null) {
      if (!object(entry.button)) return invalid(`bouton de la rubrique ${index + 1}`);
      const { label, href } = entry.button;
      if (typeof href === 'string' && /[\u0000-\u001f\u007f-\u009f]/u.test(href)) invalid('lien du bouton');
      const blank = (part: unknown) => part === undefined || part === null || (typeof part === 'string' && !part.trim());
      if (!blank(label) || !blank(href)) {
        section.button = { label: text(label, 'libellé du bouton', 80), href: safeHref(href) };
      }
    }
    return section;
  });
}

// Routes belong to the application. Editing a label in the CMS never changes its URL.
const collectionRoutes: Record<string, string> = {
  'layer-cakes': '/creations/layer-cakes/',
  'bento-cakes': '/creations/bento-cakes/',
  mignardises: '/creations/mignardises/',
  cupcakes: '/creations/cupcakes/',
  'brunch-box': '/creations/brunch-box/',
  buffets: '/buffets/',
  plateaux: '/plateaux/',
};

const smallNumbers = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept',
  'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
export const countInFrench = (count: number) => smallNumbers[count] ?? String(count);
export const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('fr-FR') + text.slice(1);
const amount = (value: number) => new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(value).replace(/\u00a0|\u202f/g, ' ');
const euro = (value: number) => `${amount(value)} €`;

function validatePrice(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Tarif invalide dans le catalogue : ${label}.`);
  }
}

export const buffetServiceSteps = catalog.buffetServiceSteps;
export const classicFlavorGroups = catalog.classicFlavorGroups;
export const signatureFlavors = catalog.signatureFlavors;
export const cupcakeFlavors = catalog.cupcakeFlavors.map((flavor) => flavor.name);
const flavorFamilies = [
  { id: 'fruits', name: 'Fruits' },
  { id: 'chocolats', name: 'Chocolats' },
  { id: 'notes-gourmandes', name: 'Notes gourmandes' },
];
for (const flavor of catalog.cupcakeFlavors) {
  if (!flavorFamilies.some((family) => family.id === flavor.family)) {
    throw new Error(`Famille de saveur de cupcake inconnue : ${flavor.family}.`);
  }
}
export const cupcakeFlavorGroups = flavorFamilies.map((family) => ({
  name: family.name,
  flavors: catalog.cupcakeFlavors.filter((flavor) => flavor.family === family.id).map((flavor) => flavor.name),
}));
export const brunchBoxes = catalog.brunchBoxes;
export const mignardiseMenu = catalog.mignardiseMenu;

for (const box of brunchBoxes) validatePrice(box.price, box.name);
if (!brunchBoxes.length) throw new Error('Le catalogue doit contenir au moins une composition de brunch.');

// A brunch price is entered once, on its composition. Every price summary uses it.
const groupedBrunches = new Map<number, typeof brunchBoxes>();
for (const box of brunchBoxes) {
  const group = groupedBrunches.get(box.price) ?? [];
  group.push(box);
  groupedBrunches.set(box.price, group);
}
export const brunchPriceGroups = Array.from(groupedBrunches, ([price, boxes]) => ({
  price,
  count: boxes.length,
  names: boxes.map((box) => box.name),
  label: boxes.length === 1 ? boxes[0].name : `${boxes.length} compositions`,
})).sort((a, b) => b.count - a.count);
const brunchSummary = brunchPriceGroups.map((group) => `${group.label} à ${euro(group.price)} / personne`).join('. ') + '.';
const brunchPossibility = brunchPriceGroups.map((group) => `${group.count === 1 ? group.names[0] : `${capitalize(countInFrench(group.count))} compositions`} à ${euro(group.price)} par personne`).join(' ; ');
const [mainBrunchPrice, specialBrunchPrice] = brunchPriceGroups;
const brunchPriceNote = brunchPriceGroups.length === 1
  ? `Toutes nos brunch box sont proposées à ${euro(mainBrunchPrice.price)} par personne.`
  : brunchPriceGroups.length === 2 && specialBrunchPrice.count === 1
    ? `Toutes nos brunch box sont proposées à ${euro(mainBrunchPrice.price)} par personne, à l’exception ${/^[aàâäeéèêëiîïoôöuùûüyh]/i.test(specialBrunchPrice.names[0]) ? 'd’' : 'de '}${specialBrunchPrice.names[0]}, à ${euro(specialBrunchPrice.price)} par personne.`
    : brunchPriceGroups.map((group) => `${group.label} à ${euro(group.price)} par personne`).join('. ') + '.';
const brunchTariffs: Tariff[] = brunchPriceGroups.map((group) => ({
  label: group.count === 1 ? group.names[0] : brunchPriceGroups.length === 1
    ? 'Brunch box au choix'
    : `Brunch box au choix, hors ${brunchPriceGroups.filter((other) => other !== group).flatMap((other) => other.names).join(', ')}`,
  price: group.price,
  detail: 'par personne',
}));

const seenSlugs = new Set<string>();
export const collections: Collection[] = catalog.collections.map((content) => {
  const href = collectionRoutes[content.slug];
  if (!href || seenSlugs.has(content.slug)) throw new Error(`Prestation inconnue ou en double : ${content.slug}.`);
  seenSlugs.add(content.slug);
  const tariffs: Tariff[] = content.slug === 'brunch-box' ? brunchTariffs : content.tariffs ?? [];
  for (const tariff of tariffs) validatePrice(tariff.price, `${content.name} / ${tariff.label}`);
  const priceNote = content.slug === 'brunch-box' ? brunchPriceNote : content.priceNote ?? '';
  const extraSections = validateExtraSections((content as { extraSections?: unknown }).extraSections, content.name);
  let priceSummary = content.priceSummary ?? '';
  if (content.slug === 'mignardises' || content.slug === 'cupcakes') {
    if (!tariffs.length) throw new Error(`Au moins un tarif est nécessaire pour ${content.name}.`);
    const first = tariffs[0];
    priceSummary = `${content.slug === 'cupcakes' ? first.label.replace(/pièces?/u, 'cupcakes') : first.label} · ${euro(first.price)}`;
  } else if (content.slug === 'plateaux') {
    if (!tariffs.length) throw new Error('Au moins un tarif de plateau est nécessaire.');
    const prices = tariffs.map((tariff) => tariff.price);
    const minimum = Math.min(...prices);
    const maximum = Math.max(...prices);
    priceSummary = `${capitalize(countInFrench(tariffs.length))} ${tariffs.length === 1 ? 'plateau' : 'plateaux'}, ${minimum === maximum ? `à ${euro(minimum)}` : `de ${amount(minimum)} à ${euro(maximum)}`}`;
  } else if (content.slug === 'brunch-box') {
    priceSummary = brunchSummary;
  }
  return {
    ...content,
    ...collectionPhotography[content.slug].cover,
    href,
    tariffs,
    extraSections,
    priceSummary,
    priceNote,
    panelNote: content.panelNote || priceNote,
    possibilities: content.slug === 'brunch-box'
      ? [`${capitalize(countInFrench(brunchBoxes.length))} compositions au choix`, ...content.possibilities, brunchPossibility]
      : content.possibilities,
  };
});
if (seenSlugs.size !== Object.keys(collectionRoutes).length) {
  throw new Error('Les sept prestations doivent rester présentes dans le catalogue.');
}

export const gallery = galleryPhotos;
