import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { createServer } from 'vite';

const source = await readFile(new URL('../../public/admin/content-validation.js', import.meta.url), 'utf8');
const window = {};
runInNewContext(source, { window, URL, WeakSet });
const client = window.SirayContentValidation;
const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom', logLevel: 'silent' });
let validateOnBuild;
try { ({ validateExtraSections: validateOnBuild } = await server.ssrLoadModule('/src/data/site.ts')); }
finally { await server.close(); }

const section = (overrides = {}) => ({ title: 'Votre décor', text: 'Partagez vos inspirations.', ...overrides });
const asJSON = (value) => JSON.parse(JSON.stringify(value));
const capture = () => {
  const hooks = [];
  const CMS = { registerEventListener: (hook) => hooks.push(hook) };
  client.init(CMS);
  return { CMS, hooks, save: hooks[0].handler };
};
const entry = (data, collection = 'catalogue', path = 'src/content/catalog.json') => ({ get: (key) => ({ data: { toJS: () => data }, collection, path })[key] });

test('registers one preSave listener per CMS and never changes valid content', () => {
  const { CMS, hooks, save } = capture();
  client.init(CMS);
  assert.equal(hooks.length, 1);
  assert.equal(hooks[0].name, 'preSave');
  const data = { collections: [{ name: 'Layer cakes', extraSections: [section({ button: {}, items: [] })] }], untouched: { text: 'Fezalia', array: [null, ''] } };
  const before = JSON.stringify(data);
  assert.equal(save({ entry: entry(data) }), undefined);
  assert.equal(JSON.stringify(data), before);
});

test('rejects an incomplete or unsafe button before a CMS save', () => {
  const { save } = capture();
  assert.throws(() => save({ entry: entry({ collections: [{ name: 'Bento cakes', extraSections: [section({ button: { href: '/contact/' } })] }] }) }), /texte du bouton/u);
  assert.throws(() => save({ entry: entry({ collections: [{ name: 'Bento cakes', extraSections: [section({ button: { label: 'Écrire', href: 'javascript:alert(1)' } })] }] }) }), /destination du bouton/u);
});

test('validates a catalogue identified by its path and leaves other files alone', () => {
  const { save } = capture();
  assert.throws(() => save({ entry: entry({ collections: [{ extraSections: [section({ text: '' })] }] }, 'other', '/src/content/catalog.json') }), /texte/u);
  assert.equal(save({ entry: entry({ unrelated: true }, 'photos', 'src/content/photography.json') }), undefined);
});

test('handles plain entry objects and optional empty arrays or objects', () => {
  const { save } = capture();
  assert.equal(save({ entry: { collection: 'catalogue', data: { collections: [{ extraSections: [] }, { extraSections: null }, { extraSections: [section({ button: { label: '', href: '' }, items: null })] }] } } }), undefined);
});

test('fails closed if catalogue data is unavailable', () => {
  const { save } = capture();
  assert.throws(() => save({ entry: entry(undefined) }), /catalogue/u);
  assert.throws(() => save({ entry: entry({ collections: null }) }), /catalogue/u);
  assert.throws(() => save({ entry: entry({ collections: [null] }) }), /prestation/u);
});

const cases = [
  undefined, null, [], {}, [null], [section()], [section({ items: [] })], [section({ button: {} })],
  [section({ title: '' })], [section({ title: 'a'.repeat(120), text: 'a'.repeat(4000) })],
  [section({ title: 'a'.repeat(121) })], [section({ text: 'a'.repeat(4001) })],
  [section({ items: Array(12).fill('a'.repeat(300)) })], [section({ items: Array(13).fill('a') })],
  [section({ items: ['a'.repeat(301)] })], [section({ items: [''] })], [section({ items: 'text' })],
  Array.from({ length: 12 }, () => section()), Array.from({ length: 13 }, () => section()),
  [section({ button: { label: 'Découvrir' } })], [section({ button: { href: '/contact/' } })],
  [section({ button: { label: 'a'.repeat(81), href: '/contact/' } })],
  [section({ button: { label: 'a'.repeat(80), href: `/${'a'.repeat(2047)}` } })],
  [section({ button: { label: 'Découvrir', href: `/${'a'.repeat(2048)}` } })],
  ...['/contact/#allergies', 'https://www.instagram.com/siraysignature/', 'HTTPS://EXAMPLE.COM',
    'javascript:alert(1)', 'data:text/html,test', 'http://example.com', '//example.com', '///example.com',
    '/\\example.com', '\\example.com', 'https://user:pass@example.com', 'https://user@example.com',
    'https:example.com', '/%5cexample.com', '/%0aexample.com', '/%00test', 'https://example.com/\nnext',
    '\nhttps://example.com', '\thttps://example.com', '/page\rnext', '/page\u007fnext', '/page\u0085next',
    '/page%zz', '#formats', 'contact/', '', '   ', '\n',
  ].map((href) => [section({ button: { label: 'Découvrir', href } })]),
];

for (const [index, value] of cases.entries()) {
  test(`client validation matches the build contract: case ${index + 1}`, () => {
    const result = (validate) => {
      try { return { accepted: true, value: asJSON(validate(value)) }; }
      catch { return { accepted: false }; }
    };
    assert.deepEqual(result(client.validateExtraSections), result(validateOnBuild));
  });
}
