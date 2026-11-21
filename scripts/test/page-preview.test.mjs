import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom', logLevel: 'silent' });
let preview;
try { preview = await server.ssrLoadModule('/src/lib/page-preview-model.ts'); }
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
