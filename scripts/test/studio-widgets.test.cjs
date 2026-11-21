// Verify value preservation, photo controls and the native field-preview bridge
// without a browser or credentials. Real Sveltia upload/save is an integration check.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const repo = path.resolve(__dirname, '../..');
const widgets = {};
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
  useState: initial => [initial, () => {}], useEffect: () => {}, useRef: initial => ({current:initial}),
  useImperativeHandle: (ref, get) => { if (ref) ref.current = get(); }, forwardRef: component => component,
};
const sandbox = { globalThis: {}, Intl, Object, Array, Number, String, Error };
vm.runInNewContext(fs.readFileSync(`${repo}/public/admin/studio-widgets.js`, 'utf8'), sandbox);
const api = sandbox.globalThis.SirayStudioWidgets;
// Sveltia renders field previews directly when no collection template or custom
// preview stylesheet is registered. This must also work without either API.
api.init({ React, registerFieldType: def => widgets[def.name] = def });
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
for (const photo of photos) test('Native photo preview renders the existing object', () => {
  const before = JSON.stringify(photo);
  const output = render(widgets['siray-photo'].previewComponent({ value: photo, field, getAsset }));
  const images = nodes(output).filter(node => node.type === 'img');
  assert.equal(images.length, 1);
  assert.equal(images[0].props.src, photo.file);
  assert.equal(images[0].props.alt, photo.alt);
  assert.equal(images[0].props.style.objectPosition, photo.position || '50% 50%');
  assert.equal(nodes(output).filter(node => node.type === 'iframe').length, 0);
  if (photo.label) assert.ok(strings(output).includes(photo.label));
  assert.equal(JSON.stringify(photo), before);
});
(async () => {
  const value = { file: '/images/original.webp', alt: 'Gâteau ivoire', position: '50% 65.789%', retained: 'preserved' }; let next;
  let pickerOptions;
  const control = widgets['siray-photo'].controlComponent({ value, field, forID: 'photo', getAsset,
    pickFile: async options => { pickerOptions = options; return { value: 'blob:https://site.test/new', file: {} }; }, onChange: updated => next = updated }, {});
  test('Horizontal crop preserves vertical precision', () => {
    nodes(control).find(n => n.props.id === 'photo-x').props.onChange({ target: { value: '23' } });
    assert.equal(next.position, '23% 65.789%'); assert.equal(next.file, value.file); assert.equal(next.retained, 'preserved');
  });
  await nodes(control).find(n => n.props.id === 'photo').props.onClick();
  test('Upload preserves metadata and raw blob', () => {
    assert.equal(next.file, 'blob:https://site.test/new'); assert.equal(next.alt, value.alt); assert.equal(next.position, '23% 65.789%'); assert.equal(next.retained, 'preserved');
  });
  test('Picker keeps the official single-image pipeline and refuses arbitrary URL entry', () => {
    assert.equal(pickerOptions.kind, 'image'); assert.equal(pickerOptions.multiple, false); assert.equal(pickerOptions.allowURL, false);
  });
  test('Crop controls expose keyboard-compatible ranges', () => {
    for (const axis of ['x', 'y']) {
      const input = nodes(control).find(n => n.props.id === `photo-${axis}`);
      assert.equal(input.type, 'input'); assert.equal(input.props.type, 'range');
      assert.equal(input.props.min, 0); assert.equal(input.props.max, 100);
      assert.equal(input.props.step, 1); assert.ok(input.props['aria-valuetext'].includes('pour cent'));
    }
  });
  test('Every range reacts to input before release, even before the CMS sends new props', () => {
    nodes(control).find(n => n.props.id === 'photo-y').props.onInput({ currentTarget: { value: '73' } });
    assert.equal(next.position, '23% 73%');
    nodes(control).find(n => n.props.id === 'photo-zoom').props.onInput({ currentTarget: { value: '1.4' } });
    assert.equal(next.zoom, 1.4); assert.equal(next.position, '23% 73%');
    assert.equal(next.retained, 'preserved');
  });
  test('Reset removes zoom and restores both axes together', () => {
    nodes(control).find(n => n.type === 'button' && strings(n) === 'Réinitialiser le cadrage').props.onClick();
    assert.equal(next.position, '50% 50%'); assert.equal(next.zoom, 1);
    assert.equal(next.retained, 'preserved');
  });
  test('Preview renders the same optional magnification as the public site', () => {
    const preview = render(widgets['siray-photo'].previewComponent({ value: {...value,zoom:1.4}, field, getAsset }));
    const image = nodes(preview).find(n => n.type === 'img');
    // React 18 appends px to an unknown numeric CSS property; scale must be a string.
    assert.equal(image.props.style.scale, '1.4');
    assert.equal(image.props.style.transformOrigin, value.position);
  });
  test('An exact-ratio original has no movable axis until zoomed', () => {
    const full = h.cropWindow(1200,1600,3/4);
    assert.equal(full.width, 100); assert.equal(full.height, 100);
    assert.equal(full.horizontal, false); assert.equal(full.vertical, false);
    const close = h.cropWindow(1200,1600,3/4,'50% 50%',1.5);
    assert.ok(close.horizontal && close.vertical);
    assert.ok(Math.abs(close.width - 100/1.5) < .000001);
    assert.ok(Math.abs(close.left - (100-close.width)/2) < .000001);
  });
  test('Crop rectangle reaches both edges and never leaves the original', () => {
    for (const [w,hh] of [[1200,1600],[1320,2346],[2400,1000]]) for (const ratio of [3/4,4/5,4/3,1,16/9]) {
      for (const zoom of [1,1.5,2]) for (const position of ['0% 0%','50% 50%','100% 100%']) {
        const rect=h.cropWindow(w,hh,ratio,position,zoom);
        assert.ok(rect.left >= 0 && rect.top >= 0);
        assert.ok(rect.left + rect.width <= 100.00001 && rect.top + rect.height <= 100.00001);
        assert.ok(Math.abs((w*rect.width)/(hh*rect.height)-ratio) < .000001);
        if(position==='100% 100%') {
          assert.ok(Math.abs(rect.left+rect.width-100) < .000001);
          assert.ok(Math.abs(rect.top+rect.height-100) < .000001);
        }
      }
    }
    assert.equal(h.cropWindow(0,100,1), null);
    assert.equal(h.cropWindow(10,100,Infinity), null);
  });
  for (const value of [{ file: '/images/photo.webp', alt: '' }, { file: '', alt: 'Photo' }]) test('Missing photo/alt rejected', () => {
    const ref = {}; widgets['siray-photo'].controlComponent({ value, field, forID: 'invalid', getAsset, onChange: () => {} }, ref); assert.notEqual(ref.current.isValid(), true);
  });
  const galleryField = { get: key => ({ photo_context: 'gallery', show_gallery_fields: true })[key] };
  for (const value of [
    { file: '/images/photo.webp', alt: 'Photo', label: '', category: 'layer-cakes' },
    { file: '/images/photo.webp', alt: 'Photo', label: 'Gâteau', category: 'unknown' },
  ]) test('Gallery requires visible caption and valid category', () => {
    const ref = {}; widgets['siray-photo'].controlComponent({ value, field: galleryField, forID: 'gallery', getAsset, onChange: () => {} }, ref);
    assert.notEqual(ref.current.isValid(), true);
  });
  test('Collapsed summary includes a photo and visible label', () => {
    const output = render(widgets['siray-photo'].summaryComponent({ value: { ...value, label: 'Un gâteau fleuri' }, getAsset }));
    assert.equal(nodes(output).filter(n => n.type === 'img').length, 1);
    assert.ok(strings(output).includes('Un gâteau fleuri'));
  });
  test('Empty preview provides an understandable placeholder', () => {
    const output = render(widgets['siray-photo'].previewComponent({ value: {}, field, getAsset }));
    assert.equal(nodes(output).filter(n => n.type === 'img').length, 0);
    assert.ok(strings(output).includes('Choisissez une photographie.'));
  });
  let cancellationChanged = false;
  const cancelledControl = widgets['siray-photo'].controlComponent({ value, field, forID: 'cancel', getAsset,
    pickFile: async () => null, onChange: () => cancellationChanged = true }, {});
  await nodes(cancelledControl).find(n => n.props.id === 'cancel').props.onClick();
  test('Cancelling the picker leaves the saved photo untouched', () => assert.equal(cancellationChanged, false));
  console.log(`${checks} assertions passed; ${photos.length} existing photo controls and native previews render without data mutation.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
