import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom', logLevel: 'silent' });
let crop;
try { crop = await server.ssrLoadModule('/src/lib/photo-crop.ts'); }
finally { await server.close(); }
const window = {};
runInNewContext(await readFile(new URL('../../public/admin/photo-gallery.js', import.meta.url), 'utf8'), { window, URL });
runInNewContext(await readFile(new URL('../../public/admin/content-validation.js', import.meta.url), 'utf8'), { window, URL, WeakSet });
const client = window.SirayContentValidation;
const photography = JSON.parse(await readFile(new URL('../../src/content/photography.json', import.meta.url), 'utf8'));
const copy = value => structuredClone(value);

test('old photos keep their original scale and stable focal point', () => {
  assert.equal(crop.validatePhotoZoom(undefined), 1);
  assert.equal(crop.photoCropStyle('50% 65.789%'), 'object-position:50% 65.789%;transform-origin:50% 65.789%;scale:1');
  assert.equal(crop.photoCropStyle('23% 70%', 1.5), 'object-position:23% 70%;transform-origin:23% 70%;scale:1.5');
});

test('generated style never accepts arbitrary CSS from focal point data', () => {
  for (const value of ['50% 50%;color:red', 'url(https://example.com)', null, {}, '-1% 50%']) {
    assert.equal(crop.photoPosition(value), '50% 50%');
  }
  assert.equal(crop.photoPosition('999% 100%'), '100% 100%');
});

for (const value of [undefined, 1, 1.01, 1.5, 2, 0, 0.99, 2.01, Infinity, NaN, null, '', '1.5', {}, []]) {
  test(`browser and build enforce the same zoom range: ${String(value)}`, () => {
    const result = validate => {
      try { return { ok: true, value: validate(value) }; }
      catch { return { ok: false }; }
    };
    assert.deepEqual(result(client.validatePhotoZoom), result(crop.validatePhotoZoom));
  });
}

test('existing photographs validate without adding zoom or changing their contents', () => {
  const before = JSON.stringify(photography);
  client.validatePhotography(photography);
  assert.equal(JSON.stringify(photography), before);
});

test('preSave rejects invalid zoom for every kind of editable photo before commit', () => {
  let hook;
  client.init({ registerEventListener: value => { hook = value; } });
  const locations = [
    data => data.homeSlides[0], data => Object.values(data.homePhotos)[0],
    data => data.gallery[0],
    ...['cover', 'detail', 'request', 'home'].map(key => data => data.collections[0][key]),
  ];
  for (const photo of locations) {
    const valid = copy(photography); photo(valid).zoom = 1.5;
    const before = JSON.stringify(valid);
    hook.handler({ entry: { collection: 'photos', data: valid } });
    assert.equal(JSON.stringify(valid), before);
    photo(valid).zoom = 2.01;
    assert.throws(() => hook.handler({ entry: { collection: 'photos', data: valid } }), /entre 1 et 2/u);
    assert.throws(() => hook.handler({ entry: { path: '/src/content/photography.json', data: valid } }), /entre 1 et 2/u);
  }
});

test('public crop scaling is clipped and does not overwrite hover transforms', async () => {
  const component = await readFile(new URL('../../src/components/Photo.astro', import.meta.url), 'utf8');
  assert.ok(component.includes('magnification > 1'));
  assert.ok(component.includes('overflow: hidden'));
  assert.ok(component.includes('photoCropStyle(position || media.position, magnification)'));
  assert.ok(!crop.photoCropStyle('50% 50%', 2).includes('transform:'));
});
