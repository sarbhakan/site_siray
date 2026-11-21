import credits from '../../docs/image-credits.json';
import photography from '../content/photography.json';
import { validatePhotoZoom } from '../lib/photo-crop';

export interface PhotoRef { image: string; alt: string; position?: string; zoom?: number }
interface EditablePhoto { file: string; alt: string; position?: string; zoom?: number }

function editablePhoto(value: EditablePhoto): PhotoRef {
  if (!value.file || !value.alt.trim()) throw new Error('Chaque photographie doit avoir un fichier et une description.');
  const zoom = validatePhotoZoom(value.zoom);
  return { image: value.file, alt: value.alt, position: value.position, zoom };
}

// Fixed ingredient illustrations still use their licensed registry entries.
export function photo(id: string): PhotoRef {
  const entry = credits.images.find((item) => item.id === id);
  if (!entry) throw new Error(`Photographie inconnue : ${id}`);
  return { image: entry.file, alt: entry.alt, position: entry.focalPoint };
}

export const collectionPhotography: Record<string, { cover: PhotoRef; detail: PhotoRef; request: PhotoRef }> = Object.fromEntries(
  photography.collections.map((item) => [item.slug, {
    cover: editablePhoto(item.cover), detail: editablePhoto(item.detail), request: editablePhoto(item.request),
  }]),
);
export const homeCollectionPhotography: Record<string, PhotoRef> = Object.fromEntries(
  photography.collections.map((item) => [item.slug, editablePhoto(item.home)]),
);
export const homeSlides = photography.homeSlides.map(editablePhoto);
export const homePhotos = Object.fromEntries(
  Object.entries(photography.homePhotos).map(([key, value]) => [key, editablePhoto(value)]),
);
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
export const galleryPhotos = photography.gallery.map((item) => {
  const categoryLabel = galleryFilters.find((filter) => filter.id === item.category && filter.id !== 'all')?.label;
  if (!categoryLabel) throw new Error(`Catégorie de galerie inconnue : ${item.category}`);
  return { ...editablePhoto(item), label: item.label, category: item.category, categoryLabel };
});
