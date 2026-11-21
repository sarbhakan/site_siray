const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const globalThis = {};
const context = { globalThis, URL };
for (const file of ['photo-gallery.js', 'studio-widgets.js', 'page-preview.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'public/admin', file), 'utf8'), context);
const api = globalThis.SirayPagePreview;
const json = value => JSON.parse(JSON.stringify(value));
const photo = { file: 'blob:https://siray.test/photo', label: 'Le gâteau fleuri', alt: 'Gâteau ivoire et fleurs roses', category: 'layer-cakes', position: '50% 70%', zoom: 1.2 };
const entry = data => ({ get: key => key === 'data' ? { toJS: () => data } : undefined, token: 'must-not-be-sent', metadata: { private: true } });

test('all twelve complete visitor pages can be selected and arbitrary routes cannot', () => {
  assert.equal(api.views.length, 12);
  for (const [view] of api.views) assert.equal(api.validView(view), true);
  for (const view of ['admin', '../', '__proto__', 'https://bad.test', '', null]) assert.equal(api.validView(view), false);
});
test('only current content and resolved assets enter the preview, never entry credentials', () => {
  const data = { homeSlides: [photo], collections: [], homePhotos: {}, gallery: [] };
  const before = JSON.stringify(data);
  const result = api.snapshot(entry(data), 'photos', file => ({ url: file }));
  assert.deepEqual(Object.keys(result).sort(), ['assets', 'data', 'kind']);
  assert.equal(JSON.stringify(result).includes('must-not-be-sent'), false);
  assert.equal(result.assets[photo.file], photo.file);
  assert.deepEqual(json(result.data.gallery), [photo]);
  assert.equal(JSON.stringify(data), before);
});
test('preview reflects pending archives without mutating the CMS draft', () => {
  const next = { ...photo, file: '/src/assets/uploads/new.webp', _galleryArchive: [photo] };
  const data = { homeSlides: [next], collections: [], homePhotos: {}, gallery: [] };
  const result = api.snapshot(entry(data), 'photos', file => ({ url: file }));
  assert.deepEqual(json(result.data.gallery.map(p => p.file)), [photo.file, next.file]);
  assert.equal(result.data.homeSlides[0]._galleryArchive, undefined);
  assert.equal(data.homeSlides[0]._galleryArchive.length, 1);
});
test('catalogue and text changes have no asset lookup or content writes', () => {
  const data = { text: '<script>alert(1)</script>', price: 123 };
  for (const kind of ['catalogue', 'pages']) {
    const result = api.snapshot(entry(data), kind, () => { throw Error('unexpected asset call'); });
    assert.deepEqual(json(result), { kind, data, assets: {} });
  }
});
test('incomplete named photo cannot silently vanish from the gallery preview', () => {
  assert.throws(() => api.snapshot(entry({ homeSlides: [{ ...photo, category: '' }], collections: [], homePhotos: {}, gallery: [] }), 'photos'), /catégorie/u);
});
test('executable URLs cannot be passed as preview images', () => {
  const data = { homeSlides: [photo], collections: [], homePhotos: {}, gallery: [] };
  const result = api.snapshot(entry(data), 'photos', () => ({ url: 'javascript:alert(1)' }));
  assert.deepEqual(json(result.assets), {});
});
test('preview field uses the public read-only entry API without onChange', () => {
  const fields = [];
  api.init({ React: {}, registerFieldType: field => fields.push(field) });
  assert.equal(fields[0].name, 'siray-page-preview');
  assert.equal(typeof fields[0].controlComponent, 'function');
});
