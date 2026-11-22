/** Check the files needed by editable photographs before Astro prepares the site. */
import { lstat, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../', import.meta.url));
const uploadPattern = /^\/src\/assets\/uploads\/[^/\\%?#\u0000-\u001f]+\.(?:jpg|jpeg|JPG|JPEG|png|PNG|webp|WEBP|avif|AVIF)$/u;

function references(data) {
  const found = [];
  const add = (photo, location, gallery = false) => {
    const label = typeof photo?.label === 'string' && photo.label.trim() ? ` « ${photo.label.trim()} »` : '';
    if (gallery && photo?.trashed !== undefined && typeof photo.trashed !== 'boolean') {
      throw new Error(`${location}${label} : le statut de corbeille doit être vrai ou faux. Vérifiez cette photo dans Photographies avant de publier.`);
    }
    found.push({ file: photo?.file, location: `${location}${label}`, active: !gallery || photo?.trashed !== true });
  };
  if (!Array.isArray(data?.homeSlides) || !Array.isArray(data?.collections)
    || !data?.homePhotos || typeof data.homePhotos !== 'object' || Array.isArray(data.homePhotos)
    || !Array.isArray(data?.gallery)) {
    throw new Error('Les emplacements photographiques sont incomplets. Vérifiez Photographies avant de publier.');
  }
  data.homeSlides.forEach((photo, i) => add(photo, `Diaporama de l’accueil, photo ${i + 1}`));
  Object.entries(data.homePhotos).forEach(([name, photo]) => add(photo, `Accueil et maison, ${name}`));
  data.collections.forEach((collection, i) => {
    const names = { cover: 'grande photo', detail: 'petite photo', request: 'à découvrir', home: 'carte de l’accueil' };
    Object.entries(names).forEach(([key, label]) => add(collection?.[key], `${collection?.slug || `Prestation ${i + 1}`}, ${label}`));
  });
  data.gallery.forEach((photo, i) => add(photo, `Galerie, photo ${i + 1}`, true));
  return found;
}

/** Public /images paths and upload paths never escape their fixed local directory. */
function localPath(root, path, folder) {
  if (typeof path !== 'string' || !path.startsWith(folder)
    || /[\\%?#\u0000-\u001f]/u.test(path) || path.split('/').some(part => part === '.' || part === '..')) return null;
  const tail = path.slice(folder.length);
  if (!tail || tail.includes('/')) return null;
  return resolve(root, folder === '/images/' ? 'public/images' : 'src/assets/uploads', tail);
}

/** Checking the directory listing catches case mismatches on a Mac before Linux deployment. */
async function exactFile(path) {
  const directory = dirname(path);
  const filename = path.slice(directory.length + 1);
  try {
    if (!(await readdir(directory)).includes(filename)) return false;
    return (await lstat(path)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
  }
}

export async function validateMediaReferences({ root = defaultRoot } = {}) {
  const photography = JSON.parse(await readFile(resolve(root, 'src/content/photography.json'), 'utf8'));
  const credits = JSON.parse(await readFile(resolve(root, 'docs/image-credits.json'), 'utf8'));
  const photos = references(photography);
  const failures = [];
  const checked = new Map();
  const registry = new Map();
  for (const image of credits.images) {
    const paths = [image.file, ...(image.variants || []).map(variant => variant.path), image.sourceDelivery?.path].filter(Boolean);
    for (const path of paths) if (!registry.has(path)) registry.set(path, paths);
  }

  for (const { file, location, active } of photos) {
    if (typeof file !== 'string' || !file.trim()) {
      failures.push(`${location} : choisissez une photo avant d’enregistrer.`);
      continue;
    }
    // Same shorthand as src/lib/media.ts, retained for existing source references.
    const path = file.startsWith('/') ? file : `/images/${file}.webp`;
    const deliveries = registry.get(path);
    let files;
    if (deliveries) files = deliveries.map(delivery => ({ path: delivery, local: localPath(root, delivery, '/images/') }));
    else if (uploadPattern.test(path)) files = [{ path, local: localPath(root, path, '/src/assets/uploads/') }];
    else {
      failures.push(`${location} : la photo « ${file} » n’est pas un fichier importé ou une image connue du site. Choisissez-la de nouveau dans la bibliothèque.`);
      continue;
    }
    // A gallery-only trash item is not rendered or resolved by Astro. Keep its
    // path valid, but an old missing archive file must not block the live site.
    // Restoring it, or using the same file on any page, makes it active again.
    if (!active) continue;
    for (const delivery of files) {
      if (!checked.has(delivery.path)) checked.set(delivery.path, !!delivery.local && await exactFile(delivery.local));
      if (!checked.get(delivery.path)) {
        failures.push(`${location} : fichier introuvable « ${delivery.path} ». Cette photo est encore utilisée. Restaurez son fichier ou choisissez une autre photo dans cet emplacement, puis enregistrez.`);
      }
    }
  }
  if (failures.length) {
    throw new Error(`La publication est arrêtée pour préserver les photos du site :\n${failures.map(message => `- ${message}`).join('\n')}`);
  }
  return { references: photos.length, files: checked.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await validateMediaReferences();
    console.log(`Photographies vérifiées : ${result.references} emplacements, ${result.files} fichiers présents.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
