import catalog from '../content/catalog.json';
import photography from '../content/photography.json';
import pages from '../content/pages.json';
import { buildCatalogData, countInFrench, capitalize } from '../data/site';
import { galleryFilters, visibleGalleryItems, type EditableGalleryPhoto } from '../data/photography';

export type DraftKind = 'photos' | 'catalogue' | 'pages';
type PreviewPhotography = Omit<typeof photography, 'gallery'> & { gallery: EditableGalleryPhoto[] };
export type PreviewDrafts = { photos: PreviewPhotography; catalogue: typeof catalog; pages: typeof pages };
export const baselineDrafts: PreviewDrafts = { photos: photography, catalogue: catalog, pages };
const money = (value: number) => new Intl.NumberFormat('fr-FR', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(value);

/** Same catalogue derivation as the public build; only UI labels are added here. */
export function previewModel(drafts: PreviewDrafts) {
  const built = buildCatalogData(drafts.catalogue);
  const visibleGallery = visibleGalleryItems(drafts.photos.gallery);
  const priceGroups = built.brunchPriceGroups.map((group) => ({ ...group, pricePerPerson: `${money(group.price)} / personne` }));
  const collections = built.collections.map((item) => {
    const classic = ['layer-cakes', 'bento-cakes'].includes(item.slug);
    const brunch = item.slug === 'brunch-box';
    const cupcakes = item.slug === 'cupcakes';
    const flavorGroups = cupcakes ? built.cupcakeFlavorGroups : built.classicFlavorGroups;
    const flavorCount = flavorGroups.reduce((total, group) => total + group.flavors.length, 0);
    const firstPanel = brunch ? 'compositions' : 'formats';
    const formatLabel = brunch ? 'Les compositions' : classic ? 'Format & décor' : item.slug === 'buffets' ? 'La prestation' : 'Formats & tarifs';
    const extraSections = (item.extraSections || []).map((section, index) => ({ ...section, panelId: `extra-${index}`, headingId: `extra-heading-${index}` }));
    const previewTabs = [
      { id: firstPanel, label: formatLabel },
      ...(classic || cupcakes ? [{ id: 'saveurs', label: classic ? 'Saveurs classiques' : 'Les saveurs' }] : []),
      ...(item.slug === 'layer-cakes' ? [{ id: 'signatures', label: 'Associations Signature' }] : []),
      ...(item.slug === 'mignardises' ? [{ id: 'les-bouchees', label: 'Les bouchées' }] : []),
      ...extraSections.map((section) => ({ id: section.panelId, label: section.title })),
      { id: 'votre-demande', label: item.slug === 'buffets' ? 'Demander un devis' : 'Préparer ma demande' },
    ].map((tab) => ({ ...tab, buttonId: `volet-${tab.id}` }));
    return {
      ...item, extraSections, previewTabs, flavorGroups,
      previewPossibilities: item.possibilities.map((text) => ({ text })),
      flavorHeading: `${capitalize(countInFrench(flavorCount))} ${flavorCount === 1 ? 'saveur' : 'saveurs'} ${cupcakes ? 'à découvrir' : flavorCount === 1 ? 'classique' : 'classiques'}`,
      tariffs: item.tariffs.map((tariff) => ({ ...tariff, priceLabel: money(tariff.price), previewDescription: tariff.description || tariff.detail || '' })),
    };
  });
  return {
    catalog: {
      ...drafts.catalogue, ...built, collections, brunchPriceGroups: priceGroups,
      brunchHeading: `${capitalize(countInFrench(built.brunchBoxes.length))} ${built.brunchBoxes.length === 1 ? 'brunch' : 'brunchs'} au choix`,
      brunchBoxes: built.brunchBoxes.map((box, index) => ({ ...box, index, headingId: `brunch-${index}`, priceLabel: money(box.price), optionLabel: `${box.name} — ${money(box.price)} / personne` })),
      buffetServiceSteps: built.buffetServiceSteps.map((step, index) => ({ ...step, number: index + 1 })),
      signatureHeading: `${capitalize(countInFrench(built.signatureFlavors.length))} ${built.signatureFlavors.length === 1 ? 'composition réservée' : 'compositions réservées'} aux layer cakes.`,
    },
    photography: {
      ...drafts.photos,
      galleryEmpty: visibleGallery.length === 0,
      gallery: visibleGallery.map((photo) => ({ ...photo, categoryLabel: galleryFilters.find((filter) => filter.id === photo.category)?.label || photo.category })),
    },
    pages: drafts.pages,
  };
}

/** Paths are application-authored, never interpreted as JavaScript or HTML. */
export function previewValue(model: unknown, path: string, context?: unknown): unknown {
  if (path === '.') return context;
  const relative = path.startsWith('.');
  const parts = (relative ? path.slice(1) : path).split('.');
  let value: unknown = relative ? context : model;
  for (const part of parts) {
    if (!part || ['__proto__', 'prototype', 'constructor'].includes(part)) return undefined;
    if (Array.isArray(value) && !/^\d+$/.test(part)) value = value.find((entry) => entry && typeof entry === 'object' && entry.slug === part);
    else if (value && typeof value === 'object') value = (value as Record<string, unknown>)[part];
    else return undefined;
  }
  return value;
}

export function safePreviewURL(value: unknown, origin: string, image = false): string | undefined {
  if (typeof value !== 'string' || !value || /[\u0000-\u0020\u007f-\u009f\\]/u.test(value) || value.startsWith('//')) return undefined;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return undefined; }
  if (/[\u0000-\u001f\u007f-\u009f\\]/u.test(decoded)) return undefined;
  try {
    const url = new URL(value, origin);
    if (url.username || url.password) return undefined;
    if (image && url.protocol === 'blob:' && url.origin === origin) return url.href;
    if (value.startsWith('/') && url.origin === origin) return url.href;
    if (url.protocol === 'https:') return url.href;
  } catch { /* Leave the current image unchanged if the file is incomplete. */ }
  return undefined;
}


/** A draft is accepted only from the editor that opened this exact frame. */
export function readPreviewMessage(event: { source: unknown; origin: string; data: unknown }, trustedParent: unknown, origin: string, nonce: string) {
  if (event.source !== trustedParent || event.origin !== origin || !event.data || typeof event.data !== 'object') return undefined;
  const message = event.data as Record<string, unknown>;
  if (message.type !== 'siray-preview-draft' || message.nonce !== nonce) return undefined;
  const payload = message.payload;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return undefined;
  const { kind, data, assets } = payload as Record<string, unknown>;
  if (!['photos', 'catalogue', 'pages'].includes(String(kind)) || !data || typeof data !== 'object' || Array.isArray(data)) return undefined;
  return { kind: kind as DraftKind, data, assets };
}
