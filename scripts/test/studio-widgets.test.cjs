// Verify value preservation, custom control behavior and preview content without
// a browser or credentials. Sveltia's own upload pipeline is an integration check.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const repo = path.resolve(__dirname, '../..');
const widgets = {}, previews = {};
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
  useState: initial => [initial, () => {}], useEffect: () => {},
  useImperativeHandle: (ref, get) => { if (ref) ref.current = get(); }, forwardRef: component => component,
};
const sandbox = { globalThis: {}, Intl, Object, Array, Number, String, Error };
vm.runInNewContext(fs.readFileSync(`${repo}/public/admin/studio-widgets.js`, 'utf8'), sandbox);
const api = sandbox.globalThis.SirayStudioWidgets;
api.init({ React, registerFieldType: def => widgets[def.name] = def,
  registerPreviewTemplate: (key, comp) => previews[key] = comp, registerPreviewStyle: () => {} });
let checks = 0;
const test = (message, fn) => { try { fn(); checks++; } catch (error) { error.message = `${message}: ${error.message}`; throw error; } };
const h = api.helpers;
for (const [input, want] of [['50% 65.789%', [50, 65.789]], ['0% 100%', [0, 100]], ['999% 0%', [100, 0]], ['left top', [50, 50]], ['', [50, 50]], [null, [50, 50]]]) {
  test(`position ${input}`, () => assert.equal(JSON.stringify(h.parsePosition(input)), JSON.stringify(want)));
}
for (const bad of ['javascript:alert(1)', 'data:image/svg+xml,foo', '//evil.example/a', '/\\evil.example/a', 'https://example.com/\na', 'https://example.com/ a']) {
  test('URL refused', () => assert.equal(h.safeImageURL(bad), ''));
}
for (const good of ['/images/a.webp', 'blob:https://siraysignature.fr/id', 'https://example.com/a.jpg']) {
  test('URL accepted', () => assert.equal(h.safeImageURL(good), good));
}
test('Resolved asset URL', () => assert.equal(h.safeImageURL('/src/assets/uploads/a.webp', () => ({ url: 'blob:https://site.test/id' })), 'blob:https://site.test/id'));
test('Position precision', () => assert.equal(h.positionString(23, 65.789), '23% 65.789%'));
const field = { get: key => ({ photo_context: 'cover', show_gallery_fields: false })[key] };
const content = name => JSON.parse(fs.readFileSync(`${repo}/src/content/${name}.json`));
const data = content('photography');
const photos = [...data.homeSlides, ...Object.values(data.homePhotos), ...data.collections.flatMap(p => [p.cover, p.detail, p.request, p.home]), ...data.gallery];
function nodes(root) { return !root || typeof root !== 'object' ? [] : Array.isArray(root) ? root.flatMap(nodes) : [root, ...(root.children || []).flatMap(nodes)]; }
function render(node) {
  if (Array.isArray(node)) return node.map(render).flat(Infinity);
  if (!node || typeof node !== 'object') return node;
  if (typeof node.type === 'function') return render(node.type({ ...node.props, children: node.children }));
  return { ...node, children: node.children.map(render).flat(Infinity) };
}
function strings(node) { if (Array.isArray(node)) return node.map(strings).join(' '); if (typeof node === 'string') return node; return !node || typeof node !== 'object' ? '' : (node.children || []).map(strings).join(' '); }
const getAsset = path => ({ url: path });
for (const photo of photos) test('Existing photo shape untouched', () => {
  const before = JSON.stringify(photo), ref = {};
  widgets['siray-photo'].controlComponent({ value: photo, field, forID: 'photo', getAsset,
    pickFile: () => null, onChange: () => { throw Error('render changed data'); } }, ref);
  assert.equal(JSON.stringify(photo), before); assert.equal(ref.current.isValid(), true);
});
(async () => {
  const value = { file: '/images/original.webp', alt: 'Gâteau ivoire', position: '50% 65.789%', retained: 'preserved' }; let next;
  const control = widgets['siray-photo'].controlComponent({ value, field, forID: 'photo', getAsset,
    pickFile: async () => ({ value: 'blob:https://site.test/new', file: {} }), onChange: updated => next = updated }, {});
  test('Horizontal crop preserves vertical precision', () => {
    nodes(control).find(n => n.props.id === 'photo-x').props.onChange({ target: { value: '23' } });
    assert.equal(next.position, '23% 65.789%'); assert.equal(next.file, value.file); assert.equal(next.retained, 'preserved');
  });
  await nodes(control).find(n => n.props.id === 'photo').props.onClick();
  test('Upload preserves metadata and raw blob', () => {
    assert.equal(next.file, 'blob:https://site.test/new'); assert.equal(next.alt, value.alt); assert.equal(next.position, value.position); assert.equal(next.retained, 'preserved');
  });
  for (const value of [{ file: '/images/photo.webp', alt: '' }, { file: '', alt: 'Photo' }]) test('Missing photo/alt rejected', () => {
    const ref = {}; widgets['siray-photo'].controlComponent({ value, field, forID: 'invalid', getAsset, onChange: () => {} }, ref); assert.notEqual(ref.current.isValid(), true);
  });
  const cat = content('catalog'); cat.collections[0].extraSections = [{ title: 'Nouvelle rubrique', text: 'Texte ajouté', items: ['Premier détail'], button: { label: 'Écrire à Siray', href: '/contact/' } }];
  const entry = data => ({ get: key => key === 'data' ? { toJS: () => data } : undefined });
  const catalogueText = strings(render(previews.catalogue({ entry: entry(cat) })));
  for (const expected of ['Mini-burgers', 'Viande, poulet ou poisson.', 'Nouvelle rubrique', 'Écrire à Siray', 'par personne', 'Elegancia']) test(`Preview real text ${expected}`, () => assert.ok(catalogueText.includes(expected)));
  test('Photo preview renders all existing images', () => {
    const output = render(previews.photos({ entry: entry(data), getAsset })); assert.equal(nodes(output).filter(n => n.type === 'img').length, photos.length);
  });
  const pages = content('pages'); pages.home.extraSections = [{ title: 'Rubrique unique', text: 'Contenu unique', button: { label: 'Bouton unique', href: '/contact/' } }];
  const pageText = strings(render(previews.pages({ entry: entry(pages) })));
  test('Extra section shown once', () => assert.equal(pageText.split('Rubrique unique').length - 1, 1));
  test('Page extra button previewed', () => assert.ok(pageText.includes('Bouton unique')));
  console.log(`${checks} assertions passed; ${photos.length} existing photo objects render without data mutation.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
