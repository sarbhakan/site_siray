import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import credits from '../../docs/image-credits.json';

const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true },
);
interface MediaOptions { native?: boolean; sourceOriginal?: boolean }
export async function resolveMedia(name: string, options: MediaOptions = {}) {
  const file = name.startsWith('/') ? name : `/images/${name}.webp`;
  const existing = credits.images.find((item) => item.file === file || item.variants.some((variant) => variant.path === file) || ('sourceDelivery' in item && item.sourceDelivery?.path === file));
  if (existing) {
    const delivery = options.sourceOriginal && 'sourceDelivery' in existing ? existing.sourceDelivery : undefined;
    const original = delivery || existing.variants[0];
    return {
      src: delivery?.path || existing.file,
      srcset: options.native || delivery ? undefined : existing.variants.map((item) => `${item.path} ${item.width}w`).join(', '),
      width: original.width, height: original.height,
      sourceType: existing.sourceType, category: existing.category, position: existing.focalPoint,
    };
  }
  const image = uploads[file]?.default;
  if (!image) throw new Error(`Image introuvable : ${file}. Importez la photo depuis l’interface d’édition.`);
  // Uploaded originals stay in Git. Only responsive, metadata-free derivatives reach the website.
  const widths = [...new Set([480, 960, 1600, Math.min(image.width, 2400)].filter((width) => width <= image.width))].sort((a, b) => a - b);
  const variants = await Promise.all(widths.map(async (width) => ({
    width,
    result: await getImage({ src: image, width, format: 'webp', quality: 92 }),
  })));
  const largest = variants.at(-1)!;
  return {
    src: largest.result.src,
    srcset: variants.map(({ width, result }) => `${result.src} ${width}w`).join(', '),
    width: image.width, height: image.height,
    sourceType: 'client', category: undefined, position: '50% 50%',
  };
}
