import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import { validateMediaReferences } from '../validate-media-references.mjs';

async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), 'siray-media-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await Promise.all(['src/content', 'src/assets/uploads', 'public/images', 'docs'].map(path => mkdir(resolve(root, path), { recursive: true })));
  const photo = () => ({ file: '/src/assets/uploads/cake.webp', label: 'Gâteau aux fleurs' });
  const photography = { homeSlides: [photo()], homePhotos: { maison: photo() },
    collections: [{ slug: 'layer-cakes', ...Object.fromEntries(['cover', 'detail', 'request', 'home'].map(key => [key, photo()])) }],
    gallery: [photo()] };
  const credits = { images: [{ file: '/images/known.webp', variants: [{ path: '/images/known.webp' }, { path: '/images/known-360.webp' }], sourceDelivery: { path: '/images/known-source.jpg' } }] };
  await Promise.all(['src/assets/uploads/cake.webp', 'public/images/known.webp', 'public/images/known-360.webp', 'public/images/known-source.jpg'].map(path => writeFile(resolve(root, path), 'fixture')));
  const save = () => Promise.all([
    writeFile(resolve(root, 'src/content/photography.json'), JSON.stringify(photography)),
    writeFile(resolve(root, 'docs/image-credits.json'), JSON.stringify(credits)),
  ]);
  await save();
  return { root, photography, credits, save };
}

test('all editable placements validate without changing source data or files', async t => {
  const { root, photography } = await fixture(t);
  const before = await readFile(resolve(root, 'src/content/photography.json'), 'utf8');
  assert.deepEqual(await validateMediaReferences({ root }), { references: 7, files: 1 });
  assert.equal(await readFile(resolve(root, 'src/content/photography.json'), 'utf8'), before);
  assert.equal(JSON.parse(before).gallery[0].label, photography.gallery[0].label);
});

test('deleting a photograph still used only in the gallery reports its exact caption and remedy', async t => {
  const { root, photography, save } = await fixture(t);
  photography.gallery.push({ file: '/src/assets/uploads/vintage.webp', label: 'Layer cake vintage' });
  await writeFile(resolve(root, 'src/assets/uploads/vintage.webp'), 'photo');
  await save();
  await validateMediaReferences({ root });
  await unlink(resolve(root, 'src/assets/uploads/vintage.webp'));
  await assert.rejects(validateMediaReferences({ root }), error => {
    assert.match(error.message, /Galerie, photo 2 « Layer cake vintage »/u);
    assert.match(error.message, /\/src\/assets\/uploads\/vintage.webp/u);
    assert.match(error.message, /Restaurez son fichier ou choisissez une autre photo/u);
    return true;
  });
});

test('missing files are caught in every photo placement, including hidden collapsed CMS fields', async t => {
  const { root, photography, save } = await fixture(t);
  const places = [photography.homeSlides[0], photography.homePhotos.maison,
    ...['cover', 'detail', 'request', 'home'].map(key => photography.collections[0][key]), photography.gallery[0]];
  for (const place of places) {
    place.file = '/src/assets/uploads/missing.webp';
    await save();
    await assert.rejects(validateMediaReferences({ root }), /fichier introuvable/u);
    place.file = '/src/assets/uploads/cake.webp';
  }
});

test('registry photos require their responsive variants and approved source deliveries', async t => {
  const { root, photography, save } = await fixture(t);
  photography.homeSlides[0].file = 'known';
  await save();
  assert.deepEqual(await validateMediaReferences({ root }), { references: 7, files: 4 });
  for (const filename of ['known-360.webp', 'known-source.jpg']) {
    await unlink(resolve(root, 'public/images', filename));
    await assert.rejects(validateMediaReferences({ root }), new RegExp(filename.replace('.', '\\.')));
    await writeFile(resolve(root, 'public/images', filename), 'restored');
  }
});

test('unknown public files and unsupported upload formats fail before the Astro build', async t => {
  const { root, photography, save } = await fixture(t);
  await writeFile(resolve(root, 'public/images/unknown.webp'), 'unregistered');
  for (const file of ['/images/unknown.webp', '/src/assets/uploads/cake.gif', 'https://example.com/cake.webp']) {
    photography.gallery[0].file = file;
    await save();
    await assert.rejects(validateMediaReferences({ root }), /n’est pas un fichier importé ou une image connue/u);
  }
});

test('unsafe paths, symlinks and wrong filename casing cannot hide a missing deployed asset', async t => {
  const { root, photography, save } = await fixture(t);
  await symlink(resolve(root, 'src/assets/uploads/cake.webp'), resolve(root, 'src/assets/uploads/link.webp'));
  for (const file of ['/src/assets/uploads/../cake.webp', '/src/assets/uploads/%2e%2e/cake.webp', '/src/assets/uploads/cake.webp?cache=1', '/src/assets/uploads/link.webp', '/src/assets/uploads/Cake.webp']) {
    photography.gallery[0].file = file;
    await save();
    await assert.rejects(validateMediaReferences({ root }));
  }
});

test('incomplete photo locations fail with an actionable editorial message', async t => {
  const { root, photography, save } = await fixture(t);
  delete photography.collections[0].cover;
  await save();
  await assert.rejects(validateMediaReferences({ root }), /layer-cakes, grande photo : choisissez une photo/u);
  delete photography.gallery;
  await save();
  await assert.rejects(validateMediaReferences({ root }), /emplacements photographiques sont incomplets/u);
});

test('current production content resolves every uploaded and registered image', async () => {
  const result = await validateMediaReferences();
  assert.ok(result.references > 50);
  assert.ok(result.files > 50);
});


test('a gallery-only trash item cannot block publication when its old file is missing, but restoration requires it', async t => {
  const { root, photography, save } = await fixture(t);
  const archived = { file: '/src/assets/uploads/ancienne.webp', label: 'Ancienne réalisation', trashed: true };
  photography.gallery.push(archived);
  await save();
  assert.deepEqual(await validateMediaReferences({ root }), { references: 8, files: 1 });
  archived.trashed = false;
  await save();
  await assert.rejects(validateMediaReferences({ root }), /Galerie, photo 2 « Ancienne réalisation » : fichier introuvable/u);
  await writeFile(resolve(root, 'src/assets/uploads/ancienne.webp'), 'restored');
  assert.deepEqual(await validateMediaReferences({ root }), { references: 8, files: 2 });
});

test('a trashed gallery photo still needs its file whenever a live page uses that photo', async t => {
  const { root, photography, save } = await fixture(t);
  photography.gallery[0].trashed = true;
  await unlink(resolve(root, 'src/assets/uploads/cake.webp'));
  await save();
  await assert.rejects(validateMediaReferences({ root }), error => {
    assert.match(error.message, /Diaporama de l’accueil, photo 1/u);
    assert.match(error.message, /layer-cakes, grande photo/u);
    assert.doesNotMatch(error.message, /Galerie, photo 1/u);
    return true;
  });
});

test('trash status is a strict boolean and cannot bypass safe file paths', async t => {
  const { root, photography, save } = await fixture(t);
  for (const trashed of ['true', 'false', 1, null]) {
    photography.gallery[0].trashed = trashed;
    await save();
    await assert.rejects(validateMediaReferences({ root }), /statut de corbeille doit être vrai ou faux/u);
  }
  photography.gallery[0].trashed = true;
  photography.gallery[0].file = '/src/assets/uploads/../secret.webp';
  await save();
  await assert.rejects(validateMediaReferences({ root }));
});
