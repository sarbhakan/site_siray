// Pure photo-library contract shared by the editor, previews and preSave.
// No credentials, external services or mutations to saved content are involved.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = { globalThis: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../public/admin/photo-gallery.js'), 'utf8'), context);
const api = context.globalThis.SirayPhotoGallery;
const clone = value => JSON.parse(JSON.stringify(value));
const photo = (file, extra = {}) => ({ file, label: 'Gâteau fleuri', category: 'layer-cakes', alt: 'Un gâteau blanc couvert de fleurs', position: '50% 50%', ...extra });
const document = extra => ({ homeSlides: [], homePhotos: {}, collections: [], gallery: [], ...extra });
let checks = 0;
const test = (name, run) => { try { run(); checks++; } catch (error) { error.message = `${name}: ${error.message}`; throw error; } };

test('The seven fixed gallery categories are explicit', () => {
  assert.deepEqual(clone(api.categories), ['layer-cakes', 'bento-cakes', 'mignardises', 'cupcakes', 'brunch-box', 'buffets', 'plateaux']);
});
test('A new named placement joins the gallery without mutating source data', () => {
  const item = photo('blob:https://siray.test/new', { zoom: 1.2 });
  const original = document({ homeSlides: [item] }), before = clone(original);
  const prepared = api.prepare(original);
  assert.deepEqual(clone(original), before);
  assert.deepEqual(clone(prepared.gallery), [item]);
  assert.notEqual(prepared, original); assert.notEqual(prepared.homeSlides[0], item);
});
test('All supported page placements are scanned', () => {
  const original = document({ homeSlides: [photo('/slides.webp')], homePhotos: { maison: photo('/maison.webp') },
    collections: [{ id: 'cakes', title: 'Inchangé', cover: photo('/cover.webp'), detail: photo('/detail.webp'),
      request: photo('/request.webp'), home: photo('/home.webp') }] });
  const prepared = api.prepare(original);
  assert.equal(prepared.gallery.length, 6);
  assert.equal(prepared.collections[0].title, original.collections[0].title);
});
test('Existing gallery caption, category, crop, metadata and order win over a reused placement', () => {
  const a = photo('/a.webp', { label: 'Légende publique', category: 'bento-cakes', position: '20% 80%', zoom: 1.3, futureMetadata: 'conservée' });
  const b = photo('/b.webp');
  const prepared = api.prepare(document({ gallery: [a, b], homeSlides: [photo('/a.webp', { label: 'Nom local', position: '50% 50%', zoom: 2 })] }));
  assert.deepEqual(clone(prepared.gallery), [a, b]);
  assert.equal(prepared.homeSlides[0].zoom, 2);
});
test('Exact paths deduplicate while same caption or basename never merges different files', () => {
  const prepared = api.prepare(document({ gallery: [photo('/one/a.webp'), photo('/one/a.webp')], homeSlides: [photo('/two/a.webp'), photo('/one/a.webp')] }));
  assert.deepEqual(clone(prepared.gallery.map(item => item.file)), ['/one/a.webp', '/two/a.webp']);
});
test('A gallery-only new photograph remains in its original place', () => {
  const original = document({ gallery: [photo('blob:https://siray.test/gallery')] });
  assert.deepEqual(clone(api.prepare(original)), original);
});
test('Replacing a page photo retains its previous file and all following pending choices', () => {
  const a = photo('/a.webp'), b = photo('blob:https://siray.test/b'), c = photo('blob:https://siray.test/c');
  const second = api.archiveReplacement(a, b, document({ gallery: [a] }));
  const third = api.archiveReplacement(second, c, document({ gallery: [a] }));
  assert.deepEqual(clone(third._galleryArchive.map(item => item.file)), [a.file, b.file]);
  const original = document({ gallery: [a], homePhotos: { maison: third } }), before = clone(original);
  const prepared = api.prepare(original);
  assert.deepEqual(clone(prepared.gallery.map(item => item.file)), [a.file, b.file, c.file]);
  assert.ok(!('_galleryArchive' in prepared.homePhotos.maison));
  assert.deepEqual(clone(original), before);
});
test('Returning to a prior pending choice deduplicates its archive but keeps the replaced upload', () => {
  const a = photo('blob:https://siray.test/a'), b = photo('blob:https://siray.test/b');
  const selected = api.archiveReplacement(api.archiveReplacement(a, b, document()), a, document());
  assert.deepEqual(clone(selected._galleryArchive.map(item => item.file)), [b.file]);
  assert.deepEqual(clone(api.prepare(document({ homeSlides: [selected] })).gallery.map(item => item.file)), [b.file, a.file]);
});
test('Replacing a gallery row archives its prior photograph as well', () => {
  const previous = photo('/old.webp'), next = photo('/new.webp');
  const row = api.archiveReplacement(previous, next, document({ gallery: [previous] }));
  const prepared = api.prepare(document({ gallery: [row] }));
  assert.deepEqual(clone(prepared.gallery.map(item => item.file)), [next.file, previous.file]);
  assert.ok(!('_galleryArchive' in prepared.gallery[0]));
});
test('A legacy placement gets archived using known gallery metadata', () => {
  const known = photo('/a.webp');
  const legacy = { file: known.file, alt: '', position: '20% 80%', category: undefined, label: undefined };
  const replacement = api.archiveReplacement(legacy, photo('/b.webp'), document({ gallery: [known] }));
  assert.equal(replacement._galleryArchive[0].label, known.label);
  assert.equal(replacement._galleryArchive[0].alt, known.alt);
  assert.equal(replacement._galleryArchive[0].position, legacy.position);
});
test('Reusing the same source preserves history without archiving the current file twice', () => {
  const a = photo('/a.webp'), old = photo('/old.webp');
  const selected = api.archiveReplacement({ ...a, _galleryArchive: [old] }, { ...a, position: '25% 75%' }, document());
  assert.deepEqual(clone(selected._galleryArchive), [old]);
});
test('Sveltia blob rewriting can resolve every archived upload before the atomic prepare', () => {
  const a = photo('blob:https://siray.test/a'), b = photo('blob:https://siray.test/b');
  const selected = api.archiveReplacement(a, b, document());
  const original = document({ homeSlides: [selected] });
  const rewritten = JSON.parse(JSON.stringify(original), (_key, value) => value === a.file ? '/src/assets/uploads/a.webp'
    : value === b.file ? '/src/assets/uploads/b.webp' : value);
  const prepared = api.prepare(rewritten);
  assert.deepEqual(clone(prepared.gallery.map(item => item.file)), ['/src/assets/uploads/a.webp', '/src/assets/uploads/b.webp']);
  assert.ok(!JSON.stringify(prepared).includes('blob:'));
  assert.ok(!JSON.stringify(prepared).includes('_galleryArchive'));
});
test('Unclassified historical illustrations are excluded from the client gallery', () => {
  const historical = { file: '/images/ingredients.webp', alt: 'Du chocolat', position: '50% 50%' };
  const prepared = api.prepare(document({ homePhotos: { illustration: historical } }));
  assert.equal(prepared.gallery.length, 0);
  assert.deepEqual(clone(prepared.homePhotos.illustration), historical);
});
for (const missing of ['alt', 'category', 'label']) for (const file of ['blob:https://siray.test/a', '/src/assets/uploads/a.webp']) {
  test(`An uploaded ${file} cannot silently skip the gallery without ${missing}`, () => {
    const invalid = { ...photo(file), [missing]: '' };
    assert.throws(() => api.prepare(document({ homeSlides: [invalid] })), /nom, sa catégorie et sa description/);
  });
}
test('A named photo with an unknown category fails before save', () => {
  assert.throws(() => api.prepare(document({ homeSlides: [photo('/a.webp', { category: 'unknown' })] })), /catégorie/);
});
test('A malformed pending archive is never silently discarded', () => {
  for (const archive of ['not an array', [{ file: 'blob:https://siray.test/old' }]]) {
    assert.throws(() => api.prepare(document({ homeSlides: [{ ...photo('/new.webp'), _galleryArchive: archive }] })), /incomplète/);
  }
});
test('Lookup prioritizes gallery metadata then finds current draft archives', () => {
  const saved = photo('/saved.webp', { label: 'Nom public' }), pending = photo('blob:https://siray.test/pending');
  const data = document({ gallery: [saved], homeSlides: [{ ...photo('/saved.webp', { label: 'Nom local' }), _galleryArchive: [pending] }] });
  assert.equal(api.find(data, saved.file).label, saved.label);
  assert.equal(api.find(data, pending.file).label, pending.label);
  assert.equal(api.find(data, ''), undefined);
});
test('Preparation is idempotent and never adds optional crop defaults', () => {
  const a = photo('/a.webp'); delete a.position;
  const first = api.prepare(document({ homeSlides: [a] })), second = api.prepare(first);
  assert.deepEqual(clone(first), clone(second));
  assert.ok(!('position' in second.gallery[0])); assert.ok(!('zoom' in second.gallery[0]));
});
test('Non-photography documents pass through unchanged', () => {
  const data = { title: 'Catalogue' }; assert.equal(api.prepare(data), data);
});
console.log(`${checks} photo-gallery assertions passed.`);
