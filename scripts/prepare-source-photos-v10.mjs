/** Preserve selected supplied JPEGs exactly. Usage: node scripts/prepare-source-photos-v10.mjs --source /path/to/images */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const argument = process.argv.indexOf('--source');
if (argument < 0 || !process.argv[argument + 1]) throw new Error('--source is required');
const source = path.resolve(process.argv[argument + 1]);
const registryPath = 'docs/image-credits.json';
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const ids = ['layer-rouge', 'plateau-fruits', 'cupcakes-fleurs', 'layer-journal', 'bento-fleurs', 'mignardises-hotdog', 'buffet-ensemble', 'brunch-toasts', 'plateau-grazing'];
const deliveries = [];
for (const id of ids) {
  const entry = registry.images.find((image) => image.id === id);
  if (!entry || entry.sourceType !== 'client') throw new Error(`Client image required: ${id}`);
  const bytes = await readFile(path.join(source, entry.original.folder, entry.original.file));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== entry.original.sha256) throw new Error(`Source has changed: ${id}`);
  const metadata = await sharp(bytes).metadata();
  if (metadata.format !== 'jpeg' || metadata.exif || metadata.icc || metadata.xmp || metadata.iptc || metadata.orientation) {
    throw new Error(`Source requires metadata review before exact delivery: ${id}`);
  }
  const file = `/images/siray-${id}-source-${sha256.slice(0, 8)}.jpg`;
  await writeFile(path.join('public', file), bytes);
  entry.sourceDelivery = { path: file, width: metadata.width, height: metadata.height, bytes: bytes.length, sha256, format: 'jpeg', identicalOriginal: true, metadata: 'absent in supplied source' };
  deliveries.push({ id, ...entry.sourceDelivery });
}
registry.transforms = 'Variantes WebP V8/V9 conservées pour les fiches et la galerie. V10 : neuf JPEG fournis, identiques octet par octet aux sources sans métadonnées, pour le diaporama et les cartes de l’accueil. Aucun agrandissement ni réencodage de ces JPEG ; cadrage de présentation par CSS.';
await writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n');
const summary = { deliveries, totalBytes: deliveries.reduce((sum, image) => sum + image.bytes, 0), additionalCompression: false, webpVariantsUnchanged: true };
await writeFile('docs/qa/v10-image-delivery.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ count: deliveries.length, totalBytes: summary.totalBytes, sourceBytesPreserved: true }));
