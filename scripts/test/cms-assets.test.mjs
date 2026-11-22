import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = path => new URL(`../../${path}`, import.meta.url);
const config = JSON.parse(await readFile(projectFile('public/admin/config.json'), 'utf8'));
const uploadPath = '/src/assets/uploads';
const clean = path => path.replace(/^\/+|\/+$/gu, '');

// These are configuration contracts. The real pinned Sveltia UI is checked
// separately; reproducing its folder or permission functions here would not
// prove that uploads and the Delete action behave correctly in the browser.
test('the mandatory global media folder is the real, natively protected CMS directory', async () => {
  assert.equal(config.media_folder, '/public/admin');
  assert.equal(config.public_folder, '/admin');
  assert.ok((await stat(projectFile('public/admin/editeur/index.html'))).isFile());
  assert.ok((await stat(projectFile('public/admin/config.json'))).isFile());
});

test('photograph imports have their own writable collection folder and keep the existing public paths', () => {
  const photos = config.collections.find(collection => collection.name === 'photos');
  assert.ok(photos, 'the editable photograph collection is present');
  assert.notEqual(config.readonly, true);
  assert.notEqual(photos.readonly, true);
  assert.equal(photos.media_folder, uploadPath);
  assert.equal(photos.public_folder, uploadPath);
  assert.equal(photos.files.length, 1);
  assert.notEqual(photos.files[0].readonly, true);
  assert.equal(photos.files[0].file, 'src/content/photography.json');

  let count = 0;
  function inspect(value, collectionName) {
    if (!value || typeof value !== 'object') return;
    if (value.widget === 'siray-photo') {
      count++;
      assert.equal(collectionName, 'photos', 'photo controls must inherit the photograph upload folder');
      assert.equal(value.media_folder, undefined, 'a field must not override the protected upload location');
      assert.equal(value.public_folder, undefined);
    }
    Object.values(value).forEach(child => inspect(child, collectionName));
  }
  config.collections.forEach(collection => inspect(collection, collection.name));
  assert.ok(count > 10, 'all photo controls are covered, including nested gallery controls');
});

test('gallery edits use the reversible trash control and accept an empty gallery', () => {
  const photos = config.collections.find(collection => collection.name === 'photos');
  const gallery = photos.files[0].fields.find(field => field.name === 'gallery');
  assert.equal(gallery.widget, 'siray-gallery');
  assert.equal(gallery.required, false);
  assert.equal(gallery.min, undefined);
  assert.equal(gallery.media_folder, undefined);
  assert.equal(gallery.public_folder, undefined);
});

test('saved photographs keep a readonly alias which Sveltia cannot deduplicate with the global folder', () => {
  for (const [name, internal, publicPath] of [
    ['photos-conservees', uploadPath, uploadPath],
    ['photos-actuelles', '/public/images', '/images'],
  ]) {
    const alias = config.asset_collections.find(collection => collection.name === name);
    assert.ok(alias, `${name} is configured`);
    assert.equal(alias.readonly, true);
    assert.equal(alias.media_folder, internal);
    assert.equal(alias.public_folder, publicPath);
    // Sveltia 0.270 drops a collection whose normalized internal AND public
    // paths both equal the global folder. This guards the regression found
    // during the production check of the original alias configuration.
    assert.equal(clean(alias.media_folder) === clean(config.media_folder)
      && clean(alias.public_folder) === clean(config.public_folder), false);
  }
});

test('moving the global media folder preserves image preparation and repository scope', () => {
  assert.deepEqual(config.media_libraries.all.transformations.raster_image,
    { format: 'webp', quality: 94, width: 2560, height: 2560 });
  assert.equal(config.media_libraries.all.max_file_size, 20971520);
  assert.equal(config.backend.repo, 'sarbhakan/site_siray');
  assert.equal(config.backend.branch, 'main');
  assert.deepEqual(config.backend.auth_methods, ['oauth']);
});
