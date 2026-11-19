/** Rebuild only the V9 assets from supplied originals. Usage: node scripts/refine-photos-v9.mjs --source /path/to/images */
import sharp from 'sharp';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const sourceIndex = process.argv.indexOf('--source');
if (sourceIndex < 0 || !process.argv[sourceIndex + 1]) throw new Error('--source is required');
const source = path.resolve(process.argv[sourceIndex + 1]);
const registryPath = 'docs/image-credits.json';
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const heroIds = ['layer-roses', 'bento-fleurs', 'brunch-partage', 'buffet-sale', 'plateau-charcuterie'];
const additions = [
  { id: 'layer-journal', category: 'layer-cakes', folder: 'layer cakes', file: '9.jpeg', alt: 'Layer cake ivoire et framboises présenté sur des journaux Siray Signature', label: 'Framboises & papier journal', crop: { left: 0, top: 680, width: 1152, height: 922 } },
  { id: 'mignardises-hotdog', category: 'mignardises', folder: 'miniardises', file: '5.jpeg', alt: 'Mini hot-dog tenu par une main gantée devant un assortiment de mignardises', label: 'Mini hot-dog', crop: { left: 0, top: 304, width: 1152, height: 1440 } },
];
const template = registry.images.find((p) => p.sourceType === 'client');
for (const entry of additions) {
  if (registry.images.some((p) => p.id === entry.id)) continue;
  registry.images.push({ ...template, id: entry.id, category: entry.category, alt: entry.alt, galleryLabel: entry.label, focalPoint: '50% 50%', usageNote: 'Photo fournie, cadrage technique V9 sans retouche créative.', original: { folder: entry.folder, file: entry.file }, transform: { ...template.transform, crop: entry.crop }, variants: [] });
}
const changed = [];
for (const id of [...heroIds, ...additions.map((p) => p.id)]) {
  const entry = registry.images.find((p) => p.id === id);
  const bytes = await readFile(path.join(source, entry.original.folder, entry.original.file));
  const metadata = await sharp(bytes).metadata();
  const crop = entry.transform.crop;
  let pipeline = sharp(bytes).rotate().toColourspace('srgb');
  if (crop) pipeline = pipeline.extract(crop);
  const nativeWidth = crop?.width || metadata.width;
  const widths = [...new Set([nativeWidth, 720, 360].filter((w) => w <= nativeWidth))];
  const encoded = [];
  for (const width of widths) {
    const result = await pipeline.clone().resize({ width, withoutEnlargement: true }).webp({ quality: width === nativeWidth ? 94 : 88, effort: 6 }).toBuffer({ resolveWithObject: true });
    encoded.push(result);
  }
  const digest = createHash('sha256').update(encoded[0].data).digest('hex').slice(0, 8);
  const basename = `siray-${id}-${digest}`;
  const variants = [];
  for (const [index, result] of encoded.entries()) {
    const file = `/images/${basename}${index ? `-${result.info.width}` : ''}.webp`;
    await writeFile(path.join('public', file), result.data);
    variants.push({ path: file, width: result.info.width, height: result.info.height, bytes: result.data.length });
  }
  const previous = entry.variants;
  entry.variants = variants;
  entry.file = variants[0].path;
  entry.original = { ...entry.original, width: metadata.width, height: metadata.height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
  entry.transform = { ...entry.transform, quality: 94, responsiveQuality: 88, upscaled: false };
  for (const old of previous) if (!variants.some((v) => v.path === old.path)) await unlink(path.join('public', old.path));
  changed.push({ id, original: `${entry.original.folder}/${entry.original.file}`, variants, crop });
}
registry.transforms = 'Orientation, cadrage technique, sRGB, WebP sans agrandissement. V9 : diaporama et deux nouveaux cadrages qualité94 à largeur native, variantes88 ; autres assets V8 conservés. Métadonnées retirées.';
await writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n');
const summary = { changed, clientPhotos: registry.images.filter((p) => p.sourceType === 'client').length, totalBytes: registry.images.flatMap((p) => p.variants).reduce((n, v) => n + v.bytes, 0), heroNativeBytes: registry.images.filter((p) => heroIds.includes(p.id)).map((p) => ({ id: p.id, bytes: p.variants[0].bytes })) };
await writeFile('docs/qa/v9-image-optimization.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary));
