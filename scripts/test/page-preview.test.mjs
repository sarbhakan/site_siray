import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom', logLevel: 'silent' });
let preview, photography;
try {
  preview = await server.ssrLoadModule('/src/lib/page-preview-model.ts');
  photography = await server.ssrLoadModule('/src/data/photography.ts');
}
finally { await server.close(); }
const draft = () => structuredClone(preview.baselineDrafts);

test('draft prices propagate through the same summaries as the public catalogue without saving content', () => {
  const data = draft();
  const original = JSON.stringify(preview.baselineDrafts);
  data.catalogue.collections.find(item => item.slug === 'cupcakes').tariffs[0].price = 23.5;
  const model = preview.previewModel(data);
  const item = model.catalog.collections.find(item => item.slug === 'cupcakes');
  assert.match(item.priceSummary, /23,5/);
  assert.match(item.tariffs[0].priceLabel, /23,5/);
  assert.equal(JSON.stringify(preview.baselineDrafts), original);
});

test('adding a custom pane produces its navigation, content, list and safe button in one draft', () => {
  const data = draft();
  const item = data.catalogue.collections.find(item => item.slug === 'bento-cakes');
  item.extraSections = [{ title: 'Une attention', text: 'Un texte inédit', items: ['Ruban', 'Message'], button: { label: 'Voir la galerie', href: '/galerie/' } }];
  const result = preview.previewModel(data).catalog.collections.find(item => item.slug === 'bento-cakes');
  assert.equal(result.previewTabs.find(tab => tab.id === 'extra-0').label, 'Une attention');
  assert.equal(result.extraSections[0].panelId, 'extra-0');
  assert.deepEqual(result.extraSections[0].items, ['Ruban', 'Message']);
  assert.equal(result.extraSections[0].button.href, '/galerie/');
});

test('new brunch compositions and prices update their selectors, count and grouped totals', () => {
  const data = draft();
  data.catalogue.brunchBoxes.push({ name: 'Matin nouveau', price: 45, sweet: ['Fruits'], savory: ['Œufs'], drink: 'Orange' });
  const model = preview.previewModel(data);
  const box = model.catalog.brunchBoxes.at(-1);
  assert.match(box.optionLabel, /Matin nouveau.*45/);
  assert.equal(box.index, data.catalogue.brunchBoxes.length - 1);
  assert.match(model.catalog.brunchPriceGroups.find(group => group.price === 45).pricePerPerson, /45.*personne/);
  assert.match(model.catalog.collections.find(item => item.slug === 'brunch-box').priceSummary, /Matin nouveau.*45/);
});

test('gallery preview preserves new asset metadata and valid category while showing the pending photograph', () => {
  const data = draft();
  data.photos.gallery.push({ file: '/src/assets/uploads/nouveau.webp', alt: 'Bento fleuri', label: 'Printemps', category: 'bento-cakes', position: '25% 70%', zoom: 1.4 });
  const photo = preview.previewModel(data).photography.gallery.at(-1);
  assert.equal(photo.categoryLabel, 'Bento cakes');
  assert.equal(photo.file, '/src/assets/uploads/nouveau.webp');
  assert.equal(photo.position, '25% 70%');
  assert.equal(photo.zoom, 1.4);
});

test('binding resolves only explicit draft paths and never traverses object prototypes', () => {
  const model = preview.previewModel(draft());
  assert.equal(preview.previewValue(model, 'catalog.collections.layer-cakes.name'), 'Layer cakes');
  assert.equal(preview.previewValue(model, '.label', { label: 'Nouveau' }), 'Nouveau');
  for (const path of ['__proto__.polluted', 'catalog.constructor', 'catalog.collections.prototype']) assert.equal(preview.previewValue(model, path), undefined);
});

test('image and button sources reject script URLs, controls, credential URLs and foreign blob origins', () => {
  const origin = 'https://siraysignature.fr';
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//evil.example/x', '/%0a/evil', 'https://user:secret@example.com/image', 'https://good.example/\\evil', 'blob:https://evil.example/123']) {
    assert.equal(preview.safePreviewURL(value, origin, true), undefined, value);
  }
  assert.equal(preview.safePreviewURL('blob:https://siraysignature.fr/123', origin, true), 'blob:https://siraysignature.fr/123');
  assert.equal(preview.safePreviewURL('blob:https://siraysignature.fr/123', origin), undefined);
  assert.equal(preview.safePreviewURL('/galerie/', origin), 'https://siraysignature.fr/galerie/');
});


test('actual nested postMessage payload requires the matching parent, origin and frame nonce', () => {
  const trustedParent = {};
  const origin = 'https://siraysignature.fr';
  const nonce = 'siray-test-nonce-0123456789';
  const payload = { kind: 'pages', data: draft().pages, assets: {} };
  const message = { source: trustedParent, origin, data: { type: 'siray-preview-draft', nonce, payload } };
  assert.deepEqual(preview.readPreviewMessage(message, trustedParent, origin, nonce), payload);
  for (const forged of [
    { ...message, source: {} }, { ...message, origin: 'https://evil.example' },
    { ...message, data: { ...message.data, nonce: 'wrong' } },
    { ...message, data: { type: 'siray-preview-draft', nonce, ...payload } },
    { ...message, data: { ...message.data, payload: { ...payload, kind: 'secrets' } } },
  ]) assert.equal(preview.readPreviewMessage(forged, trustedParent, origin, nonce), undefined);
});


test('public gallery filtering hides trash without changing order, source metadata or active page placements', () => {
  const input = [
    { file: '/a.webp', alt: 'A', label: 'Première', category: 'layer-cakes', trashed: true },
    { file: '/b.webp', alt: 'B', label: 'Deuxième', category: 'bento-cakes' },
    { file: '/c.webp', alt: 'C', label: 'Troisième', category: 'cupcakes', trashed: false },
  ];
  const before = structuredClone(input);
  assert.deepEqual(photography.visibleGalleryItems(input).map(photo => photo.file), ['/b.webp', '/c.webp']);
  assert.deepEqual(input, before);
  assert.deepEqual(photography.visibleGalleryItems(input.map(photo => ({ ...photo, trashed: true }))), []);
  for (const trashed of ['true', 1, null]) {
    assert.throws(() => photography.visibleGalleryItems([{ ...input[0], trashed }]), /statut de corbeille/u);
  }
});

test('the complete page preview removes trashed gallery photos and restores them while keeping other uses intact', () => {
  const data = draft();
  const originalGalleryLength = data.photos.gallery.length;
  const baseline = JSON.stringify(preview.baselineDrafts);
  data.photos.gallery[0] = { ...data.photos.gallery[0], file: data.photos.homeSlides[0].file,
    label: 'Réalisation masquée', trashed: true };
  const homeSlides = structuredClone(data.photos.homeSlides);
  const collections = structuredClone(data.photos.collections);
  const hiddenModel = preview.previewModel(data);
  assert.equal(hiddenModel.photography.gallery.length, originalGalleryLength - 1);
  assert.equal(hiddenModel.photography.galleryEmpty, false);
  assert.equal(hiddenModel.photography.gallery.some(photo => photo.label === 'Réalisation masquée'), false);
  assert.deepEqual(hiddenModel.photography.homeSlides, homeSlides);
  assert.deepEqual(hiddenModel.photography.collections, collections);
  assert.equal(data.photos.gallery[0].trashed, true);
  data.photos.gallery[0].trashed = false;
  const restoredModel = preview.previewModel(data);
  assert.equal(restoredModel.photography.gallery.length, originalGalleryLength);
  assert.equal(restoredModel.photography.gallery[0].label, 'Réalisation masquée');
  assert.equal(restoredModel.photography.gallery[0].file, homeSlides[0].file);
  assert.equal(JSON.stringify(preview.baselineDrafts), baseline);
});

test('the preview exposes an empty-gallery state when every photograph is in the trash', () => {
  const data = draft();
  data.photos.gallery = data.photos.gallery.map(photo => ({ ...photo, trashed: true }));
  const model = preview.previewModel(data);
  assert.deepEqual(model.photography.gallery, []);
  assert.equal(model.photography.galleryEmpty, true);
  data.photos.gallery[0].trashed = false;
  assert.equal(preview.previewModel(data).photography.galleryEmpty, false);
});
