import credits from '../../docs/image-credits.json';

export interface PhotoRef { image: string; alt: string }

export function photo(id: string): PhotoRef {
  const entry = credits.images.find((item) => item.id === id);
  if (!entry) throw new Error(`Photographie inconnue : ${id}`);
  return { image: entry.file.replace('/images/', '').replace('.webp', ''), alt: entry.alt };
}

export const collectionPhotography: Record<string, { cover: PhotoRef; detail: PhotoRef; request: PhotoRef }> = {
  'layer-cakes': { cover: photo('layer-fruits'), detail: photo('layer-rouge'), request: photo('layer-etages') },
  'bento-cakes': { cover: photo('bento-rubans'), detail: photo('bento-vert'), request: photo('bento-coffrets') },
  mignardises: { cover: photo('mignardises-toasts'), detail: photo('mignardises-assortiment'), request: photo('mignardises-burger') },
  cupcakes: { cover: photo('cupcakes-fleurs'), detail: photo('cupcake-presentoir'), request: photo('cupcakes-coffret') },
  'brunch-box': { cover: photo('brunch-toasts'), detail: photo('brunch-douceurs'), request: photo('brunch-partage') },
  buffets: { cover: photo('buffet-ensemble'), detail: photo('buffet-desserts'), request: photo('buffet-sale') },
  plateaux: { cover: photo('plateau-grazing'), detail: photo('plateau-fruits'), request: photo('plateau-fromages') },
};

const heroPositions: Record<string, string> = { 'layer-roses': '50% 40%', 'bento-fleurs': '50% 40%', 'brunch-partage': '50% 60%', 'buffet-sale': '50% 80%', 'plateau-charcuterie': '50% 85%' };
export const homeSlides = Object.entries(heroPositions).map(([id, position]) => ({ ...photo(id), position }));
export const homePhotos = {
  maison: photo('layer-etages'),
  cakes: photo('layer-coquillages'),
  tables: photo('brunch-douceurs'),
};

export const galleryFilters = [
  { id: 'all', label: 'Tout voir' },
  { id: 'layer-cakes', label: 'Layer cakes' },
  { id: 'bento-cakes', label: 'Bento cakes' },
  { id: 'mignardises', label: 'Mignardises' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'brunch-box', label: 'Brunch box' },
  { id: 'buffets', label: 'Buffets' },
  { id: 'plateaux', label: 'Plateaux' },
];

// An editorial sequence across the seven families; each filter preserves its order.
const galleryOrder = [
  'layer-roses', 'brunch-toasts', 'bento-rubans', 'plateau-fruits',
  'cupcakes-fleurs', 'buffet-ensemble', 'mignardises-toasts',
  'layer-fruits', 'plateau-grazing', 'bento-vert', 'brunch-douceurs',
  'layer-rouge', 'cupcake-presentoir', 'buffet-desserts', 'mignardises-assortiment',
  'layer-coquillages', 'plateau-charcuterie', 'bento-coffrets', 'brunch-partage',
  'cupcakes-coffret', 'buffet-sale', 'layer-etages', 'plateau-fromages',
  'mignardises-burger', 'bento-fleurs', 'layer-fleurs',
];
export const galleryPhotos = galleryOrder.map((id) => {
  const entry = credits.images.find((item) => item.id === id);
  if (!entry || entry.sourceType !== 'client') throw new Error(`Réalisation attendue : ${id}`);
  return {
    ...photo(id),
    label: 'galleryLabel' in entry ? String(entry.galleryLabel) : '',
    category: entry.category,
    categoryLabel: galleryFilters.find((filter) => filter.id === entry.category)?.label || '',
  };
});
